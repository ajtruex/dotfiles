"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.action = action;
exports.default = _default;

function ConfigUtils() {
  const data = _interopRequireWildcard(require("@expo/config"));

  ConfigUtils = function () {
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

function _fsExtra() {
  const data = _interopRequireDefault(require("fs-extra"));

  _fsExtra = function () {
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

function _prompts() {
  const data = _interopRequireDefault(require("prompts"));

  _prompts = function () {
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

async function maybeWarnToCommitAsync(projectRoot) {
  let workingTreeStatus = 'unknown';

  try {
    const result = await (0, _spawnAsync().default)('git', ['status', '--porcelain']);
    workingTreeStatus = result.stdout === '' ? 'clean' : 'dirty';
  } catch (e) {// Maybe git is not installed?
    // Maybe this project is not using git?
  }

  if (workingTreeStatus === 'dirty') {
    (0, _log().default)(_chalk().default.yellow('You should commit your changes before generating code into the root of your project.'));
  }
}

const dependencyMap = {
  'babel.config.js': ['babel-preset-expo'],
  'webpack.config.js': ['@expo/webpack-config']
};

async function generateFilesAsync({
  projectDir,
  staticPath,
  options,
  answer,
  templateFolder
}) {
  const promises = [];

  for (const file of answer) {
    if (Object.keys(dependencyMap).includes(file)) {
      const projectFilePath = _path().default.resolve(projectDir, file); // copy the file from template


      promises.push(_fsExtra().default.copy(require.resolve(_path().default.join('@expo/webpack-config/template', file)), projectFilePath, {
        overwrite: true,
        recursive: true
      }));

      if (file in dependencyMap) {
        const packageManager = PackageManager().createForProject(projectDir, {
          log: _log().default
        });

        for (const dependency of dependencyMap[file]) {
          promises.push(packageManager.addDevAsync(dependency));
        }
      }
    } else {
      const fileName = _path().default.basename(file);

      const src = _path().default.resolve(templateFolder, fileName);

      const dest = _path().default.resolve(projectDir, staticPath, fileName);

      if (await _fsExtra().default.pathExists(src)) {
        promises.push(_fsExtra().default.copy(src, dest, {
          overwrite: true,
          recursive: true
        }));
      } else {
        throw new Error(`Expected template file for ${fileName} doesn't exist at path: ${src}`);
      }
    }
  }

  await Promise.all(promises);
}

async function action(projectDir = './', options = {
  force: false
}) {
  // Get the static path (defaults to 'web/')
  // Doesn't matter if expo is installed or which mode is used.
  const {
    exp
  } = ConfigUtils().getConfig(projectDir, {
    skipSDKVersionRequirement: true
  });

  const templateFolder = _path().default.dirname(require.resolve('@expo/webpack-config/web-default/index.html'));

  const files = (await _fsExtra().default.readdir(templateFolder)).filter(item => item !== 'icon.png');
  const {
    web: {
      staticPath = 'web'
    } = {}
  } = exp;
  const allFiles = [...Object.keys(dependencyMap), ...files.map(file => _path().default.join(staticPath, file))];
  const values = [];

  for (const file of allFiles) {
    const localProjectFile = _path().default.resolve(projectDir, file);

    const exists = _fsExtra().default.existsSync(localProjectFile);

    values.push({
      title: file,
      value: file,
      // @ts-ignore: broken types
      disabled: !options.force && exists,
      description: options.force && exists ? _chalk().default.red('This will overwrite the existing file') : ''
    });
  }

  if (!values.filter(({
    disabled
  }) => !disabled).length) {
    (0, _log().default)(_chalk().default.yellow('\nAll of the custom web files already exist.') + '\nTo regenerate the files run:' + _chalk().default.bold(' expo customize:web --force\n'));
    return;
  }

  await maybeWarnToCommitAsync(projectDir);
  const {
    answer
  } = await (0, _prompts().default)({
    type: 'multiselect',
    name: 'answer',
    message: 'Which files would you like to generate?',
    hint: '- Space to select. Return to submit',
    // @ts-ignore: broken types
    warn: 'File exists, use --force to overwrite it.',
    limit: values.length,
    instructions: '',
    choices: values
  });

  if (!answer) {
    (0, _log().default)('\n\u203A Exiting...\n');
    return;
  }

  await generateFilesAsync({
    projectDir,
    staticPath,
    options,
    answer,
    templateFolder
  });
}

function _default(program) {
  program.command('customize:web [path]').description('Eject the default web files for customization').helpGroup('eject').option('-f, --force', 'Allows replacing existing files').allowOffline().asyncAction(action);
}
//# sourceMappingURL=customize.js.map