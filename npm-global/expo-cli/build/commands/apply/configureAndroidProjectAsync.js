"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configureAndroidProjectAsync;

function _config() {
  const data = require("@expo/config");

  _config = function () {
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
  const data = _interopRequireDefault(require("fs-extra"));

  _fsExtra = function () {
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

async function modifyBuildGradleAsync(projectRoot, callback) {
  const buildGradlePath = _config().AndroidConfig.Paths.getAndroidBuildGradle(projectRoot);

  const buildGradleString = _fsExtra().default.readFileSync(buildGradlePath).toString();

  const result = callback(buildGradleString);

  _fsExtra().default.writeFileSync(buildGradlePath, result);
}

async function modifyAppBuildGradleAsync(projectRoot, callback) {
  const buildGradlePath = _config().AndroidConfig.Paths.getAppBuildGradle(projectRoot);

  const buildGradleString = _fsExtra().default.readFileSync(buildGradlePath).toString();

  const result = callback(buildGradleString);

  _fsExtra().default.writeFileSync(buildGradlePath, result);
}

async function modifyAndroidManifestAsync(projectRoot, callback) {
  const androidManifestPath = await _config().AndroidConfig.Paths.getAndroidManifestAsync(projectRoot);
  const androidManifestJSON = await _config().AndroidConfig.Manifest.readAndroidManifestAsync(androidManifestPath);
  const result = await callback(androidManifestJSON);
  await _config().AndroidConfig.Manifest.writeAndroidManifestAsync(androidManifestPath, result);
}

async function modifyMainActivityAsync(projectRoot, callback) {
  const mainActivity = await _config().AndroidConfig.Paths.getMainActivityAsync(projectRoot);

  const contents = _fsExtra().default.readFileSync(mainActivity.path).toString();

  const result = await callback({
    contents,
    language: mainActivity.language
  });

  _fsExtra().default.writeFileSync(mainActivity.path, result);
}

async function configureAndroidProjectAsync(projectRoot) {
  // Check package before reading the config because it may mutate the config if the user is prompted to define it.
  await (0, _ConfigValidation().getOrPromptForPackage)(projectRoot);
  const {
    exp
  } = (0, _config().getConfig)(projectRoot, {
    skipSDKVersionRequirement: true
  });
  const username = await _xdl().UserManager.getCurrentUsernameAsync();
  await modifyBuildGradleAsync(projectRoot, buildGradle => {
    buildGradle = _config().AndroidConfig.GoogleServices.setClassPath(exp, buildGradle);
    return buildGradle;
  });
  await modifyAppBuildGradleAsync(projectRoot, buildGradle => {
    buildGradle = _config().AndroidConfig.GoogleServices.applyPlugin(exp, buildGradle);
    buildGradle = _config().AndroidConfig.Package.setPackageInBuildGradle(exp, buildGradle);
    buildGradle = _config().AndroidConfig.Version.setVersionCode(exp, buildGradle);
    buildGradle = _config().AndroidConfig.Version.setVersionName(exp, buildGradle);
    return buildGradle;
  });
  await modifyAndroidManifestAsync(projectRoot, async androidManifest => {
    androidManifest = await _config().AndroidConfig.Package.setPackageInAndroidManifest(exp, androidManifest);
    androidManifest = await _config().AndroidConfig.AllowBackup.setAllowBackup(exp, androidManifest);
    androidManifest = await _config().AndroidConfig.Scheme.setScheme(exp, androidManifest);
    androidManifest = await _config().AndroidConfig.Orientation.setAndroidOrientation(exp, androidManifest);
    androidManifest = await _config().AndroidConfig.Permissions.setAndroidPermissions(exp, androidManifest);
    androidManifest = await _config().AndroidConfig.Branch.setBranchApiKey(exp, androidManifest);
    androidManifest = await _config().AndroidConfig.Facebook.setFacebookConfig(exp, androidManifest);
    androidManifest = await _config().AndroidConfig.UserInterfaceStyle.setUiModeAndroidManifest(exp, androidManifest);
    androidManifest = await _config().AndroidConfig.GoogleMobileAds.setGoogleMobileAdsConfig(exp, androidManifest);
    androidManifest = await _config().AndroidConfig.GoogleMapsApiKey.setGoogleMapsApiKey(exp, androidManifest);
    androidManifest = await _config().AndroidConfig.IntentFilters.setAndroidIntentFilters(exp, androidManifest);
    androidManifest = await _config().AndroidConfig.Updates.setUpdatesConfig(exp, androidManifest, username);
    return androidManifest;
  });
  await modifyMainActivityAsync(projectRoot, async ({
    contents,
    language
  }) => {
    if (language === 'java') {
      contents = _config().AndroidConfig.UserInterfaceStyle.addOnConfigurationChangedMainActivity(exp, contents);
    } else {
      _config().WarningAggregator.addWarningAndroid('userInterfaceStyle', `Cannot automatically configure MainActivity if it's not java`);
    }

    return contents;
  }); // If we renamed the package, we should also move it around and rename it in source files

  await _config().AndroidConfig.Package.renamePackageOnDisk(exp, projectRoot); // Modify colors.xml and styles.xml

  await _config().AndroidConfig.RootViewBackgroundColor.setRootViewBackgroundColor(exp, projectRoot);
  await _config().AndroidConfig.NavigationBar.setNavigationBarConfig(exp, projectRoot);
  await _config().AndroidConfig.StatusBar.setStatusBarConfig(exp, projectRoot);
  await _config().AndroidConfig.PrimaryColor.setPrimaryColor(exp, projectRoot); // Modify strings.xml

  await _config().AndroidConfig.Facebook.setFacebookAppIdString(exp, projectRoot);
  await _config().AndroidConfig.Name.setName(exp, projectRoot); // add google-services.json to project

  await _config().AndroidConfig.GoogleServices.setGoogleServicesFile(exp, projectRoot); // TODOs

  await _config().AndroidConfig.SplashScreen.setSplashScreenAsync(exp, projectRoot);
  await _config().AndroidConfig.Icon.setIconAsync(exp, projectRoot);
}
//# sourceMappingURL=configureAndroidProjectAsync.js.map