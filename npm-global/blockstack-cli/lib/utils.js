"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require("winston");
const bitcoinjs = require("bitcoinjs-lib");
const URL = require("url");
const readline = require("readline");
const stream = require("stream");
const fs = require("fs");
const blockstack = require("blockstack");
const jsontokens_1 = require("jsontokens");
const ZoneFile = require('zone-file');
const argparse_1 = require("./argparse");
const encrypt_1 = require("./encrypt");
const keys_1 = require("./keys");
;
class CLITransactionSigner {
    constructor(address = '') {
        this.address = address;
        this.isComplete = false;
    }
    getAddress() {
        return Promise.resolve().then(() => this.address);
    }
    signTransaction(_txIn, _signingIndex) {
        return Promise.resolve().then(() => { });
    }
    signerVersion() { return 0; }
}
class NullSigner extends CLITransactionSigner {
}
exports.NullSigner = NullSigner;
;
class MultiSigKeySigner extends CLITransactionSigner {
    constructor(redeemScript, privateKeys) {
        super();
        this.redeemScript = Buffer.from(redeemScript, 'hex');
        this.privateKeys = privateKeys;
        this.isComplete = true;
        try {
            // try to deduce m (as in m-of-n)
            const chunks = bitcoinjs.script.decompile(this.redeemScript);
            const firstOp = chunks[0];
            this.m = parseInt(bitcoinjs.script.toASM([firstOp]).slice(3), 10);
            this.address = bitcoinjs.address.toBase58Check(bitcoinjs.crypto.hash160(this.redeemScript), blockstack.config.network.layer1.scriptHash);
        }
        catch (e) {
            logger.error(e);
            throw new Error('Improper redeem script for multi-sig input.');
        }
    }
    getAddress() {
        return Promise.resolve().then(() => this.address);
    }
    signTransaction(txIn, signingIndex) {
        return Promise.resolve().then(() => {
            const keysToUse = this.privateKeys.slice(0, this.m);
            keysToUse.forEach((keyHex) => {
                const ecPair = blockstack.hexStringToECPair(keyHex);
                txIn.sign(signingIndex, ecPair, this.redeemScript);
            });
        });
    }
    signerVersion() { return 0; }
}
exports.MultiSigKeySigner = MultiSigKeySigner;
class SegwitP2SHKeySigner extends CLITransactionSigner {
    constructor(redeemScript, witnessScript, m, privateKeys) {
        super();
        this.redeemScript = Buffer.from(redeemScript, 'hex');
        this.witnessScript = Buffer.from(witnessScript, 'hex');
        this.address = bitcoinjs.address.toBase58Check(bitcoinjs.crypto.hash160(this.redeemScript), blockstack.config.network.layer1.scriptHash);
        this.privateKeys = privateKeys;
        this.m = m;
        this.isComplete = true;
    }
    getAddress() {
        return Promise.resolve().then(() => this.address);
    }
    findUTXO(txIn, signingIndex, utxos) {
        // NOTE: this is O(n*2) complexity for n UTXOs when signing an n-input transaction
        // NOTE: as of bitcoinjs-lib 4.x, the "tx" field is private
        const private_tx = txIn.__TX;
        const txidBuf = new Buffer(private_tx.ins[signingIndex].hash.slice());
        const outpoint = private_tx.ins[signingIndex].index;
        txidBuf.reverse(); // NOTE: bitcoinjs encodes txid as big-endian
        const txid = txidBuf.toString('hex');
        for (let i = 0; i < utxos.length; i++) {
            if (utxos[i].tx_hash === txid && utxos[i].tx_output_n === outpoint) {
                if (!utxos[i].value) {
                    throw new Error(`UTXO for hash=${txid} vout=${outpoint} has no value`);
                }
                return utxos[i];
            }
        }
        throw new Error(`No UTXO for input hash=${txid} vout=${outpoint}`);
    }
    signTransaction(txIn, signingIndex) {
        // This is an interface issue more than anything else.  Basically, in order to
        // form the segwit sighash, we need the UTXOs.  If we knew better, we would have
        // blockstack.js simply pass the consumed UTXO into this method.  But alas, we do
        // not.  Therefore, we need to re-query them.  This is probably fine, since we're
        // not pressured for time when it comes to generating transactions.
        return Promise.resolve().then(() => {
            return this.getAddress();
        })
            .then((address) => {
            return blockstack.config.network.getUTXOs(address);
        })
            .then((utxos) => {
            const utxo = this.findUTXO(txIn, signingIndex, utxos);
            if (this.m === 1) {
                // p2sh-p2wpkh
                const ecPair = blockstack.hexStringToECPair(this.privateKeys[0]);
                txIn.sign(signingIndex, ecPair, this.redeemScript, null, utxo.value);
            }
            else {
                // p2sh-p2wsh
                const keysToUse = this.privateKeys.slice(0, this.m);
                keysToUse.forEach((keyHex) => {
                    const ecPair = blockstack.hexStringToECPair(keyHex);
                    txIn.sign(signingIndex, ecPair, this.redeemScript, null, utxo.value, this.witnessScript);
                });
            }
        });
    }
    signerVersion() { return 0; }
}
exports.SegwitP2SHKeySigner = SegwitP2SHKeySigner;
class SafetyError extends Error {
    constructor(safetyErrors) {
        super(JSONStringify(safetyErrors, true));
        this.safetyErrors = safetyErrors;
    }
}
exports.SafetyError = SafetyError;
function isCLITransactionSigner(signer) {
    return signer.signerVersion !== undefined;
}
function hasKeys(signer) {
    if (isCLITransactionSigner(signer)) {
        const s = signer;
        return s.isComplete;
    }
    else {
        return true;
    }
}
exports.hasKeys = hasKeys;
/*
 * Parse a string into a NullSigner
 * The string has the format "nosign:address"
 * @return a NullSigner instance
 */
function parseNullSigner(addrString) {
    if (!addrString.startsWith('nosign:')) {
        throw new Error('Invalid nosign string');
    }
    const addr = addrString.slice('nosign:'.length);
    return new NullSigner(addr);
}
exports.parseNullSigner = parseNullSigner;
/*
 * Parse a string into a MultiSigKeySigner.
 * The string has the format "m,pk1,pk2,...,pkn"
 * @serializedPrivateKeys (string) the above string
 * @return a MultiSigKeySigner instance
 */
function parseMultiSigKeys(serializedPrivateKeys) {
    const matches = serializedPrivateKeys.match(argparse_1.PRIVATE_KEY_MULTISIG_PATTERN);
    if (!matches) {
        throw new Error('Invalid multisig private key string');
    }
    const m = parseInt(matches[1]);
    const parts = serializedPrivateKeys.split(',');
    const privkeys = [];
    for (let i = 1; i < 256; i++) {
        const pk = parts[i];
        if (!pk) {
            break;
        }
        if (!pk.match(argparse_1.PRIVATE_KEY_PATTERN)) {
            throw new Error('Invalid private key string');
        }
        privkeys.push(pk);
    }
    // generate public keys 
    const pubkeys = privkeys.map((pk) => {
        return Buffer.from(getPublicKeyFromPrivateKey(pk), 'hex');
    });
    // generate redeem script
    const multisigInfo = bitcoinjs.payments.p2ms({ m, pubkeys });
    return new MultiSigKeySigner(multisigInfo.output.toString('hex'), privkeys);
}
exports.parseMultiSigKeys = parseMultiSigKeys;
/*
 * Parse a string into a SegwitP2SHKeySigner
 * The string has the format "segwit:p2sh:m,pk1,pk2,...,pkn"
 * @serializedPrivateKeys (string) the above string
 * @return a MultiSigKeySigner instance
 */
function parseSegwitP2SHKeys(serializedPrivateKeys) {
    const matches = serializedPrivateKeys.match(argparse_1.PRIVATE_KEY_SEGWIT_P2SH_PATTERN);
    if (!matches) {
        throw new Error('Invalid segwit p2sh private key string');
    }
    const m = parseInt(matches[1]);
    const parts = serializedPrivateKeys.split(',');
    const privkeys = [];
    for (let i = 1; i < 256; i++) {
        const pk = parts[i];
        if (!pk) {
            break;
        }
        if (!pk.match(argparse_1.PRIVATE_KEY_PATTERN)) {
            throw new Error('Invalid private key string');
        }
        privkeys.push(pk);
    }
    // generate public keys 
    const pubkeys = privkeys.map((pk) => {
        return Buffer.from(getPublicKeyFromPrivateKey(pk), 'hex');
    });
    // generate redeem script for p2wpkh or p2sh, depending on how many keys 
    let redeemScript;
    let witnessScript = '';
    if (m === 1) {
        // p2wpkh 
        const p2wpkh = bitcoinjs.payments.p2wpkh({ pubkey: pubkeys[0] });
        const p2sh = bitcoinjs.payments.p2sh({ redeem: p2wpkh });
        redeemScript = p2sh.redeem.output.toString('hex');
    }
    else {
        // p2wsh
        const p2ms = bitcoinjs.payments.p2ms({ m, pubkeys });
        const p2wsh = bitcoinjs.payments.p2wsh({ redeem: p2ms });
        const p2sh = bitcoinjs.payments.p2sh({ redeem: p2wsh });
        redeemScript = p2sh.redeem.output.toString('hex');
        witnessScript = p2wsh.redeem.output.toString('hex');
    }
    return new SegwitP2SHKeySigner(redeemScript, witnessScript, m, privkeys);
}
exports.parseSegwitP2SHKeys = parseSegwitP2SHKeys;
/*
 * Decode one or more private keys from a string.
 * Can be used to parse single private keys (as strings),
 * or multisig bundles (as CLITransactionSigners)
 * @serializedPrivateKey (string) the private key, encoded
 * @return a CLITransactionSigner or a String
 */
function decodePrivateKey(serializedPrivateKey) {
    const nosignMatches = serializedPrivateKey.match(argparse_1.PRIVATE_KEY_NOSIGN_PATTERN);
    if (!!nosignMatches) {
        // no private key 
        return parseNullSigner(serializedPrivateKey);
    }
    const singleKeyMatches = serializedPrivateKey.match(argparse_1.PRIVATE_KEY_PATTERN);
    if (!!singleKeyMatches) {
        // one private key 
        return serializedPrivateKey;
    }
    const multiKeyMatches = serializedPrivateKey.match(argparse_1.PRIVATE_KEY_MULTISIG_PATTERN);
    if (!!multiKeyMatches) {
        // multisig bundle 
        return parseMultiSigKeys(serializedPrivateKey);
    }
    const segwitP2SHMatches = serializedPrivateKey.match(argparse_1.PRIVATE_KEY_SEGWIT_P2SH_PATTERN);
    if (!!segwitP2SHMatches) {
        // segwit p2sh bundle
        return parseSegwitP2SHKeys(serializedPrivateKey);
    }
    throw new Error('Unparseable private key');
}
exports.decodePrivateKey = decodePrivateKey;
/*
 * JSON stringify helper
 * -- if stdout is a TTY, then pretty-format the JSON
 * -- otherwise, print it all on one line to make it easy for programs to consume
 */
function JSONStringify(obj, stderr = false) {
    if ((!stderr && process.stdout.isTTY) || (stderr && process.stderr.isTTY)) {
        return JSON.stringify(obj, null, 2);
    }
    else {
        return JSON.stringify(obj);
    }
}
exports.JSONStringify = JSONStringify;
/*
 * Get a private key's public key, while honoring the 01 to compress it.
 * @privateKey (string) the hex-encoded private key
 */
function getPublicKeyFromPrivateKey(privateKey) {
    const ecKeyPair = blockstack.hexStringToECPair(privateKey);
    return ecKeyPair.publicKey.toString('hex');
}
exports.getPublicKeyFromPrivateKey = getPublicKeyFromPrivateKey;
/*
 * Get a private key's address.  Honor the 01 to compress the public key
 * @privateKey (string) the hex-encoded private key
 */
function getPrivateKeyAddress(network, privateKey) {
    if (isCLITransactionSigner(privateKey)) {
        const pkts = privateKey;
        return pkts.address;
    }
    else {
        const pk = privateKey;
        const ecKeyPair = blockstack.hexStringToECPair(pk);
        return network.coerceAddress(blockstack.ecPairToAddress(ecKeyPair));
    }
}
exports.getPrivateKeyAddress = getPrivateKeyAddress;
/*
 * Is a name a sponsored name (a subdomain)?
 */
function isSubdomain(name) {
    return !!name.match(/^[^\.]+\.[^.]+\.[^.]+$/);
}
exports.isSubdomain = isSubdomain;
/*
 * Get the canonical form of a hex-encoded private key
 * (i.e. strip the trailing '01' if present)
 */
function canonicalPrivateKey(privkey) {
    if (privkey.length == 66 && privkey.slice(-2) === '01') {
        return privkey.substring(0, 64);
    }
    return privkey;
}
exports.canonicalPrivateKey = canonicalPrivateKey;
/*
 * Get the sum of a set of UTXOs' values
 * @txIn (object) the transaction
 */
function sumUTXOs(utxos) {
    return utxos.reduce((agg, x) => agg + x.value, 0);
}
exports.sumUTXOs = sumUTXOs;
/*
 * Hash160 function for zone files
 */
function hash160(buff) {
    return bitcoinjs.crypto.hash160(buff);
}
exports.hash160 = hash160;
/*
 * Normalize a URL--remove duplicate /'s from the root of the path.
 * Throw an exception if it's not well-formed.
 */
function checkUrl(url) {
    const urlinfo = URL.parse(url);
    if (!urlinfo.protocol) {
        throw new Error(`Malformed full URL: missing scheme in ${url}`);
    }
    if (!urlinfo.path || urlinfo.path.startsWith('//')) {
        throw new Error(`Malformed full URL: path root has multiple /'s: ${url}`);
    }
    return url;
}
exports.checkUrl = checkUrl;
/*
 * Sign a profile into a JWT
 */
function makeProfileJWT(profileData, privateKey) {
    const signedToken = blockstack.signProfileToken(profileData, privateKey);
    const wrappedToken = blockstack.wrapProfileToken(signedToken);
    const tokenRecords = [wrappedToken];
    return JSONStringify(tokenRecords);
}
exports.makeProfileJWT = makeProfileJWT;
async function makeDIDConfiguration(network, blockstackID, domain, privateKey) {
    const tokenSigner = new jsontokens_1.TokenSigner("ES256K", privateKey);
    const nameInfo = await network.getNameInfo(blockstackID);
    const did = nameInfo.did;
    const payload = {
        iss: did,
        domain,
        exp: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    };
    const jwt = tokenSigner.sign(payload);
    return { "entries": [
            {
                did,
                jwt
            }
        ] };
}
exports.makeDIDConfiguration = makeDIDConfiguration;
/*
 * Broadcast a transaction and a zone file.
 * Returns an object that encodes the success/failure of doing so.
 * If zonefile is None, then only the transaction will be sent.
 */
async function broadcastTransactionAndZoneFile(network, tx, zonefile) {
    let txid;
    return Promise.resolve().then(() => {
        return network.broadcastTransaction(tx);
    })
        .then((_txid) => {
        txid = _txid;
        if (zonefile) {
            return network.broadcastZoneFile(zonefile, txid);
        }
        else {
            return { 'status': true };
        }
    })
        .then((resp) => {
        if (!resp.status) {
            return {
                'status': false,
                'error': 'Failed to broadcast zone file',
                'txid': txid
            };
        }
        else {
            return {
                'status': true,
                'txid': txid
            };
        }
    })
        .catch((e) => {
        return {
            'status': false,
            'error': 'Caught exception sending transaction or zone file',
            'message': e.message,
            'stacktrace': e.stack
        };
    });
}
exports.broadcastTransactionAndZoneFile = broadcastTransactionAndZoneFile;
/*
 * Easier-to-use getNameInfo.  Returns null if the name does not exist.
 */
function getNameInfoEasy(network, name) {
    const nameInfoPromise = network.getNameInfo(name)
        .then((nameInfo) => nameInfo)
        .catch((error) => {
        if (error.message === 'Name not found') {
            return null;
        }
        else {
            throw error;
        }
    });
    return nameInfoPromise;
}
exports.getNameInfoEasy = getNameInfoEasy;
/*
 * Look up a name's zone file, profile URL, and profile
 * Returns a Promise to the above, or throws an error.
 */
async function nameLookup(network, name, includeProfile = true) {
    const nameInfoPromise = getNameInfoEasy(network, name);
    const profilePromise = includeProfile ?
        blockstack.lookupProfile(name).catch(() => null) :
        Promise.resolve().then(() => null);
    const zonefilePromise = nameInfoPromise.then((nameInfo) => nameInfo ? nameInfo.zonefile : null);
    const [profile, zonefile, nameInfo] = await Promise.all([profilePromise, zonefilePromise, nameInfoPromise]);
    let profileObj = profile;
    if (!nameInfo) {
        throw new Error('Name not found');
    }
    if (nameInfo.hasOwnProperty('grace_period') && nameInfo.grace_period) {
        throw new Error(`Name is expired at block ${nameInfo.expire_block} ` +
            `and must be renewed by block ${nameInfo.renewal_deadline}`);
    }
    let profileUrl = null;
    try {
        const zonefileJSON = ZoneFile.parseZoneFile(zonefile);
        if (zonefileJSON.uri && zonefileJSON.hasOwnProperty('$origin')) {
            profileUrl = blockstack.getTokenFileUrl(zonefileJSON);
        }
    }
    catch (e) {
        profileObj = null;
    }
    const ret = {
        zonefile: zonefile,
        profile: profileObj,
        profileUrl: profileUrl
    };
    return ret;
}
exports.nameLookup = nameLookup;
/*
 * Get a password.  Don't echo characters to stdout.
 * Password will be passed to the given callback.
 */
function getpass(promptStr, cb) {
    const silentOutput = new stream.Writable({
        write: (_chunk, _encoding, callback) => {
            callback();
        }
    });
    const rl = readline.createInterface({
        input: process.stdin,
        output: silentOutput,
        terminal: true
    });
    process.stderr.write(promptStr);
    rl.question('', (passwd) => {
        rl.close();
        process.stderr.write('\n');
        cb(passwd);
    });
    return;
}
exports.getpass = getpass;
/*
 * Extract a 12-word backup phrase.  If the raw 12-word phrase is given, it will
 * be returned.  If the ciphertext is given, the user will be prompted for a password
 * (if a password is not given as an argument).
 */
async function getBackupPhrase(backupPhraseOrCiphertext, password) {
    if (backupPhraseOrCiphertext.split(/ +/g).length > 1) {
        // raw backup phrase 
        return backupPhraseOrCiphertext;
    }
    else {
        // ciphertext 
        const pass = await new Promise((resolve, reject) => {
            if (!process.stdin.isTTY && !password) {
                // password must be given 
                reject(new Error('Password argument required in non-interactive mode'));
            }
            else {
                // prompt password 
                getpass('Enter password: ', (p) => {
                    resolve(p);
                });
            }
        });
        return await encrypt_1.decryptBackupPhrase(Buffer.from(backupPhraseOrCiphertext, 'base64'), pass);
    }
}
exports.getBackupPhrase = getBackupPhrase;
/*
 * mkdir -p
 * path must be absolute
 */
function mkdirs(path) {
    if (path.length === 0 || path[0] !== '/') {
        throw new Error('Path must be absolute');
    }
    const pathParts = path.replace(/^\//, '').split('/');
    let tmpPath = '/';
    for (let i = 0; i <= pathParts.length; i++) {
        try {
            const statInfo = fs.lstatSync(tmpPath);
            if ((statInfo.mode & fs.constants.S_IFDIR) === 0) {
                throw new Error(`Not a directory: ${tmpPath}`);
            }
        }
        catch (e) {
            if (e.code === 'ENOENT') {
                // need to create
                fs.mkdirSync(tmpPath);
            }
            else {
                throw e;
            }
        }
        if (i === pathParts.length) {
            break;
        }
        tmpPath = `${tmpPath}/${pathParts[i]}`;
    }
}
exports.mkdirs = mkdirs;
/*
 * Given a name or ID address, return a promise to the ID Address
 */
async function getIDAddress(network, nameOrIDAddress) {
    if (nameOrIDAddress.match(argparse_1.ID_ADDRESS_PATTERN)) {
        return nameOrIDAddress;
    }
    else {
        // need to look it up 
        const nameInfo = await network.getNameInfo(nameOrIDAddress);
        return `ID-${nameInfo.address}`;
    }
}
exports.getIDAddress = getIDAddress;
/*
 * Find all identity addresses until we have one that matches the given one.
 * Loops forever if not found
 */
async function getOwnerKeyFromIDAddress(network, mnemonic, idAddress) {
    let index = 0;
    while (true) {
        const keyInfo = await keys_1.getOwnerKeyInfo(network, mnemonic, index);
        if (keyInfo.idAddress === idAddress) {
            return keyInfo.privateKey;
        }
        index++;
    }
}
exports.getOwnerKeyFromIDAddress = getOwnerKeyFromIDAddress;
;
async function getIDAppKeys(network, nameOrIDAddress, appOrigin, mnemonicOrCiphertext) {
    const mnemonic = await getBackupPhrase(mnemonicOrCiphertext);
    const idAddress = await getIDAddress(network, nameOrIDAddress);
    const appKeyInfo = await keys_1.getApplicationKeyInfo(network, mnemonic, idAddress, appOrigin);
    const appPrivateKey = keys_1.extractAppKey(network, appKeyInfo);
    const ownerPrivateKey = await getOwnerKeyFromIDAddress(network, mnemonic, idAddress);
    const ret = {
        appPrivateKey,
        ownerPrivateKey,
        mnemonic
    };
    return ret;
}
exports.getIDAppKeys = getIDAppKeys;
//# sourceMappingURL=utils.js.map