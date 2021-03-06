"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

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

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function () {
    return data;
  };

  return data;
}

function _cliTable() {
  const data = _interopRequireDefault(require("cli-table3"));

  _cliTable = function () {
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

function _ora() {
  const data = _interopRequireDefault(require("ora"));

  _ora = function () {
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
  const data = _interopRequireDefault(require("../../CommandError"));

  _CommandError = function () {
    return data;
  };

  return data;
}

function appleApi() {
  const data = _interopRequireWildcard(require("../../appleApi"));

  appleApi = function () {
    return data;
  };

  return data;
}

function _fastlane() {
  const data = require("../../appleApi/fastlane");

  _fastlane = function () {
    return data;
  };

  return data;
}

function _IosApi() {
  const data = require("../../credentials/api/IosApi");

  _IosApi = function () {
    return data;
  };

  return data;
}

function _context() {
  const data = require("../../credentials/context");

  _context = function () {
    return data;
  };

  return data;
}

function _route() {
  const data = require("../../credentials/route");

  _route = function () {
    return data;
  };

  return data;
}

function _IosDistCert() {
  const data = require("../../credentials/views/IosDistCert");

  _IosDistCert = function () {
    return data;
  };

  return data;
}

function _IosProvisioningProfileAdhoc() {
  const data = require("../../credentials/views/IosProvisioningProfileAdhoc");

  _IosProvisioningProfileAdhoc = function () {
    return data;
  };

  return data;
}

function _SetupIosDist() {
  const data = require("../../credentials/views/SetupIosDist");

  _SetupIosDist = function () {
    return data;
  };

  return data;
}

function _SetupIosPush() {
  const data = require("../../credentials/views/SetupIosPush");

  _SetupIosPush = function () {
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

function _urlOpts() {
  const data = _interopRequireDefault(require("../../urlOpts"));

  _urlOpts = function () {
    return data;
  };

  return data;
}

function ClientUpgradeUtils() {
  const data = _interopRequireWildcard(require("../utils/ClientUpgradeUtils"));

  ClientUpgradeUtils = function () {
    return data;
  };

  return data;
}

function _clientBuildApi() {
  const data = require("./clientBuildApi");

  _clientBuildApi = function () {
    return data;
  };

  return data;
}

function _generateBundleIdentifier() {
  const data = _interopRequireDefault(require("./generateBundleIdentifier"));

  _generateBundleIdentifier = function () {
    return data;
  };

  return data;
}

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(program) {
  program.command('client:ios [path]').helpGroup('experimental').description('Experimental: build a custom version of the Expo client for iOS using your own Apple credentials').longDescription('Build a custom version of the Expo client for iOS using your own Apple credentials and install it on your mobile device using Safari.').option('--apple-id <login>', 'Apple ID username (please also set the Apple ID password as EXPO_APPLE_PASSWORD environment variable).').asyncActionProjectDir(async (projectDir, options) => {
    var _exp$ios$config, _options$parent;

    const disabledServices = {
      pushNotifications: {
        name: 'Push Notifications',
        reason: 'not yet available until API tokens are supported for the Push Notification system'
      }
    }; // get custom project manifest if it exists
    // Note: this is the current developer's project, NOT the Expo client's manifest

    const spinner = (0, _ora().default)(`Finding custom configuration for the Expo client...`).start();

    if (options.config) {
      (0, _config().setCustomConfigPath)(projectDir, options.config);
    }

    const {
      exp
    } = (0, _config().getConfig)(projectDir, {
      skipSDKVersionRequirement: true
    });

    if (exp) {
      spinner.succeed(`Found custom configuration for the Expo client`);
    } else {
      spinner.warn(`Unable to find custom configuration for the Expo client`);
    }

    if (!exp.ios) exp.ios = {};

    if (!exp.facebookAppId || !exp.facebookScheme) {
      const disabledReason = exp ? `facebookAppId or facebookScheme are missing from app configuration. ` : 'No custom configuration file could be found. You will need to provide a json file with valid facebookAppId and facebookScheme fields.';
      disabledServices.facebookLogin = {
        name: 'Facebook Login',
        reason: disabledReason
      };
    }

    if (!((_exp$ios$config = exp.ios.config) === null || _exp$ios$config === void 0 ? void 0 : _exp$ios$config.googleMapsApiKey)) {
      const disabledReason = exp ? `ios.config.googleMapsApiKey does not exist in the app configuration.` : 'No custom configuration file could be found. You will need to provide a json file with a valid ios.config.googleMapsApiKey field.';
      disabledServices.googleMaps = {
        name: 'Google Maps',
        reason: disabledReason
      };
    }

    if (exp.ios.googleServicesFile) {
      const contents = await _fsExtra().default.readFile(_path().default.resolve(projectDir, exp.ios.googleServicesFile), 'base64');
      exp.ios.googleServicesFile = contents;
    }

    const user = await _xdl().UserManager.getCurrentUserAsync();
    const context = new (_context().Context)();
    await context.init(projectDir, { ...options,
      allowAnonymous: true,
      nonInteractive: (_options$parent = options.parent) === null || _options$parent === void 0 ? void 0 : _options$parent.nonInteractive
    });
    await context.ensureAppleCtx();
    const appleContext = context.appleCtx;

    if (user) {
      await context.ios.getAllCredentials(user.username); // initialize credentials
    } // check if any builds are in flight


    const {
      isAllowed,
      errorMessage
    } = await (0, _clientBuildApi().isAllowedToBuild)({
      user,
      appleTeamId: appleContext.team.id
    });

    if (!isAllowed) {
      throw new (_CommandError().default)('CLIENT_BUILD_REQUEST_NOT_ALLOWED', `New Expo client build request disallowed. Reason: ${errorMessage}`);
    }

    const bundleIdentifier = (0, _generateBundleIdentifier().default)(appleContext.team.id);
    const experienceName = await (0, _clientBuildApi().getExperienceName)({
      user,
      appleTeamId: appleContext.team.id
    });
    const appLookupParams = (0, _IosApi().getAppLookupParams)(experienceName, bundleIdentifier);
    await appleApi().ensureAppExists(appleContext, appLookupParams, {
      enablePushNotifications: true
    });
    const {
      devices
    } = await (0, _fastlane().runAction)(_fastlane().travelingFastlane.listDevices, ['--all-ios-profile-devices', appleContext.appleId, appleContext.appleIdPassword, appleContext.team.id]);
    const udids = devices.map(device => device.deviceNumber);
    let distributionCert;

    if (user) {
      await (0, _route().runCredentialsManager)(context, new (_SetupIosDist().SetupIosDist)(appLookupParams));
      distributionCert = await context.ios.getDistCert(appLookupParams);
    } else {
      distributionCert = await new (_IosDistCert().CreateIosDist)(appLookupParams.accountName).provideOrGenerate(context);
    }

    if (!distributionCert) {
      throw new (_CommandError().default)('INSUFFICIENT_CREDENTIALS', `This build request requires a valid distribution certificate.`);
    }

    let pushKey;

    if (user) {
      await (0, _route().runCredentialsManager)(context, new (_SetupIosPush().SetupIosPush)(appLookupParams));
      pushKey = await context.ios.getPushKey(appLookupParams);
    }

    let provisioningProfile;
    const createOrReuseProfile = new (_IosProvisioningProfileAdhoc().CreateOrReuseProvisioningProfileAdhoc)(appLookupParams, {
      distCertSerialNumber: distributionCert.distCertSerialNumber,
      udids
    });

    if (user) {
      await (0, _route().runCredentialsManager)(context, createOrReuseProfile);
      provisioningProfile = await context.ios.getProvisioningProfile(appLookupParams);
    } else {
      provisioningProfile = await createOrReuseProfile.createOrReuse(context);
    }

    if (!provisioningProfile) {
      throw new (_CommandError().default)('INSUFFICIENT_CREDENTIALS', `This build request requires a valid provisioning profile.`);
    } // push notifications won't work if we dont have any push creds
    // we also dont store anonymous creds, so user needs to be logged in


    if (pushKey === null || !user) {
      const disabledReason = pushKey === null ? 'you did not upload your push credentials' : 'we require you to be logged in to store push credentials'; // TODO(quin): remove this when we fix push notifications
      // keep the default push notification reason if we haven't implemented API tokens

      disabledServices.pushNotifications.reason = disabledServices.pushNotifications.reason || disabledReason;
    }

    if (Object.keys(disabledServices).length > 0) {
      _log().default.newLine();

      _log().default.warn('These services will be disabled in your custom Expo client:');

      const table = new (_cliTable().default)({
        head: ['Service', 'Reason'],
        style: {
          head: ['cyan']
        }
      });
      table.push(...Object.keys(disabledServices).map(serviceKey => {
        const service = disabledServices[serviceKey];
        return [service.name, service.reason];
      }));
      (0, _log().default)(table.toString());
      (0, _log().default)('See https://docs.expo.io/guides/adhoc-builds/#optional-additional-configuration-steps for more details.');
    }

    let email;

    if (user) {
      email = user.email;
    } else {
      var _context$user;

      ({
        email
      } = await (0, _prompt().default)({
        name: 'email',
        message: 'Please enter an email address to notify, when the build is completed:',
        default: context === null || context === void 0 ? void 0 : (_context$user = context.user) === null || _context$user === void 0 ? void 0 : _context$user.email,
        filter: value => value.trim(),
        validate: value => /.+@.+/.test(value) ? true : "That doesn't look like a valid email."
      }));
    }

    _log().default.newLine();

    let addUdid;

    if (udids.length === 0) {
      (0, _log().default)('There are no devices registered to your Apple Developer account. Please follow the instructions below to register an iOS device.');
      addUdid = true;
    } else {
      (0, _log().default)('Custom builds of the Expo client can only be installed on devices which have been registered with Apple at build-time.');
      (0, _log().default)('These devices are currently registered on your Apple Developer account:');
      const table = new (_cliTable().default)({
        head: ['Name', 'Identifier'],
        style: {
          head: ['cyan']
        }
      });
      table.push(...devices.map(device => [device.name, device.deviceNumber]));
      (0, _log().default)(table.toString());
      const udidPrompt = await (0, _prompts().confirmAsync)({
        message: 'Would you like to register a new device to use the Expo client with?'
      });
      addUdid = udidPrompt;
    }

    const result = await (0, _clientBuildApi().createClientBuildRequest)({
      user,
      appleContext,
      distributionCert,
      provisioningProfile,
      pushKey,
      udids,
      addUdid,
      email,
      bundleIdentifier,
      customAppConfig: exp
    });

    _log().default.newLine();

    if (addUdid) {
      _urlOpts().default.printQRCode(result.registrationUrl);

      (0, _log().default)('Open the following link on your iOS device (or scan the QR code) and follow the instructions to install the development profile:');

      _log().default.newLine();

      (0, _log().default)(_chalk().default.green(`${result.registrationUrl}`));

      _log().default.newLine();

      (0, _log().default)('Please note that you can only register one iOS device per request.');
      (0, _log().default)("After you register your device, we'll start building your client, and you'll receive an email when it's ready to install.");
    } else {
      _urlOpts().default.printQRCode(result.statusUrl);

      (0, _log().default)('Your custom Expo client is being built! 🛠');
      (0, _log().default)('Open this link on your iOS device (or scan the QR code) to view build logs and install the client:');

      _log().default.newLine();

      (0, _log().default)(_chalk().default.green(`${result.statusUrl}`));
    }

    _log().default.newLine();
  });
  program.command('client:install:ios').description('Install the Expo client for iOS on the simulator').option('--latest', `Install the latest version of Expo client, ignoring the current project version.`).helpGroup('client').asyncAction(async command => {
    const forceLatest = !!command.latest;
    const currentSdkConfig = await ClientUpgradeUtils().getExpoSdkConfig(process.cwd());
    const currentSdkVersion = currentSdkConfig ? currentSdkConfig.sdkVersion : undefined;
    const sdkVersions = await _xdl().Versions.sdkVersionsAsync();
    const latestSdk = await _xdl().Versions.newestReleasedSdkVersionAsync();
    const currentSdk = sdkVersions[currentSdkVersion];
    const recommendedClient = ClientUpgradeUtils().getClient('ios', currentSdk);
    const latestClient = ClientUpgradeUtils().getClient('ios', latestSdk.data);

    if (forceLatest) {
      if (!(latestClient === null || latestClient === void 0 ? void 0 : latestClient.url)) {
        _log().default.error(`Unable to find latest client version. Check your internet connection or run this command again without the ${_chalk().default.bold('--latest')} flag.`);

        return;
      }

      if (await _xdl().Simulator.upgradeExpoAsync({
        url: latestClient.url,
        version: latestClient.version
      })) {
        (0, _log().default)('Done!');
      } else {
        _log().default.error(`Unable to install Expo client ${latestClient.version} for iOS.`);
      }

      return;
    }

    if (!currentSdkVersion) {
      (0, _log().default)('Could not find your Expo project. If you run this from a project, we can help pick the right Expo client version!');
    }

    if (currentSdk && !recommendedClient) {
      (0, _log().default)(`You are currently using SDK ${currentSdkVersion}. Unfortunately, we couldn't detect the proper client version for this SDK.`);
    }

    if (currentSdk && recommendedClient) {
      const recommendedClientVersion = recommendedClient.version || 'version unknown';
      const answer = await (0, _prompts().confirmAsync)({
        message: `You are currently using SDK ${currentSdkVersion}. Would you like to install client ${recommendedClientVersion} released for this SDK?`
      });

      if (answer) {
        await _xdl().Simulator.upgradeExpoAsync({
          url: recommendedClient.url,
          version: recommendedClient.version
        });
        (0, _log().default)('Done!');
        return;
      }
    } else {
      const answer = await (0, _prompts().confirmAsync)({
        message: (latestClient === null || latestClient === void 0 ? void 0 : latestClient.version) ? (0, _chalk().default)`Do you want to install the latest client? {dim (${latestClient.version})}` : 'Do you want to install the latest client?'
      });

      if (answer) {
        await _xdl().Simulator.upgradeExpoAsync({
          url: latestClient === null || latestClient === void 0 ? void 0 : latestClient.url,
          version: latestClient === null || latestClient === void 0 ? void 0 : latestClient.version
        });
        (0, _log().default)('Done!');
        return;
      }
    }

    const availableClients = ClientUpgradeUtils().getAvailableClients({
      sdkVersions,
      project: currentSdkConfig,
      platform: 'ios'
    });

    if (availableClients.length === 0) {
      const answer = await (0, _prompts().confirmAsync)({
        message: currentSdk ? `We don't have a compatible client for SDK ${currentSdkVersion}. Do you want to try the latest client?` : "It looks like we don't have a compatible client. Do you want to try the latest client?"
      });

      if (answer) {
        await _xdl().Simulator.upgradeExpoAsync({
          url: latestClient === null || latestClient === void 0 ? void 0 : latestClient.url,
          version: latestClient === null || latestClient === void 0 ? void 0 : latestClient.version
        });
        (0, _log().default)('Done!');
      } else {
        (0, _log().default)('No client to install');
      }

      return;
    }

    const targetClient = await ClientUpgradeUtils().askClientToInstall({
      currentSdkVersion,
      latestSdkVersion: latestSdk.version,
      clients: availableClients
    });

    if (await _xdl().Simulator.upgradeExpoAsync({
      url: targetClient.clientUrl
    })) {
      (0, _log().default)('Done!');
    }
  });
  program.command('client:install:android').description('Install the Expo client for Android on a connected device or emulator').option('--latest', `Install the latest version of Expo client, ignore the current project version.`).helpGroup('client').asyncAction(async command => {
    const forceLatest = !!command.latest;
    const currentSdkConfig = await ClientUpgradeUtils().getExpoSdkConfig(process.cwd());
    const currentSdkVersion = currentSdkConfig ? currentSdkConfig.sdkVersion : undefined;
    const sdkVersions = await _xdl().Versions.sdkVersionsAsync();
    const latestSdk = await _xdl().Versions.newestReleasedSdkVersionAsync();
    const currentSdk = sdkVersions[currentSdkVersion];
    const recommendedClient = ClientUpgradeUtils().getClient('android', currentSdk);
    const latestClient = ClientUpgradeUtils().getClient('android', latestSdk.data);

    if (forceLatest) {
      if (!(latestClient === null || latestClient === void 0 ? void 0 : latestClient.url)) {
        _log().default.error(`Unable to find latest client version. Check your internet connection or run this command again without the ${_chalk().default.bold('--latest')} flag.`);

        return;
      }

      if (await _xdl().Android.upgradeExpoAsync({
        url: latestClient.url,
        version: latestClient.version
      })) {
        (0, _log().default)('Done!');
      } else {
        _log().default.error(`Unable to install Expo client ${latestClient.version} for Android.`);
      }

      return;
    }

    if (!currentSdkVersion) {
      (0, _log().default)('Could not find your Expo project. If you run this from a project, we can help pick the right Expo client version!');
    }

    if (currentSdk && !recommendedClient) {
      (0, _log().default)(`You are currently using SDK ${currentSdkVersion}. Unfortunately, we couldn't detect the proper client version for this SDK.`);
    }

    if (currentSdk && recommendedClient) {
      const recommendedClientVersion = recommendedClient.version || 'version unknown';
      const answer = await (0, _prompts().confirmAsync)({
        message: `You are currently using SDK ${currentSdkVersion}. Would you like to install client ${recommendedClientVersion} released for this SDK?`
      });

      if (answer) {
        await _xdl().Android.upgradeExpoAsync({
          url: recommendedClient.url,
          version: recommendedClient.version
        });
        (0, _log().default)('Done!');
        return;
      }
    } else {
      const answer = await (0, _prompts().confirmAsync)({
        message: (latestClient === null || latestClient === void 0 ? void 0 : latestClient.version) ? (0, _chalk().default)`Do you want to install the latest client? {dim (${latestClient.version})}` : 'Do you want to install the latest client?'
      });

      if (answer) {
        await _xdl().Android.upgradeExpoAsync({
          url: latestClient === null || latestClient === void 0 ? void 0 : latestClient.url,
          version: latestClient === null || latestClient === void 0 ? void 0 : latestClient.version
        });
        (0, _log().default)('Done!');
        return;
      }
    }

    const availableClients = ClientUpgradeUtils().getAvailableClients({
      sdkVersions,
      project: currentSdkConfig,
      platform: 'android'
    });

    if (availableClients.length === 0) {
      const answer = await (0, _prompts().confirmAsync)({
        message: currentSdk ? `We don't have a compatible client for SDK ${currentSdkVersion}. Do you want to try the latest client?` : "It looks like we don't have a compatible client. Do you want to try the latest client?"
      });

      if (answer) {
        await _xdl().Android.upgradeExpoAsync({
          url: latestClient === null || latestClient === void 0 ? void 0 : latestClient.url,
          version: latestClient === null || latestClient === void 0 ? void 0 : latestClient.version
        });
        (0, _log().default)('Done!');
      } else {
        (0, _log().default)('No client to install');
      }

      return;
    }

    const targetClient = await ClientUpgradeUtils().askClientToInstall({
      currentSdkVersion,
      latestSdkVersion: latestSdk.version,
      clients: availableClients
    });

    if (await _xdl().Android.upgradeExpoAsync({
      url: targetClient.clientUrl
    })) {
      (0, _log().default)('Done!');
    }
  });
}
//# sourceMappingURL=index.js.map