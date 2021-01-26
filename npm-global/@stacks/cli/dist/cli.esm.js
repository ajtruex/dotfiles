import { asyncToGenerator as _asyncToGenerator } from './_virtual/_rollupPluginBabelHelpers.js';
import runtime_1 from './node_modules/regenerator-runtime/runtime.esm.js';
import { config, extractProfile, getFile, putFile, deleteFile, listFiles, lookupProfile } from 'blockstack';
import { networks } from 'bitcoinjs-lib';
import { exit, stdout, env, argv, stdin } from 'process';
import { readFileSync, realpathSync, readdirSync, writeFileSync } from 'fs';
import { configure, transports } from 'winston';
import cors from 'cors';
import BN from 'bn.js';
import { randomBytes } from 'crypto';
import { generateMnemonic } from 'bip39';
import express from 'express';
import { normalize, join } from 'path';
import { prompt } from 'inquirer';
import fetch from 'node-fetch';
import { broadcastTransaction, estimateTransfer, makeSTXTokenTransfer, estimateContractDeploy, makeContractDeploy, getAbi, makeContractCall, validateContractCall, estimateContractFunctionCall, callReadOnlyFunction, cvToString, TransactionVersion, getAddressFromPrivateKey, PostConditionMode } from '@stacks/transactions';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import crossfetch from 'cross-fetch';
import { StackingClient } from '@stacks/stacking';
import { Configuration, AccountsApi, FaucetsApi } from '@stacks/blockchain-api-client';
import { getCLIOpts, checkArgs, CLIOptAsStringArray, makeCommandUsageString, USAGE, makeAllCommandsList, CLIOptAsBool, CLIOptAsString, DEFAULT_CONFIG_REGTEST_PATH, DEFAULT_CONFIG_TESTNET_PATH, DEFAULT_CONFIG_PATH, loadConfig, DEFAULT_MAX_ID_SEARCH_INDEX, ID_ADDRESS_PATTERN, STACKS_ADDRESS_PATTERN, CLI_ARGS } from './argparse.esm.js';
import { encryptBackupPhrase, decryptBackupPhrase } from './encrypt.esm.js';
import { makeProfileJWT, JSONStringify, decodePrivateKey, getPrivateKeyAddress, getNameInfoEasy, getBackupPhrase, generateExplorerTxPageUrl, makePromptsFromArgList, parseClarityFunctionArgAnswers, canonicalPrivateKey, mkdirs, getIDAppKeys, getpass, getIDAddress } from './utils.esm.js';
import { getOwnerKeyInfo, getPaymentKeyInfo, getStacksWalletKeyInfo, STX_WALLET_COMPATIBLE_SEED_STRENGTH, extractAppKey, getApplicationKeyInfo } from './keys.esm.js';
import { getNetwork, CLINetworkAdapter } from './network.esm.js';
import { gaiaUploadProfileAll, gaiaAuth, gaiaConnect, getGaiaAddressFromProfile } from './data.esm.js';
import { handleAuth, handleSignIn } from './auth.esm.js';

var c32check = /*#__PURE__*/require('c32check');
var txOnly = false;
var estimateOnly = false;
var safetyChecks = true;
var receiveFeesPeriod = 52595;
var gracePeriod = 5000;
var noExit = false;
var maxIDSearchIndex = DEFAULT_MAX_ID_SEARCH_INDEX;
var BLOCKSTACK_TEST = !!env.BLOCKSTACK_TEST;
function getMaxIDSearchIndex() {
  return maxIDSearchIndex;
}

function profileSign(network, args) {
  var profilePath = args[0];
  var profileData = JSON.parse(readFileSync(profilePath).toString());
  return Promise.resolve().then(function () {
    return makeProfileJWT(profileData, args[1]);
  });
}

function profileVerify(network, args) {
  var profilePath = args[0];
  var publicKeyOrAddress = args[1];

  if (publicKeyOrAddress.match(ID_ADDRESS_PATTERN)) {
    publicKeyOrAddress = network.coerceMainnetAddress(publicKeyOrAddress.slice(3));
  }

  var profileString = readFileSync(profilePath).toString();
  return Promise.resolve().then(function () {
    var profileToken = null;

    try {
      var profileTokens = JSON.parse(profileString);
      profileToken = profileTokens[0].token;
    } catch (e) {
      profileToken = profileString;
    }

    if (!profileToken) {
      throw new Error("Data at " + profilePath + " does not appear to be a signed profile");
    }

    var profile = extractProfile(profileToken, publicKeyOrAddress);
    return JSONStringify(profile);
  });
}

function profileStore(network, args) {
  var nameOrAddress = args[0];
  var signedProfilePath = args[1];
  var privateKey = decodePrivateKey(args[2]);
  var gaiaHubUrl = args[3];
  var signedProfileData = readFileSync(signedProfilePath).toString();
  var ownerAddress = getPrivateKeyAddress(network, privateKey);
  var ownerAddressMainnet = network.coerceMainnetAddress(ownerAddress);
  var nameInfoPromise;
  var name = '';

  if (nameOrAddress.startsWith('ID-')) {
    nameInfoPromise = Promise.resolve().then(function () {
      return {
        address: nameOrAddress.slice(3)
      };
    });
  } else {
    nameInfoPromise = getNameInfoEasy(network, nameOrAddress);
    name = nameOrAddress;
  }

  var verifyProfilePromise = profileVerify(network, [signedProfilePath, "ID-" + ownerAddressMainnet]);
  return Promise.all([nameInfoPromise, verifyProfilePromise]).then(function (_ref) {
    var nameInfo = _ref[0];

    if (safetyChecks && (!nameInfo || network.coerceAddress(nameInfo.address) !== network.coerceAddress(ownerAddress))) {
      throw new Error('Name owner address either could not be found, or does not match ' + ("private key address " + ownerAddress));
    }

    return gaiaUploadProfileAll(network, [gaiaHubUrl], signedProfileData, args[2], name);
  }).then(function (gaiaUrls) {
    if (gaiaUrls.hasOwnProperty('error')) {
      return JSONStringify({
        dataUrls: gaiaUrls.dataUrls,
        error: gaiaUrls.error
      }, true);
    } else {
      return JSONStringify({
        profileUrls: gaiaUrls.dataUrls
      });
    }
  });
}

function getAppKeys(_x, _x2) {
  return _getAppKeys.apply(this, arguments);
}

function _getAppKeys() {
  _getAppKeys = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(network, args) {
    var mnemonic, nameOrIDAddress, origin, idAddress, networkInfo;
    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return getBackupPhrase(args[0]);

          case 2:
            mnemonic = _context.sent;
            nameOrIDAddress = args[1];
            origin = args[2];
            _context.next = 7;
            return getIDAddress(network, nameOrIDAddress);

          case 7:
            idAddress = _context.sent;
            _context.next = 10;
            return getApplicationKeyInfo(network, mnemonic, idAddress, origin);

          case 10:
            networkInfo = _context.sent;
            return _context.abrupt("return", JSONStringify(networkInfo));

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getAppKeys.apply(this, arguments);
}

function getOwnerKeys(_x3, _x4) {
  return _getOwnerKeys.apply(this, arguments);
}

function _getOwnerKeys() {
  _getOwnerKeys = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2(network, args) {
    var mnemonic, maxIndex, keyInfo, i;
    return runtime_1.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return getBackupPhrase(args[0]);

          case 2:
            mnemonic = _context2.sent;
            maxIndex = 1;

            if (args.length > 1 && !!args[1]) {
              maxIndex = parseInt(args[1]);
            }

            keyInfo = [];
            i = 0;

          case 7:
            if (!(i < maxIndex)) {
              _context2.next = 16;
              break;
            }

            _context2.t0 = keyInfo;
            _context2.next = 11;
            return getOwnerKeyInfo(network, mnemonic, i);

          case 11:
            _context2.t1 = _context2.sent;

            _context2.t0.push.call(_context2.t0, _context2.t1);

          case 13:
            i++;
            _context2.next = 7;
            break;

          case 16:
            return _context2.abrupt("return", JSONStringify(keyInfo));

          case 17:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _getOwnerKeys.apply(this, arguments);
}

function getPaymentKey(_x5, _x6) {
  return _getPaymentKey.apply(this, arguments);
}

function _getPaymentKey() {
  _getPaymentKey = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee3(network, args) {
    var mnemonic, keyObj, keyInfo;
    return runtime_1.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return getBackupPhrase(args[0]);

          case 2:
            mnemonic = _context3.sent;
            _context3.next = 5;
            return getPaymentKeyInfo(network, mnemonic);

          case 5:
            keyObj = _context3.sent;
            keyInfo = [];
            keyInfo.push(keyObj);
            return _context3.abrupt("return", JSONStringify(keyInfo));

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _getPaymentKey.apply(this, arguments);
}

function getStacksWalletKey(_x7, _x8) {
  return _getStacksWalletKey.apply(this, arguments);
}

function _getStacksWalletKey() {
  _getStacksWalletKey = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee4(network, args) {
    var mnemonic, keyObj, keyInfo;
    return runtime_1.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return getBackupPhrase(args[0]);

          case 2:
            mnemonic = _context4.sent;
            _context4.next = 5;
            return getStacksWalletKeyInfo(network, mnemonic);

          case 5:
            keyObj = _context4.sent;
            keyInfo = [];
            keyInfo.push(keyObj);
            return _context4.abrupt("return", JSONStringify(keyInfo));

          case 9:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _getStacksWalletKey.apply(this, arguments);
}

function makeKeychain(_x9, _x10) {
  return _makeKeychain.apply(this, arguments);
}

function _makeKeychain() {
  _makeKeychain = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee5(network, args) {
    var mnemonic, stacksKeyInfo;
    return runtime_1.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (!args[0]) {
              _context5.next = 6;
              break;
            }

            _context5.next = 3;
            return getBackupPhrase(args[0]);

          case 3:
            mnemonic = _context5.sent;
            _context5.next = 9;
            break;

          case 6:
            _context5.next = 8;
            return generateMnemonic(STX_WALLET_COMPATIBLE_SEED_STRENGTH, randomBytes);

          case 8:
            mnemonic = _context5.sent;

          case 9:
            _context5.next = 11;
            return getStacksWalletKeyInfo(network, mnemonic);

          case 11:
            stacksKeyInfo = _context5.sent;
            return _context5.abrupt("return", JSONStringify({
              mnemonic: mnemonic,
              keyInfo: stacksKeyInfo
            }));

          case 13:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _makeKeychain.apply(this, arguments);
}

function balance(network, args) {
  var address = args[0];

  if (BLOCKSTACK_TEST) {
    address = network.coerceAddress(address);
  }

  var txNetwork = network.isMainnet() ? new StacksMainnet() : new StacksTestnet();
  txNetwork.coreApiUrl = network.legacyNetwork.blockstackAPIUrl;
  return fetch(txNetwork.getAccountApiUrl(address)).then(function (response) {
    return response.json();
  }).then(function (response) {
    var balanceHex = response.balance;

    if (response.balance.startsWith('0x')) {
      balanceHex = response.balance.substr(2);
    }

    var lockedHex = response.locked;

    if (response.locked.startsWith('0x')) {
      lockedHex = response.locked.substr(2);
    }

    var unlockHeight = response.unlock_height;
    var balance = new BN(balanceHex, 16);
    var locked = new BN(lockedHex, 16);
    var res = {
      balance: balance.toString(10),
      locked: locked.toString(10),
      unlock_height: unlockHeight,
      nonce: response.nonce
    };
    return Promise.resolve(JSONStringify(res));
  });
}

function getAccountHistory(network, args) {
  var address = c32check.c32ToB58(args[0]);

  if (args.length >= 2 && !!args[1]) {
    var page = parseInt(args[1]);
    return Promise.resolve().then(function () {
      return network.getAccountHistoryPage(address, page);
    }).then(function (accountStates) {
      return JSONStringify(accountStates.map(function (s) {
        var new_s = {
          address: c32check.b58ToC32(s.address),
          credit_value: s.credit_value.toString(),
          debit_value: s.debit_value.toString()
        };
        return new_s;
      }));
    });
  } else {
    var getAllAccountHistoryPages = function getAllAccountHistoryPages(page) {
      return network.getAccountHistoryPage(address, page).then(function (results) {
        if (results.length == 0) {
          return history;
        } else {
          history = history.concat(results);
          return getAllAccountHistoryPages(page + 1);
        }
      });
    };

    var history = [];
    return getAllAccountHistoryPages(0).then(function (accountStates) {
      return JSONStringify(accountStates.map(function (s) {
        var new_s = {
          address: c32check.b58ToC32(s.address),
          credit_value: s.credit_value.toString(),
          debit_value: s.debit_value.toString()
        };
        return new_s;
      }));
    });
  }
}

function sendTokens(_x11, _x12) {
  return _sendTokens.apply(this, arguments);
}

function _sendTokens() {
  _sendTokens = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee6(network, args) {
    var recipientAddress, tokenAmount, fee, nonce, privateKey, memo, txNetwork, options, tx;
    return runtime_1.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            recipientAddress = args[0];
            tokenAmount = new BN(args[1]);
            fee = new BN(args[2]);
            nonce = new BN(args[3]);
            privateKey = args[4];
            memo = '';

            if (args.length > 4 && !!args[5]) {
              memo = args[5];
            }

            txNetwork = network.isMainnet() ? new StacksMainnet() : new StacksTestnet();
            txNetwork.coreApiUrl = network.legacyNetwork.blockstackAPIUrl;
            options = {
              recipient: recipientAddress,
              amount: tokenAmount,
              senderKey: privateKey,
              fee: fee,
              nonce: nonce,
              memo: memo,
              network: txNetwork
            };
            _context6.next = 12;
            return makeSTXTokenTransfer(options);

          case 12:
            tx = _context6.sent;

            if (!estimateOnly) {
              _context6.next = 15;
              break;
            }

            return _context6.abrupt("return", estimateTransfer(tx, txNetwork).then(function (cost) {
              return cost.toString(10);
            }));

          case 15:
            if (!txOnly) {
              _context6.next = 17;
              break;
            }

            return _context6.abrupt("return", Promise.resolve(tx.serialize().toString('hex')));

          case 17:
            return _context6.abrupt("return", broadcastTransaction(tx, txNetwork).then(function (response) {
              if (response.hasOwnProperty('error')) {
                return response;
              }

              return {
                txid: "0x" + tx.txid(),
                transaction: generateExplorerTxPageUrl(tx.txid(), txNetwork)
              };
            })["catch"](function (error) {
              return error.toString();
            }));

          case 18:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
  return _sendTokens.apply(this, arguments);
}

function contractDeploy(_x13, _x14) {
  return _contractDeploy.apply(this, arguments);
}

function _contractDeploy() {
  _contractDeploy = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee7(network, args) {
    var sourceFile, contractName, fee, nonce, privateKey, source, txNetwork, options, tx;
    return runtime_1.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            sourceFile = args[0];
            contractName = args[1];
            fee = new BN(args[2]);
            nonce = new BN(args[3]);
            privateKey = args[4];
            source = readFileSync(sourceFile).toString();
            txNetwork = network.isMainnet() ? new StacksMainnet() : new StacksTestnet();
            txNetwork.coreApiUrl = network.legacyNetwork.blockstackAPIUrl;
            options = {
              contractName: contractName,
              codeBody: source,
              senderKey: privateKey,
              fee: fee,
              nonce: nonce,
              network: txNetwork,
              postConditionMode: PostConditionMode.Allow
            };
            _context7.next = 11;
            return makeContractDeploy(options);

          case 11:
            tx = _context7.sent;

            if (!estimateOnly) {
              _context7.next = 14;
              break;
            }

            return _context7.abrupt("return", estimateContractDeploy(tx, txNetwork).then(function (cost) {
              return cost.toString(10);
            }));

          case 14:
            if (!txOnly) {
              _context7.next = 16;
              break;
            }

            return _context7.abrupt("return", Promise.resolve(tx.serialize().toString('hex')));

          case 16:
            return _context7.abrupt("return", broadcastTransaction(tx, txNetwork).then(function (response) {
              if (response.hasOwnProperty('error')) {
                return response;
              }

              return {
                txid: "0x" + tx.txid(),
                transaction: generateExplorerTxPageUrl(tx.txid(), txNetwork)
              };
            })["catch"](function (error) {
              return error.toString();
            }));

          case 17:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));
  return _contractDeploy.apply(this, arguments);
}

function contractFunctionCall(_x15, _x16) {
  return _contractFunctionCall.apply(this, arguments);
}

function _contractFunctionCall() {
  _contractFunctionCall = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee8(network, args) {
    var contractAddress, contractName, functionName, fee, nonce, privateKey, txNetwork, abi, abiArgs, functionArgs;
    return runtime_1.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            contractAddress = args[0];
            contractName = args[1];
            functionName = args[2];
            fee = new BN(args[3]);
            nonce = new BN(args[4]);
            privateKey = args[5];
            txNetwork = network.isMainnet() ? new StacksMainnet() : new StacksTestnet();
            txNetwork.coreApiUrl = network.legacyNetwork.blockstackAPIUrl;
            functionArgs = [];
            return _context8.abrupt("return", getAbi(contractAddress, contractName, txNetwork).then(function (responseAbi) {
              abi = responseAbi;
              var filtered = abi.functions.filter(function (fn) {
                return fn.name === functionName;
              });

              if (filtered.length === 1) {
                abiArgs = filtered[0].args;
                return makePromptsFromArgList(abiArgs);
              } else {
                return null;
              }
            }).then(function (prompts) {
              return prompt(prompts);
            }).then(function (answers) {
              functionArgs = parseClarityFunctionArgAnswers(answers, abiArgs);
              var options = {
                contractAddress: contractAddress,
                contractName: contractName,
                functionName: functionName,
                functionArgs: functionArgs,
                senderKey: privateKey,
                fee: fee,
                nonce: nonce,
                network: txNetwork,
                postConditionMode: PostConditionMode.Allow
              };
              return makeContractCall(options);
            }).then(function (tx) {
              if (!validateContractCall(tx.payload, abi)) {
                throw new Error('Failed to validate function arguments against ABI');
              }

              if (estimateOnly) {
                return estimateContractFunctionCall(tx, txNetwork).then(function (cost) {
                  return cost.toString(10);
                });
              }

              if (txOnly) {
                return Promise.resolve(tx.serialize().toString('hex'));
              }

              return broadcastTransaction(tx, txNetwork).then(function (response) {
                if (response.hasOwnProperty('error')) {
                  return response;
                }

                return {
                  txid: "0x" + tx.txid(),
                  transaction: generateExplorerTxPageUrl(tx.txid(), txNetwork)
                };
              })["catch"](function (error) {
                return error.toString();
              });
            }));

          case 10:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));
  return _contractFunctionCall.apply(this, arguments);
}

function readOnlyContractFunctionCall(_x17, _x18) {
  return _readOnlyContractFunctionCall.apply(this, arguments);
}

function _readOnlyContractFunctionCall() {
  _readOnlyContractFunctionCall = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee9(network, args) {
    var contractAddress, contractName, functionName, senderAddress, txNetwork, abi, abiArgs, functionArgs;
    return runtime_1.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            contractAddress = args[0];
            contractName = args[1];
            functionName = args[2];
            senderAddress = args[3];
            txNetwork = network.isMainnet() ? new StacksMainnet() : new StacksTestnet();
            txNetwork.coreApiUrl = network.legacyNetwork.blockstackAPIUrl;
            functionArgs = [];
            return _context9.abrupt("return", getAbi(contractAddress, contractName, txNetwork).then(function (responseAbi) {
              abi = responseAbi;
              var filtered = abi.functions.filter(function (fn) {
                return fn.name === functionName;
              });

              if (filtered.length === 1) {
                abiArgs = filtered[0].args;
                return makePromptsFromArgList(abiArgs);
              } else {
                return null;
              }
            }).then(function (prompts) {
              return prompt(prompts);
            }).then(function (answers) {
              functionArgs = parseClarityFunctionArgAnswers(answers, abiArgs);
              var options = {
                contractAddress: contractAddress,
                contractName: contractName,
                functionName: functionName,
                functionArgs: functionArgs,
                senderAddress: senderAddress,
                network: txNetwork
              };
              return callReadOnlyFunction(options);
            }).then(function (returnValue) {
              return cvToString(returnValue);
            })["catch"](function (error) {
              return error.toString();
            }));

          case 8:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));
  return _readOnlyContractFunctionCall.apply(this, arguments);
}

function getKeyAddress(network, args) {
  var privateKey = decodePrivateKey(args[0]);
  return Promise.resolve().then(function () {
    var addr = getPrivateKeyAddress(network, privateKey);
    return JSONStringify({
      BTC: addr,
      STACKS: c32check.b58ToC32(addr)
    });
  });
}

function gaiaGetFile(network, args) {
  var username = args[0];
  var origin = args[1];
  var path = args[2];
  var appPrivateKey = args[3];
  var decrypt = false;
  var verify = false;

  if (!!appPrivateKey && args.length > 4 && !!args[4]) {
    decrypt = args[4].toLowerCase() === 'true' || args[4].toLowerCase() === '1';
  }

  if (!!appPrivateKey && args.length > 5 && !!args[5]) {
    verify = args[5].toLowerCase() === 'true' || args[5].toLowerCase() === '1';
  }

  if (!appPrivateKey) {
    appPrivateKey = 'fda1afa3ff9ef25579edb5833b825ac29fae82d03db3f607db048aae018fe882';
  }

  config.network.layer1 = networks.bitcoin;
  return gaiaAuth(network, appPrivateKey, null).then(function (_userData) {
    return getFile(path, {
      decrypt: decrypt,
      verify: verify,
      app: origin,
      username: username
    });
  }).then(function (data) {
    if (data instanceof ArrayBuffer) {
      return Buffer.from(data);
    } else {
      return data;
    }
  });
}

function gaiaPutFile(network, args) {
  var hubUrl = args[0];
  var appPrivateKey = args[1];
  var dataPath = args[2];
  var gaiaPath = normalize(args[3].replace(/^\/+/, ''));
  var encrypt = false;
  var sign = false;

  if (args.length > 4 && !!args[4]) {
    encrypt = args[4].toLowerCase() === 'true' || args[4].toLowerCase() === '1';
  }

  if (args.length > 5 && !!args[5]) {
    sign = args[5].toLowerCase() === 'true' || args[5].toLowerCase() === '1';
  }

  var data = readFileSync(dataPath);
  config.network.layer1 = networks.bitcoin;
  return gaiaAuth(network, appPrivateKey, hubUrl).then(function (_userData) {
    return putFile(gaiaPath, data, {
      encrypt: encrypt,
      sign: sign
    });
  }).then(function (url) {
    return JSONStringify({
      urls: [url]
    });
  });
}

function gaiaDeleteFile(network, args) {
  var hubUrl = args[0];
  var appPrivateKey = args[1];
  var gaiaPath = normalize(args[2].replace(/^\/+/, ''));
  var wasSigned = false;

  if (args.length > 3 && !!args[3]) {
    wasSigned = args[3].toLowerCase() === 'true' || args[3].toLowerCase() === '1';
  }

  config.network.layer1 = networks.bitcoin;
  return gaiaAuth(network, appPrivateKey, hubUrl).then(function (_userData) {
    return deleteFile(gaiaPath, {
      wasSigned: wasSigned
    });
  }).then(function () {
    return JSONStringify('ok');
  });
}

function gaiaListFiles(network, args) {
  var hubUrl = args[0];
  var appPrivateKey = args[1];
  var count = 0;
  config.network.layer1 = networks.bitcoin;
  return gaiaAuth(network, canonicalPrivateKey(appPrivateKey), hubUrl).then(function (_userData) {
    return listFiles(function (name) {
      console.log(name);
      count += 1;
      return true;
    });
  }).then(function () {
    return JSONStringify(count);
  });
}

function batchify(input, batchSize) {
  if (batchSize === void 0) {
    batchSize = 50;
  }

  var output = [];
  var currentBatch = [];

  for (var i = 0; i < input.length; i++) {
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

function gaiaDumpBucket(network, args) {
  var nameOrIDAddress = args[0];
  var appOrigin = args[1];
  var hubUrl = args[2];
  var mnemonicOrCiphertext = args[3];
  var dumpDir = args[4];

  if (dumpDir.length === 0) {
    throw new Error('Invalid directory (not given)');
  }

  if (dumpDir[0] !== '/') {
    var cwd = realpathSync('.');
    dumpDir = normalize(cwd + "/" + dumpDir);
  }

  mkdirs(dumpDir);

  function downloadFile(hubConfig, fileName) {
    var gaiaReadUrl = hubConfig.url_prefix.replace(/\/+$/, '') + "/" + hubConfig.address;
    var fileUrl = gaiaReadUrl + "/" + fileName;
    var destPath = dumpDir + "/" + fileName.replace(/\//g, '\\x2f');
    console.log("Download " + fileUrl + " to " + destPath);
    return fetch(fileUrl).then(function (resp) {
      if (resp.status !== 200) {
        throw new Error("Bad status code for " + fileUrl + ": " + resp.status);
      }

      var contentType = resp.headers.get('Content-Type');

      if (contentType === null || contentType.startsWith('text') || contentType === 'application/json') {
        return resp.text();
      } else {
        return resp.arrayBuffer();
      }
    }).then(function (filebytes) {
      return new Promise(function (resolve, reject) {
        try {
          writeFileSync(destPath, Buffer.from(filebytes), {
            encoding: null,
            mode: 432
          });
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  config.network.layer1 = networks.bitcoin;
  var fileNames = [];
  var gaiaHubConfig;
  var appPrivateKey;
  var ownerPrivateKey;
  return getIDAppKeys(network, nameOrIDAddress, appOrigin, mnemonicOrCiphertext).then(function (keyInfo) {
    appPrivateKey = keyInfo.appPrivateKey;
    ownerPrivateKey = keyInfo.ownerPrivateKey;
    return gaiaAuth(network, appPrivateKey, hubUrl, ownerPrivateKey);
  }).then(function (_userData) {
    return gaiaConnect(network, hubUrl, appPrivateKey);
  }).then(function (hubConfig) {
    gaiaHubConfig = hubConfig;
    return listFiles(function (name) {
      fileNames.push(name);
      return true;
    });
  }).then(function (fileCount) {
    console.log("Download " + fileCount + " files...");
    var fileBatches = batchify(fileNames);
    var filePromiseChain = Promise.resolve();

    var _loop = function _loop(i) {
      var filePromises = fileBatches[i].map(function (fileName) {
        return downloadFile(gaiaHubConfig, fileName);
      });
      var batchPromise = Promise.all(filePromises);
      filePromiseChain = filePromiseChain.then(function () {
        return batchPromise;
      });
    };

    for (var i = 0; i < fileBatches.length; i++) {
      _loop(i);
    }

    return filePromiseChain.then(function () {
      return JSONStringify(fileCount);
    });
  });
}

function gaiaRestoreBucket(network, args) {
  var nameOrIDAddress = args[0];
  var appOrigin = args[1];
  var hubUrl = args[2];
  var mnemonicOrCiphertext = args[3];
  var dumpDir = args[4];

  if (dumpDir.length === 0) {
    throw new Error('Invalid directory (not given)');
  }

  if (dumpDir[0] !== '/') {
    var cwd = realpathSync('.');
    dumpDir = normalize(cwd + "/" + dumpDir);
  }

  var fileList = readdirSync(dumpDir);
  var fileBatches = batchify(fileList, 10);
  var appPrivateKey;
  var ownerPrivateKey;
  config.network.layer1 = networks.bitcoin;
  return getIDAppKeys(network, nameOrIDAddress, appOrigin, mnemonicOrCiphertext).then(function (keyInfo) {
    appPrivateKey = keyInfo.appPrivateKey;
    ownerPrivateKey = keyInfo.ownerPrivateKey;
    return gaiaAuth(network, appPrivateKey, hubUrl, ownerPrivateKey);
  }).then(function (_userData) {
    var uploadPromise = Promise.resolve();

    var _loop2 = function _loop2(i) {
      var uploadBatchPromises = fileBatches[i].map(function (fileName) {
        var filePath = join(dumpDir, fileName);
        var dataBuf = readFileSync(filePath);
        var gaiaPath = fileName.replace(/\\x2f/g, '/');
        return putFile(gaiaPath, dataBuf, {
          encrypt: false,
          sign: false
        }).then(function (url) {
          console.log("Uploaded " + fileName + " to " + url);
        });
      });
      uploadPromise = uploadPromise.then(function () {
        return Promise.all(uploadBatchPromises);
      });
    };

    for (var i = 0; i < fileBatches.length; i++) {
      _loop2(i);
    }

    return uploadPromise;
  }).then(function () {
    return JSONStringify(fileList.length);
  });
}

function gaiaSetHub(_x19, _x20) {
  return _gaiaSetHub.apply(this, arguments);
}

function _gaiaSetHub() {
  _gaiaSetHub = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee10(network, args) {
    var blockstackID, ownerHubUrl, appOrigin, hubUrl, mnemonicPromise, nameInfoPromise, profilePromise, _yield$Promise$all, nameInfo, nameProfile, mnemonic, ownerAddress, idAddress, appKeyInfo, ownerKeyInfo, existingAppAddress, appPrivateKey, appAddress, profile, ownerPrivateKey, ownerGaiaHubPromise, appGaiaHubPromise, _yield$Promise$all2, ownerHubConfig, appHubConfig, gaiaReadUrl, newAppEntry, apps, signedProfile, profileUrls;

    return runtime_1.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            network.setCoerceMainnetAddress(true);
            blockstackID = args[0];
            ownerHubUrl = args[1];
            appOrigin = args[2];
            hubUrl = args[3];
            mnemonicPromise = getBackupPhrase(args[4]);
            nameInfoPromise = getNameInfoEasy(network, blockstackID).then(function (nameInfo) {
              if (!nameInfo) {
                throw new Error('Name not found');
              }

              return nameInfo;
            });
            profilePromise = lookupProfile(blockstackID);
            _context10.next = 10;
            return Promise.all([nameInfoPromise, profilePromise, mnemonicPromise]);

          case 10:
            _yield$Promise$all = _context10.sent;
            nameInfo = _yield$Promise$all[0];
            nameProfile = _yield$Promise$all[1];
            mnemonic = _yield$Promise$all[2];

            if (nameProfile) {
              _context10.next = 16;
              break;
            }

            throw new Error('No profile found');

          case 16:
            if (nameInfo) {
              _context10.next = 18;
              break;
            }

            throw new Error('Name not found');

          case 18:
            if (nameInfo.zonefile) {
              _context10.next = 20;
              break;
            }

            throw new Error('No zone file found');

          case 20:
            if (!nameProfile.apps) {
              nameProfile.apps = {};
            }

            ownerAddress = network.coerceMainnetAddress(nameInfo.address);
            idAddress = "ID-" + ownerAddress;
            _context10.next = 25;
            return getApplicationKeyInfo(network, mnemonic, idAddress, appOrigin);

          case 25:
            appKeyInfo = _context10.sent;
            _context10.next = 28;
            return getOwnerKeyInfo(network, mnemonic, appKeyInfo.ownerKeyIndex);

          case 28:
            ownerKeyInfo = _context10.sent;
            existingAppAddress = null;

            try {
              existingAppAddress = getGaiaAddressFromProfile(network, nameProfile, appOrigin);
              appPrivateKey = extractAppKey(network, appKeyInfo, existingAppAddress);
            } catch (e) {
              console.log("No profile application entry for " + appOrigin);
              appPrivateKey = extractAppKey(network, appKeyInfo);
            }

            appPrivateKey = canonicalPrivateKey(appPrivateKey) + "01";
            appAddress = network.coerceMainnetAddress(getPrivateKeyAddress(network, appPrivateKey));

            if (!(existingAppAddress && appAddress !== existingAppAddress)) {
              _context10.next = 35;
              break;
            }

            throw new Error("BUG: " + existingAppAddress + " !== " + appAddress);

          case 35:
            profile = nameProfile;
            ownerPrivateKey = ownerKeyInfo.privateKey;
            ownerGaiaHubPromise = gaiaConnect(network, ownerHubUrl, ownerPrivateKey);
            appGaiaHubPromise = gaiaConnect(network, hubUrl, appPrivateKey);
            _context10.next = 41;
            return Promise.all([ownerGaiaHubPromise, appGaiaHubPromise]);

          case 41:
            _yield$Promise$all2 = _context10.sent;
            ownerHubConfig = _yield$Promise$all2[0];
            appHubConfig = _yield$Promise$all2[1];

            if (ownerHubConfig.url_prefix) {
              _context10.next = 46;
              break;
            }

            throw new Error('Invalid owner hub config: no url_prefix defined');

          case 46:
            if (appHubConfig.url_prefix) {
              _context10.next = 48;
              break;
            }

            throw new Error('Invalid app hub config: no url_prefix defined');

          case 48:
            gaiaReadUrl = appHubConfig.url_prefix.replace(/\/+$/, '');
            newAppEntry = {};
            newAppEntry[appOrigin] = gaiaReadUrl + "/" + appAddress + "/";
            apps = Object.assign({}, profile.apps ? profile.apps : {}, newAppEntry);
            profile.apps = apps;
            signedProfile = makeProfileJWT(profile, ownerPrivateKey);
            _context10.next = 56;
            return gaiaUploadProfileAll(network, [ownerHubUrl], signedProfile, ownerPrivateKey, blockstackID);

          case 56:
            profileUrls = _context10.sent;

            if (!profileUrls.error) {
              _context10.next = 61;
              break;
            }

            return _context10.abrupt("return", JSONStringify({
              error: profileUrls.error
            }));

          case 61:
            return _context10.abrupt("return", JSONStringify({
              profileUrls: profileUrls.dataUrls
            }));

          case 62:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));
  return _gaiaSetHub.apply(this, arguments);
}

function addressConvert(network, args) {
  var addr = args[0];
  var b58addr;
  var c32addr;
  var testnetb58addr;
  var testnetc32addr;

  if (addr.match(STACKS_ADDRESS_PATTERN)) {
    c32addr = addr;
    b58addr = c32check.c32ToB58(c32addr);
  } else if (addr.match(/[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+/)) {
    c32addr = c32check.b58ToC32(addr);
    b58addr = addr;
  } else {
    throw new Error("Unrecognized address " + addr);
  }

  if (network.isTestnet()) {
    testnetb58addr = network.coerceAddress(b58addr);
    testnetc32addr = c32check.b58ToC32(testnetb58addr);
  }

  return Promise.resolve().then(function () {
    var result = {
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

    return JSONStringify(result);
  });
}

function authDaemon(network, args) {
  var gaiaHubUrl = args[0];
  var mnemonicOrCiphertext = args[1];
  var port = 3000;
  var profileGaiaHub = gaiaHubUrl;

  if (args.length > 2 && !!args[2]) {
    profileGaiaHub = args[2];
  }

  if (args.length > 3 && !!args[3]) {
    port = parseInt(args[3]);
  }

  if (port < 0 || port > 65535) {
    return Promise.resolve().then(function () {
      return JSONStringify({
        error: 'Invalid port'
      });
    });
  }

  var mnemonicPromise = getBackupPhrase(mnemonicOrCiphertext);
  return mnemonicPromise.then(function (mnemonic) {
    noExit = true;
    var authServer = express();
    authServer.use(cors());
    authServer.get(/^\/auth\/*$/, function (req, res) {
      return handleAuth(network, mnemonic, gaiaHubUrl, profileGaiaHub, port, req, res);
    });
    authServer.get(/^\/signin\/*$/, function (req, res) {
      return handleSignIn(network, mnemonic, gaiaHubUrl, profileGaiaHub, req, res);
    });
    authServer.listen(port, function () {
      return console.log("Authentication server started on " + port);
    });
    return 'Press Ctrl+C to exit';
  })["catch"](function (e) {
    return JSONStringify({
      error: e.message
    });
  });
}

function encryptMnemonic(network, args) {
  var mnemonic = args[0];

  if (mnemonic.split(/ +/g).length !== 12) {
    throw new Error('Invalid backup phrase: must be 12 words');
  }

  var passwordPromise = new Promise(function (resolve, reject) {
    var pass = '';

    if (args.length === 2 && !!args[1]) {
      pass = args[1];
      resolve(pass);
    } else {
      if (!stdin.isTTY) {
        var errMsg = 'Password argument required on non-interactive mode';
        reject(new Error(errMsg));
      } else {
        getpass('Enter password: ', function (pass1) {
          getpass('Enter password again: ', function (pass2) {
            if (pass1 !== pass2) {
              var _errMsg = 'Passwords do not match';
              reject(new Error(_errMsg));
            } else {
              resolve(pass1);
            }
          });
        });
      }
    }
  });
  return passwordPromise.then(function (pass) {
    return encryptBackupPhrase(mnemonic, pass);
  }).then(function (cipherTextBuffer) {
    return cipherTextBuffer.toString('base64');
  })["catch"](function (e) {
    return JSONStringify({
      error: e.message
    });
  });
}

function decryptMnemonic(network, args) {
  var ciphertext = args[0];
  var passwordPromise = new Promise(function (resolve, reject) {
    if (args.length === 2 && !!args[1]) {
      var pass = args[1];
      resolve(pass);
    } else {
      if (!stdin.isTTY) {
        reject(new Error('Password argument required in non-interactive mode'));
      } else {
        getpass('Enter password: ', function (p) {
          resolve(p);
        });
      }
    }
  });
  return passwordPromise.then(function (pass) {
    return decryptBackupPhrase(Buffer.from(ciphertext, 'base64'), pass);
  })["catch"](function (e) {
    return JSONStringify({
      error: 'Failed to decrypt (wrong password or corrupt ciphertext), ' + ("details: " + e.message)
    });
  });
}

function stackingStatus(_x21, _x22) {
  return _stackingStatus.apply(this, arguments);
}

function _stackingStatus() {
  _stackingStatus = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee11(network, args) {
    var stxAddress, txNetwork, stacker;
    return runtime_1.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            stxAddress = args[0];
            txNetwork = network.isMainnet() ? new StacksMainnet() : new StacksTestnet();
            stacker = new StackingClient(stxAddress, txNetwork);
            return _context11.abrupt("return", stacker.getStatus().then(function (status) {
              if (status.stacked) {
                return {
                  amount_microstx: status.details.amount_microstx,
                  first_reward_cycle: status.details.first_reward_cycle,
                  lock_period: status.details.lock_period,
                  unlock_height: status.details.unlock_height,
                  pox_address: {
                    version: status.details.pox_address.version.toString('hex'),
                    hashbytes: status.details.pox_address.hashbytes.toString('hex')
                  }
                };
              } else {
                return 'Account not actively participating in Stacking';
              }
            })["catch"](function (error) {
              return error.toString();
            }));

          case 4:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));
  return _stackingStatus.apply(this, arguments);
}

function canStack(_x23, _x24) {
  return _canStack.apply(this, arguments);
}

function _canStack() {
  _canStack = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee12(network, args) {
    var amount, cycles, poxAddress, stxAddress, txNetwork, apiConfig, accounts, balancePromise, stacker, poxInfoPromise, stackingEligiblePromise;
    return runtime_1.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            amount = new BN(args[0]);
            cycles = Number(args[1]);
            poxAddress = args[2];
            stxAddress = args[3];
            txNetwork = network.isMainnet() ? new StacksMainnet() : new StacksTestnet();
            apiConfig = new Configuration({
              fetchApi: crossfetch,
              basePath: txNetwork.coreApiUrl
            });
            accounts = new AccountsApi(apiConfig);
            balancePromise = accounts.getAccountBalance({
              principal: stxAddress
            });
            stacker = new StackingClient(stxAddress, txNetwork);
            poxInfoPromise = stacker.getPoxInfo();
            stackingEligiblePromise = stacker.canStack({
              poxAddress: poxAddress,
              cycles: cycles
            });
            return _context12.abrupt("return", Promise.all([balancePromise, poxInfoPromise, stackingEligiblePromise]).then(function (_ref2) {
              var balance = _ref2[0],
                  poxInfo = _ref2[1],
                  stackingEligible = _ref2[2];
              var minAmount = new BN(poxInfo.min_amount_ustx);
              var balanceBN = new BN(balance.stx.balance);

              if (minAmount.gt(amount)) {
                throw new Error("Stacking amount less than required minimum of " + minAmount.toString() + " microstacks");
              }

              if (amount.gt(balanceBN)) {
                throw new Error("Stacking amount greater than account balance of " + balanceBN.toString() + " microstacks");
              }

              if (!stackingEligible.eligible) {
                throw new Error("Account cannot participate in stacking. " + stackingEligible.reason);
              }

              return stackingEligible;
            })["catch"](function (error) {
              return error;
            }));

          case 12:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  }));
  return _canStack.apply(this, arguments);
}

function stack(_x25, _x26) {
  return _stack.apply(this, arguments);
}

function _stack() {
  _stack = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee13(network, args) {
    var amount, cycles, poxAddress, privateKey, txNetwork, txVersion, apiConfig, accounts, stxAddress, balancePromise, stacker, poxInfoPromise, coreInfoPromise, stackingEligiblePromise;
    return runtime_1.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            amount = new BN(args[0]);
            cycles = Number(args[1]);
            poxAddress = args[2];
            privateKey = args[3];
            txNetwork = network.isMainnet() ? new StacksMainnet() : new StacksTestnet();
            txVersion = txNetwork.isMainnet() ? TransactionVersion.Mainnet : TransactionVersion.Testnet;
            apiConfig = new Configuration({
              fetchApi: crossfetch,
              basePath: txNetwork.coreApiUrl
            });
            accounts = new AccountsApi(apiConfig);
            stxAddress = getAddressFromPrivateKey(privateKey, txVersion);
            balancePromise = accounts.getAccountBalance({
              principal: stxAddress
            });
            stacker = new StackingClient(stxAddress, txNetwork);
            poxInfoPromise = stacker.getPoxInfo();
            coreInfoPromise = stacker.getCoreInfo();
            stackingEligiblePromise = stacker.canStack({
              poxAddress: poxAddress,
              cycles: cycles
            });
            return _context13.abrupt("return", Promise.all([balancePromise, poxInfoPromise, coreInfoPromise, stackingEligiblePromise]).then(function (_ref3) {
              var balance = _ref3[0],
                  poxInfo = _ref3[1],
                  coreInfo = _ref3[2],
                  stackingEligible = _ref3[3];
              var minAmount = new BN(poxInfo.min_amount_ustx);
              var balanceBN = new BN(balance.stx.balance);
              var burnChainBlockHeight = coreInfo.burn_block_height;
              var startBurnBlock = burnChainBlockHeight + 3;

              if (minAmount.gt(amount)) {
                throw new Error("Stacking amount less than required minimum of " + minAmount.toString() + " microstacks");
              }

              if (amount.gt(balanceBN)) {
                throw new Error("Stacking amount greater than account balance of " + balanceBN.toString() + " microstacks");
              }

              if (!stackingEligible.eligible) {
                throw new Error("Account cannot participate in stacking. " + stackingEligible.reason);
              }

              return stacker.stack({
                amountMicroStx: amount,
                poxAddress: poxAddress,
                cycles: cycles,
                privateKey: privateKey,
                burnBlockHeight: startBurnBlock
              });
            }).then(function (response) {
              if (response.hasOwnProperty('error')) {
                return response;
              }

              return {
                txid: "0x" + response,
                transaction: generateExplorerTxPageUrl(response, txNetwork)
              };
            })["catch"](function (error) {
              return error;
            }));

          case 15:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));
  return _stack.apply(this, arguments);
}

function faucetCall(_, args) {
  var address = args[0];
  var apiConfig = new Configuration({
    fetchApi: crossfetch,
    basePath: 'https://stacks-node-api.blockstack.org'
  });
  var faucets = new FaucetsApi(apiConfig);
  return faucets.runFaucetStx({
    address: address
  }).then(function (faucetTx) {
    return JSONStringify({
      txid: faucetTx.txId,
      transaction: generateExplorerTxPageUrl(faucetTx.txId, new StacksTestnet())
    });
  })["catch"](function (error) {
    return error.toString();
  });
}

function printDocs(_network, _args) {
  return Promise.resolve().then(function () {
    var formattedDocs = [];
    var commandNames = Object.keys(CLI_ARGS.properties);

    for (var i = 0; i < commandNames.length; i++) {
      var commandName = commandNames[i];
      var args = [];
      var usage = CLI_ARGS.properties[commandName].help;
      var group = CLI_ARGS.properties[commandName].group;

      for (var j = 0; j < CLI_ARGS.properties[commandName].items.length; j++) {
        var argItem = CLI_ARGS.properties[commandName].items[j];
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

    return JSONStringify(formattedDocs);
  });
}

var COMMANDS = {
  authenticator: authDaemon,
  balance: balance,
  can_stack: canStack,
  call_contract_func: contractFunctionCall,
  call_read_only_contract_func: readOnlyContractFunctionCall,
  convert_address: addressConvert,
  decrypt_keychain: decryptMnemonic,
  deploy_contract: contractDeploy,
  docs: printDocs,
  encrypt_keychain: encryptMnemonic,
  gaia_deletefile: gaiaDeleteFile,
  gaia_dump_bucket: gaiaDumpBucket,
  gaia_getfile: gaiaGetFile,
  gaia_listfiles: gaiaListFiles,
  gaia_putfile: gaiaPutFile,
  gaia_restore_bucket: gaiaRestoreBucket,
  gaia_sethub: gaiaSetHub,
  get_address: getKeyAddress,
  get_account_history: getAccountHistory,
  get_app_keys: getAppKeys,
  get_owner_keys: getOwnerKeys,
  get_payment_key: getPaymentKey,
  get_stacks_wallet_key: getStacksWalletKey,
  make_keychain: makeKeychain,
  profile_sign: profileSign,
  profile_store: profileStore,
  profile_verify: profileVerify,
  send_tokens: sendTokens,
  stack: stack,
  stacking_status: stackingStatus,
  faucet: faucetCall
};
function CLIMain() {
  var argv$1 = argv;
  var opts = getCLIOpts(argv$1);
  var cmdArgs = checkArgs(CLIOptAsStringArray(opts, '_') ? CLIOptAsStringArray(opts, '_') : []);

  if (!cmdArgs.success) {
    if (cmdArgs.error) {
      console.log(cmdArgs.error);
    }

    if (cmdArgs.usage) {
      if (cmdArgs.command) {
        console.log(makeCommandUsageString(cmdArgs.command));
        console.log('Use "help" to list all commands.');
      } else {
        console.log(USAGE);
        console.log(makeAllCommandsList());
      }
    }

    exit(1);
  } else {
    txOnly = CLIOptAsBool(opts, 'x');
    estimateOnly = CLIOptAsBool(opts, 'e');
    safetyChecks = !CLIOptAsBool(opts, 'U');
    receiveFeesPeriod = opts['N'] ? parseInt(CLIOptAsString(opts, 'N')) : receiveFeesPeriod;
    gracePeriod = opts['G'] ? parseInt(CLIOptAsString(opts, 'N')) : gracePeriod;
    maxIDSearchIndex = opts['M'] ? parseInt(CLIOptAsString(opts, 'M')) : maxIDSearchIndex;
    var debug = CLIOptAsBool(opts, 'd');
    var consensusHash = CLIOptAsString(opts, 'C');
    var integration_test = CLIOptAsBool(opts, 'i');
    var testnet = CLIOptAsBool(opts, 't');
    var magicBytes = CLIOptAsString(opts, 'm');
    var apiUrl = CLIOptAsString(opts, 'H');
    var transactionBroadcasterUrl = CLIOptAsString(opts, 'T');
    var nodeAPIUrl = CLIOptAsString(opts, 'I');
    var utxoUrl = CLIOptAsString(opts, 'X');
    var bitcoindUsername = CLIOptAsString(opts, 'u');
    var bitcoindPassword = CLIOptAsString(opts, 'p');

    if (integration_test) {
      BLOCKSTACK_TEST = integration_test;
    }

    var configPath = CLIOptAsString(opts, 'c') ? CLIOptAsString(opts, 'c') : integration_test ? DEFAULT_CONFIG_REGTEST_PATH : testnet ? DEFAULT_CONFIG_TESTNET_PATH : DEFAULT_CONFIG_PATH;
    var namespaceBurnAddr = CLIOptAsString(opts, 'B');
    var feeRate = CLIOptAsString(opts, 'F') ? parseInt(CLIOptAsString(opts, 'F')) : 0;
    var priceToPay = CLIOptAsString(opts, 'P') ? CLIOptAsString(opts, 'P') : '0';
    var priceUnits = CLIOptAsString(opts, 'D');
    var networkType = testnet ? 'testnet' : integration_test ? 'regtest' : 'mainnet';
    var configData = loadConfig(configPath, networkType);

    if (debug) {
      configData.logConfig.level = 'debug';
    } else {
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

    configure({
      level: configData.logConfig.level,
      transports: [new transports.Console(configData.logConfig)]
    });
    var cliOpts = {
      consensusHash: consensusHash ? consensusHash : null,
      feeRate: feeRate ? feeRate : null,
      namespaceBurnAddress: namespaceBurnAddr ? namespaceBurnAddr : null,
      priceToPay: priceToPay ? priceToPay : null,
      priceUnits: priceUnits ? priceUnits : null,
      receiveFeesPeriod: receiveFeesPeriod ? receiveFeesPeriod : null,
      gracePeriod: gracePeriod ? gracePeriod : null,
      altAPIUrl: apiUrl ? apiUrl : configData.blockstackAPIUrl,
      altTransactionBroadcasterUrl: transactionBroadcasterUrl ? transactionBroadcasterUrl : configData.broadcastServiceUrl,
      nodeAPIUrl: nodeAPIUrl ? nodeAPIUrl : configData.blockstackNodeUrl
    };
    var wrappedNetwork = getNetwork(configData, !!BLOCKSTACK_TEST || !!integration_test || !!testnet);
    var blockstackNetwork = new CLINetworkAdapter(wrappedNetwork, cliOpts);

    config.logLevel = 'error';

    if (cmdArgs.command === 'help') {
      console.log(makeCommandUsageString(cmdArgs.args[0]));
      exit(0);
    }

    var method = COMMANDS[cmdArgs.command];
    var exitcode = 0;
    method(blockstackNetwork, cmdArgs.args).then(function (result) {
      try {
        if (result instanceof Buffer) {
          return result;
        } else {
          var resJson = JSON.parse(result);

          if (resJson.hasOwnProperty('status') && !resJson.status) {
            exitcode = 1;
          }

          return result;
        }
      } catch (e) {
        return result;
      }
    }).then(function (result) {
      if (result instanceof Buffer) {
        stdout.write(result);
      } else {
        console.log(result);
      }
    }).then(function () {
      if (!noExit) {
        exit(exitcode);
      }
    })["catch"](function (e) {
      console.error(e.stack);
      console.error(e.message);

      if (!noExit) {
        exit(1);
      }
    });
  }
}

export { CLIMain, getMaxIDSearchIndex };
//# sourceMappingURL=cli.esm.js.map
