"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensureGitRepoExistsAsync = ensureGitRepoExistsAsync;
exports.ensureGitStatusIsCleanAsync = ensureGitStatusIsCleanAsync;
exports.makeProjectTarballAsync = makeProjectTarballAsync;
exports.reviewAndCommitChangesAsync = reviewAndCommitChangesAsync;
exports.modifyAndCommitAsync = modifyAndCommitAsync;
exports.DirtyGitTreeError = void 0;

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

function _commandExists() {
  const data = _interopRequireDefault(require("command-exists"));

  _commandExists = function () {
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

function _CommandError() {
  const data = _interopRequireDefault(require("../../../CommandError"));

  _CommandError = function () {
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

function _prompts() {
  const data = _interopRequireWildcard(require("../../../prompts"));

  _prompts = function () {
    return data;
  };

  return data;
}

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function ensureGitRepoExistsAsync() {
  try {
    await (0, _commandExists().default)('git');
  } catch (err) {
    throw new Error('git command has not been found, install it before proceeding');
  }

  if (await (0, _git().gitDoesRepoExistAsync)()) {
    return;
  }

  (0, _log().default)(_log().default.chalk.yellow("It looks like you haven't initialized the git repository yet."));
  (0, _log().default)(_log().default.chalk.yellow('EAS Build requires you to use a git repository for your project.'));
  const confirmInit = await (0, _prompts().confirmAsync)({
    message: `Would you like to run 'git init' in the current directory?`
  });

  if (!confirmInit) {
    throw new Error('A git repository is required for building your project. Initialize it and run this command again.');
  }

  await (0, _spawnAsync().default)('git', ['init']);
  (0, _log().default)("We're going to make an initial commit for you repository.");
  const {
    message
  } = await (0, _prompts().default)({
    type: 'text',
    name: 'message',
    message: 'Commit message:',
    initial: 'Initial commit',
    validate: input => input !== ''
  });
  await (0, _spawnAsync().default)('git', ['add', '-A']);
  await (0, _spawnAsync().default)('git', ['commit', '-m', message]);
}

async function ensureGitStatusIsCleanAsync() {
  const changes = await (0, _git().gitStatusAsync)();

  if (changes.length > 0) {
    throw new DirtyGitTreeError('Please commit all changes before building your project. Aborting...');
  }
}

class DirtyGitTreeError extends Error {}

exports.DirtyGitTreeError = DirtyGitTreeError;

async function makeProjectTarballAsync(tarPath) {
  const spinner = (0, _ora().default)('Making project tarball').start();
  await (0, _spawnAsync().default)('git', ['archive', '--format=tar.gz', '--prefix', 'project/', '-o', tarPath, 'HEAD'], {
    cwd: await (0, _git().gitRootDirectory)()
  });
  spinner.succeed('Project tarball created.');
  const {
    size
  } = await _fsExtra().default.stat(tarPath);
  return size;
}

async function reviewAndCommitChangesAsync(commitMessage, {
  nonInteractive
}) {
  if (nonInteractive) {
    throw new (_CommandError().default)('Cannot commit changes when --non-interactive is specified. Run the command in interactive mode to review and commit changes.');
  }

  (0, _log().default)('Please review the following changes and pass the message to make the commit.');

  _log().default.newLine();

  await (0, _git().gitDiffAsync)();

  _log().default.newLine();

  const confirm = await (0, _prompts().confirmAsync)({
    message: 'Can we commit these changes for you?'
  });

  if (!confirm) {
    throw new Error('Aborting commit. Please review and commit the changes manually.');
  }

  const {
    message
  } = await (0, _prompts().default)({
    type: 'text',
    name: 'message',
    message: 'Commit message:',
    initial: commitMessage,
    validate: input => input !== ''
  }); // Add changed files only

  await (0, _spawnAsync().default)('git', ['add', '-u']);
  await (0, _spawnAsync().default)('git', ['commit', '-m', message]);
}

async function modifyAndCommitAsync(callback, {
  startMessage,
  successMessage,
  commitMessage,
  commitSuccessMessage,
  nonInteractive
}) {
  const spinner = (0, _ora().default)(startMessage);

  try {
    await callback();
    await ensureGitStatusIsCleanAsync();
    spinner.succeed();
  } catch (err) {
    if (err instanceof DirtyGitTreeError) {
      spinner.succeed(successMessage);

      _log().default.newLine();

      try {
        await reviewAndCommitChangesAsync(commitMessage, {
          nonInteractive
        });
        (0, _log().default)(`${_chalk().default.green(_figures().default.tick)} ${commitSuccessMessage}.`);
      } catch (e) {
        throw new Error("Aborting, run the command again once you're ready. Make sure to commit any changes you've made.");
      }
    } else {
      spinner.fail();
      throw err;
    }
  }
}
//# sourceMappingURL=git.js.map