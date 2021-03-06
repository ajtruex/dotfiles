"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

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

function _askUser() {
  const data = _interopRequireDefault(require("../askUser"));

  _askUser = function () {
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

function _sendTo() {
  const data = _interopRequireDefault(require("../sendTo"));

  _sendTo = function () {
    return data;
  };

  return data;
}

function _urlOpts() {
  const data = _interopRequireDefault(require("../urlOpts"));

  _urlOpts = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function action(projectDir, options) {
  await _urlOpts().default.optsAsync(projectDir, options);
  const url = await _xdl().UrlUtils.constructManifestUrlAsync(projectDir);
  (0, _log().default)('Your project manifest URL is\n\n' + _chalk().default.underline(url) + '\n');

  if (await _urlOpts().default.handleMobileOptsAsync(projectDir, options)) {
    return;
  }

  let recipient;

  if (typeof options.sendTo !== 'boolean') {
    recipient = options.sendTo;
  } else {
    recipient = await _xdl().UserSettings.getAsync('sendTo', null);
  }

  if (!recipient) {
    recipient = await _askUser().default.askForSendToAsync();
  }

  if (recipient) {
    await _sendTo().default.sendUrlAsync(url, recipient);
  } else {
    _log().default.gray("(Not sending anything because you didn't specify a recipient.)");
  }
}

function _default(program) {
  program.command('send [path]').description(`Share the project's URL to an email address`).helpGroup('core').option('-s, --send-to [dest]', 'Email address to send the URL to').urlOpts().asyncActionProjectDir(action);
}
//# sourceMappingURL=send.js.map