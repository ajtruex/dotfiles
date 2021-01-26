"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchAndroidKeystoreAsync = fetchAndroidKeystoreAsync;
exports.fetchAndroidHashesAsync = fetchAndroidHashesAsync;
exports.fetchAndroidUploadCertAsync = fetchAndroidUploadCertAsync;

function _xdl() {
  const data = require("@expo/xdl");

  _xdl = function () {
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

function _invariant() {
  const data = _interopRequireDefault(require("invariant"));

  _invariant = function () {
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

function _credentials() {
  const data = require("../../credentials");

  _credentials = function () {
    return data;
  };

  return data;
}

function _route() {
  const data = require("../../credentials/route");

  _route = function () {
    return data;
  };

  return data;
}

function _AndroidKeystore() {
  const data = require("../../credentials/views/AndroidKeystore");

  _AndroidKeystore = function () {
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

async function maybeRenameExistingFile(projectDir, filename) {
  const desiredFilePath = _path().default.resolve(projectDir, filename);

  if (await _fsExtra().default.pathExists(desiredFilePath)) {
    let num = 1;

    while (await _fsExtra().default.pathExists(_path().default.resolve(projectDir, `OLD_${num}_${filename}`))) {
      num++;
    }

    (0, _log().default)(`\nA file already exists at "${desiredFilePath}"\n  Renaming the existing file to OLD_${num}_${filename}\n`);
    await _fsExtra().default.rename(desiredFilePath, _path().default.resolve(projectDir, `OLD_${num}_${filename}`));
  }
}

async function fetchAndroidKeystoreAsync(projectDir, options) {
  var _options$parent;

  const ctx = new (_credentials().Context)();
  await ctx.init(projectDir, {
    nonInteractive: (_options$parent = options.parent) === null || _options$parent === void 0 ? void 0 : _options$parent.nonInteractive
  });
  const keystoreFilename = `${ctx.manifest.slug}.jks`;
  await maybeRenameExistingFile(projectDir, keystoreFilename);

  const backupKeystoreOutputPath = _path().default.resolve(projectDir, keystoreFilename);

  const experienceName = `@${ctx.manifest.owner || ctx.user.username}/${ctx.manifest.slug}`;
  (0, _invariant().default)(ctx.manifest.slug, 'app.json slug field must be set');
  await (0, _route().runCredentialsManager)(ctx, new (_AndroidKeystore().DownloadKeystore)(experienceName, {
    outputPath: backupKeystoreOutputPath,
    displayCredentials: true
  }));
}

async function fetchAndroidHashesAsync(projectDir, options) {
  var _options$parent2;

  const ctx = new (_credentials().Context)();
  await ctx.init(projectDir, {
    nonInteractive: (_options$parent2 = options.parent) === null || _options$parent2 === void 0 ? void 0 : _options$parent2.nonInteractive
  });

  const outputPath = _path().default.resolve(projectDir, `${ctx.manifest.slug}.tmp.jks`);

  try {
    (0, _invariant().default)(ctx.manifest.slug, 'app.json slug field must be set');
    const experienceName = `@${ctx.manifest.owner || ctx.user.username}/${ctx.manifest.slug}`;
    const view = new (_AndroidKeystore().DownloadKeystore)(experienceName, {
      outputPath,
      quiet: true
    });
    await (0, _route().runCredentialsManager)(ctx, view);
    const keystore = await ctx.android.fetchKeystore(experienceName);

    if (keystore) {
      await _xdl().AndroidCredentials.logKeystoreHashes({
        keystorePath: outputPath,
        keystorePassword: keystore.keystorePassword,
        keyAlias: keystore.keyAlias,
        keyPassword: keystore.keyPassword
      });
      (0, _log().default)(`\nNote: if you are using Google Play signing, this app will be signed with a different key after publishing to the store, and you'll need to use the hashes displayed in the Google Play console.`);
    } else {
      _log().default.warn('There is no valid Keystore defined for this app');
    }
  } finally {
    await _fsExtra().default.remove(outputPath);
  }
}

async function fetchAndroidUploadCertAsync(projectDir, options) {
  var _options$parent3;

  const ctx = new (_credentials().Context)();
  await ctx.init(projectDir, {
    nonInteractive: (_options$parent3 = options.parent) === null || _options$parent3 === void 0 ? void 0 : _options$parent3.nonInteractive
  });

  const keystorePath = _path().default.resolve(projectDir, `${ctx.manifest.slug}.tmp.jks`);

  const uploadKeyFilename = `${ctx.manifest.slug}_upload_cert.pem`;
  await maybeRenameExistingFile(projectDir, uploadKeyFilename);

  const uploadKeyPath = _path().default.resolve(projectDir, uploadKeyFilename);

  try {
    (0, _invariant().default)(ctx.manifest.slug, 'app.json slug field must be set');
    const experienceName = `@${ctx.manifest.owner || ctx.user.username}/${ctx.manifest.slug}`;
    const view = new (_AndroidKeystore().DownloadKeystore)(experienceName, {
      outputPath: keystorePath,
      quiet: true
    });
    await (0, _route().runCredentialsManager)(ctx, view);
    const keystore = await ctx.android.fetchKeystore(experienceName);

    if (keystore) {
      (0, _log().default)(`Writing upload key to ${uploadKeyPath}`);
      await _xdl().AndroidCredentials.exportCertBase64({
        keystorePath,
        keystorePassword: keystore.keystorePassword,
        keyAlias: keystore.keyAlias
      }, uploadKeyPath);
    } else {
      _log().default.warn('There is no valid Keystore defined for this app');
    }
  } finally {
    await _fsExtra().default.remove(keystorePath);
  }
}
//# sourceMappingURL=android.js.map