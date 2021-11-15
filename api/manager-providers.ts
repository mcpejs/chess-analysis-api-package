import {lichessOpening} from './providers/lichess-opening';
import {lichessCloudEval} from './providers/lichess-cloud-eval';
import {stockfishEval} from './providers/stockfish-eval';
import {Chess, ChessInstance} from 'chess.js';
import {
  DEFAULT_DEPTH,
  MIN_DEPTH,
  MAX_DEPTH,
  DEFAULT_MULTI_PV,
  MIN_MULTI_PV,
  MAX_MULTI_PV,
  PROVIDERS
} from './constants';

type ParamsProviderFunction = {
  fen: string,
  multiPv?: number,
  depth?: number
}

type ProviderFunction = ((params: ParamsProviderFunction) => Promise<any>) | null;

function clamp(value: number, min: number, max: number) {
  if(value > max) {
    return max;
  } else if(value < min) {
    return min;
  }

  return value;
}

function getResult(
  providers: ProviderFunction[],
  params: ParamsProviderFunction,

  originalResolve?: (data: any) => void,
  originalReject?: (reason: any) => void
) {

  const currentProvider = providers[0];

  return new Promise((
    resolve: (data: any) => void,
    reject: (reason: any) => void
  ): void => {

    const workerCallback: {
      resolve: (data: any) => void,
      reject: (reason: any) => void
    } = {
      resolve: originalResolve || resolve,
      reject: originalReject || reject
    };

    if(currentProvider == null) {
      // provider has been skiped
      providers.shift();
      getResult(
        providers,
        params,

        workerCallback.resolve,
        workerCallback.reject
      );
    } else {
      currentProvider(params)
      .then((result: any) => {
        workerCallback.resolve({
          result,
          providerName: currentProvider.name // provider function name
        });
      })
      .catch((error) => {
        if(providers.length > 1) {
          providers.shift();
          getResult(
            providers,
            params,
  
            workerCallback.resolve,
            workerCallback.reject
          );
        } else {
          workerCallback.reject({
            errorLastProvider: error,
            message: "all providers not available"
          });
        }
      });
    }

  });


}

export default function getAnalysis(params: {
  fen: string,
  multipv?: number,
  depth?: number,
  excludes?: PROVIDERS[]
}): Promise<any> {

  // fix optionals params
  params.multipv = clamp(params.multipv || DEFAULT_MULTI_PV, MIN_MULTI_PV, MAX_MULTI_PV);
  params.depth = clamp(params.depth || DEFAULT_DEPTH, MIN_DEPTH, MAX_DEPTH);

  const chessReferee: ChessInstance = new Chess(params.fen);

  const isValidFen: boolean = chessReferee.validate_fen(params.fen).valid;

  if(!isValidFen) {
    throw new Error(`FEN is not valid, analysis has been aborted`);
  }

  if(chessReferee.game_over()) {
    throw new Error(`FEN position is already resolve`);
  }

  const countPlayedMoves: number = parseInt((params.fen.split(' ').pop() as string));

  let providersOrder: ProviderFunction[] = [];

  const providers = {
    lichessOpening: (params.excludes?.includes(PROVIDERS.LICHESS_BOOK) ? null: lichessOpening as ProviderFunction),
    lichessCloudEval: (params.excludes?.includes(PROVIDERS.LICHESS_CLOUD_EVAL) ? null: lichessCloudEval as ProviderFunction),
    stockfishEval: (params.excludes?.includes(PROVIDERS.STOCKFISH) ? null: stockfishEval as ProviderFunction)
  }

  if(countPlayedMoves < 15) {
    // [lichessOpening, lichessCloudEval, stockfishEval]
    providersOrder = [
      providers.lichessOpening,
      providers.lichessCloudEval,
      providers.stockfishEval
    ];

  } else if(countPlayedMoves < 35) {
    // [lichessCloudEval, stockfishEval]
    providersOrder = [
      providers.lichessCloudEval,
      providers.stockfishEval
    ];
  } else {
    // stockfishEval
    providersOrder = [
      providers.stockfishEval
    ];
  }

  return getResult(providersOrder, params);
}
