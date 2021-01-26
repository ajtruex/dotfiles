"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authenticate = authenticate;
exports.requestAppleIdCreds = requestAppleIdCreds;

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

function _wordwrap() {
  const data = _interopRequireDefault(require("wordwrap"));

  _wordwrap = function () {
    return data;
  };

  return data;
}

function _TerminalLink() {
  const data = require("../commands/utils/TerminalLink");

  _TerminalLink = function () {
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

function _prompt() {
  const data = _interopRequireDefault(require("../prompt"));

  _prompt = function () {
    return data;
  };

  return data;
}

function _validators() {
  const data = require("../validators");

  _validators = function () {
    return data;
  };

  return data;
}

function _fastlane() {
  const data = require("./fastlane");

  _fastlane = function () {
    return data;
  };

  return data;
}

function Keychain() {
  const data = _interopRequireWildcard(require("./keychain"));

  Keychain = function () {
    return data;
  };

  return data;
}

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const APPLE_IN_HOUSE_TEAM_TYPE = 'in-house';

async function authenticate(options = {}) {
  const {
    appleId,
    appleIdPassword
  } = await requestAppleIdCreds(options);
  (0, _log().default)(`Authenticating to Apple Developer Portal...`); // use log instead of spinner in case we need to prompt user for 2fa

  try {
    const {
      teams,
      fastlaneSession
    } = await (0, _fastlane().runAction)(_fastlane().travelingFastlane.authenticate, [appleId, appleIdPassword], {
      pipeStdout: true
    });
    (0, _log().default)(_chalk().default.green('Authenticated with Apple Developer Portal successfully!'));
    const team = await _chooseTeam(teams, options.teamId);
    return {
      appleId,
      appleIdPassword,
      team,
      fastlaneSession
    };
  } catch (err) {
    var _err$rawDump;

    if ((_err$rawDump = err.rawDump) === null || _err$rawDump === void 0 ? void 0 : _err$rawDump.match(/Invalid username and password combination/)) {
      (0, _log().default)(_chalk().default.red('Invalid username and password combination, try again.'));
      const anotherPromptResult = await _promptForAppleId({
        firstAttempt: false,
        previousAppleId: appleId
      });
      return authenticate({ ...options,
        ...anotherPromptResult
      });
    }

    (0, _log().default)(_chalk().default.red('Authentication with Apple Developer Portal failed!'));
    throw err;
  }
}

async function requestAppleIdCreds(options) {
  return _getAppleIdFromParams(options) || (await _promptForAppleId());
}

function _getAppleIdFromParams({
  appleId,
  appleIdPassword
}) {
  const passedAppleId = appleId || process.env.EXPO_APPLE_ID;
  const passedAppleIdPassword = passedAppleId ? appleIdPassword || process.env.EXPO_APPLE_PASSWORD || process.env.EXPO_APPLE_ID_PASSWORD : undefined;

  if (process.env.EXPO_APPLE_ID_PASSWORD) {
    _log().default.error('EXPO_APPLE_ID_PASSWORD is deprecated, please use EXPO_APPLE_PASSWORD instead!');
  } // none of the apple id params were set, assume user has no intention of passing it in


  if (!passedAppleId) {
    return null;
  } // partial apple id params were set, assume user has intention of passing it in


  if (!passedAppleIdPassword) {
    throw new Error('In order to provide your Apple ID credentials, you must set the --apple-id flag and set the EXPO_APPLE_PASSWORD environment variable.');
  }

  return {
    appleId: passedAppleId,
    appleIdPassword: passedAppleIdPassword
  };
}

async function _promptForAppleId({
  firstAttempt = true,
  previousAppleId
} = {}) {
  if (firstAttempt) {
    const wrap = (0, _wordwrap().default)(process.stdout.columns || 80);
    (0, _log().default)(wrap('Please enter your Apple Developer Program account credentials. ' + 'These credentials are needed to manage certificates, keys and provisioning profiles ' + `in your Apple Developer account.`)); // https://docs.expo.io/distribution/security/#apple-developer-account-credentials

    (0, _log().default)(wrap(_chalk().default.bold(`The password is only used to authenticate with Apple and never stored on Expo servers`)));
    (0, _log().default)(wrap(_chalk().default.dim((0, _TerminalLink().learnMore)('https://bit.ly/2VtGWhU'))));
  } // Get the email address that was last used and set it as
  // the default value for quicker authentication.


  const lastAppleId = await getLastUsedAppleIdAsync();
  const {
    appleId: promptAppleId
  } = await (0, _prompt().default)({
    type: 'input',
    name: 'appleId',
    message: `Apple ID:`,
    validate: _validators().nonEmptyInput,
    default: lastAppleId !== null && lastAppleId !== void 0 ? lastAppleId : undefined,
    ...(previousAppleId && {
      default: previousAppleId
    })
  }, {
    nonInteractiveHelp: 'Pass your Apple ID using the --apple-id flag.'
  }); // If a new email was used then store it as a suggestion for next time.
  // This functionality is disabled using the keychain mechanism.

  if (!Keychain().EXPO_NO_KEYCHAIN && promptAppleId && lastAppleId !== promptAppleId) {
    await _xdl().UserSettings.setAsync('appleId', promptAppleId);
  } // Only check on the first attempt in case the user changed their password.


  if (firstAttempt) {
    const password = await getPasswordAsync({
      appleId: promptAppleId
    });

    if (password) {
      (0, _log().default)(`Using password from your local Keychain. ${_chalk().default.dim(`Learn more ${_chalk().default.underline('https://docs.expo.io/distribution/security#keychain')}`)}`);
      return {
        appleId: promptAppleId,
        appleIdPassword: password
      };
    }
  }

  const {
    appleIdPassword
  } = await (0, _prompt().default)({
    type: 'password',
    name: 'appleIdPassword',
    message: () => `Password (for ${promptAppleId}):`,
    validate: _validators().nonEmptyInput
  }, {
    nonInteractiveHelp: 'Pass your Apple ID password using the EXPO_APPLE_PASSWORD environment variable'
  });
  await setPasswordAsync({
    appleId: promptAppleId,
    appleIdPassword
  });
  return {
    appleId: promptAppleId,
    appleIdPassword
  };
}

async function _chooseTeam(teams, userProvidedTeamId) {
  if (teams.length === 0) {
    throw new Error(`You have no team associated with your Apple account, cannot proceed.
(Do you have a paid Apple Developer account?)`);
  }

  if (userProvidedTeamId) {
    const foundTeam = teams.find(({
      teamId
    }) => teamId === userProvidedTeamId);

    if (foundTeam) {
      (0, _log().default)(`Using Apple Team with ID: ${userProvidedTeamId}`);
      return _formatTeam(foundTeam);
    } else {
      _log().default.warn(`Your account is not associated with Apple Team with ID: ${userProvidedTeamId}`);
    }
  }

  if (teams.length === 1) {
    const [team] = teams;
    (0, _log().default)(`Only 1 team associated with your account, using Apple Team with ID: ${team.teamId}`);
    return _formatTeam(team);
  } else {
    (0, _log().default)(`You have ${teams.length} teams associated with your account`);
    const choices = teams.map((team, i) => ({
      name: `${i + 1}) ${team.teamId} "${team.name}" (${team.type})`,
      value: team
    }));
    const {
      team
    } = await (0, _prompt().default)({
      type: 'list',
      name: 'team',
      message: 'Which team would you like to use?',
      choices
    }, {
      nonInteractiveHelp: 'Pass in your Apple Team ID using the --team-id flag.'
    });
    return _formatTeam(team);
  }
}

function _formatTeam({
  teamId,
  name,
  type
}) {
  return {
    id: teamId,
    name: `${name} (${type})`,
    inHouse: type.toLowerCase() === APPLE_IN_HOUSE_TEAM_TYPE
  };
}

async function getLastUsedAppleIdAsync() {
  if (Keychain().EXPO_NO_KEYCHAIN) {
    // Clear last used apple ID.
    await _xdl().UserSettings.deleteKeyAsync('appleId');
    return null;
  }

  try {
    var _await$UserSettings$g;

    // @ts-ignore: appleId syncing issue
    const lastAppleId = (_await$UserSettings$g = await _xdl().UserSettings.getAsync('appleId')) !== null && _await$UserSettings$g !== void 0 ? _await$UserSettings$g : null;

    if (typeof lastAppleId === 'string') {
      return lastAppleId;
    }
  } catch (_unused) {}

  return null;
}
/**
 * Returns the same prefix used by Fastlane in order to potentially share access between services.
 * [Cite. Fastlane](https://github.com/fastlane/fastlane/blob/f831062fa6f4b216b8ee38949adfe28fc11a0a8e/credentials_manager/lib/credentials_manager/account_manager.rb#L8).
 *
 * @param appleId email address
 */


function getKeychainServiceName(appleId) {
  return `deliver.${appleId}`;
}

async function deletePasswordAsync({
  appleId
}) {
  const serviceName = getKeychainServiceName(appleId);
  const success = await Keychain().deletePasswordAsync({
    username: appleId,
    serviceName
  });

  if (success) {
    (0, _log().default)('Removed Apple ID password from the native Keychain.');
  }

  return success;
}

async function getPasswordAsync({
  appleId
}) {
  // If the user opts out, delete the password.
  if (Keychain().EXPO_NO_KEYCHAIN) {
    await deletePasswordAsync({
      appleId
    });
    return null;
  }

  const serviceName = getKeychainServiceName(appleId);
  return Keychain().getPasswordAsync({
    username: appleId,
    serviceName
  });
}

async function setPasswordAsync({
  appleId,
  appleIdPassword
}) {
  if (Keychain().EXPO_NO_KEYCHAIN) {
    (0, _log().default)('Skip storing Apple ID password in the local Keychain.');
    return false;
  }

  (0, _log().default)(`Saving Apple ID password to the local Keychain. ${_chalk().default.dim(`Learn more ${_chalk().default.underline('https://docs.expo.io/distribution/security#keychain')}`)}`);
  const serviceName = getKeychainServiceName(appleId);
  return Keychain().setPasswordAsync({
    username: appleId,
    password: appleIdPassword,
    serviceName
  });
}
//# sourceMappingURL=authenticate.js.map