"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOrPromptForBundleIdentifier = getOrPromptForBundleIdentifier;
exports.getOrPromptForPackage = getOrPromptForPackage;

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

function _got() {
  const data = _interopRequireDefault(require("got"));

  _got = function () {
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

function _prompts() {
  const data = require("../../prompts");

  _prompts = function () {
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

function _url() {
  const data = require("../utils/url");

  _url = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const noBundleIdMessage = `Your project must have a \`bundleIdentifier\` set in the Expo config (app.json or app.config.js).\nSee https://expo.fyi/bundle-identifier`;
const noPackageMessage = `Your project must have a \`package\` set in the Expo config (app.json or app.config.js).\nSee https://expo.fyi/android-package`;

function validateBundleId(value) {
  return /^[a-zA-Z][a-zA-Z0-9\-.]+$/.test(value);
}

function validatePackage(value) {
  return /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/.test(value);
}

const cachedBundleIdResults = {};
const cachedPackageNameResults = {};
/**
 * A quality of life method that provides a warning when the bundle ID is already in use.
 *
 * @param bundleId
 */

async function getBundleIdWarningAsync(bundleId) {
  // Prevent fetching for the same ID multiple times.
  if (cachedBundleIdResults[bundleId]) {
    return cachedBundleIdResults[bundleId];
  }

  if (!(await (0, _url().isUrlAvailableAsync)('itunes.apple.com'))) {
    // If no network, simply skip the warnings since they'll just lead to more confusion.
    return null;
  }

  const url = `http://itunes.apple.com/lookup?bundleId=${bundleId}`;

  try {
    var _response$body;

    const response = await (0, _got().default)(url);
    const json = JSON.parse((_response$body = response.body) === null || _response$body === void 0 ? void 0 : _response$body.trim());

    if (json.resultCount > 0) {
      const firstApp = json.results[0];
      const message = formatInUseWarning(firstApp.trackName, firstApp.sellerName, bundleId);
      cachedBundleIdResults[bundleId] = message;
      return message;
    }
  } catch (_unused) {// Error fetching itunes data.
  }

  return null;
}

async function getPackageNameWarningAsync(packageName) {
  // Prevent fetching for the same ID multiple times.
  if (cachedPackageNameResults[packageName]) {
    return cachedPackageNameResults[packageName];
  }

  if (!(await (0, _url().isUrlAvailableAsync)('play.google.com'))) {
    // If no network, simply skip the warnings since they'll just lead to more confusion.
    return null;
  }

  const url = `https://play.google.com/store/apps/details?id=${packageName}`;

  try {
    const response = await (0, _got().default)(url); // If the page exists, then warn the user.

    if (response.statusCode === 200) {
      // There is no JSON API for the Play Store so we can't concisely
      // locate the app name and developer to match the iOS warning.
      const message = `⚠️  The package ${_log().default.chalk.bold(packageName)} is already in use. ${_log().default.chalk.dim((0, _TerminalLink().learnMore)(url))}`;
      cachedPackageNameResults[packageName] = message;
      return message;
    }
  } catch (_unused2) {// Error fetching play store data or the page doesn't exist.
  }

  return null;
}

function formatInUseWarning(appName, author, id) {
  return `⚠️  The app ${_log().default.chalk.bold(appName)} by ${_log().default.chalk.italic(author)} is already using ${_log().default.chalk.bold(id)}`;
}

async function getOrPromptForBundleIdentifier(projectRoot) {
  var _exp$ios, _exp$android, _exp$android2;

  const {
    exp
  } = (0, _config().getConfig)(projectRoot, {
    skipSDKVersionRequirement: true
  });
  const currentBundleId = (_exp$ios = exp.ios) === null || _exp$ios === void 0 ? void 0 : _exp$ios.bundleIdentifier;

  if (currentBundleId) {
    if (validateBundleId(currentBundleId)) {
      return currentBundleId;
    }

    (0, _log().default)(_log().default.chalk.red(`The ios.bundleIdentifier defined in your Expo config is not formatted properly. Only alphanumeric characters, '.', '-', and '_' are allowed, and each '.' must be followed by a letter.`));
    process.exit(1);
  } // Recommend a bundle ID based on the username and project slug.


  let recommendedBundleId; // Attempt to use the android package name first since it's convenient to have them aligned.

  if (((_exp$android = exp.android) === null || _exp$android === void 0 ? void 0 : _exp$android.package) && validateBundleId((_exp$android2 = exp.android) === null || _exp$android2 === void 0 ? void 0 : _exp$android2.package)) {
    var _exp$android3;

    recommendedBundleId = (_exp$android3 = exp.android) === null || _exp$android3 === void 0 ? void 0 : _exp$android3.package;
  } else {
    var _exp$owner;

    const username = (_exp$owner = exp.owner) !== null && _exp$owner !== void 0 ? _exp$owner : await _xdl().UserManager.getCurrentUsernameAsync();
    const possibleId = `com.${username}.${exp.slug}`;

    if (username && validateBundleId(possibleId)) {
      recommendedBundleId = possibleId;
    }
  }

  _log().default.addNewLineIfNone();

  (0, _log().default)(`${_log().default.chalk.bold(`📝  iOS Bundle Identifier`)} ${_log().default.chalk.dim((0, _TerminalLink().learnMore)('https://expo.fyi/bundle-identifier'))}`);

  _log().default.newLine(); // Prompt the user for the bundle ID.
  // Even if the project is using a dynamic config we can still
  // prompt a better error message, recommend a default value, and help the user
  // validate their custom bundle ID upfront.


  const {
    bundleIdentifier
  } = await (0, _prompt().default)([{
    name: 'bundleIdentifier',
    default: recommendedBundleId,
    // The Apple helps people know this isn't an EAS feature.
    message: `What would you like your iOS bundle identifier to be?`,
    validate: validateBundleId
  }], {
    nonInteractiveHelp: noBundleIdMessage
  }); // Warn the user if the bundle ID is already in use.

  const warning = await getBundleIdWarningAsync(bundleIdentifier);

  if (warning) {
    _log().default.newLine();

    _log().default.nestedWarn(warning);

    _log().default.newLine();

    if (!(await (0, _prompts().confirmAsync)({
      message: `Continue?`,
      initial: true
    }))) {
      _log().default.newLine();

      return getOrPromptForBundleIdentifier(projectRoot);
    }
  } // Apply the changes to the config.


  await attemptModification(projectRoot, {
    ios: { ...(exp.ios || {}),
      bundleIdentifier
    }
  }, {
    ios: {
      bundleIdentifier
    }
  });
  return bundleIdentifier;
}

async function getOrPromptForPackage(projectRoot) {
  var _exp$android4, _exp$ios2;

  const {
    exp
  } = (0, _config().getConfig)(projectRoot, {
    skipSDKVersionRequirement: true
  });
  const currentPackage = (_exp$android4 = exp.android) === null || _exp$android4 === void 0 ? void 0 : _exp$android4.package;

  if (currentPackage) {
    if (validatePackage(currentPackage)) {
      return currentPackage;
    }

    (0, _log().default)(_log().default.chalk.red(`Invalid format of Android package name. Only alphanumeric characters, '.' and '_' are allowed, and each '.' must be followed by a letter.`));
    process.exit(1);
  } // Recommend a package name based on the username and project slug.


  let recommendedPackage; // Attempt to use the ios bundle id first since it's convenient to have them aligned.

  if (((_exp$ios2 = exp.ios) === null || _exp$ios2 === void 0 ? void 0 : _exp$ios2.bundleIdentifier) && validatePackage(exp.ios.bundleIdentifier)) {
    recommendedPackage = exp.ios.bundleIdentifier;
  } else {
    var _exp$owner2;

    const username = (_exp$owner2 = exp.owner) !== null && _exp$owner2 !== void 0 ? _exp$owner2 : await _xdl().UserManager.getCurrentUsernameAsync(); // It's common to use dashes in your node project name, strip them from the suggested package name.

    const possibleId = `com.${username}.${exp.slug}`.split('-').join('');

    if (username && validatePackage(possibleId)) {
      recommendedPackage = possibleId;
    }
  }

  _log().default.addNewLineIfNone();

  (0, _log().default)(`${_log().default.chalk.bold(`📝  Android package`)} ${_log().default.chalk.dim((0, _TerminalLink().learnMore)('https://expo.fyi/android-package'))}`);

  _log().default.newLine(); // Prompt the user for the android package.
  // Even if the project is using a dynamic config we can still
  // prompt a better error message, recommend a default value, and help the user
  // validate their custom android package upfront.


  const {
    packageName
  } = await (0, _prompt().default)([{
    name: 'packageName',
    default: recommendedPackage,
    message: `What would you like your Android package name to be?`,
    validate: validatePackage
  }], {
    nonInteractiveHelp: noPackageMessage
  }); // Warn the user if the package name is already in use.

  const warning = await getPackageNameWarningAsync(packageName);

  if (warning) {
    _log().default.newLine();

    _log().default.nestedWarn(warning);

    _log().default.newLine();

    if (!(await (0, _prompts().confirmAsync)({
      message: `Continue?`,
      initial: true
    }))) {
      _log().default.newLine();

      return getOrPromptForPackage(projectRoot);
    }
  } // Apply the changes to the config.


  await attemptModification(projectRoot, {
    android: { ...(exp.android || {}),
      package: packageName
    }
  }, {
    android: {
      package: packageName
    }
  });
  return packageName;
}

async function attemptModification(projectRoot, edits, exactEdits) {
  const modification = await (0, _config().modifyConfigAsync)(projectRoot, edits, {
    skipSDKVersionRequirement: true
  });

  if (modification.type === 'success') {
    _log().default.newLine();
  } else {
    warnAboutConfigAndExit(modification.type, modification.message, exactEdits);
  }
}

function logNoConfig() {
  (0, _log().default)(_log().default.chalk.yellow('No Expo config was found. Please create an Expo config (`app.config.js` or `app.json`) in your project root.'));
}

function warnAboutConfigAndExit(type, message, edits) {
  _log().default.addNewLineIfNone();

  if (type === 'warn') {
    // The project is using a dynamic config, give the user a helpful log and bail out.
    (0, _log().default)(_log().default.chalk.yellow(message));
  } else {
    logNoConfig();
  }

  notifyAboutManualConfigEdits(edits);
  process.exit(1);
}

function notifyAboutManualConfigEdits(edits) {
  (0, _log().default)(_log().default.chalk.cyan(`Please add the following to your Expo config, and try again... `));

  _log().default.newLine();

  (0, _log().default)(JSON.stringify(edits, null, 2));

  _log().default.newLine();
}
//# sourceMappingURL=ConfigValidation.js.map