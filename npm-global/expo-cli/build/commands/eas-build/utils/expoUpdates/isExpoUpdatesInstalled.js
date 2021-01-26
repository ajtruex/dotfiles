"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isExpoUpdatesInstalled;

function _config() {
  const data = require("@expo/config");

  _config = function () {
    return data;
  };

  return data;
}

function isExpoUpdatesInstalled(projectDir) {
  const packageJson = (0, _config().getPackageJson)(projectDir);
  return packageJson.dependencies && 'expo-updates' in packageJson.dependencies;
}
//# sourceMappingURL=isExpoUpdatesInstalled.js.map