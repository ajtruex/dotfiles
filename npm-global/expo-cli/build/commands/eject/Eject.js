"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ejectAsync = ejectAsync;
exports.shouldDeleteMainField = shouldDeleteMainField;
exports.hashForDependencyMap = hashForDependencyMap;
exports.getTargetPaths = getTargetPaths;
exports.stripDashes = stripDashes;
exports.isPkgMainExpoAppEntry = isPkgMainExpoAppEntry;

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

function _crypto() {
  const data = _interopRequireDefault(require("crypto"));

  _crypto = function () {
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

function _semver() {
  const data = _interopRequireDefault(require("semver"));

  _semver = function () {
    return data;
  };

  return data;
}

function _tempy() {
  const data = _interopRequireDefault(require("tempy"));

  _tempy = function () {
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

function _log() {
  const data = _interopRequireDefault(require("../../log"));

  _log = function () {
    return data;
  };

  return data;
}

function _configureAndroidProjectAsync() {
  const data = _interopRequireDefault(require("../apply/configureAndroidProjectAsync"));

  _configureAndroidProjectAsync = function () {
    return data;
  };

  return data;
}

function _configureIOSProjectAsync() {
  const data = _interopRequireDefault(require("../apply/configureIOSProjectAsync"));

  _configureIOSProjectAsync = function () {
    return data;
  };

  return data;
}

function CreateApp() {
  const data = _interopRequireWildcard(require("../utils/CreateApp"));

  CreateApp = function () {
    return data;
  };

  return data;
}

function GitIgnore() {
  const data = _interopRequireWildcard(require("../utils/GitIgnore"));

  GitIgnore = function () {
    return data;
  };

  return data;
}

function _ProjectUtils() {
  const data = require("../utils/ProjectUtils");

  _ProjectUtils = function () {
    return data;
  };

  return data;
}

function _TerminalLink() {
  const data = require("../utils/TerminalLink");

  _TerminalLink = function () {
    return data;
  };

  return data;
}

function _logConfigWarnings() {
  const data = require("../utils/logConfigWarnings");

  _logConfigWarnings = function () {
    return data;
  };

  return data;
}

function _maybeBailOnGitStatusAsync() {
  const data = _interopRequireDefault(require("../utils/maybeBailOnGitStatusAsync"));

  _maybeBailOnGitStatusAsync = function () {
    return data;
  };

  return data;
}

function _ConfigValidation() {
  const data = require("./ConfigValidation");

  _ConfigValidation = function () {
    return data;
  };

  return data;
}

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Entry point into the eject process, delegates to other helpers to perform various steps.
 *
 * 1. Verify git is clean
 * 2. Create native projects (ios, android)
 * 3. Install node modules
 * 4. Apply config to native projects
 * 5. Install CocoaPods
 * 6. Log project info
 */
async function ejectAsync(projectRoot, options) {
  if (await (0, _maybeBailOnGitStatusAsync().default)()) return;
  const platforms = ['android']; // Skip ejecting for iOS on Windows

  if (process.platform !== 'win32') {
    platforms.push('ios');
  }

  const {
    exp,
    pkg
  } = await ensureConfigAsync(projectRoot);

  const tempDir = _tempy().default.directory();

  if (!platforms.includes('ios')) {
    _log().default.warn(`⚠️  Skipping generating the iOS native project files. Run ${_chalk().default.bold('expo eject')} again from macOS or Linux to generate the iOS project.`);

    _log().default.newLine();
  }

  const {
    hasNewProjectFiles,
    needsPodInstall
  } = await createNativeProjectsFromTemplateAsync(projectRoot, exp, pkg, tempDir, platforms); // Set this to true when we can detect that the user is running eject to sync new changes rather than ejecting to bare.
  // This will be used to prevent the node modules from being nuked every time.

  const isSyncing = !hasNewProjectFiles; // Install node modules

  const shouldInstall = (options === null || options === void 0 ? void 0 : options.install) !== false;
  const packageManager = CreateApp().resolvePackageManager({
    install: shouldInstall,
    npm: (options === null || options === void 0 ? void 0 : options.packageManager) === 'npm',
    yarn: (options === null || options === void 0 ? void 0 : options.packageManager) === 'yarn'
  });

  if (shouldInstall) {
    await installNodeDependenciesAsync(projectRoot, packageManager, {
      clean: !isSyncing
    });
  } // Apply Expo config to native projects


  if (platforms.includes('ios')) {
    await configureIOSStepAsync(projectRoot);
  }

  if (platforms.includes('android')) {
    await configureAndroidStepAsync(projectRoot);
  } // Install CocoaPods


  let podsInstalled = false; // err towards running pod install less because it's slow and users can easily run npx pod-install afterwards.

  if (platforms.includes('ios') && shouldInstall && needsPodInstall) {
    podsInstalled = await CreateApp().installCocoaPodsAsync(projectRoot);
  }

  await warnIfDependenciesRequireAdditionalSetupAsync(pkg, options);

  _log().default.newLine();

  _log().default.nested(`➡️  ${_chalk().default.bold('Next steps')}`);

  if (_config().WarningAggregator.hasWarningsIOS() || _config().WarningAggregator.hasWarningsAndroid()) {
    _log().default.nested(`- 👆 Review the logs above and look for any warnings (⚠️ ) that might need follow-up.`);
  } // Log a warning about needing to install node modules


  if ((options === null || options === void 0 ? void 0 : options.install) === false) {
    const installCmd = packageManager === 'npm' ? 'npm install' : 'yarn';

    _log().default.nested(`- ⚠️  Install node modules: ${_log().default.chalk.bold(installCmd)}`);
  }

  if (!podsInstalled) {
    _log().default.nested(`- 🍫 When CocoaPods is installed, initialize the project workspace: ${_chalk().default.bold('npx pod-install')}`);
  }

  _log().default.nested(`- 💡 You may want to run ${_chalk().default.bold('npx @react-native-community/cli doctor')} to help install any tools that your app may need to run your native projects.`);

  _log().default.nested(`- 🔑 Download your Android keystore (if you're not sure if you need to, just run the command and see): ${_chalk().default.bold('expo fetch:android:keystore')}`);

  if (exp.hasOwnProperty('assetBundlePatterns')) {
    _log().default.nested(`- 📁 The property ${_chalk().default.bold(`assetBundlePatterns`)} does not have the same effect in the bare workflow. ${_log().default.chalk.dim((0, _TerminalLink().learnMore)('https://docs.expo.io/bare/updating-your-app/#embedding-assets'))}`);
  }

  if (await (0, _ProjectUtils().usesOldExpoUpdatesAsync)(projectRoot)) {
    _log().default.nested(`- 🚀 ${((0, _terminalLink().default)('expo-updates', 'https://github.com/expo/expo/blob/master/packages/expo-updates/README.md'), {
      fallback: text => text
    })} has been configured in your project. Before you do a release build, make sure you run ${_chalk().default.bold('expo publish')}. ${_log().default.chalk.dim((0, _TerminalLink().learnMore)('https://expo.fyi/release-builds-with-expo-updates'))}`);
  }

  if (hasNewProjectFiles) {
    _log().default.newLine();

    _log().default.nested(`☑️  ${_chalk().default.bold('When you are ready to run your project')}`);

    _log().default.nested('To compile and run your project in development, execute one of the following commands:');

    if (platforms.includes('ios')) {
      _log().default.nested(`- ${_chalk().default.bold(packageManager === 'npm' ? 'npm run ios' : 'yarn ios')}`);
    }

    if (platforms.includes('android')) {
      _log().default.nested(`- ${_chalk().default.bold(packageManager === 'npm' ? 'npm run android' : 'yarn android')}`);
    }

    _log().default.nested(`- ${_chalk().default.bold(packageManager === 'npm' ? 'npm run web' : 'yarn web')}`);
  }
}

async function configureIOSStepAsync(projectRoot) {
  const applyingIOSConfigStep = CreateApp().logNewSection('iOS config syncing');
  await (0, _configureIOSProjectAsync().default)(projectRoot);

  if (_config().WarningAggregator.hasWarningsIOS()) {
    applyingIOSConfigStep.stopAndPersist({
      symbol: '⚠️ ',
      text: _chalk().default.red('iOS config synced with warnings that should be fixed:')
    });
    (0, _logConfigWarnings().logConfigWarningsIOS)();
  } else {
    applyingIOSConfigStep.succeed('iOS config synced');
  }
}
/**
 * Wraps PackageManager to install node modules and adds CLI logs.
 *
 * @param projectRoot
 */


async function installNodeDependenciesAsync(projectRoot, packageManager, {
  clean = true
}) {
  if (clean) {
    // This step can take a couple seconds, if the installation logs are enabled (with EXPO_DEBUG) then it
    // ends up looking odd to see "Installing JavaScript dependencies" for ~5 seconds before the logs start showing up.
    const cleanJsDepsStep = CreateApp().logNewSection('Cleaning JavaScript dependencies.'); // nuke the node modules
    // TODO: this is substantially slower, we should find a better alternative to ensuring the modules are installed.

    await _fsExtra().default.remove('node_modules');
    cleanJsDepsStep.succeed('Cleaned JavaScript dependencies.');
  }

  const installJsDepsStep = CreateApp().logNewSection('Installing JavaScript dependencies.');

  try {
    await CreateApp().installNodeDependenciesAsync(projectRoot, packageManager);
    installJsDepsStep.succeed('Installed JavaScript dependencies.');
  } catch (_unused) {
    installJsDepsStep.fail(_chalk().default.red(`Something went wrong installing JavaScript dependencies, check your ${packageManager} logfile or run ${_chalk().default.bold(`${packageManager} install`)} again manually.`)); // TODO: actually show the error message from the package manager! :O

    process.exit(1);
  }
}

async function configureAndroidStepAsync(projectRoot) {
  const applyingAndroidConfigStep = CreateApp().logNewSection('Android config syncing');
  await (0, _configureAndroidProjectAsync().default)(projectRoot);

  if (_config().WarningAggregator.hasWarningsAndroid()) {
    applyingAndroidConfigStep.stopAndPersist({
      symbol: '⚠️ ',
      text: _chalk().default.red('Android config synced with warnings that should be fixed:')
    });
    (0, _logConfigWarnings().logConfigWarningsAndroid)();
  } else {
    applyingAndroidConfigStep.succeed('Android config synced');
  }
}

function copyPathsFromTemplate(projectRoot, templatePath, paths) {
  const copiedPaths = [];
  const skippedPaths = [];

  for (const targetPath of paths) {
    const projectPath = _path().default.join(projectRoot, targetPath);

    if (!_fsExtra().default.existsSync(projectPath)) {
      copiedPaths.push(targetPath);

      _fsExtra().default.copySync(_path().default.join(templatePath, targetPath), projectPath);
    } else {
      skippedPaths.push(targetPath);
    }
  }

  return [copiedPaths, skippedPaths];
}

async function ensureConfigAsync(projectRoot) {
  // We need the SDK version to proceed
  let exp;
  let pkg;

  try {
    const config = (0, _config().getConfig)(projectRoot);
    exp = config.exp;
    pkg = config.pkg; // If no config exists in the file system then we should generate one so the process doesn't fail.

    if (!config.dynamicConfigPath && !config.staticConfigPath) {
      // Don't check for a custom config path because the process should fail if a custom file doesn't exist.
      // Write the generated config.
      // writeConfigJsonAsync(projectRoot, config.exp);
      await _jsonFile().default.writeAsync( // TODO: Write to app.config.json because it's easier to convert to a js config file.
      _path().default.join(projectRoot, 'app.json'), {
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
  } // Prompt for the Android package first because it's more strict than the bundle identifier
  // this means you'll have a better chance at matching the bundle identifier with the package name.


  await (0, _ConfigValidation().getOrPromptForPackage)(projectRoot);
  await (0, _ConfigValidation().getOrPromptForBundleIdentifier)(projectRoot);

  if (exp.entryPoint) {
    delete exp.entryPoint;
    (0, _log().default)(`- expo.entryPoint is not needed and has been removed.`);
  }

  return {
    exp,
    pkg
  };
}

function createFileHash(contents) {
  // this doesn't need to be secure, the shorter the better.
  return _crypto().default.createHash('sha1').update(contents).digest('hex');
}

function writeMetroConfig({
  projectRoot,
  pkg,
  tempDir
}) {
  /**
   * Add metro config, or warn if metro config already exists. The developer will need to add the
   * hashAssetFiles plugin manually.
   */
  const updatingMetroConfigStep = CreateApp().logNewSection('Adding Metro bundler configuration');

  try {
    const sourceConfigPath = _path().default.join(tempDir, 'metro.config.js');

    const targetConfigPath = _path().default.join(projectRoot, 'metro.config.js');

    const targetConfigPathExists = _fsExtra().default.existsSync(targetConfigPath);

    if (targetConfigPathExists) {
      // Prevent re-runs from throwing an error if the metro config hasn't been modified.
      const contents = createFileHash(_fsExtra().default.readFileSync(targetConfigPath, 'utf8'));
      const targetContents = createFileHash(_fsExtra().default.readFileSync(sourceConfigPath, 'utf8'));

      if (contents !== targetContents) {
        throw new Error('Existing Metro configuration found; not overwriting.');
      } else {
        // Nothing to change, hide the step and exit.
        updatingMetroConfigStep.stop();
        updatingMetroConfigStep.clear();
        return;
      }
    } else if (_fsExtra().default.existsSync(_path().default.join(projectRoot, 'metro.config.json')) || pkg.metro || _fsExtra().default.existsSync(_path().default.join(projectRoot, 'rn-cli.config.js'))) {
      throw new Error('Existing Metro configuration found; not overwriting.');
    }

    _fsExtra().default.copySync(sourceConfigPath, targetConfigPath);

    updatingMetroConfigStep.succeed('Added Metro bundler configuration.');
  } catch (e) {
    updatingMetroConfigStep.stopAndPersist({
      symbol: '⚠️ ',
      text: _chalk().default.red('Metro bundler configuration not applied:')
    });

    _log().default.nested(`- ${e.message}`);

    _log().default.nested(`- You will need to add the ${_chalk().default.bold('hashAssetFiles')} plugin to your Metro configuration. ${_log().default.chalk.dim((0, _TerminalLink().learnMore)('https://docs.expo.io/bare/installing-updates/'))}`);

    _log().default.newLine();
  }
}

async function validateBareTemplateExistsAsync(sdkVersion) {
  // Validate that the template exists
  const sdkMajorVersionNumber = _semver().default.major(sdkVersion);

  const templateSpec = (0, _npmPackageArg().default)(`expo-template-bare-minimum@sdk-${sdkMajorVersionNumber}`);

  try {
    await _pacote().default.manifest(templateSpec);
  } catch (e) {
    if (e.code === 'E404') {
      throw new Error(`Unable to eject because an eject template for SDK ${sdkMajorVersionNumber} was not found.`);
    } else {
      throw e;
    }
  }

  return templateSpec;
}

async function updatePackageJSONAsync({
  projectRoot,
  tempDir,
  pkg
}) {
  let defaultDependencies = {};
  let defaultDevDependencies = {};

  const {
    dependencies,
    devDependencies
  } = _jsonFile().default.read(_path().default.join(tempDir, 'package.json'));

  defaultDependencies = createDependenciesMap(dependencies);
  defaultDevDependencies = createDependenciesMap(devDependencies);
  /**
   * Update package.json scripts - `npm start` should default to `react-native
   * start` rather than `expo start` after ejecting, for example.
   */
  // NOTE(brentvatne): Removing spaces between steps for now, add back when
  // there is some additional context for steps

  const updatingPackageJsonStep = CreateApp().logNewSection('Updating your package.json scripts, dependencies, and main file');

  if (!pkg.scripts) {
    pkg.scripts = {};
  }

  pkg.scripts.start = 'react-native start';
  pkg.scripts.ios = 'react-native run-ios';
  pkg.scripts.android = 'react-native run-android';
  /**
   * Update package.json dependencies by combining the dependencies in the project we are ejecting
   * with the dependencies in the template project. Does the same for devDependencies.
   *
   * - The template may have some dependencies beyond react/react-native/react-native-unimodules,
   *   for example RNGH and Reanimated. We should prefer the version that is already being used
   *   in the project for those, but swap the react/react-native/react-native-unimodules versions
   *   with the ones in the template.
   * - The same applies to expo-updates -- since some native project configuration may depend on the
   *   version, we should always use the version of expo-updates in the template.
   */

  const combinedDependencies = createDependenciesMap({ ...defaultDependencies,
    ...pkg.dependencies
  });
  const requiredDependencies = ['react', 'react-native-unimodules', 'react-native', 'expo-updates'];

  for (const dependenciesKey of requiredDependencies) {
    combinedDependencies[dependenciesKey] = defaultDependencies[dependenciesKey];
  }

  const combinedDevDependencies = createDependenciesMap({ ...defaultDevDependencies,
    ...pkg.devDependencies
  }); // Only change the dependencies if the normalized hash changes, this helps to reduce meaningless changes.

  const hasNewDependencies = hashForDependencyMap(pkg.dependencies) !== hashForDependencyMap(combinedDependencies);
  const hasNewDevDependencies = hashForDependencyMap(pkg.devDependencies) !== hashForDependencyMap(combinedDevDependencies); // Save the dependencies

  if (hasNewDependencies) {
    pkg.dependencies = combinedDependencies;
  }

  if (hasNewDevDependencies) {
    pkg.devDependencies = combinedDevDependencies;
  }
  /**
   * Add new app entry points
   */


  let removedPkgMain; // Check that the pkg.main doesn't match:
  // - ./node_modules/expo/AppEntry
  // - ./node_modules/expo/AppEntry.js
  // - node_modules/expo/AppEntry.js
  // - expo/AppEntry.js
  // - expo/AppEntry

  if (shouldDeleteMainField(pkg.main)) {
    // Save the custom
    removedPkgMain = pkg.main;
    delete pkg.main;
  }

  await _fsExtra().default.writeFile(_path().default.resolve(projectRoot, 'package.json'), JSON.stringify(pkg, null, 2));
  updatingPackageJsonStep.succeed('Updated package.json and added index.js entry point for iOS and Android.');

  if (removedPkgMain) {
    (0, _log().default)(`- Removed ${_chalk().default.bold(`"main": "${removedPkgMain}"`)} from package.json because we recommend using index.js as main instead.`);

    _log().default.newLine();
  }

  return {
    hasNewDependencies,
    hasNewDevDependencies
  };
}

function shouldDeleteMainField(main) {
  if (!main || !isPkgMainExpoAppEntry(main)) {
    return false;
  }

  return !(main === null || main === void 0 ? void 0 : main.startsWith('index.'));
}

function normalizeDependencyMap(deps) {
  return Object.keys(deps).map(dependency => `${dependency}@${deps[dependency]}`).sort();
}

function hashForDependencyMap(deps) {
  const depsList = normalizeDependencyMap(deps);
  const depsString = depsList.join('\n');
  return createFileHash(depsString);
}

function getTargetPaths(pkg, platforms) {
  const targetPaths = [...platforms]; // Only create index.js if we are going to replace the app "main" entry point

  if (shouldDeleteMainField(pkg.main)) {
    targetPaths.push('index.js');
  }

  return targetPaths;
}
/**
 * Extract the template and copy the ios and android directories over to the project directory.
 *
 * @return `true` if any project files were created.
 */


async function cloneNativeDirectoriesAsync({
  projectRoot,
  tempDir,
  exp,
  pkg,
  platforms
}) {
  const templateSpec = await validateBareTemplateExistsAsync(exp.sdkVersion); // NOTE(brentvatne): Removing spaces between steps for now, add back when
  // there is some additional context for steps

  const creatingNativeProjectStep = CreateApp().logNewSection('Creating native project directories (./ios and ./android) and updating .gitignore');
  const targetPaths = getTargetPaths(pkg, platforms);
  let copiedPaths = [];
  let skippedPaths = [];

  try {
    await _xdl().Exp.extractTemplateAppAsync(templateSpec, tempDir, exp);
    [copiedPaths, skippedPaths] = copyPathsFromTemplate(projectRoot, tempDir, targetPaths);
    const results = GitIgnore().mergeGitIgnorePaths(_path().default.join(projectRoot, '.gitignore'), _path().default.join(tempDir, '.gitignore'));
    let message = `Created native project${platforms.length > 1 ? 's' : ''}`;

    if (skippedPaths.length) {
      message += _log().default.chalk.dim(` | ${skippedPaths.map(path => _log().default.chalk.bold(`/${path}`)).join(', ')} already created`);
    }

    if (!(results === null || results === void 0 ? void 0 : results.didMerge)) {
      message += _log().default.chalk.dim(` | gitignore already synced`);
    } else if (results.didMerge && results.didClear) {
      message += _log().default.chalk.dim(` | synced gitignore`);
    }

    creatingNativeProjectStep.succeed(message);
  } catch (e) {
    (0, _log().default)(_chalk().default.red(e.message));
    creatingNativeProjectStep.fail('Failed to create the native project - see the output above for more information.');
    (0, _log().default)(_chalk().default.yellow('You may want to delete the `./ios` and/or `./android` directories before running eject again.'));
    process.exit(1);
  }

  return copiedPaths;
}
/**
 *
 * @param projectRoot
 * @param tempDir
 *
 * @return `true` if the project is ejecting, and `false` if it's syncing.
 */


async function createNativeProjectsFromTemplateAsync(projectRoot, exp, pkg, tempDir, platforms) {
  const copiedPaths = await cloneNativeDirectoriesAsync({
    projectRoot,
    tempDir,
    exp,
    pkg,
    platforms
  });
  writeMetroConfig({
    projectRoot,
    pkg,
    tempDir
  });
  const depsResults = await updatePackageJSONAsync({
    projectRoot,
    tempDir,
    pkg
  });
  return {
    hasNewProjectFiles: !!copiedPaths.length,
    // If the iOS folder changes or new packages are added, we should rerun pod install.
    needsPodInstall: copiedPaths.includes('ios') || depsResults.hasNewDependencies || depsResults.hasNewDevDependencies,
    ...depsResults
  };
}
/**
 * Create an object of type DependenciesMap a dependencies object or throw if not valid.
 *
 * @param dependencies - ideally an object of type {[key]: string} - if not then this will error.
 */


function createDependenciesMap(dependencies) {
  if (typeof dependencies !== 'object') {
    throw new Error(`Dependency map is invalid, expected object but got ${typeof dependencies}`);
  }

  const outputMap = {};
  if (!dependencies) return outputMap;

  for (const key of Object.keys(dependencies)) {
    const value = dependencies[key];

    if (typeof value === 'string') {
      outputMap[key] = value;
    } else {
      throw new Error(`Dependency for key \`${key}\` should be a \`string\`, instead got: \`{ ${key}: ${JSON.stringify(value)} }\``);
    }
  }

  return outputMap;
}
/**
 * Some packages are not configured automatically on eject and may require
 * users to add some code, eg: to their AppDelegate.
 */


async function warnIfDependenciesRequireAdditionalSetupAsync(pkg, options) {
  const pkgsWithExtraSetup = {
    'expo-camera': 'https://github.com/expo/expo/tree/master/packages/expo-camera',
    'expo-image-picker': 'https://github.com/expo/expo/tree/master/packages/expo-image-picker',
    'lottie-react-native': 'https://github.com/react-native-community/lottie-react-native',
    'expo-constants': `${_chalk().default.bold('Constants.manifest')} is not available in the bare workflow. You should replace it with ${_chalk().default.bold('Updates.manifest')}. ${_log().default.chalk.dim((0, _TerminalLink().learnMore)('https://docs.expo.io/versions/latest/sdk/updates/#updatesmanifest'))}`
  };
  const packagesToWarn = Object.keys(pkg.dependencies).filter(pkgName => pkgName in pkgsWithExtraSetup);

  if (packagesToWarn.length === 0) {
    return;
  }

  _log().default.newLine();

  const warnAdditionalSetupStep = CreateApp().logNewSection('Checking if any additional setup steps are required for installed SDK packages.');
  const plural = packagesToWarn.length > 1;
  warnAdditionalSetupStep.stopAndPersist({
    symbol: '⚠️ ',
    text: _chalk().default.red(`Your app includes ${_chalk().default.bold(`${packagesToWarn.length}`)} package${plural ? 's' : ''} that require${plural ? '' : 's'} additional setup in order to run:`)
  });
  packagesToWarn.forEach(pkgName => {
    _log().default.nested(`- ${_chalk().default.bold(pkgName)}: ${pkgsWithExtraSetup[pkgName]}`);
  });
}

function stripDashes(s) {
  return s.replace(/\s|-/g, '');
}
/**
 * Returns true if the input string matches the default expo main field.
 *
 * - ./node_modules/expo/AppEntry
 * - ./node_modules/expo/AppEntry.js
 * - node_modules/expo/AppEntry.js
 * - expo/AppEntry.js
 * - expo/AppEntry
 *
 * @param input package.json main field
 */


function isPkgMainExpoAppEntry(input) {
  const main = input || '';

  if (main.startsWith('./')) {
    return main.includes('node_modules/expo/AppEntry');
  }

  return main.includes('expo/AppEntry');
}
//# sourceMappingURL=Eject.js.map