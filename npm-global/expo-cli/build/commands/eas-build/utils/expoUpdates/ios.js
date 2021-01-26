"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setUpdatesVersionsIOSAsync = setUpdatesVersionsIOSAsync;
exports.configureUpdatesIOSAsync = configureUpdatesIOSAsync;

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

function _glob() {
  const data = _interopRequireDefault(require("glob"));

  _glob = function () {
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

function _xcode() {
  const data = _interopRequireDefault(require("xcode"));

  _xcode = function () {
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

function _git() {
  const data = require("../../../../git");

  _git = function () {
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

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getIOSBuildScript(projectDir, exp) {
  const iOSBuildScriptPath = (0, _config().projectHasModule)('expo-updates/scripts/create-manifest-ios.sh', projectDir, exp);

  if (!iOSBuildScriptPath) {
    throw new Error("Could not find the build script for iOS. This could happen in case of outdated 'node_modules'. Run 'npm install' to make sure that it's up-to-date.");
  }

  return _path().default.relative(_path().default.join(projectDir, 'ios'), iOSBuildScriptPath);
}

async function setUpdatesVersionsIOSAsync({
  projectDir,
  exp
}) {
  if (!(0, _isExpoUpdatesInstalled().default)(projectDir)) {
    return;
  }

  const isUpdatesConfigured = await isUpdatesConfiguredIOSAsync(projectDir);

  if (!isUpdatesConfigured) {
    throw new (_CommandError().default)('"expo-updates" is installed, but not configured in the project. Please run "expo eas:build:init" first to configure "expo-updates"');
  }

  await modifyExpoPlistAsync(projectDir, expoPlist => {
    const runtimeVersion = _config().IOSConfig.Updates.getRuntimeVersion(exp);

    const sdkVersion = _config().IOSConfig.Updates.getSDKVersion(exp);

    if (runtimeVersion && expoPlist[_config().IOSConfig.Updates.Config.RUNTIME_VERSION] === runtimeVersion || sdkVersion && expoPlist[_config().IOSConfig.Updates.Config.SDK_VERSION] === sdkVersion) {
      return expoPlist;
    }

    return _config().IOSConfig.Updates.setVersionsConfig(exp, expoPlist);
  });
}

async function configureUpdatesIOSAsync({
  projectDir,
  exp
}) {
  if (!(0, _isExpoUpdatesInstalled().default)(projectDir)) {
    return;
  }

  const username = await _xdl().UserManager.getCurrentUsernameAsync();
  const pbxprojPath = await getPbxprojPathAsync(projectDir);
  const project = await getXcodeProjectAsync(pbxprojPath);
  const bundleReactNative = await getBundleReactNativePhaseAsync(project);
  const iOSBuildScript = getIOSBuildScript(projectDir, exp);

  if (!bundleReactNative.shellScript.includes(iOSBuildScript)) {
    bundleReactNative.shellScript = `${bundleReactNative.shellScript.replace(/"$/, '')}${iOSBuildScript}\\n"`;
  }

  await fs().writeFile(pbxprojPath, project.writeSync());
  await modifyExpoPlistAsync(projectDir, expoPlist => {
    return _config().IOSConfig.Updates.setUpdatesConfig(exp, expoPlist, username);
  });
}

async function modifyExpoPlistAsync(projectDir, callback) {
  const pbxprojPath = await getPbxprojPathAsync(projectDir);
  const expoPlistPath = getExpoPlistPath(projectDir, pbxprojPath);
  let expoPlist = {};

  if (await fs().pathExists(expoPlistPath)) {
    const expoPlistContent = await fs().readFile(expoPlistPath, 'utf8');
    expoPlist = _plist().default.parse(expoPlistContent);
  }

  const updatedExpoPlist = callback(expoPlist);

  if (updatedExpoPlist === expoPlist) {
    return;
  }

  const expoPlistContent = _plist().default.build(updatedExpoPlist);

  await fs().mkdirp(_path().default.dirname(expoPlistPath));
  await fs().writeFile(expoPlistPath, expoPlistContent);
  await (0, _git().gitAddAsync)(expoPlistPath, {
    intentToAdd: true
  });
}

async function isUpdatesConfiguredIOSAsync(projectDir) {
  const {
    exp,
    username
  } = await (0, _getConfigurationOptions().default)(projectDir);
  const pbxprojPath = await getPbxprojPathAsync(projectDir);
  const project = await getXcodeProjectAsync(pbxprojPath);
  const bundleReactNative = await getBundleReactNativePhaseAsync(project);
  const iOSBuildScript = getIOSBuildScript(projectDir, exp);

  if (!bundleReactNative.shellScript.includes(iOSBuildScript)) {
    return false;
  }

  const expoPlistPath = getExpoPlistPath(projectDir, pbxprojPath);

  if (!(await fs().pathExists(expoPlistPath))) {
    return false;
  }

  const expoPlist = await fs().readFile(expoPlistPath, 'utf8');

  const expoPlistData = _plist().default.parse(expoPlist);

  return isMetadataSetIOS(expoPlistData, exp, username);
}

function isMetadataSetIOS(expoPlistData, exp, username) {
  const currentUpdateUrl = _config().IOSConfig.Updates.getUpdateUrl(exp, username);

  if (isVersionsSetIOS(expoPlistData) && currentUpdateUrl && expoPlistData[_config().IOSConfig.Updates.Config.UPDATE_URL] === currentUpdateUrl) {
    return true;
  }

  return false;
}

function isVersionsSetIOS(expoPlistData) {
  if (expoPlistData[_config().IOSConfig.Updates.Config.RUNTIME_VERSION] || expoPlistData[_config().IOSConfig.Updates.Config.SDK_VERSION]) {
    return true;
  }

  return false;
}

async function getPbxprojPathAsync(projectDir) {
  const pbxprojPaths = await new Promise((resolve, reject) => (0, _glob().default)('ios/*/project.pbxproj', {
    absolute: true,
    cwd: projectDir
  }, (err, res) => {
    if (err) {
      reject(err);
    } else {
      resolve(res);
    }
  }));
  const pbxprojPath = pbxprojPaths.length > 0 ? pbxprojPaths[0] : undefined;

  if (!pbxprojPath) {
    throw new Error(`Could not find Xcode project in project directory: "${projectDir}"`);
  }

  return pbxprojPath;
}

async function getXcodeProjectAsync(pbxprojPath) {
  const project = _xcode().default.project(pbxprojPath);

  await new Promise((resolve, reject) => project.parse(err => {
    if (err) {
      reject(err);
    } else {
      resolve();
    }
  }));
  return project;
}

function getExpoPlistPath(projectDir, pbxprojPath) {
  const xcodeprojPath = _path().default.resolve(pbxprojPath, '..');

  const expoPlistPath = _path().default.resolve(projectDir, 'ios', _path().default.basename(xcodeprojPath).replace(/\.xcodeproj$/, ''), 'Supporting', 'Expo.plist');

  return expoPlistPath;
}

async function getBundleReactNativePhaseAsync(project) {
  const scriptBuildPhase = project.hash.project.objects.PBXShellScriptBuildPhase;
  const bundleReactNative = Object.values(scriptBuildPhase).find(buildPhase => buildPhase.name === '"Bundle React Native code and images"');

  if (!bundleReactNative) {
    throw new Error(`Couldn't find a build phase script for "Bundle React Native code and images"`);
  }

  return bundleReactNative;
}
//# sourceMappingURL=ios.js.map