"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const constants_1 = require("@core/constants");
class StreamService {
    streamToObservable(stream) {
        const { stdout, stderr } = stream;
        return new rxjs_1.Observable(observer => {
            const dataHandler = data => observer.next(data);
            const bashErrorHandler = error => observer.error(Object.assign(Object.assign({}, error), { bash: true }));
            const errorHandler = error => observer.error(error);
            const endHandler = () => observer.complete();
            stdout.addListener('data', dataHandler);
            stdout.addListener('error', errorHandler);
            stdout.addListener('end', endHandler);
            stderr.addListener('data', bashErrorHandler);
            stderr.addListener('error', errorHandler);
            return () => {
                stdout.removeListener('data', dataHandler);
                stdout.removeListener('error', errorHandler);
                stdout.removeListener('end', endHandler);
                stderr.removeListener('error', errorHandler);
            };
        });
    }
    getStream(child) {
        this.setEncoding(child, constants_1.STREAM_ENCODING);
        return this.streamToObservable(child);
    }
    setEncoding(child, encoding) {
        child.stdout.setEncoding(encoding);
        child.stderr.setEncoding(encoding);
    }
}
exports.StreamService = StreamService;
