"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getConfigurationOptionsAsync;

function _config() {
  const data = require("@expo/config");

  _config = function () {
    return data;
  };

  return data;
}

function _xdl() {
  const data = require("@expo/xdl");

  _xdl = function () {
    return data;
  };

  return data;
}

async function getConfigurationOptionsAsync(projectDir) {
  const username = await _xdl().UserManager.getCurrentUsernameAsync();
  const {
    exp
  } = (0, _config().getConfig)(projectDir, {
    skipSDKVersionRequirement: true
  });

  if (!exp.runtimeVersion && !exp.sdkVersion) {
    throw new Error("Couldn't find either 'runtimeVersion' or 'sdkVersion' to configure 'expo-updates'. Please specify at least one of these properties under the 'expo' key in 'app.json'");
  }

  return {
    exp,
    username
  };
}
//# sourceMappingURL=getConfigurationOptions.js.map