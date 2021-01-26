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

async function action(projectDir) {
  // note: this currently only warns when something isn't right, it doesn't fail
  await _xdl().Doctor.validateExpoServersAsync(projectDir);

  if ((await _xdl().Doctor.validateWithNetworkAsync(projectDir)) === _xdl().Doctor.NO_ISSUES) {
    (0, _log().default)(`Didn't find any issues with the project!`);
  }

  process.exit();
}

function _default(program) {
  program.command('doctor [path]').description('Diagnose issues with the project').helpGroup('info').asyncActionProjectDir(action);
}
//# sourceMappingURL=doctor.js.map