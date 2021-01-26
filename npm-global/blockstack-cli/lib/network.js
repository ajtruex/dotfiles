"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blockstack_1 = require("blockstack");
const bitcoin = require("bitcoinjs-lib");
const BN = require('bn.js');
const node_fetch_1 = require("node-fetch");
const network_1 = require("blockstack/lib/network");
const SATOSHIS_PER_BTC = 1e8;
;
;
/*
 * Adapter class that allows us to use data obtained
 * from the CLI.
 */
class CLINetworkAdapter extends network_1.BlockstackNetwork {
    constructor(network, opts) {
        const optsDefault = {
            consensusHash: null,
            feeRate: null,
            namespaceBurnAddress: null,
            priceToPay: null,
            priceUnits: null,
            receiveFeesPeriod: null,
            gracePeriod: null,
            altAPIUrl: network.blockstackAPIUrl,
            altTransactionBroadcasterUrl: network.broadcastServiceUrl,
            nodeAPIUrl: null
        };
        opts = Object.assign({}, optsDefault, opts);
        super(opts.altAPIUrl, opts.altTransactionBroadcasterUrl, network.btc, network.layer1);
        this.consensusHash = opts.consensusHash;
        this.feeRate = opts.feeRate;
        this.namespaceBurnAddress = opts.namespaceBurnAddress;
        this.priceToPay = opts.priceToPay;
        this.priceUnits = opts.priceUnits;
        this.receiveFeesPeriod = opts.receiveFeesPeriod;
        this.gracePeriod = opts.gracePeriod;
        this.nodeAPIUrl = opts.nodeAPIUrl;
        this.optAlwaysCoerceAddress = false;
    }
    isMainnet() {
        return this.layer1.pubKeyHash === bitcoin.networks.bitcoin.pubKeyHash;
    }
    isTestnet() {
        return this.layer1.pubKeyHash === bitcoin.networks.testnet.pubKeyHash;
    }
    setCoerceMainnetAddress(value) {
        this.optAlwaysCoerceAddress = value;
    }
    coerceMainnetAddress(address) {
        const addressInfo = bitcoin.address.fromBase58Check(address);
        const addressHash = addressInfo.hash;
        const addressVersion = addressInfo.version;
        let newVersion = 0;
        if (addressVersion === this.layer1.pubKeyHash) {
            newVersion = 0;
        }
        else if (addressVersion === this.layer1.scriptHash) {
            newVersion = 5;
        }
        return bitcoin.address.toBase58Check(addressHash, newVersion);
    }
    getFeeRate() {
        if (this.feeRate) {
            // override with CLI option
            return Promise.resolve(this.feeRate);
        }
        if (this.isTestnet()) {
            // in regtest mode 
            return Promise.resolve(Math.floor(0.00001000 * SATOSHIS_PER_BTC));
        }
        return super.getFeeRate();
    }
    getConsensusHash() {
        // override with CLI option
        if (this.consensusHash) {
            return new Promise((resolve) => resolve(this.consensusHash));
        }
        return super.getConsensusHash().then((c) => c);
    }
    getGracePeriod() {
        if (this.gracePeriod) {
            return new Promise((resolve) => resolve(this.gracePeriod));
        }
        return super.getGracePeriod().then((g) => g);
    }
    getNamePrice(name) {
        // override with CLI option 
        if (this.priceUnits && this.priceToPay) {
            return new Promise((resolve) => resolve({
                units: String(this.priceUnits),
                amount: new BN(this.priceToPay)
            }));
        }
        return super.getNamePrice(name)
            .then((priceInfo) => {
            // use v2 scheme
            if (!priceInfo.units) {
                priceInfo = {
                    units: 'BTC',
                    amount: new BN(String(priceInfo))
                };
            }
            return priceInfo;
        });
    }
    getNamespacePrice(namespaceID) {
        // override with CLI option 
        if (this.priceUnits && this.priceToPay) {
            return new Promise((resolve) => resolve({
                units: String(this.priceUnits),
                amount: new BN(String(this.priceToPay))
            }));
        }
        return super.getNamespacePrice(namespaceID)
            .then((priceInfo) => {
            // use v2 scheme
            if (!priceInfo.units) {
                priceInfo = {
                    units: 'BTC',
                    amount: new BN(String(priceInfo))
                };
            }
            return priceInfo;
        });
    }
    getNamespaceBurnAddress(namespace, useCLI = true, receiveFeesPeriod = -1) {
        // override with CLI option
        if (this.namespaceBurnAddress && useCLI) {
            return new Promise((resolve) => resolve(this.namespaceBurnAddress));
        }
        return Promise.all([
            node_fetch_1.default(`${this.blockstackAPIUrl}/v1/namespaces/${namespace}`),
            this.getBlockHeight()
        ])
            .then(([resp, blockHeight]) => {
            if (resp.status === 404) {
                throw new Error(`No such namespace '${namespace}'`);
            }
            else if (resp.status !== 200) {
                throw new Error(`Bad response status: ${resp.status}`);
            }
            else {
                return Promise.all([resp.json(), blockHeight]);
            }
        })
            .then(([namespaceInfo, blockHeight]) => {
            let address = '1111111111111111111114oLvT2'; // default burn address
            if (namespaceInfo.version === 2) {
                // pay-to-namespace-creator if this namespace is less than $receiveFeesPeriod blocks old
                if (receiveFeesPeriod < 0) {
                    receiveFeesPeriod = this.receiveFeesPeriod;
                }
                if (namespaceInfo.reveal_block + receiveFeesPeriod > blockHeight) {
                    address = namespaceInfo.address;
                }
            }
            return address;
        })
            .then((address) => this.coerceAddress(address));
    }
    getNameInfo(name) {
        // optionally coerce addresses
        return super.getNameInfo(name)
            .then((ni) => {
            const nameInfo = {
                address: this.optAlwaysCoerceAddress ? this.coerceMainnetAddress(ni.address) : ni.address,
                blockchain: ni.blockchain,
                did: ni.did,
                expire_block: ni.expire_block,
                grace_period: ni.grace_period,
                last_txid: ni.last_txid,
                renewal_deadline: ni.renewal_deadline,
                resolver: ni.resolver,
                status: ni.status,
                zonefile: ni.zonefile,
                zonefile_hash: ni.zonefile_hash
            };
            return nameInfo;
        });
    }
    getBlockchainNameRecord(name) {
        // TODO: send to blockstack.js
        const url = `${this.blockstackAPIUrl}/v1/blockchains/bitcoin/names/${name}`;
        return node_fetch_1.default(url)
            .then((resp) => {
            if (resp.status !== 200) {
                throw new Error(`Bad response status: ${resp.status}`);
            }
            else {
                return resp.json();
            }
        })
            .then((nameInfo) => {
            // coerce all addresses
            const fixedAddresses = {};
            for (const addrAttr of ['address', 'importer_address', 'recipient_address']) {
                if (nameInfo.hasOwnProperty(addrAttr) && nameInfo[addrAttr]) {
                    fixedAddresses[addrAttr] = this.coerceAddress(nameInfo[addrAttr]);
                }
            }
            return Object.assign(nameInfo, fixedAddresses);
        });
    }
    getNameHistory(name, page) {
        // TODO: send to blockstack.js 
        const url = `${this.blockstackAPIUrl}/v1/names/${name}/history?page=${page}`;
        return node_fetch_1.default(url)
            .then((resp) => {
            if (resp.status !== 200) {
                throw new Error(`Bad response status: ${resp.status}`);
            }
            return resp.json();
        })
            .then((historyInfo) => {
            // coerce all addresses 
            const fixedHistory = {};
            for (const historyBlock of Object.keys(historyInfo)) {
                const fixedHistoryList = [];
                for (const historyEntry of historyInfo[historyBlock]) {
                    const fixedAddresses = {};
                    let fixedHistoryEntry = {};
                    for (const addrAttr of ['address', 'importer_address', 'recipient_address']) {
                        if (historyEntry.hasOwnProperty(addrAttr) && historyEntry[addrAttr]) {
                            fixedAddresses[addrAttr] = this.coerceAddress(historyEntry[addrAttr]);
                        }
                    }
                    fixedHistoryEntry = Object.assign(historyEntry, fixedAddresses);
                    fixedHistoryList.push(fixedHistoryEntry);
                }
                fixedHistory[historyBlock] = fixedHistoryList;
            }
            return fixedHistory;
        });
    }
}
exports.CLINetworkAdapter = CLINetworkAdapter;
/*
 * Instantiate a network using settings from the config file.
 */
function getNetwork(configData, regTest) {
    if (regTest) {
        const network = new blockstack_1.default.network.LocalRegtest(configData.blockstackAPIUrl, configData.broadcastServiceUrl, new blockstack_1.default.network.BitcoindAPI(configData.utxoServiceUrl, { username: configData.bitcoindUsername || 'blockstack', password: configData.bitcoindPassword || 'blockstacksystem' }));
        return network;
    }
    else {
        const network = new network_1.BlockstackNetwork(configData.blockstackAPIUrl, configData.broadcastServiceUrl, new blockstack_1.default.network.BlockchainInfoApi(configData.utxoServiceUrl));
        return network;
    }
}
exports.getNetwork = getNetwork;
//# sourceMappingURL=network.js.map