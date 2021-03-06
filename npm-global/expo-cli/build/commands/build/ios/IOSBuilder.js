"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

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

function _pickBy() {
  const data = _interopRequireDefault(require("lodash/pickBy"));

  _pickBy = function () {
    return data;
  };

  return data;
}

function _os() {
  const data = _interopRequireDefault(require("os"));

  _os = function () {
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

function _CommandError() {
  const data = _interopRequireWildcard(require("../../../CommandError"));

  _CommandError = function () {
    return data;
  };

  return data;
}

function apple() {
  const data = _interopRequireWildcard(require("../../../appleApi"));

  apple = function () {
    return data;
  };

  return data;
}

function _list() {
  const data = require("../../../credentials/actions/list");

  _list = function () {
    return data;
  };

  return data;
}

function _context() {
  const data = require("../../../credentials/context");

  _context = function () {
    return data;
  };

  return data;
}

function _route() {
  const data = require("../../../credentials/route");

  _route = function () {
    return data;
  };

  return data;
}

function _IosDistCert() {
  const data = require("../../../credentials/views/IosDistCert");

  _IosDistCert = function () {
    return data;
  };

  return data;
}

function _IosProvisioningProfile() {
  const data = require("../../../credentials/views/IosProvisioningProfile");

  _IosProvisioningProfile = function () {
    return data;
  };

  return data;
}

function _IosPushCredentials() {
  const data = require("../../../credentials/views/IosPushCredentials");

  _IosPushCredentials = function () {
    return data;
  };

  return data;
}

function _SetupIosDist() {
  const data = require("../../../credentials/views/SetupIosDist");

  _SetupIosDist = function () {
    return data;
  };

  return data;
}

function _SetupIosProvisioningProfile() {
  const data = require("../../../credentials/views/SetupIosProvisioningProfile");

  _SetupIosProvisioningProfile = function () {
    return data;
  };

  return data;
}

function _SetupIosPush() {
  const data = require("../../../credentials/views/SetupIosPush");

  _SetupIosPush = function () {
    return data;
  };

  return data;
}

function _log() {
  const data = _interopRequireDefault(require("../../../log"));

  _log = function () {
    return data;
  };

  return data;
}

function _prompts() {
  const data = require("../../../prompts");

  _prompts = function () {
    return data;
  };

  return data;
}

function _ConfigValidation() {
  const data = require("../../eject/ConfigValidation");

  _ConfigValidation = function () {
    return data;
  };

  return data;
}

function TerminalLink() {
  const data = _interopRequireWildcard(require("../../utils/TerminalLink"));

  TerminalLink = function () {
    return data;
  };

  return data;
}

function _BaseBuilder() {
  const data = _interopRequireDefault(require("../BaseBuilder"));

  _BaseBuilder = function () {
    return data;
  };

  return data;
}

function _constants() {
  const data = require("../constants");

  _constants = function () {
    return data;
  };

  return data;
}

function utils() {
  const data = _interopRequireWildcard(require("../utils"));

  utils = function () {
    return data;
  };

  return data;
}

function _image() {
  const data = require("./utils/image");

  _image = function () {
    return data;
  };

  return data;
}

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const noBundleIdMessage = `Your project must have a \`bundleIdentifier\` set in the Expo config (app.json or app.config.js).\nSee https://expo.fyi/bundle-identifier`;

function missingBundleIdentifierError() {
  return new (_xdl().XDLError)('INVALID_OPTIONS', noBundleIdMessage);
}

class IOSBuilder extends _BaseBuilder().default {
  async run() {
    // This gets run after all other validation to prevent users from having to answer this question multiple times.
    this.options.type = await utils().askBuildType(this.options.type, {
      archive: 'Deploy the build to the store',
      simulator: 'Run the build on a simulator'
    });
    this.maybeWarnDamagedSimulator();

    _log().default.addNewLineIfNone();

    await this.checkForBuildInProgress();

    if (this.options.type === 'archive') {
      await this.prepareCredentials();
    }

    const publishedExpIds = await this.ensureProjectIsPublished();

    if (!this.options.publicUrl) {
      await this.checkStatusBeforeBuild();
    }

    await this.build(publishedExpIds);
    this.maybeExplainUploadStep();
    this.maybeWarnDamagedSimulator();
  } // Try to get the user to provide Apple credentials upfront
  // We will be able to do full validation of their iOS creds this way


  async bestEffortAppleCtx(ctx) {
    if (ctx.hasAppleCtx()) {
      // skip prompts if already have apple ctx
      return;
    }

    if (this.options.appleId) {
      // skip prompts and auto authenticate if flags are passed
      return await ctx.ensureAppleCtx();
    }

    const nonInteractive = this.options.parent && this.options.parent.nonInteractive;

    if (nonInteractive) {
      return;
    }

    const confirm = await (0, _prompts().confirmAsync)({
      message: `Do you have access to the Apple account that will be used for submitting this app to the App Store?`
    });

    if (confirm) {
      return await ctx.ensureAppleCtx();
    } else {
      (0, _log().default)(_chalk().default.green('No problem! 👌 \nWe can’t auto-generate credentials if you don’t have access to the main Apple account. \nBut we can still set it up if you upload your credentials.'));
    }
  } // All config validation should happen here before any build logic takes place.
  // It's important that the errors are revealed in a thoughtful manner.


  async checkProjectConfig() {
    // Run this first because the error messages are related
    // to ExpoKit which is harder to change than the bundle ID.
    await super.checkProjectConfig(); // Check the SDK version next as it's the second hardest thing to change.

    const sdkVersion = this.manifest.sdkVersion;
    await utils().checkIfSdkIsSupported(sdkVersion, _constants().PLATFORMS.IOS); // Validate the icon third since it's fairly easy to modify.

    await this.validateIcon(); // Check the bundle ID and possibly prompt the user to add a new one.

    await (0, _ConfigValidation().getOrPromptForBundleIdentifier)(this.projectDir); // Update with the latest bundle ID

    this.updateProjectConfig();
  }

  async getAccountNameAsync() {
    var _await$this$getUserAs;

    if (this.manifest.owner) return this.manifest.owner;
    return (_await$this$getUserAs = await this.getUserAsync()) === null || _await$this$getUserAs === void 0 ? void 0 : _await$this$getUserAs.username;
  }

  async prepareCredentials() {
    var _this$manifest$ios, _this$options$parent;

    const accountName = await this.getAccountNameAsync();
    const projectName = this.manifest.slug;
    const bundleIdentifier = (_this$manifest$ios = this.manifest.ios) === null || _this$manifest$ios === void 0 ? void 0 : _this$manifest$ios.bundleIdentifier;
    if (!bundleIdentifier) throw missingBundleIdentifierError();
    const appLookupParams = {
      accountName,
      projectName,
      bundleIdentifier
    };
    const context = new (_context().Context)();
    await context.init(this.projectDir, { ...this.options,
      nonInteractive: (_this$options$parent = this.options.parent) === null || _this$options$parent === void 0 ? void 0 : _this$options$parent.nonInteractive
    });

    if (this.options.skipCredentialsCheck) {
      (0, _log().default)('Skipping credentials check...');
      return;
    }

    await this.bestEffortAppleCtx(context);
    await this.clearAndRevokeCredentialsIfRequested(context, appLookupParams);

    try {
      await this.produceCredentials(context, appLookupParams);
    } catch (e) {
      if (e.code === _CommandError().ErrorCodes.NON_INTERACTIVE) {
        _log().default.newLine();

        const link = TerminalLink().fallbackToTextAndUrl('expo.fyi/credentials-non-interactive', 'https://expo.fyi/credentials-non-interactive');
        (0, _log().default)(_chalk().default.bold.red(`Additional information needed to setup credentials in non-interactive mode.`));
        (0, _log().default)(_chalk().default.bold.red(`Learn more about how to resolve this: ${link}.`));

        _log().default.newLine(); // We don't want to display project credentials when we bail out due to
        // non-interactive mode error, because we are unable to recover without
        // user input.


        throw new (_CommandError().default)(_CommandError().ErrorCodes.NON_INTERACTIVE, 'Unable to proceed, see the above error message.');
      }

      (0, _log().default)(_chalk().default.bold.red('Failed to prepare all credentials. \nThe next time you build, we will automatically use the following configuration:'));
      throw e;
    } finally {
      const appCredentials = await context.ios.getAppCredentials(appLookupParams);
      const pushCredentials = await context.ios.getPushKey(appLookupParams);
      const distCredentials = await context.ios.getDistCert(appLookupParams);
      (0, _list().displayProjectCredentials)(appLookupParams, appCredentials, pushCredentials, distCredentials);
    }
  }

  async _setupDistCert(ctx, appLookupParams) {
    try {
      const distCertFromParams = await (0, _IosDistCert().getDistCertFromParams)(this.options);

      if (distCertFromParams) {
        await (0, _IosDistCert().useDistCertFromParams)(ctx, appLookupParams, distCertFromParams);
      } else {
        await (0, _route().runCredentialsManager)(ctx, new (_SetupIosDist().SetupIosDist)(appLookupParams));
      }
    } catch (e) {
      _log().default.error('Failed to set up Distribution Certificate');

      throw e;
    }
  }

  async _setupPushCert(ctx, appLookupParams) {
    try {
      const pushKeyFromParams = await (0, _IosPushCredentials().getPushKeyFromParams)(this.options);

      if (pushKeyFromParams) {
        await (0, _IosPushCredentials().usePushKeyFromParams)(ctx, appLookupParams, pushKeyFromParams);
      } else {
        await (0, _route().runCredentialsManager)(ctx, new (_SetupIosPush().SetupIosPush)(appLookupParams));
      }
    } catch (e) {
      _log().default.error('Failed to set up Push Key');

      throw e;
    }
  }

  async _setupProvisioningProfile(ctx, appLookupParams) {
    try {
      const provisioningProfileFromParams = await (0, _IosProvisioningProfile().getProvisioningProfileFromParams)(this.options.provisioningProfilePath);

      if (provisioningProfileFromParams) {
        await (0, _IosProvisioningProfile().useProvisioningProfileFromParams)(ctx, appLookupParams, provisioningProfileFromParams);
      } else {
        await (0, _route().runCredentialsManager)(ctx, new (_SetupIosProvisioningProfile().SetupIosProvisioningProfile)(appLookupParams));
      }
    } catch (e) {
      _log().default.error('Failed to set up Provisioning Profile');

      throw e;
    }
  }

  async produceCredentials(ctx, appLookupParams) {
    if (ctx.hasAppleCtx()) {
      await apple().ensureAppExists(ctx.appleCtx, appLookupParams, {
        enablePushNotifications: true
      });
    }

    await this._setupDistCert(ctx, appLookupParams);
    await this._setupPushCert(ctx, appLookupParams);
    await this._setupProvisioningProfile(ctx, appLookupParams);
  }

  async clearAndRevokeCredentialsIfRequested(ctx, appLookupParams) {
    const {
      clearCredentials,
      clearDistCert,
      clearPushKey,
      clearPushCert,
      clearProvisioningProfile
    } = this.options;
    const shouldClearAnything = clearCredentials || clearDistCert || clearPushKey || clearPushCert || clearProvisioningProfile;

    if (shouldClearAnything) {
      const credsToClear = this.determineCredentialsToClear();
      await this.clearCredentials(ctx, appLookupParams, credsToClear);
    }
  }

  async clearCredentials(ctx, appLookupParams, credsToClear) {
    const shouldRevokeOnApple = this.options.revokeCredentials;
    const provisioningProfile = await ctx.ios.getProvisioningProfile(appLookupParams);

    if (credsToClear.provisioningProfile && provisioningProfile) {
      const view = new (_IosProvisioningProfile().RemoveProvisioningProfile)(appLookupParams.accountName, shouldRevokeOnApple);
      await view.removeSpecific(ctx, appLookupParams);
    }

    const distributionCert = await ctx.ios.getDistCert(appLookupParams);

    if (credsToClear.distributionCert && distributionCert) {
      const view = new (_IosDistCert().RemoveIosDist)(appLookupParams.accountName, shouldRevokeOnApple);
      await view.removeSpecific(ctx, distributionCert);
    }

    const pushKey = await ctx.ios.getPushKey(appLookupParams);

    if (credsToClear.pushKey && pushKey) {
      const view = new (_IosPushCredentials().RemoveIosPush)(appLookupParams.accountName, shouldRevokeOnApple);
      await view.removeSpecific(ctx, pushKey);
    }

    const pushCert = await ctx.ios.getPushCert(appLookupParams);

    if (credsToClear.pushCert && pushCert) {
      await ctx.ios.deletePushCert(appLookupParams);
    }
  }

  determineCredentialsToClear() {
    const {
      clearCredentials,
      clearDistCert,
      clearPushKey,
      clearPushCert,
      clearProvisioningProfile
    } = this.options;
    const credsToClearAll = {
      distributionCert: Boolean(clearCredentials || clearDistCert),
      pushKey: Boolean(clearCredentials || clearPushKey),
      // TODO: backward compatibility, remove when all users migrate to push keys
      pushCert: Boolean(clearCredentials || clearPushCert),
      provisioningProfile: Boolean(clearCredentials || clearProvisioningProfile)
    };
    return (0, _pickBy().default)(credsToClearAll);
  }

  async ensureProjectIsPublished() {
    if (this.options.publicUrl) {
      return undefined;
    } else {
      return await this.ensureReleaseExists();
    }
  }

  platform() {
    return _constants().PLATFORMS.IOS;
  } // validates whether the icon doesn't have transparency


  async validateIcon() {
    // TODO: maybe recommend the icon builder website.
    try {
      var _this$manifest$ios$ic, _this$manifest$ios2;

      const icon = (_this$manifest$ios$ic = (_this$manifest$ios2 = this.manifest.ios) === null || _this$manifest$ios2 === void 0 ? void 0 : _this$manifest$ios2.icon) !== null && _this$manifest$ios$ic !== void 0 ? _this$manifest$ios$ic : this.manifest.icon;

      if (!icon) {
        // icon is optional
        return;
      }

      await (0, _image().ensurePNGIsNotTransparent)(icon);
    } catch (err) {
      if (err instanceof _xdl().XDLError) {
        throw err;
      } else {// something weird happened, let's assume the icon is correct
      }
    }
  }

  maybeExplainUploadStep() {
    if (process.platform !== 'darwin' || this.options.type === 'simulator') {
      return;
    }

    _log().default.newLine();

    (0, _log().default)(`You can now publish to the App Store with ${TerminalLink().transporterAppLink()} or ${_chalk().default.bold('expo upload:ios')}. ${TerminalLink().learnMore('https://docs.expo.io/distribution/uploading-apps/')}`);
  } // warns for "damaged" builds when targeting simulator
  // see: https://github.com/expo/expo-cli/issues/1197


  maybeWarnDamagedSimulator() {
    // see: https://en.wikipedia.org/wiki/Darwin_%28operating_system%29#Release_history
    const isMacOsCatalinaOrLater = _os().default.platform() === 'darwin' && _semver().default.satisfies(_os().default.release(), '>=19.0.0');

    if (isMacOsCatalinaOrLater && this.options.type === 'simulator') {
      _log().default.newLine();

      (0, _log().default)(_chalk().default.bold(`🚨 If the build is not installable on your simulator because of "${_chalk().default.underline(`... is damaged and can't be opened.`)}", please run:`));
      (0, _log().default)(_chalk().default.grey.bold('xattr -rd com.apple.quarantine /path/to/your.app'));
    }
  }

}

var _default = IOSBuilder;
exports.default = _default;
//# sourceMappingURL=IOSBuilder.js.map