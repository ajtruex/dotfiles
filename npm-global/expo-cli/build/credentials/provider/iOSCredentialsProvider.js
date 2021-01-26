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

function _SetupIosBuildCredentials() {
  const data = require("../views/SetupIosBuildCredentials");

  _SetupIosBuildCredentials = function () {
    return data;
  };

  return data;
}

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class iOSCredentialsProvider {
  constructor(projectDir, app, options) {
    this.projectDir = projectDir;
    this.app = app;
    this.options = options;

    _defineProperty(this, "platform", 'ios');

    _defineProperty(this, "ctx", new (_context().Context)());

    _defineProperty(this, "credentials", void 0);
  }

  async initAsync() {
    await this.ctx.init(this.projectDir, {
      nonInteractive: this.options.nonInteractive
    });
  }

  async hasRemoteAsync() {
    const distCert = await this.ctx.ios.getDistCert(this.app);
    const provisioningProfile = await this.ctx.ios.getProvisioningProfile(this.app);
    return !!(distCert || provisioningProfile);
  }

  async hasLocalAsync() {
    if (!(await credentialsJsonReader().fileExistsAsync(this.projectDir))) {
      return false;
    }

    try {
      const rawCredentialsJson = await credentialsJsonReader().readRawAsync(this.projectDir);
      return !!(rawCredentialsJson === null || rawCredentialsJson === void 0 ? void 0 : rawCredentialsJson.ios);
    } catch (err) {
      _log().default.error(err); // malformed json


      return false;
    }
  }

  async isLocalSyncedAsync() {
    try {
      var _r$distributionCertif, _r$distributionCertif2;

      const [remote, local] = await Promise.all([this.fetchRemoteAsync(), this.getLocalAsync()]);
      const r = remote;
      const l = local; // ts definion can't resolve return type correctly

      return !!(r.provisioningProfile === l.provisioningProfile && ((_r$distributionCertif = r.distributionCertificate) === null || _r$distributionCertif === void 0 ? void 0 : _r$distributionCertif.certP12) === l.distributionCertificate.certP12 && ((_r$distributionCertif2 = r.distributionCertificate) === null || _r$distributionCertif2 === void 0 ? void 0 : _r$distributionCertif2.certPassword) === l.distributionCertificate.certPassword);
    } catch (_) {
      return false;
    }
  }

  async getCredentialsAsync(src) {
    switch (src) {
      case _easJson().CredentialsSource.LOCAL:
        return await this.getLocalAsync();

      case _easJson().CredentialsSource.REMOTE:
        return await this.getRemoteAsync();
    }
  }

  async getLocalAsync() {
    return await credentialsJsonReader().readIosCredentialsAsync(this.projectDir);
  }

  async getRemoteAsync() {
    if (this.options.skipCredentialsCheck) {
      (0, _log().default)('Skipping credentials check');
    } else {
      await (0, _route().runCredentialsManager)(this.ctx, new (_SetupIosBuildCredentials().SetupIosBuildCredentials)(this.app));
    }

    const distCert = await this.ctx.ios.getDistCert(this.app);

    if (!(distCert === null || distCert === void 0 ? void 0 : distCert.certP12) || !(distCert === null || distCert === void 0 ? void 0 : distCert.certPassword)) {
      if (this.options.skipCredentialsCheck) {
        throw new Error('Distribution certificate is missing and credentials check was skipped. Run without --skip-credentials-check to set it up.');
      } else {
        throw new Error('Distribution certificate is missing');
      }
    }

    const provisioningProfile = await this.ctx.ios.getProvisioningProfile(this.app);

    if (!(provisioningProfile === null || provisioningProfile === void 0 ? void 0 : provisioningProfile.provisioningProfile)) {
      if (this.options.skipCredentialsCheck) {
        throw new Error('Provisioning profile is missing and credentials check was skipped. Run without --skip-credentials-check to set it up.');
      } else {
        throw new Error('Provisioning profile is missing');
      }
    }

    return {
      provisioningProfile: provisioningProfile.provisioningProfile,
      distributionCertificate: {
        certP12: distCert.certP12,
        certPassword: distCert.certPassword
      }
    };
  }

  async fetchRemoteAsync() {
    const distCert = await this.ctx.ios.getDistCert(this.app);
    const provisioningProfile = await this.ctx.ios.getProvisioningProfile(this.app);
    return {
      provisioningProfile: provisioningProfile === null || provisioningProfile === void 0 ? void 0 : provisioningProfile.provisioningProfile,
      distributionCertificate: {
        certP12: distCert === null || distCert === void 0 ? void 0 : distCert.certP12,
        certPassword: distCert === null || distCert === void 0 ? void 0 : distCert.certPassword
      }
    };
  }

}

exports.default = iOSCredentialsProvider;
//# sourceMappingURL=iOSCredentialsProvider.js.map