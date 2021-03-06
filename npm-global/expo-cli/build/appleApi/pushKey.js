"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPushKey = isPushKey;
exports.PushKeyManager = void 0;

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

function isPushKey(obj) {
  return obj.apnsKeyP8 && typeof obj.apnsKeyP8 === 'string' && obj.apnsKeyId && typeof obj.apnsKeyId === 'string' && obj.teamId && typeof obj.teamId === 'string';
}

const APPLE_KEYS_TOO_MANY_GENERATED_ERROR = `
You can have only ${_chalk().default.underline('two')} Apple Keys generated on your Apple Developer account.
Please revoke the old ones or reuse existing from your other apps.
Please remember that Apple Keys are not application specific!
`;

class PushKeyManager {
  constructor(appleCtx) {
    _defineProperty(this, "ctx", void 0);

    this.ctx = appleCtx;
  }

  async list() {
    const spinner = (0, _ora().default)(`Getting Push Keys from Apple...`).start();
    const args = ['list', this.ctx.appleId, this.ctx.appleIdPassword, this.ctx.team.id];
    const {
      keys
    } = await (0, _fastlane().runAction)(_fastlane().travelingFastlane.managePushKeys, args);
    spinner.succeed();
    return keys;
  }

  async create(name = `Expo Push Notifications Key ${(0, _dateformat().default)('yyyymmddHHMMss')}`) {
    const spinner = (0, _ora().default)(`Creating Push Key on Apple Servers...`).start();

    try {
      const args = ['create', this.ctx.appleId, this.ctx.appleIdPassword, this.ctx.team.id, name];
      const {
        apnsKeyId,
        apnsKeyP8
      } = await (0, _fastlane().runAction)(_fastlane().travelingFastlane.managePushKeys, args);
      spinner.succeed();
      return {
        apnsKeyId,
        apnsKeyP8,
        teamId: this.ctx.team.id,
        teamName: this.ctx.team.name
      };
    } catch (err) {
      var _err$rawDump;

      spinner.stop();
      const resultString = (_err$rawDump = err.rawDump) === null || _err$rawDump === void 0 ? void 0 : _err$rawDump.resultString;

      if (resultString && resultString.match(/maximum allowed number of Keys/)) {
        throw new (_CommandError().default)(_CommandError().ErrorCodes.APPLE_PUSH_KEYS_TOO_MANY_GENERATED_ERROR, APPLE_KEYS_TOO_MANY_GENERATED_ERROR);
      }

      throw err;
    }
  }

  async revoke(ids) {
    const spinner = (0, _ora().default)(`Revoking Push Key on Apple Servers...`).start();

    try {
      const args = ['revoke', this.ctx.appleId, this.ctx.appleIdPassword, this.ctx.team.id, ids.join(',')];
      await (0, _fastlane().runAction)(_fastlane().travelingFastlane.managePushKeys, args);
      spinner.succeed();
    } catch (error) {
      _log().default.error(error);

      spinner.fail('Failed to revoke Push Key on Apple Servers');
      throw error;
    }
  }

  format({
    id,
    name
  }) {
    return `${name} - ID: ${id}`;
  }

}

exports.PushKeyManager = PushKeyManager;
//# sourceMappingURL=pushKey.js.map