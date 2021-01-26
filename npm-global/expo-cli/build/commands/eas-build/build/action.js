"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _easBuildJob() {
  const data = require("@expo/eas-build-job");

  _easBuildJob = function () {
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

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function () {
    return data;
  };

  return data;
}

function _delayAsync() {
  const data = _interopRequireDefault(require("delay-async"));

  _delayAsync = function () {
    return data;
  };

  return data;
}

function _fsExtra() {
  const data = _interopRequireDefault(require("fs-extra"));

  _fsExtra = function () {
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

function _os() {
  const data = _interopRequireDefault(require("os"));

  _os = function () {
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

function _uuid() {
  const data = require("uuid");

  _uuid = function () {
    return data;
  };

  return data;
}

function _easJson() {
  const data = require("../../../easJson");

  _easJson = function () {
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

function _uploads() {
  const data = require("../../../uploads");

  _uploads = function () {
    return data;
  };

  return data;
}

function _progress() {
  const data = require("../../utils/progress");

  _progress = function () {
    return data;
  };

  return data;
}

function _constants() {
  const data = require("../constants");

  _constants = function () {
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

function _createBuilderContext() {
  const data = _interopRequireDefault(require("../utils/createBuilderContext"));

  _createBuilderContext = function () {
    return data;
  };

  return data;
}

function _createCommandContextAsync() {
  const data = _interopRequireDefault(require("../utils/createCommandContextAsync"));

  _createCommandContextAsync = function () {
    return data;
  };

  return data;
}

function _git() {
  const data = require("../utils/git");

  _git = function () {
    return data;
  };

  return data;
}

function _misc() {
  const data = require("../utils/misc");

  _misc = function () {
    return data;
  };

  return data;
}

function _AndroidBuilder() {
  const data = _interopRequireDefault(require("./builders/AndroidBuilder"));

  _AndroidBuilder = function () {
    return data;
  };

  return data;
}

function _iOSBuilder() {
  const data = _interopRequireDefault(require("./builders/iOSBuilder"));

  _iOSBuilder = function () {
    return data;
  };

  return data;
}

function _metadata() {
  const data = require("./metadata");

  _metadata = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function buildAction(projectDir, options) {
  var _options$parent;

  const buildCommandPlatforms = Object.values(_types().BuildCommandPlatform);
  const {
    platform: requestedPlatform,
    profile
  } = options;

  if (!requestedPlatform || !buildCommandPlatforms.includes(requestedPlatform)) {
    throw new Error(`-p/--platform is required, valid platforms: ${buildCommandPlatforms.map(p => _log().default.chalk.bold(p)).join(', ')}`);
  }

  if (process.env.EAS_OUTPUT_JOB_JSON === '1' && requestedPlatform === _types().BuildCommandPlatform.ALL) {
    throw new Error(`You can build for only one platform at a time when EAS_OUTPUT_JOB_JSON=true is set`);
  }

  const trackingCtx = {
    tracking_id: (0, _uuid().v4)(),
    requested_platform: options.platform
  };

  _analytics().default.logEvent(_types().AnalyticsEvent.BUILD_COMMAND, trackingCtx);

  await (0, _git().ensureGitRepoExistsAsync)();
  await (0, _git().ensureGitStatusIsCleanAsync)();
  const commandCtx = await (0, _createCommandContextAsync().default)({
    requestedPlatform,
    profile,
    projectDir,
    trackingCtx,
    nonInteractive: (_options$parent = options.parent) === null || _options$parent === void 0 ? void 0 : _options$parent.nonInteractive,
    skipCredentialsCheck: options === null || options === void 0 ? void 0 : options.skipCredentialsCheck,
    skipProjectConfiguration: options === null || options === void 0 ? void 0 : options.skipProjectConfiguration
  });
  const projectId = await (0, _projects().ensureProjectExistsAsync)(commandCtx.user, {
    accountName: commandCtx.accountName,
    projectName: commandCtx.projectName
  });
  const scheduledBuilds = await startBuildsAsync(commandCtx, projectId);

  _log().default.newLine();

  await (0, _misc().printLogsUrls)(commandCtx.accountName, scheduledBuilds);

  _log().default.newLine();

  if (options.wait) {
    const builds = await waitForBuildEndAsync(commandCtx, projectId, scheduledBuilds.map(i => i.buildId));
    (0, _misc().printBuildResults)(builds);
  }
}

async function startBuildsAsync(commandCtx, projectId) {
  const client = _xdl().ApiV2.clientForUser(commandCtx.user);

  const scheduledBuilds = [];
  const easConfig = await new (_easJson().EasJsonReader)(commandCtx.projectDir, commandCtx.requestedPlatform).readAsync(commandCtx.profile);

  if ([_types().BuildCommandPlatform.ANDROID, _types().BuildCommandPlatform.ALL].includes(commandCtx.requestedPlatform)) {
    const builderContext = (0, _createBuilderContext().default)({
      commandCtx,
      platform: _easBuildJob().Platform.Android,
      easConfig
    });
    const builder = new (_AndroidBuilder().default)(builderContext);
    const buildId = await startBuildAsync(client, {
      builder,
      projectId
    });
    scheduledBuilds.push({
      platform: _types().BuildCommandPlatform.ANDROID,
      buildId
    });
  }

  if ([_types().BuildCommandPlatform.IOS, _types().BuildCommandPlatform.ALL].includes(commandCtx.requestedPlatform)) {
    const builderContext = (0, _createBuilderContext().default)({
      commandCtx,
      platform: _easBuildJob().Platform.iOS,
      easConfig
    });
    const builder = new (_iOSBuilder().default)(builderContext);
    const buildId = await startBuildAsync(client, {
      builder,
      projectId
    });
    scheduledBuilds.push({
      platform: _types().BuildCommandPlatform.IOS,
      buildId
    });
  }

  return scheduledBuilds;
}

async function startBuildAsync(client, {
  projectId,
  builder
}) {
  const tarPath = _path().default.join(_os().default.tmpdir(), `${(0, _uuid().v4)()}.tar.gz`);

  try {
    await builder.setupAsync();
    let credentialsSource;

    try {
      credentialsSource = await builder.ensureCredentialsAsync();

      _analytics().default.logEvent(_types().AnalyticsEvent.GATHER_CREDENTIALS_SUCCESS, builder.ctx.trackingCtx.properties);
    } catch (error) {
      _analytics().default.logEvent(_types().AnalyticsEvent.GATHER_CREDENTIALS_FAIL, { ...builder.ctx.trackingCtx,
        reason: error.message
      });

      throw error;
    }

    if (!builder.ctx.commandCtx.skipProjectConfiguration) {
      try {
        await builder.ensureProjectConfiguredAsync();

        _analytics().default.logEvent(_types().AnalyticsEvent.CONFIGURE_PROJECT_SUCCESS, builder.ctx.trackingCtx.properties);
      } catch (error) {
        _analytics().default.logEvent(_types().AnalyticsEvent.CONFIGURE_PROJECT_FAIL, { ...builder.ctx.trackingCtx,
          reason: error.message
        });

        throw error;
      }
    }

    let archiveUrl;

    try {
      const fileSize = await (0, _git().makeProjectTarballAsync)(tarPath);
      (0, _log().default)('Uploading project to AWS S3');
      archiveUrl = await (0, _uploads().uploadAsync)(_uploads().UploadType.TURTLE_PROJECT_SOURCES, tarPath, (0, _progress().createProgressTracker)(fileSize));

      _analytics().default.logEvent(_types().AnalyticsEvent.PROJECT_UPLOAD_SUCCESS, builder.ctx.trackingCtx.properties);
    } catch (error) {
      _analytics().default.logEvent(_types().AnalyticsEvent.PROJECT_UPLOAD_FAIL, { ...builder.ctx.trackingCtx,
        reason: error.message
      });

      throw error;
    }

    const metadata = await (0, _metadata().collectMetadata)(builder.ctx, {
      credentialsSource
    });
    const job = await builder.prepareJobAsync(archiveUrl);
    (0, _log().default)(`Starting ${_constants().platformDisplayNames[job.platform]} build`);

    if (process.env.EAS_OUTPUT_JOB_JSON === '1') {
      process.stdout.write(`JSON for the job:\n${JSON.stringify(job)}\n`);
      process.exit(0);
    }

    try {
      const {
        buildId,
        deprecationInfo
      } = await client.postAsync(`projects/${projectId}/builds`, {
        job,
        metadata
      });
      (0, _misc().printDeprecationWarnings)(deprecationInfo);

      _analytics().default.logEvent(_types().AnalyticsEvent.BUILD_REQUEST_SUCCESS, builder.ctx.trackingCtx.properties);

      return buildId;
    } catch (error) {
      _analytics().default.logEvent(_types().AnalyticsEvent.BUILD_REQUEST_FAIL, { ...builder.ctx.trackingCtx,
        reason: error.message
      });

      if (error.code === 'TURTLE_DEPRECATED_JOB_FORMAT') {
        _log().default.error('EAS Build API changed, upgrade to latest expo-cli');
      }

      throw error;
    }
  } finally {
    await _fsExtra().default.remove(tarPath);
  }
}

async function waitForBuildEndAsync(commandCtx, projectId, buildIds, {
  timeoutSec = 1800,
  intervalSec = 30
} = {}) {
  var _builds$;

  const client = _xdl().ApiV2.clientForUser(commandCtx.user);

  (0, _log().default)('Waiting for build to complete. You can press Ctrl+C to exit.');
  const spinner = (0, _ora().default)().start();
  let time = new Date().getTime();
  const endTime = time + timeoutSec * 1000;

  while (time <= endTime) {
    const builds = await Promise.all(buildIds.map(buildId => {
      try {
        return client.getAsync(`projects/${projectId}/builds/${buildId}`);
      } catch (err) {
        return null;
      }
    }));

    if (builds.length === 1) {
      switch ((_builds$ = builds[0]) === null || _builds$ === void 0 ? void 0 : _builds$.status) {
        case _types().BuildStatus.FINISHED:
          spinner.succeed('Build finished.');
          return builds;

        case _types().BuildStatus.IN_QUEUE:
          spinner.text = 'Build queued...';
          break;

        case _types().BuildStatus.IN_PROGRESS:
          spinner.text = 'Build in progress...';
          break;

        case _types().BuildStatus.ERRORED:
          spinner.fail('Build failed.');
          throw new Error(`Standalone build failed!`);

        default:
          spinner.warn('Unknown status.');
          throw new Error(`Unknown status: ${builds} - aborting!`);
      }
    } else {
      if (builds.filter(build => (build === null || build === void 0 ? void 0 : build.status) === _types().BuildStatus.FINISHED).length === builds.length) {
        spinner.succeed('All build have finished.');
        return builds;
      } else if (builds.filter(build => (build === null || build === void 0 ? void 0 : build.status) ? [_types().BuildStatus.FINISHED, _types().BuildStatus.ERRORED].includes(build.status) : false).length === builds.length) {
        spinner.fail('Some of the builds failed.');
        return builds;
      } else {
        const inQueue = builds.filter(build => (build === null || build === void 0 ? void 0 : build.status) === _types().BuildStatus.IN_QUEUE).length;
        const inProgress = builds.filter(build => (build === null || build === void 0 ? void 0 : build.status) === _types().BuildStatus.IN_PROGRESS).length;
        const errored = builds.filter(build => (build === null || build === void 0 ? void 0 : build.status) === _types().BuildStatus.ERRORED).length;
        const finished = builds.filter(build => (build === null || build === void 0 ? void 0 : build.status) === _types().BuildStatus.FINISHED).length;
        const unknownState = builds.length - inQueue - inProgress - errored - finished;
        spinner.text = [inQueue && `Builds in queue: ${inQueue}`, inProgress && `Builds in progress: ${inProgress}`, errored && _chalk().default.red(`Builds failed: ${errored}`), finished && _chalk().default.green(`Builds finished: ${finished}`), unknownState && _chalk().default.red(`Builds in unknown state: ${unknownState}`)].filter(i => i).join('\t');
      }
    }

    time = new Date().getTime();
    await (0, _delayAsync().default)(intervalSec * 1000);
  }

  spinner.warn('Timed out.');
  throw new Error('Timeout reached! It is taking longer than expected to finish the build, aborting...');
}

var _default = buildAction;
exports.default = _default;
//# sourceMappingURL=action.js.map