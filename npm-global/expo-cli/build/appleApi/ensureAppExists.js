"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensureAppExists = ensureAppExists;

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

async function ensureAppExists(appleCtx, {
  accountName,
  projectName,
  bundleIdentifier
}, options = {}) {
  const {
    appleId,
    appleIdPassword,
    team
  } = appleCtx;
  const spinner = (0, _ora().default)(`Ensuring App ID exists on Apple Developer Portal...`).start();

  try {
    const {
      created
    } = await (0, _fastlane().runAction)(_fastlane().travelingFastlane.ensureAppExists, [...(options.enablePushNotifications ? ['--push-notifications'] : []), appleId, appleIdPassword, team.id, bundleIdentifier, `@${accountName}/${projectName}`]);

    if (created) {
      spinner.succeed(`App ID created with bundle identifier ${bundleIdentifier}.`);
    } else {
      spinner.succeed('App ID found on Apple Developer Portal.');
    }
  } catch (err) {
    spinner.fail('Something went wrong when trying to ensure App ID exists on Apple Developer Portal!');
    throw err;
  }
}
//# sourceMappingURL=ensureAppExists.js.map