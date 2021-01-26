"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validatePushKey = validatePushKey;
exports.getPushKeyFromParams = getPushKeyFromParams;
exports.usePushKeyFromParams = usePushKeyFromParams;
exports.CreateOrReusePushKey = exports.UseExistingPushNotification = exports.UpdateIosPush = exports.RemoveIosPush = exports.CreateIosPush = void 0;

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

function _ora() {
  const data = _interopRequireDefault(require("ora"));

  _ora = function () {
    return data;
  };

  return data;
}

function _terminalLink() {
  const data = _interopRequireDefault(require("terminal-link"));

  _terminalLink = function () {
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

function _appleApi() {
  const data = require("../../appleApi");

  _appleApi = function () {
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

function _list() {
  const data = require("../actions/list");

  _list = function () {
    return data;
  };

  return data;
}

function _promptForCredentials() {
  const data = require("../actions/promptForCredentials");

  _promptForCredentials = function () {
    return data;
  };

  return data;
}

function _IosApi() {
  const data = require("../api/IosApi");

  _IosApi = function () {
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const APPLE_KEYS_TOO_MANY_GENERATED_ERROR = `
You can have only ${_chalk().default.underline('two')} Push Notifactions Keys on your Apple Developer account.
Please revoke the old ones or reuse existing from your other apps.
Please remember that Apple Keys are not application specific!
`;

class CreateIosPush {
  constructor(accountName) {
    this.accountName = accountName;
  }

  async create(ctx) {
    const newPushKey = await this.provideOrGenerate(ctx);
    return await ctx.ios.createPushKey(this.accountName, newPushKey);
  }

  async open(ctx) {
    const pushKey = await this.create(ctx);
    (0, _log().default)('Successfully created Push Notification Key\n');
    (0, _list().displayIosUserCredentials)(pushKey);
    (0, _log().default)();
    return null;
  }

  _getRequiredQuestions(ctx) {
    const requiredQuestions = { ..._credentials().pushKeySchema
    };

    if (ctx.hasAppleCtx() && requiredQuestions.questions) {
      requiredQuestions.required = requiredQuestions.required.filter(q => q !== 'teamId');
    }

    return requiredQuestions;
  }

  _ensurePushKey(ctx, partialKey) {
    if (ctx.hasAppleCtx()) {
      partialKey.teamId = ctx.appleCtx.team.id;
      partialKey.teamName = ctx.appleCtx.team.name;
    }

    if (!(0, _appleApi().isPushKey)(partialKey)) {
      throw new Error(`Not of type PushKey: ${partialKey}`);
    }

    return partialKey;
  }

  async provideOrGenerate(ctx) {
    if (!ctx.nonInteractive) {
      const requiredQuestions = this._getRequiredQuestions(ctx);

      const userProvided = await (0, _promptForCredentials().askForUserProvided)(requiredQuestions);

      if (userProvided) {
        const pushKey = this._ensurePushKey(ctx, userProvided);

        const isValid = await validatePushKey(ctx, pushKey);
        return isValid ? userProvided : await this.provideOrGenerate(ctx);
      }
    }

    return await generatePushKey(ctx, this.accountName);
  }

}

exports.CreateIosPush = CreateIosPush;

class RemoveIosPush {
  constructor(accountName, shouldRevoke = false) {
    this.accountName = accountName;
    this.shouldRevoke = shouldRevoke;
  }

  async open(ctx) {
    if (ctx.nonInteractive) {
      throw new (_CommandError().default)('NON_INTERACTIVE', "Start the CLI without the '--non-interactive' flag to select a push notification credential to remove.");
    }

    const selected = await selectPushCredFromList(ctx, this.accountName);

    if (selected) {
      if (!('type' in selected)) {
        const app = (0, _IosApi().getAppLookupParams)(selected.experienceName, selected.bundleIdentifier);
        await this.removePushCert(ctx, app);
        (0, _log().default)(_chalk().default.green('Successfully removed Push Certificate'));
      } else {
        await this.removeSpecific(ctx, selected);
        (0, _log().default)(_chalk().default.green('Successfully removed Push Notification Key'));
      }
    }

    return null;
  }

  async removePushCert(ctx, app) {
    (0, _log().default)('Removing Push Certificate');
    await ctx.ios.deletePushCert(app);
  }

  async removeSpecific(ctx, selected) {
    const credentials = await ctx.ios.getAllCredentials(this.accountName);
    const apps = getAppsUsingPushCred(credentials, selected);
    const appsList = apps.map(appCred => appCred.experienceName).join(', ');

    if (appsList && !ctx.nonInteractive) {
      (0, _log().default)('Removing Push Key');
      const confirm = await (0, _prompts().confirmAsync)({
        message: `Removing this key/cert will disable notifications in ${appsList}. Do you want to continue?`
      });

      if (!confirm) {
        (0, _log().default)('Aborting');
        return;
      }
    }

    (0, _log().default)('Removing Push Key...\n');
    await ctx.ios.deletePushKey(selected.id, this.accountName);
    let shouldRevoke = this.shouldRevoke;

    if (!shouldRevoke && !ctx.nonInteractive) {
      const revoke = await (0, _prompts().confirmAsync)({
        message: `Do you also want to revoke it on Apple Developer Portal?`
      });
      shouldRevoke = revoke;
    }

    if (shouldRevoke) {
      await ctx.ensureAppleCtx();
      await new (_appleApi().PushKeyManager)(ctx.appleCtx).revoke([selected.apnsKeyId]);
    }
  }

}

exports.RemoveIosPush = RemoveIosPush;

class UpdateIosPush {
  constructor(accountName) {
    this.accountName = accountName;
  }

  async open(ctx) {
    if (ctx.nonInteractive) {
      throw new (_CommandError().default)('NON_INTERACTIVE', "Start the CLI without the '--non-interactive' flag to select a push notification credential to update.");
    }

    const selected = await selectPushCredFromList(ctx, this.accountName, {
      allowLegacy: false
    });

    if (selected) {
      await this.updateSpecific(ctx, selected);
      (0, _log().default)(_chalk().default.green('Successfully updated Push Notification Key.\n'));
      const credentials = await ctx.ios.getAllCredentials(this.accountName);
      const updated = credentials.userCredentials.find(i => i.id === selected.id);

      if (updated) {
        (0, _list().displayIosUserCredentials)(updated);
      }

      (0, _log().default)();
    }

    return null;
  }

  async updateSpecific(ctx, selected) {
    const credentials = await ctx.ios.getAllCredentials(this.accountName);
    const apps = getAppsUsingPushCred(credentials, selected);
    const appsList = apps.map(appCred => appCred.experienceName).join(', ');

    if (apps.length > 1) {
      if (ctx.nonInteractive) {
        throw new (_CommandError().default)('NON_INTERACTIVE', `Updating credentials will affect all applications that are using this key (${appsList}). Start the CLI without the '--non-interactive' flag to confirm.`);
      }

      const confirm = await (0, _prompts().confirmAsync)({
        message: `Update will affect all applications that are using this key (${appsList}). Do you want to continue?`
      });

      if (!confirm) {
        _log().default.warn('Aborting update process');

        return;
      }
    }

    const newPushKey = await this.provideOrGenerate(ctx);
    await ctx.ios.updatePushKey(selected.id, this.accountName, newPushKey);
  }

  async provideOrGenerate(ctx) {
    const userProvided = await (0, _promptForCredentials().askForUserProvided)(_credentials().pushKeySchema);

    if (userProvided) {
      const isValid = await validatePushKey(ctx, userProvided);
      return isValid ? userProvided : await this.provideOrGenerate(ctx);
    }

    return await generatePushKey(ctx, this.accountName);
  }

}

exports.UpdateIosPush = UpdateIosPush;

class UseExistingPushNotification {
  constructor(app) {
    this.app = app;
  }

  async open(ctx) {
    if (ctx.nonInteractive) {
      throw new (_CommandError().default)('NON_INTERACTIVE', "Start the CLI without the '--non-interactive' flag to select a push notification credential to use.");
    }

    const selected = await selectPushCredFromList(ctx, this.app.accountName, {
      allowLegacy: false
    });

    if (selected) {
      await ctx.ios.usePushKey(this.app, selected.id);
      (0, _log().default)(_chalk().default.green(`Successfully assigned Push Notifactions Key to ${this.app.accountName}/${this.app.projectName} (${this.app.bundleIdentifier})`));
    }

    return null;
  }

}

exports.UseExistingPushNotification = UseExistingPushNotification;

class CreateOrReusePushKey {
  constructor(app) {
    this.app = app;
  }

  async assignPushKey(ctx, userCredentialsId) {
    await ctx.ios.usePushKey(this.app, userCredentialsId);
    (0, _log().default)(_chalk().default.green(`Successfully assigned Push Key to ${this.app.accountName}/${this.app.projectName} (${this.app.bundleIdentifier})`));
  }

  async open(ctx) {
    if (!ctx.user) {
      throw new Error(`This workflow requires you to be logged in.`);
    }

    const existingPushKeys = await getValidPushKeys((await ctx.ios.getAllCredentials(this.app.accountName)), ctx);

    if (existingPushKeys.length === 0) {
      const pushKey = await new CreateIosPush(this.app.accountName).create(ctx);
      await this.assignPushKey(ctx, pushKey.id);
      return null;
    } // autoselect creds if we find valid keys


    const autoselectedPushKey = existingPushKeys[0];

    if (!ctx.nonInteractive) {
      const confirm = await (0, _prompts().confirmAsync)({
        message: `${formatPushKey(autoselectedPushKey, (await ctx.ios.getAllCredentials(this.app.accountName)), 'VALID')} \n Would you like to use this Push Key?`,
        limit: Infinity
      });

      if (!confirm) {
        return await this._createOrReuse(ctx);
      }
    } // Use autosuggested push key


    (0, _log().default)(`Using Push Key: ${autoselectedPushKey.apnsKeyId}`);
    await this.assignPushKey(ctx, autoselectedPushKey.id);
    return null;
  }

  async _createOrReuse(ctx) {
    const choices = [{
      name: '[Choose existing push key] (Recommended)',
      value: 'CHOOSE_EXISTING'
    }, {
      name: '[Add a new push key]',
      value: 'GENERATE'
    }];
    const question = {
      type: 'list',
      name: 'action',
      message: 'Select an iOS push key to use for push notifications:',
      choices,
      pageSize: Infinity
    };
    const {
      action
    } = await (0, _prompt().default)(question);

    if (action === 'GENERATE') {
      const pushKey = await new CreateIosPush(this.app.accountName).create(ctx);
      await this.assignPushKey(ctx, pushKey.id);
      return null;
    } else if (action === 'CHOOSE_EXISTING') {
      return new UseExistingPushNotification(this.app);
    }

    throw new Error('unsupported action');
  }

}

exports.CreateOrReusePushKey = CreateOrReusePushKey;

async function getValidPushKeys(iosCredentials, ctx) {
  const pushKeys = iosCredentials.userCredentials.filter(cred => cred.type === 'push-key');

  if (!ctx.hasAppleCtx()) {
    (0, _log().default)(_chalk().default.yellow(`Unable to determine validity of Push Keys due to insufficient Apple Credentials`));
    return pushKeys;
  }

  const pushKeyManager = new (_appleApi().PushKeyManager)(ctx.appleCtx);
  const pushInfoFromApple = await pushKeyManager.list();
  return await filterRevokedPushKeys(pushInfoFromApple, pushKeys);
}

function getValidityStatus(pushKey, validPushKeys) {
  if (!validPushKeys) {
    return 'UNKNOWN';
  }

  return validPushKeys.includes(pushKey) ? 'VALID' : 'INVALID';
}

async function selectPushCredFromList(ctx, accountName, options = {}) {
  const iosCredentials = await ctx.ios.getAllCredentials(accountName);
  const allowLegacy = options.allowLegacy || true;
  let pushKeys = iosCredentials.userCredentials.filter(cred => cred.type === 'push-key');
  let validPushKeys = null;

  if (ctx.hasAppleCtx()) {
    const pushKeyManager = new (_appleApi().PushKeyManager)(ctx.appleCtx);
    const pushInfoFromApple = await pushKeyManager.list();
    validPushKeys = await filterRevokedPushKeys(pushInfoFromApple, pushKeys);
  }

  pushKeys = options.filterInvalid && validPushKeys ? validPushKeys : pushKeys;
  const pushCerts = allowLegacy ? iosCredentials.appCredentials.filter(({
    credentials
  }) => credentials.pushP12 && credentials.pushPassword) : [];
  const pushCredentials = [...pushCerts, ...pushKeys];

  if (pushCredentials.length === 0) {
    _log().default.warn('There are no push credentials available in your account');

    return null;
  }

  const getName = pushCred => {
    if ('type' in pushCred) {
      return formatPushKey(pushCred, iosCredentials, getValidityStatus(pushCred, validPushKeys));
    }

    const pushCert = pushCred;
    return `Push Certificate (PushId: ${pushCert.credentials.pushId || '------'}, TeamId: ${pushCert.credentials.teamId || '-------'} used in ${pushCert.experienceName})`;
  };

  const question = {
    type: 'list',
    name: 'credentialsIndex',
    message: 'Select credentials from list',
    choices: pushCredentials.map((entry, index) => ({
      name: getName(entry),
      value: index
    }))
  };
  const {
    credentialsIndex
  } = await (0, _prompt().default)(question);
  return pushCredentials[credentialsIndex];
}

function getAppsUsingPushCred(iosCredentials, pushCred) {
  var _pushCred$credentials, _pushCred$credentials2;

  if ('type' in pushCred) {
    return iosCredentials.appCredentials.filter(cred => cred.pushCredentialsId === pushCred.id);
  } else if (((_pushCred$credentials = pushCred.credentials) === null || _pushCred$credentials === void 0 ? void 0 : _pushCred$credentials.pushP12) && ((_pushCred$credentials2 = pushCred.credentials) === null || _pushCred$credentials2 === void 0 ? void 0 : _pushCred$credentials2.pushPassword)) {
    return [pushCred];
  }

  return [];
}

function formatPushKeyFromApple(appleInfo, credentials) {
  const userCredentials = credentials.userCredentials.filter(cred => cred.type === 'push-key' && cred.apnsKeyId === appleInfo.id);
  const appCredentials = userCredentials.length !== 0 ? credentials.appCredentials.filter(cred => cred.pushCredentialsId === userCredentials[0].id) : [];
  const joinApps = appCredentials.map(i => `      ${i.experienceName} (${i.bundleIdentifier})`).join('\n');
  const usedByString = joinApps ? `    ${_chalk().default.gray(`used by\n${joinApps}`)}` : `    ${_chalk().default.gray(`not used by any apps`)}`;
  const {
    name,
    id
  } = appleInfo;
  const pushKey = userCredentials[0];
  const teamText = pushKey ? `, Team ID: ${pushKey.teamId || '---'}, Team name: ${pushKey.teamName || '---'}` : '';
  return `${name} - KeyId: ${id}${teamText}\n${usedByString}`;
}

function formatPushKey(pushKey, credentials, validityStatus = 'UNKNOWN') {
  const appCredentials = credentials.appCredentials.filter(cred => cred.pushCredentialsId === pushKey.id);
  const joinApps = appCredentials.map(i => `${i.experienceName} (${i.bundleIdentifier})`).join(', ');
  const usedByString = joinApps ? `\n    ${_chalk().default.gray(`used by ${joinApps}`)}` : `\n    ${_chalk().default.gray(`not used by any apps`)}`;
  let validityText;

  if (validityStatus === 'VALID') {
    validityText = _chalk().default.gray("\n    ✅ Currently valid on Apple's servers.");
  } else if (validityStatus === 'INVALID') {
    validityText = _chalk().default.gray("\n    ❌ No longer valid on Apple's servers.");
  } else {
    validityText = _chalk().default.gray("\n    ❓ Validity of this certificate on Apple's servers is unknown.");
  }

  return `Push Notifications Key (Key ID: ${pushKey.apnsKeyId}, Team ID: ${pushKey.teamId})${usedByString}${validityText}`;
}

async function generatePushKey(ctx, accountName) {
  await ctx.ensureAppleCtx();
  const manager = new (_appleApi().PushKeyManager)(ctx.appleCtx);

  try {
    return await manager.create();
  } catch (e) {
    if (e.code === 'APPLE_PUSH_KEYS_TOO_MANY_GENERATED_ERROR') {
      const keys = await manager.list();

      _log().default.warn('Maximum number of Push Notifications Keys generated on Apple Developer Portal.');

      _log().default.warn(APPLE_KEYS_TOO_MANY_GENERATED_ERROR);

      if (ctx.nonInteractive) {
        throw new (_CommandError().default)('NON_INTERACTIVE', "Start the CLI without the '--non-interactive' to revoke push notification keys.");
      }

      const credentials = await ctx.ios.getAllCredentials(accountName);
      const usedByExpo = credentials.userCredentials.filter(cert => cert.type === 'push-key').reduce((acc, cert) => ({ ...acc,
        [cert.apnsKeyId]: cert
      }), {}); // https://docs.expo.io/distribution/app-signing/#summary

      const here = (0, _terminalLink().default)('here', 'https://bit.ly/3cfJJkQ');
      (0, _log().default)(_chalk().default.grey(`⚠️  Revoking a Push Key will affect other apps that rely on it`));
      (0, _log().default)(_chalk().default.grey(`ℹ️  Learn more ${here}`));
      (0, _log().default)();
      const {
        revoke
      } = await (0, _prompt().default)([{
        type: 'checkbox',
        name: 'revoke',
        message: 'Select Push Notifications Key to revoke.',
        choices: keys.map((key, index) => ({
          value: index,
          name: formatPushKeyFromApple(key, credentials)
        })),
        pageSize: Infinity
      }]);

      for (const index of revoke) {
        const certInfo = keys[index];

        if (certInfo && usedByExpo[certInfo.id]) {
          await new RemoveIosPush(accountName, true).removeSpecific(ctx, usedByExpo[certInfo.id]);
        } else {
          await manager.revoke([certInfo.id]);
        }
      }
    } else {
      throw e;
    }
  }

  return await generatePushKey(ctx, accountName);
}

async function validatePushKey(ctx, pushKey) {
  if (!ctx.hasAppleCtx()) {
    _log().default.warn('Unable to validate Push Keys due to insufficient Apple Credentials');

    return true;
  }

  const spinner = (0, _ora().default)(`Checking validity of push key on Apple Developer Portal...`).start();
  const pushKeyManager = new (_appleApi().PushKeyManager)(ctx.appleCtx);
  const pushInfoFromApple = await pushKeyManager.list();
  const filteredFormattedPushKeyArray = await filterRevokedPushKeys(pushInfoFromApple, [pushKey]);
  const isValidPushKey = filteredFormattedPushKeyArray.length > 0;

  if (isValidPushKey) {
    const successMsg = `Successfully validated Push Key against Apple Servers`;
    spinner.succeed(successMsg);
  } else {
    const failureMsg = `This Push Key is no longer valid on the Apple Developer Portal`;
    spinner.fail(failureMsg);
  }

  return isValidPushKey;
}

async function filterRevokedPushKeys(pushInfoFromApple, pushKeys) {
  // if the credentials are valid, check it against apple to make sure it hasnt been revoked
  const validKeyIdsOnAppleServer = pushInfoFromApple.map(pushKey => pushKey.id);
  const validPushKeysOnExpoServer = pushKeys.filter(pushKey => {
    return validKeyIdsOnAppleServer.includes(pushKey.apnsKeyId);
  });
  return validPushKeysOnExpoServer;
}

async function getPushKeyFromParams(builderOptions) {
  const {
    pushId,
    pushP8Path,
    teamId
  } = builderOptions; // none of the pushKey params were set, assume user has no intention of passing it in

  if (!pushId && !pushP8Path) {
    return null;
  } // partial pushKey params were set, assume user has intention of passing it in


  if (!(pushId && pushP8Path && teamId)) {
    throw new Error('In order to provide a Push Key through the CLI parameters, you have to pass --push-id, --push-p8-path and --team-id parameters.');
  }

  return {
    apnsKeyId: pushId,
    apnsKeyP8: await _fsExtra().default.readFile(pushP8Path, 'utf8'),
    teamId
  };
}

async function usePushKeyFromParams(ctx, app, pushKey) {
  const isValid = await validatePushKey(ctx, pushKey);

  if (!isValid) {
    throw new Error('Cannot validate uploaded Push Key');
  }

  const iosPushCredentials = await ctx.ios.createPushKey(app.accountName, pushKey);
  await ctx.ios.usePushKey(app, iosPushCredentials.id);
  (0, _log().default)(_chalk().default.green(`Successfully assigned Push Key to ${app.accountName}/${app.projectName} (${app.bundleIdentifier})`));
  return iosPushCredentials;
}
//# sourceMappingURL=IosPushCredentials.js.map