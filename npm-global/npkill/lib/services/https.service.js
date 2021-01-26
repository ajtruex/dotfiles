"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https = require("https");
class HttpsService {
    get(url) {
        return new Promise((resolve, reject) => {
            const fail = err => {
                reject(err);
                return;
            };
            const request = https.get(url, res => {
                if (!this.isCorrectResponse(res.statusCode))
                    fail(res.statusMessage);
                res.setEncoding('utf8');
                let body = '';
                res.on('data', data => {
                    body += data;
                });
                res.on('end', () => {
                    resolve(JSON.parse(body));
                });
            });
            request.on('error', err => fail(err));
        });
    }
    isCorrectResponse(statusCode) {
        const correctRangeStart = 200;
        const correctRangeEnd = 299;
        return statusCode >= correctRangeStart && statusCode <= correctRangeEnd;
    }
}
exports.HttpsService = HttpsService;
