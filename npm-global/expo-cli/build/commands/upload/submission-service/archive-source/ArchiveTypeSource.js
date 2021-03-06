"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getArchiveTypeAsync = getArchiveTypeAsync;
exports.ArchiveTypeSourceType = void 0;

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

function _AndroidSubmissionConfig() {
  const data = require("../android/AndroidSubmissionConfig");

  _AndroidSubmissionConfig = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ArchiveTypeSourceType;
exports.ArchiveTypeSourceType = ArchiveTypeSourceType;

(function (ArchiveTypeSourceType) {
  ArchiveTypeSourceType[ArchiveTypeSourceType["infer"] = 0] = "infer";
  ArchiveTypeSourceType[ArchiveTypeSourceType["parameter"] = 1] = "parameter";
  ArchiveTypeSourceType[ArchiveTypeSourceType["prompt"] = 2] = "prompt";
})(ArchiveTypeSourceType || (exports.ArchiveTypeSourceType = ArchiveTypeSourceType = {}));

async function getArchiveTypeAsync(source, location) {
  switch (source.sourceType) {
    case ArchiveTypeSourceType.infer:
      return handleInferSourceAsync(source, location);

    case ArchiveTypeSourceType.parameter:
      return handleParameterSourceAsync(source, location);

    case ArchiveTypeSourceType.prompt:
      return handlePromptSourceAsync(source, location);
  }
}

async function handleInferSourceAsync(_source, location) {
  const inferredArchiveType = inferArchiveTypeFromLocation(location);

  if (inferredArchiveType) {
    return inferredArchiveType;
  } else {
    _log().default.warn("We couldn't autodetect the archive type");

    return getArchiveTypeAsync({
      sourceType: ArchiveTypeSourceType.prompt
    }, location);
  }
}

async function handleParameterSourceAsync(source, location) {
  const inferredArchiveType = inferArchiveTypeFromLocation(location);

  if (inferredArchiveType) {
    if (source.archiveType === inferredArchiveType) {
      return source.archiveType;
    } else {
      _log().default.warn(`The archive seems to be .${inferredArchiveType} and you passed: --type ${source.archiveType}`);

      return getArchiveTypeAsync({
        sourceType: ArchiveTypeSourceType.prompt
      }, location);
    }
  } else {
    return source.archiveType;
  }
}

async function handlePromptSourceAsync(_source, location) {
  const inferredArchiveType = inferArchiveTypeFromLocation(location);
  const {
    archiveType: archiveTypeRaw
  } = await (0, _prompt().default)({
    name: 'archiveType',
    type: 'list',
    message: "What's the archive type?",
    choices: [{
      name: 'APK',
      value: _AndroidSubmissionConfig().ArchiveType.apk
    }, {
      name: 'AAB',
      value: _AndroidSubmissionConfig().ArchiveType.aab
    }],
    ...(inferredArchiveType && {
      default: inferredArchiveType
    })
  });
  return archiveTypeRaw;
}

function inferArchiveTypeFromLocation(location) {
  if (location.endsWith('.apk')) {
    return _AndroidSubmissionConfig().ArchiveType.apk;
  } else if (location.endsWith('.aab')) {
    return _AndroidSubmissionConfig().ArchiveType.aab;
  } else {
    return null;
  }
}
//# sourceMappingURL=ArchiveTypeSource.js.map