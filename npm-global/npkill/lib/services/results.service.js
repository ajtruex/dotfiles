"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sort_result_1 = require("@core/constants/sort.result");
class ResultsService {
    constructor() {
        this.results = [];
    }
    addResult(result) {
        this.results = [...this.results, result];
    }
    sortResults(method) {
        this.results = this.results.sort(sort_result_1.FOLDER_SORT[method]);
    }
    getStats() {
        let spaceReleased = 0;
        const totalSpace = this.results.reduce((total, folder) => {
            if (folder.status === 'deleted')
                spaceReleased += folder.size;
            return total + folder.size;
        }, 0);
        return {
            spaceReleased: `${spaceReleased.toFixed(2)} GB`,
            totalSpace: `${totalSpace.toFixed(2)} GB`,
        };
    }
}
exports.ResultsService = ResultsService;
