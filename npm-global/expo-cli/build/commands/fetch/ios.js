"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

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

function _context() {
  const data = require("../../credentials/context");

  _context = function () {
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function fetchIosCerts(projectDir) {
  const inProjectDir = filename => _path().default.resolve(projectDir, filename);

  try {
    var _ctx$manifest, _ctx$manifest$ios, _ctx$manifest$owner, _appCredentials$crede;

    const ctx = new (_context().Context)();
    await ctx.init(projectDir);
    const bundleIdentifier = (_ctx$manifest = ctx.manifest) === null || _ctx$manifest === void 0 ? void 0 : (_ctx$manifest$ios = _ctx$manifest.ios) === null || _ctx$manifest$ios === void 0 ? void 0 : _ctx$manifest$ios.bundleIdentifier;

    if (!bundleIdentifier) {
      throw new Error(`Your project must have a \`bundleIdentifier\` set in the Expo config (app.json or app.config.js).\nSee https://expo.fyi/bundle-identifier`);
    }

    const app = {
      accountName: (_ctx$manifest$owner = ctx.manifest.owner) !== null && _ctx$manifest$owner !== void 0 ? _ctx$manifest$owner : ctx.user.username,
      projectName: ctx.manifest.slug,
      bundleIdentifier
    };
    (0, _log().default)(`Retrieving iOS credentials for @${app.accountName}/${app.projectName} (${bundleIdentifier})`);
    const appCredentials = await ctx.ios.getAppCredentials(app);
    const pushCredentials = await ctx.ios.getPushKey(app);
    const distCredentials = await ctx.ios.getDistCert(app);
    const {
      certP12,
      certPassword,
      certPrivateSigningKey
    } = distCredentials !== null && distCredentials !== void 0 ? distCredentials : {};
    const {
      apnsKeyId,
      apnsKeyP8
    } = pushCredentials !== null && pushCredentials !== void 0 ? pushCredentials : {};
    const {
      pushP12,
      pushPassword,
      provisioningProfile,
      teamId
    } = (_appCredentials$crede = appCredentials === null || appCredentials === void 0 ? void 0 : appCredentials.credentials) !== null && _appCredentials$crede !== void 0 ? _appCredentials$crede : {};

    if (teamId !== undefined) {
      (0, _log().default)(`These credentials are associated with Apple Team ID: ${teamId}`);
    }

    if (certP12) {
      const distPath = inProjectDir(`${app.projectName}_dist.p12`);
      await _fsExtra().default.writeFile(distPath, Buffer.from(certP12, 'base64'));
    }

    if (certPrivateSigningKey) {
      const distPrivateKeyPath = inProjectDir(`${app.projectName}_dist_cert_private.key`);
      await _fsExtra().default.writeFile(distPrivateKeyPath, certPrivateSigningKey);
    }

    if (certP12 || certPrivateSigningKey) {
      (0, _log().default)('Wrote distribution cert credentials to disk.');
    }

    if (apnsKeyP8) {
      const apnsKeyP8Path = inProjectDir(`${app.projectName}_apns_key.p8`);
      await _fsExtra().default.writeFile(apnsKeyP8Path, apnsKeyP8);
      (0, _log().default)('Wrote push key credentials to disk.');
    }

    if (pushP12) {
      const pushPath = inProjectDir(`${app.projectName}_push.p12`);
      await _fsExtra().default.writeFile(pushPath, Buffer.from(pushP12, 'base64'));
    }

    if (pushP12) {
      (0, _log().default)('Wrote push cert credentials to disk.');
    }

    if (provisioningProfile) {
      const provisioningProfilePath = _path().default.resolve(projectDir, `${app.projectName}.mobileprovision`);

      await _fsExtra().default.writeFile(provisioningProfilePath, Buffer.from(provisioningProfile, 'base64'));
      (0, _log().default)('Wrote provisioning profile to disk');
    }

    (0, _log().default)(`Save these important values as well:

Distribution P12 password: ${certPassword ? _chalk().default.bold(certPassword) : _chalk().default.yellow('(not available)')}
Push Key ID:               ${apnsKeyId ? _chalk().default.bold(apnsKeyId) : _chalk().default.yellow('(not available)')}
Push P12 password:         ${pushPassword ? _chalk().default.bold(pushPassword) : _chalk().default.yellow('(not available)')}
`);
  } catch (e) {
    throw new Error('Unable to fetch credentials for this project. Are you sure they exist?');
  }

  (0, _log().default)('All done!');
}

var _default = fetchIosCerts;
exports.default = _default;
//# sourceMappingURL=ios.js.map