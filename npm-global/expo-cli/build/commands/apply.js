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

function _jsonFile() {
  const data = _interopRequireDefault(require("@expo/json-file"));

  _jsonFile = function () {
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

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
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

function _configureAndroidProjectAsync() {
  const data = _interopRequireDefault(require("./apply/configureAndroidProjectAsync"));

  _configureAndroidProjectAsync = function () {
    return data;
  };

  return data;
}

function _configureIOSProjectAsync() {
  const data = _interopRequireDefault(require("./apply/configureIOSProjectAsync"));

  _configureIOSProjectAsync = function () {
    return data;
  };

  return data;
}

function _logConfigWarnings() {
  const data = require("./utils/logConfigWarnings");

  _logConfigWarnings = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function ensureConfigExistsAsync(projectRoot) {
  try {
    const config = (0, _config().getConfig)(projectRoot, {
      skipSDKVersionRequirement: true
    }); // If no config exists in the file system then we should generate one so the process doesn't fail.

    if (!config.dynamicConfigPath && !config.staticConfigPath) {
      // Don't check for a custom config path because the process should fail if a custom file doesn't exist.
      // Write the generated config.
      // writeConfigJsonAsync(projectRoot, config.exp);
      await _jsonFile().default.writeAsync(_path().default.join(projectRoot, 'app.json'), // @ts-ignore: ExpoConfig is not assignable to JSONObject
      {
        expo: config.exp
      }, {
        json5: false
      });
    }
  } catch (error) {
    // TODO(Bacon): Currently this is already handled in the command
    (0, _log().default)();
    (0, _log().default)(_chalk().default.red(error.message));
    (0, _log().default)();
    process.exit(1);
  }
}

function _default(program) {
  program.command('apply [path]').option('-p, --platform [platform]', 'Configure only the given platform ("ios" or "android")', /^(android|ios)$/i).helpGroup('experimental') // .option('--interactive', 'TODO: provide a flag where people can see a diff for each option to be applied and approve or reject it')
  .description('Sync the configuration from app.json to a native project').asyncActionProjectDir(async (projectDir, options) => {
    await ensureConfigExistsAsync(projectDir);

    if (!options.platform || options.platform === 'android') {
      await (0, _configureAndroidProjectAsync().default)(projectDir);
      (0, _logConfigWarnings().logConfigWarningsAndroid)();
    }

    if (!options.platform || options.platform === 'ios') {
      await (0, _configureIOSProjectAsync().default)(projectDir);
      (0, _logConfigWarnings().logConfigWarningsIOS)();
    }
  });
}
//# sourceMappingURL=apply.js.map