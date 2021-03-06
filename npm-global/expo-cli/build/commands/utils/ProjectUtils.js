"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findProjectRootAsync = findProjectRootAsync;
exports.usesOldExpoUpdatesAsync = usesOldExpoUpdatesAsync;
exports.validateGitStatusAsync = validateGitStatusAsync;

function _jsonFile() {
  const data = _interopRequireDefault(require("@expo/json-file"));

  _jsonFile = function () {
    return data;
  };

  return data;
}

function _spawnAsync() {
  const data = _interopRequireDefault(require("@expo/spawn-async"));

  _spawnAsync = function () {
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

function _fs() {
  const data = _interopRequireDefault(require("fs"));

  _fs = function () {
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

function _semver() {
  const data = _interopRequireDefault(require("semver"));

  _semver = function () {
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function findProjectRootAsync(base) {
  let previous = null;
  let dir = base;

  do {
    try {
      var _pkg$dependencies, _pkg$dependencies2;

      // This will throw if there is no package.json in the directory
      const pkg = await _jsonFile().default.readAsync(_path().default.join(dir, 'package.json'));
      const hasReactNativeUnimodules = (_pkg$dependencies = pkg.dependencies) === null || _pkg$dependencies === void 0 ? void 0 : _pkg$dependencies.hasOwnProperty('react-native-unimodules');
      const hasExpo = (_pkg$dependencies2 = pkg.dependencies) === null || _pkg$dependencies2 === void 0 ? void 0 : _pkg$dependencies2.hasOwnProperty('expo');
      const isManaged = hasExpo && !hasReactNativeUnimodules;
      const workflow = isManaged ? 'managed' : 'bare';
      return {
        projectRoot: dir,
        workflow
      };
    } catch (_unused) {// Expected to throw if no package.json is present
    } finally {
      previous = dir;
      dir = _path().default.dirname(dir);
    }
  } while (dir !== previous);

  throw new (_CommandError().default)('NO_PROJECT', 'No managed or bare projects found. Please make sure you are inside a project folder.');
} // If we get here and can't find expo-updates or package.json we just assume
// that we are not using the old expo-updates


async function usesOldExpoUpdatesAsync(projectRoot) {
  const pkgPath = _path().default.join(projectRoot, 'package.json');

  const pkgExists = _fs().default.existsSync(pkgPath);

  if (!pkgExists) {
    return false;
  }

  const dependencies = await _jsonFile().default.getAsync(pkgPath, 'dependencies', {});

  if (!dependencies['expo-updates']) {
    return false;
  }

  const version = dependencies['expo-updates'];

  const coercedVersion = _semver().default.coerce(version);

  if (coercedVersion && _semver().default.satisfies(coercedVersion, '~0.1.0')) {
    return true;
  }

  return false;
}

async function validateGitStatusAsync() {
  let workingTreeStatus = 'unknown';

  try {
    const result = await (0, _spawnAsync().default)('git', ['status', '--porcelain']);
    workingTreeStatus = result.stdout === '' ? 'clean' : 'dirty';
  } catch (e) {// Maybe git is not installed?
    // Maybe this project is not using git?
  }

  if (workingTreeStatus === 'clean') {
    _log().default.nested(`Your git working tree is ${_chalk().default.green('clean')}`);

    _log().default.nested('To revert the changes after this command completes, you can run the following:');

    _log().default.nested('  git clean --force && git reset --hard');

    return true;
  } else if (workingTreeStatus === 'dirty') {
    _log().default.nested(`${_chalk().default.bold('Warning!')} Your git working tree is ${_chalk().default.red('dirty')}.`);

    _log().default.nested(`It's recommended to ${_chalk().default.bold('commit all your changes before proceeding')}, so you can revert the changes made by this command if necessary.`);
  } else {
    _log().default.nested("We couldn't find a git repository in your project directory.");

    _log().default.nested("It's recommended to back up your project before proceeding.");
  }

  return false;
}
//# sourceMappingURL=ProjectUtils.js.map