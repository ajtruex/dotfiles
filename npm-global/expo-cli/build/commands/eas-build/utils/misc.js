"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.printLogsUrls = printLogsUrls;
exports.printBuildResults = printBuildResults;
exports.printDeprecationWarnings = printDeprecationWarnings;

function _xdl() {
  const data = require("@expo/xdl");

  _xdl = function () {
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

function UrlUtils() {
  const data = _interopRequireWildcard(require("../../utils/url"));

  UrlUtils = function () {
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

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function printLogsUrls(accountName, builds) {
  const user = await _xdl().UserManager.ensureLoggedInAsync();

  if (builds.length === 1) {
    const {
      buildId
    } = builds[0];
    const logsUrl = UrlUtils().constructBuildLogsUrl({
      buildId,
      username: accountName,
      v2: true
    });
    (0, _log().default)(`Logs url: ${logsUrl}`);
  } else {
    builds.forEach(({
      buildId,
      platform
    }) => {
      const logsUrl = UrlUtils().constructBuildLogsUrl({
        buildId,
        username: user.username,
        v2: true
      });
      (0, _log().default)(`Platform: ${_constants().platformDisplayNames[platform]}, Logs url: ${logsUrl}`);
    });
  }
}

async function printBuildResults(builds) {
  if (builds.length === 1) {
    var _builds$0$artifacts$b, _builds$, _builds$$artifacts;

    (0, _log().default)(`Artifact url: ${(_builds$0$artifacts$b = (_builds$ = builds[0]) === null || _builds$ === void 0 ? void 0 : (_builds$$artifacts = _builds$.artifacts) === null || _builds$$artifacts === void 0 ? void 0 : _builds$$artifacts.buildUrl) !== null && _builds$0$artifacts$b !== void 0 ? _builds$0$artifacts$b : ''}`);
  } else {
    builds.filter(i => i).filter(build => build.status === 'finished').forEach(build => {
      var _build$artifacts$buil, _build$artifacts;

      (0, _log().default)(`Platform: ${_constants().platformDisplayNames[build.platform]}, Artifact url: ${(_build$artifacts$buil = (_build$artifacts = build.artifacts) === null || _build$artifacts === void 0 ? void 0 : _build$artifacts.buildUrl) !== null && _build$artifacts$buil !== void 0 ? _build$artifacts$buil : ''}`);
    });
  }
}

function printDeprecationWarnings(deprecationInfo) {
  if (!deprecationInfo) {
    return;
  }

  if (deprecationInfo.type === 'internal') {
    _log().default.warn('This command is using API that soon will be deprecated, please update expo-cli.');

    _log().default.warn("Changes won't affect your project confiuration.");

    _log().default.warn(deprecationInfo.message);
  } else if (deprecationInfo.type === 'user-facing') {
    _log().default.warn('This command is using API that soon will be deprecated, please update expo-cli.');

    _log().default.warn('There might be some changes necessary to your project configuration, latest expo-cli will provide more specific error messages.');

    _log().default.warn(deprecationInfo.message);
  } else {
    _log().default.warn('An unexpected warning was encountered. Please report it as a bug:');

    _log().default.warn(deprecationInfo);
  }
}
//# sourceMappingURL=misc.js.map