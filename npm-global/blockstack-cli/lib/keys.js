"use strict";
// TODO: most of this code should be in blockstack.js
// Will remove most of this code once the wallet functionality is there instead.
Object.defineProperty(exports, "__esModule", { value: true });
const blockstack = require("blockstack");
const bitcoin = require("bitcoinjs-lib");
const bip39 = require("bip39");
const c32check = require('c32check');
const utils_1 = require("./utils");
const cli_1 = require("./cli");
const bip32 = require("bip32");
exports.STRENGTH = 128; // 12 words
exports.STX_WALLET_COMPATIBLE_SEED_STRENGTH = 256;
exports.DERIVATION_PATH = 'm/44\'/5757\'/0\'/0/0';
async function walletFromMnemonic(mnemonic) {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    return new blockstack.BlockstackWallet(bip32.fromSeed(seed));
}
function getNodePrivateKey(node) {
    return blockstack.ecPairToHexString(bitcoin.ECPair.fromPrivateKey(node.privateKey));
}
/*
 * Get the owner key information for a 12-word phrase, at a specific index.
 * @network (object) the blockstack network
 * @mnemonic (string) the 12-word phrase
 * @index (number) the account index
 * @version (string) the derivation version string
 *
 * Returns an object with:
 *    .privateKey (string) the hex private key
 *    .version (string) the version string of the derivation
 *    .idAddress (string) the ID-address
 */
async function getOwnerKeyInfo(network, mnemonic, index, version = 'v0.10-current') {
    const wallet = await walletFromMnemonic(mnemonic);
    const identity = wallet.getIdentityAddressNode(index);
    const addr = network.coerceAddress(blockstack.BlockstackWallet.getAddressFromBIP32Node(identity));
    const privkey = getNodePrivateKey(identity);
    return {
        privateKey: privkey,
        version: version,
        index: index,
        idAddress: `ID-${addr}`
    };
}
exports.getOwnerKeyInfo = getOwnerKeyInfo;
/*
 * Get the payment key information for a 12-word phrase.
 * @network (object) the blockstack network
 * @mnemonic (string) the 12-word phrase
 *
 * Returns an object with:
 *    .privateKey (string) the hex private key
 *    .address (string) the address of the private key
 */
async function getPaymentKeyInfo(network, mnemonic) {
    const wallet = await walletFromMnemonic(mnemonic);
    const privkey = wallet.getBitcoinPrivateKey(0);
    const addr = utils_1.getPrivateKeyAddress(network, privkey);
    const result = {
        privateKey: privkey,
        address: {
            BTC: addr,
            STACKS: c32check.b58ToC32(addr)
        },
        index: 0
    };
    return result;
}
exports.getPaymentKeyInfo = getPaymentKeyInfo;
/*
 * Get the payment key information for a 24-word phrase used by the Stacks wallet.
 * @network (object) the blockstack network
 * @mnemonic (string) the 24-word phrase
 *
 * Returns an object with:
 *    .privateKey (string) the hex private key
 *    .address (string) the address of the private key
 */
async function getStacksWalletKeyInfo(network, mnemonic) {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const master = bip32.fromSeed(seed);
    const child = master.derivePath('m/44\'/5757\'/0\'/0/0'); // taken from stacks-wallet. See https://github.com/blockstack/stacks-wallet
    const ecPair = bitcoin.ECPair.fromPrivateKey(child.privateKey);
    const privkey = blockstack.ecPairToHexString(ecPair);
    const addr = utils_1.getPrivateKeyAddress(network, privkey);
    let btcAddress;
    if (network.isTestnet()) {
        // btcAddress = const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
        const { address } = bitcoin.payments.p2pkh({ pubkey: ecPair.publicKey, network: bitcoin.networks.regtest });
        btcAddress = address;
    }
    else {
        const { address } = bitcoin.payments.p2pkh({ pubkey: ecPair.publicKey, network: bitcoin.networks.bitcoin });
        btcAddress = address;
    }
    const result = {
        privateKey: privkey,
        address: c32check.b58ToC32(addr),
        btcAddress,
        index: 0
    };
    return result;
}
exports.getStacksWalletKeyInfo = getStacksWalletKeyInfo;
/*
 * Find the index of an ID address, given the mnemonic.
 * Returns the index if found
 * Returns -1 if not found
 */
async function findIdentityIndex(network, mnemonic, idAddress, maxIndex) {
    if (!maxIndex) {
        maxIndex = cli_1.getMaxIDSearchIndex();
    }
    if (idAddress.substring(0, 3) !== 'ID-') {
        throw new Error('Not an identity address');
    }
    const wallet = await walletFromMnemonic(mnemonic);
    for (let i = 0; i < maxIndex; i++) {
        const identity = wallet.getIdentityAddressNode(i);
        const addr = blockstack.BlockstackWallet.getAddressFromBIP32Node(identity);
        if (network.coerceAddress(addr) ===
            network.coerceAddress(idAddress.slice(3))) {
            return i;
        }
    }
    return -1;
}
exports.findIdentityIndex = findIdentityIndex;
/*
 * Get the Gaia application key from a 12-word phrase
 * @network (object) the blockstack network
 * @mmemonic (string) the 12-word phrase
 * @idAddress (string) the ID-address used to sign in
 * @appDomain (string) the application's Origin
 *
 * Returns an object with
 *    .keyInfo (object) the app key info with the current derivation path
 *      .privateKey (string) the app's hex private key
 *      .address (string) the address of the private key
 *    .legacyKeyInfo (object) the app key info with the legacy derivation path
 *      .privateKey (string) the app's hex private key
 *      .address (string) the address of the private key
 */
async function getApplicationKeyInfo(network, mnemonic, idAddress, appDomain, idIndex) {
    if (!idIndex) {
        idIndex = -1;
    }
    if (idIndex < 0) {
        idIndex = await findIdentityIndex(network, mnemonic, idAddress);
        if (idIndex < 0) {
            throw new Error('Identity address does not belong to this keychain');
        }
    }
    const wallet = await walletFromMnemonic(mnemonic);
    const identityOwnerAddressNode = wallet.getIdentityAddressNode(idIndex);
    const appsNode = blockstack.BlockstackWallet.getAppsNode(identityOwnerAddressNode);
    //const appPrivateKey = blockstack.BlockstackWallet.getAppPrivateKey(
    //  appsNode.toBase58(), wallet.getIdentitySalt(), appDomain);
    const legacyAppPrivateKey = blockstack.BlockstackWallet.getLegacyAppPrivateKey(appsNode.toBase58(), wallet.getIdentitySalt(), appDomain);
    // TODO: figure out when we can start using the new derivation path
    const res = {
        keyInfo: {
            privateKey: 'TODO',
            address: 'TODO' // getPrivateKeyAddress(network, `${appPrivateKey}01`)
        },
        legacyKeyInfo: {
            privateKey: legacyAppPrivateKey,
            address: utils_1.getPrivateKeyAddress(network, `${legacyAppPrivateKey}01`)
        },
        ownerKeyIndex: idIndex
    };
    return res;
}
exports.getApplicationKeyInfo = getApplicationKeyInfo;
/*
 * Extract the "right" app key
 */
function extractAppKey(network, appKeyInfo, appAddress) {
    if (appAddress) {
        if (network.coerceMainnetAddress(appKeyInfo.keyInfo.address) === network.coerceMainnetAddress(appAddress)) {
            return appKeyInfo.keyInfo.privateKey;
        }
        if (network.coerceMainnetAddress(appKeyInfo.legacyKeyInfo.address) === network.coerceMainnetAddress(appAddress)) {
            return appKeyInfo.legacyKeyInfo.privateKey;
        }
    }
    const appPrivateKey = (appKeyInfo.keyInfo.privateKey === 'TODO' || !appKeyInfo.keyInfo.privateKey ?
        appKeyInfo.legacyKeyInfo.privateKey :
        appKeyInfo.keyInfo.privateKey);
    return appPrivateKey;
}
exports.extractAppKey = extractAppKey;
//# sourceMappingURL=keys.js.map