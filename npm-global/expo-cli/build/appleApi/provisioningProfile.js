"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProvisioningProfileManager = void 0;

function _xdl() {
  const data = require("@expo/xdl");

  _xdl = function () {
    return data;
  };

  return data;
}

function _ora() {
  const data = _interopRequireDefault(require("ora"));

  _ora = function () {
    return data;
  };

  return data;
}

function _fastlane() {
  const data = require("./fastlane");

  _fastlane = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ProvisioningProfileManager {
  constructor(appleCtx) {
    _defineProperty(this, "ctx", void 0);

    this.ctx = appleCtx;
  }

  async useExisting(bundleIdentifier, provisioningProfile, distCert) {
    const spinner = (0, _ora().default)(`Configuring existing Provisioning Profiles from Apple...`).start();

    if (!provisioningProfile.provisioningProfileId) {
      throw new Error('Provisioning profile: cannot use existing profile, insufficient id');
    }

    if (!distCert.distCertSerialNumber) {
      distCert.distCertSerialNumber = _xdl().IosCodeSigning.findP12CertSerialNumber(distCert.certP12, distCert.certPassword);
    }

    const args = ['use-existing', this.ctx.appleId, this.ctx.appleIdPassword, this.ctx.team.id, String(this.ctx.team.inHouse), bundleIdentifier, provisioningProfile.provisioningProfileId, distCert.distCertSerialNumber];
    const result = await (0, _fastlane().runAction)(_fastlane().travelingFastlane.manageProvisioningProfiles, args);
    spinner.succeed();
    return { ...result,
      teamId: this.ctx.team.id,
      teamName: this.ctx.team.name
    };
  }

  async list(bundleIdentifier) {
    const spinner = (0, _ora().default)(`Getting Provisioning Profiles from Apple...`).start();
    const args = ['list', this.ctx.appleId, this.ctx.appleIdPassword, this.ctx.team.id, String(this.ctx.team.inHouse), bundleIdentifier];
    const {
      profiles
    } = await (0, _fastlane().runAction)(_fastlane().travelingFastlane.manageProvisioningProfiles, args);
    spinner.succeed();
    return profiles.map(profile => ({ ...profile,
      teamId: this.ctx.team.id,
      teamName: this.ctx.team.name
    }));
  }

  async create(bundleIdentifier, distCert, profileName) {
    const spinner = (0, _ora().default)(`Creating Provisioning Profile on Apple Servers...`).start();

    if (!distCert.distCertSerialNumber) {
      distCert.distCertSerialNumber = _xdl().IosCodeSigning.findP12CertSerialNumber(distCert.certP12, distCert.certPassword);
    }

    const args = ['create', this.ctx.appleId, this.ctx.appleIdPassword, this.ctx.team.id, String(this.ctx.team.inHouse), bundleIdentifier, distCert.distCertSerialNumber, profileName];
    const result = await (0, _fastlane().runAction)(_fastlane().travelingFastlane.manageProvisioningProfiles, args);
    spinner.succeed();
    return { ...result,
      teamId: this.ctx.team.id,
      teamName: this.ctx.team.name
    };
  }

  async revoke(bundleIdentifier) {
    const spinner = (0, _ora().default)(`Revoking Provisioning Profile on Apple Servers...`).start();
    const args = ['revoke', this.ctx.appleId, this.ctx.appleIdPassword, this.ctx.team.id, String(this.ctx.team.inHouse), bundleIdentifier];
    await (0, _fastlane().runAction)(_fastlane().travelingFastlane.manageProvisioningProfiles, args);
    spinner.succeed();
  }

}

exports.ProvisioningProfileManager = ProvisioningProfileManager;
//# sourceMappingURL=provisioningProfile.js.map