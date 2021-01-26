"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.maybeFormatSdkVersion = maybeFormatSdkVersion;
exports.getUpdatedDependenciesAsync = getUpdatedDependenciesAsync;
exports.getDependenciesFromBundledNativeModules = getDependenciesFromBundledNativeModules;
exports.upgradeAsync = upgradeAsync;
exports.default = _default;

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

function _getenv() {
  const data = _interopRequireDefault(require("getenv"));

  _getenv = function () {
    return data;
  };

  return data;
}

function _difference() {
  const data = _interopRequireDefault(require("lodash/difference"));

  _difference = function () {
    return data;
  };

  return data;
}

function _pickBy() {
  const data = _interopRequireDefault(require("lodash/pickBy"));

  _pickBy = function () {
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

function _semver() {
  const data = _interopRequireDefault(require("semver"));

  _semver = function () {
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
  const data = _interopRequireDefault(require("../log"));

  _log = function () {
    return data;
  };

  return data;
}

function _prompts() {
  const data = require("../prompts");

  _prompts = function () {
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

function _maybeBailOnGitStatusAsync() {
  const data = _interopRequireDefault(require("./utils/maybeBailOnGitStatusAsync"));

  _maybeBailOnGitStatusAsync = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function logNewSection(title) {
  const spinner = (0, _ora().default)(_chalk().default.bold(title));
  spinner.start();
  return spinner;
}

function maybeFormatSdkVersion(sdkVersionString) {
  if (typeof sdkVersionString !== 'string' || sdkVersionString === 'UNVERSIONED') {
    return sdkVersionString;
  } // semver.valid type doesn't accept null, so need to ensure we pass a string


  return _semver().default.valid(_semver().default.coerce(sdkVersionString) || '');
}
/**
 * Read the version of an installed package from package.json in node_modules
 * This is preferable to reading it from the project package.json because we get
 * the exact installed version and not a range.
 */


async function getExactInstalledModuleVersionAsync(moduleName, projectRoot, options) {
  try {
    const pkg = await _jsonFile().default.readAsync(ConfigUtils().resolveModule(`${moduleName}/package.json`, projectRoot, {
      nodeModulesPath: options === null || options === void 0 ? void 0 : options.nodeModulesPath
    }));
    return pkg.version;
  } catch (e) {
    return null;
  }
}
/**
 * Produce a list of dependencies used by the project that need to be updated
 */


async function getUpdatedDependenciesAsync(projectRoot, workflow, targetSdkVersion) {
  // Get the updated version for any bundled modules
  const {
    exp,
    pkg
  } = ConfigUtils().getConfig(projectRoot);
  const bundledNativeModules = await _jsonFile().default.readAsync(ConfigUtils().resolveModule('expo/bundledNativeModules.json', projectRoot, exp)); // Smoosh regular and dev dependencies together for now

  const projectDependencies = { ...pkg.dependencies,
    ...pkg.devDependencies
  };
  return getDependenciesFromBundledNativeModules({
    projectDependencies,
    bundledNativeModules,
    sdkVersion: exp.sdkVersion,
    workflow,
    targetSdkVersion
  });
}

function getDependenciesFromBundledNativeModules({
  projectDependencies,
  bundledNativeModules,
  sdkVersion,
  workflow,
  targetSdkVersion
}) {
  const result = {};
  Object.keys(bundledNativeModules).forEach(name => {
    if (projectDependencies[name]) {
      result[name] = bundledNativeModules[name];
    }
  }); // If sdkVersion is known and jest-expo is used, then upgrade to the current sdk version
  // jest-expo is versioned with expo because jest-expo mocks out the native SDKs used it expo.

  if (sdkVersion && projectDependencies['jest-expo']) {
    result['jest-expo'] = `^${sdkVersion}`;
  }

  if (!targetSdkVersion) {
    _log().default.warn(`Supported react, react-native, and react-dom versions are unknown because we don't have version information for the target SDK, please update them manually.`);

    return result;
  } // Get the supported react/react-native/react-dom versions and other related packages


  if (workflow === 'managed' || projectDependencies['expokit']) {
    result['react-native'] = `https://github.com/expo/react-native/archive/${targetSdkVersion.expoReactNativeTag}.tar.gz`;
  } else {
    result['react-native'] = targetSdkVersion.facebookReactNativeVersion;
  } // React version apparently is optional in SDK version data


  if (targetSdkVersion.facebookReactVersion) {
    result['react'] = targetSdkVersion.facebookReactVersion; // react-dom version is always the same as the react version

    if (projectDependencies['react-dom']) {
      result['react-dom'] = targetSdkVersion.facebookReactVersion;
    }
  } // Update any related packages


  if (targetSdkVersion.relatedPackages) {
    Object.keys(targetSdkVersion.relatedPackages).forEach(name => {
      if (projectDependencies[name]) {
        result[name] = targetSdkVersion.relatedPackages[name];
      }
    });
  }

  return result;
}

async function makeBreakingChangesToConfigAsync(projectRoot, targetSdkVersionString) {
  var _rootConfig$expo, _rootConfig$expo$andr, _currentExp$androidNa;

  const step = logNewSection('Updating your app.json to account for breaking changes (if applicable)...');
  const {
    exp: currentExp,
    dynamicConfigPath
  } = ConfigUtils().getConfig(projectRoot, {
    skipSDKVersionRequirement: true
  }); // Bail out early if we have a dynamic config!

  if (dynamicConfigPath) {
    // IMPORTANT: this must be updated whenever you apply a new breaking change!
    if (targetSdkVersionString === '37.0.0') {
      step.succeed(`Only static configuration files can be updated, please update ${dynamicConfigPath} manually according to the release notes.`);
    } else {
      step.succeed('No additional changes necessary to app config.');
    }

    return;
  }

  const {
    rootConfig
  } = await ConfigUtils().readConfigJsonAsync(projectRoot);

  try {
    switch (targetSdkVersionString) {
      // IMPORTANT: adding a new case here? be sure to update the dynamic config situation above
      case '37.0.0':
        if ((rootConfig === null || rootConfig === void 0 ? void 0 : (_rootConfig$expo = rootConfig.expo) === null || _rootConfig$expo === void 0 ? void 0 : (_rootConfig$expo$andr = _rootConfig$expo.androidNavigationBar) === null || _rootConfig$expo$andr === void 0 ? void 0 : _rootConfig$expo$andr.visible) !== undefined) {
          var _rootConfig$expo$andr2, _rootConfig$expo$andr3;

          // @ts-ignore: boolean | enum not supported in JSON schemas
          if ((rootConfig === null || rootConfig === void 0 ? void 0 : (_rootConfig$expo$andr2 = rootConfig.expo.androidNavigationBar) === null || _rootConfig$expo$andr2 === void 0 ? void 0 : _rootConfig$expo$andr2.visible) === false) {
            step.succeed(`Updated "androidNavigationBar.visible" property in app.json to "leanback"...`);
            rootConfig.expo.androidNavigationBar.visible = 'leanback'; // @ts-ignore: boolean | enum not supported in JSON schemas
          } else if ((rootConfig === null || rootConfig === void 0 ? void 0 : (_rootConfig$expo$andr3 = rootConfig.expo.androidNavigationBar) === null || _rootConfig$expo$andr3 === void 0 ? void 0 : _rootConfig$expo$andr3.visible) === true) {
            var _rootConfig$expo$andr4;

            step.succeed(`Removed extraneous "androidNavigationBar.visible" property in app.json...`);
            rootConfig === null || rootConfig === void 0 ? true : (_rootConfig$expo$andr4 = rootConfig.expo.androidNavigationBar) === null || _rootConfig$expo$andr4 === void 0 ? true : delete _rootConfig$expo$andr4.visible;
          } else {
            // They had some invalid property for androidNavigationBar already...
            step.succeed('No additional changes necessary to app.json config.');
            return;
          }

          await ConfigUtils().writeConfigJsonAsync(projectRoot, rootConfig.expo);
        } else if ((currentExp === null || currentExp === void 0 ? void 0 : (_currentExp$androidNa = currentExp.androidNavigationBar) === null || _currentExp$androidNa === void 0 ? void 0 : _currentExp$androidNa.visible) !== undefined) {
          step.stopAndPersist({
            symbol: '⚠️ ',
            text: _chalk().default.red(`Please manually update "androidNavigationBar.visible" according to ${(0, _terminalLink().default)('this documentation', 'https://docs.expo.io/versions/latest/config/app/#androidnavigationbar')}`)
          });
        } else {
          step.succeed('No additional changes necessary to app.json config.');
        }

        break;

      default:
        step.succeed('No additional changes necessary to app.json config.');
    }
  } catch (e) {
    step.fail(`Something went wrong when attempting to update app.json configuration: ${e.message}`);
  }
}

async function maybeBailOnUnsafeFunctionalityAsync(exp) {
  // Give people a chance to bail out if they're updating from a super old version because YMMV
  if (!_xdl().Versions.gteSdkVersion(exp, '33.0.0')) {
    if (_commander().default.nonInteractive) {
      _log().default.warn(`This command works best on SDK 33 and higher. Because the command is running in nonInteractive mode it'll continue regardless.`);

      return true;
    }

    const answer = await (0, _prompts().confirmAsync)({
      message: `This command works best on SDK 33 and higher. We can try updating for you, but you will likely need to follow up with the instructions from https://docs.expo.io/workflow/upgrading-expo-sdk-walkthrough/. Continue anyways?`
    });

    if (!answer) {
      return true;
    }

    _log().default.newLine();
  }

  return false;
}

async function stopExpoServerAsync(projectRoot) {
  // Can't upgrade if Expo is running
  const status = await _xdl().Project.currentStatus(projectRoot);

  if (status === 'running') {
    await _xdl().Project.stopAsync(projectRoot);
    (0, _log().default)(_chalk().default.bold.underline('We found an existing expo-cli instance running for this project and closed it to continue.'));

    _log().default.addNewLineIfNone();
  }
}

async function shouldBailWhenUsingLatest(currentSdkVersionString, targetSdkVersionString) {
  // Maybe bail out early if people are trying to update to the current version
  if (targetSdkVersionString === currentSdkVersionString) {
    if (_commander().default.nonInteractive) {
      _log().default.warn(`You are already using the latest SDK version but the command will continue because nonInteractive is enabled.`);

      _log().default.newLine();

      return false;
    }

    const answer = await (0, _prompts().confirmAsync)({
      message: `You are already using the latest SDK version. Do you want to run the update anyways? This may be useful to ensure that all of your packages are set to the correct version.`
    });

    if (!answer) {
      (0, _log().default)('Follow the Expo blog at https://blog.expo.io for new release information!');

      _log().default.newLine();

      return true;
    }

    _log().default.newLine();
  }

  return false;
}

async function shouldUpgradeSimulatorAsync() {
  // Check if we can, and probably should, upgrade the (ios) simulator
  if (!_xdl().Simulator.isPlatformSupported()) {
    return false;
  }

  if (_commander().default.nonInteractive) {
    _log().default.warn(`Skipping attempt to upgrade the client app on iOS simulator.`);

    return false;
  }

  let answer = false;

  try {
    answer = await (0, _prompts().confirmAsync)({
      message: 'Would you like to upgrade the Expo app in the iOS simulator?',
      initial: false
    });
  } catch (_unused) {}

  _log().default.newLine();

  return answer;
}

async function maybeUpgradeSimulatorAsync() {
  // Check if we can, and probably should, upgrade the (ios) simulator
  if (await shouldUpgradeSimulatorAsync()) {
    const result = await _xdl().Simulator.upgradeExpoAsync();

    if (!result) {
      _log().default.error("The upgrade of your simulator didn't go as planned. You might have to reinstall it manually with expo client:install:ios.");
    }
  }
}

async function shouldUpgradeEmulatorAsync() {
  // Check if we can, and probably should, upgrade the android client
  if (!_xdl().Android.isPlatformSupported()) {
    return false;
  }

  if (_commander().default.nonInteractive) {
    _log().default.warn(`Skipping attempt to upgrade the Expo app on the Android emulator.`);

    return false;
  }

  let answer = false;

  try {
    answer = await (0, _prompts().confirmAsync)({
      message: 'Would you like to upgrade the Expo app in the Android emulator?',
      initial: false
    });
  } catch (_unused2) {}

  _log().default.newLine();

  return answer;
}

async function maybeUpgradeEmulatorAsync() {
  // Check if we can, and probably should, upgrade the android client
  if (await shouldUpgradeEmulatorAsync()) {
    const result = await _xdl().Android.upgradeExpoAsync();

    if (!result) {
      _log().default.error("The upgrade of your Android client didn't go as planned. You might have to reinstall it manually with expo client:install:android.");
    }

    _log().default.newLine();
  }
}

async function promptSelectSDKVersionAsync(sdkVersions, exp) {
  const sdkVersionStringOptions = sdkVersions.filter(v => _semver().default.lte('33.0.0', v) && !_xdl().Versions.gteSdkVersion(exp, v));
  return await (0, _prompts().selectAsync)({
    message: 'Choose a SDK version to upgrade to:',
    limit: 20,
    choices: sdkVersionStringOptions.map(sdkVersionString => ({
      value: sdkVersionString,
      title: _chalk().default.bold(sdkVersionString)
    }))
  });
}

async function upgradeAsync({
  requestedSdkVersion,
  projectRoot,
  workflow
}, options) {
  const {
    exp,
    pkg
  } = await ConfigUtils().getConfig(projectRoot);
  if (await (0, _maybeBailOnGitStatusAsync().default)()) return;
  if (await maybeBailOnUnsafeFunctionalityAsync(exp)) return;
  await stopExpoServerAsync(projectRoot);
  const currentSdkVersionString = exp.sdkVersion;
  const sdkVersions = await _xdl().Versions.releasedSdkVersionsAsync();
  const latestSdkVersion = await _xdl().Versions.newestReleasedSdkVersionAsync();
  const latestSdkVersionString = latestSdkVersion.version;
  let targetSdkVersionString = maybeFormatSdkVersion(requestedSdkVersion) || latestSdkVersion.version;
  let targetSdkVersion = sdkVersions[targetSdkVersionString];
  const previousReactNativeVersion = await getExactInstalledModuleVersionAsync('react-native', projectRoot, exp); // Maybe bail out early if people are trying to update to the current version

  if (await shouldBailWhenUsingLatest(currentSdkVersionString, targetSdkVersionString)) return;
  const platforms = exp.platforms || [];

  if (targetSdkVersionString === latestSdkVersionString && currentSdkVersionString !== targetSdkVersionString && !_commander().default.nonInteractive) {
    const answer = await (0, _prompts().confirmAsync)({
      message: `You are currently using SDK ${currentSdkVersionString}. Would you like to update to the latest version, ${latestSdkVersion.version}?`
    });

    _log().default.newLine();

    if (!answer) {
      const selectedSdkVersionString = await promptSelectSDKVersionAsync(Object.keys(sdkVersions), exp); // This has to exist because it's based on keys already present in sdkVersions

      targetSdkVersion = sdkVersions[selectedSdkVersionString];
      targetSdkVersionString = selectedSdkVersionString;

      _log().default.newLine();
    } // Check if we can, and probably should, upgrade the (ios) simulator


    if (platforms.includes('ios')) {
      await maybeUpgradeSimulatorAsync();
    } // Check if we can, and probably should, upgrade the android client


    if (platforms.includes('android')) {
      await maybeUpgradeEmulatorAsync();
    }
  } else if (!targetSdkVersion) {
    if (_commander().default.nonInteractive) {
      _log().default.warn(`You provided the target SDK version value of ${targetSdkVersionString} which does not seem to exist. Upgrading anyways because the command is running in nonInteractive mode.`);
    } else {
      // If they provide an apparently unsupported sdk version then let people try
      // anyways, maybe we want to use this for testing alpha versions or
      // something...
      const answer = await (0, _prompts().confirmAsync)({
        message: `You provided the target SDK version value of ${targetSdkVersionString} which does not seem to exist. But hey, I'm just a program, what do I know. Do you want to try to upgrade to it anyways?`
      });

      if (!answer) {
        return;
      }
    }
  }

  const packageManager = PackageManager().createForProject(projectRoot, {
    npm: options.npm,
    yarn: options.yarn,
    log: _log().default,
    silent: !_getenv().default.boolish('EXPO_DEBUG', false)
  });

  _log().default.addNewLineIfNone();

  const expoPackageToInstall = `expo@^${targetSdkVersionString}`; // Skip installing the Expo package again if it's already installed. @satya164
  // wanted this in order to work around an issue with yarn workspaces on
  // react-navigation.

  if (targetSdkVersionString !== currentSdkVersionString) {
    const installingPackageStep = logNewSection(`Installing the ${expoPackageToInstall} package...`);

    _log().default.addNewLineIfNone();

    try {
      await packageManager.addAsync(expoPackageToInstall);
    } catch (e) {
      installingPackageStep.fail(`Failed to install expo package with error: ${e.message}`);
      throw e;
    }

    installingPackageStep.succeed(`Installed ${expoPackageToInstall}`);
  } // Evaluate project config (app.config.js)


  const {
    exp: currentExp,
    dynamicConfigPath
  } = ConfigUtils().getConfig(projectRoot);
  const removingSdkVersionStep = logNewSection('Validating configuration.');

  if (dynamicConfigPath) {
    if (!_xdl().Versions.gteSdkVersion(currentExp, targetSdkVersionString) && currentExp.sdkVersion !== 'UNVERSIONED') {
      _log().default.addNewLineIfNone();

      removingSdkVersionStep.warn('Please manually delete the sdkVersion field in your project app.config file. It is now automatically determined based on the expo package version in your package.json.');
    } else {
      removingSdkVersionStep.succeed('Validated configuration.');
    }
  } else {
    try {
      const {
        rootConfig
      } = await ConfigUtils().readConfigJsonAsync(projectRoot);

      if (rootConfig.expo.sdkVersion && rootConfig.expo.sdkVersion !== 'UNVERSIONED') {
        _log().default.addNewLineIfNone();

        await ConfigUtils().writeConfigJsonAsync(projectRoot, {
          sdkVersion: undefined
        });
        removingSdkVersionStep.succeed('Removed deprecated sdkVersion field from app.json.');
      } else {
        removingSdkVersionStep.succeed('Validated configuration.');
      }
    } catch (_) {
      removingSdkVersionStep.fail('Unable to validate configuration.');
    }
  }

  await makeBreakingChangesToConfigAsync(projectRoot, targetSdkVersionString);
  const updatingPackagesStep = logNewSection('Updating packages to compatible versions (where known).');

  _log().default.addNewLineIfNone(); // Get all updated packages


  const updates = await getUpdatedDependenciesAsync(projectRoot, workflow, targetSdkVersion); // Split updated packages by dependencies and devDependencies

  const devDependencies = (0, _pickBy().default)(updates, (_version, name) => {
    var _pkg$devDependencies;

    return (_pkg$devDependencies = pkg.devDependencies) === null || _pkg$devDependencies === void 0 ? void 0 : _pkg$devDependencies[name];
  });
  const devDependenciesAsStringArray = Object.keys(devDependencies).map(name => `${name}@${updates[name]}`);
  const dependencies = (0, _pickBy().default)(updates, (_version, name) => {
    var _pkg$dependencies;

    return (_pkg$dependencies = pkg.dependencies) === null || _pkg$dependencies === void 0 ? void 0 : _pkg$dependencies[name];
  });
  const dependenciesAsStringArray = Object.keys(dependencies).map(name => `${name}@${updates[name]}`); // Install dev dependencies

  if (devDependenciesAsStringArray.length) {
    try {
      await packageManager.addDevAsync(...devDependenciesAsStringArray);
    } catch (e) {
      updatingPackagesStep.fail(`Failed to upgrade JavaScript devDependencies: ${devDependenciesAsStringArray.join(' ')}`);
    }
  } // Install dependencies


  if (dependenciesAsStringArray.length) {
    try {
      await packageManager.addAsync(...dependenciesAsStringArray);
    } catch (e) {
      updatingPackagesStep.fail(`Failed to upgrade JavaScript dependencies: ${dependenciesAsStringArray.join(' ')}`);
    }
  }

  updatingPackagesStep.succeed('Updated known packages to compatible versions.'); // Remove package-lock.json and node_modules if using npm instead of yarn. See the function
  // for more information on why.

  await maybeCleanNpmStateAsync(packageManager);
  const clearingCacheStep = logNewSection('Clearing the packager cache.');

  try {
    await _xdl().Project.startReactNativeServerAsync({
      projectRoot,
      options: {
        reset: true,
        nonPersistent: true
      }
    });
  } catch (e) {
    clearingCacheStep.fail(`Failed to clear packager cache with error: ${e.message}`);
  } finally {
    try {
      // Ensure that we at least attempt to stop the server even if it failed to clear the cache
      // It was pointed out to me that "Connecting to Metro bundler failed." could occur which would lead
      // to the upgrade command not exiting upon completion because, I believe, the server remained open.
      await _xdl().Project.stopReactNativeServerAsync(projectRoot);
    } catch (_unused3) {}

    clearingCacheStep.succeed('Cleared packager cache.');
  }

  _log().default.newLine();

  (0, _log().default)(_chalk().default.bold.green(`👏 Automated upgrade steps complete.`));
  (0, _log().default)(_chalk().default.bold.grey(`...but this doesn't mean everything is done yet!`));

  _log().default.newLine(); // List packages that were updated


  (0, _log().default)(_chalk().default.bold(`✅ The following packages were updated:`));
  (0, _log().default)(_chalk().default.grey.bold([...Object.keys(updates), ...['expo']].join(', ')));

  _log().default.addNewLineIfNone(); // List packages that were not updated


  const allDependencies = { ...pkg.dependencies,
    ...pkg.devDependencies
  };
  const untouchedDependencies = (0, _difference().default)(Object.keys(allDependencies), [...Object.keys(updates), 'expo']);

  if (untouchedDependencies.length) {
    _log().default.addNewLineIfNone();

    (0, _log().default)(_chalk().default.bold(`🚨 The following packages were ${_chalk().default.underline('not')} updated. You should check the READMEs for those repositories to determine what version is compatible with your new set of packages:`));
    (0, _log().default)(_chalk().default.grey.bold(untouchedDependencies.join(', ')));

    _log().default.addNewLineIfNone();
  } // Add some basic additional instructions for bare workflow


  if (workflow === 'bare') {
    _log().default.addNewLineIfNone(); // The upgrade helper only accepts exact version, so in case we use version range expressions in our
    // versions data let's read the version from the source of truth - package.json in node_modules.


    const newReactNativeVersion = await getExactInstalledModuleVersionAsync('react-native', projectRoot, exp); // It's possible that the developer has upgraded react-native already because it's bare workflow.
    // If the version is the same, we don't need to provide an upgrade helper link.
    // If for some reason we are unable to resolve the previous/new react-native version, just skip this information.

    if (previousReactNativeVersion && newReactNativeVersion && !_semver().default.eq(previousReactNativeVersion, newReactNativeVersion)) {
      const upgradeHelperUrl = `https://react-native-community.github.io/upgrade-helper/`;

      if (_semver().default.lt(previousReactNativeVersion, newReactNativeVersion)) {
        (0, _log().default)(_chalk().default.bold(`⬆️  To finish your react-native upgrade, update your native projects as outlined here:
${_chalk().default.gray(`${upgradeHelperUrl}?from=${previousReactNativeVersion}&to=${newReactNativeVersion}`)}`));
      } else {
        (0, _log().default)(_chalk().default.bold(`👉 react-native has been changed from ${previousReactNativeVersion} to ${newReactNativeVersion} because this is the version used in SDK ${targetSdkVersionString}.`));
        (0, _log().default)(_chalk().default.bold(_chalk().default.grey(`Bare workflow apps are free to adjust their react-native version at the developer's discretion. You may want to re-install react-native@${previousReactNativeVersion} before proceeding.`)));
      }

      _log().default.newLine();
    }

    (0, _log().default)(_chalk().default.bold(`🏗  Run ${_chalk().default.grey('pod install')} in your iOS directory and then re-build your native projects to compile the updated dependencies.`));

    _log().default.addNewLineIfNone();
  }

  if (targetSdkVersion && targetSdkVersion.releaseNoteUrl) {
    (0, _log().default)(`Please refer to the release notes for information on any further required steps to update and information about breaking changes:`);
    (0, _log().default)(_chalk().default.bold(targetSdkVersion.releaseNoteUrl));
  } else {
    _log().default.gray(`Unable to find release notes for ${targetSdkVersionString}, please try to find them on https://blog.expo.io to learn more about other potentially important upgrade steps and breaking changes.`);
  }

  const skippedSdkVersions = (0, _pickBy().default)(sdkVersions, (_data, sdkVersionString) => {
    return _semver().default.lt(sdkVersionString, targetSdkVersionString) && _semver().default.gt(sdkVersionString, currentSdkVersionString);
  });
  const skippedSdkVersionKeys = Object.keys(skippedSdkVersions);

  if (skippedSdkVersionKeys.length) {
    _log().default.newLine();

    const releaseNotesUrls = Object.values(skippedSdkVersions).map(data => data.releaseNoteUrl).filter(releaseNoteUrl => releaseNoteUrl).reverse();

    if (releaseNotesUrls.length === 1) {
      (0, _log().default)(`You should also look at the breaking changes from a release that you skipped:`);
      (0, _log().default)(_chalk().default.bold(`- ${releaseNotesUrls[0]}`));
    } else {
      (0, _log().default)(`In addition to the most recent release notes, you should go over the breaking changes from skipped releases:`);
      releaseNotesUrls.forEach(url => {
        (0, _log().default)(_chalk().default.bold(`- ${url}`));
      });
    }
  }
}

async function maybeCleanNpmStateAsync(packageManager) {
  // We don't trust npm to properly handle deduping dependencies so we need to
  // clear the lockfile and node_modules.
  // https://forums.expo.io/t/sdk-37-unrecognized-font-family/35201
  // https://twitter.com/geoffreynyaga/status/1246170581109743617
  if (packageManager instanceof PackageManager().NpmPackageManager) {
    const cleaningNpmStateStep = logNewSection('Removing package-lock.json and deleting node_modules.');
    let shouldInstallNodeModules = true;

    try {
      await packageManager.removeLockfileAsync();
      await packageManager.cleanAsync();
      cleaningNpmStateStep.succeed('Removed package-lock.json and deleted node_modules.');
    } catch (_unused4) {
      shouldInstallNodeModules = false;
      cleaningNpmStateStep.fail('Unable to remove package-lock.json and delete node_modules. We recommend doing this to ensure that the upgrade goes smoothly when using npm instead of yarn.');
    }

    if (shouldInstallNodeModules) {
      const reinstallingNodeModulesStep = logNewSection('Installing node_modules and rebuilding package-lock.json.');

      try {
        await packageManager.installAsync();
        reinstallingNodeModulesStep.succeed('Installed node_modules and rebuilt package-lock.json.');
      } catch (_unused5) {
        reinstallingNodeModulesStep.fail('Running npm install failed. Please check npm-error.log for more information.');
      }
    }
  }
}

function _default(program) {
  program.command('upgrade [sdk-version]').alias('update').description('Upgrade the project packages and config for the given SDK version').helpGroup('info').option('--npm', 'Use npm to install dependencies. (default when package-lock.json exists)').option('--yarn', 'Use Yarn to install dependencies. (default when yarn.lock exists)').asyncAction(async (requestedSdkVersion, options) => {
    const {
      projectRoot,
      workflow
    } = await (0, _ProjectUtils().findProjectRootAsync)(process.cwd());
    await upgradeAsync({
      requestedSdkVersion,
      projectRoot,
      workflow
    }, options);
  });
}
//# sourceMappingURL=upgrade.js.map