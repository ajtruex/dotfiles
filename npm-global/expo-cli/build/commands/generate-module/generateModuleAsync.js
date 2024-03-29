"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generateModuleAsync;

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

function _CommandError() {
  const data = _interopRequireDefault(require("../../CommandError"));

  _CommandError = function () {
    return data;
  };

  return data;
}

function _configureModule() {
  const data = _interopRequireDefault(require("./configureModule"));

  _configureModule = function () {
    return data;
  };

  return data;
}

function _fetchTemplate() {
  const data = _interopRequireDefault(require("./fetchTemplate"));

  _fetchTemplate = function () {
    return data;
  };

  return data;
}

function _promptQuestionsAsync() {
  const data = _interopRequireDefault(require("./promptQuestionsAsync"));

  _promptQuestionsAsync = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function generateModuleAsync(newModuleProjectDir, options) {
  const newModulePathFromArgv = newModuleProjectDir && _path().default.resolve(newModuleProjectDir);

  const newModuleName = newModulePathFromArgv && _path().default.basename(newModulePathFromArgv);

  const newModuleParentPath = newModulePathFromArgv ? _path().default.dirname(newModulePathFromArgv) : process.cwd();
  const configuration = await (0, _promptQuestionsAsync().default)(newModuleName);

  const newModulePath = _path().default.resolve(newModuleParentPath, configuration.npmModuleName);

  if (_fsExtra().default.existsSync(newModulePath)) {
    throw new (_CommandError().default)('MODULE_ALREADY_EXISTS', `Module '${newModulePath}' already exists!`);
  }

  await (0, _fetchTemplate().default)(newModulePath, options.template);
  await (0, _configureModule().default)(newModulePath, configuration);
}
//# sourceMappingURL=generateModuleAsync.js.map