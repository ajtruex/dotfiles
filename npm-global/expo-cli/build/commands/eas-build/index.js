"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _fsExtra() {
  const data = _interopRequireDefault(require("fs-extra"));

  _fsExtra = function () {
    return data;
  };

  return data;
}

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
    return data;
  };

  return data;
}

function _action() {
  const data = _interopRequireDefault(require("./build/action"));

  _action = function () {
    return data;
  };

  return data;
}

function _action2() {
  const data = _interopRequireDefault(require("./credentialsSync/action"));

  _action2 = function () {
    return data;
  };

  return data;
}

function _action3() {
  const data = _interopRequireDefault(require("./init/action"));

  _action3 = function () {
    return data;
  };

  return data;
}

function _action4() {
  const data = _interopRequireDefault(require("./status/action"));

  _action4 = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(program) {
  // don't register `expo eas:build:*` commands if eas.json doesn't exist
  const easJsonPath = _path().default.join(process.cwd(), 'eas.json');

  const hasEasJson = _fsExtra().default.pathExistsSync(easJsonPath);

  program.command('eas:build:init [path]').description('Initialize build configuration for the project').helpGroup('eas').option('-p --platform <platform>', 'Platform to configure: ios, android, all', /^(all|android|ios)$/i).option('--skip-credentials-check', 'Skip checking credentials', false).asyncActionProjectDir(_action3().default, {
    checkConfig: true,
    skipSDKVersionRequirement: true
  });

  if (!hasEasJson) {
    return;
  }

  program.command('eas:credentials:sync [path]').description('Update credentials.json with credentials stored on Expo servers').helpGroup('eas').asyncActionProjectDir(_action2().default, {
    checkConfig: true,
    skipSDKVersionRequirement: true
  });
  program.command('eas:build [path]').description('Build an app binary for the project').helpGroup('eas').option('-p --platform <platform>', 'Build for the specified platform: ios, android, all', /^(all|android|ios)$/i).option('--skip-credentials-check', 'Skip checking credentials', false).option('--skip-project-configuration', 'Skip configuring the project', false).option('--no-wait', 'Exit immediately after scheduling build', false).option('--profile <profile>', 'Build profile', 'release').asyncActionProjectDir(_action().default, {
    checkConfig: true,
    skipSDKVersionRequirement: true
  });
  program.command('eas:build:status [path]').description('Log the status of the latest builds for the project').helpGroup('eas').option('-p --platform <platform>', 'Get builds for specified platform: ios, android, all', /^(all|android|ios)$/i).option('-s --status <status>', 'Get builds with the specified status: in-queue, in-progress, errored, finished', /^(in-queue|in-progress|errored|finished)$/).option('-b --build-id <build-id>', 'Get the build with a specific build id').asyncActionProjectDir(_action4().default, {
    checkConfig: true,
    skipSDKVersionRequirement: true
  });
}
//# sourceMappingURL=index.js.map