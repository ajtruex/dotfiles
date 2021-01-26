"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class FileService {
    convertKbToGB(kb) {
        const factorKBtoGB = 1048576;
        return kb / factorKBtoGB;
    }
    convertBytesToKB(bytes) {
        const factorBytestoKB = 1024;
        return bytes / factorBytestoKB;
    }
    convertGBToMB(gb) {
        const factorGBtoMB = 1024;
        return gb * factorGBtoMB;
    }
    getFileContent(path) {
        const encoding = 'utf8';
        return fs.readFileSync(path, encoding);
    }
    isSafeToDelete(path, targetFolder) {
        return path.includes(targetFolder);
    }
}
exports.FileService = FileService;
