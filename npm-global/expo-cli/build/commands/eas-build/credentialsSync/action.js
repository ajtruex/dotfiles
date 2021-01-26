"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = credentialsSyncAction;
exports.updateLocalCredentialsAsync = updateLocalCredentialsAsync;

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

function _uuid() {
  const data = require("uuid");

  _uuid = function () {
    return data;
  };

  return data;
}

function _CommandError() {
  const data = _interopRequireDefault(require("../../../CommandError"));

  _CommandError = function () {
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

function credentialsJsonUpdateUtils() {
  const data = _interopRequireWildcard(require("../../../credentials/credentialsJson/update"));

  credentialsJsonUpdateUtils = function () {
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

function _SetupAndroidKeystore() {
  const data = require("../../../credentials/views/SetupAndroidKeystore");

  _SetupAndroidKeystore = function () {
    return data;
  };

  return data;
}

function _SetupIosBuildCredentials() {
  const data = require("../../../credentials/views/SetupIosBuildCredentials");

  _SetupIosBuildCredentials = function () {
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

function _projects() {
  const data = require("../../../projects");

  _projects = function () {
    return data;
  };

  return data;
}

function _prompts() {
  const data = _interopRequireDefault(require("../../../prompts"));

  _prompts = function () {
    return data;
  };

  return data;
}

function _ios() {
  const data = require("../build/utils/ios");

  _ios = function () {
    return data;
  };

  return data;
}

function _types() {
  const data = require("../types");

  _types = function () {
    return data;
  };

  return data;
}

function _analytics() {
  const data = _interopRequireDefault(require("../utils/analytics"));

  _analytics = function () {
    return data;
  };

  return data;
}

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function credentialsSyncAction(projectDir, options) {
  if (options.parent.nonInteractive) {
    throw new (_CommandError().default)('This command is not supported in --non-interactive mode');
  }

  const user = await _xdl().UserManager.ensureLoggedInAsync();
  const {
    exp
  } = (0, _config().getConfig)(projectDir, {
    skipSDKVersionRequirement: true
  });
  const accountName = exp.owner || user.username;
  const projectName = exp.slug;
  const projectId = await (0, _projects().ensureProjectExistsAsync)(user, {
    accountName,
    projectName
  });
  const {
    update,
    platform
  } = await (0, _prompts().default)([{
    type: 'select',
    name: 'update',
    message: 'What do you want to do?',
    choices: [{
      title: 'Update credentials on the Expo servers with the local credentials.json contents',
      value: 'remote'
    }, {
      title: 'Update or create local credentials.json with credentials from the Expo servers',
      value: 'local'
    }]
  }, {
    type: 'select',
    name: 'platform',
    message: 'Which platform would you like to update?',
    choices: [{
      title: 'Android',
      value: _types().BuildCommandPlatform.ANDROID
    }, {
      title: 'iOS',
      value: _types().BuildCommandPlatform.IOS
    }, {
      title: 'both',
      value: _types().BuildCommandPlatform.ALL
    }]
  }]);
  const trackingCtx = {
    tracking_id: (0, _uuid().v4)(),
    project_id: projectId,
    account_name: accountName,
    project_name: projectName,
    request_platform: platform
  };

  _analytics().default.logEvent(_types().AnalyticsEvent.CREDENTIALS_SYNC_COMMAND, trackingCtx);

  if (update === 'local') {
    await updateLocalCredentialsAsync(projectDir, platform, trackingCtx);
  } else {
    await updateRemoteCredentialsAsync(projectDir, platform, trackingCtx);
  }
}

async function updateRemoteCredentialsAsync(projectDir, platform, trackingCtx) {
  const ctx = new (_context().Context)();
  await ctx.init(projectDir);

  if (!ctx.hasProjectContext) {
    throw new Error('project context is required'); // should be checked earlier
  }

  if ([_types().BuildCommandPlatform.ALL, _types().BuildCommandPlatform.ANDROID].includes(platform)) {
    try {
      const experienceName = `@${ctx.manifest.owner || ctx.user.username}/${ctx.manifest.slug}`;
      await (0, _route().runCredentialsManager)(ctx, new (_SetupAndroidKeystore().SetupAndroidBuildCredentialsFromLocal)(experienceName, {
        skipKeystoreValidation: false
      }));

      _analytics().default.logEvent(_types().AnalyticsEvent.CREDENTIALS_SYNC_UPDATE_REMOTE_SUCCESS, { ...trackingCtx,
        platform: 'android'
      });
    } catch (error) {
      _analytics().default.logEvent(_types().AnalyticsEvent.CREDENTIALS_SYNC_UPDATE_REMOTE_FAIL, { ...trackingCtx,
        platform: 'android',
        reason: error.message
      });

      throw error;
    }
  }

  if ([_types().BuildCommandPlatform.ALL, _types().BuildCommandPlatform.IOS].includes(platform)) {
    try {
      var _ctx$manifest$owner;

      const bundleIdentifier = await (0, _ios().getBundleIdentifier)(projectDir, ctx.manifest);
      const appLookupParams = {
        accountName: (_ctx$manifest$owner = ctx.manifest.owner) !== null && _ctx$manifest$owner !== void 0 ? _ctx$manifest$owner : ctx.user.username,
        projectName: ctx.manifest.slug,
        bundleIdentifier
      };
      await (0, _route().runCredentialsManager)(ctx, new (_SetupIosBuildCredentials().SetupIosBuildCredentialsFromLocal)(appLookupParams));

      _analytics().default.logEvent(_types().AnalyticsEvent.CREDENTIALS_SYNC_UPDATE_REMOTE_SUCCESS, { ...trackingCtx,
        platform: 'ios'
      });
    } catch (error) {
      _analytics().default.logEvent(_types().AnalyticsEvent.CREDENTIALS_SYNC_UPDATE_REMOTE_FAIL, { ...trackingCtx,
        platform: 'ios',
        reason: error.message
      });

      throw error;
    }
  }
}

async function updateLocalCredentialsAsync(projectDir, platform, trackingCtx) {
  const ctx = new (_context().Context)();
  await ctx.init(projectDir);

  if (!ctx.hasProjectContext) {
    throw new Error('project context is required'); // should be checked earlier
  }

  if ([_types().BuildCommandPlatform.ALL, _types().BuildCommandPlatform.ANDROID].includes(platform)) {
    try {
      (0, _log().default)('Updating Android credentials in credentials.json');
      await credentialsJsonUpdateUtils().updateAndroidCredentialsAsync(ctx);

      _analytics().default.logEvent(_types().AnalyticsEvent.CREDENTIALS_SYNC_UPDATE_LOCAL_SUCCESS, { ...trackingCtx,
        platform: 'android'
      });
    } catch (error) {
      _analytics().default.logEvent(_types().AnalyticsEvent.CREDENTIALS_SYNC_UPDATE_LOCAL_FAIL, { ...trackingCtx,
        platform: 'android',
        reason: error.message
      });

      throw error;
    }
  }

  if ([_types().BuildCommandPlatform.ALL, _types().BuildCommandPlatform.IOS].includes(platform)) {
    try {
      const bundleIdentifier = await (0, _ios().getBundleIdentifier)(projectDir, ctx.manifest);
      (0, _log().default)('Updating iOS credentials in credentials.json');
      await credentialsJsonUpdateUtils().updateIosCredentialsAsync(ctx, bundleIdentifier);

      _analytics().default.logEvent(_types().AnalyticsEvent.CREDENTIALS_SYNC_UPDATE_REMOTE_SUCCESS, { ...trackingCtx,
        platform: 'android'
      });
    } catch (error) {
      _analytics().default.logEvent(_types().AnalyticsEvent.CREDENTIALS_SYNC_UPDATE_REMOTE_FAIL, { ...trackingCtx,
        platform: 'ios',
        reason: error.message
      });

      throw error;
    }
  }
}
//# sourceMappingURL=action.js.map