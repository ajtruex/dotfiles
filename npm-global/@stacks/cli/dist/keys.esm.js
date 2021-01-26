import { asyncToGenerator as _asyncToGenerator } from './_virtual/_rollupPluginBabelHelpers.js';
import runtime_1 from './node_modules/regenerator-runtime/runtime.esm.js';
import { BlockstackWallet, ecPairToHexString } from 'blockstack';
import { ECPair, payments, networks } from 'bitcoinjs-lib';
import { mnemonicToSeed } from 'bip39';
import { getPrivateKeyAddress } from './utils.esm.js';
import { fromSeed } from 'bip32';
import { getMaxIDSearchIndex } from './cli.esm.js';

var c32check = /*#__PURE__*/require('c32check');
var STX_WALLET_COMPATIBLE_SEED_STRENGTH = 256;

function walletFromMnemonic(_x) {
  return _walletFromMnemonic.apply(this, arguments);
}

function _walletFromMnemonic() {
  _walletFromMnemonic = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(mnemonic) {
    var seed;
    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return mnemonicToSeed(mnemonic);

          case 2:
            seed = _context.sent;
            return _context.abrupt("return", new BlockstackWallet(fromSeed(seed)));

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _walletFromMnemonic.apply(this, arguments);
}

function getNodePrivateKey(node) {
  return ecPairToHexString(ECPair.fromPrivateKey(node.privateKey));
}

function getOwnerKeyInfo(_x2, _x3, _x4, _x5) {
  return _getOwnerKeyInfo.apply(this, arguments);
}

function _getOwnerKeyInfo() {
  _getOwnerKeyInfo = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2(network, mnemonic, index, version) {
    var wallet, identity, addr, privkey;
    return runtime_1.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (version === void 0) {
              version = 'v0.10-current';
            }

            _context2.next = 3;
            return walletFromMnemonic(mnemonic);

          case 3:
            wallet = _context2.sent;
            identity = wallet.getIdentityAddressNode(index);
            addr = network.coerceAddress(BlockstackWallet.getAddressFromBIP32Node(identity));
            privkey = getNodePrivateKey(identity);
            return _context2.abrupt("return", {
              privateKey: privkey,
              version: version,
              index: index,
              idAddress: "ID-" + addr
            });

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _getOwnerKeyInfo.apply(this, arguments);
}

function getPaymentKeyInfo(_x6, _x7) {
  return _getPaymentKeyInfo.apply(this, arguments);
}

function _getPaymentKeyInfo() {
  _getPaymentKeyInfo = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee3(network, mnemonic) {
    var wallet, privkey, addr, result;
    return runtime_1.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return walletFromMnemonic(mnemonic);

          case 2:
            wallet = _context3.sent;
            privkey = wallet.getBitcoinPrivateKey(0);
            addr = getPrivateKeyAddress(network, privkey);
            result = {
              privateKey: privkey,
              address: {
                BTC: addr,
                STACKS: c32check.b58ToC32(addr)
              },
              index: 0
            };
            return _context3.abrupt("return", result);

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _getPaymentKeyInfo.apply(this, arguments);
}

function getStacksWalletKeyInfo(_x8, _x9) {
  return _getStacksWalletKeyInfo.apply(this, arguments);
}

function _getStacksWalletKeyInfo() {
  _getStacksWalletKeyInfo = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee4(network, mnemonic) {
    var seed, master, child, ecPair, privkey, addr, btcAddress, _bitcoin$payments$p2p, address, _bitcoin$payments$p2p2, _address, result;

    return runtime_1.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return mnemonicToSeed(mnemonic);

          case 2:
            seed = _context4.sent;
            master = fromSeed(seed);
            child = master.derivePath("m/44'/5757'/0'/0/0");
            ecPair = ECPair.fromPrivateKey(child.privateKey);
            privkey = ecPairToHexString(ecPair);
            addr = getPrivateKeyAddress(network, privkey);

            if (network.isTestnet()) {
              _bitcoin$payments$p2p = payments.p2pkh({
                pubkey: ecPair.publicKey,
                network: networks.regtest
              }), address = _bitcoin$payments$p2p.address;
              btcAddress = address;
            } else {
              _bitcoin$payments$p2p2 = payments.p2pkh({
                pubkey: ecPair.publicKey,
                network: networks.bitcoin
              }), _address = _bitcoin$payments$p2p2.address;
              btcAddress = _address;
            }

            result = {
              privateKey: privkey,
              address: c32check.b58ToC32(addr),
              btcAddress: btcAddress,
              index: 0
            };
            return _context4.abrupt("return", result);

          case 11:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _getStacksWalletKeyInfo.apply(this, arguments);
}

function findIdentityIndex(_x10, _x11, _x12, _x13) {
  return _findIdentityIndex.apply(this, arguments);
}

function _findIdentityIndex() {
  _findIdentityIndex = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee5(network, mnemonic, idAddress, maxIndex) {
    var wallet, i, identity, addr;
    return runtime_1.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (!maxIndex) {
              maxIndex = getMaxIDSearchIndex();
            }

            if (!(idAddress.substring(0, 3) !== 'ID-')) {
              _context5.next = 3;
              break;
            }

            throw new Error('Not an identity address');

          case 3:
            _context5.next = 5;
            return walletFromMnemonic(mnemonic);

          case 5:
            wallet = _context5.sent;
            i = 0;

          case 7:
            if (!(i < maxIndex)) {
              _context5.next = 15;
              break;
            }

            identity = wallet.getIdentityAddressNode(i);
            addr = BlockstackWallet.getAddressFromBIP32Node(identity);

            if (!(network.coerceAddress(addr) === network.coerceAddress(idAddress.slice(3)))) {
              _context5.next = 12;
              break;
            }

            return _context5.abrupt("return", i);

          case 12:
            i++;
            _context5.next = 7;
            break;

          case 15:
            return _context5.abrupt("return", -1);

          case 16:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _findIdentityIndex.apply(this, arguments);
}

function getApplicationKeyInfo(_x14, _x15, _x16, _x17, _x18) {
  return _getApplicationKeyInfo.apply(this, arguments);
}

function _getApplicationKeyInfo() {
  _getApplicationKeyInfo = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee6(network, mnemonic, idAddress, appDomain, idIndex) {
    var wallet, identityOwnerAddressNode, appsNode, legacyAppPrivateKey, res;
    return runtime_1.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            if (!idIndex) {
              idIndex = -1;
            }

            if (!(idIndex < 0)) {
              _context6.next = 7;
              break;
            }

            _context6.next = 4;
            return findIdentityIndex(network, mnemonic, idAddress);

          case 4:
            idIndex = _context6.sent;

            if (!(idIndex < 0)) {
              _context6.next = 7;
              break;
            }

            throw new Error('Identity address does not belong to this keychain');

          case 7:
            _context6.next = 9;
            return walletFromMnemonic(mnemonic);

          case 9:
            wallet = _context6.sent;
            identityOwnerAddressNode = wallet.getIdentityAddressNode(idIndex);
            appsNode = BlockstackWallet.getAppsNode(identityOwnerAddressNode);
            legacyAppPrivateKey = BlockstackWallet.getLegacyAppPrivateKey(appsNode.toBase58(), wallet.getIdentitySalt(), appDomain);
            res = {
              keyInfo: {
                privateKey: 'TODO',
                address: 'TODO'
              },
              legacyKeyInfo: {
                privateKey: legacyAppPrivateKey,
                address: getPrivateKeyAddress(network, legacyAppPrivateKey + "01")
              },
              ownerKeyIndex: idIndex
            };
            return _context6.abrupt("return", res);

          case 15:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
  return _getApplicationKeyInfo.apply(this, arguments);
}

function extractAppKey(network, appKeyInfo, appAddress) {
  if (appAddress) {
    if (network.coerceMainnetAddress(appKeyInfo.keyInfo.address) === network.coerceMainnetAddress(appAddress)) {
      return appKeyInfo.keyInfo.privateKey;
    }

    if (network.coerceMainnetAddress(appKeyInfo.legacyKeyInfo.address) === network.coerceMainnetAddress(appAddress)) {
      return appKeyInfo.legacyKeyInfo.privateKey;
    }
  }

  var appPrivateKey = appKeyInfo.keyInfo.privateKey === 'TODO' || !appKeyInfo.keyInfo.privateKey ? appKeyInfo.legacyKeyInfo.privateKey : appKeyInfo.keyInfo.privateKey;
  return appPrivateKey;
}

export { STX_WALLET_COMPATIBLE_SEED_STRENGTH, extractAppKey, findIdentityIndex, getApplicationKeyInfo, getOwnerKeyInfo, getPaymentKeyInfo, getStacksWalletKeyInfo };
//# sourceMappingURL=keys.esm.js.map
