[chess-analysis-api](https://www.npmjs.com/package/chess-analysis-api)

> chess engine that consume [lichess API](https://lichess.org/api) and [wasm of stockfish](https://www.npmjs.com/package/stockfish) for purpose a chess engine with hight level interface.


### installation

`npm install chess-analysis-api`

or with *yarn*

`yarn add chess-analysis-api`

### Usage

## ES6 Syntax

```js

import {chessAnalysisApi} from 'chess-analysis-api';


chessAnalysisApi.getAnalysis({

  // <https://en.wikipedia.org/wiki/Notation_Forsyth-Edwards>
  fen: "r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",

  // calcul depth default=7
  depth: 12,

  // number options move should calcul
  multipv: 2
})
.then((result) => {

  console.log(result);
  // ...
})
.catch(error => {

  console.error(error);
  throw new Error(error.message);

  // ...
});

```

### How this work

this package consume multiple providers:

- [lichess API opening](https://lichess.org/api#tag/Opening-Explorer)

- [lichess API cloud eval](https://lichess.org/api#operation/apiCloudEval)

- [WASM stockfish](https://www.npmjs.com/package/stockfish)

And with a *manager*, the package calls for the best providers according to the FEN position,
for sample if the FEN position indicates **less than 10 moves** played, the *manager* will call the provider of the *openings*.
But if the FEN position indicates **more than 35 moves** already played the *manager* will not report the opening providers,
nor the cloud assessment providers *(because the cloud assessment providers only give results from their cache)*
and call directly the stockfish provider.
