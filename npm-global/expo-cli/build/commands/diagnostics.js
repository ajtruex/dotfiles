"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _config() {
  const data = require("@expo/config");

  _config = function () {
    return data;
  };

  return data;
}

function _envinfo() {
  const data = _interopRequireDefault(require("envinfo"));

  _envinfo = function () {
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

// @ts-ignore
const packageJSON = require('../../package.json');

async function action(projectRoot) {
  const info = await _envinfo().default.run({
    System: ['OS', 'Shell'],
    Binaries: ['Node', 'Yarn', 'npm', 'Watchman'],
    IDEs: ['Xcode', 'Android Studio'],
    Managers: ['CocoaPods'],
    SDKs: ['iOS SDK', 'Android SDK'],
    npmPackages: ['expo', 'react', 'react-dom', 'react-native', 'react-native-web', 'react-navigation', '@expo/webpack-config'],
    npmGlobalPackages: ['expo-cli']
  }, {
    yaml: true,
    title: `Expo CLI ${packageJSON.version} environment info`
  });
  const workflow = (0, _config().getDefaultTarget)(projectRoot !== null && projectRoot !== void 0 ? projectRoot : process.cwd());
  const lines = info.split('\n');
  lines.pop();
  lines.push(`    Expo Workflow: ${workflow}`);
  (0, _log().default)(lines.join('\n') + '\n');
}

function _default(program) {
  program.command('diagnostics [path]').description('Log environment info to the console').helpGroup('info').asyncAction(action);
}
//# sourceMappingURL=diagnostics.js.map