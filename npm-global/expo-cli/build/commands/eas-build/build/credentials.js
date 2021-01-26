"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensureCredentialsAsync = ensureCredentialsAsync;

function _CommandError() {
  const data = _interopRequireDefault(require("../../../CommandError"));

  _CommandError = function () {
    return data;
  };

  return data;
}

function _easJson() {
  const data = require("../../../easJson");

  _easJson = function () {
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
  const data = _interopRequireDefault(require("../../../prompts"));

  _prompts = function () {
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const USING_CREDENTIALS_JSON_MSG = 'Using credentials from the local credentials.json file';
const USING_REMOTE_CREDENTIALS_MSG = 'Using credentials stored on the Expo servers';

async function ensureCredentialsAutoAsync(provider, workflow, nonInteractive) {
  const platform = _constants().platformDisplayNames[provider.platform];

  switch (workflow) {
    case _easJson().Workflow.Managed:
      if (await provider.hasLocalAsync()) {
        return _easJson().CredentialsSource.LOCAL;
      } else {
        return _easJson().CredentialsSource.REMOTE;
      }

    case _easJson().Workflow.Generic:
      {
        const hasLocal = await provider.hasLocalAsync();
        const hasRemote = await provider.hasRemoteAsync();

        if (hasRemote && hasLocal) {
          if (!(await provider.isLocalSyncedAsync())) {
            if (nonInteractive) {
              throw new (_CommandError().default)('NON_INTERACTIVE', `Contents of your local credentials.json for ${platform} are not the same as credentials on Expo servers. To use the desired credentials, set the "builds.${platform}.{profile}.credentialsSource" field in the credentials.json file to one of the following: "local", "remote".`);
            } else {
              (0, _log().default)(`Contents of your local credentials.json for ${platform} are not the same as credentials on Expo servers`);
            }

            const {
              select
            } = await (0, _prompts().default)({
              type: 'select',
              name: 'select',
              message: 'Which credentials you want to use for this build?',
              choices: [{
                title: 'Local credentials.json',
                value: _easJson().CredentialsSource.LOCAL
              }, {
                title: 'Credentials stored on Expo servers.',
                value: _easJson().CredentialsSource.REMOTE
              }]
            });
            return select;
          } else {
            return _easJson().CredentialsSource.LOCAL;
          }
        } else if (hasLocal) {
          (0, _log().default)(_log().default.chalk.bold(USING_CREDENTIALS_JSON_MSG));
          return _easJson().CredentialsSource.LOCAL;
        } else if (hasRemote) {
          (0, _log().default)(_log().default.chalk.bold(USING_REMOTE_CREDENTIALS_MSG));
          return _easJson().CredentialsSource.REMOTE;
        } else {
          if (nonInteractive) {
            throw new (_CommandError().default)('NON_INTERACTIVE', `Credentials for this app are not configured and there is no entry in credentials.json for ${platform}. Either configure credentials.json, or launch the build without "--non-interactive" flag to get a prompt to generate credentials automatically.`);
          } else {
            _log().default.warn(`Credentials for this app are not configured and there is no entry in credentials.json for ${platform}`);
          }

          const {
            confirm
          } = await (0, _prompts().default)({
            type: 'confirm',
            name: 'confirm',
            message: 'Do you want to generate new credentials?'
          });

          if (confirm) {
            return _easJson().CredentialsSource.REMOTE;
          } else {
            throw new Error(`Aborting build process, credentials are not configured for ${platform}`);
          }
        }
      }
  }
}

async function ensureCredentialsAsync(provider, workflow, src, nonInteractive) {
  switch (src) {
    case _easJson().CredentialsSource.LOCAL:
      (0, _log().default)(_log().default.chalk.bold(USING_CREDENTIALS_JSON_MSG));
      return _easJson().CredentialsSource.LOCAL;

    case _easJson().CredentialsSource.REMOTE:
      (0, _log().default)(_log().default.chalk.bold(USING_REMOTE_CREDENTIALS_MSG));
      return _easJson().CredentialsSource.REMOTE;

    case _easJson().CredentialsSource.AUTO:
      (0, _log().default)('Resolving credentials source (auto mode)');
      return await ensureCredentialsAutoAsync(provider, workflow, nonInteractive);
  }
}
//# sourceMappingURL=credentials.js.map