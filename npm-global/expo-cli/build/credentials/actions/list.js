"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.displayProjectCredentials = displayProjectCredentials;
exports.displayIosCredentials = displayIosCredentials;
exports.displayIosAppCredentials = displayIosAppCredentials;
exports.displayIosUserCredentials = displayIosUserCredentials;
exports.displayAndroidCredentials = displayAndroidCredentials;
exports.displayAndroidAppCredentials = displayAndroidAppCredentials;

function _xdl() {
  const data = require("@expo/xdl");

  _xdl = function () {
    return data;
  };

  return data;
}

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function () {
    return data;
  };

  return data;
}

function _fsExtra() {
  const data = _interopRequireDefault(require("fs-extra"));

  _fsExtra = function () {
    return data;
  };

  return data;
}

function _os() {
  const data = _interopRequireDefault(require("os"));

  _os = function () {
    return data;
  };

  return data;
}

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
    return data;
  };

  return data;
}

function _uuid() {
  const data = require("uuid");

  _uuid = function () {
    return data;
  };

  return data;
}

function _log() {
  const data = _interopRequireDefault(require("../../log"));

  _log = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function displayProjectCredentials(appLookupParams, appCredentials, pushKey, distCert) {
  const experienceName = `@${appLookupParams.accountName}/${appLookupParams.projectName}`;
  const bundleIdentifier = appLookupParams.bundleIdentifier;

  if (!appCredentials) {
    (0, _log().default)(_chalk().default.bold(`No credentials configured for app ${experienceName} with bundle identifier ${bundleIdentifier}\n`));
    return;
  }

  (0, _log().default)();
  (0, _log().default)(_chalk().default.bold('Project Credential Configuration:'));
  displayIosAppCredentials(appCredentials);
  (0, _log().default)();

  if (distCert) {
    displayIosUserCredentials(distCert);
  }

  if (pushKey) {
    displayIosUserCredentials(pushKey);
  }
}

async function displayIosCredentials(credentials) {
  (0, _log().default)(_chalk().default.bold('Available credentials for iOS apps\n'));
  (0, _log().default)(_chalk().default.bold('Application credentials\n'));

  for (const cred of credentials.appCredentials) {
    displayIosAppCredentials(cred);
    (0, _log().default)();
  }

  (0, _log().default)();
  (0, _log().default)(_chalk().default.bold('User credentials\n'));

  for (const cred of credentials.userCredentials) {
    displayIosUserCredentials(cred, credentials);
    (0, _log().default)();
  }

  (0, _log().default)();
  (0, _log().default)();
}

function displayIosAppCredentials(appCredentials) {
  (0, _log().default)(`  Experience: ${_chalk().default.bold(appCredentials.experienceName)}, bundle identifier: ${appCredentials.bundleIdentifier}`);

  if (appCredentials.credentials.provisioningProfile) {
    (0, _log().default)(`    Provisioning profile (ID: ${_chalk().default.green(appCredentials.credentials.provisioningProfileId || '---------')})`);
  } else {
    (0, _log().default)('    Provisioning profile is missing. It will be generated during the next build');
  }

  if (appCredentials.credentials.teamId || appCredentials.credentials.teamName) {
    (0, _log().default)(`    Apple Team ID: ${_chalk().default.green(appCredentials.credentials.teamId || '---------')},  Apple Team Name: ${_chalk().default.green(appCredentials.credentials.teamName || '---------')}`);
  }

  if (appCredentials.credentials.pushP12 && appCredentials.credentials.pushPassword) {
    (0, _log().default)(`    (deprecated) Push Certificate (Push ID: ${_chalk().default.green(appCredentials.credentials.pushId || '-----')})`);
  }
}

function displayIosUserCredentials(userCredentials, credentials) {
  if (userCredentials.type === 'push-key') {
    (0, _log().default)(`  Push Notifications Key - Key ID: ${_chalk().default.green(userCredentials.apnsKeyId)}`);
  } else if (userCredentials.type === 'dist-cert') {
    (0, _log().default)(`  Distribution Certificate - Certificate ID: ${_chalk().default.green(userCredentials.certId || '-----')}`);
  } else {
    _log().default.warn(`  Unknown key type ${userCredentials.type}`);
  }

  (0, _log().default)(`    Apple Team ID: ${_chalk().default.green(userCredentials.teamId || '---------')},  Apple Team Name: ${_chalk().default.green(userCredentials.teamName || '---------')}`);

  if (credentials) {
    const field = userCredentials.type === 'push-key' ? 'pushCredentialsId' : 'distCredentialsId';
    const usedByApps = [...new Set(credentials.appCredentials.filter(c => c[field] === userCredentials.id).map(c => `${c.experienceName} (${c.bundleIdentifier})`))].join(',\n      ');
    const usedByAppsText = usedByApps ? `used by\n      ${usedByApps}` : 'not used by any apps';
    (0, _log().default)(`    ${_chalk().default.gray(usedByAppsText)}`);
  }
}

async function displayAndroidCredentials(credentialsList) {
  (0, _log().default)(_chalk().default.bold('Available Android credentials'));
  (0, _log().default)();

  for (const credentials of credentialsList) {
    await displayAndroidAppCredentials(credentials);
  }
}

async function displayAndroidAppCredentials(credentials) {
  const tmpFilename = _path().default.join(_os().default.tmpdir(), `expo_tmp_keystore_${(0, _uuid().v4)()}file.jks`);

  try {
    var _credentials$keystore, _credentials$pushCred, _credentials$pushCred2;

    (0, _log().default)(_chalk().default.green(credentials.experienceName));
    (0, _log().default)(_chalk().default.bold('  Upload Keystore hashes'));

    if ((_credentials$keystore = credentials.keystore) === null || _credentials$keystore === void 0 ? void 0 : _credentials$keystore.keystore) {
      const storeBuf = Buffer.from(credentials.keystore.keystore, 'base64');
      await _fsExtra().default.writeFile(tmpFilename, storeBuf);
      await _xdl().AndroidCredentials.logKeystoreHashes({
        keystorePath: tmpFilename,
        ...credentials.keystore
      }, '    ');
    } else {
      (0, _log().default)('    -----------------------');
    }

    (0, _log().default)(_chalk().default.bold('  Push Notifications credentials'));
    (0, _log().default)('    FCM Api Key: ', (_credentials$pushCred = (_credentials$pushCred2 = credentials.pushCredentials) === null || _credentials$pushCred2 === void 0 ? void 0 : _credentials$pushCred2.fcmApiKey) !== null && _credentials$pushCred !== void 0 ? _credentials$pushCred : '---------------------');
    (0, _log().default)('\n');
  } catch (error) {
    _log().default.error('  Failed to parse the Keystore', error);

    (0, _log().default)('\n');
  } finally {
    await _fsExtra().default.remove(tmpFilename);
  }
}
//# sourceMappingURL=list.js.map