"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PATH = require("path");
const fs = require("fs");
const getSize = require("get-folder-size");
const services_1 = require("@core/services");
const rxjs_1 = require("rxjs");
const child_process_1 = require("child_process");
class WindowsFilesService extends services_1.FileService {
    constructor(streamService) {
        super();
        this.streamService = streamService;
    }
    getFolderSize(path) {
        return rxjs_1.Observable.create(observer => {
            getSize(path, (err, size) => {
                if (err) {
                    throw err;
                }
                observer.next(super.convertBytesToKB(size));
                observer.complete();
            });
        });
    }
    listDir(params) {
        const { path, target, exclude } = params;
        const excludeWords = exclude ? exclude.join(' ') : '';
        const binPath = PATH.normalize(`${__dirname}/../bin/windows-find`);
        const args = [path, target, excludeWords];
        const child = child_process_1.spawn(binPath, args);
        return this.streamService.getStream(child);
    }
    deleteDir(path) {
        return new Promise((resolve, reject) => {
            const files = this.getDirectoryFiles(path);
            this.removeDirectoryFiles(path, files);
            try {
                fs.rmdirSync(path);
            }
            catch (err) {
                return reject(err);
            }
            resolve();
        });
    }
    getDirectoryFiles(dir) {
        return fs.readdirSync(dir);
    }
    removeDirectoryFiles(dir, files) {
        files.map(file => {
            const path = PATH.join(dir, file);
            if (fs.statSync(path).isDirectory()) {
                this.deleteDir(path);
            }
            else {
                fs.unlinkSync(path);
            }
        });
    }
}
exports.WindowsFilesService = WindowsFilesService;
