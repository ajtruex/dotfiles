"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const update_constants_1 = require("@core/constants/update.constants");
class UpdateService {
    constructor(httpsService) {
        this.httpsService = httpsService;
    }
    isUpdated(localVersion) {
        return __awaiter(this, void 0, void 0, function* () {
            const remoteVersion = yield this.getRemoteVersion();
            const local = this.splitVersion(localVersion);
            const remote = this.splitVersion(remoteVersion);
            return this.compareVersions(local, remote);
        });
    }
    compareVersions(local, remote) {
        return (this.isSameVersion(local, remote) ||
            this.isLocalVersionGreater(local, remote));
    }
    getRemoteVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.httpsService.get(update_constants_1.VERSION_CHECK_DIRECTION);
            return response[update_constants_1.VERSION_KEY];
        });
    }
    splitVersion(version) {
        const versionSeparator = '.';
        const remoteSplited = version.split(versionSeparator);
        return remoteSplited.join('');
    }
    isSameVersion(version1, version2) {
        return version1 === version2;
    }
    isLocalVersionGreater(local, remote) {
        return local > remote;
    }
}
exports.UpdateService = UpdateService;
