import { asyncToGenerator as _asyncToGenerator, inheritsLoose as _inheritsLoose } from './_virtual/_rollupPluginBabelHelpers.js';
import runtime_1 from './node_modules/regenerator-runtime/runtime.esm.js';
import { hexStringToECPair, ecPairToAddress, signProfileToken, wrapProfileToken, config, getTokenFileUrl, lookupProfile } from 'blockstack';
import { payments, script, address, crypto } from 'bitcoinjs-lib';
import { lstatSync, constants, mkdirSync } from 'fs';
import { error } from 'winston';
import { getTypeString, isClarityAbiPrimitive, isClarityAbiBuffer, isClarityAbiResponse, isClarityAbiOptional, isClarityAbiTuple, isClarityAbiList, uintCV, intCV, trueCV, falseCV, standardPrincipalCV, bufferCVFromString, TransactionVersion } from '@stacks/transactions';
import 'url';
import { createInterface } from 'readline';
import { Writable } from 'stream';
import 'jsontokens';
import { PRIVATE_KEY_NOSIGN_PATTERN, PRIVATE_KEY_PATTERN, PRIVATE_KEY_MULTISIG_PATTERN, PRIVATE_KEY_SEGWIT_P2SH_PATTERN, ID_ADDRESS_PATTERN } from './argparse.esm.js';
import { decryptBackupPhrase } from './encrypt.esm.js';
import { extractAppKey, getApplicationKeyInfo, getOwnerKeyInfo } from './keys.esm.js';

var ZoneFile = /*#__PURE__*/require('zone-file');

var CLITransactionSigner = /*#__PURE__*/function () {
  function CLITransactionSigner(address) {
    if (address === void 0) {
      address = '';
    }

    this.address = address;
    this.isComplete = false;
  }

  var _proto = CLITransactionSigner.prototype;

  _proto.getAddress = function getAddress() {
    var _this = this;

    return Promise.resolve().then(function () {
      return _this.address;
    });
  };

  _proto.signTransaction = function signTransaction(_txIn, _signingIndex) {
    return Promise.resolve().then(function () {});
  };

  _proto.signerVersion = function signerVersion() {
    return 0;
  };

  return CLITransactionSigner;
}();

var NullSigner = /*#__PURE__*/function (_CLITransactionSigner) {
  _inheritsLoose(NullSigner, _CLITransactionSigner);

  function NullSigner() {
    return _CLITransactionSigner.apply(this, arguments) || this;
  }

  return NullSigner;
}(CLITransactionSigner);
var MultiSigKeySigner = /*#__PURE__*/function (_CLITransactionSigner2) {
  _inheritsLoose(MultiSigKeySigner, _CLITransactionSigner2);

  function MultiSigKeySigner(redeemScript, privateKeys) {
    var _this2;

    _this2 = _CLITransactionSigner2.call(this) || this;
    _this2.redeemScript = Buffer.from(redeemScript, 'hex');
    _this2.privateKeys = privateKeys;
    _this2.isComplete = true;

    try {
      var chunks = script.decompile(_this2.redeemScript);
      var firstOp = chunks[0];
      _this2.m = parseInt(script.toASM([firstOp]).slice(3), 10);
      _this2.address = address.toBase58Check(crypto.hash160(_this2.redeemScript), config.network.layer1.scriptHash);
    } catch (e) {
      error(e);
      throw new Error('Improper redeem script for multi-sig input.');
    }

    return _this2;
  }

  var _proto2 = MultiSigKeySigner.prototype;

  _proto2.getAddress = function getAddress() {
    var _this3 = this;

    return Promise.resolve().then(function () {
      return _this3.address;
    });
  };

  _proto2.signTransaction = function signTransaction(txIn, signingIndex) {
    var _this4 = this;

    return Promise.resolve().then(function () {
      var keysToUse = _this4.privateKeys.slice(0, _this4.m);

      keysToUse.forEach(function (keyHex) {
        var ecPair = hexStringToECPair(keyHex);
        txIn.sign(signingIndex, ecPair, _this4.redeemScript);
      });
    });
  };

  _proto2.signerVersion = function signerVersion() {
    return 0;
  };

  return MultiSigKeySigner;
}(CLITransactionSigner);
var SegwitP2SHKeySigner = /*#__PURE__*/function (_CLITransactionSigner3) {
  _inheritsLoose(SegwitP2SHKeySigner, _CLITransactionSigner3);

  function SegwitP2SHKeySigner(redeemScript, witnessScript, m, privateKeys) {
    var _this5;

    _this5 = _CLITransactionSigner3.call(this) || this;
    _this5.redeemScript = Buffer.from(redeemScript, 'hex');
    _this5.witnessScript = Buffer.from(witnessScript, 'hex');
    _this5.address = address.toBase58Check(crypto.hash160(_this5.redeemScript), config.network.layer1.scriptHash);
    _this5.privateKeys = privateKeys;
    _this5.m = m;
    _this5.isComplete = true;
    return _this5;
  }

  var _proto3 = SegwitP2SHKeySigner.prototype;

  _proto3.getAddress = function getAddress() {
    var _this6 = this;

    return Promise.resolve().then(function () {
      return _this6.address;
    });
  };

  _proto3.findUTXO = function findUTXO(txIn, signingIndex, utxos) {
    var private_tx = txIn.__TX;
    var txidBuf = new Buffer(private_tx.ins[signingIndex].hash.slice());
    var outpoint = private_tx.ins[signingIndex].index;
    txidBuf.reverse();
    var txid = txidBuf.toString('hex');

    for (var i = 0; i < utxos.length; i++) {
      if (utxos[i].tx_hash === txid && utxos[i].tx_output_n === outpoint) {
        if (!utxos[i].value) {
          throw new Error("UTXO for hash=" + txid + " vout=" + outpoint + " has no value");
        }

        return utxos[i];
      }
    }

    throw new Error("No UTXO for input hash=" + txid + " vout=" + outpoint);
  };

  _proto3.signTransaction = function signTransaction(txIn, signingIndex) {
    var _this7 = this;

    return Promise.resolve().then(function () {
      return _this7.getAddress();
    }).then(function (address) {
      return config.network.getUTXOs(address);
    }).then(function (utxos) {
      var utxo = _this7.findUTXO(txIn, signingIndex, utxos);

      if (_this7.m === 1) {
        var ecPair = hexStringToECPair(_this7.privateKeys[0]);
        txIn.sign(signingIndex, ecPair, _this7.redeemScript, undefined, utxo.value);
      } else {
        var keysToUse = _this7.privateKeys.slice(0, _this7.m);

        keysToUse.forEach(function (keyHex) {
          var ecPair = hexStringToECPair(keyHex);
          txIn.sign(signingIndex, ecPair, _this7.redeemScript, undefined, utxo.value, _this7.witnessScript);
        });
      }
    });
  };

  _proto3.signerVersion = function signerVersion() {
    return 0;
  };

  return SegwitP2SHKeySigner;
}(CLITransactionSigner);

function isCLITransactionSigner(signer) {
  return signer.signerVersion !== undefined;
}
function parseNullSigner(addrString) {
  if (!addrString.startsWith('nosign:')) {
    throw new Error('Invalid nosign string');
  }

  var addr = addrString.slice('nosign:'.length);
  return new NullSigner(addr);
}
function parseMultiSigKeys(serializedPrivateKeys) {
  var matches = serializedPrivateKeys.match(PRIVATE_KEY_MULTISIG_PATTERN);

  if (!matches) {
    throw new Error('Invalid multisig private key string');
  }

  var m = parseInt(matches[1]);
  var parts = serializedPrivateKeys.split(',');
  var privkeys = [];

  for (var i = 1; i < 256; i++) {
    var pk = parts[i];

    if (!pk) {
      break;
    }

    if (!pk.match(PRIVATE_KEY_PATTERN)) {
      throw new Error('Invalid private key string');
    }

    privkeys.push(pk);
  }

  var pubkeys = privkeys.map(function (pk) {
    return Buffer.from(getPublicKeyFromPrivateKey(pk), 'hex');
  });
  var multisigInfo = payments.p2ms({
    m: m,
    pubkeys: pubkeys
  });
  return new MultiSigKeySigner(multisigInfo.output.toString('hex'), privkeys);
}
function parseSegwitP2SHKeys(serializedPrivateKeys) {
  var matches = serializedPrivateKeys.match(PRIVATE_KEY_SEGWIT_P2SH_PATTERN);

  if (!matches) {
    throw new Error('Invalid segwit p2sh private key string');
  }

  var m = parseInt(matches[1]);
  var parts = serializedPrivateKeys.split(',');
  var privkeys = [];

  for (var i = 1; i < 256; i++) {
    var pk = parts[i];

    if (!pk) {
      break;
    }

    if (!pk.match(PRIVATE_KEY_PATTERN)) {
      throw new Error('Invalid private key string');
    }

    privkeys.push(pk);
  }

  var pubkeys = privkeys.map(function (pk) {
    return Buffer.from(getPublicKeyFromPrivateKey(pk), 'hex');
  });
  var redeemScript;
  var witnessScript = '';

  if (m === 1) {
    var p2wpkh = payments.p2wpkh({
      pubkey: pubkeys[0]
    });
    var p2sh = payments.p2sh({
      redeem: p2wpkh
    });
    redeemScript = p2sh.redeem.output.toString('hex');
  } else {
    var p2ms = payments.p2ms({
      m: m,
      pubkeys: pubkeys
    });
    var p2wsh = payments.p2wsh({
      redeem: p2ms
    });

    var _p2sh = payments.p2sh({
      redeem: p2wsh
    });

    redeemScript = _p2sh.redeem.output.toString('hex');
    witnessScript = p2wsh.redeem.output.toString('hex');
  }

  return new SegwitP2SHKeySigner(redeemScript, witnessScript, m, privkeys);
}
function decodePrivateKey(serializedPrivateKey) {
  var nosignMatches = serializedPrivateKey.match(PRIVATE_KEY_NOSIGN_PATTERN);

  if (!!nosignMatches) {
    return parseNullSigner(serializedPrivateKey);
  }

  var singleKeyMatches = serializedPrivateKey.match(PRIVATE_KEY_PATTERN);

  if (!!singleKeyMatches) {
    return serializedPrivateKey;
  }

  var multiKeyMatches = serializedPrivateKey.match(PRIVATE_KEY_MULTISIG_PATTERN);

  if (!!multiKeyMatches) {
    return parseMultiSigKeys(serializedPrivateKey);
  }

  var segwitP2SHMatches = serializedPrivateKey.match(PRIVATE_KEY_SEGWIT_P2SH_PATTERN);

  if (!!segwitP2SHMatches) {
    return parseSegwitP2SHKeys(serializedPrivateKey);
  }

  throw new Error('Unparseable private key');
}
function JSONStringify(obj, stderr) {
  if (stderr === void 0) {
    stderr = false;
  }

  if (!stderr && process.stdout.isTTY || stderr && process.stderr.isTTY) {
    return JSON.stringify(obj, null, 2);
  } else {
    return JSON.stringify(obj);
  }
}
function getPublicKeyFromPrivateKey(privateKey) {
  var ecKeyPair = hexStringToECPair(privateKey);
  return ecKeyPair.publicKey.toString('hex');
}
function getPrivateKeyAddress(network, privateKey) {
  if (isCLITransactionSigner(privateKey)) {
    var pkts = privateKey;
    return pkts.address;
  } else {
    var pk = privateKey;
    var ecKeyPair = hexStringToECPair(pk);
    return network.coerceAddress(ecPairToAddress(ecKeyPair));
  }
}
function canonicalPrivateKey(privkey) {
  if (privkey.length == 66 && privkey.slice(-2) === '01') {
    return privkey.substring(0, 64);
  }

  return privkey;
}
function makeProfileJWT(profileData, privateKey) {
  var signedToken = signProfileToken(profileData, privateKey);
  var wrappedToken = wrapProfileToken(signedToken);
  var tokenRecords = [wrappedToken];
  return JSONStringify(tokenRecords);
}

function getNameInfoEasy(network, name) {
  var nameInfoPromise = network.getNameInfo(name).then(function (nameInfo) {
    return nameInfo;
  })["catch"](function (error) {
    if (error.message === 'Name not found') {
      return null;
    } else {
      throw error;
    }
  });
  return nameInfoPromise;
}
function nameLookup(_x8, _x9, _x10) {
  return _nameLookup.apply(this, arguments);
}

function _nameLookup() {
  _nameLookup = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee3(network, name, includeProfile) {
    var nameInfoPromise, profilePromise, zonefilePromise, _yield$Promise$all, profile, zonefile, nameInfo, profileObj, profileUrl, zonefileJSON, ret;

    return runtime_1.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (includeProfile === void 0) {
              includeProfile = true;
            }

            nameInfoPromise = getNameInfoEasy(network, name);
            profilePromise = includeProfile ? lookupProfile(name)["catch"](function () {
              return null;
            }) : Promise.resolve().then(function () {
              return null;
            });
            zonefilePromise = nameInfoPromise.then(function (nameInfo) {
              return nameInfo ? nameInfo.zonefile : null;
            });
            _context3.next = 6;
            return Promise.all([profilePromise, zonefilePromise, nameInfoPromise]);

          case 6:
            _yield$Promise$all = _context3.sent;
            profile = _yield$Promise$all[0];
            zonefile = _yield$Promise$all[1];
            nameInfo = _yield$Promise$all[2];
            profileObj = profile;

            if (nameInfo) {
              _context3.next = 13;
              break;
            }

            throw new Error('Name not found');

          case 13:
            if (!(nameInfo.hasOwnProperty('grace_period') && nameInfo.grace_period)) {
              _context3.next = 15;
              break;
            }

            throw new Error("Name is expired at block " + nameInfo.expire_block + " " + ("and must be renewed by block " + nameInfo.renewal_deadline));

          case 15:
            profileUrl = null;

            try {
              zonefileJSON = ZoneFile.parseZoneFile(zonefile);

              if (zonefileJSON.uri && zonefileJSON.hasOwnProperty('$origin')) {
                profileUrl = getTokenFileUrl(zonefileJSON);
              }
            } catch (e) {
              profileObj = null;
            }

            ret = {
              zonefile: zonefile,
              profile: profileObj,
              profileUrl: profileUrl
            };
            return _context3.abrupt("return", ret);

          case 19:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _nameLookup.apply(this, arguments);
}

function getpass(promptStr, cb) {
  var silentOutput = new Writable({
    write: function write(_chunk, _encoding, callback) {
      callback();
    }
  });
  var rl = createInterface({
    input: process.stdin,
    output: silentOutput,
    terminal: true
  });
  process.stderr.write(promptStr);
  rl.question('', function (passwd) {
    rl.close();
    process.stderr.write('\n');
    cb(passwd);
  });
  return;
}
function getBackupPhrase(_x11, _x12) {
  return _getBackupPhrase.apply(this, arguments);
}

function _getBackupPhrase() {
  _getBackupPhrase = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee4(backupPhraseOrCiphertext, password) {
    var pass;
    return runtime_1.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!(backupPhraseOrCiphertext.split(/ +/g).length > 1)) {
              _context4.next = 4;
              break;
            }

            return _context4.abrupt("return", backupPhraseOrCiphertext);

          case 4:
            _context4.next = 6;
            return new Promise(function (resolve, reject) {
              if (!process.stdin.isTTY && !password) {
                reject(new Error('Password argument required in non-interactive mode'));
              } else {
                getpass('Enter password: ', function (p) {
                  resolve(p);
                });
              }
            });

          case 6:
            pass = _context4.sent;
            _context4.next = 9;
            return decryptBackupPhrase(Buffer.from(backupPhraseOrCiphertext, 'base64'), pass);

          case 9:
            return _context4.abrupt("return", _context4.sent);

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _getBackupPhrase.apply(this, arguments);
}

function mkdirs(path) {
  if (path.length === 0 || path[0] !== '/') {
    throw new Error('Path must be absolute');
  }

  var pathParts = path.replace(/^\//, '').split('/');
  var tmpPath = '/';

  for (var i = 0; i <= pathParts.length; i++) {
    try {
      var statInfo = lstatSync(tmpPath);

      if ((statInfo.mode & constants.S_IFDIR) === 0) {
        throw new Error("Not a directory: " + tmpPath);
      }
    } catch (e) {
      if (e.code === 'ENOENT') {
        mkdirSync(tmpPath);
      } else {
        throw e;
      }
    }

    if (i === pathParts.length) {
      break;
    }

    tmpPath = tmpPath + "/" + pathParts[i];
  }
}
function getIDAddress(_x13, _x14) {
  return _getIDAddress.apply(this, arguments);
}

function _getIDAddress() {
  _getIDAddress = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee5(network, nameOrIDAddress) {
    var nameInfo;
    return runtime_1.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (!nameOrIDAddress.match(ID_ADDRESS_PATTERN)) {
              _context5.next = 4;
              break;
            }

            return _context5.abrupt("return", nameOrIDAddress);

          case 4:
            _context5.next = 6;
            return network.getNameInfo(nameOrIDAddress);

          case 6:
            nameInfo = _context5.sent;
            return _context5.abrupt("return", "ID-" + nameInfo.address);

          case 8:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _getIDAddress.apply(this, arguments);
}

function getOwnerKeyFromIDAddress(_x15, _x16, _x17) {
  return _getOwnerKeyFromIDAddress.apply(this, arguments);
}

function _getOwnerKeyFromIDAddress() {
  _getOwnerKeyFromIDAddress = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee6(network, mnemonic, idAddress) {
    var index, keyInfo;
    return runtime_1.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            index = 0;

          case 1:

            _context6.next = 4;
            return getOwnerKeyInfo(network, mnemonic, index);

          case 4:
            keyInfo = _context6.sent;

            if (!(keyInfo.idAddress === idAddress)) {
              _context6.next = 7;
              break;
            }

            return _context6.abrupt("return", keyInfo.privateKey);

          case 7:
            index++;
            _context6.next = 1;
            break;

          case 10:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
  return _getOwnerKeyFromIDAddress.apply(this, arguments);
}

function getIDAppKeys(_x18, _x19, _x20, _x21) {
  return _getIDAppKeys.apply(this, arguments);
}

function _getIDAppKeys() {
  _getIDAppKeys = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee7(network, nameOrIDAddress, appOrigin, mnemonicOrCiphertext) {
    var mnemonic, idAddress, appKeyInfo, appPrivateKey, ownerPrivateKey, ret;
    return runtime_1.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return getBackupPhrase(mnemonicOrCiphertext);

          case 2:
            mnemonic = _context7.sent;
            _context7.next = 5;
            return getIDAddress(network, nameOrIDAddress);

          case 5:
            idAddress = _context7.sent;
            _context7.next = 8;
            return getApplicationKeyInfo(network, mnemonic, idAddress, appOrigin);

          case 8:
            appKeyInfo = _context7.sent;
            appPrivateKey = extractAppKey(network, appKeyInfo);
            _context7.next = 12;
            return getOwnerKeyFromIDAddress(network, mnemonic, idAddress);

          case 12:
            ownerPrivateKey = _context7.sent;
            ret = {
              appPrivateKey: appPrivateKey,
              ownerPrivateKey: ownerPrivateKey,
              mnemonic: mnemonic
            };
            return _context7.abrupt("return", ret);

          case 15:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));
  return _getIDAppKeys.apply(this, arguments);
}

function makePromptsFromArgList(expectedArgs) {
  var prompts = [];

  for (var i = 0; i < expectedArgs.length; i++) {
    prompts.push(argToPrompt(expectedArgs[i]));
  }

  return prompts;
}
function argToPrompt(arg) {
  var name = arg.name;
  var type = arg.type;
  var typeString = getTypeString(type);

  if (isClarityAbiPrimitive(type)) {
    if (type === 'uint128') {
      return {
        type: 'input',
        name: name,
        message: "Enter value for function argument \"" + name + "\" of type " + typeString
      };
    } else if (type === 'int128') {
      return {
        type: 'input',
        name: name,
        message: "Enter value for function argument \"" + name + "\" of type " + typeString
      };
    } else if (type === 'bool') {
      return {
        type: 'list',
        name: name,
        message: "Enter value for function argument \"" + name + "\" of type " + typeString,
        choices: ['True', 'False']
      };
    } else if (type === 'principal') {
      return {
        type: 'input',
        name: name,
        message: "Enter value for function argument \"" + name + "\" of type " + typeString
      };
    } else {
      throw new Error("Contract function contains unsupported Clarity ABI type: " + typeString);
    }
  } else if (isClarityAbiBuffer(type)) {
    return {
      type: 'input',
      name: name,
      message: "Enter value for function argument \"" + name + "\" of type " + typeString
    };
  } else if (isClarityAbiResponse(type)) {
    throw new Error("Contract function contains unsupported Clarity ABI type: " + typeString);
  } else if (isClarityAbiOptional(type)) {
    throw new Error("Contract function contains unsupported Clarity ABI type: " + typeString);
  } else if (isClarityAbiTuple(type)) {
    throw new Error("Contract function contains unsupported Clarity ABI type: " + typeString);
  } else if (isClarityAbiList(type)) {
    throw new Error("Contract function contains unsupported Clarity ABI type: " + typeString);
  } else {
    throw new Error("Contract function contains unsupported Clarity ABI type: " + typeString);
  }
}
function parseClarityFunctionArgAnswers(answers, expectedArgs) {
  var functionArgs = [];

  for (var i = 0; i < expectedArgs.length; i++) {
    var expectedArg = expectedArgs[i];
    var answer = answers[expectedArg.name];
    functionArgs.push(answerToClarityValue(answer, expectedArg));
  }

  return functionArgs;
}
function answerToClarityValue(answer, arg) {
  var type = arg.type;
  var typeString = getTypeString(type);

  if (isClarityAbiPrimitive(type)) {
    if (type === 'uint128') {
      return uintCV(answer);
    } else if (type === 'int128') {
      return intCV(answer);
    } else if (type === 'bool') {
      return answer == 'True' ? trueCV() : falseCV();
    } else if (type === 'principal') {
      return standardPrincipalCV(answer);
    } else {
      throw new Error("Contract function contains unsupported Clarity ABI type: " + typeString);
    }
  } else if (isClarityAbiBuffer(type)) {
    return bufferCVFromString(answer);
  } else if (isClarityAbiResponse(type)) {
    throw new Error("Contract function contains unsupported Clarity ABI type: " + typeString);
  } else if (isClarityAbiOptional(type)) {
    throw new Error("Contract function contains unsupported Clarity ABI type: " + typeString);
  } else if (isClarityAbiTuple(type)) {
    throw new Error("Contract function contains unsupported Clarity ABI type: " + typeString);
  } else if (isClarityAbiList(type)) {
    throw new Error("Contract function contains unsupported Clarity ABI type: " + typeString);
  } else {
    throw new Error("Contract function contains unsupported Clarity ABI type: " + typeString);
  }
}
function generateExplorerTxPageUrl(txid, network) {
  if (network.version === TransactionVersion.Testnet) {
    return "https://testnet-explorer.now.sh/txid/0x" + txid;
  } else {
    return "https://explorer.blockstack.org/txid/0x" + txid;
  }
}

export { JSONStringify, MultiSigKeySigner, NullSigner, SegwitP2SHKeySigner, answerToClarityValue, argToPrompt, canonicalPrivateKey, decodePrivateKey, generateExplorerTxPageUrl, getBackupPhrase, getIDAddress, getIDAppKeys, getNameInfoEasy, getOwnerKeyFromIDAddress, getPrivateKeyAddress, getPublicKeyFromPrivateKey, getpass, makeProfileJWT, makePromptsFromArgList, mkdirs, nameLookup, parseClarityFunctionArgAnswers, parseMultiSigKeys, parseNullSigner, parseSegwitP2SHKeys };
//# sourceMappingURL=utils.esm.js.map
