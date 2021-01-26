"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _easBuildJob() {
  const data = require("@expo/eas-build-job");

  _easBuildJob = function () {
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

function _read() {
  const data = require("../../../../credentials/credentialsJson/read");

  _read = function () {
    return data;
  };

  return data;
}

function _AndroidCredentialsProvider() {
  const data = _interopRequireDefault(require("../../../../credentials/provider/AndroidCredentialsProvider"));

  _AndroidCredentialsProvider = function () {
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

function _gradleContent() {
  const data = _interopRequireDefault(require("../templates/gradleContent"));

  _gradleContent = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function hasApplyLine(content, applyLine) {
  return content.split('\n') // Check for both single and double quotes
  .some(line => line === applyLine || line === applyLine.replace(/"/g, "'"));
}

class AndroidBuilder {
  constructor(ctx) {
    this.ctx = ctx;

    _defineProperty(this, "credentials", void 0);

    _defineProperty(this, "secretEnvs", void 0);

    _defineProperty(this, "credentialsPrepared", false);
  }

  async setupAsync() {}

  async ensureCredentialsAsync() {
    this.credentialsPrepared = true;
    this.secretEnvs = await (0, _read().readSecretEnvsAsync)(this.ctx.commandCtx.projectDir);

    if (!this.shouldLoadCredentials()) {
      return;
    }

    const provider = new (_AndroidCredentialsProvider().default)(this.ctx.commandCtx.projectDir, {
      projectName: this.ctx.commandCtx.projectName,
      accountName: this.ctx.commandCtx.accountName
    }, {
      nonInteractive: this.ctx.commandCtx.nonInteractive,
      skipCredentialsCheck: this.ctx.commandCtx.skipCredentialsCheck
    });
    await provider.initAsync();
    const credentialsSource = await (0, _credentials().ensureCredentialsAsync)(provider, this.ctx.buildProfile.workflow, this.ctx.buildProfile.credentialsSource, this.ctx.commandCtx.nonInteractive);
    this.credentials = await provider.getCredentialsAsync(credentialsSource);
    return credentialsSource;
  }

  async isProjectConfiguredAsync() {
    const androidAppDir = _path().default.join(this.ctx.commandCtx.projectDir, 'android', 'app');

    const buildGradlePath = _path().default.join(androidAppDir, 'build.gradle');

    const easGradlePath = _path().default.join(androidAppDir, 'eas-build.gradle');

    const hasEasGradleFile = await _fsExtra().default.pathExists(easGradlePath);
    const buildGradleContent = await _fsExtra().default.readFile(_path().default.join(buildGradlePath), 'utf-8');
    const applyEasGradle = 'apply from: "./eas-build.gradle"';
    const hasEasGradleApply = hasApplyLine(buildGradleContent, applyEasGradle);
    return hasEasGradleApply && hasEasGradleFile;
  }

  async ensureProjectConfiguredAsync() {
    const {
      projectDir,
      exp,
      nonInteractive
    } = this.ctx.commandCtx;
    const isProjectConfigured = await this.isProjectConfiguredAsync();

    if (!isProjectConfigured) {
      throw new (_CommandError().default)('Project is not configured. Please run "expo eas:build:init" first to configure the project');
    }

    await (0, _git2().modifyAndCommitAsync)(async () => {
      await (0, _expoUpdates().setUpdatesVersionsAndroidAsync)({
        projectDir,
        exp
      });
    }, {
      startMessage: 'Making sure runtime version is correct on Android',
      commitMessage: 'Set runtime version in Android project',
      commitSuccessMessage: 'Successfully committed the configuration changes',
      successMessage: 'We updated the runtime version in your Android project',
      nonInteractive
    });
  }

  async configureProjectAsync() {
    const {
      projectDir,
      exp,
      nonInteractive
    } = this.ctx.commandCtx;
    await (0, _git2().modifyAndCommitAsync)(async () => {
      const androidAppDir = _path().default.join(projectDir, 'android', 'app');

      const buildGradlePath = _path().default.join(androidAppDir, 'build.gradle');

      const easGradlePath = _path().default.join(androidAppDir, 'eas-build.gradle');

      await _fsExtra().default.writeFile(easGradlePath, _gradleContent().default);
      await (0, _git().gitAddAsync)(easGradlePath, {
        intentToAdd: true
      });
      const buildGradleContent = await _fsExtra().default.readFile(_path().default.join(buildGradlePath), 'utf-8');
      const applyEasGradle = 'apply from: "./eas-build.gradle"';
      const hasEasGradleApply = hasApplyLine(buildGradleContent, applyEasGradle);

      if (!hasEasGradleApply) {
        await _fsExtra().default.writeFile(buildGradlePath, `${buildGradleContent.trim()}\n${applyEasGradle}\n`);
      }

      await (0, _expoUpdates().configureUpdatesAndroidAsync)({
        projectDir,
        exp
      });
    }, {
      startMessage: 'Configuring the Android project',
      commitMessage: 'Configure Android project',
      commitSuccessMessage: 'Successfully committed the configuration changes',
      successMessage: 'We configured your Android project to build it on the Expo servers',
      nonInteractive
    });
  }

  async prepareJobAsync(archiveUrl) {
    if (!this.credentialsPrepared) {
      throw new Error('ensureCredentialsAsync should be called before prepareJobAsync');
    }

    if (this.ctx.buildProfile.workflow === _easJson().Workflow.Generic) {
      return (0, _easBuildJob().sanitizeJob)((await this.prepareGenericJobAsync(archiveUrl, this.ctx.buildProfile)));
    } else if (this.ctx.buildProfile.workflow === _easJson().Workflow.Managed) {
      return (0, _easBuildJob().sanitizeJob)((await this.prepareManagedJobAsync(archiveUrl, this.ctx.buildProfile)));
    } else {
      throw new Error("Unknown workflow. Shouldn't happen");
    }
  }

  async prepareJobCommonAsync(archiveUrl) {
    const buildCredentials = this.credentials ? {
      buildCredentials: {
        keystore: {
          dataBase64: this.credentials.keystore.keystore,
          keystorePassword: this.credentials.keystore.keystorePassword,
          keyAlias: this.credentials.keystore.keyAlias,
          keyPassword: this.credentials.keystore.keyPassword
        }
      }
    } : {};
    return {
      platform: _easBuildJob().Platform.Android,
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
      gradleCommand: buildProfile.gradleCommand,
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
    return this.ctx.buildProfile.workflow === _easJson().Workflow.Managed || this.ctx.buildProfile.workflow === _easJson().Workflow.Generic && !this.ctx.buildProfile.withoutCredentials;
  }

}

var _default = AndroidBuilder;
exports.default = _default;
//# sourceMappingURL=AndroidBuilder.js.map