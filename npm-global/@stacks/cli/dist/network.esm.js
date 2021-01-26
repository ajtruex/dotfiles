import { createForOfIteratorHelperLoose as _createForOfIteratorHelperLoose } from './_virtual/_rollupPluginBabelHelpers.js';
import blockstack from 'blockstack';
import { networks, address } from 'bitcoinjs-lib';
import fetch from 'node-fetch';
import { BlockstackNetwork } from 'blockstack/lib/network';

var BN = /*#__PURE__*/require('bn.js');
var SATOSHIS_PER_BTC = 1e8;
var CLINetworkAdapter = /*#__PURE__*/function () {
  function CLINetworkAdapter(network, opts) {
    var optsDefault = {
      consensusHash: null,
      feeRate: null,
      namespaceBurnAddress: null,
      priceToPay: null,
      priceUnits: null,
      receiveFeesPeriod: null,
      gracePeriod: null,
      altAPIUrl: opts.nodeAPIUrl,
      altTransactionBroadcasterUrl: network.broadcastServiceUrl,
      nodeAPIUrl: opts.nodeAPIUrl
    };
    opts = Object.assign({}, optsDefault, opts);
    this.legacyNetwork = new BlockstackNetwork(opts.nodeAPIUrl, opts.altTransactionBroadcasterUrl, network.btc, network.layer1);
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

  var _proto = CLINetworkAdapter.prototype;

  _proto.isMainnet = function isMainnet() {
    return this.legacyNetwork.layer1.pubKeyHash === networks.bitcoin.pubKeyHash;
  };

  _proto.isTestnet = function isTestnet() {
    return this.legacyNetwork.layer1.pubKeyHash === networks.testnet.pubKeyHash;
  };

  _proto.setCoerceMainnetAddress = function setCoerceMainnetAddress(value) {
    this.optAlwaysCoerceAddress = value;
  };

  _proto.coerceMainnetAddress = function coerceMainnetAddress(address$1) {
    var addressInfo = address.fromBase58Check(address$1);
    var addressHash = addressInfo.hash;
    var addressVersion = addressInfo.version;
    var newVersion = 0;

    if (addressVersion === this.legacyNetwork.layer1.pubKeyHash) {
      newVersion = 0;
    } else if (addressVersion === this.legacyNetwork.layer1.scriptHash) {
      newVersion = 5;
    }

    return address.toBase58Check(addressHash, newVersion);
  };

  _proto.getFeeRate = function getFeeRate() {
    if (this.feeRate) {
      return Promise.resolve(this.feeRate);
    }

    if (this.isTestnet()) {
      return Promise.resolve(Math.floor(0.00001 * SATOSHIS_PER_BTC));
    }

    return this.legacyNetwork.getFeeRate();
  };

  _proto.getConsensusHash = function getConsensusHash() {
    var _this = this;

    if (this.consensusHash) {
      return new Promise(function (resolve) {
        return resolve(_this.consensusHash);
      });
    }

    return this.legacyNetwork.getConsensusHash().then(function (c) {
      return c;
    });
  };

  _proto.getGracePeriod = function getGracePeriod() {
    var _this2 = this;

    if (this.gracePeriod) {
      return new Promise(function (resolve) {
        return resolve(_this2.gracePeriod);
      });
    }

    return this.legacyNetwork.getGracePeriod().then(function (g) {
      return g;
    });
  };

  _proto.getNamePrice = function getNamePrice(name) {
    var _this3 = this;

    if (this.priceUnits && this.priceToPay) {
      return new Promise(function (resolve) {
        return resolve({
          units: String(_this3.priceUnits),
          amount: new BN(_this3.priceToPay)
        });
      });
    }

    return this.legacyNetwork.getNamePrice(name).then(function (priceInfo) {
      if (!priceInfo.units) {
        priceInfo = {
          units: 'BTC',
          amount: new BN(String(priceInfo))
        };
      }

      return priceInfo;
    });
  };

  _proto.getNamespacePrice = function getNamespacePrice(namespaceID) {
    var _this4 = this;

    if (this.priceUnits && this.priceToPay) {
      return new Promise(function (resolve) {
        return resolve({
          units: String(_this4.priceUnits),
          amount: new BN(String(_this4.priceToPay))
        });
      });
    }

    return Object.prototype.getNamespacePrice.call(this, namespaceID).then(function (priceInfo) {
      if (!priceInfo.units) {
        priceInfo = {
          units: 'BTC',
          amount: new BN(String(priceInfo))
        };
      }

      return priceInfo;
    });
  };

  _proto.getNamespaceBurnAddress = function getNamespaceBurnAddress(namespace, useCLI, receiveFeesPeriod) {
    var _this5 = this;

    if (useCLI === void 0) {
      useCLI = true;
    }

    if (receiveFeesPeriod === void 0) {
      receiveFeesPeriod = -1;
    }

    if (this.namespaceBurnAddress && useCLI) {
      return new Promise(function (resolve) {
        return resolve(_this5.namespaceBurnAddress);
      });
    }

    return Promise.all([fetch(this.legacyNetwork.blockstackAPIUrl + "/v1/namespaces/" + namespace), this.legacyNetwork.getBlockHeight()]).then(function (_ref) {
      var resp = _ref[0],
          blockHeight = _ref[1];

      if (resp.status === 404) {
        throw new Error("No such namespace '" + namespace + "'");
      } else if (resp.status !== 200) {
        throw new Error("Bad response status: " + resp.status);
      } else {
        return Promise.all([resp.json(), blockHeight]);
      }
    }).then(function (_ref2) {
      var namespaceInfo = _ref2[0],
          blockHeight = _ref2[1];
      var address = '1111111111111111111114oLvT2';

      if (namespaceInfo.version === 2) {
        if (receiveFeesPeriod < 0) {
          receiveFeesPeriod = _this5.receiveFeesPeriod;
        }

        if (namespaceInfo.reveal_block + receiveFeesPeriod > blockHeight) {
          address = namespaceInfo.address;
        }
      }

      return address;
    }).then(function (address) {
      return _this5.legacyNetwork.coerceAddress(address);
    });
  };

  _proto.getNameInfo = function getNameInfo(name) {
    var _this6 = this;

    return this.legacyNetwork.getNameInfo(name).then(function (ni) {
      var nameInfo = {
        address: _this6.optAlwaysCoerceAddress ? _this6.coerceMainnetAddress(ni.address) : ni.address,
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
  };

  _proto.getBlockchainNameRecord = function getBlockchainNameRecord(name) {
    var _this7 = this;

    var url = this.legacyNetwork.blockstackAPIUrl + "/v1/blockchains/bitcoin/names/" + name;
    return fetch(url).then(function (resp) {
      if (resp.status !== 200) {
        throw new Error("Bad response status: " + resp.status);
      } else {
        return resp.json();
      }
    }).then(function (nameInfo) {
      var fixedAddresses = {};

      for (var _i = 0, _arr = ['address', 'importer_address', 'recipient_address']; _i < _arr.length; _i++) {
        var addrAttr = _arr[_i];

        if (nameInfo.hasOwnProperty(addrAttr) && nameInfo[addrAttr]) {
          fixedAddresses[addrAttr] = _this7.legacyNetwork.coerceAddress(nameInfo[addrAttr]);
        }
      }

      return Object.assign(nameInfo, fixedAddresses);
    });
  };

  _proto.getNameHistory = function getNameHistory(name, page) {
    var _this8 = this;

    var url = this.legacyNetwork.blockstackAPIUrl + "/v1/names/" + name + "/history?page=" + page;
    return fetch(url).then(function (resp) {
      if (resp.status !== 200) {
        throw new Error("Bad response status: " + resp.status);
      }

      return resp.json();
    }).then(function (historyInfo) {
      var fixedHistory = {};

      for (var _i2 = 0, _Object$keys = Object.keys(historyInfo); _i2 < _Object$keys.length; _i2++) {
        var historyBlock = _Object$keys[_i2];
        var fixedHistoryList = [];

        for (var _iterator = _createForOfIteratorHelperLoose(historyInfo[historyBlock]), _step; !(_step = _iterator()).done;) {
          var historyEntry = _step.value;
          var fixedAddresses = {};
          var fixedHistoryEntry = {};

          for (var _i3 = 0, _arr2 = ['address', 'importer_address', 'recipient_address']; _i3 < _arr2.length; _i3++) {
            var addrAttr = _arr2[_i3];

            if (historyEntry.hasOwnProperty(addrAttr) && historyEntry[addrAttr]) {
              fixedAddresses[addrAttr] = _this8.legacyNetwork.coerceAddress(historyEntry[addrAttr]);
            }
          }

          fixedHistoryEntry = Object.assign(historyEntry, fixedAddresses);
          fixedHistoryList.push(fixedHistoryEntry);
        }

        fixedHistory[historyBlock] = fixedHistoryList;
      }

      return fixedHistory;
    });
  };

  _proto.coerceAddress = function coerceAddress(address) {
    return this.legacyNetwork.coerceAddress(address);
  };

  _proto.getAccountHistoryPage = function getAccountHistoryPage(address, page) {
    return this.legacyNetwork.getAccountHistoryPage(address, page);
  };

  _proto.broadcastTransaction = function broadcastTransaction(tx) {
    return this.legacyNetwork.broadcastTransaction(tx);
  };

  _proto.broadcastZoneFile = function broadcastZoneFile(zonefile, txid) {
    return this.legacyNetwork.broadcastZoneFile(zonefile, txid);
  };

  _proto.getNamesOwned = function getNamesOwned(address) {
    return this.legacyNetwork.getNamesOwned(address);
  };

  return CLINetworkAdapter;
}();
function getNetwork(configData, regTest) {
  if (regTest) {
    var network = new blockstack.network.LocalRegtest(configData.blockstackAPIUrl, configData.broadcastServiceUrl, new blockstack.network.BitcoindAPI(configData.utxoServiceUrl, {
      username: configData.bitcoindUsername || 'blockstack',
      password: configData.bitcoindPassword || 'blockstacksystem'
    }));
    return network;
  } else {
    var _network = new BlockstackNetwork(configData.blockstackAPIUrl, configData.broadcastServiceUrl, new blockstack.network.BlockchainInfoApi(configData.utxoServiceUrl));

    return _network;
  }
}

export { CLINetworkAdapter, getNetwork };
//# sourceMappingURL=network.esm.js.map
