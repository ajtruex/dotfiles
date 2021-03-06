"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = setup;

function _fsExtra() {
  const data = _interopRequireDefault(require("fs-extra"));

  _fsExtra = function () {
    return data;
  };

  return data;
}

function _os() {
  const data = require("os");

  _os = function () {
    return data;
  };

  return data;
}

function _fastlane() {
  const data = require("./fastlane");

  _fastlane = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ENABLE_WSL = `
Does not seem like WSL is enabled on this machine. Download from
the Windows app store a distribution of Linux, then in an admin powershell run:

Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux

and run the new Linux installation at least once
`;
let setupCompleted = false;

async function setup() {
  if (setupCompleted) {
    return;
  }

  if (process.platform === 'win32') {
    const [version] = (0, _os().release)().match(/\d./) || [null];

    if (version !== '10') {
      throw new Error('Must be on at least Windows version 10 for WSL support to work');
    }

    try {
      await _fsExtra().default.access(_fastlane().WSL_BASH_PATH, _fsExtra().default.constants.F_OK);
    } catch (e) {
      throw new Error(ENABLE_WSL);
    }
  }

  setupCompleted = true;
}
//# sourceMappingURL=setup.js.map