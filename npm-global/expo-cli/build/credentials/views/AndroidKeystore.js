"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useKeystore = useKeystore;
exports.getKeystoreFromParams = getKeystoreFromParams;
exports.DownloadKeystore = exports.RemoveKeystore = exports.UpdateKeystore = void 0;

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

function _commandExists() {
  const data = _interopRequireDefault(require("command-exists"));

  _commandExists = function () {
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

function _omit() {
  const data = _interopRequireDefault(require("lodash/omit"));

  _omit = function () {
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

function _CommandError() {
  const data = _interopRequireDefault(require("../../CommandError"));

  _CommandError = function () {
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

function _prompts() {
  const data = require("../../prompts");

  _prompts = function () {
    return data;
  };

  return data;
}

function _promptForCredentials() {
  const data = require("../actions/promptForCredentials");

  _promptForCredentials = function () {
    return data;
  };

  return data;
}

function _credentials() {
  const data = require("../credentials");

  _credentials = function () {
    return data;
  };

  return data;
}

function _validateKeystore() {
  const data = _interopRequireDefault(require("../utils/validateKeystore"));

  _validateKeystore = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function keytoolCommandExists() {
  try {
    await (0, _commandExists().default)('keytool');
    return true;
  } catch (err) {
    return false;
  }
}

class UpdateKeystore {
  constructor(experienceName, options) {
    this.experienceName = experienceName;
    this.options = options;
  }

  async open(ctx) {
    if (await ctx.android.fetchKeystore(this.experienceName)) {
      this.displayWarning();
    }

    const keystore = await this.provideOrGenerate(ctx);

    if (!keystore) {
      return null;
    }

    if (!this.options.skipKeystoreValidation) {
      await (0, _validateKeystore().default)(keystore);
    }

    await ctx.android.updateKeystore(this.experienceName, keystore);
    (0, _log().default)(_chalk().default.green('Keystore updated successfully'));
    return null;
  }

  async provideOrGenerate(ctx) {
    const providedKeystore = await (0, _promptForCredentials().askForUserProvided)(_credentials().keystoreSchema);

    if (providedKeystore) {
      return providedKeystore;
    } else if (this.options.bestEffortKeystoreGeneration && !(await keytoolCommandExists())) {
      _log().default.warn('The `keytool` utility was not found in your PATH. A new Keystore will be generated on Expo servers.');

      return null;
    }

    const tmpKeystoreName = _path().default.join(_os().default.tmpdir(), `${this.experienceName}_${(0, _uuid().v4)()}_tmp.jks`.replace('/', '__'));

    try {
      await _fsExtra().default.remove(tmpKeystoreName);
      const keystoreData = await _xdl().AndroidCredentials.generateUploadKeystore(tmpKeystoreName, '--------------', this.experienceName);
      return { ...(0, _omit().default)(keystoreData, 'keystorePath'),
        keystore: await _fsExtra().default.readFile(tmpKeystoreName, 'base64')
      };
    } catch (error) {
      _log().default.warn('Failed to generate Android Keystore, it will be generated on Expo servers during the build');

      throw error;
    } finally {
      await _fsExtra().default.remove(tmpKeystoreName);
    }
  }

  async displayWarning() {
    _log().default.newLine();

    _log().default.warn(`⚠️  Updating your Android build credentials will remove previous version from our servers, this is a ${_chalk().default.red('PERMANENT and IRREVERSIBLE action.')}`);

    _log().default.warn(_chalk().default.bold('Android Keystore must be identical to the one previously used to submit your app to the Google Play Store.'));
  }

}

exports.UpdateKeystore = UpdateKeystore;

class RemoveKeystore {
  constructor(experienceName) {
    this.experienceName = experienceName;
  }

  async open(ctx) {
    if (!(await ctx.android.fetchKeystore(this.experienceName))) {
      _log().default.warn('There is no valid Keystore defined for this app');

      return null;
    }

    this.displayWarning();

    if (ctx.nonInteractive) {
      throw new (_CommandError().default)('NON_INTERACTIVE', "Deleting build credentials is a destructive operation. Start the CLI without the '--non-interactive' flag to delete the credentials.");
    }

    const answers = await (0, _prompts().confirmAsync)({
      message: 'Permanently delete the Android build credentials from our servers?',
      initial: false
    });

    if (answers) {
      (0, _log().default)('Backing up your Android Keystore now...');
      await new DownloadKeystore(this.experienceName, {
        displayCredentials: true,
        outputPath: `${this.experienceName}.bak.jks`.replace('/', '__')
      }).open(ctx);
      await ctx.android.removeKeystore(this.experienceName);
      (0, _log().default)(_chalk().default.green('Keystore removed successfully'));
    }

    return null;
  }

  async displayWarning() {
    _log().default.newLine();

    _log().default.warn(`⚠️  Clearing your Android build credentials from our build servers is a ${_chalk().default.red('PERMANENT and IRREVERSIBLE action.')}`);

    _log().default.warn(_chalk().default.bold('Android Keystore must be identical to the one previously used to submit your app to the Google Play Store.'));

    _log().default.warn('Please read https://docs.expo.io/distribution/building-standalone-apps/#if-you-choose-to-build-for-android for more info before proceeding.');

    _log().default.newLine();

    _log().default.warn(_chalk().default.bold('Your Keystore will be backed up to your current directory if you continue.'));

    _log().default.newLine();
  }

}

exports.RemoveKeystore = RemoveKeystore;

class DownloadKeystore {
  constructor(experienceName, options) {
    this.experienceName = experienceName;
    this.options = options;
  }

  async open(ctx) {
    var _this$options, _this$options3, _this$options$outputP, _this$options5, _this$options6, _this$options$display, _this$options7;

    let displayCredentials;

    if (((_this$options = this.options) === null || _this$options === void 0 ? void 0 : _this$options.displayCredentials) !== undefined) {
      var _this$options2;

      displayCredentials = (_this$options2 = this.options) === null || _this$options2 === void 0 ? void 0 : _this$options2.displayCredentials;
    } else if ((_this$options3 = this.options) === null || _this$options3 === void 0 ? void 0 : _this$options3.quiet) {
      displayCredentials = false;
    } else if (ctx.nonInteractive) {
      displayCredentials = true;
    } else {
      const confirm = await (0, _prompts().confirmAsync)({
        message: 'Do you want to display the Android Keystore credentials?'
      });
      displayCredentials = confirm;
    }

    const keystoreObj = await ctx.android.fetchKeystore(this.experienceName);
    const {
      keystore,
      keystorePassword,
      keyAlias,
      keyPassword
    } = keystoreObj || {};

    if (!keystore || !keystorePassword || !keyAlias || !keyPassword) {
      var _this$options4;

      if (!((_this$options4 = this.options) === null || _this$options4 === void 0 ? void 0 : _this$options4.quiet)) {
        _log().default.warn('There is no valid Keystore defined for this app');
      }

      return null;
    }

    const keystorePath = (_this$options$outputP = (_this$options5 = this.options) === null || _this$options5 === void 0 ? void 0 : _this$options5.outputPath) !== null && _this$options$outputP !== void 0 ? _this$options$outputP : `${this.experienceName.replace('/', '__')}.bak.jks`;
    await maybeRenameExistingFile(ctx.projectDir, keystorePath);

    if (!((_this$options6 = this.options) === null || _this$options6 === void 0 ? void 0 : _this$options6.quiet)) {
      (0, _log().default)(_chalk().default.green(`Saving Keystore to ${keystorePath}`));
    }

    const storeBuf = Buffer.from(keystore, 'base64');
    await _fsExtra().default.writeFile(keystorePath, storeBuf);

    if ((_this$options$display = (_this$options7 = this.options) === null || _this$options7 === void 0 ? void 0 : _this$options7.displayCredentials) !== null && _this$options$display !== void 0 ? _this$options$display : displayCredentials) {
      (0, _log().default)(`Keystore credentials
  Keystore password: ${_chalk().default.bold(keystorePassword)}
  Key alias:         ${_chalk().default.bold(keyAlias)}
  Key password:      ${_chalk().default.bold(keyPassword)}

  Path to Keystore:  ${keystorePath}
      `);
    }

    return null;
  }

}

exports.DownloadKeystore = DownloadKeystore;

async function getKeystoreFromParams(options) {
  const keyAlias = options.keystoreAlias;
  const keystorePath = options.keystorePath;
  const keystorePassword = process.env.EXPO_ANDROID_KEYSTORE_PASSWORD;
  const keyPassword = process.env.EXPO_ANDROID_KEY_PASSWORD;

  if (!keyAlias && !keystorePath) {
    return null;
  }

  if (!keystorePath || !keyAlias || !keystorePassword || !keyPassword) {
    (0, _log().default)(keystorePath, keyAlias, keystorePassword, keyPassword);
    throw new Error('In order to provide a Keystore through the CLI parameters, you have to pass --keystore-alias, --keystore-path parameters and set EXPO_ANDROID_KEY_PASSWORD and EXPO_ANDROID_KEYSTORE_PASSWORD environment variables.');
  }

  try {
    const keystore = await _fsExtra().default.readFile(keystorePath, 'base64');
    return {
      keystore,
      keyAlias,
      keystorePassword,
      keyPassword
    };
  } catch (err) {
    _log().default.error(`Error while reading file ${keystorePath}`);

    throw err;
  }
}

async function useKeystore(ctx, {
  experienceName,
  keystore,
  skipKeystoreValidation
}) {
  if (!skipKeystoreValidation) {
    await (0, _validateKeystore().default)(keystore);
  }

  await ctx.android.updateKeystore(experienceName, keystore);
}

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
//# sourceMappingURL=AndroidKeystore.js.map