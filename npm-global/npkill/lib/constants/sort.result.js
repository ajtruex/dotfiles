"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FOLDER_SORT = {
    path: (a, b) => (a.path > b.path ? 1 : -1),
    size: (a, b) => (a.size < b.size ? 1 : -1),
};
