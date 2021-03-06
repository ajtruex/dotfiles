"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UpdateFcmKey = void 0;

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function () {
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

function _prompt() {
  const data = _interopRequireDefault(require("../../prompt"));

  _prompt = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UpdateFcmKey {
  constructor(experienceName) {
    this.experienceName = experienceName;
  }

  async open(ctx) {
    if (ctx.nonInteractive) {
      throw new (_CommandError().default)('NON_INTERACTIVE', "Start the CLI without the '--non-interactive' flag to update the FCM Api key.");
    }

    const {
      fcmApiKey
    } = await (0, _prompt().default)([{
      type: 'input',
      name: 'fcmApiKey',
      message: 'FCM Api Key',
      validate: value => value.length > 0 || "FCM Api Key can't be empty"
    }]);
    await ctx.android.updateFcmKey(this.experienceName, fcmApiKey);
    (0, _log().default)(_chalk().default.green('Updated successfully'));
    return null;
  }

}

exports.UpdateFcmKey = UpdateFcmKey;
//# sourceMappingURL=AndroidPushCredentials.js.map