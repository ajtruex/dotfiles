"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _easBuildJob() {
  const data = require("@expo/eas-build-job");

  _easBuildJob = function () {
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

function _figures() {
  const data = _interopRequireDefault(require("figures"));

  _figures = function () {
    return data;
  };

  return data;
}

function _fsExtra() {
  const data = _interopRequireDefault(require("fs-extra"));

  _fsExtra = function () {
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

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
    return data;
  };

  return data;
}

function _easJson() {
  const data = require("../../../easJson");

  _easJson = function () {
    return data;
  };

  return data;
}

function _git() {
  const data = require("../../../git");

  _git = function () {
    return data;
  };

  return data;
}

function _log() {
  const data = _interopRequireDefault(require("../../../log"));

  _log = function () {
    return data;
  };

  return data;
}

function _AndroidBuilder() {
  const data = _interopRequireDefault(require("../build/builders/AndroidBuilder"));

  _AndroidBuilder = function () {
    return data;
  };

  return data;
}

function _iOSBuilder() {
  const data = _interopRequireDefault(require("../build/builders/iOSBuilder"));

  _iOSBuilder = function () {
    return data;
  };

  return data;
}

function _types() {
  const data = require("../types");

  _types = function () {
    return data;
  };

  return data;
}

function _createBuilderContext() {
  const data = _interopRequireDefault(require("../utils/createBuilderContext"));

  _createBuilderContext = function () {
    return data;
  };

  return data;
}

function _createCommandContextAsync() {
  const data = _interopRequireDefault(require("../utils/createCommandContextAsync"));

  _createCommandContextAsync = function () {
    return data;
  };

  return data;
}

function _git2() {
  const data = require("../utils/git");

  _git2 = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function initAction(projectDir, options) {
  var _options$parent;

  const buildCommandPlatforms = Object.values(_types().BuildCommandPlatform);
  const {
    platform: requestedPlatform = _types().BuildCommandPlatform.ALL
  } = options;
  const nonInteractive = ((_options$parent = options.parent) === null || _options$parent === void 0 ? void 0 : _options$parent.nonInteractive) === true;

  if (!buildCommandPlatforms.includes(requestedPlatform)) {
    throw new Error(`-p/--platform needs to be one of the valid platforms: ${buildCommandPlatforms.map(p => _log().default.chalk.bold(p)).join(', ')}`);
  }

  const spinner = (0, _ora().default)('Checking for eas.json file');
  await (0, _git2().ensureGitRepoExistsAsync)();
  await (0, _git2().ensureGitStatusIsCleanAsync)();

  const easJsonPath = _path().default.join(projectDir, 'eas.json');

  const easJson = {
    builds: {
      android: {
        release: {
          workflow: 'generic'
        }
      },
      ios: {
        release: {
          workflow: 'generic'
        }
      }
    }
  };

  if (!(await _fsExtra().default.pathExists(easJsonPath))) {
    await _fsExtra().default.writeFile(easJsonPath, `${JSON.stringify(easJson, null, 2)}\n`);
    await (0, _git().gitAddAsync)(easJsonPath, {
      intentToAdd: true
    });
  }

  try {
    await (0, _git2().ensureGitStatusIsCleanAsync)();
    spinner.succeed('Found existing eas.json file');
  } catch (err) {
    if (err instanceof _git2().DirtyGitTreeError) {
      spinner.succeed('We created a minimal eas.json file');

      _log().default.newLine();

      try {
        await (0, _git2().reviewAndCommitChangesAsync)('Create minimal eas.json', {
          nonInteractive
        });
        (0, _log().default)(`${_chalk().default.green(_figures().default.tick)} Successfully committed eas.json.`);
      } catch (e) {
        throw new Error("Aborting, run the command again once you're ready. Make sure to commit any changes you've made.");
      }
    } else {
      spinner.fail();
      throw err;
    }
  }

  const commandCtx = await (0, _createCommandContextAsync().default)({
    requestedPlatform,
    profile: 'release',
    projectDir,
    trackingCtx: {},
    nonInteractive,
    skipCredentialsCheck: options === null || options === void 0 ? void 0 : options.skipCredentialsCheck,
    skipProjectConfiguration: false
  });
  const easConfig = await new (_easJson().EasJsonReader)(commandCtx.projectDir, commandCtx.requestedPlatform).readAsync(commandCtx.profile);

  if (requestedPlatform === _types().BuildCommandPlatform.ALL || requestedPlatform === _types().BuildCommandPlatform.ANDROID) {
    const androidCtx = (0, _createBuilderContext().default)({
      commandCtx,
      platform: _easBuildJob().Platform.Android,
      easConfig
    });
    const androidBuilder = new (_AndroidBuilder().default)(androidCtx);
    await androidBuilder.ensureCredentialsAsync();
    await androidBuilder.configureProjectAsync();
  }

  if (requestedPlatform === _types().BuildCommandPlatform.ALL || requestedPlatform === _types().BuildCommandPlatform.IOS) {
    const iosCtx = (0, _createBuilderContext().default)({
      commandCtx,
      platform: _easBuildJob().Platform.iOS,
      easConfig
    });
    const iosBuilder = new (_iOSBuilder().default)(iosCtx);
    await iosBuilder.ensureCredentialsAsync();
    await iosBuilder.configureProjectAsync();
  }
}

var _default = initAction;
exports.default = _default;
//# sourceMappingURL=action.js.map