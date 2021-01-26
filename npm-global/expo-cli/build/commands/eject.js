"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _config() {
  const data = require("@expo/config");

  _config = function () {
    return data;
  };

  return data;
}

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

function _log() {
  const data = _interopRequireDefault(require("../log"));

  _log = function () {
    return data;
  };

  return data;
}

function _prompts() {
  const data = require("../prompts");

  _prompts = function () {
    return data;
  };

  return data;
}

function Eject() {
  const data = _interopRequireWildcard(require("./eject/Eject"));

  Eject = function () {
    return data;
  };

  return data;
}

function LegacyEject() {
  const data = _interopRequireWildcard(require("./eject/LegacyEject"));

  LegacyEject = function () {
    return data;
  };

  return data;
}

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function userWantsToEjectWithoutUpgradingAsync() {
  const answer = await (0, _prompts().confirmAsync)({
    message: `We recommend upgrading to the latest SDK version before ejecting. SDK 37 introduces support for OTA updates and notifications in ejected projects, and includes many features that make ejecting your project easier. Would you like to continue ejecting anyways?`
  });
  return answer;
}

async function action(projectDir, options) {
  let exp;

  try {
    exp = (0, _config().getConfig)(projectDir).exp;
  } catch (error) {
    (0, _log().default)();
    (0, _log().default)(_chalk().default.red(error.message));
    (0, _log().default)();
    process.exit(1);
  }

  if (options.npm) {
    options.packageManager = 'npm';
  } // Set EXPO_VIEW_DIR to universe/exponent to pull expo view code locally instead of from S3 for ExpoKit


  if (_xdl().Versions.lteSdkVersion(exp, '36.0.0')) {
    // Don't show a warning if we haven't released SDK 37 yet
    const latestReleasedVersion = await _xdl().Versions.newestReleasedSdkVersionAsync();

    if (_xdl().Versions.lteSdkVersion({
      sdkVersion: latestReleasedVersion.version
    }, '36.0.0')) {
      await LegacyEject().ejectAsync(projectDir, options);
    } else {
      if (options.force || (await userWantsToEjectWithoutUpgradingAsync())) {
        await LegacyEject().ejectAsync(projectDir, options);
      }
    }
  } else {
    await Eject().ejectAsync(projectDir, options);
  }
}

function _default(program) {
  program.command('eject [path]').description( // TODO: Use Learn more link when it lands
  `Create native iOS and Android project files. Read more: https://docs.expo.io/bare/customizing/`).longDescription('Create Xcode and Android Studio projects for your app. Use this if you need to add custom native functionality.').helpGroup('eject').option('--no-install', 'Skip installing npm packages and CocoaPods.').option('--npm', 'Use npm to install dependencies. (default when Yarn is not installed)').asyncActionProjectDir(action);
}
//# sourceMappingURL=eject.js.map