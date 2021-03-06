"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceAccountAsync = getServiceAccountAsync;
exports.ServiceAccountSourceType = void 0;

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

function _TerminalLink() {
  const data = require("../../../utils/TerminalLink");

  _TerminalLink = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ServiceAccountSourceType;
exports.ServiceAccountSourceType = ServiceAccountSourceType;

(function (ServiceAccountSourceType) {
  ServiceAccountSourceType[ServiceAccountSourceType["path"] = 0] = "path";
  ServiceAccountSourceType[ServiceAccountSourceType["prompt"] = 1] = "prompt";
})(ServiceAccountSourceType || (exports.ServiceAccountSourceType = ServiceAccountSourceType = {}));

async function getServiceAccountAsync(source) {
  switch (source.sourceType) {
    case ServiceAccountSourceType.path:
      return await handlePathSourceAsync(source);

    case ServiceAccountSourceType.prompt:
      return await handlePromptSourceAsync(source);
  }
}

async function handlePathSourceAsync(source) {
  if (!(await (0, _validators().existingFile)(source.path))) {
    _log().default.warn(`File ${source.path} doesn't exist.`);

    return await getServiceAccountAsync({
      sourceType: ServiceAccountSourceType.prompt
    });
  }

  return source.path;
}

async function handlePromptSourceAsync(_source) {
  const path = await askForServiceAccountPathAsync();
  return await getServiceAccountAsync({
    sourceType: ServiceAccountSourceType.path,
    path
  });
}

async function askForServiceAccountPathAsync() {
  (0, _log().default)(`${_log().default.chalk.bold('A Google Service Account JSON key is required to upload your app to Google Play Store')}.\n` + `If you're not sure what this is or how to create one, ${_log().default.chalk.dim((0, _TerminalLink().learnMore)('https://expo.fyi/creating-google-service-account'))}.`);
  const {
    filePath
  } = await (0, _prompt().default)({
    name: 'filePath',
    message: 'Path to Google Service Account file:',
    default: 'api-0000000000000000000-111111-aaaaaabbbbbb.json',
    type: 'input',
    validate: async path => {
      if (!(await (0, _validators().existingFile)(path, false))) {
        return `File ${path} doesn't exist.`;
      } else {
        return true;
      }
    }
  });
  return filePath;
}
//# sourceMappingURL=ServiceAccountSource.js.map