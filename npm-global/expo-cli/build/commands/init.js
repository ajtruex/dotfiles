"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initGitRepoAsync = initGitRepoAsync;
exports.default = _default;

function _config() {
  const data = require("@expo/config");

  _config = function () {
    return data;
  };

  return data;
}

function _plist() {
  const data = _interopRequireDefault(require("@expo/plist"));

  _plist = function () {
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

function _padEnd() {
  const data = _interopRequireDefault(require("lodash/padEnd"));

  _padEnd = function () {
    return data;
  };

  return data;
}

function _trimStart() {
  const data = _interopRequireDefault(require("lodash/trimStart"));

  _trimStart = function () {
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

function _pacote() {
  const data = _interopRequireDefault(require("pacote"));

  _pacote = function () {
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

function _terminalLink() {
  const data = _interopRequireDefault(require("terminal-link"));

  _terminalLink = function () {
    return data;
  };

  return data;
}

function _wordwrap() {
  const data = _interopRequireDefault(require("wordwrap"));

  _wordwrap = function () {
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

function _prompt() {
  const data = _interopRequireDefault(require("../prompt"));

  _prompt = function () {
    return data;
  };

  return data;
}

function _prompts() {
  const data = _interopRequireDefault(require("../prompts"));

  _prompts = function () {
    return data;
  };

  return data;
}

function CreateApp() {
  const data = _interopRequireWildcard(require("./utils/CreateApp"));

  CreateApp = function () {
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

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const FEATURED_TEMPLATES = ['----- Managed workflow -----', {
  shortName: 'blank',
  name: 'expo-template-blank',
  description: 'a minimal app as clean as an empty canvas'
}, {
  shortName: 'blank (TypeScript)',
  name: 'expo-template-blank-typescript',
  description: 'same as blank but with TypeScript configuration'
}, {
  shortName: 'tabs (TypeScript)',
  name: 'expo-template-tabs',
  description: 'several example screens and tabs using react-navigation and TypeScript'
}, '----- Bare workflow -----', {
  shortName: 'minimal',
  name: 'expo-template-bare-minimum',
  description: 'bare and minimal, just the essentials to get you started'
}, {
  shortName: 'minimal (TypeScript)',
  name: 'expo-template-bare-typescript',
  description: 'same as minimal but with TypeScript configuration'
}];
const BARE_WORKFLOW_TEMPLATES = ['expo-template-bare-minimum', 'expo-template-bare-typescript'];
const isMacOS = process.platform === 'darwin';

function assertValidName(folderName) {
  const validation = CreateApp().validateName(folderName);

  if (typeof validation === 'string') {
    _log().default.error(`Cannot create an app named ${_chalk().default.red(`"${folderName}"`)}. ${validation}`);

    process.exit(1);
  }
}

function parseOptions(command) {
  return {
    yes: !!command.yes,
    yarn: !!command.yarn,
    npm: !!command.npm,
    install: !!command.install,
    template: command.template,
    /// XXX(ville): this is necessary because with Commander.js, when the --name
    // option is not set, `command.name` will point to `Command.prototype.name`.
    name: typeof command.name === 'string' ? command.name : undefined
  };
}

async function assertFolderEmptyAsync(projectRoot, folderName) {
  if (!(await CreateApp().assertFolderEmptyAsync({
    projectRoot,
    folderName,
    overwrite: false
  }))) {
    _log().default.newLine();

    _log().default.nested('Try using a new directory name, or moving these files.');

    _log().default.newLine();

    process.exit(1);
  }
}

async function resolveProjectRootAsync(input) {
  let name = input === null || input === void 0 ? void 0 : input.trim();

  if (!name) {
    try {
      const {
        answer
      } = await (0, _prompts().default)({
        type: 'text',
        name: 'answer',
        message: 'What would you like to name your app?',
        initial: 'my-app',
        validate: name => {
          const validation = CreateApp().validateName(_path().default.basename(_path().default.resolve(name)));

          if (typeof validation === 'string') {
            return 'Invalid project name: ' + validation;
          }

          return true;
        }
      }, {
        nonInteractiveHelp: 'Pass the project name using the first argument `expo init <name>`'
      });

      if (typeof answer === 'string') {
        name = answer.trim();
      }
    } catch (error) {
      // Handle the aborted message in a custom way.
      if (error.code !== 'ABORTED') {
        throw error;
      }
    }
  }

  if (!name) {
    _log().default.newLine();

    _log().default.nested('Please choose your app name:');

    _log().default.nested(`  ${_log().default.chalk.green(`${_commander().default.name()} init`)} ${_log().default.chalk.cyan('<app-name>')}`);

    _log().default.newLine();

    _log().default.nested(`Run ${_log().default.chalk.green(`${_commander().default.name()} init --help`)} for more info`);

    _log().default.newLine();

    process.exit(1);
  }

  const projectRoot = _path().default.resolve(name);

  const folderName = _path().default.basename(projectRoot);

  assertValidName(folderName);
  await _fsExtra().default.ensureDir(projectRoot);
  await assertFolderEmptyAsync(projectRoot, folderName);
  return projectRoot;
}

async function action(projectDir, command) {
  var _options$template;

  const options = parseOptions(command); // Resolve the name, and projectRoot

  let projectRoot;

  if (!projectDir && options.yes) {
    projectRoot = _path().default.resolve(process.cwd());

    const folderName = _path().default.basename(projectRoot);

    assertValidName(folderName);
    await assertFolderEmptyAsync(projectRoot, folderName);
  } else {
    projectRoot = await resolveProjectRootAsync(projectDir || options.name);
  }

  let resolvedTemplate = (_options$template = options.template) !== null && _options$template !== void 0 ? _options$template : null; // @ts-ignore: This guards against someone passing --template without a name after it.

  if (resolvedTemplate === true) {
    (0, _log().default)();
    (0, _log().default)('Please specify the template');
    (0, _log().default)();
    process.exit(1);
  } // Download and sync templates
  // TODO(Bacon): revisit


  if (options.yes && !resolvedTemplate) {
    resolvedTemplate = 'blank';
  }

  let templateSpec;

  if (resolvedTemplate) {
    templateSpec = (0, _npmPackageArg().default)(resolvedTemplate); // For backwards compatibility, 'blank' and 'tabs' are aliases for
    // 'expo-template-blank' and 'expo-template-tabs', respectively.

    if ((templateSpec.name === 'blank' || templateSpec.name === 'tabs' || templateSpec.name === 'bare-minimum') && templateSpec.registry) {
      templateSpec.escapedName = `expo-template-${templateSpec.name}`;
      templateSpec.name = templateSpec.escapedName;
      templateSpec.raw = templateSpec.escapedName;
    }
  } else {
    const descriptionColumn = Math.max(...FEATURED_TEMPLATES.map(t => typeof t === 'object' ? t.shortName.length : 0)) + 2;
    const {
      template
    } = await (0, _prompt().default)({
      type: 'list',
      name: 'template',
      message: 'Choose a template:',
      pageSize: 20,
      choices: FEATURED_TEMPLATES.map(template => {
        if (typeof template === 'string') {
          return _prompt().default.separator(template);
        } else {
          return {
            value: template.name,
            name: _chalk().default.bold((0, _padEnd().default)(template.shortName, descriptionColumn)) + (0, _trimStart().default)((0, _wordwrap().default)(descriptionColumn + 2, process.stdout.columns || 80)(template.description)),
            short: template.name
          };
        }
      })
    }, {
      nonInteractiveHelp: '--template: argument is required in non-interactive mode. Valid choices are: "blank", "tabs", "bare-minimum" or any custom template (name of npm package).'
    });
    templateSpec = (0, _npmPackageArg().default)(template);
  }

  const projectName = _path().default.basename(projectRoot);

  const initialConfig = {
    expo: {
      name: projectName,
      slug: projectName
    }
  };
  const templateManifest = await _pacote().default.manifest(templateSpec); // TODO: Use presence of ios/android folder instead.

  const isBare = BARE_WORKFLOW_TEMPLATES.includes(templateManifest.name);

  if (isBare) {
    initialConfig.name = projectName;
  }

  const extractTemplateStep = CreateApp().logNewSection('Downloading and extracting project files.');
  let projectPath;

  try {
    projectPath = await _xdl().Exp.extractAndPrepareTemplateAppAsync(templateSpec, projectRoot, initialConfig);
    extractTemplateStep.succeed('Downloaded and extracted project files.');
  } catch (e) {
    extractTemplateStep.fail('Something went wrong in downloading and extracting the project files.');
    throw e;
  } // Install dependencies


  const packageManager = CreateApp().resolvePackageManager(options); // TODO: not this

  const workflow = isBare ? 'bare' : 'managed';
  let podsInstalled = false;

  const needsPodsInstalled = _fsExtra().default.existsSync(_path().default.join(projectRoot, 'ios'));

  if (options.install) {
    await installNodeDependenciesAsync(projectRoot, packageManager);

    if (needsPodsInstalled) {
      podsInstalled = await CreateApp().installCocoaPodsAsync(projectRoot);
    }
  } // Configure updates (?)


  const cdPath = CreateApp().getChangeDirectoryPath(projectRoot);
  let showPublishBeforeBuildWarning;
  let didConfigureUpdatesProjectFiles = false;
  let username = null;

  if (isBare) {
    username = await _xdl().UserManager.getCurrentUsernameAsync();

    if (username) {
      try {
        await configureUpdatesProjectFilesAsync(projectPath, initialConfig, username);
        didConfigureUpdatesProjectFiles = true;
      } catch (_unused) {}
    }

    showPublishBeforeBuildWarning = await (0, _ProjectUtils().usesOldExpoUpdatesAsync)(projectPath);
  } // Log info


  _log().default.addNewLineIfNone();

  await logProjectReadyAsync({
    cdPath,
    packageManager,
    workflow,
    showPublishBeforeBuildWarning,
    didConfigureUpdatesProjectFiles,
    username
  }); // Log a warning about needing to install node modules

  if (!options.install) {
    logNodeInstallWarning(cdPath, packageManager);
  }

  if (needsPodsInstalled && !podsInstalled) {
    logCocoaPodsWarning(cdPath);
  } // Initialize Git at the end to ensure all lock files are committed.
  // for now, we will just init a git repo if they have git installed and the
  // project is not inside an existing git tree, and do it silently. we should
  // at some point check if git is installed and actually bail out if not, because
  // npm install will fail with a confusing error if so.


  try {
    // check if git is installed
    // check if inside git repo
    await initGitRepoAsync(projectPath, {
      silent: true,
      commit: true
    });
  } catch (_unused2) {// todo: check if git is installed, bail out
  }
}

async function installNodeDependenciesAsync(projectRoot, packageManager) {
  const installJsDepsStep = CreateApp().logNewSection('Installing JavaScript dependencies.');

  try {
    await CreateApp().installNodeDependenciesAsync(projectRoot, packageManager);
    installJsDepsStep.succeed('Installed JavaScript dependencies.');
  } catch (_unused3) {
    installJsDepsStep.fail(`Something went wrong installing JavaScript dependencies. Check your ${packageManager} logs. Continuing to initialize the app.`);
  }
}

async function initGitRepoAsync(root, flags = {
  silent: false,
  commit: true
}) {
  // let's see if we're in a git tree
  try {
    await (0, _spawnAsync().default)('git', ['rev-parse', '--is-inside-work-tree'], {
      cwd: root
    });
    !flags.silent && (0, _log().default)('New project is already inside of a git repo, skipping git init.');
  } catch (e) {
    if (e.errno === 'ENOENT') {
      !flags.silent && _log().default.warn('Unable to initialize git repo. `git` not in PATH.');
      return false;
    }
  } // not in git tree, so let's init


  try {
    await (0, _spawnAsync().default)('git', ['init'], {
      cwd: root
    });
    !flags.silent && (0, _log().default)('Initialized a git repository.');

    if (flags.commit) {
      await (0, _spawnAsync().default)('git', ['add', '--all'], {
        cwd: root,
        stdio: 'ignore'
      });
      await (0, _spawnAsync().default)('git', ['commit', '-m', 'Created a new Expo app'], {
        cwd: root,
        stdio: 'ignore'
      });
    }

    return true;
  } catch (e) {
    // no-op -- this is just a convenience and we don't care if it fails
    return false;
  }
} // TODO: Use in eject


function logNodeInstallWarning(cdPath, packageManager) {
  _log().default.newLine();

  _log().default.nested(`⚠️  Before running your app, make sure you have node modules installed:`);

  _log().default.nested('');

  if (cdPath) {
    // In the case of --yes the project can be created in place so there would be no need to change directories.
    _log().default.nested(`  cd ${cdPath}/`);
  }

  _log().default.nested(`  ${packageManager === 'npm' ? 'npm install' : 'yarn'}`);

  _log().default.nested('');
} // TODO: Use in eject


function logCocoaPodsWarning(cdPath) {
  if (process.platform !== 'darwin') {
    return;
  }

  _log().default.newLine();

  _log().default.nested(`⚠️  Before running your app on iOS, make sure you have CocoaPods installed and initialize the project:`);

  _log().default.nested('');

  if (cdPath) {
    // In the case of --yes the project can be created in place so there would be no need to change directories.
    _log().default.nested(`  cd ${cdPath}/`);
  }

  _log().default.nested(`  npx pod-install`);

  _log().default.nested('');
} // TODO: Use in eject


function logProjectReadyAsync({
  cdPath,
  packageManager,
  workflow,
  showPublishBeforeBuildWarning,
  didConfigureUpdatesProjectFiles,
  username
}) {
  _log().default.nested(_chalk().default.bold(`✅ Your project is ready!`));

  _log().default.newLine(); // empty string if project was created in current directory


  if (cdPath) {
    _log().default.nested(`To run your project, navigate to the directory and run one of the following ${packageManager} commands.`);

    _log().default.newLine();

    _log().default.nested(`- ${_chalk().default.bold('cd ' + cdPath)}`);
  } else {
    _log().default.nested(`To run your project, run one of the following ${packageManager} commands.`);

    _log().default.newLine();
  }

  if (workflow === 'managed') {
    _log().default.nested(`- ${_chalk().default.bold(`${packageManager} start`)} ${_chalk().default.dim(`# you can open iOS, Android, or web from here, or run them directly with the commands below.`)}`);
  }

  _log().default.nested(`- ${_chalk().default.bold(packageManager === 'npm' ? 'npm run android' : 'yarn android')}`);

  let macOSComment = '';

  if (!isMacOS && workflow === 'bare') {
    macOSComment = ' # you need to use macOS to build the iOS project - use managed workflow if you need to do iOS development without a Mac';
  } else if (!isMacOS && workflow === 'managed') {
    macOSComment = ' # requires an iOS device or macOS for access to an iOS simulator';
  }

  _log().default.nested(`- ${_chalk().default.bold(packageManager === 'npm' ? 'npm run ios' : 'yarn ios')}${macOSComment}`);

  _log().default.nested(`- ${_chalk().default.bold(packageManager === 'npm' ? 'npm run web' : 'yarn web')}`);

  if (workflow === 'bare') {
    _log().default.newLine();

    _log().default.nested(`💡 You can also open up the projects in the ${_chalk().default.bold('ios')} and ${_chalk().default.bold('android')} directories with their respective IDEs.`);

    if (showPublishBeforeBuildWarning) {
      _log().default.nested(`🚀 ${(0, _terminalLink().default)('expo-updates', 'https://github.com/expo/expo/blob/master/packages/expo-updates/README.md')} has been configured in your project. Before you do a release build, make sure you run ${_chalk().default.bold('expo publish')}. ${(0, _terminalLink().default)('Learn more.', 'https://expo.fyi/release-builds-with-expo-updates')}`);
    } else if (didConfigureUpdatesProjectFiles) {
      _log().default.nested(`🚀 ${(0, _terminalLink().default)('expo-updates', 'https://github.com/expo/expo/blob/master/packages/expo-updates/README.md')} has been configured in your project. If you publish this project under a different user account than ${_chalk().default.bold(username)}, you'll need to update the configuration in Expo.plist and AndroidManifest.xml before making a release build.`);
    } else {
      _log().default.nested(`🚀 ${(0, _terminalLink().default)('expo-updates', 'https://github.com/expo/expo/blob/master/packages/expo-updates/README.md')} has been installed in your project. Before you do a release build, you'll need to configure a few values in Expo.plist and AndroidManifest.xml in order for updates to work.`);
    } // TODO: add equivalent of this or some command to wrap it:
    // # ios
    // $ open -a Xcode ./ios/{PROJECT_NAME}.xcworkspace
    // # android
    // $ open -a /Applications/Android\\ Studio.app ./android

  }
}

async function configureUpdatesProjectFilesAsync(projectRoot, initialConfig, username) {
  // skipSDKVersionRequirement here so that this will work when you use the
  // --no-install flag. the tradeoff is that the SDK version field won't be
  // filled in, but we should be getting rid of that for expo-updates ASAP
  // anyways.
  const {
    exp
  } = (0, _config().getConfig)(projectRoot, {
    skipSDKVersionRequirement: true
  }); // apply Android config

  const androidManifestPath = await _config().AndroidConfig.Paths.getAndroidManifestAsync(projectRoot);
  const androidManifestJSON = await _config().AndroidConfig.Manifest.readAndroidManifestAsync(androidManifestPath);
  const result = await _config().AndroidConfig.Updates.setUpdatesConfig(exp, androidManifestJSON, username);
  await _config().AndroidConfig.Manifest.writeAndroidManifestAsync(androidManifestPath, result); // apply iOS config

  const iosSourceRoot = _config().IOSConfig.getSourceRoot(projectRoot);

  const supportingDirectory = _path().default.join(iosSourceRoot, 'Supporting');

  const plistFilePath = _path().default.join(supportingDirectory, 'Expo.plist');

  let data = _plist().default.parse(_fsExtra().default.readFileSync(plistFilePath, 'utf8'));

  data = _config().IOSConfig.Updates.setUpdatesConfig(exp, data, username);
  await _fsExtra().default.writeFile(plistFilePath, _plist().default.build(data));
}

function _default(program) {
  program.command('init [path]').alias('i').helpGroup('core').description('Create a new Expo project').option('-t, --template [name]', 'Specify which template to use. Valid options are "blank", "tabs", "bare-minimum" or a package on npm (e.g. "expo-template-bare-typescript") that includes an Expo project template.').option('--npm', 'Use npm to install dependencies. (default when Yarn is not installed)').option('--yarn', 'Use Yarn to install dependencies. (default when Yarn is installed)').option('--no-install', 'Skip installing npm packages or CocoaPods.').option('--name [name]', 'The name of your app visible on the home screen.').option('--yes', 'Use default options. Same as "expo init . --template blank').asyncAction(action);
}
//# sourceMappingURL=init.js.map