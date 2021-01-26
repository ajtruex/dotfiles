"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getApiV2WrapperMock = getApiV2WrapperMock;
exports.getIosApiMock = getIosApiMock;
exports.appleCtxMock = exports.testAllCredentials = exports.testAppCredentials = exports.testAllCredentialsForApp = exports.testAppCredential = exports.testLegacyPushCert = exports.testPushKeysFromApple = exports.testPushKeyFromApple = exports.testIosPushCredentials = exports.testIosPushCredential = exports.testPushKey = exports.testDistCertsFromApple = exports.testDistCertFromApple = exports.testIosDistCredentials = exports.testIosDistCredential = exports.testDistCert = exports.testProvisioningProfilesFromApple = exports.testProvisioningProfileFromApple = exports.testProvisioningProfiles = exports.testProvisioningProfile = exports.testAppleTeam = void 0;

function _merge() {
  const data = _interopRequireDefault(require("lodash/merge"));

  _merge = function () {
    return data;
  };

  return data;
}

function _mockBase64Data() {
  const data = require("./mock-base64-data");

  _mockBase64Data = function () {
    return data;
  };

  return data;
}

function _mocksConstants() {
  const data = require("./mocks-constants");

  _mocksConstants = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const today = new Date();
const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
const testAppleTeam = {
  id: 'test-team-id'
};
exports.testAppleTeam = testAppleTeam;
const testProvisioningProfile = {
  provisioningProfileId: 'test-id',
  provisioningProfile: _mockBase64Data().testProvisioningProfileBase64,
  teamId: 'id'
};
exports.testProvisioningProfile = testProvisioningProfile;
const testProvisioningProfiles = [testProvisioningProfile];
exports.testProvisioningProfiles = testProvisioningProfiles;
const testProvisioningProfileFromApple = {
  name: 'test-name',
  status: 'Active',
  expires: tomorrow.getTime(),
  distributionMethod: 'test',
  certificates: [],
  provisioningProfileId: testProvisioningProfile.provisioningProfileId,
  provisioningProfile: testProvisioningProfile.provisioningProfile,
  teamId: 'id'
};
exports.testProvisioningProfileFromApple = testProvisioningProfileFromApple;
const testProvisioningProfilesFromApple = [testProvisioningProfileFromApple];
exports.testProvisioningProfilesFromApple = testProvisioningProfilesFromApple;
const testDistCert = {
  certP12: 'Y2VydHAxMg==',
  certPassword: 'test-password',
  distCertSerialNumber: 'test-serial',
  teamId: 'test-team-id'
};
exports.testDistCert = testDistCert;
const testIosDistCredential = {
  id: 1,
  type: 'dist-cert',
  ...testDistCert
};
exports.testIosDistCredential = testIosDistCredential;
const testIosDistCredentials = [testIosDistCredential];
exports.testIosDistCredentials = testIosDistCredentials;
const testDistCertFromApple = {
  id: 'test-id',
  name: 'test-name',
  status: 'Active',
  created: today.getTime(),
  expires: tomorrow.getTime(),
  ownerType: 'test-owner-type',
  ownerName: 'test-owner',
  ownerId: 'test-id',
  serialNumber: testIosDistCredential.distCertSerialNumber
};
exports.testDistCertFromApple = testDistCertFromApple;
const testDistCertsFromApple = [testDistCertFromApple];
exports.testDistCertsFromApple = testDistCertsFromApple;
const testPushKey = {
  apnsKeyP8: 'test-p8',
  apnsKeyId: 'test-key-id',
  teamId: 'test-team-id'
};
exports.testPushKey = testPushKey;
const testIosPushCredential = {
  id: 2,
  type: 'push-key',
  ...testPushKey
};
exports.testIosPushCredential = testIosPushCredential;
const testIosPushCredentials = [testIosPushCredential];
exports.testIosPushCredentials = testIosPushCredentials;
const testPushKeyFromApple = {
  id: testIosPushCredential.apnsKeyId,
  name: 'test-name'
};
exports.testPushKeyFromApple = testPushKeyFromApple;
const testPushKeysFromApple = [testPushKeyFromApple];
exports.testPushKeysFromApple = testPushKeysFromApple;
const testLegacyPushCert = {
  pushId: 'test-push-id',
  pushP12: 'test-push-p12',
  pushPassword: 'test-push-password'
};
exports.testLegacyPushCert = testLegacyPushCert;
const testAppCredential = {
  experienceName: _mocksConstants().testExperienceName,
  bundleIdentifier: _mocksConstants().testBundleIdentifier,
  distCredentialsId: testIosDistCredential.id,
  pushCredentialsId: testIosPushCredential.id,
  credentials: { ...testProvisioningProfile
  }
};
exports.testAppCredential = testAppCredential;
const testAllCredentialsForApp = { ...testAppCredential,
  pushCredentials: testPushKey,
  distCredentials: testDistCert
};
exports.testAllCredentialsForApp = testAllCredentialsForApp;
const testAppCredentials = [testAppCredential];
exports.testAppCredentials = testAppCredentials;
const testAllCredentials = {
  userCredentials: [...testIosDistCredentials, ...testIosPushCredentials],
  appCredentials: testAppCredentials
};
exports.testAllCredentials = testAllCredentials;

function getApiV2WrapperMock(override = {}) {
  // by default all method throw exceptions to make sure that we only call what is expected
  const getUnexpectedCallMock = () => jest.fn(() => {
    throw new Error('unexpected call');
  });

  return (0, _merge().default)({
    getAllCredentialsApi: getUnexpectedCallMock(),
    getAllCredentialsForAppApi: getUnexpectedCallMock(),
    getUserCredentialsByIdApi: getUnexpectedCallMock(),
    createDistCertApi: getUnexpectedCallMock(),
    updateDistCertApi: getUnexpectedCallMock(),
    deleteDistCertApi: getUnexpectedCallMock(),
    useDistCertApi: getUnexpectedCallMock(),
    createPushKeyApi: getUnexpectedCallMock(),
    updatePushKeyApi: getUnexpectedCallMock(),
    deletePushKeyApi: getUnexpectedCallMock(),
    usePushKeyApi: getUnexpectedCallMock(),
    deletePushCertApi: getUnexpectedCallMock(),
    updateProvisioningProfileApi: getUnexpectedCallMock(),
    deleteProvisioningProfileApi: getUnexpectedCallMock()
  }, override);
}

function getIosApiMock(override = {}) {
  return (0, _merge().default)({
    getDistCert: jest.fn(() => testDistCert),
    createDistCert: jest.fn(() => testIosDistCredential),
    useDistCert: jest.fn(),
    getPushKey: jest.fn(() => testPushKey),
    createPushKey: jest.fn(() => testIosPushCredential),
    usePushKey: jest.fn(),
    updateProvisioningProfile: jest.fn(),
    getAppCredentials: jest.fn(() => testAppCredential),
    getProvisioningProfile: jest.fn(() => testProvisioningProfile),
    getAllCredentials: jest.fn(() => testAllCredentials)
  }, override);
}

const appleCtxMock = {
  appleId: 'test-id',
  appleIdPassword: 'test-password',
  team: {
    id: 'test-team-id'
  },
  fastlaneSession: 'test-fastlane-session'
};
exports.appleCtxMock = appleCtxMock;
//# sourceMappingURL=mocks-ios.js.map