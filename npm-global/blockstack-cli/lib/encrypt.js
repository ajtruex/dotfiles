"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blockstack = require("blockstack");
function encryptBackupPhrase(plaintextBuffer, password) {
    return blockstack.encryptMnemonic(plaintextBuffer, password);
}
exports.encryptBackupPhrase = encryptBackupPhrase;
function decryptBackupPhrase(dataBuffer, password) {
    return blockstack.decryptMnemonic(dataBuffer, password);
}
exports.decryptBackupPhrase = decryptBackupPhrase;
//# sourceMappingURL=encrypt.js.map