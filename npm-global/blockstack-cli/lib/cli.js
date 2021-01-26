"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blockstack = require("blockstack");
const bitcoin = require("bitcoinjs-lib");
const process = require("process");
const fs = require("fs");
const winston = require("winston");
const logger = require("winston");
const cors = require("cors");
const RIPEMD160 = require("ripemd160");
const BN = require('bn.js');
const crypto = require("crypto");
const bip39 = require("bip39");
const express = require("express");
const path = require("path");
const node_fetch_1 = require("node-fetch");
const stacks_transactions_1 = require("@blockstack/stacks-transactions");
const c32check = require('c32check');
const keys_1 = require("./keys");
const argparse_1 = require("./argparse");
const encrypt_1 = require("./encrypt");
const network_1 = require("./network");
const data_1 = require("./data");
const utils_1 = require("./utils");
const auth_1 = require("./auth");
// global CLI options
let txOnly = false;
let estimateOnly = false;
let safetyChecks = true;
let receiveFeesPeriod = 52595;
let gracePeriod = 5000;
let noExit = false;
let maxIDSearchIndex = argparse_1.DEFAULT_MAX_ID_SEARCH_INDEX;
let defaultV2BroadcastUrl = 'https://core.blockstack.org/v2/transactions';
let BLOCKSTACK_TEST = process.env.BLOCKSTACK_TEST ? true : false;
function getMaxIDSearchIndex() {
    return maxIDSearchIndex;
}
exports.getMaxIDSearchIndex = getMaxIDSearchIndex;
/*
 * Get a name's record information
 * args:
 * @name (string) the name to query
 */
function whois(network, args) {
    const name = args[0];
    return network.getNameInfo(name)
        .then((nameInfo) => {
        if (BLOCKSTACK_TEST) {
            // the test framework expects a few more fields.
            // these are for compatibility with the old CLI.
            // you are not required to understand them.
            return Promise.all([network.getNameHistory(name, 0), network.getBlockHeight()])
                .then(([nameHistory, blockHeight]) => {
                if (nameInfo.renewal_deadline > 0 && nameInfo.renewal_deadline <= blockHeight) {
                    return { 'error': 'Name expired' };
                }
                const blocks = Object.keys(nameHistory);
                const lastBlock = parseInt(blocks.sort().slice(-1)[0]);
                const blockRenewedAt = parseInt(nameHistory[lastBlock].slice(-1)[0].last_renewed);
                const ownerScript = bitcoin.address.toOutputScript(network.coerceMainnetAddress(nameInfo.address)).toString('hex');
                const whois = {
                    address: nameInfo.address,
                    blockchain: nameInfo.blockchain,
                    block_renewed_at: blockRenewedAt,
                    did: nameInfo.did,
                    expire_block: nameInfo.expire_block,
                    grace_period: nameInfo.grace_period,
                    last_transaction_height: lastBlock,
                    last_txid: nameInfo.last_txid,
                    owner_address: nameInfo.address,
                    owner_script: ownerScript,
                    renewal_deadline: nameInfo.renewal_deadline,
                    resolver: nameInfo.resolver,
                    status: nameInfo.status,
                    zonefile: nameInfo.zonefile,
                    zonefile_hash: nameInfo.zonefile_hash
                };
                return whois;
            })
                .then((whoisInfo) => utils_1.JSONStringify(whoisInfo, true));
        }
        else {
            return Promise.resolve().then(() => utils_1.JSONStringify(nameInfo, true));
        }
    })
        .catch((error) => {
        if (error.message === 'Name not found') {
            return utils_1.JSONStringify({ 'error': 'Name not found' }, true);
        }
        else {
            throw error;
        }
    });
}
/*
 * Get a name's price information
 * args:
 * @name (string) the name to query
 */
function price(network, args) {
    const name = args[0];
    return network.getNamePrice(name)
        .then((priceInfo) => utils_1.JSONStringify({ units: priceInfo.units, amount: priceInfo.amount.toString() }));
}
/*
 * Get a namespace's price information
 * args:
 * @namespaceID (string) the namespace to query
 */
function priceNamespace(network, args) {
    const namespaceID = args[0];
    return network.getNamespacePrice(namespaceID)
        .then((priceInfo) => utils_1.JSONStringify({ units: priceInfo.units, amount: priceInfo.amount.toString() }));
}
/*
 * Get names owned by an address
 * args:
 * @address (string) the address to query
 */
function names(network, args) {
    const IDaddress = args[0];
    if (!IDaddress.startsWith('ID-')) {
        throw new Error('Must be an ID-address');
    }
    const address = IDaddress.slice(3);
    return network.getNamesOwned(address)
        .then((namesList) => utils_1.JSONStringify(namesList));
}
/*
 * Look up a name's profile and zonefile
 * args:
 * @name (string) the name to look up
 */
function lookup(network, args) {
    network.setCoerceMainnetAddress(true);
    const name = args[0];
    return utils_1.nameLookup(network, name)
        .then((nameLookupInfo) => utils_1.JSONStringify(nameLookupInfo))
        .catch((e) => utils_1.JSONStringify({ error: e.message }));
}
/*
 * Get a name's blockchain record
 * args:
 * @name (string) the name to query
 */
function getNameBlockchainRecord(network, args) {
    const name = args[0];
    return Promise.resolve().then(() => {
        return network.getBlockchainNameRecord(name);
    })
        .then((nameInfo) => {
        return utils_1.JSONStringify(nameInfo);
    })
        .catch((e) => {
        if (e.message === 'Bad response status: 404') {
            return utils_1.JSONStringify({ 'error': 'Name not found' }, true);
        }
        else {
            throw e;
        }
    });
}
/*
 * Get all of a name's history
 */
async function getAllNameHistoryPages(network, name, page) {
    let history = {};
    try {
        const results = await network.getNameHistory(name, page);
        if (Object.keys(results).length == 0) {
            return history;
        }
        else {
            history = Object.assign(history, results);
            const rest = await getAllNameHistoryPages(network, name, page + 1);
            history = Object.assign(history, rest);
            return history;
        }
    }
    catch (_e) {
        return history;
    }
}
/*
 * Get a name's history entry or entries
 * args:
 * @name (string) the name to query
 * @page (string) the page to query (OPTIONAL)
 */
function getNameHistoryRecord(network, args) {
    const name = args[0];
    let page;
    if (args.length >= 2 && args[1] !== null && args[1] !== undefined) {
        page = parseInt(args[1]);
        return Promise.resolve().then(() => {
            return network.getNameHistory(name, page);
        })
            .then((nameHistory) => {
            return utils_1.JSONStringify(nameHistory);
        });
    }
    else {
        // all pages 
        return getAllNameHistoryPages(network, name, 0)
            .then((history) => utils_1.JSONStringify(history));
    }
}
/*
 * Get a namespace's blockchain record
 * args:
 * @namespaceID (string) the namespace to query
 */
function getNamespaceBlockchainRecord(network, args) {
    const namespaceID = args[0];
    return Promise.resolve().then(() => {
        return network.getNamespaceInfo(namespaceID);
    })
        .then((namespaceInfo) => {
        return utils_1.JSONStringify(namespaceInfo);
    })
        .catch((e) => {
        if (e.message === 'Namespace not found') {
            return utils_1.JSONStringify({ 'error': 'Namespace not found' }, true);
        }
        else {
            throw e;
        }
    });
}
/*
 * Get a zone file by hash.
 * args:
 * @zonefile_hash (string) the hash of the zone file to query
 */
function getZonefile(network, args) {
    const zonefileHash = args[0];
    return network.getZonefile(zonefileHash);
}
/*
 * Generate and optionally send a name-preorder
 * args:
 * @name (string) the name to preorder
 * @IDaddress (string) the address to own the name
 * @paymentKey (string) the payment private key
 * @preorderTxOnly (boolean) OPTIONAL: used internally to only return a tx (overrides CLI)
 */
function txPreorder(network, args, preorderTxOnly = false) {
    const name = args[0];
    const IDaddress = args[1];
    const paymentKey = utils_1.decodePrivateKey(args[2]);
    const paymentAddress = utils_1.getPrivateKeyAddress(network, paymentKey);
    if (!IDaddress.startsWith('ID-')) {
        throw new Error('Recipient ID-address must start with ID-');
    }
    const address = IDaddress.slice(3);
    const namespaceID = name.split('.').slice(-1)[0];
    const txPromise = blockstack.transactions.makePreorder(name, address, paymentKey, !utils_1.hasKeys(paymentKey));
    const paymentUTXOsPromise = network.getUTXOs(paymentAddress);
    const estimatePromise = paymentUTXOsPromise.then((utxos) => {
        const numUTXOs = utxos.length;
        return blockstack.transactions.estimatePreorder(name, network.coerceAddress(address), network.coerceAddress(paymentAddress), numUTXOs);
    });
    if (estimateOnly) {
        return estimatePromise
            .then((cost) => utils_1.JSONStringify({ cost: cost }));
    }
    if (!safetyChecks) {
        if (txOnly || preorderTxOnly) {
            return txPromise;
        }
        else {
            return txPromise
                .then((tx) => {
                return network.broadcastTransaction(tx);
            });
        }
    }
    const paymentBalance = paymentUTXOsPromise.then((utxos) => {
        return utils_1.sumUTXOs(utxos);
    });
    const nameInfoPromise = utils_1.getNameInfoEasy(network, name);
    const blockHeightPromise = network.getBlockHeight();
    const safetyChecksPromise = Promise.all([
        nameInfoPromise,
        blockHeightPromise,
        blockstack.safety.isNameValid(name),
        blockstack.safety.isNameAvailable(name),
        blockstack.safety.addressCanReceiveName(network.coerceAddress(address)),
        blockstack.safety.isInGracePeriod(name),
        network.getNamespaceBurnAddress(namespaceID, true, receiveFeesPeriod),
        network.getNamespaceBurnAddress(namespaceID, false, receiveFeesPeriod),
        paymentBalance,
        estimatePromise,
        blockstack.safety.namespaceIsReady(namespaceID),
        network.getNamePrice(name),
        network.getAccountBalance(paymentAddress, 'STACKS')
    ])
        .then(([nameInfo, _blockHeight, isNameValid, isNameAvailable, addressCanReceiveName, isInGracePeriod, givenNamespaceBurnAddress, trueNamespaceBurnAddress, paymentBalance, estimate, isNamespaceReady, namePrice, STACKSBalance]) => {
        if (isNameValid && isNamespaceReady &&
            (isNameAvailable || !nameInfo) &&
            addressCanReceiveName && !isInGracePeriod && paymentBalance >= estimate &&
            trueNamespaceBurnAddress === givenNamespaceBurnAddress &&
            (namePrice.units === 'BTC' || (namePrice.units == 'STACKS'
                && namePrice.amount.cmp(STACKSBalance) <= 0))) {
            return { 'status': true };
        }
        else {
            return {
                'status': false,
                'error': 'Name cannot be safely preordered',
                'isNameValid': isNameValid,
                'isNameAvailable': isNameAvailable,
                'addressCanReceiveName': addressCanReceiveName,
                'isInGracePeriod': isInGracePeriod,
                'paymentBalanceBTC': paymentBalance,
                'paymentBalanceStacks': STACKSBalance.toString(),
                'nameCostUnits': namePrice.units,
                'nameCostAmount': namePrice.amount.toString(),
                'estimateCostBTC': estimate,
                'isNamespaceReady': isNamespaceReady,
                'namespaceBurnAddress': givenNamespaceBurnAddress,
                'trueNamespaceBurnAddress': trueNamespaceBurnAddress
            };
        }
    });
    return safetyChecksPromise
        .then((safetyChecksResult) => {
        if (!safetyChecksResult.status) {
            return new Promise((resolve) => resolve(utils_1.JSONStringify(safetyChecksResult, true)));
        }
        if (txOnly || preorderTxOnly) {
            return txPromise;
        }
        return txPromise.then((tx) => {
            return network.broadcastTransaction(tx);
        })
            .then((txidHex) => {
            return txidHex;
        });
    });
}
/*
 * Generate and optionally send a name-register
 * args:
 * @name (string) the name to register
 * @IDaddress (string) the address that owns this name
 * @paymentKey (string) the payment private key
 * @zonefile (string) if given, the raw zone file or the path to the zone file data to use
 * @zonefileHash (string) if given, this is the raw zone file hash to use
 *  (in which case, @zonefile will be ignored)
 * @registerTxOnly (boolean) OPTIONAL: used internally to coerce returning only the tx
 */
function txRegister(network, args, registerTxOnly = false) {
    const name = args[0];
    const IDaddress = args[1];
    const paymentKey = utils_1.decodePrivateKey(args[2]);
    if (!IDaddress.startsWith('ID-')) {
        throw new Error('Recipient ID-address must start with ID-');
    }
    const address = IDaddress.slice(3);
    const namespaceID = name.split('.').slice(-1)[0];
    let zonefilePath = null;
    let zonefileHash = null;
    let zonefile = null;
    if (args.length > 3 && !!args[3]) {
        zonefilePath = args[3];
    }
    if (args.length > 4 && !!args[4]) {
        zonefileHash = args[4];
        zonefilePath = null;
        logger.debug(`Using zone file hash ${zonefileHash} instead of zone file`);
    }
    if (!!zonefilePath) {
        try {
            zonefile = fs.readFileSync(zonefilePath).toString();
        }
        catch (e) {
            // zone file path as raw zone file
            zonefile = zonefilePath;
        }
    }
    const paymentAddress = utils_1.getPrivateKeyAddress(network, paymentKey);
    const paymentUTXOsPromise = network.getUTXOs(paymentAddress);
    const estimatePromise = paymentUTXOsPromise.then((utxos) => {
        const numUTXOs = utxos.length;
        return blockstack.transactions.estimateRegister(name, network.coerceAddress(address), network.coerceAddress(paymentAddress), true, numUTXOs);
    });
    const txPromise = blockstack.transactions.makeRegister(name, address, paymentKey, zonefile, zonefileHash, !utils_1.hasKeys(paymentKey));
    if (estimateOnly) {
        return estimatePromise
            .then((cost) => utils_1.JSONStringify({ cost: cost }));
    }
    if (!safetyChecks) {
        if (txOnly || registerTxOnly) {
            return txPromise;
        }
        else {
            return txPromise
                .then((tx) => {
                return network.broadcastTransaction(tx);
            });
        }
    }
    const paymentBalancePromise = paymentUTXOsPromise.then((utxos) => {
        return utils_1.sumUTXOs(utxos);
    });
    const nameInfoPromise = utils_1.getNameInfoEasy(network, name);
    const blockHeightPromise = network.getBlockHeight();
    const safetyChecksPromise = Promise.all([
        nameInfoPromise,
        blockHeightPromise,
        blockstack.safety.isNameValid(name),
        blockstack.safety.isNameAvailable(name),
        blockstack.safety.addressCanReceiveName(network.coerceAddress(address)),
        blockstack.safety.isInGracePeriod(name),
        blockstack.safety.namespaceIsReady(namespaceID),
        paymentBalancePromise,
        estimatePromise
    ])
        .then(([nameInfo, _blockHeight, isNameValid, isNameAvailable, addressCanReceiveName, isInGracePeriod, isNamespaceReady, paymentBalance, estimateCost]) => {
        if (isNameValid && isNamespaceReady &&
            (isNameAvailable || !nameInfo) &&
            addressCanReceiveName && !isInGracePeriod && estimateCost < paymentBalance) {
            return { 'status': true };
        }
        else {
            return {
                'status': false,
                'error': 'Name cannot be safely registered',
                'isNameValid': isNameValid,
                'isNameAvailable': isNameAvailable,
                'addressCanReceiveName': addressCanReceiveName,
                'isInGracePeriod': isInGracePeriod,
                'isNamespaceReady': isNamespaceReady,
                'paymentBalanceBTC': paymentBalance,
                'estimateCostBTC': estimateCost
            };
        }
    });
    return safetyChecksPromise
        .then((safetyChecksResult) => {
        if (!safetyChecksResult.status) {
            if (registerTxOnly) {
                return new Promise((resolve) => resolve(utils_1.JSONStringify(safetyChecksResult, true)));
            }
        }
        if (txOnly || registerTxOnly) {
            return txPromise;
        }
        return txPromise.then((tx) => {
            return network.broadcastTransaction(tx);
        })
            .then((txidHex) => {
            return txidHex;
        });
    });
}
// helper to be used with txPreorder and txRegister to determine whether or not the operation failed
function checkTxStatus(txOrJson) {
    try {
        const json = JSON.parse(txOrJson);
        return !!json.status;
    }
    catch (e) {
        return true;
    }
}
/*
 * Generate a zone file for a name, given its Gaia hub URL
 * Optionally includes a _resolver entry
 * args:
 * @name (string) the blockstack ID
 * @idAddress (string) the ID address that owns the name
 * @gaiaHub (string) the URL to the write endpoint to store the name's profile
 */
function makeZonefile(network, args) {
    const name = args[0];
    const idAddress = args[1];
    const gaiaHub = args[2];
    let resolver = '';
    if (!idAddress.startsWith('ID-')) {
        throw new Error('ID-address must start with ID-');
    }
    if (args.length > 3 && !!args[3]) {
        resolver = args[3];
    }
    const address = idAddress.slice(3);
    const mainnetAddress = network.coerceMainnetAddress(address);
    const profileUrl = `${gaiaHub.replace(/\/+$/g, '')}/${mainnetAddress}/profile.json`;
    try {
        utils_1.checkUrl(profileUrl);
    }
    catch (e) {
        return Promise.resolve().then(() => utils_1.JSONStringify({
            'status': false,
            'error': e.message,
            'hints': [
                'Make sure the Gaia hub URL does not have any trailing /\'s',
                'Make sure the Gaia hub URL scheme is present and well-formed'
            ]
        }, true));
    }
    const zonefile = blockstack.makeProfileZoneFile(name, profileUrl);
    return Promise.resolve().then(() => {
        if (!resolver) {
            return zonefile;
        }
        // append _resolver record
        // TODO: zone-file doesn't do this right, so we have to append manually 
        return `${zonefile.replace(/\n+$/, '')}\n_resolver\tIN\tURI\t10\t1\t"${resolver}"`;
    });
}
/*
 * Generate and optionally send a name-update
 * args:
 * @name (string) the name to update
 * @zonefile (string) the path to the zonefile to use
 * @ownerKey (string) the owner private key
 * @paymentKey (string) the payment private key
 * @zonefileHash (string) the zone file hash to use, if given
 *   (will be used instead of the zonefile)
 */
function update(network, args) {
    const name = args[0];
    let zonefilePath = args[1];
    const ownerKey = utils_1.decodePrivateKey(args[2]);
    const paymentKey = utils_1.decodePrivateKey(args[3]);
    let zonefile = null;
    let zonefileHash = '';
    if (args.length > 4 && !!args[4]) {
        zonefileHash = args[4];
        zonefilePath = null;
        logger.debug(`Using zone file hash ${zonefileHash} instead of zone file`);
    }
    if (zonefilePath) {
        zonefile = fs.readFileSync(zonefilePath).toString();
    }
    const ownerAddress = utils_1.getPrivateKeyAddress(network, ownerKey);
    const paymentAddress = utils_1.getPrivateKeyAddress(network, paymentKey);
    const ownerUTXOsPromise = network.getUTXOs(ownerAddress);
    const paymentUTXOsPromise = network.getUTXOs(paymentAddress);
    const estimatePromise = Promise.all([
        ownerUTXOsPromise, paymentUTXOsPromise
    ])
        .then(([ownerUTXOs, paymentUTXOs]) => {
        const numOwnerUTXOs = ownerUTXOs.length;
        const numPaymentUTXOs = paymentUTXOs.length;
        return blockstack.transactions.estimateUpdate(name, network.coerceAddress(ownerAddress), network.coerceAddress(paymentAddress), numOwnerUTXOs + numPaymentUTXOs - 1);
    });
    const txPromise = blockstack.transactions.makeUpdate(name, ownerKey, paymentKey, zonefile, zonefileHash, !utils_1.hasKeys(ownerKey) || !utils_1.hasKeys(paymentKey));
    if (estimateOnly) {
        return estimatePromise
            .then((cost) => String(cost));
    }
    if (!safetyChecks) {
        if (txOnly) {
            return txPromise;
        }
        else {
            return txPromise
                .then((tx) => {
                return network.broadcastTransaction(tx);
            });
        }
    }
    const paymentBalancePromise = paymentUTXOsPromise.then((utxos) => {
        return utils_1.sumUTXOs(utxos);
    });
    const safetyChecksPromise = Promise.all([
        blockstack.safety.isNameValid(name),
        blockstack.safety.ownsName(name, network.coerceAddress(ownerAddress)),
        blockstack.safety.isInGracePeriod(name),
        estimatePromise,
        paymentBalancePromise
    ])
        .then(([isNameValid, ownsName, isInGracePeriod, estimateCost, paymentBalance]) => {
        if (isNameValid && ownsName && !isInGracePeriod && estimateCost < paymentBalance) {
            return { 'status': true };
        }
        else {
            return {
                'status': false,
                'error': 'Name cannot be safely updated',
                'isNameValid': isNameValid,
                'ownsName': ownsName,
                'isInGracePeriod': isInGracePeriod,
                'estimateCostBTC': estimateCost,
                'paymentBalanceBTC': paymentBalance
            };
        }
    });
    return safetyChecksPromise
        .then((safetyChecksResult) => {
        if (!safetyChecksResult.status) {
            return new Promise((resolve) => resolve(utils_1.JSONStringify(safetyChecksResult, true)));
        }
        if (txOnly) {
            return txPromise;
        }
        return txPromise.then((tx) => {
            return network.broadcastTransaction(tx);
        })
            .then((txidHex) => {
            return txidHex;
        });
    });
}
/*
 * Generate and optionally send a name-transfer
 * args:
 * @name (string) the name to transfer
 * @IDaddress (string) the new owner address
 * @keepZoneFile (boolean) keep the zone file or not
 * @ownerKey (string) the owner private key
 * @paymentKey (string) the payment private key
 */
function transfer(network, args) {
    const name = args[0];
    const IDaddress = args[1];
    const keepZoneFile = (args[2].toLowerCase() === 'true');
    const ownerKey = utils_1.decodePrivateKey(args[3]);
    const paymentKey = utils_1.decodePrivateKey(args[4]);
    const ownerAddress = utils_1.getPrivateKeyAddress(network, ownerKey);
    const paymentAddress = utils_1.getPrivateKeyAddress(network, paymentKey);
    if (!IDaddress.startsWith('ID-')) {
        throw new Error('Recipient ID-address must start with ID-');
    }
    const address = IDaddress.slice(3);
    const ownerUTXOsPromise = network.getUTXOs(ownerAddress);
    const paymentUTXOsPromise = network.getUTXOs(paymentAddress);
    const estimatePromise = Promise.all([
        ownerUTXOsPromise, paymentUTXOsPromise
    ])
        .then(([ownerUTXOs, paymentUTXOs]) => {
        const numOwnerUTXOs = ownerUTXOs.length;
        const numPaymentUTXOs = paymentUTXOs.length;
        return blockstack.transactions.estimateTransfer(name, network.coerceAddress(address), network.coerceAddress(ownerAddress), network.coerceAddress(paymentAddress), numOwnerUTXOs + numPaymentUTXOs - 1);
    });
    const txPromise = blockstack.transactions.makeTransfer(name, address, ownerKey, paymentKey, keepZoneFile, !utils_1.hasKeys(ownerKey) || !utils_1.hasKeys(paymentKey));
    if (estimateOnly) {
        return estimatePromise
            .then((cost) => String(cost));
    }
    if (!safetyChecks) {
        if (txOnly) {
            return txPromise;
        }
        else {
            return txPromise
                .then((tx) => {
                return network.broadcastTransaction(tx);
            });
        }
    }
    const paymentBalancePromise = paymentUTXOsPromise.then((utxos) => {
        return utils_1.sumUTXOs(utxos);
    });
    const safetyChecksPromise = Promise.all([
        blockstack.safety.isNameValid(name),
        blockstack.safety.ownsName(name, network.coerceAddress(ownerAddress)),
        blockstack.safety.addressCanReceiveName(network.coerceAddress(address)),
        blockstack.safety.isInGracePeriod(name),
        paymentBalancePromise,
        estimatePromise
    ])
        .then(([isNameValid, ownsName, addressCanReceiveName, isInGracePeriod, paymentBalance, estimateCost]) => {
        if (isNameValid && ownsName && addressCanReceiveName &&
            !isInGracePeriod && estimateCost < paymentBalance) {
            return { 'status': true };
        }
        else {
            return {
                'status': false,
                'error': 'Name cannot be safely transferred',
                'isNameValid': isNameValid,
                'ownsName': ownsName,
                'addressCanReceiveName': addressCanReceiveName,
                'isInGracePeriod': isInGracePeriod,
                'estimateCostBTC': estimateCost,
                'paymentBalanceBTC': paymentBalance
            };
        }
    });
    return safetyChecksPromise
        .then((safetyChecksResult) => {
        if (!safetyChecksResult.status) {
            return new Promise((resolve) => resolve(utils_1.JSONStringify(safetyChecksResult, true)));
        }
        if (txOnly) {
            return txPromise;
        }
        return txPromise.then((tx) => {
            return network.broadcastTransaction(tx);
        })
            .then((txidHex) => {
            return txidHex;
        });
    });
}
/*
 * Get the last zone file hash
 */
function getLastZonefileHash(network, name) {
    return getAllNameHistoryPages(network, name, 0)
        .then((nameHistory) => {
        let zfh = '';
        const blockHeights = Object.keys(nameHistory).sort().reverse();
        for (let i = 0; i < blockHeights.length; i++) {
            const blockHeight = blockHeights[i];
            for (let j = nameHistory[blockHeight].length - 1; j >= 0; j--) {
                const entry = nameHistory[blockHeight][j];
                if (!!entry.value_hash) {
                    zfh = entry.value_hash;
                    break;
                }
            }
            if (!!zfh) {
                break;
            }
        }
        if (!!zfh) {
            return zfh;
        }
        else {
            throw new Error(`Failed to find a zone file hash for ${name}`);
        }
    });
}
/*
 * Generate and optionally send a name-renewal
 * args:
 * @name (string) the name to renew
 * @ownerKey (string) the owner private key
 * @paymentKey (string) the payment private key
 * @address (string) OPTIONAL: the new owner address
 * @zonefilePath (string) OPTIONAL: the path to the new zone file
 * @zonefileHash (string) OPTINOAL: use the given zonefile hash.  Supercedes zonefile.
 */
async function renew(network, args) {
    const name = args[0];
    const ownerKey = utils_1.decodePrivateKey(args[1]);
    const paymentKey = utils_1.decodePrivateKey(args[2]);
    const ownerAddress = utils_1.getPrivateKeyAddress(network, ownerKey);
    const paymentAddress = utils_1.getPrivateKeyAddress(network, paymentKey);
    const namespaceID = name.split('.').slice(-1)[0];
    let newAddress = '';
    let zonefilePath = '';
    let zonefileHash = '';
    let zonefile = '';
    let blankZonefileHash = true;
    if (args.length >= 4 && !!args[3]) {
        // ID-address
        newAddress = args[3].slice(3);
    }
    else {
        newAddress = utils_1.getPrivateKeyAddress(network, ownerKey);
    }
    if (args.length >= 5 && !!args[4]) {
        blankZonefileHash = false;
        zonefilePath = args[4];
    }
    if (args.length >= 6 && !!args[5]) {
        blankZonefileHash = false;
        zonefileHash = args[5];
        zonefilePath = null;
        logger.debug(`Using zone file hash ${zonefileHash} instead of zone file`);
    }
    if (zonefilePath) {
        zonefile = fs.readFileSync(zonefilePath).toString();
    }
    const ownerUTXOsPromise = network.getUTXOs(ownerAddress);
    const paymentUTXOsPromise = network.getUTXOs(paymentAddress);
    const estimatePromise = Promise.all([
        ownerUTXOsPromise, paymentUTXOsPromise
    ])
        .then(([ownerUTXOs, paymentUTXOs]) => {
        const numOwnerUTXOs = ownerUTXOs.length;
        const numPaymentUTXOs = paymentUTXOs.length;
        return blockstack.transactions.estimateRenewal(name, network.coerceAddress(newAddress), network.coerceAddress(ownerAddress), network.coerceAddress(paymentAddress), true, numOwnerUTXOs + numPaymentUTXOs - 1);
    });
    let zfh;
    if (!!zonefile) {
        const sha256 = bitcoin.crypto.sha256(new Buffer(zonefile));
        zfh = (new RIPEMD160()).update(sha256).digest('hex');
    }
    else if (!!zonefileHash || blankZonefileHash) {
        // already have the hash 
        zfh = zonefileHash;
    }
    else {
        zfh = await getLastZonefileHash(network, name);
    }
    const txPromise = blockstack.transactions.makeRenewal(name, newAddress, ownerKey, paymentKey, zonefile, zfh, !utils_1.hasKeys(ownerKey) || !utils_1.hasKeys(paymentKey));
    if (estimateOnly) {
        return estimatePromise
            .then((cost) => String(cost));
    }
    if (!safetyChecks) {
        if (txOnly) {
            return txPromise;
        }
        else {
            return txPromise
                .then((tx) => {
                return network.broadcastTransaction(tx);
            });
        }
    }
    const paymentBalancePromise = paymentUTXOsPromise.then((utxos) => {
        return utils_1.sumUTXOs(utxos);
    });
    const canReceiveNamePromise = Promise.resolve().then(() => {
        if (newAddress) {
            return blockstack.safety.addressCanReceiveName(network.coerceAddress(newAddress));
        }
        else {
            return true;
        }
    });
    const safetyChecksPromise = Promise.all([
        blockstack.safety.isNameValid(name),
        blockstack.safety.ownsName(name, network.coerceAddress(ownerAddress)),
        network.getNamespaceBurnAddress(namespaceID, true, receiveFeesPeriod),
        network.getNamespaceBurnAddress(namespaceID, false, receiveFeesPeriod),
        canReceiveNamePromise,
        network.getNamePrice(name),
        network.getAccountBalance(paymentAddress, 'STACKS'),
        estimatePromise,
        paymentBalancePromise
    ])
        .then(([isNameValid, ownsName, givenNSBurnAddr, trueNSBurnAddr, addressCanReceiveName, nameCost, accountBalance, estimateCost, paymentBalance]) => {
        if (isNameValid && ownsName && addressCanReceiveName &&
            trueNSBurnAddr === givenNSBurnAddr &&
            (nameCost.units === 'BTC' || (nameCost.units == 'STACKS' &&
                nameCost.amount.cmp(accountBalance) <= 0)) &&
            estimateCost < paymentBalance) {
            return { 'status': true };
        }
        else {
            return {
                'status': false,
                'error': 'Name cannot be safely renewed',
                'isNameValid': isNameValid,
                'ownsName': ownsName,
                'addressCanReceiveName': addressCanReceiveName,
                'estimateCostBTC': estimateCost,
                'nameCostUnits': nameCost.units,
                'nameCostAmount': nameCost.amount.toString(),
                'paymentBalanceBTC': paymentBalance,
                'paymentBalanceStacks': accountBalance.toString(),
                'namespaceBurnAddress': givenNSBurnAddr,
                'trueNamespaceBurnAddress': trueNSBurnAddr
            };
        }
    });
    return safetyChecksPromise
        .then((safetyChecksResult) => {
        if (!safetyChecksResult.status) {
            return new Promise((resolve) => resolve(utils_1.JSONStringify(safetyChecksResult, true)));
        }
        if (txOnly) {
            return txPromise;
        }
        return txPromise.then((tx) => {
            return network.broadcastTransaction(tx);
        })
            .then((txidHex) => {
            return txidHex;
        });
    });
}
/*
 * Generate and optionally send a name-revoke
 * args:
 * @name (string) the name to revoke
 * @ownerKey (string) the owner private key
 * @paymentKey (string) the payment private key
 */
function revoke(network, args) {
    const name = args[0];
    const ownerKey = utils_1.decodePrivateKey(args[1]);
    const paymentKey = utils_1.decodePrivateKey(args[2]);
    const paymentAddress = utils_1.getPrivateKeyAddress(network, paymentKey);
    const ownerAddress = utils_1.getPrivateKeyAddress(network, ownerKey);
    const ownerUTXOsPromise = network.getUTXOs(ownerAddress);
    const paymentUTXOsPromise = network.getUTXOs(paymentAddress);
    const estimatePromise = Promise.all([
        ownerUTXOsPromise, paymentUTXOsPromise
    ])
        .then(([ownerUTXOs, paymentUTXOs]) => {
        const numOwnerUTXOs = ownerUTXOs.length;
        const numPaymentUTXOs = paymentUTXOs.length;
        return blockstack.transactions.estimateRevoke(name, network.coerceAddress(ownerAddress), network.coerceAddress(paymentAddress), numOwnerUTXOs + numPaymentUTXOs - 1);
    });
    const txPromise = blockstack.transactions.makeRevoke(name, ownerKey, paymentKey, !utils_1.hasKeys(ownerKey) || !utils_1.hasKeys(paymentKey));
    if (estimateOnly) {
        return estimatePromise
            .then((cost) => String(cost));
    }
    if (!safetyChecks) {
        if (txOnly) {
            return txPromise;
        }
        else {
            return txPromise
                .then((tx) => {
                return network.broadcastTransaction(tx);
            });
        }
    }
    const paymentBalancePromise = paymentUTXOsPromise.then((utxos) => {
        return utils_1.sumUTXOs(utxos);
    });
    const safetyChecksPromise = Promise.all([
        blockstack.safety.isNameValid(name),
        blockstack.safety.ownsName(name, network.coerceAddress(ownerAddress)),
        blockstack.safety.isInGracePeriod(name),
        estimatePromise,
        paymentBalancePromise
    ])
        .then(([isNameValid, ownsName, isInGracePeriod, estimateCost, paymentBalance]) => {
        if (isNameValid && ownsName && !isInGracePeriod && estimateCost < paymentBalance) {
            return { 'status': true };
        }
        else {
            return {
                'status': false,
                'error': 'Name cannot be safely revoked',
                'isNameValid': isNameValid,
                'ownsName': ownsName,
                'isInGracePeriod': isInGracePeriod,
                'estimateCostBTC': estimateCost,
                'paymentBalanceBTC': paymentBalance
            };
        }
    });
    return safetyChecksPromise
        .then((safetyChecksResult) => {
        if (!safetyChecksResult.status) {
            return new Promise((resolve) => resolve(utils_1.JSONStringify(safetyChecksResult, true)));
        }
        if (txOnly) {
            return txPromise;
        }
        return txPromise.then((tx) => {
            return network.broadcastTransaction(tx);
        })
            .then((txidHex) => {
            return txidHex;
        });
    });
}
/*
 * Generate and optionally send a namespace-preorder
 * args:
 * @namespace (string) the namespace to preorder
 * @address (string) the address to reveal the namespace
 * @paymentKey (string) the payment private key
 */
function namespacePreorder(network, args) {
    const namespaceID = args[0];
    const address = args[1];
    const paymentKey = utils_1.decodePrivateKey(args[2]);
    const paymentAddress = utils_1.getPrivateKeyAddress(network, paymentKey);
    const txPromise = blockstack.transactions.makeNamespacePreorder(namespaceID, address, paymentKey, !utils_1.hasKeys(paymentKey));
    const paymentUTXOsPromise = network.getUTXOs(paymentAddress);
    const estimatePromise = paymentUTXOsPromise.then((utxos) => {
        const numUTXOs = utxos.length;
        return blockstack.transactions.estimateNamespacePreorder(namespaceID, network.coerceAddress(address), network.coerceAddress(paymentAddress), numUTXOs);
    });
    if (estimateOnly) {
        return estimatePromise
            .then((cost) => String(cost));
    }
    if (!safetyChecks) {
        if (txOnly) {
            return txPromise;
        }
        else {
            return txPromise
                .then((tx) => {
                return network.broadcastTransaction(tx);
            });
        }
    }
    const paymentBalance = paymentUTXOsPromise.then((utxos) => {
        return utils_1.sumUTXOs(utxos);
    });
    const safetyChecksPromise = Promise.all([
        blockstack.safety.isNamespaceValid(namespaceID),
        blockstack.safety.isNamespaceAvailable(namespaceID),
        network.getNamespacePrice(namespaceID),
        network.getAccountBalance(paymentAddress, 'STACKS'),
        paymentBalance,
        estimatePromise
    ])
        .then(([isNamespaceValid, isNamespaceAvailable, namespacePrice, STACKSBalance, paymentBalance, estimate]) => {
        if (isNamespaceValid && isNamespaceAvailable &&
            (namespacePrice.units === 'BTC' ||
                (namespacePrice.units === 'STACKS' &&
                    namespacePrice.amount.cmp(STACKSBalance) <= 0)) &&
            paymentBalance >= estimate) {
            return { 'status': true };
        }
        else {
            return {
                'status': false,
                'error': 'Namespace cannot be safely preordered',
                'isNamespaceValid': isNamespaceValid,
                'isNamespaceAvailable': isNamespaceAvailable,
                'paymentBalanceBTC': paymentBalance,
                'paymentBalanceStacks': STACKSBalance.toString(),
                'namespaceCostUnits': namespacePrice.units,
                'namespaceCostAmount': namespacePrice.amount.toString(),
                'estimateCostBTC': estimate
            };
        }
    });
    return safetyChecksPromise
        .then((safetyChecksResult) => {
        if (!safetyChecksResult.status) {
            return new Promise((resolve) => resolve(utils_1.JSONStringify(safetyChecksResult)));
        }
        if (txOnly) {
            return txPromise;
        }
        return txPromise.then((tx) => {
            return network.broadcastTransaction(tx);
        })
            .then((txidHex) => {
            return txidHex;
        });
    });
}
/*
 * Generate and optionally send a namespace-reveal
 * args:
 * @name (string) the namespace to reveal
 * @revealAddr (string) the reveal address
 * @version (int) the namespace version bits
 * @lifetime (int) the name lifetime
 * @coeff (int) the multiplicative price coefficient
 * @base (int) the price base
 * @bucketString (string) the serialized bucket exponents
 * @nonalphaDiscount (int) the non-alpha price discount
 * @noVowelDiscount (int) the no-vowel price discount
 * @paymentKey (string) the payment private key
 */
function namespaceReveal(network, args) {
    const namespaceID = args[0];
    const revealAddr = args[1];
    const version = parseInt(args[2]);
    let lifetime = parseInt(args[3]);
    const coeff = parseInt(args[4]);
    const base = parseInt(args[5]);
    const bucketString = args[6];
    const nonalphaDiscount = parseInt(args[7]);
    const noVowelDiscount = parseInt(args[8]);
    const paymentKey = utils_1.decodePrivateKey(args[9]);
    const buckets = bucketString.split(',')
        .map((x) => { return parseInt(x); });
    if (lifetime < 0) {
        lifetime = 2 ** 32 - 1;
    }
    if (nonalphaDiscount === 0) {
        throw new Error('Cannot have a 0 non-alpha discount (pass 1 for no discount)');
    }
    if (noVowelDiscount === 0) {
        throw new Error('Cannot have a 0 no-vowel discount (pass 1 for no discount)');
    }
    const namespace = new blockstack.transactions.BlockstackNamespace(namespaceID);
    namespace.setVersion(version);
    namespace.setLifetime(lifetime);
    namespace.setCoeff(coeff);
    namespace.setBase(base);
    namespace.setBuckets(buckets);
    namespace.setNonalphaDiscount(nonalphaDiscount);
    namespace.setNoVowelDiscount(noVowelDiscount);
    const paymentAddress = utils_1.getPrivateKeyAddress(network, paymentKey);
    const paymentUTXOsPromise = network.getUTXOs(paymentAddress);
    const estimatePromise = paymentUTXOsPromise.then((utxos) => {
        const numUTXOs = utxos.length;
        return blockstack.transactions.estimateNamespaceReveal(namespace, network.coerceAddress(revealAddr), network.coerceAddress(paymentAddress), numUTXOs);
    });
    const txPromise = blockstack.transactions.makeNamespaceReveal(namespace, revealAddr, paymentKey, !utils_1.hasKeys(paymentKey));
    if (estimateOnly) {
        return estimatePromise
            .then((cost) => String(cost));
    }
    if (!safetyChecks) {
        if (txOnly) {
            return txPromise;
        }
        else {
            return txPromise
                .then((tx) => {
                return network.broadcastTransaction(tx);
            });
        }
    }
    const paymentBalancePromise = paymentUTXOsPromise.then((utxos) => {
        return utils_1.sumUTXOs(utxos);
    });
    const safetyChecksPromise = Promise.all([
        blockstack.safety.isNamespaceValid(namespaceID),
        blockstack.safety.isNamespaceAvailable(namespaceID),
        paymentBalancePromise,
        estimatePromise
    ])
        .then(([isNamespaceValid, isNamespaceAvailable, paymentBalance, estimate]) => {
        if (isNamespaceValid && isNamespaceAvailable &&
            paymentBalance >= estimate) {
            return { 'status': true };
        }
        else {
            return {
                'status': false,
                'error': 'Namespace cannot be safely revealed',
                'isNamespaceValid': isNamespaceValid,
                'isNamespaceAvailable': isNamespaceAvailable,
                'paymentBalanceBTC': paymentBalance,
                'estimateCostBTC': estimate
            };
        }
    });
    return safetyChecksPromise
        .then((safetyChecksResult) => {
        if (!safetyChecksResult.status) {
            return new Promise((resolve) => resolve(utils_1.JSONStringify(safetyChecksResult, true)));
        }
        if (txOnly) {
            return txPromise;
        }
        return txPromise.then((tx) => {
            return network.broadcastTransaction(tx);
        })
            .then((txidHex) => {
            return txidHex;
        });
    });
}
/*
 * Generate and optionally send a namespace-ready
 * args:
 * @namespaceID (string) the namespace ID
 * @revealKey (string) the hex-encoded reveal key
 */
function namespaceReady(network, args) {
    const namespaceID = args[0];
    const revealKey = utils_1.decodePrivateKey(args[1]);
    const revealAddress = utils_1.getPrivateKeyAddress(network, revealKey);
    const txPromise = blockstack.transactions.makeNamespaceReady(namespaceID, revealKey, !utils_1.hasKeys(revealKey));
    const revealUTXOsPromise = network.getUTXOs(revealAddress);
    const estimatePromise = revealUTXOsPromise.then((utxos) => {
        const numUTXOs = utxos.length;
        return blockstack.transactions.estimateNamespaceReady(namespaceID, numUTXOs);
    });
    if (estimateOnly) {
        return estimatePromise
            .then((cost) => String(cost));
    }
    if (!safetyChecks) {
        if (txOnly) {
            return txPromise;
        }
        else {
            return txPromise
                .then((tx) => {
                return network.broadcastTransaction(tx);
            });
        }
    }
    const revealBalancePromise = revealUTXOsPromise.then((utxos) => {
        return utils_1.sumUTXOs(utxos);
    });
    const safetyChecksPromise = Promise.all([
        blockstack.safety.isNamespaceValid(namespaceID),
        blockstack.safety.namespaceIsReady(namespaceID),
        blockstack.safety.revealedNamespace(namespaceID, revealAddress),
        revealBalancePromise,
        estimatePromise
    ])
        .then(([isNamespaceValid, isNamespaceReady, isRevealer, revealerBalance, estimate]) => {
        if (isNamespaceValid && !isNamespaceReady && isRevealer &&
            revealerBalance >= estimate) {
            return { 'status': true };
        }
        else {
            return {
                'status': false,
                'error': 'Namespace cannot be safely launched',
                'isNamespaceValid': isNamespaceValid,
                'isNamespaceReady': isNamespaceReady,
                'isPrivateKeyRevealer': isRevealer,
                'revealerBalanceBTC': revealerBalance,
                'estimateCostBTC': estimate
            };
        }
    });
    return safetyChecksPromise
        .then((safetyChecksResult) => {
        if (!safetyChecksResult.status) {
            return new Promise((resolve) => resolve(utils_1.JSONStringify(safetyChecksResult, true)));
        }
        if (txOnly) {
            return txPromise;
        }
        return txPromise.then((tx) => {
            return network.broadcastTransaction(tx);
        })
            .then((txidHex) => {
            return txidHex;
        });
    });
}
/*
 * Generate and send a name-import transaction
 * @name (string) the name to import
 * @IDrecipientAddr (string) the recipient of the name
 * @gaiaHubURL (string) the URL to the name's gaia hub
 * @importKey (string) the key to pay for the import
 * @zonefile (string) OPTIONAL: the path to the zone file to use (supercedes gaiaHubUrl)
 * @zonefileHash (string) OPTIONAL: the hash of the zone file (supercedes gaiaHubUrl and zonefile)
 */
function nameImport(network, args) {
    const name = args[0];
    const IDrecipientAddr = args[1];
    const gaiaHubUrl = args[2];
    const importKey = utils_1.decodePrivateKey(args[3]);
    const zonefilePath = args[4];
    let zonefileHash = args[5];
    let zonefile = '';
    if (safetyChecks && (typeof importKey !== 'string')) {
        // multisig import not supported, unless we're testing 
        throw new Error('Invalid argument: multisig is not supported at this time');
    }
    if (!IDrecipientAddr.startsWith('ID-')) {
        throw new Error('Recipient ID-address must start with ID-');
    }
    const recipientAddr = IDrecipientAddr.slice(3);
    if (zonefilePath && !zonefileHash) {
        zonefile = fs.readFileSync(zonefilePath).toString();
    }
    else if (!zonefileHash && !zonefilePath) {
        // make zone file and hash from gaia hub url
        const mainnetAddress = network.coerceMainnetAddress(recipientAddr);
        const profileUrl = `${gaiaHubUrl}/${mainnetAddress}/profile.json`;
        try {
            utils_1.checkUrl(profileUrl);
        }
        catch (e) {
            return Promise.resolve().then(() => utils_1.JSONStringify({
                'status': false,
                'error': e.message,
                'hints': [
                    'Make sure the Gaia hub URL does not have any trailing /\'s',
                    'Make sure the Gaia hub URL scheme is present and well-formed'
                ]
            }, true));
        }
        zonefile = blockstack.makeProfileZoneFile(name, profileUrl);
        zonefileHash = utils_1.hash160(Buffer.from(zonefile)).toString('hex');
    }
    const namespaceID = name.split('.').slice(-1)[0];
    const importAddress = utils_1.getPrivateKeyAddress(network, importKey);
    const txPromise = blockstack.transactions.makeNameImport(name, recipientAddr, zonefileHash, importKey, !utils_1.hasKeys(importKey));
    const importUTXOsPromise = network.getUTXOs(importAddress);
    const estimatePromise = importUTXOsPromise.then((utxos) => {
        const numUTXOs = utxos.length;
        return blockstack.transactions.estimateNameImport(name, recipientAddr, zonefileHash, numUTXOs);
    });
    if (estimateOnly) {
        return estimatePromise
            .then((cost) => String(cost));
    }
    if (!safetyChecks) {
        if (txOnly) {
            return txPromise;
        }
        else {
            return txPromise
                .then((tx) => {
                return utils_1.broadcastTransactionAndZoneFile(network, tx, zonefile);
            })
                .then((resp) => {
                if (resp.status && resp.hasOwnProperty('txid')) {
                    // just return txid 
                    return resp.txid;
                }
                else {
                    // some error 
                    return utils_1.JSONStringify(resp, true);
                }
            });
        }
    }
    const importBalancePromise = importUTXOsPromise.then((utxos) => {
        return utils_1.sumUTXOs(utxos);
    });
    const safetyChecksPromise = Promise.all([
        blockstack.safety.namespaceIsReady(namespaceID),
        blockstack.safety.namespaceIsRevealed(namespaceID),
        blockstack.safety.addressCanReceiveName(recipientAddr),
        importBalancePromise,
        estimatePromise
    ])
        .then(([isNamespaceReady, isNamespaceRevealed, addressCanReceive, importBalance, estimate]) => {
        if (!isNamespaceReady && isNamespaceRevealed && addressCanReceive &&
            importBalance >= estimate) {
            return { 'status': true };
        }
        else {
            return {
                'status': false,
                'error': 'Name cannot be safetly imported',
                'isNamespaceReady': isNamespaceReady,
                'isNamespaceRevealed': isNamespaceRevealed,
                'addressCanReceiveName': addressCanReceive,
                'importBalanceBTC': importBalance,
                'estimateCostBTC': estimate
            };
        }
    });
    return safetyChecksPromise
        .then((safetyChecksResult) => {
        if (!safetyChecksResult.status) {
            return new Promise((resolve) => resolve(utils_1.JSONStringify(safetyChecksResult, true)));
        }
        if (txOnly) {
            return txPromise;
        }
        return txPromise
            .then((tx) => {
            return utils_1.broadcastTransactionAndZoneFile(network, tx, zonefile);
        })
            .then((resp) => {
            if (resp.status && resp.hasOwnProperty('txid')) {
                // just return txid 
                return resp.txid;
            }
            else {
                // some error 
                return utils_1.JSONStringify(resp, true);
            }
        });
    });
}
/*
 * Announce a message to subscribed peers by means of an Atlas zone file
 * @messageHash (string) the hash of the already-sent message
 * @senderKey (string) the key that owns the name that the peers have subscribed to
 */
function announce(network, args) {
    const messageHash = args[0];
    const senderKey = utils_1.decodePrivateKey(args[1]);
    const senderAddress = utils_1.getPrivateKeyAddress(network, senderKey);
    const txPromise = blockstack.transactions.makeAnnounce(messageHash, senderKey, !utils_1.hasKeys(senderKey));
    const senderUTXOsPromise = network.getUTXOs(senderAddress);
    const estimatePromise = senderUTXOsPromise.then((utxos) => {
        const numUTXOs = utxos.length;
        return blockstack.transactions.estimateAnnounce(messageHash, numUTXOs);
    });
    if (estimateOnly) {
        return estimatePromise
            .then((cost) => String(cost));
    }
    if (!safetyChecks) {
        if (txOnly) {
            return txPromise;
        }
        else {
            return txPromise
                .then((tx) => {
                return network.broadcastTransaction(tx);
            });
        }
    }
    const senderBalancePromise = senderUTXOsPromise.then((utxos) => {
        return utils_1.sumUTXOs(utxos);
    });
    const safetyChecksPromise = Promise.all([senderBalancePromise, estimatePromise])
        .then(([senderBalance, estimate]) => {
        if (senderBalance >= estimate) {
            return { 'status': true };
        }
        else {
            return {
                'status': false,
                'error': 'Announcement cannot be safely sent',
                'senderBalanceBTC': senderBalance,
                'estimateCostBTC': estimate
            };
        }
    });
    return safetyChecksPromise
        .then((safetyChecksResult) => {
        if (!safetyChecksResult.status) {
            return new Promise((resolve) => resolve(utils_1.JSONStringify(safetyChecksResult, true)));
        }
        if (txOnly) {
            return txPromise;
        }
        return txPromise.then((tx) => {
            return network.broadcastTransaction(tx);
        })
            .then((txidHex) => {
            return txidHex;
        });
    });
}
/*
 * Register a name the easy way.  Send the preorder
 * and register transactions to the broadcaster, as
 * well as the zone file.  Also create and replicate
 * the profile to the Gaia hub.
 * @arg name (string) the name to register
 * @arg ownerKey (string) the hex-encoded owner private key (must be singlesig)
 * @arg paymentKey (string) the hex-encoded payment key to purchase this name
 * @arg gaiaHubUrl (string) the write endpoint of the gaia hub URL to use
 * @arg zonefile (string) OPTIONAL the path to the zone file to give this name.
 *  supercedes gaiaHubUrl
 */
function register(network, args) {
    const name = args[0];
    const ownerKey = args[1];
    const paymentKey = utils_1.decodePrivateKey(args[2]);
    const gaiaHubUrl = args[3];
    const address = utils_1.getPrivateKeyAddress(network, ownerKey);
    const emptyProfile = { type: '@Person', account: [] };
    let zonefilePromise;
    if (args.length > 4 && !!args[4]) {
        const zonefilePath = args[4];
        zonefilePromise = Promise.resolve().then(() => fs.readFileSync(zonefilePath).toString());
    }
    else {
        // generate one
        zonefilePromise = data_1.makeZoneFileFromGaiaUrl(network, name, gaiaHubUrl, ownerKey);
    }
    let preorderTx = '';
    let registerTx = '';
    let broadcastResult = null;
    let zonefile = '';
    return zonefilePromise.then((zf) => {
        zonefile = zf;
        // carry out safety checks for preorder and register
        const preorderSafetyCheckPromise = txPreorder(network, [name, `ID-${address}`, args[2]], true);
        const registerSafetyCheckPromise = txRegister(network, [name, `ID-${address}`, args[2], zf], true);
        return Promise.all([preorderSafetyCheckPromise, registerSafetyCheckPromise]);
    })
        .then(([preorderSafetyChecks, registerSafetyChecks]) => {
        if (!checkTxStatus(preorderSafetyChecks) || !checkTxStatus(registerSafetyChecks)) {
            try {
                preorderSafetyChecks = JSON.parse(preorderSafetyChecks);
            }
            catch (e) {
            }
            try {
                registerSafetyChecks = JSON.parse(registerSafetyChecks);
            }
            catch (e) {
            }
            // one or both safety checks failed 
            throw new utils_1.SafetyError({
                'status': false,
                'error': 'Failed to generate one or more transactions',
                'preorderSafetyChecks': preorderSafetyChecks,
                'registerSafetyChecks': registerSafetyChecks
            });
        }
        // will have only gotten back the raw tx (which we'll discard anyway,
        // since we have to use the right UTXOs)
        return blockstack.transactions.makePreorder(name, address, paymentKey, !utils_1.hasKeys(paymentKey));
    })
        .then((rawTx) => {
        preorderTx = rawTx;
        return rawTx;
    })
        .then((rawTx) => {
        // make it so that when we generate the NAME_REGISTRATION operation,
        // we consume the change output from the NAME_PREORDER.
        network.modifyUTXOSetFrom(rawTx);
        return rawTx;
    })
        .then(() => {
        // now we can make the NAME_REGISTRATION 
        return blockstack.transactions.makeRegister(name, address, paymentKey, zonefile, null, !utils_1.hasKeys(paymentKey));
    })
        .then((rawTx) => {
        registerTx = rawTx;
        return rawTx;
    })
        .then((rawTx) => {
        // make sure we don't double-spend the NAME_REGISTRATION before it is broadcasted
        network.modifyUTXOSetFrom(rawTx);
    })
        .then(() => {
        if (txOnly) {
            return Promise.resolve().then(() => {
                const txData = {
                    preorder: preorderTx,
                    register: registerTx,
                    zonefile: zonefile
                };
                return txData;
            });
        }
        else {
            return network.broadcastNameRegistration(preorderTx, registerTx, zonefile);
        }
    })
        .then((txResult) => {
        // sign and upload profile
        broadcastResult = txResult;
        const signedProfileData = utils_1.makeProfileJWT(emptyProfile, ownerKey);
        return data_1.gaiaUploadProfileAll(network, [gaiaHubUrl], signedProfileData, ownerKey);
    })
        .then((gaiaUrls) => {
        if (gaiaUrls.hasOwnProperty('error')) {
            return utils_1.JSONStringify({
                'profileUrls': gaiaUrls,
                'txInfo': broadcastResult
            }, true);
        }
        return utils_1.JSONStringify({
            'profileUrls': gaiaUrls.dataUrls,
            'txInfo': broadcastResult
        });
    })
        .catch((e) => {
        if (e.hasOwnProperty('safetyErrors')) {
            // safety error; return as JSON 
            return e.message;
        }
        else {
            throw e;
        }
    });
}
/*
 * Register a name the easy way to an ID-address.  Send the preorder
 * and register transactions to the broadcaster, as
 * well as the zone file.
 * @arg name (string) the name to register
 * @arg ownerAddress (string) the ID-address of the owner
 * @arg paymentKey (string) the hex-encoded payment key to purchase this name
 * @arg gaiaHubUrl (string) the gaia hub URL to use
 * @arg zonefile (string) OPTIONAL the path to the zone file to give this name.
 *  supercedes gaiaHubUrl
 */
function registerAddr(network, args) {
    const name = args[0];
    const IDaddress = args[1];
    const paymentKey = utils_1.decodePrivateKey(args[2]);
    const gaiaHubUrl = args[3];
    const address = IDaddress.slice(3);
    const mainnetAddress = network.coerceMainnetAddress(address);
    let zonefile = '';
    if (args.length > 4 && !!args[4]) {
        const zonefilePath = args[4];
        zonefile = fs.readFileSync(zonefilePath).toString();
    }
    else {
        // generate one 
        const profileUrl = `${gaiaHubUrl.replace(/\/+$/g, '')}/${mainnetAddress}/profile.json`;
        try {
            utils_1.checkUrl(profileUrl);
        }
        catch (e) {
            return Promise.resolve().then(() => utils_1.JSONStringify({
                'status': false,
                'error': e.message,
                'hints': [
                    'Make sure the Gaia hub URL does not have any trailing /\'s',
                    'Make sure the Gaia hub URL scheme is present and well-formed'
                ]
            }));
        }
        zonefile = blockstack.makeProfileZoneFile(name, profileUrl);
    }
    let preorderTx = '';
    let registerTx = '';
    // carry out safety checks for preorder and register 
    const preorderSafetyCheckPromise = txPreorder(network, [name, `ID-${address}`, args[2]], true);
    const registerSafetyCheckPromise = txRegister(network, [name, `ID-${address}`, args[2], zonefile], true);
    return Promise.all([preorderSafetyCheckPromise, registerSafetyCheckPromise])
        .then(([preorderSafetyChecks, registerSafetyChecks]) => {
        if (!checkTxStatus(preorderSafetyChecks) || !checkTxStatus(registerSafetyChecks)) {
            // one or both safety checks failed 
            throw new utils_1.SafetyError({
                'status': false,
                'error': 'Failed to generate one or more transactions',
                'preorderSafetyChecks': preorderSafetyChecks,
                'registerSafetyChecks': registerSafetyChecks
            });
        }
        // will have only gotten back the raw tx (which we'll discard anyway,
        // since we have to use the right UTXOs)
        return blockstack.transactions.makePreorder(name, address, paymentKey, !utils_1.hasKeys(paymentKey));
    })
        .then((rawTx) => {
        preorderTx = rawTx;
        return rawTx;
    })
        .then((rawTx) => {
        // make it so that when we generate the NAME_REGISTRATION operation,
        // we consume the change output from the NAME_PREORDER.
        network.modifyUTXOSetFrom(rawTx);
        return rawTx;
    })
        .then(() => {
        // now we can make the NAME_REGISTRATION 
        return blockstack.transactions.makeRegister(name, address, paymentKey, zonefile, null, !utils_1.hasKeys(paymentKey));
    })
        .then((rawTx) => {
        registerTx = rawTx;
        return rawTx;
    })
        .then((rawTx) => {
        // make sure we don't double-spend the NAME_REGISTRATION before it is broadcasted
        network.modifyUTXOSetFrom(rawTx);
    })
        .then(() => {
        if (txOnly) {
            return Promise.resolve().then(() => {
                const txData = {
                    preorder: preorderTx,
                    register: registerTx,
                    zonefile: zonefile
                };
                return txData;
            });
        }
        else {
            return network.broadcastNameRegistration(preorderTx, registerTx, zonefile);
        }
    })
        .then((txResult) => {
        // succcess! 
        return utils_1.JSONStringify({
            'txInfo': txResult
        });
    })
        .catch((e) => {
        if (e.hasOwnProperty('safetyErrors')) {
            // safety error; return as JSON 
            return e.message;
        }
        else {
            throw e;
        }
    });
}
/*
 * Register a subdomain name the easy way.  Send the
 * zone file and signed subdomain records to the subdomain registrar.
 * @arg name (string) the name to register
 * @arg ownerKey (string) the hex-encoded owner private key (must be single-sig)
 * @arg gaiaHubUrl (string) the write endpoint of the gaia hub URL to use
 * @arg registrarUrl (string) OPTIONAL the registrar URL
 * @arg zonefile (string) OPTIONAL the path to the zone file to give this name.
 *  supercedes gaiaHubUrl
 */
function registerSubdomain(network, args) {
    const name = args[0];
    const ownerKey = utils_1.decodePrivateKey(args[1]);
    const gaiaHubUrl = args[2];
    const registrarUrl = args[3];
    const address = utils_1.getPrivateKeyAddress(network, ownerKey);
    const mainnetAddress = network.coerceMainnetAddress(address);
    const emptyProfile = { type: '@Person', account: [] };
    const onChainName = name.split('.').slice(-2).join('.');
    const subName = name.split('.')[0];
    let zonefilePromise;
    if (args.length > 4 && !!args[4]) {
        const zonefilePath = args[4];
        zonefilePromise = Promise.resolve().then(() => fs.readFileSync(zonefilePath).toString());
    }
    else {
        // generate one 
        zonefilePromise = data_1.makeZoneFileFromGaiaUrl(network, name, gaiaHubUrl, args[1]);
    }
    const api_key = process.env.API_KEY || null;
    const onChainNamePromise = utils_1.getNameInfoEasy(network, onChainName);
    const registrarStatusPromise = node_fetch_1.default(`${registrarUrl}/index`)
        .then((resp) => resp.json());
    const profileUploadPromise = Promise.resolve().then(() => {
        // sign and upload profile
        const signedProfileData = utils_1.makeProfileJWT(emptyProfile, args[1]);
        return data_1.gaiaUploadProfileAll(network, [gaiaHubUrl], signedProfileData, args[1]);
    })
        .then((gaiaUrls) => {
        if (!!gaiaUrls.error) {
            return { profileUrls: null, error: gaiaUrls.error };
        }
        else {
            return { profileUrls: gaiaUrls.dataUrls };
        }
    });
    let safetyChecksPromise = null;
    if (safetyChecks) {
        safetyChecksPromise = Promise.all([
            onChainNamePromise,
            blockstack.safety.isNameAvailable(name),
            registrarStatusPromise
        ])
            .then(([onChainNameInfo, isNameAvailable, registrarStatus]) => {
            if (safetyChecks) {
                const registrarName = (!!registrarStatus && registrarStatus.hasOwnProperty('domainName')) ?
                    registrarStatus.domainName :
                    '<unknown>';
                if (!onChainNameInfo || !isNameAvailable ||
                    (registrarName !== '<unknown>' && registrarName !== onChainName)) {
                    return {
                        'status': false,
                        'error': 'Subdomain cannot be safely registered',
                        'onChainNameInfo': onChainNameInfo,
                        'isNameAvailable': isNameAvailable,
                        'onChainName': onChainName,
                        'registrarName': registrarName
                    };
                }
            }
            return { 'status': true };
        });
    }
    else {
        safetyChecksPromise = Promise.resolve().then(() => {
            return {
                'status': true
            };
        });
    }
    return Promise.all([safetyChecksPromise, zonefilePromise])
        .then(([safetyChecks, zonefile]) => {
        if (safetyChecks.status) {
            const request = {
                'zonefile': zonefile,
                'name': subName,
                'owner_address': mainnetAddress
            };
            const options = {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': ''
                },
                body: JSON.stringify(request)
            };
            if (!!api_key) {
                options.headers.Authorization = `bearer ${api_key}`;
            }
            const registerPromise = node_fetch_1.default(`${registrarUrl}/register`, options)
                .then(resp => resp.json());
            return Promise.all([registerPromise, profileUploadPromise])
                .then(([registerInfo, profileUploadInfo]) => {
                if (!profileUploadInfo.error) {
                    return utils_1.JSONStringify({
                        'txInfo': registerInfo,
                        'profileUrls': profileUploadInfo.profileUrls
                    });
                }
                else {
                    return utils_1.JSONStringify({
                        'error': profileUploadInfo.error
                    }, true);
                }
            });
        }
        else {
            return Promise.resolve().then(() => utils_1.JSONStringify(safetyChecks, true));
        }
    });
}
/*
 * Sign a profile.
 * @path (string) path to the profile
 * @privateKey (string) the owner key (must be single-sig)
 */
function profileSign(network, args) {
    const profilePath = args[0];
    const profileData = JSON.parse(fs.readFileSync(profilePath).toString());
    return Promise.resolve().then(() => utils_1.makeProfileJWT(profileData, args[1]));
}
/*
 * Verify a profile with an address or public key
 * @path (string) path to the profile
 * @publicKeyOrAddress (string) public key or address
 */
function profileVerify(network, args) {
    const profilePath = args[0];
    let publicKeyOrAddress = args[1];
    // need to coerce mainnet 
    if (publicKeyOrAddress.match(argparse_1.ID_ADDRESS_PATTERN)) {
        publicKeyOrAddress = network.coerceMainnetAddress(publicKeyOrAddress.slice(3));
    }
    const profileString = fs.readFileSync(profilePath).toString();
    return Promise.resolve().then(() => {
        let profileToken = null;
        try {
            const profileTokens = JSON.parse(profileString);
            profileToken = profileTokens[0].token;
        }
        catch (e) {
            // might be a raw token 
            profileToken = profileString;
        }
        if (!profileToken) {
            throw new Error(`Data at ${profilePath} does not appear to be a signed profile`);
        }
        const profile = blockstack.extractProfile(profileToken, publicKeyOrAddress);
        return utils_1.JSONStringify(profile);
    });
}
/*
 * Store a signed profile for a name or an address.
 * * verify that the profile was signed by the name's owner address
 * * verify that the private key matches the name's owner address
 *
 * Assumes that the URI records are all Gaia hubs
 *
 * @nameOrAddress (string) name or address that owns the profile
 * @path (string) path to the signed profile token
 * @privateKey (string) owner private key for the name
 * @gaiaUrl (string) this is the write endpoint of the Gaia hub to use
 */
function profileStore(network, args) {
    const nameOrAddress = args[0];
    const signedProfilePath = args[1];
    const privateKey = utils_1.decodePrivateKey(args[2]);
    const gaiaHubUrl = args[3];
    const signedProfileData = fs.readFileSync(signedProfilePath).toString();
    const ownerAddress = utils_1.getPrivateKeyAddress(network, privateKey);
    const ownerAddressMainnet = network.coerceMainnetAddress(ownerAddress);
    let nameInfoPromise;
    let name = '';
    if (nameOrAddress.startsWith('ID-')) {
        // ID-address
        nameInfoPromise = Promise.resolve().then(() => {
            return {
                'address': nameOrAddress.slice(3)
            };
        });
    }
    else {
        // name; find the address 
        nameInfoPromise = utils_1.getNameInfoEasy(network, nameOrAddress);
        name = nameOrAddress;
    }
    const verifyProfilePromise = profileVerify(network, [signedProfilePath, `ID-${ownerAddressMainnet}`]);
    return Promise.all([nameInfoPromise, verifyProfilePromise])
        .then(([nameInfo, _verifiedProfile]) => {
        if (safetyChecks && (!nameInfo ||
            network.coerceAddress(nameInfo.address) !== network.coerceAddress(ownerAddress))) {
            throw new Error('Name owner address either could not be found, or does not match ' +
                `private key address ${ownerAddress}`);
        }
        return data_1.gaiaUploadProfileAll(network, [gaiaHubUrl], signedProfileData, args[2], name);
    })
        .then((gaiaUrls) => {
        if (gaiaUrls.hasOwnProperty('error')) {
            return utils_1.JSONStringify(gaiaUrls, true);
        }
        else {
            return utils_1.JSONStringify({ 'profileUrls': gaiaUrls.dataUrls });
        }
    });
}
/*
 * Push a zonefile to the Atlas network
 * @zonefileDataOrPath (string) the zonefile data to push, or the path to the data
 */
function zonefilePush(network, args) {
    const zonefileDataOrPath = args[0];
    let zonefileData = null;
    try {
        zonefileData = fs.readFileSync(zonefileDataOrPath).toString();
    }
    catch (e) {
        zonefileData = zonefileDataOrPath;
    }
    return network.broadcastZoneFile(zonefileData)
        .then((result) => {
        return utils_1.JSONStringify(result);
    });
}
/*
 * Get the app private key(s) from a backup phrase and an ID-address
 * args:
 * @mnemonic (string) the 12-word phrase
 * @nameOrIDAddress (string) the name or ID-address
 * @appOrigin (string) the application's origin URL
 */
async function getAppKeys(network, args) {
    const mnemonic = await utils_1.getBackupPhrase(args[0]);
    const nameOrIDAddress = args[1];
    const origin = args[2];
    const idAddress = await utils_1.getIDAddress(network, nameOrIDAddress);
    const networkInfo = await keys_1.getApplicationKeyInfo(network, mnemonic, idAddress, origin);
    return utils_1.JSONStringify(networkInfo);
}
/*
 * Get the owner private key(s) from a backup phrase
 * args:
 * @mnemonic (string) the 12-word phrase
 * @max_index (integer) (optional) the profile index maximum
 */
async function getOwnerKeys(network, args) {
    const mnemonic = await utils_1.getBackupPhrase(args[0]);
    let maxIndex = 1;
    if (args.length > 1 && !!args[1]) {
        maxIndex = parseInt(args[1]);
    }
    const keyInfo = [];
    for (let i = 0; i < maxIndex; i++) {
        keyInfo.push(await keys_1.getOwnerKeyInfo(network, mnemonic, i));
    }
    return utils_1.JSONStringify(keyInfo);
}
/*
 * Get the payment private key from a backup phrase
 * args:
 * @mnemonic (string) the 12-word phrase
 */
async function getPaymentKey(network, args) {
    const mnemonic = await utils_1.getBackupPhrase(args[0]);
    // keep the return value consistent with getOwnerKeys 
    const keyObj = await keys_1.getPaymentKeyInfo(network, mnemonic);
    const keyInfo = [];
    keyInfo.push(keyObj);
    return utils_1.JSONStringify(keyInfo);
}
/*
 * Get the payment private key from a backup phrase used by the Stacks wallet
 * args:
 * @mnemonic (string) the 24-word phrase
 */
async function getStacksWalletKey(network, args) {
    const mnemonic = await utils_1.getBackupPhrase(args[0]);
    // keep the return value consistent with getOwnerKeys
    const keyObj = await keys_1.getStacksWalletKeyInfo(network, mnemonic);
    const keyInfo = [];
    keyInfo.push(keyObj);
    return utils_1.JSONStringify(keyInfo);
}
/*
 * Make a private key and output it
 * args:
 * @mnemonic (string) OPTIONAL; the 12-word phrase
 */
async function makeKeychain(network, args) {
    let mnemonic;
    if (args[0]) {
        mnemonic = await utils_1.getBackupPhrase(args[0]);
    }
    else {
        mnemonic = await bip39.generateMnemonic(keys_1.STX_WALLET_COMPATIBLE_SEED_STRENGTH, crypto.randomBytes);
    }
    const stacksKeyInfo = await keys_1.getStacksWalletKeyInfo(network, mnemonic);
    return utils_1.JSONStringify({
        'mnemonic': mnemonic,
        'keyInfo': stacksKeyInfo
    });
}
/*
 * Get an address's tokens and their balances.
 * Takes either a Bitcoin or Stacks address
 * args:
 * @address (string) the address
 */
function balance(network, args) {
    let address = args[0];
    if (BLOCKSTACK_TEST) {
        // force testnet address if we're in regtest or testnet mode
        address = network.coerceAddress(address);
    }
    return node_fetch_1.default(`${network.blockstackAPIUrl}/v2/accounts/${address}?proof=0`)
        .then((response) => response.json())
        .then((response) => {
        let balanceHex = response.balance;
        if (balanceHex.startsWith('0x')) {
            balanceHex = balanceHex.substr(2);
        }
        const balance = new BN(balanceHex, 16);
        const res = {
            balance: balance.toString(10),
            nonce: response.nonce
        };
        return Promise.resolve(utils_1.JSONStringify(res));
    });
}
/*
 * Get a page of the account's history
 * args:
 * @address (string) the account address
 * @page (int) the page of the history to fetch (optional)
 */
function getAccountHistory(network, args) {
    const address = c32check.c32ToB58(args[0]);
    if (args.length >= 2 && !!args[1]) {
        const page = parseInt(args[1]);
        return Promise.resolve().then(() => {
            return network.getAccountHistoryPage(address, page);
        })
            .then(accountStates => utils_1.JSONStringify(accountStates.map((s) => {
            const new_s = {
                address: c32check.b58ToC32(s.address),
                credit_value: s.credit_value.toString(),
                debit_value: s.debit_value.toString()
            };
            return new_s;
        })));
    }
    else {
        // all pages 
        let history = [];
        function getAllAccountHistoryPages(page) {
            return network.getAccountHistoryPage(address, page)
                .then((results) => {
                if (results.length == 0) {
                    return history;
                }
                else {
                    history = history.concat(results);
                    return getAllAccountHistoryPages(page + 1);
                }
            });
        }
        return getAllAccountHistoryPages(0)
            .then((accountStates) => utils_1.JSONStringify(accountStates.map((s) => {
            const new_s = {
                address: c32check.b58ToC32(s.address),
                credit_value: s.credit_value.toString(),
                debit_value: s.debit_value.toString()
            };
            return new_s;
        })));
    }
}
/*
 * Get the account's state(s) at a particular block height
 * args:
 * @address (string) the account address
 * @blockHeight (int) the height at which to query
 */
function getAccountAt(network, args) {
    const address = c32check.c32ToB58(args[0]);
    const blockHeight = parseInt(args[1]);
    return Promise.resolve().then(() => {
        return network.getAccountAt(address, blockHeight);
    })
        .then(accountStates => accountStates.map((s) => {
        const new_s = {
            address: c32check.b58ToC32(s.address),
            credit_value: s.credit_value.toString(),
            debit_value: s.debit_value.toString()
        };
        return new_s;
    }))
        .then(history => utils_1.JSONStringify(history));
}
/*
 * Sends BTC from one private key to another address
 * args:
 * @recipientAddress (string) the recipient's address
 * @amount (string) the amount of BTC to send
 * @privateKey (string) the private key that owns the BTC
 */
function sendBTC(network, args) {
    const destinationAddress = args[0];
    const amount = parseInt(args[1]);
    const paymentKeyHex = utils_1.decodePrivateKey(args[2]);
    if (amount <= 5500) {
        throw new Error('Invalid amount (must be greater than 5500)');
    }
    let paymentKey;
    if (typeof paymentKeyHex === 'string') {
        // single-sig
        paymentKey = blockstack.PubkeyHashSigner.fromHexString(paymentKeyHex);
    }
    else {
        // multi-sig or segwit 
        paymentKey = paymentKeyHex;
    }
    const txPromise = blockstack.transactions.makeBitcoinSpend(destinationAddress, paymentKey, amount, !utils_1.hasKeys(paymentKeyHex))
        .catch((e) => {
        if (e.name === 'InvalidAmountError') {
            return utils_1.JSONStringify({
                'status': false,
                'error': e.message
            }, true);
        }
        else {
            throw e;
        }
    });
    if (txOnly) {
        return txPromise;
    }
    else {
        return txPromise.then((tx) => {
            return network.broadcastTransaction(tx);
        })
            .then((txid) => {
            return txid;
        });
    }
}
/*
 * Send tokens from one account private key to another account's address.
 * args:
 * @recipientAddress (string) the recipient's account address
 * @tokenAmount (int) the number of tokens to send
 * @feeRate (int) the fee rate to pay
 * @nonce (int) integer nonce needs to be incremented after each transaction from an account
 * @privateKey (string) the hex-encoded private key to use to send the tokens
 * @memo (string) OPTIONAL: a 34-byte memo to include
 */
function sendTokens(network, args) {
    const recipientAddress = args[0];
    const tokenAmount = new BN(args[1]);
    const feeRate = new BN(args[2]);
    const nonce = new BN(args[3]);
    const privateKey = args[4];
    let memo = '';
    if (args.length > 4 && !!args[5]) {
        memo = args[5];
    }
    const options = {
        nonce,
        memo,
        version: network.isMainnet() ? stacks_transactions_1.TransactionVersion.Mainnet : stacks_transactions_1.TransactionVersion.Testnet,
        chainId: stacks_transactions_1.TransactionVersion.Testnet ? 0x80000000 : 0x00000000
    };
    const tx = stacks_transactions_1.makeSTXTokenTransfer(recipientAddress, tokenAmount, feeRate, privateKey, options);
    if (txOnly) {
        return Promise.resolve(tx.serialize().toString('hex'));
    }
    return tx.broadcast(defaultV2BroadcastUrl).then(() => {
        return tx.txid();
    }).catch((error) => {
        return error.toString();
    });
}
/*
 * Get the number of confirmations of a txid.
 * args:
 * @txid (string) the transaction ID as a hex string
 */
function getConfirmations(network, args) {
    const txid = args[0];
    return Promise.all([network.getBlockHeight(), network.getTransactionInfo(txid)])
        .then(([blockHeight, txInfo]) => {
        return utils_1.JSONStringify({
            'blockHeight': txInfo.block_height,
            'confirmations': blockHeight - txInfo.block_height + 1
        });
    })
        .catch((e) => {
        if (e.message.toLowerCase() === 'unconfirmed transaction') {
            return utils_1.JSONStringify({
                'blockHeight': 'unconfirmed',
                'confirmations': 0
            });
        }
        else {
            throw e;
        }
    });
}
/*
 * Get the address of a private key
 * args:
 * @private_key (string) the hex-encoded private key or key bundle
 */
function getKeyAddress(network, args) {
    const privateKey = utils_1.decodePrivateKey(args[0]);
    return Promise.resolve().then(() => {
        const addr = utils_1.getPrivateKeyAddress(network, privateKey);
        return utils_1.JSONStringify({
            'BTC': addr,
            'STACKS': c32check.b58ToC32(addr)
        });
    });
}
function getDidConfiguration(network, args) {
    const privateKey = utils_1.decodePrivateKey(args[2]);
    return utils_1.makeDIDConfiguration(network, args[0], args[1], args[2]).then(didConfiguration => {
        return utils_1.JSONStringify(didConfiguration);
    });
}
/*
 * Get a file from Gaia.
 * args:
 * @username (string) the blockstack ID of the user who owns the data
 * @origin (string) the application origin
 * @path (string) the file to read
 * @appPrivateKey (string) OPTIONAL: the app private key to decrypt/verify with
 * @decrypt (string) OPTINOAL: if '1' or 'true', then decrypt
 * @verify (string) OPTIONAL: if '1' or 'true', then search for and verify a signature file
 *  along with the data
 */
function gaiaGetFile(network, args) {
    const username = args[0];
    const origin = args[1];
    const path = args[2];
    let appPrivateKey = args[3];
    let decrypt = false;
    let verify = false;
    if (!!appPrivateKey && args.length > 4 && !!args[4]) {
        decrypt = (args[4].toLowerCase() === 'true' || args[4].toLowerCase() === '1');
    }
    if (!!appPrivateKey && args.length > 5 && !!args[5]) {
        verify = (args[5].toLowerCase() === 'true' || args[5].toLowerCase() === '1');
    }
    if (!appPrivateKey) {
        // make a fake private key (it won't be used)
        appPrivateKey = 'fda1afa3ff9ef25579edb5833b825ac29fae82d03db3f607db048aae018fe882';
    }
    // force mainnet addresses 
    blockstack.config.network.layer1 = bitcoin.networks.bitcoin;
    return data_1.gaiaAuth(network, appPrivateKey, null)
        .then((_userData) => blockstack.getFile(path, {
        decrypt: decrypt,
        verify: verify,
        app: origin,
        username: username
    }))
        .then((data) => {
        if (data instanceof ArrayBuffer) {
            return Buffer.from(data);
        }
        else {
            return data;
        }
    });
}
/*
 * Put a file into a Gaia hub
 * args:
 * @hubUrl (string) the URL to the write endpoint of the gaia hub
 * @appPrivateKey (string) the private key used to authenticate to the gaia hub
 * @dataPath (string) the path (on disk) to the data to store
 * @gaiaPath (string) the path (in Gaia) where the data will be stored
 * @encrypt (string) OPTIONAL: if '1' or 'true', then encrypt the file
 * @sign (string) OPTIONAL: if '1' or 'true', then sign the file and store the signature too.
 */
function gaiaPutFile(network, args) {
    const hubUrl = args[0];
    const appPrivateKey = args[1];
    const dataPath = args[2];
    const gaiaPath = path.normalize(args[3].replace(/^\/+/, ''));
    let encrypt = false;
    let sign = false;
    if (args.length > 4 && !!args[4]) {
        encrypt = (args[4].toLowerCase() === 'true' || args[4].toLowerCase() === '1');
    }
    if (args.length > 5 && !!args[5]) {
        sign = (args[5].toLowerCase() === 'true' || args[5].toLowerCase() === '1');
    }
    const data = fs.readFileSync(dataPath);
    // force mainnet addresses
    // TODO
    blockstack.config.network.layer1 = bitcoin.networks.bitcoin;
    return data_1.gaiaAuth(network, appPrivateKey, hubUrl)
        .then((_userData) => {
        return blockstack.putFile(gaiaPath, data, { encrypt: encrypt, sign: sign });
    })
        .then((url) => {
        return utils_1.JSONStringify({ 'urls': [url] });
    });
}
/*
 * Delete a file in a Gaia hub
 * args:
 * @hubUrl (string) the URL to the write endpoint of the gaia hub
 * @appPrivateKey (string) the private key used to authenticate to the gaia hub
 * @gaiaPath (string) the path (in Gaia) to delete
 * @wasSigned (string) OPTIONAL: if '1' or 'true'.  Delete the signature file as well.
 */
function gaiaDeleteFile(network, args) {
    const hubUrl = args[0];
    const appPrivateKey = args[1];
    const gaiaPath = path.normalize(args[2].replace(/^\/+/, ''));
    let wasSigned = false;
    if (args.length > 3 && !!args[3]) {
        wasSigned = (args[3].toLowerCase() === 'true' || args[3].toLowerCase() === '1');
    }
    // force mainnet addresses
    // TODO
    blockstack.config.network.layer1 = bitcoin.networks.bitcoin;
    return data_1.gaiaAuth(network, appPrivateKey, hubUrl)
        .then((_userData) => {
        return blockstack.deleteFile(gaiaPath, { wasSigned: wasSigned });
    })
        .then(() => {
        return utils_1.JSONStringify('ok');
    });
}
/*
 * List files in a Gaia hub
 * args:
 * @hubUrl (string) the URL to the write endpoint of the gaia hub
 * @appPrivateKey (string) the private key used to authenticate to the gaia hub
 */
function gaiaListFiles(network, args) {
    const hubUrl = args[0];
    const appPrivateKey = args[1];
    // force mainnet addresses
    // TODO
    let count = 0;
    blockstack.config.network.layer1 = bitcoin.networks.bitcoin;
    return data_1.gaiaAuth(network, utils_1.canonicalPrivateKey(appPrivateKey), hubUrl)
        .then((_userData) => {
        return blockstack.listFiles((name) => {
            // print out incrementally
            console.log(name);
            count += 1;
            return true;
        });
    })
        .then(() => utils_1.JSONStringify(count));
}
/*
 * Group array items into batches
 */
function batchify(input, batchSize = 50) {
    const output = [];
    let currentBatch = [];
    for (let i = 0; i < input.length; i++) {
        currentBatch.push(input[i]);
        if (currentBatch.length >= batchSize) {
            output.push(currentBatch);
            currentBatch = [];
        }
    }
    if (currentBatch.length > 0) {
        output.push(currentBatch);
    }
    return output;
}
/*
 * Dump all files from a Gaia hub bucket to a directory on disk.
 * args:
 * @nameOrIDAddress (string) the name or ID address that owns the bucket to dump
 * @appOrigin (string) the application for which to dump data
 * @hubUrl (string) the URL to the write endpoint of the gaia hub
 * @mnemonic (string) the 12-word phrase or ciphertext
 * @dumpDir (string) the directory to hold the dumped files
 */
function gaiaDumpBucket(network, args) {
    const nameOrIDAddress = args[0];
    const appOrigin = args[1];
    const hubUrl = args[2];
    const mnemonicOrCiphertext = args[3];
    let dumpDir = args[4];
    if (dumpDir.length === 0) {
        throw new Error('Invalid directory (not given)');
    }
    if (dumpDir[0] !== '/') {
        // relative path.  make absolute 
        const cwd = fs.realpathSync('.');
        dumpDir = path.normalize(`${cwd}/${dumpDir}`);
    }
    utils_1.mkdirs(dumpDir);
    function downloadFile(hubConfig, fileName) {
        const gaiaReadUrl = `${hubConfig.url_prefix.replace(/\/+$/, '')}/${hubConfig.address}`;
        const fileUrl = `${gaiaReadUrl}/${fileName}`;
        const destPath = `${dumpDir}/${fileName.replace(/\//g, '\\x2f')}`;
        console.log(`Download ${fileUrl} to ${destPath}`);
        return node_fetch_1.default(fileUrl)
            .then((resp) => {
            if (resp.status !== 200) {
                throw new Error(`Bad status code for ${fileUrl}: ${resp.status}`);
            }
            // javascript can be incredibly stupid at fetching data despite being a Web language...
            const contentType = resp.headers.get('Content-Type');
            if (contentType === null
                || contentType.startsWith('text')
                || contentType === 'application/json') {
                return resp.text();
            }
            else {
                return resp.arrayBuffer();
            }
        })
            .then((filebytes) => {
            return new Promise((resolve, reject) => {
                try {
                    fs.writeFileSync(destPath, Buffer.from(filebytes), { encoding: null, mode: 0o660 });
                    resolve();
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    }
    // force mainnet addresses
    // TODO: better way of doing this
    blockstack.config.network.layer1 = bitcoin.networks.bitcoin;
    const fileNames = [];
    let gaiaHubConfig;
    let appPrivateKey;
    let ownerPrivateKey;
    return utils_1.getIDAppKeys(network, nameOrIDAddress, appOrigin, mnemonicOrCiphertext)
        .then((keyInfo) => {
        appPrivateKey = keyInfo.appPrivateKey;
        ownerPrivateKey = keyInfo.ownerPrivateKey;
        return data_1.gaiaAuth(network, appPrivateKey, hubUrl, ownerPrivateKey);
    })
        .then((_userData) => {
        return data_1.gaiaConnect(network, hubUrl, appPrivateKey);
    })
        .then((hubConfig) => {
        gaiaHubConfig = hubConfig;
        return blockstack.listFiles((name) => {
            fileNames.push(name);
            return true;
        });
    })
        .then((fileCount) => {
        console.log(`Download ${fileCount} files...`);
        const fileBatches = batchify(fileNames);
        let filePromiseChain = Promise.resolve();
        for (let i = 0; i < fileBatches.length; i++) {
            const filePromises = fileBatches[i].map((fileName) => downloadFile(gaiaHubConfig, fileName));
            const batchPromise = Promise.all(filePromises);
            filePromiseChain = filePromiseChain.then(() => batchPromise);
        }
        return filePromiseChain.then(() => utils_1.JSONStringify(fileCount));
    });
}
/*
 * Restore all of the files in a Gaia bucket dump to a new Gaia hub
 * args:
 * @nameOrIDAddress (string) the name or ID address that owns the bucket to dump
 * @appOrigin (string) the origin of the app for which to restore data
 * @hubUrl (string) the URL to the write endpoint of the new gaia hub
 * @mnemonic (string) the 12-word phrase or ciphertext
 * @dumpDir (string) the directory to hold the dumped files
 */
function gaiaRestoreBucket(network, args) {
    const nameOrIDAddress = args[0];
    const appOrigin = args[1];
    const hubUrl = args[2];
    const mnemonicOrCiphertext = args[3];
    let dumpDir = args[4];
    if (dumpDir.length === 0) {
        throw new Error('Invalid directory (not given)');
    }
    if (dumpDir[0] !== '/') {
        // relative path.  make absolute 
        const cwd = fs.realpathSync('.');
        dumpDir = path.normalize(`${cwd}/${dumpDir}`);
    }
    const fileList = fs.readdirSync(dumpDir);
    const fileBatches = batchify(fileList, 10);
    let appPrivateKey;
    let ownerPrivateKey;
    // force mainnet addresses
    // TODO better way of doing this
    blockstack.config.network.layer1 = bitcoin.networks.bitcoin;
    return utils_1.getIDAppKeys(network, nameOrIDAddress, appOrigin, mnemonicOrCiphertext)
        .then((keyInfo) => {
        appPrivateKey = keyInfo.appPrivateKey;
        ownerPrivateKey = keyInfo.ownerPrivateKey;
        return data_1.gaiaAuth(network, appPrivateKey, hubUrl, ownerPrivateKey);
    })
        .then((_userData) => {
        let uploadPromise = Promise.resolve();
        for (let i = 0; i < fileBatches.length; i++) {
            const uploadBatchPromises = fileBatches[i].map((fileName) => {
                const filePath = path.join(dumpDir, fileName);
                const dataBuf = fs.readFileSync(filePath);
                const gaiaPath = fileName.replace(/\\x2f/g, '/');
                return blockstack.putFile(gaiaPath, dataBuf, { encrypt: false, sign: false })
                    .then((url) => {
                    console.log(`Uploaded ${fileName} to ${url}`);
                });
            });
            uploadPromise = uploadPromise.then(() => Promise.all(uploadBatchPromises));
        }
        return uploadPromise;
    })
        .then(() => utils_1.JSONStringify(fileList.length));
}
/*
 * Set the Gaia hub for an application for a blockstack ID.
 * args:
 * @blockstackID (string) the blockstack ID of the user
 * @profileHubUrl (string) the URL to the write endpoint of the user's profile gaia hub
 * @appOrigin (string) the application's Origin
 * @hubUrl (string) the URL to the write endpoint of the app's gaia hub
 * @mnemonic (string) the 12-word backup phrase, or the ciphertext of it
 */
async function gaiaSetHub(network, args) {
    network.setCoerceMainnetAddress(true);
    const blockstackID = args[0];
    const ownerHubUrl = args[1];
    const appOrigin = args[2];
    const hubUrl = args[3];
    const mnemonicPromise = utils_1.getBackupPhrase(args[4]);
    const nameInfoPromise = utils_1.getNameInfoEasy(network, blockstackID)
        .then((nameInfo) => {
        if (!nameInfo) {
            throw new Error('Name not found');
        }
        return nameInfo;
    });
    const profilePromise = blockstack.lookupProfile(blockstackID);
    const [nameInfo, nameProfile, mnemonic] = await Promise.all([nameInfoPromise, profilePromise, mnemonicPromise]);
    if (!nameProfile) {
        throw new Error('No profile found');
    }
    if (!nameInfo) {
        throw new Error('Name not found');
    }
    if (!nameInfo.zonefile) {
        throw new Error('No zone file found');
    }
    if (!nameProfile.apps) {
        nameProfile.apps = {};
    }
    // get owner ID-address
    const ownerAddress = network.coerceMainnetAddress(nameInfo.address);
    const idAddress = `ID-${ownerAddress}`;
    // get owner and app key info 
    const appKeyInfo = await keys_1.getApplicationKeyInfo(network, mnemonic, idAddress, appOrigin);
    const ownerKeyInfo = await keys_1.getOwnerKeyInfo(network, mnemonic, appKeyInfo.ownerKeyIndex);
    // do we already have an address set for this app?
    let existingAppAddress;
    let appPrivateKey;
    try {
        existingAppAddress = data_1.getGaiaAddressFromProfile(network, nameProfile, appOrigin);
        appPrivateKey = keys_1.extractAppKey(network, appKeyInfo, existingAppAddress);
    }
    catch (e) {
        console.log(`No profile application entry for ${appOrigin}`);
        appPrivateKey = keys_1.extractAppKey(network, appKeyInfo);
    }
    appPrivateKey = `${utils_1.canonicalPrivateKey(appPrivateKey)}01`;
    const appAddress = network.coerceMainnetAddress(utils_1.getPrivateKeyAddress(network, appPrivateKey));
    if (existingAppAddress && appAddress !== existingAppAddress) {
        throw new Error(`BUG: ${existingAppAddress} !== ${appAddress}`);
    }
    const profile = nameProfile;
    const ownerPrivateKey = ownerKeyInfo.privateKey;
    const ownerGaiaHubPromise = data_1.gaiaConnect(network, ownerHubUrl, ownerPrivateKey);
    const appGaiaHubPromise = data_1.gaiaConnect(network, hubUrl, appPrivateKey);
    const [ownerHubConfig, appHubConfig] = await Promise.all([ownerGaiaHubPromise, appGaiaHubPromise]);
    if (!ownerHubConfig.url_prefix) {
        throw new Error('Invalid owner hub config: no url_prefix defined');
    }
    if (!appHubConfig.url_prefix) {
        throw new Error('Invalid app hub config: no url_prefix defined');
    }
    const gaiaReadUrl = appHubConfig.url_prefix.replace(/\/+$/, '');
    const newAppEntry = {};
    newAppEntry[appOrigin] = `${gaiaReadUrl}/${appAddress}/`;
    const apps = Object.assign({}, profile.apps ? profile.apps : {}, newAppEntry);
    profile.apps = apps;
    // sign the new profile
    const signedProfile = utils_1.makeProfileJWT(profile, ownerPrivateKey);
    const profileUrls = await data_1.gaiaUploadProfileAll(network, [ownerHubUrl], signedProfile, ownerPrivateKey, blockstackID);
    if (profileUrls.error) {
        return utils_1.JSONStringify({
            error: profileUrls.error
        });
    }
    else {
        return utils_1.JSONStringify({
            profileUrls: profileUrls.dataUrls
        });
    }
}
/*
 * Convert an address between mainnet and testnet, and between
 * base58check and c32check.
 * args:
 * @address (string) the input address.  can be in any format
 */
function addressConvert(network, args) {
    const addr = args[0];
    let b58addr;
    let c32addr;
    let testnetb58addr;
    let testnetc32addr;
    if (addr.match(argparse_1.STACKS_ADDRESS_PATTERN)) {
        c32addr = addr;
        b58addr = c32check.c32ToB58(c32addr);
    }
    else if (addr.match(/[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+/)) {
        c32addr = c32check.b58ToC32(addr);
        b58addr = addr;
    }
    else {
        throw new Error(`Unrecognized address ${addr}`);
    }
    if (network.isTestnet()) {
        testnetb58addr = network.coerceAddress(b58addr);
        testnetc32addr = c32check.b58ToC32(testnetb58addr);
    }
    return Promise.resolve().then(() => {
        const result = {
            mainnet: {
                STACKS: c32addr,
                BTC: b58addr
            },
            testnet: undefined
        };
        if (network.isTestnet()) {
            result.testnet = {
                STACKS: testnetc32addr,
                BTC: testnetb58addr
            };
        }
        return utils_1.JSONStringify(result);
    });
}
/*
 * Run an authentication daemon on a given port.
 * args:
 * @gaiaHubUrl (string) the write endpoint of your app Gaia hub, where app data will be stored
 * @mnemonic (string) your 12-word phrase, optionally encrypted.  If encrypted, then
 * a password will be prompted.
 * @profileGaiaHubUrl (string) the write endpoint of your profile Gaia hub, where your profile
 *   will be stored (optional)
 * @port (number) the port to listen on (optional)
 */
function authDaemon(network, args) {
    const gaiaHubUrl = args[0];
    const mnemonicOrCiphertext = args[1];
    let port = 3000; // default port
    let profileGaiaHub = gaiaHubUrl;
    if (args.length > 2 && !!args[2]) {
        profileGaiaHub = args[2];
    }
    if (args.length > 3 && !!args[3]) {
        port = parseInt(args[3]);
    }
    if (port < 0 || port > 65535) {
        return Promise.resolve().then(() => utils_1.JSONStringify({ error: 'Invalid port' }));
    }
    const mnemonicPromise = utils_1.getBackupPhrase(mnemonicOrCiphertext);
    return mnemonicPromise
        .then((mnemonic) => {
        noExit = true;
        // load up all of our identity addresses, profiles, profile URLs, and Gaia connections
        const authServer = express();
        authServer.use(cors());
        authServer.get(/^\/auth\/*$/, (req, res) => {
            return auth_1.handleAuth(network, mnemonic, gaiaHubUrl, profileGaiaHub, port, req, res);
        });
        authServer.get(/^\/signin\/*$/, (req, res) => {
            return auth_1.handleSignIn(network, mnemonic, gaiaHubUrl, profileGaiaHub, req, res);
        });
        authServer.listen(port, () => console.log(`Authentication server started on ${port}`));
        return 'Press Ctrl+C to exit';
    })
        .catch((e) => {
        return utils_1.JSONStringify({ error: e.message });
    });
}
/*
 * Encrypt a backup phrase
 * args:
 * @backup_phrase (string) the 12-word phrase to encrypt
 * @password (string) the password (will be interactively prompted if not given)
 */
function encryptMnemonic(network, args) {
    const mnemonic = args[0];
    if (mnemonic.split(/ +/g).length !== 12) {
        throw new Error('Invalid backup phrase: must be 12 words');
    }
    const passwordPromise = new Promise((resolve, reject) => {
        let pass = '';
        if (args.length === 2 && !!args[1]) {
            pass = args[1];
            resolve(pass);
        }
        else {
            if (!process.stdin.isTTY) {
                // password must be given as an argument
                const errMsg = 'Password argument required on non-interactive mode';
                reject(new Error(errMsg));
            }
            else {
                // prompt password
                utils_1.getpass('Enter password: ', (pass1) => {
                    utils_1.getpass('Enter password again: ', (pass2) => {
                        if (pass1 !== pass2) {
                            const errMsg = 'Passwords do not match';
                            reject(new Error(errMsg));
                        }
                        else {
                            resolve(pass1);
                        }
                    });
                });
            }
        }
    });
    return passwordPromise
        .then((pass) => encrypt_1.encryptBackupPhrase(mnemonic, pass))
        .then((cipherTextBuffer) => cipherTextBuffer.toString('base64'))
        .catch((e) => {
        return utils_1.JSONStringify({ error: e.message });
    });
}
/* Decrypt a backup phrase
 * args:
 * @encrypted_backup_phrase (string) the encrypted base64-encoded backup phrase
 * @password 9string) the password (will be interactively prompted if not given)
 */
function decryptMnemonic(network, args) {
    const ciphertext = args[0];
    const passwordPromise = new Promise((resolve, reject) => {
        if (args.length === 2 && !!args[1]) {
            const pass = args[1];
            resolve(pass);
        }
        else {
            if (!process.stdin.isTTY) {
                // password must be given 
                reject(new Error('Password argument required in non-interactive mode'));
            }
            else {
                // prompt password 
                utils_1.getpass('Enter password: ', (p) => {
                    resolve(p);
                });
            }
        }
    });
    return passwordPromise
        .then((pass) => encrypt_1.decryptBackupPhrase(Buffer.from(ciphertext, 'base64'), pass))
        .catch((e) => {
        return utils_1.JSONStringify({ error: 'Failed to decrypt (wrong password or corrupt ciphertext), ' +
                `details: ${e.message}` });
    });
}
function printDocs(_network, _args) {
    return Promise.resolve().then(() => {
        const formattedDocs = [];
        const commandNames = Object.keys(argparse_1.CLI_ARGS.properties);
        for (let i = 0; i < commandNames.length; i++) {
            const commandName = commandNames[i];
            const args = [];
            const usage = argparse_1.CLI_ARGS.properties[commandName].help;
            const group = argparse_1.CLI_ARGS.properties[commandName].group;
            for (let j = 0; j < argparse_1.CLI_ARGS.properties[commandName].items.length; j++) {
                const argItem = argparse_1.CLI_ARGS.properties[commandName].items[j];
                args.push({
                    name: argItem.name,
                    type: argItem.type,
                    value: argItem.realtype,
                    format: argItem.pattern ? argItem.pattern : '.+'
                });
            }
            formattedDocs.push({
                command: commandName,
                args: args,
                usage: usage,
                group: group
            });
        }
        return utils_1.JSONStringify(formattedDocs);
    });
}
/*
 * Decrypt a backup phrase
 * args:
 * @p
/*
 * Global set of commands
 */
const COMMANDS = {
    'authenticator': authDaemon,
    'announce': announce,
    'balance': balance,
    'convert_address': addressConvert,
    'decrypt_keychain': decryptMnemonic,
    'docs': printDocs,
    'encrypt_keychain': encryptMnemonic,
    'gaia_deletefile': gaiaDeleteFile,
    'gaia_dump_bucket': gaiaDumpBucket,
    'gaia_getfile': gaiaGetFile,
    'gaia_listfiles': gaiaListFiles,
    'gaia_putfile': gaiaPutFile,
    'gaia_restore_bucket': gaiaRestoreBucket,
    'gaia_sethub': gaiaSetHub,
    'get_address': getKeyAddress,
    'get_account_at': getAccountAt,
    'get_account_history': getAccountHistory,
    'get_blockchain_record': getNameBlockchainRecord,
    'get_blockchain_history': getNameHistoryRecord,
    'get_confirmations': getConfirmations,
    'get_did_configuration': getDidConfiguration,
    'get_namespace_blockchain_record': getNamespaceBlockchainRecord,
    'get_app_keys': getAppKeys,
    'get_owner_keys': getOwnerKeys,
    'get_payment_key': getPaymentKey,
    'get_stacks_wallet_key': getStacksWalletKey,
    'get_zonefile': getZonefile,
    'lookup': lookup,
    'make_keychain': makeKeychain,
    'make_zonefile': makeZonefile,
    'names': names,
    'name_import': nameImport,
    'namespace_preorder': namespacePreorder,
    'namespace_reveal': namespaceReveal,
    'namespace_ready': namespaceReady,
    'price': price,
    'price_namespace': priceNamespace,
    'profile_sign': profileSign,
    'profile_store': profileStore,
    'profile_verify': profileVerify,
    'register': register,
    'register_addr': registerAddr,
    'register_subdomain': registerSubdomain,
    'renew': renew,
    'revoke': revoke,
    'send_btc': sendBTC,
    'send_tokens': sendTokens,
    'transfer': transfer,
    'tx_preorder': txPreorder,
    'tx_register': txRegister,
    'update': update,
    'whois': whois,
    'zonefile_push': zonefilePush
};
/*
 * CLI main entry point
 */
function CLIMain() {
    const argv = process.argv;
    const opts = argparse_1.getCLIOpts(argv);
    const cmdArgs = argparse_1.checkArgs(argparse_1.CLIOptAsStringArray(opts, '_') ? argparse_1.CLIOptAsStringArray(opts, '_') : []);
    if (!cmdArgs.success) {
        if (cmdArgs.error) {
            console.log(cmdArgs.error);
        }
        if (cmdArgs.usage) {
            if (cmdArgs.command) {
                console.log(argparse_1.makeCommandUsageString(cmdArgs.command));
                console.log('Use "help" to list all commands.');
            }
            else {
                console.log(argparse_1.USAGE);
                console.log(argparse_1.makeAllCommandsList());
            }
        }
        process.exit(1);
    }
    else {
        txOnly = argparse_1.CLIOptAsBool(opts, 'x');
        estimateOnly = argparse_1.CLIOptAsBool(opts, 'e');
        safetyChecks = !argparse_1.CLIOptAsBool(opts, 'U');
        receiveFeesPeriod = opts['N'] ?
            parseInt(argparse_1.CLIOptAsString(opts, 'N')) : receiveFeesPeriod;
        gracePeriod = opts['G'] ?
            parseInt(argparse_1.CLIOptAsString(opts, 'N')) : gracePeriod;
        maxIDSearchIndex = opts['M'] ?
            parseInt(argparse_1.CLIOptAsString(opts, 'M')) : maxIDSearchIndex;
        const debug = argparse_1.CLIOptAsBool(opts, 'd');
        const consensusHash = argparse_1.CLIOptAsString(opts, 'C');
        const integration_test = argparse_1.CLIOptAsBool(opts, 'i');
        const testnet = argparse_1.CLIOptAsBool(opts, 't');
        const magicBytes = argparse_1.CLIOptAsString(opts, 'm');
        const apiUrl = argparse_1.CLIOptAsString(opts, 'H');
        const transactionBroadcasterUrl = argparse_1.CLIOptAsString(opts, 'T');
        defaultV2BroadcastUrl = opts['T'] ? argparse_1.CLIOptAsString(opts, 'T') : defaultV2BroadcastUrl;
        const nodeAPIUrl = argparse_1.CLIOptAsString(opts, 'I');
        const utxoUrl = argparse_1.CLIOptAsString(opts, 'X');
        const bitcoindUsername = argparse_1.CLIOptAsString(opts, 'u');
        const bitcoindPassword = argparse_1.CLIOptAsString(opts, 'p');
        if (integration_test) {
            BLOCKSTACK_TEST = integration_test;
        }
        const configPath = argparse_1.CLIOptAsString(opts, 'c') ? argparse_1.CLIOptAsString(opts, 'c') :
            (integration_test ? argparse_1.DEFAULT_CONFIG_REGTEST_PATH :
                (testnet ? argparse_1.DEFAULT_CONFIG_TESTNET_PATH : argparse_1.DEFAULT_CONFIG_PATH));
        const namespaceBurnAddr = argparse_1.CLIOptAsString(opts, 'B');
        const feeRate = argparse_1.CLIOptAsString(opts, 'F') ? parseInt(argparse_1.CLIOptAsString(opts, 'F')) : 0;
        const priceToPay = argparse_1.CLIOptAsString(opts, 'P') ? argparse_1.CLIOptAsString(opts, 'P') : '0';
        const priceUnits = argparse_1.CLIOptAsString(opts, 'D');
        const networkType = testnet ? 'testnet' : (integration_test ? 'regtest' : 'mainnet');
        const configData = argparse_1.loadConfig(configPath, networkType);
        if (debug) {
            configData.logConfig.level = 'debug';
        }
        else {
            configData.logConfig.level = 'info';
        }
        if (bitcoindUsername) {
            configData.bitcoindUsername = bitcoindUsername;
        }
        if (bitcoindPassword) {
            configData.bitcoindPassword = bitcoindPassword;
        }
        if (utxoUrl) {
            configData.utxoServiceUrl = utxoUrl;
        }
        winston.configure({ level: configData.logConfig.level, transports: [new winston.transports.Console(configData.logConfig)] });
        const cliOpts = {
            consensusHash: consensusHash ? consensusHash : null,
            feeRate: feeRate ? feeRate : null,
            namespaceBurnAddress: namespaceBurnAddr ? namespaceBurnAddr : null,
            priceToPay: priceToPay ? priceToPay : null,
            priceUnits: priceUnits ? priceUnits : null,
            receiveFeesPeriod: receiveFeesPeriod ? receiveFeesPeriod : null,
            gracePeriod: gracePeriod ? gracePeriod : null,
            altAPIUrl: (apiUrl ? apiUrl : configData.blockstackAPIUrl),
            altTransactionBroadcasterUrl: (transactionBroadcasterUrl ?
                transactionBroadcasterUrl :
                configData.broadcastServiceUrl),
            nodeAPIUrl: (nodeAPIUrl ? nodeAPIUrl : configData.blockstackNodeUrl)
        };
        // wrap command-line options
        const wrappedNetwork = network_1.getNetwork(configData, (!!BLOCKSTACK_TEST || !!integration_test || !!testnet));
        const blockstackNetwork = new network_1.CLINetworkAdapter(wrappedNetwork, cliOpts);
        if (magicBytes) {
            blockstackNetwork.MAGIC_BYTES = magicBytes;
        }
        blockstack.config.network = blockstackNetwork;
        blockstack.config.logLevel = 'error';
        if (cmdArgs.command === 'help') {
            console.log(argparse_1.makeCommandUsageString(cmdArgs.args[0]));
            process.exit(0);
        }
        const method = COMMANDS[cmdArgs.command];
        let exitcode = 0;
        method(blockstackNetwork, cmdArgs.args)
            .then((result) => {
            try {
                // if this is a JSON object with 'status', set the exit code
                if (result instanceof Buffer) {
                    return result;
                }
                else {
                    const resJson = JSON.parse(result);
                    if (resJson.hasOwnProperty('status') && !resJson.status) {
                        exitcode = 1;
                    }
                    return result;
                }
            }
            catch (e) {
                return result;
            }
        })
            .then((result) => {
            if (result instanceof Buffer) {
                process.stdout.write(result);
            }
            else {
                console.log(result);
            }
        })
            .then(() => {
            if (!noExit) {
                process.exit(exitcode);
            }
        })
            .catch((e) => {
            console.error(e.stack);
            console.error(e.message);
            if (!noExit) {
                process.exit(1);
            }
        });
    }
}
exports.CLIMain = CLIMain;
//# sourceMappingURL=cli.js.map