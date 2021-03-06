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

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function () {
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

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
    return data;
  };

  return data;
}

function _log() {
  const data = _interopRequireDefault(require("../../log"));

  _log = function () {
    return data;
  };

  return data;
}

function _files() {
  const data = require("./submission-service/utils/files");

  _files = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BaseUploader {
  constructor(platform, projectDir, options) {
    this.platform = platform;
    this.projectDir = projectDir;
    this.options = options;

    _defineProperty(this, "_exp", void 0);

    _defineProperty(this, "fastlane", void 0);

    // it has to happen in constructor because we don't want to load this module on a different platform than darwin
    this.fastlane = require('@expo/traveling-fastlane-darwin')();
  }

  async upload() {
    await this._getProjectConfig();
    const platformData = await this._getPlatformSpecificOptions();
    const buildPath = await this._getBinaryFilePath();
    await this._uploadToTheStore(platformData, buildPath);
    await this._removeBuildFileIfDownloaded(buildPath);
    (0, _log().default)(`Please also see our docs (${_chalk().default.underline('https://docs.expo.io/distribution/uploading-apps/')}) to learn more about the upload process.`);
  }

  async _getProjectConfig() {
    const {
      exp
    } = (0, _config().getConfig)(this.projectDir, {
      skipSDKVersionRequirement: true
    });

    this._ensureExperienceIsValid(exp);

    this._exp = exp;
  }

  async _getBinaryFilePath() {
    const {
      path,
      id,
      url
    } = this.options;

    if (path) {
      return this._downloadBuild(path);
    } else if (id) {
      return this._downloadBuildById(id);
    } else if (url) {
      return this._downloadBuild(url);
    } else {
      return this._downloadLastestBuild();
    }
  }

  async _downloadBuildById(id) {
    const {
      platform
    } = this;

    const slug = this._getSlug();

    const owner = this._getOwner();

    const build = await _xdl().StandaloneBuild.getStandaloneBuildById({
      id,
      slug,
      platform,
      owner
    });

    if (!build) {
      throw new Error(`We couldn't find build with id ${id}`);
    }

    return this._downloadBuild(build.artifacts.url);
  }

  _getSlug() {
    if (!this._exp || !this._exp.slug) {
      throw new Error(`slug doesn't exist`);
    }

    return this._exp.slug;
  }

  _getOwner() {
    if (!this._exp || !this._exp.owner) {
      return undefined;
    }

    return this._exp.owner;
  }

  async _downloadLastestBuild() {
    const {
      platform
    } = this;

    const slug = this._getSlug();

    const owner = this._getOwner();

    const builds = await _xdl().StandaloneBuild.getStandaloneBuilds({
      slug,
      owner,
      platform
    }, 1);

    if (builds.length === 0) {
      throw new Error(`There are no builds on the Expo servers, please run 'expo build:${platform}' first`);
    }

    return this._downloadBuild(builds[0].artifacts.url);
  }

  async _downloadBuild(urlOrPath) {
    if (_path().default.isAbsolute(urlOrPath)) {
      // Local file paths that don't need to be extracted will simply return the `urlOrPath` as the final destination.
      return await (0, _files().extractLocalArchiveAsync)(urlOrPath);
    } else {
      // Remote files
      (0, _log().default)(`Downloading build from ${urlOrPath}`);
      return await (0, _files().downloadAppArchiveAsync)(urlOrPath);
    }
  }

  async _removeBuildFileIfDownloaded(buildPath) {
    if (!this.options.path) {
      await _fsExtra().default.remove(buildPath);
    }
  }

  _ensureExperienceIsValid(exp) {
    throw new Error('Not implemented');
  }

  async _getPlatformSpecificOptions() {
    throw new Error('Not implemented');
  }

  async _uploadToTheStore(platformData, buildPath) {
    throw new Error('Not implemented');
  }

}

exports.default = BaseUploader;
//# sourceMappingURL=BaseUploader.js.map