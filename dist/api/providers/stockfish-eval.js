"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockfishEval = exports.getBestLines = exports.parseLineInfo = void 0;
var constants_1 = require("./../constants");
var STOCKFISH = require('stockfish');
/** @see /test/stockfish-parse-line-info.test.ts */
function parseLineInfo(data) {
    var dataArray = data.trim().split(' ');
    var entry = {
        moves: [],
        depth: NaN,
        multipv: NaN,
        score: {
            type: "mate",
            value: NaN
        }
    };
    var isIntoMove = false;
    ["depth", "multipv", "score", "pv"].forEach(function (marker) {
        dataArray.forEach(function (sentence, index) {
            sentence = sentence.trim();
            if (!isIntoMove) {
                if (sentence == marker) {
                    if (marker === "depth" || marker === "multipv") {
                        if (marker === "depth") {
                            entry.depth = parseFloat(dataArray[index + 1]);
                        }
                        else {
                            entry.multipv = parseFloat(dataArray[index + 1].trim());
                        }
                    }
                    else {
                        if (marker === "score") {
                            entry.score = {
                                type: dataArray[index + 1].trim(),
                                value: parseFloat(dataArray[index + 2])
                            };
                        }
                        else { // pv
                            isIntoMove = true;
                        }
                    }
                }
            }
            else {
                if (constants_1.PATTERN_UCI_MOVE.test(sentence)) {
                    entry.moves.push(sentence);
                }
            }
        });
    });
    return entry;
}
exports.parseLineInfo = parseLineInfo;
function getBestLines(entries) {
    var bestLines = [];
    entries.forEach(function (lines) {
        bestLines.push(lines.pop());
    });
    return bestLines;
}
exports.getBestLines = getBestLines;
// should be instanciate single time
var engine = STOCKFISH();
function stockfishEval(params) {
    return new Promise(function (resolve, reject) {
        engine.postMessage('uci');
        var lines = [];
        engine.onmessage = function (data) {
            if (data === "uciok") {
                engine.postMessage("position fen ".concat(params.fen));
                engine.postMessage("setoption name multipv value ".concat(params.multipv));
                engine.postMessage('isready');
            }
            else {
                if (data === "readyok") {
                    engine.postMessage("go depth ".concat(params.depth));
                }
                else if (data.startsWith('info')) {
                    var entry = parseLineInfo(data);
                    if (lines[entry.multipv - 1] instanceof Array) {
                        lines[entry.multipv - 1].push(entry);
                    }
                    else {
                        lines.push([]);
                        lines[entry.multipv - 1].push(entry);
                    }
                }
            }
            if (data.startsWith('bestmove')) {
                engine.postMessage('quit');
                resolve({
                    depth: params.depth || 1,
                    multipv: params.multipv || 1,
                    fen: params.fen,
                    lines: getBestLines(lines)
                });
            }
        };
    });
}
exports.stockfishEval = stockfishEval;
;
//# sourceMappingURL=stockfish-eval.js.map