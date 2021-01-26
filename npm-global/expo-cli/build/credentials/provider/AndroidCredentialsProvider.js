"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _easJson() {
  const data = require("../../easJson");

  _easJson = function () {
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

function _context() {
  const data = require("../context");

  _context = function () {
    return data;
  };

  return data;
}

function credentialsJsonReader() {
  const data = _interopRequireWildcard(require("../credentialsJson/read"));

  credentialsJsonReader = function () {
    return data;
  };

  return data;
}

function _route() {
  const data = require("../route");

  _route = function () {
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

function _SetupAndroidKeystore() {
  const data = require("../views/SetupAndroidKeystore");

  _SetupAndroidKeystore = function () {
    return data;
  };

  return data;
}

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class AndroidCredentialsProvider {
  constructor(projectDir, app, options) {
    this.projectDir = projectDir;
    this.app = app;
    this.options = options;

    _defineProperty(this, "platform", 'android');

    _defineProperty(this, "ctx", new (_context().Context)());
  }

  get projectFullName() {
    const {
      projectName,
      accountName
    } = this.app;
    return `@${accountName}/${projectName}`;
  }

  async initAsync() {
    await this.ctx.init(this.projectDir, {
      nonInteractive: this.options.nonInteractive
    });
  }

  async hasRemoteAsync() {
    const keystore = await this.ctx.android.fetchKeystore(this.projectFullName);
    return this.isKeystoreConfigurationValid(keystore);
  }

  async hasLocalAsync() {
    if (!(await credentialsJsonReader().fileExistsAsync(this.projectDir))) {
      return false;
    }

    try {
      const rawCredentialsJson = await credentialsJsonReader().readRawAsync(this.projectDir);
      return !!(rawCredentialsJson === null || rawCredentialsJson === void 0 ? void 0 : rawCredentialsJson.android);
    } catch (err) {
      _log().default.error(err); // malformed json


      return false;
    }
  }

  async isLocalSyncedAsync() {
    try {
      const [remote, local] = await Promise.all([this.ctx.android.fetchKeystore(this.projectFullName), await credentialsJsonReader().readAndroidCredentialsAsync(this.projectDir)]);
      const r = remote;
      const l = local === null || local === void 0 ? void 0 : local.keystore;
      return !!(r.keystore === l.keystore && r.keystorePassword === l.keystorePassword && r.keyAlias === l.keyAlias && r.keyPassword === l.keyPassword && this.isKeystoreConfigurationValid(r));
    } catch (_) {
      return false;
    }
  }

  async getCredentialsAsync(src) {
    let credentials;

    switch (src) {
      case _easJson().CredentialsSource.LOCAL:
        credentials = await this.getLocalAsync();
        break;

      case _easJson().CredentialsSource.REMOTE:
        credentials = await this.getRemoteAsync();
        break;
    }

    if (!this.options.skipCredentialsCheck) {
      await (0, _validateKeystore().default)(credentials.keystore);
    }

    return credentials;
  }

  async getRemoteAsync() {
    await (0, _route().runCredentialsManager)(this.ctx, new (_SetupAndroidKeystore().SetupAndroidKeystore)(this.projectFullName, {
      allowMissingKeystore: false,
      skipKeystoreValidation: false
    }));
    const keystore = await this.ctx.android.fetchKeystore(this.projectFullName);

    if (!this.isKeystoreConfigurationValid(keystore)) {
      throw new Error('Unable to set up credentials');
    }

    return {
      keystore
    };
  }

  async getLocalAsync() {
    const credentials = await credentialsJsonReader().readAndroidCredentialsAsync(this.projectDir);

    if (!this.isKeystoreConfigurationValid(credentials.keystore)) {
      throw new Error('Keystore configuration is missing required fields in credentials.json');
    }

    return credentials;
  }

  isKeystoreConfigurationValid(keystore) {
    return !!(keystore && keystore.keystore && keystore.keystorePassword && keystore.keyPassword && keystore.keyAlias);
  }

}

exports.default = AndroidCredentialsProvider;
//# sourceMappingURL=AndroidCredentialsProvider.js.map