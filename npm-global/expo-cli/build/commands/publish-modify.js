"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _uniqBy() {
  const data = _interopRequireDefault(require("lodash/uniqBy"));

  _uniqBy = function () {
    return data;
  };

  return data;
}

function table() {
  const data = _interopRequireWildcard(require("../commands/utils/cli-table"));

  table = function () {
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

function _PublishUtils() {
  const data = require("./utils/PublishUtils");

  _PublishUtils = function () {
    return data;
  };

  return data;
}

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(program) {
  program.command('publish:set [path]').alias('ps').description('Specify the channel to serve a published release').helpGroup('publish').option('-c, --release-channel <channel-name>', 'The channel to set the published release. (Required)').option('-p, --publish-id <publish-id>', 'The id of the published release to serve from the channel. (Required)').asyncActionProjectDir(async (projectDir, options) => {
    if (!options.releaseChannel) {
      throw new Error('You must specify a release channel.');
    }

    if (!options.publishId) {
      throw new Error('You must specify a publish id. You can find ids using publish:history.');
    }

    try {
      const result = await (0, _PublishUtils().setPublishToChannelAsync)(projectDir, options);
      const tableString = table().printTableJson(result.queryResult, 'Channel Set Status ', 'SUCCESS');
      (0, _log().default)(tableString);
    } catch (e) {
      _log().default.error(e);
    }
  }, {
    checkConfig: true
  });
  program.command('publish:rollback [path]').alias('pr').description('Undo an update to a channel').helpGroup('publish').option('--channel-id <channel-id>', 'This flag is deprecated.').option('-c, --release-channel <channel-name>', 'The channel to rollback from. (Required)').option('-s, --sdk-version <version>', 'The sdk version to rollback. (Required)').option('-p, --platform <ios|android>', 'The platform to rollback.').asyncActionProjectDir(async (projectDir, options) => {
    if (options.channelId) {
      throw new Error('This flag is deprecated and does not do anything. Please use --release-channel and --sdk-version instead.');
    }

    if (!options.releaseChannel || !options.sdkVersion) {
      const usage = await getUsageAsync(projectDir);
      throw new Error(usage);
    }

    if (options.platform) {
      if (options.platform !== 'android' && options.platform !== 'ios') {
        throw new Error('Platform must be either android or ios. Leave out the platform flag to target both platforms.');
      }
    }

    await (0, _PublishUtils().rollbackPublicationFromChannelAsync)(projectDir, options);
  }, {
    checkConfig: true
  });
}

async function getUsageAsync(projectDir) {
  try {
    return await _getUsageAsync(projectDir);
  } catch (e) {
    _log().default.warn(e); // couldn't print out warning for some reason


    return _getGenericUsage();
  }
}

async function _getUsageAsync(projectDir) {
  const allPlatforms = ['ios', 'android'];
  const publishesResult = await (0, _PublishUtils().getPublishHistoryAsync)(projectDir, {
    releaseChannel: 'default',
    // not specifying a channel will return most recent publishes but this is not neccesarily the most recent entry in a channel (user could have set an older publish to top of the channel)
    count: allPlatforms.length
  });
  const publishes = publishesResult.queryResult; // If the user published normally, there would be a publish for each platform with the same revisionId

  const uniquePlatforms = (0, _uniqBy().default)(publishes, publish => publish.platform);

  if (uniquePlatforms.length !== allPlatforms.length) {
    // User probably applied some custom `publish:set` or `publish:rollback` command
    return _getGenericUsage();
  }

  const details = await Promise.all(publishes.map(async publication => {
    const detailOptions = {
      publishId: publication.publicationId
    };
    return await (0, _PublishUtils().getPublicationDetailAsync)(projectDir, detailOptions);
  }));
  const uniqueRevisionIds = (0, _uniqBy().default)(details, detail => detail.revisionId);

  if (uniqueRevisionIds.length !== 1) {
    // User probably applied some custom `publish:set` or `publish:rollback` command
    return _getGenericUsage();
  }

  const {
    channel
  } = publishes[0];
  const {
    revisionId,
    publishedTime,
    sdkVersion
  } = details[0];

  const timeDifferenceString = _getTimeDifferenceString(new Date(), new Date(publishedTime));

  return `--release-channel and --sdk-version arguments are required. \n` + `For example, to roll back the revision [${revisionId}] on release channel [${channel}] (published ${timeDifferenceString}), \n` + `run: expo publish:rollback --release-channel ${channel} --sdk-version ${sdkVersion}`;
}

function _getTimeDifferenceString(t0, t1) {
  const minutesInMs = 60 * 1000;
  const hourInMs = 60 * minutesInMs;
  const dayInMs = 24 * hourInMs; // hours*minutes*seconds*milliseconds

  const diffMs = Math.abs(t1.getTime() - t0.getTime());
  const diffDays = Math.round(diffMs / dayInMs);

  if (diffDays > 0) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  }

  const diffHours = Math.round(diffMs / hourInMs);

  if (diffHours > 0) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  }

  const diffMinutes = Math.round(diffMs / minutesInMs);

  if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  }

  return 'recently';
}

function _getGenericUsage() {
  return `--release-channel and --sdk-version arguments are required. \n` + `For example, to roll back the latest publishes on the default channel for sdk 37.0.0, \n` + `run: expo publish:rollback --release-channel defaul --sdk-version 37.0.0 \n` + `To rollback a specific platform, use the --platform flag.`;
}
//# sourceMappingURL=publish-modify.js.map