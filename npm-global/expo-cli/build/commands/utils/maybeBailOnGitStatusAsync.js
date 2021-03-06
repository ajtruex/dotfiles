"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = maybeBailOnGitStatusAsync;

function _commander() {
  const data = _interopRequireDefault(require("commander"));

  _commander = function () {
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

function _prompts() {
  const data = require("../../prompts");

  _prompts = function () {
    return data;
  };

  return data;
}

function _ProjectUtils() {
  const data = require("./ProjectUtils");

  _ProjectUtils = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function maybeBailOnGitStatusAsync() {
  const isGitStatusClean = await (0, _ProjectUtils().validateGitStatusAsync)();

  _log().default.newLine(); // Give people a chance to bail out if git working tree is dirty


  if (!isGitStatusClean) {
    if (_commander().default.nonInteractive) {
      _log().default.warn(`Git status is dirty but the command will continue because nonInteractive is enabled.`);

      return false;
    }

    const answer = await (0, _prompts().confirmAsync)({
      message: `Would you like to proceed?`
    });

    if (!answer) {
      return true;
    }

    _log().default.newLine();
  }

  return false;
}
//# sourceMappingURL=maybeBailOnGitStatusAsync.js.map