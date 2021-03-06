"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _xdl() {
  const data = require("@expo/xdl");

  _xdl = function () {
    return data;
  };

  return data;
}

function _log() {
  const data = _interopRequireDefault(require("./log"));

  _log = function () {
    return data;
  };

  return data;
}

function _prompt() {
  const data = _interopRequireDefault(require("./prompt"));

  _prompt = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function askForSendToAsync() {
  const cachedValue = await _xdl().UserSettings.getAsync('sendTo', null);
  (0, _log().default)("Enter an email address and we'll send a link to your phone.");
  const answers = await (0, _prompt().default)([{
    type: 'input',
    name: 'sendTo',
    message: `Your email address ${cachedValue ? ' (space to not send anything)' : ''}:`,
    default: cachedValue !== null && cachedValue !== void 0 ? cachedValue : undefined
  }], {
    nonInteractiveHelp: 'Please specify email address with --send-to.'
  });
  const recipient = answers.sendTo.trim();
  await _xdl().UserSettings.mergeAsync({
    sendTo: recipient
  });
  return recipient;
}

var _default = {
  askForSendToAsync
};
exports.default = _default;
//# sourceMappingURL=askUser.js.map