"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setUpdatesVersionsAndroidAsync = setUpdatesVersionsAndroidAsync;
exports.configureUpdatesAndroidAsync = configureUpdatesAndroidAsync;

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

function fs() {
  const data = _interopRequireWildcard(require("fs-extra"));

  fs = function () {
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

function _CommandError() {
  const data = _interopRequireDefault(require("../../../../CommandError"));

  _CommandError = function () {
    return data;
  };

  return data;
}

function _getConfigurationOptions() {
  const data = _interopRequireDefault(require("./getConfigurationOptions"));

  _getConfigurationOptions = function () {
    return data;
  };

  return data;
}

function _isExpoUpdatesInstalled() {
  const data = _interopRequireDefault(require("./isExpoUpdatesInstalled"));

  _isExpoUpdatesInstalled = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function getAndroidBuildScript(projectDir, exp) {
  const androidBuildScriptPath = (0, _config().projectHasModule)('expo-updates/scripts/create-manifest-android.gradle', projectDir, exp);

  if (!androidBuildScriptPath) {
    throw new Error("Could not find the build script for Android. This could happen in case of outdated 'node_modules'. Run 'npm install' to make sure that it's up-to-date.");
  }

  return `apply from: ${JSON.stringify(_path().default.relative(_path().default.join(projectDir, 'android', 'app'), androidBuildScriptPath))}`;
}

async function setUpdatesVersionsAndroidAsync({
  projectDir,
  exp
}) {
  if (!(0, _isExpoUpdatesInstalled().default)(projectDir)) {
    return;
  }

  const isUpdatesConfigured = await isUpdatesConfiguredAndroidAsync(projectDir);

  if (!isUpdatesConfigured) {
    throw new (_CommandError().default)('"expo-updates" is installed, but not configured in the project. Please run "expo eas:build:init" first to configure "expo-updates"');
  }

  const {
    path: androidManifestPath,
    data: androidManifestJSON
  } = await getAndroidManifestJSONAsync(projectDir);

  const runtimeVersion = _config().AndroidConfig.Updates.getRuntimeVersion(exp);

  const sdkVersion = _config().AndroidConfig.Updates.getSDKVersion(exp);

  const currentRuntimeVersion = getAndroidMetadataValue(androidManifestJSON, _config().AndroidConfig.Updates.Config.RUNTIME_VERSION);
  const currentSdkVersion = getAndroidMetadataValue(androidManifestJSON, _config().AndroidConfig.Updates.Config.SDK_VERSION);

  if (runtimeVersion && runtimeVersion === currentRuntimeVersion || sdkVersion && sdkVersion === currentSdkVersion) {
    return;
  }

  const result = await _config().AndroidConfig.Updates.setVersionsConfig(exp, androidManifestJSON);
  await _config().AndroidConfig.Manifest.writeAndroidManifestAsync(androidManifestPath, result);
}

async function configureUpdatesAndroidAsync({
  projectDir,
  exp
}) {
  if (!(0, _isExpoUpdatesInstalled().default)(projectDir)) {
    return;
  }

  const username = await _xdl().UserManager.getCurrentUsernameAsync();
  const buildGradlePath = getAndroidBuildGradlePath(projectDir);
  const buildGradleContent = await getAndroidBuildGradleContentAsync(buildGradlePath);

  if (!hasBuildScriptApply(buildGradleContent, projectDir, exp)) {
    const androidBuildScript = getAndroidBuildScript(projectDir, exp);
    await fs().writeFile(buildGradlePath, `${buildGradleContent}\n// Integration with Expo updates\n${androidBuildScript}\n`);
  }

  const {
    path: androidManifestPath,
    data: androidManifestJSON
  } = await getAndroidManifestJSONAsync(projectDir);

  if (!isMetadataSetAndroid(androidManifestJSON, exp, username)) {
    const result = await _config().AndroidConfig.Updates.setUpdatesConfig(exp, androidManifestJSON, username);
    await _config().AndroidConfig.Manifest.writeAndroidManifestAsync(androidManifestPath, result);
  }
}

async function isUpdatesConfiguredAndroidAsync(projectDir) {
  const {
    exp,
    username
  } = await (0, _getConfigurationOptions().default)(projectDir);
  const buildGradlePath = getAndroidBuildGradlePath(projectDir);
  const buildGradleContent = await getAndroidBuildGradleContentAsync(buildGradlePath);

  if (!hasBuildScriptApply(buildGradleContent, projectDir, exp)) {
    return false;
  }

  const {
    data: androidManifestJSON
  } = await getAndroidManifestJSONAsync(projectDir);

  if (!isMetadataSetAndroid(androidManifestJSON, exp, username)) {
    return false;
  }

  return true;
}

function getAndroidBuildGradlePath(projectDir) {
  const buildGradlePath = _path().default.join(projectDir, 'android', 'app', 'build.gradle');

  return buildGradlePath;
}

async function getAndroidBuildGradleContentAsync(buildGradlePath) {
  if (!(await fs().pathExists(buildGradlePath))) {
    throw new Error(`Couldn't find gradle build script at ${buildGradlePath}`);
  }

  const buildGradleContent = await fs().readFile(buildGradlePath, 'utf-8');
  return buildGradleContent;
}

function hasBuildScriptApply(buildGradleContent, projectDir, exp) {
  const androidBuildScript = getAndroidBuildScript(projectDir, exp);
  return buildGradleContent.split('\n') // Check for both single and double quotes
  .some(line => line === androidBuildScript || line === androidBuildScript.replace(/"/g, "'"));
}

async function getAndroidManifestJSONAsync(projectDir) {
  const androidManifestPath = await _config().AndroidConfig.Paths.getAndroidManifestAsync(projectDir);

  if (!androidManifestPath) {
    throw new Error(`Could not find AndroidManifest.xml in project directory: "${projectDir}"`);
  }

  const androidManifestJSON = await _config().AndroidConfig.Manifest.readAndroidManifestAsync(androidManifestPath);
  return {
    path: androidManifestPath,
    data: androidManifestJSON
  };
}

function isMetadataSetAndroid(androidManifestJSON, exp, username) {
  const currentUpdateUrl = _config().AndroidConfig.Updates.getUpdateUrl(exp, username);

  const setUpdateUrl = getAndroidMetadataValue(androidManifestJSON, _config().AndroidConfig.Updates.Config.UPDATE_URL);
  return Boolean(isVersionsSetAndroid(androidManifestJSON) && currentUpdateUrl && setUpdateUrl === currentUpdateUrl);
}

function isVersionsSetAndroid(androidManifestJSON) {
  const runtimeVersion = getAndroidMetadataValue(androidManifestJSON, _config().AndroidConfig.Updates.Config.RUNTIME_VERSION);
  const sdkVersion = getAndroidMetadataValue(androidManifestJSON, _config().AndroidConfig.Updates.Config.SDK_VERSION);
  return Boolean(runtimeVersion || sdkVersion);
}

function getAndroidMetadataValue(androidManifestJSON, name) {
  var _androidManifestJSON$, _androidManifestJSON$2;

  const mainApplication = (_androidManifestJSON$ = androidManifestJSON.manifest) === null || _androidManifestJSON$ === void 0 ? void 0 : (_androidManifestJSON$2 = _androidManifestJSON$.application) === null || _androidManifestJSON$2 === void 0 ? void 0 : _androidManifestJSON$2.filter(e => e['$']['android:name'] === '.MainApplication')[0];

  if (mainApplication === null || mainApplication === void 0 ? void 0 : mainApplication.hasOwnProperty('meta-data')) {
    var _mainApplication$meta;

    const item = mainApplication === null || mainApplication === void 0 ? void 0 : (_mainApplication$meta = mainApplication['meta-data']) === null || _mainApplication$meta === void 0 ? void 0 : _mainApplication$meta.find(e => e.$['android:name'] === name);
    return item === null || item === void 0 ? void 0 : item.$['android:value'];
  }

  return undefined;
}
//# sourceMappingURL=android.js.map