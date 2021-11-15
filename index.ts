import getAnalysis from './api/manager-providers';
import {lichessCloudEval} from './api/providers/lichess-cloud-eval';
import {lichessOpening} from './api/providers/lichess-opening';
import {stockfishEval} from './api/providers/stockfish-eval';
import normalize, { AnalysisOutputType } from './api/normalizer';
import { PROVIDERS } from './api/constants';

export const chessAnalysisApi = {
  getAnalysis: (params: {
    fen: string,
    multipv?: number,
    depth?: number,
    excludes?: PROVIDERS[]
  }): Promise<AnalysisOutputType> => {
    return new Promise<AnalysisOutputType>((
      resolve: (data: AnalysisOutputType) => void,
      reject: (reason: any) => void
    ): void => {
      getAnalysis(params)
      .then(result => resolve(normalize(result)))
      .catch(reject);
    });
  },
  providers: {
    lichessCloud: lichessCloudEval,
    lichessOpening,
    stockfish: stockfishEval
  },
};

export {PROVIDERS};
