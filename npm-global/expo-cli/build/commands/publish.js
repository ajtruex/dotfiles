"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.action = action;
exports.isInvalidReleaseChannel = isInvalidReleaseChannel;
exports.logExpoUpdatesWarnings = logExpoUpdatesWarnings;
exports.logOptimizeWarnings = logOptimizeWarnings;
exports.logBareWorkflowWarnings = logBareWorkflowWarnings;
exports.default = _default;

function _config() {
  const data = require("@expo/config");

  _config = function () {
    return data;
  };

  return data;
}

function _simpleSpinner() {
  const data = _interopRequireDefault(require("@expo/simple-spinner"));

  _simpleSpinner = function () {
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

function _fs() {
  const data = _interopRequireDefault(require("fs"));

  _fs = function () {
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

function _log() {
  const data = _interopRequireDefault(require("../log"));

  _log = function () {
    return data;
  };

  return data;
}

function _sendTo() {
  const data = _interopRequireDefault(require("../sendTo"));

  _sendTo = function () {
    return data;
  };

  return data;
}

function TerminalLink() {
  const data = _interopRequireWildcard(require("./utils/TerminalLink"));

  TerminalLink = function () {
    return data;
  };

  return data;
}

function _logConfigWarnings() {
  const data = require("./utils/logConfigWarnings");

  _logConfigWarnings = function () {
    return data;
  };

  return data;
}

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function action(projectDir, options = {}) {
  var _options$target;

  assertValidReleaseChannel(options.releaseChannel);
  const {
    exp,
    pkg
  } = (0, _config().getConfig)(projectDir, {
    skipSDKVersionRequirement: true
  });
  const {
    sdkVersion,
    isDetached
  } = exp;
  const target = (_options$target = options.target) !== null && _options$target !== void 0 ? _options$target : (0, _config().getDefaultTarget)(projectDir);

  _log().default.addNewLineIfNone(); // Log building info before building.
  // This gives the user sometime to bail out if the info is unexpected.


  if (sdkVersion && target === 'managed') {
    (0, _log().default)(`- Expo SDK: ${_log().default.chalk.bold(exp.sdkVersion)}`);
  }

  (0, _log().default)(`- Release channel: ${_log().default.chalk.bold(options.releaseChannel)}`);
  (0, _log().default)(`- Workflow: ${_log().default.chalk.bold(target.replace(/\b\w/g, l => l.toUpperCase()))}`);

  _log().default.newLine(); // Log warnings.


  if (!isDetached && !options.duringBuild) {
    // Check for SDK version and release channel mismatches only after displaying the values.
    await logSDKMismatchWarningsAsync({
      projectRoot: projectDir,
      releaseChannel: options.releaseChannel,
      sdkVersion
    });
  }

  logExpoUpdatesWarnings(pkg);
  logOptimizeWarnings({
    projectRoot: projectDir
  });

  if (!options.target && target === 'bare') {
    logBareWorkflowWarnings(pkg);
  }

  _log().default.addNewLineIfNone(); // Build and publish the project.


  (0, _log().default)(`Building optimized bundles and generating sourcemaps...`);

  if (options.quiet) {
    _simpleSpinner().default.start();
  }

  const result = await _xdl().Project.publishAsync(projectDir, {
    releaseChannel: options.releaseChannel,
    quiet: options.quiet,
    target,
    resetCache: options.clear
  });
  const url = result.url;

  if (options.quiet) {
    _simpleSpinner().default.stop();
  }

  (0, _log().default)('Publish complete');

  _log().default.newLine();

  logManifestUrl({
    url,
    sdkVersion: exp.sdkVersion
  });

  if (target === 'managed') {
    // TODO: replace with websiteUrl from server when it is available, if that makes sense.
    const websiteUrl = url.replace('exp.host', 'expo.io'); // note(brentvatne): disable copy to clipboard functionality for now, need to think more about
    // whether this is desirable.
    //
    // Attempt to copy the URL to the clipboard, if it succeeds then append a notice to the log.
    // const copiedToClipboard = copyToClipboard(websiteUrl);

    logProjectPageUrl({
      url: websiteUrl,
      copiedToClipboard: false
    }); // Only send the link for managed projects.

    const recipient = await _sendTo().default.getRecipient(options.sendTo);

    if (recipient) {
      await _sendTo().default.sendUrlAsync(websiteUrl, recipient);
    }
  }

  _log().default.newLine();

  return result;
}

function isInvalidReleaseChannel(releaseChannel) {
  const channelRe = new RegExp(/^[a-z\d][a-z\d._-]*$/);
  return !!releaseChannel && !channelRe.test(releaseChannel);
} // TODO(Bacon): should we prompt with a normalized value?


function assertValidReleaseChannel(releaseChannel) {
  if (isInvalidReleaseChannel(releaseChannel)) {
    _log().default.error('Release channel name can only contain lowercase letters, numbers and special characters . _ and -');

    process.exit(1);
  }
}
/**
 * @example 📝  Manifest: https://exp.host/@bacon/my-app/index.exp?sdkVersion=38.0.0 Learn more: https://expo.fyi/manifest-url
 * @param options
 */


function logManifestUrl({
  url,
  sdkVersion
}) {
  var _getExampleManifestUr;

  const manifestUrl = (_getExampleManifestUr = getExampleManifestUrl(url, sdkVersion)) !== null && _getExampleManifestUr !== void 0 ? _getExampleManifestUr : url;
  (0, _log().default)(`📝  Manifest: ${_log().default.chalk.bold(TerminalLink().fallbackToUrl(url, manifestUrl))} ${_log().default.chalk.dim(TerminalLink().learnMore('https://expo.fyi/manifest-url'))}`);
}
/**
 *
 * @example ⚙️   Project page: https://expo.io/@bacon/my-app [copied to clipboard] Learn more: https://expo.fyi/project-page
 * @param options
 */


function logProjectPageUrl({
  url,
  copiedToClipboard
}) {
  let productionMessage = `⚙️   Project page: ${_log().default.chalk.bold(TerminalLink().fallbackToUrl(url, url))}`;

  if (copiedToClipboard) {
    productionMessage += ` ${_log().default.chalk.gray(`[copied to clipboard]`)}`;
  }

  productionMessage += ` ${_log().default.chalk.dim(TerminalLink().learnMore('https://expo.fyi/project-page'))}`;
  (0, _log().default)(productionMessage);
}

function getExampleManifestUrl(url, sdkVersion) {
  if (!sdkVersion) {
    return null;
  }

  if (url.includes('release-channel') && url.includes('?release-channel')) {
    return url.replace('?release-channel', '/index.exp?release-channel') + `&sdkVersion=${sdkVersion}`;
  } else if (url.includes('?') && !url.includes('release-channel')) {
    // This is the only relevant url query param we are aware of at the time of
    // writing this code, so if there is some other param included we don't know
    // how to deal with it and log nothing.
    return null;
  } else {
    return `${url}/index.exp?sdkVersion=${sdkVersion}`;
  }
}
/**
 * A convenient warning reminding people that they're publishing with an SDK that their published app does not support.
 *
 * @param options
 */


async function logSDKMismatchWarningsAsync({
  projectRoot,
  releaseChannel,
  sdkVersion
}) {
  if (!sdkVersion) {
    return;
  }

  const buildStatus = await _xdl().Project.getBuildStatusAsync(projectRoot, {
    platform: 'all',
    current: true,
    releaseChannel,
    sdkVersion
  });
  const hasMismatch = buildStatus.userHasBuiltExperienceBefore && !buildStatus.userHasBuiltAppBefore;

  if (!hasMismatch) {
    return;
  } // A convenient warning reminding people that they're publishing with an SDK that their published app does not support.


  _log().default.nestedWarn((0, _logConfigWarnings().formatNamedWarning)('URL mismatch', `No standalone app has been built with SDK ${sdkVersion} and release channel "${releaseChannel}" for this project before.\n  OTA updates only work for native projects that have the same SDK version and release channel.`, 'https://docs.expo.io/workflow/publishing/#limitations'));
}

function logExpoUpdatesWarnings(pkg) {
  var _pkg$dependencies, _pkg$dependencies2;

  const hasConflictingUpdatesPackages = ((_pkg$dependencies = pkg.dependencies) === null || _pkg$dependencies === void 0 ? void 0 : _pkg$dependencies['expo-updates']) && ((_pkg$dependencies2 = pkg.dependencies) === null || _pkg$dependencies2 === void 0 ? void 0 : _pkg$dependencies2['expokit']);

  if (!hasConflictingUpdatesPackages) {
    return;
  }

  _log().default.nestedWarn((0, _logConfigWarnings().formatNamedWarning)('Conflicting Updates', `You have both the ${_chalk().default.bold('expokit')} and ${_chalk().default.bold('expo-updates')} packages installed in package.json.\n  These two packages are incompatible and ${_chalk().default.bold('publishing updates with expo-updates will not work if expokit is installed')}.\n  If you intend to use ${_chalk().default.bold('expo-updates')}, please remove ${_chalk().default.bold('expokit')} from your dependencies.`));
}

function logOptimizeWarnings({
  projectRoot
}) {
  const hasOptimized = _fs().default.existsSync(_path().default.join(projectRoot, '/.expo-shared/assets.json'));

  if (hasOptimized) {
    return;
  }

  _log().default.nestedWarn((0, _logConfigWarnings().formatNamedWarning)('Optimization', `Project may contain uncompressed images. Optimizing image assets can improve app size and performance.\n  To fix this, run ${_chalk().default.bold(`npx expo-optimize`)}`, 'https://docs.expo.io/distribution/optimizing-updates/#optimize-images'));
}
/**
 * Warn users if they attempt to publish in a bare project that may also be
 * using Expo client and does not If the developer does not have the Expo
 * package installed then we do not need to warn them as there is no way that
 * it will run in Expo client in development even. We should revisit this with
 * dev client, and possibly also by excluding SDK version for bare
 * expo-updates usage in the future (and then surfacing this as an error in
 * the Expo client app instead)
 *
 * Related: https://github.com/expo/expo/issues/9517
 *
 * @param pkg package.json
 */


function logBareWorkflowWarnings(pkg) {
  var _pkg$dependencies3;

  const hasExpoInstalled = (_pkg$dependencies3 = pkg.dependencies) === null || _pkg$dependencies3 === void 0 ? void 0 : _pkg$dependencies3['expo'];

  if (!hasExpoInstalled) {
    return;
  }

  _log().default.nestedWarn((0, _logConfigWarnings().formatNamedWarning)('Workflow target', `This is a ${_chalk().default.bold('bare workflow')} project. The resulting publish will only run properly inside of a native build of your project. If you want to publish a version of your app that will run in Expo client, please use ${_chalk().default.bold('expo publish --target managed')}. You can skip this warning by explicitly running ${_chalk().default.bold('expo publish --target bare')} in the future.`));
}

function _default(program) {
  program.command('publish [path]').alias('p').description('Deploy a project to Expo hosting').helpGroup('core').option('-q, --quiet', 'Suppress verbose output from the Metro bundler.').option('-s, --send-to [dest]', 'A phone number or email address to send a link to').option('-c, --clear', 'Clear the Metro bundler cache').option('-t, --target [env]', 'Target environment for which this publish is intended. Options are `managed` or `bare`.') // TODO(anp) set a default for this dynamically based on whether we're inside a container?
  .option('--max-workers [num]', 'Maximum number of tasks to allow Metro to spawn.').option('--release-channel <release channel>', "The release channel to publish to. Default is 'default'.", 'default').asyncActionProjectDir(action);
}
//# sourceMappingURL=publish.js.map