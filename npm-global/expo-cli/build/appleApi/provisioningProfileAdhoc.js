"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProvisioningProfileAdhocManager = void 0;

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

class ProvisioningProfileAdhocManager {
  constructor(appleCtx) {
    _defineProperty(this, "ctx", void 0);

    this.ctx = appleCtx;
  }

  async createOrReuse(udids, bundleIdentifier, distCertSerialNumber) {
    const spinner = (0, _ora().default)(`Handling Adhoc provisioning profiles on Apple Developer Portal...`).start();
    const args = ['--apple-id', this.ctx.appleId, '--apple-password', this.ctx.appleIdPassword, this.ctx.team.id, udids.join(','), bundleIdentifier, distCertSerialNumber];
    const adhocProvisioningProfile = await (0, _fastlane().runAction)(_fastlane().travelingFastlane.manageAdHocProvisioningProfile, args);
    const {
      provisioningProfileUpdateTimestamp,
      provisioningProfileCreateTimestamp,
      provisioningProfileName
    } = adhocProvisioningProfile;

    if (provisioningProfileCreateTimestamp) {
      spinner.succeed(`Created new profile: ${provisioningProfileName}`);
    } else if (provisioningProfileUpdateTimestamp) {
      spinner.succeed(`Updated existing profile: ${provisioningProfileName}`);
    } else {
      spinner.succeed(`Used existing profile: ${provisioningProfileName}`);
    }

    delete adhocProvisioningProfile.provisioningProfileUpdateTimestamp;
    delete adhocProvisioningProfile.provisioningProfileCreateTimestamp;
    delete adhocProvisioningProfile.provisioningProfileName;
    return { ...adhocProvisioningProfile,
      teamId: this.ctx.team.id,
      teamName: this.ctx.team.name
    };
  }

}

exports.ProvisioningProfileAdhocManager = ProvisioningProfileAdhocManager;
//# sourceMappingURL=provisioningProfileAdhoc.js.map