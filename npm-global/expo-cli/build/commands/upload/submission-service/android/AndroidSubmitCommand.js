"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _results() {
  const data = require("@expo/results");

  _results = function () {
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

function _archiveSource() {
  const data = require("../archive-source");

  _archiveSource = function () {
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

function _AndroidPackageSource() {
  const data = require("./AndroidPackageSource");

  _AndroidPackageSource = function () {
    return data;
  };

  return data;
}

function _AndroidSubmissionConfig() {
  const data = require("./AndroidSubmissionConfig");

  _AndroidSubmissionConfig = function () {
    return data;
  };

  return data;
}

function _AndroidSubmitter() {
  const data = _interopRequireDefault(require("./AndroidSubmitter"));

  _AndroidSubmitter = function () {
    return data;
  };

  return data;
}

function _ServiceAccountSource() {
  const data = require("./ServiceAccountSource");

  _ServiceAccountSource = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AndroidSubmitCommand {
  static createContext(mode, projectDir, commandOptions) {
    return {
      mode,
      projectDir,
      commandOptions
    };
  }

  constructor(ctx) {
    this.ctx = ctx;
  }

  async runAsync() {
    if (this.ctx.mode === _types().SubmissionMode.online && !(await _xdl().UserManager.getCurrentUserAsync())) {
      await _xdl().UserManager.ensureLoggedInAsync();

      _log().default.addNewLineIfNone();
    }

    const submissionOptions = this.getAndroidSubmissionOptions();
    const submitter = new (_AndroidSubmitter().default)(this.ctx, submissionOptions);
    await submitter.submitAsync();
  }

  getAndroidSubmissionOptions() {
    const androidPackageSource = this.resolveAndroidPackageSource();
    const track = this.resolveTrack();
    const releaseStatus = this.resolveReleaseStatus();
    const archiveSource = this.resolveArchiveSource();
    const serviceAccountSource = this.resolveServiceAccountSource();
    const errored = [androidPackageSource, track, releaseStatus, archiveSource, serviceAccountSource].filter(r => !r.ok);

    if (errored.length > 0) {
      const message = errored.map(err => {
        var _err$reason;

        return (_err$reason = err.reason) === null || _err$reason === void 0 ? void 0 : _err$reason.message;
      }).join('\n');

      _log().default.error(message);

      throw new Error('Failed to submit the app');
    }

    return {
      androidPackageSource: androidPackageSource.enforceValue(),
      track: track.enforceValue(),
      releaseStatus: releaseStatus.enforceValue(),
      archiveSource: archiveSource.enforceValue(),
      serviceAccountSource: serviceAccountSource.enforceValue()
    };
  }

  resolveAndroidPackageSource() {
    var _exp$android;

    let androidPackage;

    if (this.ctx.commandOptions.androidPackage) {
      androidPackage = this.ctx.commandOptions.androidPackage;
    }

    const exp = (0, _config().getExpoConfig)(this.ctx.projectDir);

    if ((_exp$android = exp.android) === null || _exp$android === void 0 ? void 0 : _exp$android.package) {
      androidPackage = exp.android.package;
    }

    if (androidPackage) {
      return (0, _results().result)({
        sourceType: _AndroidPackageSource().AndroidPackageSourceType.userDefined,
        androidPackage
      });
    } else {
      return (0, _results().result)({
        sourceType: _AndroidPackageSource().AndroidPackageSourceType.prompt
      });
    }
  }

  resolveTrack() {
    const {
      track
    } = this.ctx.commandOptions;

    if (!track) {
      return (0, _results().result)(_AndroidSubmissionConfig().ReleaseTrack.production);
    }

    if (track in _AndroidSubmissionConfig().ReleaseTrack) {
      return (0, _results().result)(_AndroidSubmissionConfig().ReleaseTrack[track]);
    } else {
      return (0, _results().result)(new Error(`Unsupported track: ${track} (valid options: ${Object.keys(_AndroidSubmissionConfig().ReleaseTrack).join(', ')})`));
    }
  }

  resolveReleaseStatus() {
    const {
      releaseStatus
    } = this.ctx.commandOptions;

    if (!releaseStatus) {
      return (0, _results().result)(_AndroidSubmissionConfig().ReleaseStatus.completed);
    }

    if (releaseStatus in _AndroidSubmissionConfig().ReleaseStatus) {
      return (0, _results().result)(_AndroidSubmissionConfig().ReleaseStatus[releaseStatus]);
    } else {
      return (0, _results().result)(new Error(`Unsupported release status: ${releaseStatus} (valid options: ${Object.keys(_AndroidSubmissionConfig().ReleaseStatus).join(', ')})`));
    }
  }

  resolveArchiveSource() {
    return (0, _results().result)({
      archiveFile: this.resolveArchiveFileSource(),
      archiveType: this.resolveArchiveTypeSource()
    });
  }

  resolveArchiveFileSource() {
    const {
      url,
      path,
      id,
      latest
    } = this.ctx.commandOptions;
    const chosenOptions = [url, path, id, latest];

    if (chosenOptions.filter(opt => opt).length > 1) {
      throw new Error(`Pass only one of: --url, --path, --id, --latest`);
    }

    if (url) {
      return {
        sourceType: _archiveSource().ArchiveFileSourceType.url,
        url,
        platform: 'android',
        projectDir: this.ctx.projectDir
      };
    } else if (path) {
      return {
        sourceType: _archiveSource().ArchiveFileSourceType.path,
        path,
        platform: 'android',
        projectDir: this.ctx.projectDir
      };
    } else if (id) {
      if (!_validator().default.isUUID(id)) {
        throw new Error(`${id} is not a id`);
      }

      return {
        sourceType: _archiveSource().ArchiveFileSourceType.buildId,
        id,
        platform: 'android',
        projectDir: this.ctx.projectDir
      };
    } else if (latest) {
      return {
        sourceType: _archiveSource().ArchiveFileSourceType.latest,
        platform: 'android',
        projectDir: this.ctx.projectDir
      };
    } else {
      return {
        sourceType: _archiveSource().ArchiveFileSourceType.prompt,
        platform: 'android',
        projectDir: this.ctx.projectDir
      };
    }
  }

  resolveArchiveTypeSource() {
    const {
      type: rawArchiveType
    } = this.ctx.commandOptions;

    if (rawArchiveType) {
      if (!(rawArchiveType in _AndroidSubmissionConfig().ArchiveType)) {
        throw new Error(`Unsupported archive type: ${rawArchiveType} (valid options: ${Object.keys(_AndroidSubmissionConfig().ArchiveType).join(', ')})`);
      }

      const archiveType = rawArchiveType;
      return {
        sourceType: _archiveSource().ArchiveTypeSourceType.parameter,
        archiveType
      };
    } else {
      return {
        sourceType: _archiveSource().ArchiveTypeSourceType.infer
      };
    }
  }

  resolveServiceAccountSource() {
    const {
      key
    } = this.ctx.commandOptions;

    if (key) {
      return (0, _results().result)({
        sourceType: _ServiceAccountSource().ServiceAccountSourceType.path,
        path: key
      });
    } else {
      return (0, _results().result)({
        sourceType: _ServiceAccountSource().ServiceAccountSourceType.prompt
      });
    }
  }

}

var _default = AndroidSubmitCommand;
exports.default = _default;
//# sourceMappingURL=AndroidSubmitCommand.js.map