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

function _log() {
  const data = _interopRequireDefault(require("../log"));

  _log = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function action(command) {
  const user = await _xdl().UserManager.getCurrentUserAsync({
    silent: true
  });

  if (user) {
    var _command$parent;

    if ((_command$parent = command.parent) === null || _command$parent === void 0 ? void 0 : _command$parent.nonInteractive) {
      _log().default.nested(user.username);
    } else {
      (0, _log().default)(`Logged in as ${_chalk().default.cyan(user.username)}`);
    }
  } else {
    (0, _log().default)(`\u203A Not logged in, run ${_chalk().default.cyan`expo login`} to authenticate`);
    process.exit(1);
  }
}

function _default(program) {
  program.command('whoami').helpGroup('auth').alias('w').description('Return the currently authenticated account').asyncAction(action);
}
//# sourceMappingURL=whoami.js.map