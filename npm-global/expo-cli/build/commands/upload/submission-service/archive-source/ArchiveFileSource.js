"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getArchiveFileLocationAsync = getArchiveFileLocationAsync;
exports.ArchiveFileSourceType = void 0;

function _xdl() {
  const data = require("@expo/xdl");

  _xdl = function () {
    return data;
  };

  return data;
}

function _validator() {
  const data = _interopRequireDefault(require("validator"));

  _validator = function () {
    return data;
  };

  return data;
}

function _log() {
  const data = _interopRequireDefault(require("../../../../log"));

  _log = function () {
    return data;
  };

  return data;
}

function _prompt() {
  const data = _interopRequireDefault(require("../../../../prompt"));

  _prompt = function () {
    return data;
  };

  return data;
}

function _validators() {
  const data = require("../../../../validators");

  _validators = function () {
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

function _config() {
  const data = require("../utils/config");

  _config = function () {
    return data;
  };

  return data;
}

function _files() {
  const data = require("../utils/files");

  _files = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ArchiveFileSourceType;
exports.ArchiveFileSourceType = ArchiveFileSourceType;

(function (ArchiveFileSourceType) {
  ArchiveFileSourceType[ArchiveFileSourceType["url"] = 0] = "url";
  ArchiveFileSourceType[ArchiveFileSourceType["latest"] = 1] = "latest";
  ArchiveFileSourceType[ArchiveFileSourceType["path"] = 2] = "path";
  ArchiveFileSourceType[ArchiveFileSourceType["buildId"] = 3] = "buildId";
  ArchiveFileSourceType[ArchiveFileSourceType["prompt"] = 4] = "prompt";
})(ArchiveFileSourceType || (exports.ArchiveFileSourceType = ArchiveFileSourceType = {}));

async function getArchiveFileLocationAsync(mode, source) {
  switch (source.sourceType) {
    case ArchiveFileSourceType.prompt:
      return await handlePromptSourceAsync(mode, source);

    case ArchiveFileSourceType.url:
      {
        const url = await handleUrlSourceAsync(mode, source);
        return await getArchiveLocationForUrlAsync(mode, url);
      }

    case ArchiveFileSourceType.latest:
      {
        const url = await handleLatestSourceAsync(mode, source);
        return await getArchiveLocationForUrlAsync(mode, url);
      }

    case ArchiveFileSourceType.path:
      {
        const path = await handlePathSourceAsync(mode, source);
        return getArchiveLocationForPathAsync(mode, path);
      }

    case ArchiveFileSourceType.buildId:
      {
        const url = await handleBuildIdSourceAsync(mode, source);
        return await getArchiveLocationForUrlAsync(mode, url);
      }
  }
}

async function getArchiveLocationForUrlAsync(mode, url) {
  // When a URL points to a tar file, download it and extract using unified logic.
  // Otherwise send it directly to the server in online mode.
  if (mode === _types().SubmissionMode.online && !(0, _files().pathIsTar)(url)) {
    return url;
  } else {
    (0, _log().default)('Downloading your app archive');
    return (0, _files().downloadAppArchiveAsync)(url);
  }
}

async function getArchiveLocationForPathAsync(mode, path) {
  const resolvedPath = await (0, _files().extractLocalArchiveAsync)(path);

  if (mode === _types().SubmissionMode.online) {
    (0, _log().default)('Uploading your app archive to the Expo Submission Service');
    return await (0, _files().uploadAppArchiveAsync)(resolvedPath);
  } else {
    return resolvedPath;
  }
}

async function handleUrlSourceAsync(mode, source) {
  return source.url;
}

async function handleLatestSourceAsync(mode, source) {
  const {
    owner,
    slug
  } = (0, _config().getAppConfig)(source.projectDir);
  const builds = await _xdl().StandaloneBuild.getStandaloneBuilds({
    platform: source.platform,
    owner,
    slug
  }, 1);

  if (builds.length === 0) {
    _log().default.error(_log().default.chalk.bold("Couldn't find any builds for this project on Expo servers. It looks like you haven't run expo build:android yet."));

    return getArchiveFileLocationAsync(mode, {
      sourceType: ArchiveFileSourceType.prompt,
      platform: source.platform,
      projectDir: source.projectDir
    });
  }

  return builds[0].artifacts.url;
}

async function handlePathSourceAsync(mode, source) {
  if (!(await (0, _validators().existingFile)(source.path))) {
    _log().default.error(_log().default.chalk.bold(`${source.path} doesn't exist`));

    return getArchiveFileLocationAsync(mode, {
      sourceType: ArchiveFileSourceType.prompt,
      platform: source.platform,
      projectDir: source.projectDir
    });
  }

  return source.path;
}

async function handleBuildIdSourceAsync(mode, source) {
  const {
    owner,
    slug
  } = (0, _config().getAppConfig)(source.projectDir);
  let build;

  try {
    build = await _xdl().StandaloneBuild.getStandaloneBuildById({
      platform: source.platform,
      id: source.id,
      owner,
      slug
    });
  } catch (err) {
    _log().default.error(err);

    throw err;
  }

  if (!build) {
    _log().default.error(_log().default.chalk.bold(`Couldn't find build for id ${source.id}`));

    return getArchiveFileLocationAsync(mode, {
      sourceType: ArchiveFileSourceType.prompt,
      platform: source.platform,
      projectDir: source.projectDir
    });
  } else {
    return build.artifacts.url;
  }
}

async function handlePromptSourceAsync(mode, source) {
  const {
    sourceType: sourceTypeRaw
  } = await (0, _prompt().default)({
    name: 'sourceType',
    type: 'list',
    message: 'What would you like to submit?',
    choices: [{
      name: 'I have a url to the app archive',
      value: ArchiveFileSourceType.url
    }, {
      name: "I'd like to upload the app archive from my computer",
      value: ArchiveFileSourceType.path
    }, {
      name: 'The latest build from Expo servers',
      value: ArchiveFileSourceType.latest
    }, {
      name: 'A build identified by a build id',
      value: ArchiveFileSourceType.buildId
    }]
  });
  const sourceType = sourceTypeRaw;

  switch (sourceType) {
    case ArchiveFileSourceType.url:
      {
        const url = await askForArchiveUrlAsync();
        return getArchiveFileLocationAsync(mode, {
          sourceType: ArchiveFileSourceType.url,
          url,
          platform: source.platform,
          projectDir: source.projectDir
        });
      }

    case ArchiveFileSourceType.path:
      {
        const path = await askForArchivePathAsync();
        return getArchiveFileLocationAsync(mode, {
          sourceType: ArchiveFileSourceType.path,
          path,
          platform: source.platform,
          projectDir: source.projectDir
        });
      }

    case ArchiveFileSourceType.latest:
      {
        return getArchiveFileLocationAsync(mode, {
          sourceType: ArchiveFileSourceType.latest,
          platform: source.platform,
          projectDir: source.projectDir
        });
      }

    case ArchiveFileSourceType.buildId:
      {
        const id = await askForBuildIdAsync();
        return getArchiveFileLocationAsync(mode, {
          sourceType: ArchiveFileSourceType.buildId,
          id,
          platform: source.platform,
          projectDir: source.projectDir
        });
      }

    case ArchiveFileSourceType.prompt:
      throw new Error('This should never happen');
  }
}

async function askForArchiveUrlAsync() {
  const defaultArchiveUrl = 'https://url.to/your/archive.aab';
  const {
    url
  } = await (0, _prompt().default)({
    name: 'url',
    message: 'URL:',
    default: defaultArchiveUrl,
    type: 'input',
    validate: url => {
      if (url === defaultArchiveUrl) {
        return 'That was just an example URL, meant to show you the format that we expect for the response.';
      } else if (!validateUrl(url)) {
        return `${url} does not conform to HTTP format`;
      } else {
        return true;
      }
    }
  });
  return url;
}

async function askForArchivePathAsync() {
  const defaultArchivePath = '/path/to/your/archive.aab';
  const {
    path
  } = await (0, _prompt().default)({
    name: 'path',
    message: 'Path to the app archive file (aab or apk):',
    default: defaultArchivePath,
    type: 'input',
    validate: async path => {
      if (path === defaultArchivePath) {
        return 'That was just an example path, meant to show you the format that we expect for the response.';
      } else if (!(await (0, _validators().existingFile)(path, false))) {
        return `File ${path} doesn't exist.`;
      } else {
        return true;
      }
    }
  });
  return path;
}

async function askForBuildIdAsync() {
  const {
    id
  } = await (0, _prompt().default)({
    name: 'id',
    message: 'Build ID:',
    type: 'input',
    validate: val => {
      if (!_validator().default.isUUID(val)) {
        return `${val} is not a valid id`;
      } else {
        return true;
      }
    }
  });
  return id;
}

function validateUrl(url) {
  return _validator().default.isURL(url, {
    protocols: ['http', 'https']
  });
}
//# sourceMappingURL=ArchiveFileSource.js.map