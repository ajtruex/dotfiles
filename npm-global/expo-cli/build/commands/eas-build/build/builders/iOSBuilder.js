"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _config() {
  const data = require("@expo/config");

  _config = function () {
    return data;
  };

  return data;
}

function _easBuildJob() {
  const data = require("@expo/eas-build-job");

  _easBuildJob = function () {
    return data;
  };

  return data;
}

function _sortBy() {
  const data = _interopRequireDefault(require("lodash/sortBy"));

  _sortBy = function () {
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

function _read() {
  const data = require("../../../../credentials/credentialsJson/read");

  _read = function () {
    return data;
  };

  return data;
}

function _iOSCredentialsProvider() {
  const data = _interopRequireDefault(require("../../../../credentials/provider/iOSCredentialsProvider"));

  _iOSCredentialsProvider = function () {
    return data;
  };

  return data;
}

function ProvisioningProfileUtils() {
  const data = _interopRequireWildcard(require("../../../../credentials/utils/provisioningProfile"));

  ProvisioningProfileUtils = function () {
    return data;
  };

  return data;
}

function _easJson() {
  const data = require("../../../../easJson");

  _easJson = function () {
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

function _log() {
  const data = _interopRequireDefault(require("../../../../log"));

  _log = function () {
    return data;
  };

  return data;
}

function _prompts() {
  const data = _interopRequireDefault(require("../../../../prompts"));

  _prompts = function () {
    return data;
  };

  return data;
}

function _expoUpdates() {
  const data = require("../../utils/expoUpdates");

  _expoUpdates = function () {
    return data;
  };

  return data;
}

function _git2() {
  const data = require("../../utils/git");

  _git2 = function () {
    return data;
  };

  return data;
}

function _credentials() {
  const data = require("../credentials");

  _credentials = function () {
    return data;
  };

  return data;
}

function _ios() {
  const data = require("../utils/ios");

  _ios = function () {
    return data;
  };

  return data;
}

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class iOSBuilder {
  constructor(ctx) {
    this.ctx = ctx;

    _defineProperty(this, "credentials", void 0);

    _defineProperty(this, "secretEnvs", void 0);

    _defineProperty(this, "scheme", void 0);
  }

  async prepareJobAsync(archiveUrl) {
    if (this.ctx.buildProfile.workflow === _easJson().Workflow.Generic) {
      return (0, _easBuildJob().sanitizeJob)((await this.prepareGenericJobAsync(archiveUrl, this.ctx.buildProfile)));
    } else if (this.ctx.buildProfile.workflow === _easJson().Workflow.Managed) {
      return (0, _easBuildJob().sanitizeJob)((await this.prepareManagedJobAsync(archiveUrl, this.ctx.buildProfile)));
    } else {
      throw new Error("Unknown workflow. Shouldn't happen");
    }
  }

  async ensureCredentialsAsync() {
    this.secretEnvs = await (0, _read().readSecretEnvsAsync)(this.ctx.commandCtx.projectDir);

    if (!this.shouldLoadCredentials()) {
      return;
    }

    const bundleIdentifier = await (0, _ios().getBundleIdentifier)(this.ctx.commandCtx.projectDir, this.ctx.commandCtx.exp);
    const provider = new (_iOSCredentialsProvider().default)(this.ctx.commandCtx.projectDir, {
      projectName: this.ctx.commandCtx.projectName,
      accountName: this.ctx.commandCtx.accountName,
      bundleIdentifier
    }, {
      nonInteractive: this.ctx.commandCtx.nonInteractive,
      skipCredentialsCheck: this.ctx.commandCtx.skipCredentialsCheck
    });
    await provider.initAsync();
    const credentialsSource = await (0, _credentials().ensureCredentialsAsync)(provider, this.ctx.buildProfile.workflow, this.ctx.buildProfile.credentialsSource, this.ctx.commandCtx.nonInteractive);
    this.credentials = await provider.getCredentialsAsync(credentialsSource);
    return credentialsSource;
  }

  async setupAsync() {
    if (this.ctx.buildProfile.workflow === _easJson().Workflow.Generic) {
      var _this$ctx$buildProfil;

      this.scheme = (_this$ctx$buildProfil = this.ctx.buildProfile.scheme) !== null && _this$ctx$buildProfil !== void 0 ? _this$ctx$buildProfil : await this.resolveScheme();
    }
  }

  async ensureProjectConfiguredAsync() {
    const {
      projectDir,
      nonInteractive,
      exp
    } = this.ctx.commandCtx;
    await (0, _git2().modifyAndCommitAsync)(async () => {
      await this.configureEasBuildAsync();
      await (0, _expoUpdates().setUpdatesVersionsIOSAsync)({
        projectDir,
        exp
      });
    }, {
      startMessage: 'Making sure your Xcode project is set up properly',
      commitMessage: 'Configure Xcode project',
      commitSuccessMessage: 'Successfully committed the configuration changes',
      successMessage: 'We configured your Xcode project to build it on the Expo servers',
      nonInteractive
    });
  }

  async configureProjectAsync() {
    const {
      projectDir,
      nonInteractive,
      exp
    } = this.ctx.commandCtx;
    await (0, _git2().modifyAndCommitAsync)(async () => {
      await this.configureEasBuildAsync();
      await (0, _expoUpdates().configureUpdatesIOSAsync)({
        projectDir,
        exp
      });
    }, {
      startMessage: 'Configuring the Xcode project',
      commitMessage: 'Configure Xcode project',
      commitSuccessMessage: 'Successfully committed the configuration changes',
      successMessage: 'We configured your Xcode project to build it on the Expo servers',
      nonInteractive
    });
  }

  async configureEasBuildAsync() {
    if (this.ctx.buildProfile.workflow !== _easJson().Workflow.Generic) {
      return;
    } // TODO: add simulator flow
    // assuming we're building for app store


    if (!this.credentials) {
      throw new Error('Call ensureCredentialsAsync first!');
    }

    const {
      projectDir,
      exp
    } = this.ctx.commandCtx;
    const bundleIdentifier = await (0, _ios().getBundleIdentifier)(projectDir, exp);
    const profileName = ProvisioningProfileUtils().readProfileName(this.credentials.provisioningProfile);
    const appleTeam = ProvisioningProfileUtils().readAppleTeam(this.credentials.provisioningProfile);

    _config().IOSConfig.BundleIdenitifer.setBundleIdentifierForPbxproj(projectDir, bundleIdentifier, false);

    _config().IOSConfig.ProvisioningProfile.setProvisioningProfileForPbxproj(projectDir, {
      profileName,
      appleTeamId: appleTeam.teamId
    });
  }

  async prepareJobCommonAsync(archiveUrl) {
    const buildCredentials = this.credentials ? {
      buildCredentials: {
        provisioningProfileBase64: this.credentials.provisioningProfile,
        distributionCertificate: {
          dataBase64: this.credentials.distributionCertificate.certP12,
          password: this.credentials.distributionCertificate.certPassword
        }
      }
    } : {};
    return {
      platform: _easBuildJob().Platform.iOS,
      projectUrl: archiveUrl,
      secrets: { ...(this.secretEnvs ? {
          secretEnvs: this.secretEnvs
        } : {}),
        ...buildCredentials
      }
    };
  }

  async prepareGenericJobAsync(archiveUrl, buildProfile) {
    const projectRootDirectory = _path().default.relative((await (0, _git().gitRootDirectory)()), process.cwd()) || '.';
    return { ...(await this.prepareJobCommonAsync(archiveUrl)),
      type: _easBuildJob().BuildType.Generic,
      scheme: this.scheme,
      artifactPath: buildProfile.artifactPath,
      releaseChannel: buildProfile.releaseChannel,
      projectRootDirectory
    };
  }

  async prepareManagedJobAsync(archiveUrl, _buildProfile) {
    return { ...(await this.prepareJobCommonAsync(archiveUrl)),
      type: _easBuildJob().BuildType.Managed,
      packageJson: {
        example: 'packageJson'
      },
      manifest: {
        example: 'manifest'
      }
    };
  }

  shouldLoadCredentials() {
    return this.ctx.buildProfile.workflow === _easJson().Workflow.Managed && this.ctx.buildProfile.buildType !== 'simulator' || this.ctx.buildProfile.workflow === _easJson().Workflow.Generic;
  }

  async resolveScheme() {
    const schemes = _config().IOSConfig.Scheme.getSchemesFromXcodeproj(this.ctx.commandCtx.projectDir);

    if (schemes.length === 1) {
      return schemes[0];
    }

    const sortedSchemes = (0, _sortBy().default)(schemes);

    _log().default.newLine();

    (0, _log().default)(`We've found multiple schemes in your Xcode project: ${_log().default.chalk.bold(sortedSchemes.join(', '))}`);
    (0, _log().default)(`You can specify the scheme you want to build at ${_log().default.chalk.bold('builds.ios.PROFILE_NAME.scheme')} in eas.json.`);

    if (this.ctx.commandCtx.nonInteractive) {
      const withoutTvOS = sortedSchemes.filter(i => !i.includes('tvOS'));
      const scheme = withoutTvOS.length > 0 ? withoutTvOS[0] : sortedSchemes[0];
      (0, _log().default)(`You've run Expo CLI in non-interactive mode, choosing the ${_log().default.chalk.bold(scheme)} scheme.`);

      _log().default.newLine();

      return scheme;
    } else {
      const {
        selectedScheme
      } = await (0, _prompts().default)({
        type: 'select',
        name: 'selectedScheme',
        message: 'Which scheme would you like to build now?',
        choices: sortedSchemes.map(scheme => ({
          title: scheme,
          value: scheme
        }))
      });

      _log().default.newLine();

      return selectedScheme;
    }
  }

}

var _default = iOSBuilder;
exports.default = _default;
//# sourceMappingURL=iOSBuilder.js.map