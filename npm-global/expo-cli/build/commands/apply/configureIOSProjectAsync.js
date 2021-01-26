"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configureIOSProjectAsync;

function _config() {
  const data = require("@expo/config");

  _config = function () {
    return data;
  };

  return data;
}

function _Xcodeproj() {
  const data = require("@expo/config/build/ios/utils/Xcodeproj");

  _Xcodeproj = function () {
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

function _xdl() {
  const data = require("@expo/xdl");

  _xdl = function () {
    return data;
  };

  return data;
}

function _fsExtra() {
  const data = require("fs-extra");

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

function _ConfigValidation() {
  const data = require("../eject/ConfigValidation");

  _ConfigValidation = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function configureIOSProjectAsync(projectRoot) {
  // Check bundle ID before reading the config because it may mutate the config if the user is prompted to define it.
  const bundleIdentifier = await (0, _ConfigValidation().getOrPromptForBundleIdentifier)(projectRoot);

  _config().IOSConfig.BundleIdenitifer.setBundleIdentifierForPbxproj(projectRoot, bundleIdentifier);

  const {
    exp
  } = (0, _config().getConfig)(projectRoot, {
    skipSDKVersionRequirement: true
  });
  const username = await _xdl().UserManager.getCurrentUsernameAsync(); // Configure the Xcode project

  await modifyPbxprojAsync(projectRoot, async project => {
    project = await _config().IOSConfig.Google.setGoogleServicesFile(exp, {
      project,
      projectRoot
    });
    project = await _config().IOSConfig.Locales.setLocalesAsync(exp, {
      project,
      projectRoot
    });
    project = _config().IOSConfig.DeviceFamily.setDeviceFamily(exp, {
      project
    });
    return project;
  }); // Configure the Info.plist

  await modifyInfoPlistAsync(projectRoot, infoPlist => {
    infoPlist = _config().IOSConfig.CustomInfoPlistEntries.setCustomInfoPlistEntries(exp, infoPlist);
    infoPlist = _config().IOSConfig.Branch.setBranchApiKey(exp, infoPlist);
    infoPlist = _config().IOSConfig.Facebook.setFacebookConfig(exp, infoPlist);
    infoPlist = _config().IOSConfig.Google.setGoogleConfig(exp, infoPlist);
    infoPlist = _config().IOSConfig.Name.setDisplayName(exp, infoPlist);
    infoPlist = _config().IOSConfig.Orientation.setOrientation(exp, infoPlist);
    infoPlist = _config().IOSConfig.RequiresFullScreen.setRequiresFullScreen(exp, infoPlist);
    infoPlist = _config().IOSConfig.Scheme.setScheme(exp, infoPlist);
    infoPlist = _config().IOSConfig.UserInterfaceStyle.setUserInterfaceStyle(exp, infoPlist);
    infoPlist = _config().IOSConfig.UsesNonExemptEncryption.setUsesNonExemptEncryption(exp, infoPlist);
    infoPlist = _config().IOSConfig.Version.setBuildNumber(exp, infoPlist);
    infoPlist = _config().IOSConfig.Version.setVersion(exp, infoPlist);
    return infoPlist;
  }); // Configure Expo.plist

  await modifyExpoPlistAsync(projectRoot, expoPlist => {
    expoPlist = _config().IOSConfig.Updates.setUpdatesConfig(exp, expoPlist, username);
    return expoPlist;
  }); // TODO: fix this on Windows! We will ignore errors for now so people can just proceed

  try {
    // Configure entitlements/capabilities
    await modifyEntitlementsPlistAsync(projectRoot, entitlementsPlist => {
      entitlementsPlist = _config().IOSConfig.Entitlements.setCustomEntitlementsEntries(exp, entitlementsPlist); // TODO: We don't have a mechanism for getting the apple team id here yet

      entitlementsPlist = _config().IOSConfig.Entitlements.setICloudEntitlement(exp, 'TODO-GET-APPLE-TEAM-ID', entitlementsPlist);
      entitlementsPlist = _config().IOSConfig.Entitlements.setAppleSignInEntitlement(exp, entitlementsPlist);
      entitlementsPlist = _config().IOSConfig.Entitlements.setAccessesContactNotes(exp, entitlementsPlist);
      entitlementsPlist = _config().IOSConfig.Entitlements.setAssociatedDomains(exp, entitlementsPlist);
      return entitlementsPlist;
    });
  } catch (e) {
    _config().WarningAggregator.addWarningIOS('entitlements', 'iOS entitlements could not be applied. Please ensure that contact notes, Apple Sign In, and associated domains entitlements are properly configured if you use them in your app.');
  } // Other


  await _config().IOSConfig.Icons.setIconsAsync(exp, projectRoot);
  await _config().IOSConfig.SplashScreen.setSplashScreenAsync(exp, projectRoot);
}

async function modifyPbxprojAsync(projectRoot, callbackAsync) {
  const project = (0, _Xcodeproj().getPbxproj)(projectRoot);
  const result = await callbackAsync(project);
  await (0, _fsExtra().writeFile)(project.filepath, result.writeSync());
}

async function modifyEntitlementsPlistAsync(projectRoot, callback) {
  const entitlementsPath = _config().IOSConfig.Entitlements.getEntitlementsPath(projectRoot);

  let data = _plist().default.parse((await (0, _fsExtra().readFile)(entitlementsPath, 'utf8')));

  data = await callback(data);
  await (0, _fsExtra().writeFile)(entitlementsPath, _plist().default.build(data));
}

async function modifyInfoPlistAsync(projectRoot, callback) {
  const {
    iosProjectDirectory
  } = getIOSPaths(projectRoot);

  const infoPath = _path().default.resolve(iosProjectDirectory, 'Info.plist');

  let data = _plist().default.parse((await (0, _fsExtra().readFile)(infoPath, 'utf8')));

  data = await callback(data);
  await (0, _fsExtra().writeFile)(infoPath, _plist().default.build(data));
}

async function modifyExpoPlistAsync(projectRoot, callback) {
  const {
    iosProjectDirectory
  } = getIOSPaths(projectRoot);

  const supportingDirectory = _path().default.join(iosProjectDirectory, 'Supporting');

  try {
    const infoPath = _path().default.resolve(supportingDirectory, 'Expo.plist');

    let data = _plist().default.parse((await (0, _fsExtra().readFile)(infoPath, 'utf8')));

    data = await callback(data);
    await (0, _fsExtra().writeFile)(infoPath, _plist().default.build(data));
  } catch (error) {
    _config().WarningAggregator.addWarningIOS('updates', 'Expo.plist configuration could not be applied. You will need to create Expo.plist if it does not exist and add Updates configuration manually.', 'https://docs.expo.io/bare/updating-your-app/#configuration-options');
  }
} // TODO: come up with a better solution for using app.json expo.name in various places


function sanitizedName(name) {
  return name.replace(/[\W_]+/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
} // TODO: it's silly and kind of fragile that we look at app config to determine
// the ios project paths. Overall this function needs to be revamped, just a
// placeholder for now! Make this more robust when we support applying config
// at any time (currently it's only applied on eject).


function getIOSPaths(projectRoot) {
  let projectName = null; // Attempt to get the current ios folder name (apply).

  try {
    projectName = (0, _Xcodeproj().getProjectName)(projectRoot);
  } catch (_unused) {
    // If no iOS project exists then create a new one (eject).
    const {
      exp
    } = (0, _config().getConfig)(projectRoot, {
      skipSDKVersionRequirement: true
    });
    projectName = exp.name;

    if (!projectName) {
      throw new Error('Your project needs a name in app.json/app.config.js.');
    }

    projectName = sanitizedName(projectName);
  }

  const iosProjectDirectory = _path().default.join(projectRoot, 'ios', projectName);

  const iconPath = _path().default.join(iosProjectDirectory, 'Assets.xcassets', 'AppIcon.appiconset');

  return {
    projectName,
    iosProjectDirectory,
    iconPath
  };
}
//# sourceMappingURL=configureIOSProjectAsync.js.map