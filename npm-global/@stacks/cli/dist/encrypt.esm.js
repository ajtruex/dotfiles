import { encryptMnemonic, decryptMnemonic } from 'blockstack';

function encryptBackupPhrase(plaintextBuffer, password) {
  return encryptMnemonic(plaintextBuffer, password);
}
function decryptBackupPhrase(dataBuffer, password) {
  return decryptMnemonic(dataBuffer, password);
}

export { decryptBackupPhrase, encryptBackupPhrase };
//# sourceMappingURL=encrypt.esm.js.map
