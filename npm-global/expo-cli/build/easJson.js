"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EasJsonReader = exports.CredentialsSource = exports.Workflow = void 0;

function _easBuildJob() {
  const data = require("@expo/eas-build-job");

  _easBuildJob = function () {
    return data;
  };

  return data;
}

function _joi() {
  const data = _interopRequireDefault(require("@hapi/joi"));

  _joi = function () {
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO(wkozyra95): move it to @expo/config or to separate package
// Workflow is representing different value than BuildType from @expo/eas-build-job
// Each workflow has a set of BuildTypes available
// - Generic workflow allows to build 'generic' and 'generic-client'
// - Managed workflow allows to build 'managed' and 'managed-client'
let Workflow;
exports.Workflow = Workflow;

(function (Workflow) {
  Workflow["Generic"] = "generic";
  Workflow["Managed"] = "managed";
})(Workflow || (exports.Workflow = Workflow = {}));

let CredentialsSource;
exports.CredentialsSource = CredentialsSource;

(function (CredentialsSource) {
  CredentialsSource["LOCAL"] = "local";
  CredentialsSource["REMOTE"] = "remote";
  CredentialsSource["AUTO"] = "auto";
})(CredentialsSource || (exports.CredentialsSource = CredentialsSource = {}));

const EasJsonSchema = _joi().default.object({
  builds: _joi().default.object({
    android: _joi().default.object().pattern(_joi().default.string(), _joi().default.object({
      workflow: _joi().default.string().valid('generic', 'managed').required()
    }).unknown(true) // profile is validated further only if build is for that platform
    ),
    ios: _joi().default.object().pattern(_joi().default.string(), _joi().default.object({
      workflow: _joi().default.string().valid('generic', 'managed').required()
    }).unknown(true) // profile is validated further only if build is for that platform
    )
  })
});

const AndroidGenericSchema = _joi().default.object({
  workflow: _joi().default.string().valid('generic').required(),
  credentialsSource: _joi().default.string().valid('local', 'remote', 'auto').default('auto'),
  gradleCommand: _joi().default.string(),
  artifactPath: _joi().default.string(),
  releaseChannel: _joi().default.string(),
  withoutCredentials: _joi().default.boolean()
});

const AndroidManagedSchema = _joi().default.object({
  workflow: _joi().default.string().valid('managed').required(),
  credentialsSource: _joi().default.string().valid('local', 'remote', 'auto').default('auto'),
  buildType: _joi().default.string().valid('apk', 'app-bundle').default('app-bundle')
});

const iOSGenericSchema = _joi().default.object({
  workflow: _joi().default.string().valid('generic').required(),
  credentialsSource: _joi().default.string().valid('local', 'remote', 'auto').default('auto'),
  scheme: _joi().default.string(),
  releaseChannel: _joi().default.string(),
  artifactPath: _joi().default.string()
});

const iOSManagedSchema = _joi().default.object({
  workflow: _joi().default.string().valid('managed').required(),
  credentialsSource: _joi().default.string().valid('local', 'remote', 'auto').default('auto'),
  buildType: _joi().default.string().valid('archive', 'simulator')
});

const schemaBuildProfileMap = {
  android: {
    generic: AndroidGenericSchema,
    managed: AndroidManagedSchema
  },
  ios: {
    managed: iOSManagedSchema,
    generic: iOSGenericSchema
  }
};

class EasJsonReader {
  constructor(projectDir, platform) {
    this.projectDir = projectDir;
    this.platform = platform;
  }

  async readAsync(buildProfileName) {
    const easJson = await this.readFile();
    let androidConfig;

    if (['android', 'all'].includes(this.platform)) {
      var _easJson$builds, _easJson$builds$andro;

      androidConfig = this.validateBuildProfile(_easBuildJob().Platform.Android, buildProfileName, (_easJson$builds = easJson.builds) === null || _easJson$builds === void 0 ? void 0 : (_easJson$builds$andro = _easJson$builds.android) === null || _easJson$builds$andro === void 0 ? void 0 : _easJson$builds$andro[buildProfileName]);
    }

    let iosConfig;

    if (['ios', 'all'].includes(this.platform)) {
      var _easJson$builds2, _easJson$builds2$ios;

      iosConfig = this.validateBuildProfile(_easBuildJob().Platform.iOS, buildProfileName, (_easJson$builds2 = easJson.builds) === null || _easJson$builds2 === void 0 ? void 0 : (_easJson$builds2$ios = _easJson$builds2.ios) === null || _easJson$builds2$ios === void 0 ? void 0 : _easJson$builds2$ios[buildProfileName]);
    }

    return {
      builds: { ...(androidConfig ? {
          android: androidConfig
        } : {}),
        ...(iosConfig ? {
          ios: iosConfig
        } : {})
      }
    };
  }

  validateBuildProfile(platform, buildProfileName, buildProfile) {
    if (!buildProfile) {
      throw new Error(`There is no profile named ${buildProfileName} for platform ${platform}`);
    }

    const schema = schemaBuildProfileMap[platform][buildProfile === null || buildProfile === void 0 ? void 0 : buildProfile.workflow];

    if (!schema) {
      throw new Error('invalid workflow'); // this should be validated earlier
    }

    const {
      value,
      error
    } = schema.validate(buildProfile, {
      stripUnknown: true,
      convert: true,
      abortEarly: false
    });

    if (error) {
      throw new Error(`Object "${platform}.${buildProfileName}" in eas.json is not valid [${error.toString()}]`);
    }

    return value;
  }

  async readFile() {
    const rawFile = await _fsExtra().default.readFile(_path().default.join(this.projectDir, 'eas.json'), 'utf-8');
    const json = JSON.parse(rawFile);
    const {
      value,
      error
    } = EasJsonSchema.validate(json, {
      abortEarly: false
    });

    if (error) {
      throw new Error(`eas.json is not valid [${error.toString()}]`);
    }

    return value;
  }

}

exports.EasJsonReader = EasJsonReader;
//# sourceMappingURL=easJson.js.map