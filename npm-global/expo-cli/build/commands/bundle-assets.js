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

function _terminalLink() {
  const data = _interopRequireDefault(require("terminal-link"));

  _terminalLink = function () {
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

async function action(projectDir, options) {
  try {
    await _xdl().Detach.bundleAssetsAsync(projectDir, options);
  } catch (e) {
    _log().default.error(e);

    _log().default.error(`Before making a release build, make sure you have run '${_chalk().default.bold('expo publish')}' at least once. ${(0, _terminalLink().default)('Learn more.', 'https://expo.fyi/release-builds-with-expo-updates')}`);

    process.exit(1);
  }
}

function _default(program) {
  program.command('bundle-assets [path]').description('Bundle assets for a detached app. This command should be executed from xcode or gradle').helpGroup('internal').option('--dest [dest]', 'Destination directory for assets').option('--platform [platform]', 'detached project platform').asyncActionProjectDir(action);
}
//# sourceMappingURL=bundle-assets.js.map