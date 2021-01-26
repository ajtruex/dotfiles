"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBundleIdentifier = void 0;

function _config() {
  const data = require("@expo/config");

  _config = function () {
    return data;
  };

  return data;
}

function _once() {
  const data = _interopRequireDefault(require("lodash/once"));

  _once = function () {
    return data;
  };

  return data;
}

function _log() {
  const data = _interopRequireDefault(require("../../../../log"));

  _log = function () {
    return data;
  };

  return data;
}

function _prompts() {
  const data = _interopRequireDefault(require("../../../../prompts"));

  _prompts = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getBundleIdentifier = (0, _once().default)(_getBundleIdentifier);
exports.getBundleIdentifier = getBundleIdentifier;

async function _getBundleIdentifier(projectDir, manifest) {
  const bundleIdentifierFromPbxproj = _config().IOSConfig.BundleIdenitifer.getBundleIdentifierFromPbxproj(projectDir);

  const bundleIdentifierFromConfig = _config().IOSConfig.BundleIdenitifer.getBundleIdentifier(manifest);

  if (bundleIdentifierFromPbxproj !== null && bundleIdentifierFromConfig !== null) {
    if (bundleIdentifierFromPbxproj === bundleIdentifierFromConfig) {
      return bundleIdentifierFromPbxproj;
    } else {
      _log().default.newLine();

      (0, _log().default)(_log().default.chalk.yellow(`We detected that your Xcode project is configured with a different bundle identifier than the one defined in app.json/app.config.js.
If you choose the one defined in app.json/app.config.js we'll automatically configure your Xcode project with it.
However, if you choose the one defined in the Xcode project you'll have to update app.json/app.config.js on your own.
Otherwise, you'll see this prompt again in the future.`));

      _log().default.newLine();

      const {
        bundleIdentifier
      } = await (0, _prompts().default)({
        type: 'select',
        name: 'bundleIdentifier',
        message: 'Which bundle identifier should we use?',
        choices: [{
          title: `Defined in the Xcode project: ${_log().default.chalk.bold(bundleIdentifierFromPbxproj)}`,
          value: bundleIdentifierFromPbxproj
        }, {
          title: `Defined in app.json/app.config.js: ${_log().default.chalk.bold(bundleIdentifierFromConfig)}`,
          value: bundleIdentifierFromConfig
        }]
      });
      return bundleIdentifier;
    }
  } else if (bundleIdentifierFromPbxproj === null && bundleIdentifierFromConfig === null) {
    throw new Error('Please define "expo.ios.bundleIdentifier" in app.json/app.config.js');
  } else {
    if (bundleIdentifierFromPbxproj !== null) {
      (0, _log().default)(`Using ${_log().default.chalk.bold(bundleIdentifierFromPbxproj)} as the bundle identifier (read from the Xcode project).`);
      return bundleIdentifierFromPbxproj;
    } else {
      // bundleIdentifierFromConfig is never null in this case
      // the following line is to satisfy TS
      const bundleIdentifier = bundleIdentifierFromConfig !== null && bundleIdentifierFromConfig !== void 0 ? bundleIdentifierFromConfig : '';
      (0, _log().default)(`Using ${_log().default.chalk.bold(bundleIdentifier)} as the bundle identifier (read from app.json/app.config.js).
We'll automatically configure your Xcode project using this value.`);
      return bundleIdentifier;
    }
  }
}
//# sourceMappingURL=ios.js.map