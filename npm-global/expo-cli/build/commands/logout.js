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

function _log() {
  const data = _interopRequireDefault(require("../log"));

  _log = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function action() {
  try {
    await _xdl().UserManager.logoutAsync();
    (0, _log().default)('Logged out');
  } catch (e) {
    throw new Error("Unexpected Error: Couldn't logout");
  }
}

function _default(program) {
  program.command('logout').description('Logout of an Expo account').helpGroup('auth').asyncAction(action);
}
//# sourceMappingURL=logout.js.map