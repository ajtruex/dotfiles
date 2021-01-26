"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const files_service_1 = require("./files.service");
class UnixFilesService extends files_service_1.FileService {
    constructor(streamService) {
        super();
        this.streamService = streamService;
    }
    listDir(params) {
        const args = this.prepareFindArgs(params);
        const child = child_process_1.spawn('find', args);
        return this.streamService.getStream(child);
    }
    deleteDir(path) {
        return new Promise((resolve, reject) => {
            const command = `rm -rf "${path}"`;
            child_process_1.exec(command, (error, stdout, stderr) => {
                if (error)
                    return reject(error);
                if (stderr)
                    return reject(stderr);
                resolve(stdout);
            });
        });
    }
    prepareFindArgs(params) {
        const { path, target, exclude } = params;
        let args = [path];
        if (exclude) {
            args = [...args, this.prepareExcludeArgs(exclude)].flat();
        }
        args = [...args, '-name', target, '-type', 'd', '-prune'];
        return args;
    }
    prepareExcludeArgs(exclude) {
        const excludeDirs = exclude.map((dir) => [
            '-not',
            '(',
            '-name',
            dir,
            '-prune',
            ')',
        ]);
        return excludeDirs.flat();
    }
}
exports.UnixFilesService = UnixFilesService;
