"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fileExistsAsync = fileExistsAsync;
exports.readAndroidCredentialsAsync = readAndroidCredentialsAsync;
exports.readIosCredentialsAsync = readIosCredentialsAsync;
exports.readSecretEnvsAsync = readSecretEnvsAsync;
exports.readRawAsync = readRawAsync;

function _joi() {
  const data = _interopRequireDefault(require("@hapi/joi"));

  _joi = function () {
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CredentialsJsonSchema = _joi().default.object({
  android: _joi().default.object({
    keystore: _joi().default.object({
      keystorePath: _joi().default.string().required(),
      keystorePassword: _joi().default.string().required(),
      keyAlias: _joi().default.string().required(),
      keyPassword: _joi().default.string().required()
    })
  }),
  ios: _joi().default.object({
    provisioningProfilePath: _joi().default.string().required(),
    distributionCertificate: _joi().default.object({
      path: _joi().default.string().required(),
      password: _joi().default.string().required()
    }).required()
  }),
  experimental: _joi().default.object({
    npmToken: _joi().default.string()
  })
});

async function fileExistsAsync(projectDir) {
  return await _fsExtra().default.pathExists(_path().default.join(projectDir, 'credentials.json'));
}

async function readAndroidCredentialsAsync(projectDir) {
  const credentialsJson = await readAsync(projectDir);

  if (!credentialsJson.android) {
    throw new Error('Android credentials are missing from credentials.json'); // TODO: add fyi
  }

  const keystoreInfo = credentialsJson.android.keystore;
  return {
    keystore: {
      keystore: await _fsExtra().default.readFile(getAbsolutePath(projectDir, keystoreInfo.keystorePath), 'base64'),
      keystorePassword: keystoreInfo.keystorePassword,
      keyAlias: keystoreInfo.keyAlias,
      keyPassword: keystoreInfo.keyPassword
    }
  };
}

async function readIosCredentialsAsync(projectDir) {
  const credentialsJson = await readAsync(projectDir);

  if (!credentialsJson.ios) {
    throw new Error('iOS credentials are missing from credentials.json'); // TODO: add fyi
  }

  return {
    provisioningProfile: await _fsExtra().default.readFile(getAbsolutePath(projectDir, credentialsJson.ios.provisioningProfilePath), 'base64'),
    distributionCertificate: {
      certP12: await _fsExtra().default.readFile(getAbsolutePath(projectDir, credentialsJson.ios.distributionCertificate.path), 'base64'),
      certPassword: credentialsJson.ios.distributionCertificate.password
    }
  };
}

async function readSecretEnvsAsync(projectDir) {
  var _credentialsJson$expe;

  if (!(await fileExistsAsync(projectDir))) {
    return undefined;
  }

  const credentialsJson = await readAsync(projectDir);
  const npmToken = credentialsJson === null || credentialsJson === void 0 ? void 0 : (_credentialsJson$expe = credentialsJson.experimental) === null || _credentialsJson$expe === void 0 ? void 0 : _credentialsJson$expe.npmToken;
  return npmToken ? {
    NPM_TOKEN: npmToken
  } : undefined;
}

async function readAsync(projectDir) {
  const credentialsJSONRaw = await readRawAsync(projectDir);
  const {
    value: credentialsJson,
    error
  } = CredentialsJsonSchema.validate(credentialsJSONRaw, {
    stripUnknown: true,
    convert: true,
    abortEarly: false
  });

  if (error) {
    throw new Error(`credentials.json is not valid [${error.toString()}]`);
  }

  return credentialsJson;
}

async function readRawAsync(projectDir) {
  const credentialsJsonFilePath = _path().default.join(projectDir, 'credentials.json');

  try {
    const credentialsJSONContents = await _fsExtra().default.readFile(credentialsJsonFilePath, 'utf8');
    return JSON.parse(credentialsJSONContents);
  } catch (err) {
    throw new Error(`credentials.json must exist in the project root directory and contain a valid JSON`);
  }
}

const getAbsolutePath = (projectDir, filePath) => _path().default.isAbsolute(filePath) ? filePath : _path().default.join(projectDir, filePath);
//# sourceMappingURL=read.js.map