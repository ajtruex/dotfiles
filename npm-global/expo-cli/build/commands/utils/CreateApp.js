"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateName = validateName;
exports.getConflictsForDirectory = getConflictsForDirectory;
exports.assertFolderEmptyAsync = assertFolderEmptyAsync;
exports.resolvePackageManager = resolvePackageManager;
exports.installNodeDependenciesAsync = installNodeDependenciesAsync;
exports.logNewSection = logNewSection;
exports.getChangeDirectoryPath = getChangeDirectoryPath;
exports.installCocoaPodsAsync = installCocoaPodsAsync;

function PackageManager() {
  const data = _interopRequireWildcard(require("@expo/package-manager"));

  PackageManager = function () {
    return data;
  };

  return data;
}

function _commander() {
  const data = _interopRequireDefault(require("commander"));

  _commander = function () {
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

function _getenv() {
  const data = _interopRequireDefault(require("getenv"));

  _getenv = function () {
    return data;
  };

  return data;
}

function _jsYaml() {
  const data = _interopRequireDefault(require("js-yaml"));

  _jsYaml = function () {
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

function path() {
  const data = _interopRequireWildcard(require("path"));

  path = function () {
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

function _log() {
  const data = _interopRequireDefault(require("../../log"));

  _log = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function validateName(name) {
  if (typeof name !== 'string' || name === '') {
    return 'The project name can not be empty.';
  }

  if (!/^[a-z0-9@.\-_]+$/i.test(name)) {
    return 'The project name can only contain URL-friendly characters (alphanumeric and @ . -  _)';
  }

  return true;
} // Any of these files are allowed to exist in the projectRoot


const TOLERABLE_FILES = [// System
'.DS_Store', 'Thumbs.db', // Git
'.git', '.gitattributes', '.gitignore', // Project
'.npmignore', '.travis.yml', 'LICENSE', 'docs', '.idea', // Package manager
'npm-debug.log', 'yarn-debug.log', 'yarn-error.log'];

function getConflictsForDirectory(projectRoot, tolerableFiles = TOLERABLE_FILES) {
  return _fsExtra().default.readdirSync(projectRoot).filter(file => !(/\.iml$/.test(file) || tolerableFiles.includes(file)));
}

async function assertFolderEmptyAsync({
  projectRoot,
  folderName = path().dirname(projectRoot),
  overwrite
}) {
  const conflicts = getConflictsForDirectory(projectRoot);

  if (conflicts.length) {
    _log().default.addNewLineIfNone();

    _log().default.nested(`The directory ${_log().default.chalk.green(folderName)} has files that might be overwritten:`);

    _log().default.newLine();

    for (const file of conflicts) {
      _log().default.nested(`  ${file}`);
    }

    if (overwrite) {
      _log().default.newLine();

      _log().default.nested(`Removing existing files from ${_log().default.chalk.green(folderName)}`);

      await Promise.all(conflicts.map(conflict => _fsExtra().default.remove(path().join(projectRoot, conflict))));
      return true;
    }

    return false;
  }

  return true;
}

function resolvePackageManager(options) {
  let packageManager = 'npm';

  if (options.yarn || !options.npm && PackageManager().shouldUseYarn()) {
    packageManager = 'yarn';
  } else {
    packageManager = 'npm';
  }

  if (options.install) {
    _log().default.addNewLineIfNone();

    (0, _log().default)(packageManager === 'yarn' ? '🧶 Using Yarn to install packages. You can pass --npm to use npm instead.' : '📦 Using npm to install packages.');

    _log().default.newLine();
  }

  return packageManager;
}

const EXPO_DEBUG = _getenv().default.boolish('EXPO_DEBUG', false);

async function installNodeDependenciesAsync(projectRoot, packageManager, flags = {
  // default to silent
  silent: !EXPO_DEBUG
}) {
  const options = {
    cwd: projectRoot,
    silent: flags.silent
  };

  if (packageManager === 'yarn') {
    const yarn = new (PackageManager().YarnPackageManager)(options);
    const version = await yarn.versionAsync();
    const nodeLinker = await yarn.getConfigAsync('nodeLinker');

    if (_semver().default.satisfies(version, '>=2.0.0-rc.24') && nodeLinker !== 'node-modules') {
      const yarnRc = path().join(projectRoot, '.yarnrc.yml');
      let yamlString = '';

      try {
        yamlString = _fsExtra().default.readFileSync(yarnRc, 'utf8');
      } catch (error) {
        if (error.code !== 'ENOENT') {
          throw error;
        }
      }

      const config = yamlString ? _jsYaml().default.safeLoad(yamlString) : {};
      config.nodeLinker = 'node-modules';
      !flags.silent && _log().default.warn(`Yarn v${version} detected, enabling experimental Yarn v2 support using the node-modules plugin.`);
      !flags.silent && (0, _log().default)(`Writing ${yarnRc}...`);

      _fsExtra().default.writeFileSync(yarnRc, _jsYaml().default.safeDump(config));
    }

    await yarn.installAsync();
  } else {
    await new (PackageManager().NpmPackageManager)(options).installAsync();
  }
}

function logNewSection(title) {
  const spinner = (0, _ora().default)(_log().default.chalk.bold(title)); // respect loading indicators

  _log().default.setSpinner(spinner);

  spinner.start();
  return spinner;
}

function getChangeDirectoryPath(projectRoot) {
  const cdPath = path().relative(process.cwd(), projectRoot);

  if (cdPath.length <= projectRoot.length) {
    return cdPath;
  }

  return projectRoot;
}

async function installCocoaPodsAsync(projectRoot) {
  _log().default.addNewLineIfNone();

  let step = logNewSection('Installing CocoaPods.');

  if (process.platform !== 'darwin') {
    step.succeed('Skipped installing CocoaPods because operating system is not on macOS.');
    return false;
  }

  const packageManager = new (PackageManager().CocoaPodsPackageManager)({
    cwd: path().join(projectRoot, 'ios'),
    log: _log().default,
    silent: !EXPO_DEBUG
  });

  if (!(await packageManager.isCLIInstalledAsync())) {
    try {
      // prompt user -- do you want to install cocoapods right now?
      step.text = 'CocoaPods CLI not found in your PATH, installing it now.';
      step.render();
      await PackageManager().CocoaPodsPackageManager.installCLIAsync({
        nonInteractive: _commander().default.nonInteractive,
        spawnOptions: packageManager.options
      });
      step.succeed('Installed CocoaPods CLI');
      step = logNewSection('Running `pod install` in the `ios` directory.');
    } catch (e) {
      step.stopAndPersist({
        symbol: '⚠️ ',
        text: _log().default.chalk.red('Unable to install the CocoaPods CLI. Continuing with project sync, you can install CocoaPods afterwards.')
      });

      if (e.message) {
        (0, _log().default)(`- ${e.message}`);
      }

      return false;
    }
  }

  try {
    await packageManager.installAsync();
    step.succeed('Installed pods and initialized Xcode workspace.');
    return true;
  } catch (e) {
    step.stopAndPersist({
      symbol: '⚠️ ',
      text: _log().default.chalk.red('Something went wrong running `pod install` in the `ios` directory. Continuing with project sync, you can debug this afterwards.')
    });

    if (e.message) {
      (0, _log().default)(`- ${e.message}`);
    }

    return false;
  }
}
//# sourceMappingURL=CreateApp.js.map