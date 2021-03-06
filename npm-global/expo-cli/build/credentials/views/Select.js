"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AskQuit = exports.DoQuit = exports.QuitError = exports.SelectAndroidExperience = exports.SelectIosExperience = exports.SelectPlatform = void 0;

function _invariant() {
  const data = _interopRequireDefault(require("invariant"));

  _invariant = function () {
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

function _list() {
  const data = require("../actions/list");

  _list = function () {
    return data;
  };

  return data;
}

function _route() {
  const data = require("../route");

  _route = function () {
    return data;
  };

  return data;
}

function androidView() {
  const data = _interopRequireWildcard(require("./AndroidCredentials"));

  androidView = function () {
    return data;
  };

  return data;
}

function iosDistView() {
  const data = _interopRequireWildcard(require("./IosDistCert"));

  iosDistView = function () {
    return data;
  };

  return data;
}

function iosProvisionigProfileView() {
  const data = _interopRequireWildcard(require("./IosProvisioningProfile"));

  iosProvisionigProfileView = function () {
    return data;
  };

  return data;
}

function iosPushView() {
  const data = _interopRequireWildcard(require("./IosPushCredentials"));

  iosPushView = function () {
    return data;
  };

  return data;
}

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class SelectPlatform {
  async open(ctx) {
    const {
      platform
    } = await (0, _prompt().default)([{
      type: 'list',
      name: 'platform',
      message: 'Select platform',
      pageSize: Infinity,
      choices: ['ios', 'android']
    }]);
    const view = platform === 'ios' ? new SelectIosExperience() : new SelectAndroidExperience();

    _route().CredentialsManager.get().changeMainView(view);

    return view;
  }

}

exports.SelectPlatform = SelectPlatform;

class SelectIosExperience {
  async open(ctx) {
    var _ref;

    const accountName = (_ref = ctx.hasProjectContext ? ctx.manifest.owner : undefined) !== null && _ref !== void 0 ? _ref : ctx.user.username;
    const iosCredentials = await ctx.ios.getAllCredentials(accountName);
    await (0, _list().displayIosCredentials)(iosCredentials);
    const projectSpecificActions = ctx.hasProjectContext ? [_prompt().default.separator('---- Current project actions ----'), {
      value: 'use-existing-push-ios',
      name: 'Use existing Push Notifications Key in current project'
    }, {
      value: 'use-existing-dist-ios',
      name: 'Use existing Distribution Certificate in current project'
    }, // {
    //   value: 'current-remove-push-ios',
    //   name: 'Remove Push Notifactions credentials for current project',
    // },
    // {
    //   value: 'current-remove-dist-ios',
    //   name: 'Remove Distribution Certificate for current project',
    // },
    // {
    //   value: 'current-remove-app-ios',
    //   name: 'Remove all credentials for current project',
    // },
    _prompt().default.separator('---- Account level actions ----')] : [];
    const question = {
      type: 'list',
      name: 'action',
      message: 'What do you want to do?',
      choices: [...projectSpecificActions, {
        value: 'remove-provisioning-profile',
        name: 'Remove Provisioning Profile'
      }, {
        value: 'create-ios-push',
        name: 'Add new Push Notifications Key'
      }, {
        value: 'remove-ios-push',
        name: 'Remove Push Notification credentials'
      }, {
        value: 'update-ios-push',
        name: 'Update Push Notifications Key'
      }, {
        value: 'create-ios-dist',
        name: 'Add new Distribution Certificate'
      }, {
        value: 'remove-ios-dist',
        name: 'Remove Distribution Certificate'
      }, {
        value: 'update-ios-dist',
        name: 'Update Distribution Certificate'
      }],
      pageSize: Infinity
    };
    const {
      action
    } = await (0, _prompt().default)(question);
    return this.handleAction(ctx, accountName, action);
  }

  getAppLookupParamsFromContext(ctx) {
    var _ctx$manifest$ios;

    const projectName = ctx.manifest.slug;
    const accountName = ctx.manifest.owner || ctx.user.username;
    const bundleIdentifier = (_ctx$manifest$ios = ctx.manifest.ios) === null || _ctx$manifest$ios === void 0 ? void 0 : _ctx$manifest$ios.bundleIdentifier;

    if (!bundleIdentifier) {
      throw new Error(`ios.bundleIdentifier need to be defined`);
    }

    return {
      accountName,
      projectName,
      bundleIdentifier
    };
  }

  handleAction(ctx, accountName, action) {
    switch (action) {
      case 'create-ios-push':
        return new (iosPushView().CreateIosPush)(accountName);

      case 'update-ios-push':
        return new (iosPushView().UpdateIosPush)(accountName);

      case 'remove-ios-push':
        return new (iosPushView().RemoveIosPush)(accountName);

      case 'create-ios-dist':
        return new (iosDistView().CreateIosDist)(accountName);

      case 'update-ios-dist':
        return new (iosDistView().UpdateIosDist)(accountName);

      case 'remove-ios-dist':
        return new (iosDistView().RemoveIosDist)(accountName);

      case 'use-existing-push-ios':
        {
          const app = this.getAppLookupParamsFromContext(ctx);
          return new (iosPushView().UseExistingPushNotification)(app);
        }

      case 'use-existing-dist-ios':
        {
          const app = this.getAppLookupParamsFromContext(ctx);
          return new (iosDistView().UseExistingDistributionCert)(app);
        }

      case 'remove-provisioning-profile':
        return new (iosProvisionigProfileView().RemoveProvisioningProfile)(accountName);

      default:
        throw new Error('Unknown action selected');
    }
  }

}

exports.SelectIosExperience = SelectIosExperience;

class SelectAndroidExperience {
  constructor() {
    _defineProperty(this, "askAboutProjectMode", true);
  }

  async open(ctx) {
    if (ctx.hasProjectContext && this.askAboutProjectMode) {
      const experienceName = `@${ctx.manifest.owner || ctx.user.username}/${ctx.manifest.slug}`;
      const runProjectContext = await (0, _prompts().confirmAsync)({
        message: `You are currently in a directory with ${experienceName} experience. Do you want to select it?`
      });

      if (runProjectContext) {
        (0, _invariant().default)(ctx.manifest.slug, 'app.json slug field must be set');
        const view = new (androidView().ExperienceView)(experienceName);

        _route().CredentialsManager.get().changeMainView(view);

        return view;
      }
    }

    this.askAboutProjectMode = false;
    const credentials = await ctx.android.fetchAll();
    await (0, _list().displayAndroidCredentials)(Object.values(credentials));
    const question = {
      type: 'list',
      name: 'experienceName',
      message: 'Select application',
      choices: Object.values(credentials).map(cred => ({
        name: cred.experienceName,
        value: cred.experienceName
      })),
      pageSize: Infinity
    };
    const {
      experienceName
    } = await (0, _prompt().default)(question);
    return new (androidView().ExperienceView)(experienceName);
  }

}

exports.SelectAndroidExperience = SelectAndroidExperience;

class QuitError extends Error {
  constructor() {
    super(); // Set the prototype explicitly.
    // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work

    Object.setPrototypeOf(this, QuitError.prototype);
  }

}

exports.QuitError = QuitError;

class DoQuit {
  async runAsync(mainpage) {
    throw new QuitError();
  }

}

exports.DoQuit = DoQuit;

class AskQuit {
  async runAsync(mainpage) {
    const {
      selected
    } = await (0, _prompt().default)([{
      type: 'list',
      name: 'selected',
      message: 'Do you want to quit Credential Manager',
      choices: [{
        value: 'exit',
        name: 'Quit Credential Manager'
      }, {
        value: 'mainpage',
        name: 'Go back to experience overview.'
      }]
    }]);

    if (selected === 'exit') {
      process.exit(0);
    }

    return mainpage;
  }

}

exports.AskQuit = AskQuit;
//# sourceMappingURL=Select.js.map