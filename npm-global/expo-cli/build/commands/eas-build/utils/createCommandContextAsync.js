"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createCommandContextAsync;

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

async function createCommandContextAsync({
  requestedPlatform,
  profile,
  projectDir,
  trackingCtx,
  nonInteractive = false,
  skipCredentialsCheck = false,
  skipProjectConfiguration = false
}) {
  const user = await _xdl().UserManager.ensureLoggedInAsync();
  const {
    exp
  } = (0, _config().getConfig)(projectDir, {
    skipSDKVersionRequirement: true
  });
  const accountName = exp.owner || user.username;
  const projectName = exp.slug;
  return {
    requestedPlatform,
    profile,
    projectDir,
    user,
    accountName,
    projectName,
    exp,
    trackingCtx,
    nonInteractive,
    skipCredentialsCheck,
    skipProjectConfiguration
  };
}
//# sourceMappingURL=createCommandContextAsync.js.map