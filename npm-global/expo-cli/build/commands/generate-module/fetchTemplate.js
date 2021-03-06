"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fetchTemplate;

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

function _pacote() {
  const data = _interopRequireDefault(require("pacote"));

  _pacote = function () {
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DEFAULT_TEMPLATE = 'expo-module-template@latest';
/**
 * Fetches directory from npm or given templateDirectory into destinationPath
 * @param destinationPath - destination for fetched template
 * @param template - optional template provided as npm package or local directory
 */

async function fetchTemplate(destinationPath, template) {
  if (template && _fsExtra().default.existsSync(_path().default.resolve(template))) {
    // local template
    _xdl().Logger.global.info(`Using local template: ${_chalk().default.bold(_path().default.resolve(template))}.`);

    await _fsExtra().default.copy(_path().default.resolve(template), destinationPath);
  } else if (template && isNpmPackage(template)) {
    // npm package
    _xdl().Logger.global.info(`Using NPM package as template: ${_chalk().default.bold(template)}`);

    await _pacote().default.extract(template, destinationPath);
  } else {
    // default npm packge
    _xdl().Logger.global.info(`Using default NPM package as template: ${_chalk().default.bold(DEFAULT_TEMPLATE)}`);

    await _pacote().default.extract(DEFAULT_TEMPLATE, destinationPath);
  }

  if (await _fsExtra().default.pathExists(_path().default.join(destinationPath, 'template-unimodule.json'))) {
    await _fsExtra().default.move(_path().default.join(destinationPath, 'template-unimodule.json'), _path().default.join(destinationPath, 'unimodule.json'));
  }
}

function isNpmPackage(template) {
  return !template.match(/^\./) && // don't start with .
  !template.match(/^_/) && // don't start with _
  template.toLowerCase() === template && // only lowercase
  !/[~'!()*]/.test(template.split('/').slice(-1)[0]) && // don't contain any character from [~'!()*]
  template.match(/^(@([^/]+?)\/)?([^/@]+)(@(((\d\.\d\.\d)(-[^/@]+)?)|latest|next))?$/) // has shape (@scope/)?actual-package-name(@0.1.1(-tag.1)?|tag-name)?
  ;
}
//# sourceMappingURL=fetchTemplate.js.map