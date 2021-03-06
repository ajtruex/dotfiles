"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = install;

function ConfigUtils() {
  const data = _interopRequireWildcard(require("@expo/config"));

  ConfigUtils = function () {
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

function PackageManager() {
  const data = _interopRequireWildcard(require("@expo/package-manager"));

  PackageManager = function () {
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

function _fs() {
  const data = _interopRequireDefault(require("fs"));

  _fs = function () {
    return data;
  };

  return data;
}

function _npmPackageArg() {
  const data = _interopRequireDefault(require("npm-package-arg"));

  _npmPackageArg = function () {
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

function _ProjectUtils() {
  const data = require("./utils/ProjectUtils");

  _ProjectUtils = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

async function installAsync(packages, options) {
  let projectRoot;

  try {
    const info = await (0, _ProjectUtils().findProjectRootAsync)(process.cwd());
    projectRoot = info.projectRoot;
  } catch (error) {
    if (error.code !== 'NO_PROJECT') {
      // An unknown error occurred.
      throw error;
    } // This happens when an app.config exists but a package.json is not present.


    _log().default.addNewLineIfNone();

    _log().default.error(error.message);

    _log().default.newLine();

    (0, _log().default)(_log().default.chalk.cyan(`You can create a new project with ${_log().default.chalk.bold(`expo init`)}`));

    _log().default.newLine();

    process.exit(1);
  }

  const packageManager = PackageManager().createForProject(projectRoot, {
    npm: options.npm,
    yarn: options.yarn,
    log: _log().default
  });
  const {
    exp,
    pkg
  } = ConfigUtils().getConfig(projectRoot, {
    skipSDKVersionRequirement: true
  }); // If using `expo install` in a project without the expo package even listed
  // in package.json, just fall through to npm/yarn.
  //

  if (!pkg.dependencies['expo']) {
    return await packageManager.addAsync(...packages);
  }

  if (!exp.sdkVersion) {
    _log().default.addNewLineIfNone();

    _log().default.error(`The ${_log().default.chalk.bold(`expo`)} package was found in your ${_log().default.chalk.bold(`package.json`)} but we couldn't resolve the Expo SDK version. Run ${_log().default.chalk.bold(`${packageManager.name.toLowerCase()} install`)} and then try this command again.`);

    _log().default.newLine();

    process.exit(1);
    return;
  }

  if (!_xdl().Versions.gteSdkVersion(exp, '33.0.0')) {
    _log().default.addNewLineIfNone();

    _log().default.error(`${_log().default.chalk.bold(`expo install`)} is only available for Expo SDK version 33 or higher.`);

    _log().default.newLine();

    (0, _log().default)(_log().default.chalk.cyan(`Current version: ${_log().default.chalk.bold(exp.sdkVersion)}`));

    _log().default.newLine();

    process.exit(1);
  } // This shouldn't be invoked because `findProjectRootAsync` will throw if node_modules are missing.


  if (!_fs().default.existsSync(_path().default.join(exp.nodeModulesPath || projectRoot, 'node_modules'))) {
    _log().default.addNewLineIfNone();

    (0, _log().default)(_log().default.chalk.cyan(`node_modules not found, running ${packageManager.name} install command.`));

    _log().default.newLine();

    await packageManager.installAsync();
  }

  const bundledNativeModulesPath = ConfigUtils().projectHasModule('expo/bundledNativeModules.json', projectRoot, exp);

  if (!bundledNativeModulesPath) {
    _log().default.addNewLineIfNone();

    _log().default.error(`The dependency map ${_log().default.chalk.bold(`expo/bundledNativeModules.json`)} cannot be found, please ensure you have the package "${_log().default.chalk.bold`expo`}" installed in your project.`);

    _log().default.newLine();

    process.exit(1);
  }

  const bundledNativeModules = await _jsonFile().default.readAsync(bundledNativeModulesPath);
  const nativeModules = [];
  const others = [];
  const versionedPackages = packages.map(arg => {
    const spec = (0, _npmPackageArg().default)(arg);
    const {
      name
    } = spec;

    if (['tag', 'version', 'range'].includes(spec.type) && name && bundledNativeModules[name]) {
      // Unimodule packages from npm registry are modified to use the bundled version.
      const version = bundledNativeModules[name];
      const modifiedSpec = `${name}@${version}`;
      nativeModules.push(modifiedSpec);
      return modifiedSpec;
    } else {
      // Other packages are passed through unmodified.
      others.push(spec.raw);
      return spec.raw;
    }
  });
  const messages = [];

  if (nativeModules.length > 0) {
    messages.push(`${nativeModules.length} SDK ${exp.sdkVersion} compatible native ${nativeModules.length === 1 ? 'module' : 'modules'}`);
  }

  if (others.length > 0) {
    messages.push(`${others.length} other ${others.length === 1 ? 'package' : 'packages'}`);
  }

  (0, _log().default)(`Installing ${messages.join(' and ')} using ${packageManager.name}.`);
  await packageManager.addAsync(...versionedPackages);
}

function install(program) {
  program.command('install [packages...]').alias('add').helpGroup('core').option('--npm', 'Use npm to install dependencies. (default when package-lock.json exists)').option('--yarn', 'Use Yarn to install dependencies. (default when yarn.lock exists)').description('Install a unimodule or other package to a project').asyncAction(installAsync);
}
//# sourceMappingURL=install.js.map