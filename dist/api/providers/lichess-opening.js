"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lichessOpening = void 0;
require('isomorphic-fetch');
var constants_1 = require("./../constants");
function lichessOpening(params) {
    var fen = params.fen;
    return new Promise(function (resolve, reject) {
        fetch("".concat(constants_1.LICHESS_OPENING_URL, "?fen=").concat(fen), {
            method: "GET"
        })
            .then(function (response) { return response.json(); })
            .then(function (data) {
            var _a;
            if (((_a = data.moves) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                resolve(__assign(__assign({}, data), { fen: fen }));
            }
            else {
                reject({
                    fen: fen,
                    message: "not opening move find or FEN invalid"
                });
            }
        })
            .catch(reject);
    });
}
exports.lichessOpening = lichessOpening;
;
//# sourceMappingURL=lichess-opening.js.map