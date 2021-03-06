"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _config() {
  const data = require("@expo/config");

  _config = function () {
    return data;
  };

  return data;
}

function _devTools() {
  const data = require("@expo/dev-tools");

  _devTools = function () {
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

function _intersection() {
  const data = _interopRequireDefault(require("lodash/intersection"));

  _intersection = function () {
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

function _openBrowser() {
  const data = _interopRequireDefault(require("react-dev-utils/openBrowser"));

  _openBrowser = function () {
    return data;
  };

  return data;
}

function _semver() {
  const data = _interopRequireDefault(require("semver"));

  _semver = function () {
    return data;
  };

  return data;
}

function _exit() {
  const data = require("../exit");

  _exit = function () {
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

function _sendTo() {
  const data = _interopRequireDefault(require("../sendTo"));

  _sendTo = function () {
    return data;
  };

  return data;
}

function _urlOpts() {
  const data = _interopRequireDefault(require("../urlOpts"));

  _urlOpts = function () {
    return data;
  };

  return data;
}

function TerminalUI() {
  const data = _interopRequireWildcard(require("./start/TerminalUI"));

  TerminalUI = function () {
    return data;
  };

  return data;
}

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-ignore: not typed
function hasBooleanArg(rawArgs, argName) {
  return rawArgs.includes('--' + argName) || rawArgs.includes('--no-' + argName);
}

function getBooleanArg(rawArgs, argName) {
  if (rawArgs.includes('--' + argName)) {
    return true;
  } else {
    return false;
  }
} // The main purpose of this function is to take existing options object and
// support boolean args with as defined in the hasBooleanArg and getBooleanArg
// functions.


async function normalizeOptionsAsync(projectDir, options) {
  var _options$parent, _options$parent2;

  const opts = { ...options,
    // This is necessary to ensure we don't drop any options
    webOnly: !!options.webOnly,
    // This is only ever true in the start:web command
    nonInteractive: (_options$parent = options.parent) === null || _options$parent === void 0 ? void 0 : _options$parent.nonInteractive
  };
  const rawArgs = ((_options$parent2 = options.parent) === null || _options$parent2 === void 0 ? void 0 : _options$parent2.rawArgs) || [];

  if (hasBooleanArg(rawArgs, 'dev')) {
    opts.dev = getBooleanArg(rawArgs, 'dev');
  } else {
    opts.dev = true;
  }

  if (hasBooleanArg(rawArgs, 'minify')) {
    opts.minify = getBooleanArg(rawArgs, 'minify');
  } else {
    opts.minify = false;
  }

  if (hasBooleanArg(rawArgs, 'https')) {
    opts.https = getBooleanArg(rawArgs, 'https');
  } else {
    opts.https = false;
  }

  if (hasBooleanArg(rawArgs, 'android')) {
    opts.android = getBooleanArg(rawArgs, 'android');
  }

  if (hasBooleanArg(rawArgs, 'ios')) {
    opts.ios = getBooleanArg(rawArgs, 'ios');
  }

  if (hasBooleanArg(rawArgs, 'web')) {
    opts.web = getBooleanArg(rawArgs, 'web');
  }

  if (hasBooleanArg(rawArgs, 'localhost')) {
    opts.localhost = getBooleanArg(rawArgs, 'localhost');
  }

  if (hasBooleanArg(rawArgs, 'lan')) {
    opts.lan = getBooleanArg(rawArgs, 'lan');
  }

  if (hasBooleanArg(rawArgs, 'tunnel')) {
    opts.tunnel = getBooleanArg(rawArgs, 'tunnel');
  }

  await cacheOptionsAsync(projectDir, opts);
  return opts;
}

async function cacheOptionsAsync(projectDir, options) {
  await _xdl().ProjectSettings.setAsync(projectDir, {
    dev: options.dev,
    minify: options.minify,
    https: options.https
  });
}

function parseStartOptions(options) {
  const startOpts = {};

  if (options.clear) {
    startOpts.reset = true;
  }

  if (options.nonInteractive) {
    startOpts.nonInteractive = true;
  }

  if (options.webOnly) {
    startOpts.webOnly = true;
  }

  if (options.maxWorkers) {
    startOpts.maxWorkers = options.maxWorkers;
  }

  return startOpts;
}

async function startWebAction(projectDir, options) {
  const {
    exp,
    rootPath
  } = await configureProjectAsync(projectDir, options);
  const startOpts = parseStartOptions(options);
  await _xdl().Project.startAsync(rootPath, { ...startOpts,
    exp
  });
  await _urlOpts().default.handleMobileOptsAsync(projectDir, options);

  if (!options.nonInteractive && !exp.isDetached) {
    await TerminalUI().startAsync(projectDir, startOpts);
  }
}

async function action(projectDir, options) {
  const {
    exp,
    pkg,
    rootPath
  } = await configureProjectAsync(projectDir, options); // TODO: only validate dependencies if starting in managed workflow

  await validateDependenciesVersions(projectDir, exp, pkg);
  const startOpts = parseStartOptions(options);
  await _xdl().Project.startAsync(rootPath, { ...startOpts,
    exp
  });
  const url = await _xdl().UrlUtils.constructManifestUrlAsync(projectDir);
  const recipient = await _sendTo().default.getRecipient(options.sendTo);

  if (recipient) {
    await _sendTo().default.sendUrlAsync(url, recipient);
  }

  await _urlOpts().default.handleMobileOptsAsync(projectDir, options);

  if (!startOpts.nonInteractive && !exp.isDetached) {
    await TerminalUI().startAsync(projectDir, startOpts);
  } else {
    if (!exp.isDetached) {
      _log().default.newLine();

      _urlOpts().default.printQRCode(url);
    }

    (0, _log().default)(`Your native app is running at ${_chalk().default.underline(url)}`);
  }

  _log().default.nested(_chalk().default.green('Logs for your project will appear below. Press Ctrl+C to exit.'));
}

async function validateDependenciesVersions(projectDir, exp, pkg) {
  if (!_xdl().Versions.gteSdkVersion(exp, '33.0.0')) {
    return;
  }

  const bundleNativeModulesPath = (0, _config().projectHasModule)('expo/bundledNativeModules.json', projectDir, exp);

  if (!bundleNativeModulesPath) {
    _log().default.warn(`Your project is in SDK version >= 33.0.0, but the ${_chalk().default.underline('expo')} package version seems to be older.`);

    return;
  }

  const bundledNativeModules = await _jsonFile().default.readAsync(bundleNativeModulesPath);
  const bundledNativeModulesNames = Object.keys(bundledNativeModules);
  const projectDependencies = Object.keys(pkg.dependencies || []);
  const modulesToCheck = (0, _intersection().default)(bundledNativeModulesNames, projectDependencies);
  const incorrectDeps = [];

  for (const moduleName of modulesToCheck) {
    const expectedRange = bundledNativeModules[moduleName];
    const actualRange = pkg.dependencies[moduleName];

    if ((_semver().default.valid(actualRange) || _semver().default.validRange(actualRange)) && typeof expectedRange === 'string' && !_semver().default.intersects(expectedRange, actualRange)) {
      incorrectDeps.push({
        moduleName,
        expectedRange,
        actualRange
      });
    }
  }

  if (incorrectDeps.length > 0) {
    _log().default.warn("Some of your project's dependencies are not compatible with currently installed expo package version:");

    incorrectDeps.forEach(({
      moduleName,
      expectedRange,
      actualRange
    }) => {
      _log().default.warn(` - ${_chalk().default.underline(moduleName)} - expected version range: ${_chalk().default.underline(expectedRange)} - actual version installed: ${_chalk().default.underline(actualRange)}`);
    });

    _log().default.warn('Your project may not work correctly until you install the correct versions of the packages.\n' + `To install the correct versions of these packages, please run: ${_chalk().default.inverse('expo install [package-name ...]')}`);
  }
}

async function tryOpeningDevToolsAsync({
  rootPath,
  exp,
  options
}) {
  const devToolsUrl = await _devTools().DevToolsServer.startAsync(rootPath);
  (0, _log().default)(`Expo DevTools is running at ${_chalk().default.underline(devToolsUrl)}`);

  if (!options.nonInteractive && !exp.isDetached) {
    if (await _xdl().UserSettings.getAsync('openDevToolsAtStartup', true)) {
      (0, _log().default)(`Opening DevTools in the browser... (press ${_chalk().default.bold`shift-d`} to disable)`);
      (0, _openBrowser().default)(devToolsUrl);
    } else {
      (0, _log().default)(`Press ${_chalk().default.bold`d`} to open DevTools now, or ${_chalk().default.bold`shift-d`} to always open it automatically.`);
    }
  }
}

async function configureProjectAsync(projectDir, options) {
  if (options.webOnly) {
    (0, _exit().installExitHooks)(projectDir, _xdl().Project.stopWebOnlyAsync);
  } else {
    (0, _exit().installExitHooks)(projectDir);
  }

  await _urlOpts().default.optsAsync(projectDir, options);
  (0, _log().default)(_chalk().default.gray(`Starting project at ${projectDir}`));
  const projectConfig = (0, _config().getConfig)(projectDir, {
    skipSDKVersionRequirement: options.webOnly
  });
  const {
    exp,
    pkg
  } = projectConfig; // TODO: move this function over to CLI
  // const message = getProjectConfigDescription(projectDir, projectConfig);
  // if (message) {
  //   log(chalk.magenta(`\u203A ${message}`));
  // }

  const rootPath = _path().default.resolve(projectDir);

  await tryOpeningDevToolsAsync({
    rootPath,
    exp,
    options
  });
  return {
    rootPath,
    exp,
    pkg
  };
}

var _default = program => {
  program.command('start [path]').alias('r').description('Start a local dev server for the app').helpGroup('core').option('-s, --send-to [dest]', 'An email address to send a link to').option('-c, --clear', 'Clear the Metro bundler cache') // TODO(anp) set a default for this dynamically based on whether we're inside a container?
  .option('--max-workers [num]', 'Maximum number of tasks to allow Metro to spawn.').option('--dev', 'Turn development mode on').option('--no-dev', 'Turn development mode off').option('--minify', 'Minify code').option('--no-minify', 'Do not minify code').option('--https', 'To start webpack with https protocol').option('--no-https', 'To start webpack with http protocol').urlOpts().allowOffline().asyncActionProjectDir(async (projectDir, options) => {
    const normalizedOptions = await normalizeOptionsAsync(projectDir, options);
    return await action(projectDir, normalizedOptions);
  });
  program.command('start:web [path]').alias('web').description('Start a Webpack dev server for the web app').helpGroup('core').option('--dev', 'Turn development mode on').option('--no-dev', 'Turn development mode off').option('--minify', 'Minify code').option('--no-minify', 'Do not minify code').option('--https', 'To start webpack with https protocol').option('--no-https', 'To start webpack with http protocol').urlOpts().allowOffline().asyncActionProjectDir(async (projectDir, options) => {
    return startWebAction(projectDir, (await normalizeOptionsAsync(projectDir, { ...options,
      webOnly: true
    })));
  });
};

exports.default = _default;
//# sourceMappingURL=start.js.map