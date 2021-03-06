"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDistCert = isDistCert;
exports.DistCertManager = void 0;

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function () {
    return data;
  };

  return data;
}

function _dateformat() {
  const data = _interopRequireDefault(require("dateformat"));

  _dateformat = function () {
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

function _CommandError() {
  const data = _interopRequireWildcard(require("../CommandError"));

  _CommandError = function () {
    return data;
  };

  return data;
}

function _log() {
  const data = _interopRequireDefault(require("../log"));

  _log = function () {
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

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function isDistCert(obj) {
  return obj.certP12 && typeof obj.certP12 === 'string' && obj.certPassword && typeof obj.certPassword === 'string' && obj.teamId && typeof obj.teamId === 'string';
}

const APPLE_DIST_CERTS_TOO_MANY_GENERATED_ERROR = `
You can have only ${_chalk().default.underline('three')} Apple Distribution Certificates generated on your Apple Developer account.
Please revoke the old ones or reuse existing from your other apps.
Please remember that Apple Distribution Certificates are not application specific!
`;

class DistCertManager {
  constructor(appleCtx) {
    _defineProperty(this, "ctx", void 0);

    this.ctx = appleCtx;
  }

  async list() {
    const spinner = (0, _ora().default)(`Getting Distribution Certificates from Apple...`).start();
    const args = ['list', this.ctx.appleId, this.ctx.appleIdPassword, this.ctx.team.id, String(this.ctx.team.inHouse)];
    const {
      certs
    } = await (0, _fastlane().runAction)(_fastlane().travelingFastlane.manageDistCerts, args);
    spinner.succeed();
    return certs;
  }

  async create() {
    const spinner = (0, _ora().default)(`Creating Distribution Certificate on Apple Servers...`).start();

    try {
      const args = ['create', this.ctx.appleId, this.ctx.appleIdPassword, this.ctx.team.id, String(this.ctx.team.inHouse)];
      const result = { ...(await (0, _fastlane().runAction)(_fastlane().travelingFastlane.manageDistCerts, args)),
        teamId: this.ctx.team.id,
        teamName: this.ctx.team.name
      };
      spinner.succeed();
      return result;
    } catch (err) {
      var _err$rawDump;

      spinner.stop();
      const resultString = (_err$rawDump = err.rawDump) === null || _err$rawDump === void 0 ? void 0 : _err$rawDump.resultString;

      if (resultString && resultString.match(/Maximum number of certificates generated/)) {
        throw new (_CommandError().default)(_CommandError().ErrorCodes.APPLE_DIST_CERTS_TOO_MANY_GENERATED_ERROR, APPLE_DIST_CERTS_TOO_MANY_GENERATED_ERROR);
      }

      throw err;
    }
  }

  async revoke(ids) {
    const spinner = (0, _ora().default)(`Revoking Distribution Certificate on Apple Servers...`).start();

    try {
      const args = ['revoke', this.ctx.appleId, this.ctx.appleIdPassword, this.ctx.team.id, String(this.ctx.team.inHouse), ids.join(',')];
      await (0, _fastlane().runAction)(_fastlane().travelingFastlane.manageDistCerts, args);
      spinner.succeed();
    } catch (error) {
      _log().default.error(error);

      spinner.fail('Failed to revoke Distribution Certificate on Apple Servers');
      throw error;
    }
  }

  format({
    name,
    id,
    status,
    expires,
    created,
    ownerName
  }) {
    const expiresDate = _formatTimestamp(expires);

    const createdDate = _formatTimestamp(created);

    return `${name} (${status}) - ID: ${id} - expires: ${expiresDate} (created: ${createdDate}) - owner: ${ownerName}`;
  }

}

exports.DistCertManager = DistCertManager;

function _formatTimestamp(timestamp) {
  return (0, _dateformat().default)(new Date(timestamp * 1000));
}
//# sourceMappingURL=distributionCert.js.map