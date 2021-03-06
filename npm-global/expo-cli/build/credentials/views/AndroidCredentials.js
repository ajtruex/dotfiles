"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExperienceView = void 0;

function _isEmpty() {
  const data = _interopRequireDefault(require("lodash/isEmpty"));

  _isEmpty = function () {
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

function _list() {
  const data = require("../actions/list");

  _list = function () {
    return data;
  };

  return data;
}

function _AndroidKeystore() {
  const data = require("./AndroidKeystore");

  _AndroidKeystore = function () {
    return data;
  };

  return data;
}

function _AndroidPushCredentials() {
  const data = require("./AndroidPushCredentials");

  _AndroidPushCredentials = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ExperienceView {
  constructor(experienceName) {
    this.experienceName = experienceName;
  }

  async open(ctx) {
    const credentials = await ctx.android.fetchCredentials(this.experienceName);

    if ((0, _isEmpty().default)(credentials.keystore) && (0, _isEmpty().default)(credentials.pushCredentials)) {
      (0, _log().default)(`No credentials available for ${this.experienceName} experience.\n`);
    } else if (this.experienceName) {
      _log().default.newLine();

      await (0, _list().displayAndroidAppCredentials)(credentials);

      _log().default.newLine();
    }

    const {
      action
    } = await (0, _prompt().default)([{
      type: 'list',
      name: 'action',
      message: 'What do you want to do?',
      choices: [{
        value: 'update-keystore',
        name: 'Update upload Keystore'
      }, {
        value: 'remove-keystore',
        name: 'Remove keystore'
      }, {
        value: 'update-fcm-key',
        name: 'Update FCM Api Key'
      }, {
        value: 'fetch-keystore',
        name: 'Download Keystore from the Expo servers'
      } // { value: 'fetch-public-cert', name: 'Extract public cert from Keystore' },
      // {
      //   value: 'fetch-private-signing-key',
      //   name:
      //     'Extract private signing key (required when migration to App Signing by Google Play)',
      // },
      ]
    }]);
    return this.handleAction(ctx, action);
  }

  handleAction(context, selected) {
    switch (selected) {
      case 'update-keystore':
        return new (_AndroidKeystore().UpdateKeystore)(this.experienceName, {
          skipKeystoreValidation: false
        });

      case 'remove-keystore':
        return new (_AndroidKeystore().RemoveKeystore)(this.experienceName);

      case 'update-fcm-key':
        return new (_AndroidPushCredentials().UpdateFcmKey)(this.experienceName);

      case 'fetch-keystore':
        return new (_AndroidKeystore().DownloadKeystore)(this.experienceName);

      case 'fetch-public-cert':
        return null;
    }

    return null;
  }

}

exports.ExperienceView = ExperienceView;
//# sourceMappingURL=AndroidCredentials.js.map