"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const operators_1 = require("rxjs/operators");
const unix_files_service_1 = require("./unix-files.service");
class LinuxFilesService extends unix_files_service_1.UnixFilesService {
    getFolderSize(path) {
        const du = child_process_1.spawn('du', ['-s', '--apparent-size', '-k', path]);
        const cut = child_process_1.spawn('cut', ['-f', '1']);
        du.stdout.pipe(cut.stdin);
        return this.streamService.getStream(cut).pipe(operators_1.map((size) => +size));
    }
}
exports.LinuxFilesService = LinuxFilesService;
