"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROVIDERS = exports.DEFAULT_DEPTH = exports.MAX_DEPTH = exports.MIN_DEPTH = exports.DEFAULT_MULTI_PV = exports.MAX_MULTI_PV = exports.MIN_MULTI_PV = exports.PATTERN_UCI_MOVE = exports.LICHESS_CLOUD_EVAL_URL = exports.LICHESS_OPENING_URL = void 0;
exports.LICHESS_OPENING_URL = "https://explorer.lichess.ovh/master";
exports.LICHESS_CLOUD_EVAL_URL = "https://lichess.org/api/cloud-eval";
exports.PATTERN_UCI_MOVE = /^((a|b|c|d|e|f|g|h)(1|2|3|4|5|6|7|8)){2}(n|b|r|q)?$/;
exports.MIN_MULTI_PV = 1;
exports.MAX_MULTI_PV = 20;
exports.DEFAULT_MULTI_PV = exports.MIN_MULTI_PV;
exports.MIN_DEPTH = 2;
exports.MAX_DEPTH = 60;
exports.DEFAULT_DEPTH = 8;
var PROVIDERS;
(function (PROVIDERS) {
    PROVIDERS[PROVIDERS["LICHESS_BOOK"] = 0] = "LICHESS_BOOK";
    PROVIDERS[PROVIDERS["LICHESS_CLOUD_EVAL"] = 1] = "LICHESS_CLOUD_EVAL";
    PROVIDERS[PROVIDERS["STOCKFISH"] = 2] = "STOCKFISH";
})(PROVIDERS = exports.PROVIDERS || (exports.PROVIDERS = {}));
;
// https://explorer.lichess.ovh/master?fen=rnbqkbnr/ppp1pppp/8/3p4/8/5P2/PPPPP1PP/RNBQKBNR w KQkq - 0 2
//# sourceMappingURL=constants.js.map