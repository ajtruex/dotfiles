"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

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

function _ora() {
  const data = _interopRequireDefault(require("ora"));

  _ora = function () {
    return data;
  };

  return data;
}

function _log() {
  const data = _interopRequireDefault(require("../../../log"));

  _log = function () {
    return data;
  };

  return data;
}

function _projects() {
  const data = require("../../../projects");

  _projects = function () {
    return data;
  };

  return data;
}

function _cliTable() {
  const data = require("../../utils/cli-table");

  _cliTable = function () {
    return data;
  };

  return data;
}

function _types() {
  const data = require("../types");

  _types = function () {
    return data;
  };

  return data;
}

function _analytics() {
  const data = _interopRequireDefault(require("../utils/analytics"));

  _analytics = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function statusAction(projectDir, {
  platform,
  status,
  buildId
}) {
  var _builds;

  if (buildId) {
    if (platform) {
      throw new Error('-p/--platform cannot be specified if --build-id is specified.');
    }

    if (status) {
      throw new Error('-s/--status cannot be specified if --build-id is specified.');
    }
  } else {
    const platforms = Object.values(_types().BuildCommandPlatform);
    const statuses = Object.values(_types().BuildStatus);

    if (platform && !platforms.includes(platform)) {
      throw new Error(`-p/--platform needs to be one of: ${platforms.map(p => _log().default.chalk.bold(p)).join(', ')}`);
    }

    if (status && !statuses.includes(status)) {
      throw new Error(`-s/--status needs to be one of: ${statuses.map(s => _log().default.chalk.bold(s)).join(', ')}`);
    }
  }

  const user = await _xdl().UserManager.ensureLoggedInAsync();
  const {
    exp
  } = (0, _config().getConfig)(projectDir);
  const accountName = exp.owner || user.username;
  const projectName = exp.slug;
  const projectId = await (0, _projects().ensureProjectExistsAsync)(user, {
    accountName,
    projectName
  });

  _analytics().default.logEvent(_types().AnalyticsEvent.BUILD_STATUS_COMMAND, {
    project_id: projectId,
    account_name: accountName,
    project_name: projectName,
    requested_platform: platform
  });

  const client = _xdl().ApiV2.clientForUser(user);

  const spinner = (0, _ora().default)().start('Fetching build history...');
  let builds;

  try {
    if (buildId) {
      const buildStatus = await client.getAsync(`projects/${projectId}/builds/${buildId}`);
      builds = buildStatus ? [buildStatus] : undefined;
    } else {
      const params = { ...([_types().BuildCommandPlatform.ANDROID, _types().BuildCommandPlatform.IOS].includes(platform) ? {
          platform
        } : null),
        ...(status ? {
          status
        } : null)
      };
      const buildStatus = await client.getAsync(`projects/${projectId}/builds`, params);
      builds = buildStatus === null || buildStatus === void 0 ? void 0 : buildStatus.builds;
    }
  } catch (e) {
    spinner.fail(e.message);
    throw new Error('Error getting current build status for this project.');
  }

  if (!((_builds = builds) === null || _builds === void 0 ? void 0 : _builds.length)) {
    spinner.succeed('No currently active or previous builds for this project.');
  } else {
    spinner.succeed(`Found ${builds.length} builds for this project.`);
    printBuildTable(builds);
  }
}

function printBuildTable(builds) {
  const headers = ['started', 'platform', 'status', 'artifact'];
  const colWidths = [24, 10, 13];
  const refactoredBuilds = builds.map(build => {
    var _build$artifacts;

    const buildUrl = build.status === _types().BuildStatus.FINISHED ? (_build$artifacts = build.artifacts) === null || _build$artifacts === void 0 ? void 0 : _build$artifacts.buildUrl : undefined;
    return {
      started: new Intl.DateTimeFormat('en', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(build.createdAt)),
      platform: build.platform,
      status: build.status.replace(/-/g, ' '),
      artifact: buildUrl ? _log().default.terminalLink(buildUrl, buildUrl) : '-------'
    };
  });
  const buildTable = (0, _cliTable().printTableJsonArray)(headers, refactoredBuilds, colWidths);
  (0, _log().default)(buildTable);
}

var _default = statusAction;
exports.default = _default;
//# sourceMappingURL=action.js.map