"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createClientBuildRequest = createClientBuildRequest;
exports.getExperienceName = getExperienceName;
exports.isAllowedToBuild = isAllowedToBuild;

function _xdl() {
  const data = require("@expo/xdl");

  _xdl = function () {
    return data;
  };

  return data;
}

async function createClientBuildRequest({
  user = null,
  appleContext,
  distributionCert,
  provisioningProfile,
  pushKey,
  udids,
  addUdid,
  email,
  bundleIdentifier,
  customAppConfig = {}
}) {
  return await _xdl().ApiV2.clientForUser(user).postAsync('client-build/create-ios-request', {
    appleTeamId: appleContext.team.id,
    appleTeamName: appleContext.team.name,
    addUdid,
    bundleIdentifier,
    email,
    customAppConfig: customAppConfig,
    credentials: { ...(pushKey && pushKey.apnsKeyP8 ? {
        apnsKeyP8: pushKey.apnsKeyP8
      } : null),
      ...(pushKey && pushKey.apnsKeyId ? {
        apnsKeyId: pushKey.apnsKeyId
      } : null),
      certP12: distributionCert.certP12,
      certPassword: distributionCert.certPassword,
      provisioningProfileId: provisioningProfile.provisioningProfileId,
      provisioningProfile: provisioningProfile.provisioningProfile,
      teamId: appleContext.team.id,
      appleSession: appleContext.fastlaneSession,
      udidsString: JSON.stringify(udids)
    }
  });
}

async function getExperienceName({
  user = null,
  appleTeamId
}) {
  const {
    experienceName
  } = await _xdl().ApiV2.clientForUser(user).postAsync('client-build/experience-name', {
    appleTeamId
  });
  return experienceName;
}

async function isAllowedToBuild({
  user = null,
  appleTeamId
}) {
  return await _xdl().ApiV2.clientForUser(user).postAsync('client-build/allowed-to-build', {
    appleTeamId
  });
}
//# sourceMappingURL=clientBuildApi.js.map