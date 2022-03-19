"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lichessCloudEval = void 0;
require('isomorphic-fetch');
var constants_1 = require("./../constants");
function lichessCloudEval(params) {
    return new Promise(function (resolve, reject) {
        fetch("".concat(constants_1.LICHESS_CLOUD_EVAL_URL, "?fen=").concat(params.fen, "&multiPv=").concat(params.multiPv || 1), {
            method: "GET"
        })
            .then(function (response) { return response.json(); })
            .then(function (data) {
            if (data.error) {
                reject(data);
            }
            else {
                resolve(data);
            }
        })
            .catch(reject);
    });
}
exports.lichessCloudEval = lichessCloudEval;
;
//# sourceMappingURL=lichess-cloud-eval.js.map