"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExpoSdkConfig = getExpoSdkConfig;
exports.getClient = getClient;
exports.getAvailableClients = getAvailableClients;
exports.askClientToInstall = askClientToInstall;

function ConfigUtils() {
  const data = _interopRequireWildcard(require("@expo/config"));

  ConfigUtils = function () {
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

function _prompt() {
  const data = _interopRequireDefault(require("../../prompt"));

  _prompt = function () {
    return data;
  };

  return data;
}

function _ProjectUtils() {
  const data = require("./ProjectUtils");

  _ProjectUtils = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

async function getExpoSdkConfig(path) {
  try {
    const {
      projectRoot
    } = await (0, _ProjectUtils().findProjectRootAsync)(path);
    const {
      exp
    } = ConfigUtils().getConfig(projectRoot, {
      skipSDKVersionRequirement: true
    });
    return exp;
  } catch (error) {
    if (error.code !== 'NO_PROJECT') {
      throw error;
    }
  }

  return undefined;
}

function getClient(platform, sdk) {
  if (!sdk) {
    return null;
  }

  if (platform === 'android' && sdk.androidClientUrl) {
    return {
      url: sdk.androidClientUrl,
      version: sdk.androidClientVersion
    };
  }

  if (platform === 'ios' && sdk.iosClientUrl) {
    return {
      url: sdk.iosClientUrl,
      version: sdk.iosClientVersion
    };
  }

  return null;
}

function getAvailableClients(options) {
  return Object.keys(options.sdkVersions).reverse().map(version => {
    const client = getClient(options.platform, options.sdkVersions[version]);
    return {
      sdkVersionString: version,
      sdkVersion: options.sdkVersions[version],
      clientUrl: client === null || client === void 0 ? void 0 : client.url,
      clientVersion: client === null || client === void 0 ? void 0 : client.version
    };
  }).filter(client => {
    const hasUrl = !!client.clientUrl;
    const isDeprecated = !!client.sdkVersion.isDeprecated;
    const IsCompatible = options.project ? _xdl().Versions.lteSdkVersion(options.project, client.sdkVersionString) : true;
    return !isDeprecated && IsCompatible && hasUrl;
  });
}

async function askClientToInstall(options) {
  const answer = await (0, _prompt().default)({
    type: 'list',
    name: 'targetClient',
    message: 'Choose an SDK version to install the client for:',
    pageSize: 20,
    choices: options.clients.map(client => {
      const clientVersion = `- client ${client.clientVersion || 'version unknown'}`;
      const clientLabels = [client.sdkVersionString === options.latestSdkVersion && 'latest', client.sdkVersionString === options.currentSdkVersion && 'recommended'].filter(Boolean);
      const clientMessage = clientLabels.length ? `${clientVersion} (${clientLabels.join(', ')})` : clientVersion;
      return {
        value: client,
        name: `${_chalk().default.bold(client.sdkVersionString)} ${_chalk().default.gray(clientMessage)}`
      };
    })
  });
  return answer.targetClient;
}
//# sourceMappingURL=ClientUpgradeUtils.js.map