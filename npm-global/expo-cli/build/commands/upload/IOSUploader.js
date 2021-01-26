"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.LANGUAGES = void 0;

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

function _pick() {
  const data = _interopRequireDefault(require("lodash/pick"));

  _pick = function () {
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

function _context() {
  const data = require("../../credentials/context");

  _context = function () {
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

function _BaseUploader() {
  const data = _interopRequireDefault(require("./BaseUploader"));

  _BaseUploader = function () {
    return data;
  };

  return data;
}

function _utils() {
  const data = require("./utils");

  _utils = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PLATFORM = 'ios';
const APP_NAME_TOO_LONG_MSG = `An app name can't be longer than 30 characters.`;
const APP_NAME_QUESTION = {
  type: 'input',
  name: 'appName',
  message: 'How would you like to name your app?',

  validate(appName) {
    if (!appName) {
      return 'Empty app name is not valid.';
    } else if (appName.length > 30) {
      return APP_NAME_TOO_LONG_MSG;
    } else {
      return true;
    }
  }

};
const LANGUAGES = ['Brazilian Portuguese', 'Danish', 'Dutch', 'English', 'English_Australian', 'English_CA', 'English_UK', 'Finnish', 'French', 'French_CA', 'German', 'Greek', 'Indonesian', 'Italian', 'Japanese', 'Korean', 'Malay', 'Norwegian', 'Portuguese', 'Russian', 'Simplified Chinese', 'Spanish', 'Spanish_MX', 'Swedish', 'Thai', 'Traditional Chinese', 'Turkish', 'Vietnamese'];
exports.LANGUAGES = LANGUAGES;

class IOSUploader extends _BaseUploader().default {
  static validateOptions(options) {
    if (options.language && !LANGUAGES.includes(options.language)) {
      throw new Error(`You must specify a supported language. Run expo upload:ios --help to see the list of supported languages.`);
    }

    if (options.publicUrl && !_xdl().UrlUtils.isHttps(options.publicUrl)) {
      throw new (_CommandError().default)('INVALID_PUBLIC_URL', '--public-url must be a valid HTTPS URL.');
    }
  }

  constructor(projectDir, options) {
    super(PLATFORM, projectDir, options);
    this.options = options;
  }

  _ensureExperienceIsValid(exp) {
    var _exp$ios;

    if (!((_exp$ios = exp.ios) === null || _exp$ios === void 0 ? void 0 : _exp$ios.bundleIdentifier)) {
      throw new Error(`You must specify an iOS bundle identifier in app.json.`);
    }
  }

  async _getPlatformSpecificOptions() {
    const appleIdCredentials = await this._getAppleIdCredentials();
    const appleTeamId = await this._getAppleTeamId(appleIdCredentials);
    const appName = await this._getAppName();
    const otherOptions = (0, _pick().default)(this.options, ['language', 'sku', 'companyName']);
    return { ...appleIdCredentials,
      appName,
      ...otherOptions,
      appleTeamId
    };
  }

  async _getAppleTeamId(appleIdCredentials) {
    var _ctx$manifest, _ctx$manifest$ios;

    const ctx = new (_context().Context)();
    await ctx.init(this.projectDir);
    let teamId;

    if (ctx.hasProjectContext && ((_ctx$manifest = ctx.manifest) === null || _ctx$manifest === void 0 ? void 0 : (_ctx$manifest$ios = _ctx$manifest.ios) === null || _ctx$manifest$ios === void 0 ? void 0 : _ctx$manifest$ios.bundleIdentifier)) {
      var _ctx$manifest$owner, _ctx$manifest2, _ctx$manifest2$ios, _credentials$credenti;

      const app = {
        accountName: (_ctx$manifest$owner = ctx.manifest.owner) !== null && _ctx$manifest$owner !== void 0 ? _ctx$manifest$owner : ctx.user.username,
        projectName: ctx.manifest.slug,
        bundleIdentifier: (_ctx$manifest2 = ctx.manifest) === null || _ctx$manifest2 === void 0 ? void 0 : (_ctx$manifest2$ios = _ctx$manifest2.ios) === null || _ctx$manifest2$ios === void 0 ? void 0 : _ctx$manifest2$ios.bundleIdentifier
      };
      const credentials = await ctx.ios.getAppCredentials(app);
      teamId = credentials === null || credentials === void 0 ? void 0 : (_credentials$credenti = credentials.credentials) === null || _credentials$credenti === void 0 ? void 0 : _credentials$credenti.teamId;
    }

    if (teamId) {
      return teamId;
    } else {
      const {
        team
      } = await (0, _appleApi().authenticate)(appleIdCredentials);
      return team.id;
    }
  }

  async _getAppleIdCredentials() {
    return await (0, _appleApi().requestAppleIdCreds)({
      appleId: this.options.appleId,
      appleIdPassword: this.options.appleIdPassword
    });
  }

  async _getAppName() {
    const appName = this.options.appName || this._exp && this._exp.name;

    if (!appName || appName.length > 30) {
      if (appName && appName.length > 30) {
        _log().default.error(APP_NAME_TOO_LONG_MSG);
      }

      return await this._askForAppName();
    } else {
      return appName;
    }
  }

  async _askForAppName() {
    const {
      appName
    } = await (0, _prompt().default)(APP_NAME_QUESTION);
    return appName;
  }

  async _uploadToTheStore(platformData, buildPath) {
    const {
      fastlane
    } = this;
    const {
      appleId,
      appleIdPassword,
      appName,
      language,
      appleTeamId,
      companyName
    } = platformData;
    const appleCreds = {
      appleId,
      appleIdPassword,
      appleTeamId,
      companyName
    };
    (0, _log().default)('Resolving the ITC team ID...');
    const {
      itc_team_id: itcTeamId
    } = await (0, _utils().runFastlaneAsync)(fastlane.resolveItcTeamId, [], appleCreds);
    (0, _log().default)(`ITC team ID is ${itcTeamId}`);
    const updatedAppleCreds = { ...appleCreds,
      itcTeamId
    };
    (0, _log().default)('Ensuring the app exists on App Store Connect, this may take a while...');

    try {
      var _this$_exp, _this$_exp$ios;

      await (0, _utils().runFastlaneAsync)(fastlane.appProduce, [(_this$_exp = this._exp) === null || _this$_exp === void 0 ? void 0 : (_this$_exp$ios = _this$_exp.ios) === null || _this$_exp$ios === void 0 ? void 0 : _this$_exp$ios.bundleIdentifier, appName, appleId, language], updatedAppleCreds);
    } catch (err) {
      if (err.message.match(/You must provide a company name to use on the App Store/)) {
        _log().default.error('You haven\'t uploaded any app to App Store yet. Please provide your company name with --company-name "COMPANY NAME"');
      }

      throw err;
    }

    (0, _log().default)('Uploading the app to Testflight, hold tight...');
    await (0, _utils().runFastlaneAsync)(fastlane.pilotUpload, [buildPath, appleId], updatedAppleCreds);
    (0, _log().default)(`All done! You may want to go to App Store Connect (${_chalk().default.underline('https://appstoreconnect.apple.com')}) and share your build with your testers.`);
  }

}

exports.default = IOSUploader;
//# sourceMappingURL=IOSUploader.js.map