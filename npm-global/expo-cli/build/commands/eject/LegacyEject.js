"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ejectAsync = ejectAsync;
exports.stripDashes = stripDashes;

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

function _accounts() {
  const data = require("../../accounts");

  _accounts = function () {
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

function _prompt() {
  const data = _interopRequireDefault(require("../../prompt"));

  _prompt = function () {
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const EXPO_APP_ENTRY = 'node_modules/expo/AppEntry.js';

async function warnIfDependenciesRequireAdditionalSetupAsync(projectRoot) {
  // We just need the custom `nodeModulesPath` from the config.
  const {
    exp,
    pkg
  } = await ConfigUtils().getConfig(projectRoot, {
    skipSDKVersionRequirement: true
  });
  const pkgsWithExtraSetup = await _jsonFile().default.readAsync(ConfigUtils().resolveModule('expo/requiresExtraSetup.json', projectRoot, exp));
  const packagesToWarn = Object.keys(pkg.dependencies).filter(pkgName => pkgsWithExtraSetup.hasOwnProperty(pkgName));

  if (packagesToWarn.length === 0) {
    return;
  }

  const plural = packagesToWarn.length > 1;

  _log().default.nested('');

  _log().default.nested(_chalk().default.yellow(`Warning: your app includes ${_chalk().default.bold(`${packagesToWarn.length}`)} package${plural ? 's' : ''} that require${plural ? '' : 's'} additional setup. See the following URL${plural ? 's' : ''} for instructions.`));

  _log().default.nested(_chalk().default.yellow(`Your app may not build/run until the additional setup for ${plural ? 'these packages' : 'this package'} has been completed.`));

  _log().default.nested('');

  packagesToWarn.forEach(pkgName => {
    _log().default.nested(_chalk().default.yellow(`- ${_chalk().default.bold(pkgName)}: ${pkgsWithExtraSetup[pkgName]}`));
  });

  _log().default.nested('');
}

async function ejectAsync(projectRoot, options) {
  await (0, _ProjectUtils().validateGitStatusAsync)();

  _log().default.nested('');

  const reactNativeOptionMessage = "Bare: I'd like a bare React Native project.";
  const questions = [{
    type: 'list',
    name: 'ejectMethod',
    message: 'How would you like to eject your app?\n  Read more: https://docs.expo.io/expokit/eject/',
    default: 'bare',
    choices: [{
      name: reactNativeOptionMessage,
      value: 'bare',
      short: 'Bare'
    }, {
      name: "ExpoKit: I'll create or log in with an Expo account to use React Native and the Expo SDK.",
      value: 'expokit',
      short: 'ExpoKit'
    }, {
      name: "Cancel: I'll continue with my current project structure.",
      value: 'cancel',
      short: 'cancel'
    }]
  }];
  const ejectMethod = options.ejectMethod || (await (0, _prompt().default)(questions, {
    nonInteractiveHelp: 'Please specify eject method (bare, expokit) with the --eject-method option.'
  })).ejectMethod;

  if (ejectMethod === 'bare') {
    await ejectToBareAsync(projectRoot);

    _log().default.nested(_chalk().default.green('Ejected successfully!'));

    _log().default.newLine();

    _log().default.nested(`Before running your app on iOS, make sure you have CocoaPods installed and initialize the project:`);

    _log().default.nested('');

    _log().default.nested(`  cd ios`);

    _log().default.nested(`  pod install`);

    _log().default.nested('');

    _log().default.nested('Then you can run the project:');

    _log().default.nested('');

    const packageManager = PackageManager().isUsingYarn(projectRoot) ? 'yarn' : 'npm';

    _log().default.nested(`  ${packageManager === 'npm' ? 'npm run android' : 'yarn android'}`);

    _log().default.nested(`  ${packageManager === 'npm' ? 'npm run ios' : 'yarn ios'}`);

    await warnIfDependenciesRequireAdditionalSetupAsync(projectRoot);
  } else if (ejectMethod === 'expokit') {
    await (0, _accounts().loginOrRegisterIfLoggedOutAsync)();
    await _xdl().Detach.detachAsync(projectRoot, options);
    (0, _log().default)(_chalk().default.green('Ejected successfully!'));
  } else if (ejectMethod === 'cancel') {
    // we don't want to print the survey for cancellations
    (0, _log().default)('OK! If you change your mind you can run this command again.');
  } else {
    throw new Error(`Unrecognized eject method "${ejectMethod}". Valid options are: bare, expokit.`);
  }
}

function ensureDependenciesMap(dependencies) {
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

async function ejectToBareAsync(projectRoot) {
  var _exp$ios;

  const useYarn = PackageManager().isUsingYarn(projectRoot);
  const npmOrYarn = useYarn ? 'yarn' : 'npm';
  const {
    configPath,
    configName
  } = ConfigUtils().findConfigFile(projectRoot);
  const {
    exp,
    pkg
  } = await ConfigUtils().readConfigJsonAsync(projectRoot);
  const configBuffer = await _fsExtra().default.readFile(configPath);
  const appJson = configName === 'app.json' ? JSON.parse(configBuffer.toString()) : {};
  /**
   * Perform validations
   */

  if (!exp.sdkVersion) throw new Error(`Couldn't read ${configName}`);

  if (!_xdl().Versions.gteSdkVersion(exp, '34.0.0')) {
    throw new Error(`Ejecting to a bare project is only available for SDK 34 and higher`);
  } // Validate that the template exists


  const sdkMajorVersionNumber = _semver().default.major(exp.sdkVersion);

  const templateSpec = (0, _npmPackageArg().default)(`expo-template-bare-minimum@sdk-${sdkMajorVersionNumber}`);

  try {
    await _pacote().default.manifest(templateSpec);
  } catch (e) {
    if (e.code === 'E404') {
      throw new Error(`Unable to eject because an eject template for SDK ${sdkMajorVersionNumber} was not found`);
    } else {
      throw e;
    }
  }
  /**
   * Customize app.json
   */


  const {
    displayName,
    name
  } = await getAppNamesAsync(projectRoot);
  appJson.displayName = displayName;
  appJson.name = name;

  if (appJson.expo.entryPoint && appJson.expo.entryPoint !== EXPO_APP_ENTRY) {
    (0, _log().default)(_chalk().default.yellow(`expo.entryPoint is already configured, we recommend using "${EXPO_APP_ENTRY}`));
  } else {
    appJson.expo.entryPoint = EXPO_APP_ENTRY;
  }

  (0, _log().default)('Writing app.json...');
  await _fsExtra().default.writeFile(_path().default.resolve('app.json'), JSON.stringify(appJson, null, 2));
  (0, _log().default)(_chalk().default.green('Wrote to app.json, please update it manually in the future.')); // This is validated later...

  let defaultDependencies = {};
  let defaultDevDependencies = {};
  /**
   * Extract the template and copy it over
   */

  try {
    const tempDir = _tempy().default.directory();

    await _xdl().Exp.extractTemplateAppAsync(templateSpec, tempDir, appJson);

    _fsExtra().default.copySync(_path().default.join(tempDir, 'ios'), _path().default.join(projectRoot, 'ios'));

    _fsExtra().default.copySync(_path().default.join(tempDir, 'android'), _path().default.join(projectRoot, 'android'));

    const {
      dependencies,
      devDependencies
    } = _jsonFile().default.read(_path().default.join(tempDir, 'package.json'));

    defaultDependencies = ensureDependenciesMap(dependencies);
    defaultDevDependencies = devDependencies;
    (0, _log().default)('Successfully copied template native code.');
  } catch (e) {
    (0, _log().default)(_chalk().default.red(e.message));
    (0, _log().default)(_chalk().default.red(`Eject failed, see above output for any issues.`));
    (0, _log().default)(_chalk().default.yellow('You may want to delete the `ios` and/or `android` directories.'));
    process.exit(1);
  }

  (0, _log().default)(`Updating your package.json...`);

  if (!pkg.scripts) {
    pkg.scripts = {};
  }

  delete pkg.scripts.eject;
  pkg.scripts.start = 'react-native start';
  pkg.scripts.ios = 'react-native run-ios';
  pkg.scripts.android = 'react-native run-android'; // Jetifier is only needed for SDK 34 & 35

  if (_xdl().Versions.lteSdkVersion(exp, '35.0.0')) {
    if (pkg.scripts.postinstall) {
      pkg.scripts.postinstall = `jetify && ${pkg.scripts.postinstall}`;
      (0, _log().default)(_chalk().default.bgYellow.black('jetifier has been added to your existing postinstall script.'));
    } else {
      pkg.scripts.postinstall = `jetify`;
    }
  } // The template may have some dependencies beyond react/react-native/react-native-unimodules,
  // for example RNGH and Reanimated. We should prefer the version that is already being used
  // in the project for those, but swap the react/react-native/react-native-unimodules versions
  // with the ones in the template.


  const combinedDependencies = ensureDependenciesMap({ ...defaultDependencies,
    ...pkg.dependencies
  });

  for (const dependenciesKey of ['react', 'react-native-unimodules', 'react-native']) {
    combinedDependencies[dependenciesKey] = defaultDependencies[dependenciesKey];
  }

  pkg.dependencies = combinedDependencies;
  const combinedDevDependencies = ensureDependenciesMap({ ...defaultDevDependencies,
    ...pkg.devDependencies
  }); // Jetifier is only needed for SDK 34 & 35

  if (_xdl().Versions.lteSdkVersion(exp, '35.0.0')) {
    combinedDevDependencies['jetifier'] = defaultDevDependencies['jetifier'];
  }

  pkg.devDependencies = combinedDevDependencies;
  await _fsExtra().default.writeFile(_path().default.resolve('package.json'), JSON.stringify(pkg, null, 2));
  (0, _log().default)(_chalk().default.green('Your package.json is up to date!'));
  (0, _log().default)(`Adding entry point...`);

  if (pkg.main !== EXPO_APP_ENTRY) {
    (0, _log().default)(_chalk().default.yellow(`Removing "main": ${pkg.main} from package.json. We recommend using index.js instead.`));
  }

  delete pkg.main;
  await _fsExtra().default.writeFile(_path().default.resolve('package.json'), JSON.stringify(pkg, null, 2));
  const indexjs = `import { AppRegistry, Platform } from 'react-native';
import App from './App';

AppRegistry.registerComponent('${appJson.name}', () => App);

if (Platform.OS === 'web') {
  const rootTag = document.getElementById('root') || document.getElementById('main');
  AppRegistry.runApplication('${appJson.name}', { rootTag });
}
`;
  await _fsExtra().default.writeFile(_path().default.resolve('index.js'), indexjs);
  (0, _log().default)(_chalk().default.green('Added new entry points!'));
  (0, _log().default)(_chalk().default.grey(`Note that using \`${npmOrYarn} start\` will now require you to run Xcode and/or Android Studio to build the native code for your project.`));
  (0, _log().default)('Removing node_modules...');
  await _fsExtra().default.remove('node_modules');
  (0, _log().default)('Installing new packages...');
  const packageManager = PackageManager().createForProject(projectRoot, {
    log: _log().default
  });
  await packageManager.installAsync(); // --Apply app config to iOS and Android projects here--
  // If the bundleIdentifier exists then set it on the project

  if ((_exp$ios = exp.ios) === null || _exp$ios === void 0 ? void 0 : _exp$ios.bundleIdentifier) {
    var _exp$ios2;

    _xdl().IosWorkspace.setBundleIdentifier(projectRoot, (_exp$ios2 = exp.ios) === null || _exp$ios2 === void 0 ? void 0 : _exp$ios2.bundleIdentifier);
  }

  _log().default.newLine();
}
/**
 * Returns a name that adheres to Xcode and Android naming conventions.
 *
 * - package name: https://docs.oracle.com/javase/tutorial/java/package/namingpkgs.html
 * @param projectRoot
 */


async function getAppNamesAsync(projectRoot) {
  const {
    configPath,
    configName
  } = ConfigUtils().findConfigFile(projectRoot);
  const {
    exp,
    pkg
  } = await ConfigUtils().readConfigJsonAsync(projectRoot);
  const configBuffer = await _fsExtra().default.readFile(configPath);
  const appJson = configName === 'app.json' ? JSON.parse(configBuffer.toString()) : {};
  let {
    displayName,
    name
  } = appJson;

  if (!displayName || !name) {
    (0, _log().default)("We have a couple of questions to ask you about how you'd like to name your app:");
    ({
      displayName,
      name
    } = await (0, _prompt().default)([{
      name: 'displayName',
      message: "What should your app appear as on a user's home screen?",
      default: name || exp.name,

      validate({
        length
      }) {
        return length ? true : 'App display name cannot be empty.';
      }

    }, {
      name: 'name',
      message: 'What should your Android Studio and Xcode projects be called?',
      default: pkg.name ? stripDashes(pkg.name) : undefined,

      validate(value) {
        if (value.length === 0) {
          return 'Project name cannot be empty.';
        } else if (value.includes('-') || value.includes(' ')) {
          return 'Project name cannot contain hyphens or spaces.';
        }

        return true;
      }

    }], {
      nonInteractiveHelp: 'Please specify "displayName" and "name" in app.json.'
    }));
  }

  return {
    displayName,
    name
  };
}

function stripDashes(s) {
  return s.replace(/\s|-/g, '');
}
//# sourceMappingURL=LegacyEject.js.map