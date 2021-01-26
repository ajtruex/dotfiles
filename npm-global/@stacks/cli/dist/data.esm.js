import { handlePendingSignIn, uploadToGaiaHub, makeAuthResponse, config, getTokenFileUrl } from 'blockstack';
import { randomBytes } from 'crypto';
import { parse } from 'url';
import { TokenSigner } from 'jsontokens';
import { canonicalPrivateKey, getPrivateKeyAddress, getPublicKeyFromPrivateKey } from './utils.esm.js';
import { connectToGaiaHub } from '@stacks/storage';

var ZoneFile = /*#__PURE__*/require('zone-file');

function makeFakeAuthResponseToken(appPrivateKey, hubURL, associationToken) {
  var ownerPrivateKey = '24004db06ef6d26cdd2b0fa30b332a1b10fa0ba2b07e63505ffc2a9ed7df22b4';
  var transitPrivateKey = 'f33fb466154023aba2003c17158985aa6603db68db0f1afc0fcf1d641ea6c2cb';
  var transitPublicKey = '0496345da77fb5e06757b9c4fd656bf830a3b293f245a6cc2f11f8334ebb690f1' + '9582124f4b07172eb61187afba4514828f866a8a223e0d5c539b2e38a59ab8bb3';
  window.localStorage.setItem('blockstack-transit-private-key', transitPrivateKey);
  var authResponse = makeAuthResponse(ownerPrivateKey, {
    type: '@Person',
    accounts: []
  }, null, {}, null, appPrivateKey, undefined, transitPublicKey, hubURL, config.network.blockstackAPIUrl, associationToken);
  return authResponse;
}

function makeAssociationToken(appPrivateKey, identityKey) {
  var appPublicKey = getPublicKeyFromPrivateKey(canonicalPrivateKey(appPrivateKey) + "01");
  var FOUR_MONTH_SECONDS = 60 * 60 * 24 * 31 * 4;
  var salt = randomBytes(16).toString('hex');
  var identityPublicKey = getPublicKeyFromPrivateKey(identityKey);
  var associationTokenClaim = {
    childToAssociate: appPublicKey,
    iss: identityPublicKey,
    exp: FOUR_MONTH_SECONDS + new Date().getTime() / 1000,
    salt: salt
  };
  var associationToken = new TokenSigner('ES256K', identityKey).sign(associationTokenClaim);
  return associationToken;
}
function gaiaAuth(network, appPrivateKey, hubUrl, ownerPrivateKey) {
  if (!network.isMainnet()) {
    throw new Error('Gaia only works with mainnet networks.');
  }

  var associationToken;

  if (ownerPrivateKey && appPrivateKey) {
    associationToken = makeAssociationToken(appPrivateKey, ownerPrivateKey);
  }

  var authSessionToken = makeFakeAuthResponseToken(appPrivateKey, hubUrl, associationToken);
  var nameLookupUrl = network.legacyNetwork.blockstackAPIUrl + "/v1/names/";
  var transitPrivateKey = 'f33fb466154023aba2003c17158985aa6603db68db0f1afc0fcf1d641ea6c2cb';
  return handlePendingSignIn(nameLookupUrl, authSessionToken, transitPrivateKey);
}
function gaiaConnect(network, gaiaHubUrl, privateKey, ownerPrivateKey) {
  var addressMainnet = network.coerceMainnetAddress(getPrivateKeyAddress(network, canonicalPrivateKey(privateKey) + "01"));
  var addressMainnetCanonical = network.coerceMainnetAddress(getPrivateKeyAddress(network, canonicalPrivateKey(privateKey)));
  var associationToken;

  if (ownerPrivateKey) {
    associationToken = makeAssociationToken(privateKey, ownerPrivateKey);
  }

  return connectToGaiaHub(gaiaHubUrl, canonicalPrivateKey(privateKey), associationToken).then(function (hubConfig) {
    if (network.coerceMainnetAddress(hubConfig.address) === addressMainnet) {
      hubConfig.address = addressMainnet;
    } else if (network.coerceMainnetAddress(hubConfig.address) === addressMainnetCanonical) {
      hubConfig.address = addressMainnetCanonical;
    } else {
      throw new Error('Invalid private key: ' + (network.coerceMainnetAddress(hubConfig.address) + " is neither ") + (addressMainnet + " or " + addressMainnetCanonical));
    }

    return hubConfig;
  });
}

function gaiaFindProfileName(network, hubConfig, blockstackID) {
  if (!blockstackID || blockstackID === null || blockstackID === undefined) {
    return Promise.resolve().then(function () {
      return 'profile.json';
    });
  } else {
    return network.getNameInfo(blockstackID).then(function (nameInfo) {
      var profileUrl;

      try {
        var zonefileJSON = ZoneFile.parseZoneFile(nameInfo.zonefile);

        if (zonefileJSON.uri && zonefileJSON.hasOwnProperty('$origin')) {
          profileUrl = getTokenFileUrl(zonefileJSON);
        }
      } catch (e) {
        throw new Error("Could not determine profile URL for " + String(blockstackID) + ": could not parse zone file");
      }

      if (profileUrl === null || profileUrl === undefined) {
        throw new Error("Could not determine profile URL for " + String(blockstackID) + ": no URL in zone file");
      }

      var gaiaReadPrefix = "" + hubConfig.url_prefix + hubConfig.address;
      var gaiaReadUrlPath = String(parse(gaiaReadPrefix).path);
      var profileUrlPath = String(parse(profileUrl).path);

      if (!profileUrlPath.startsWith(gaiaReadUrlPath)) {
        throw new Error("Could not determine profile URL for " + String(blockstackID) + ": wrong Gaia hub" + (" (" + gaiaReadPrefix + " does not correspond to " + profileUrl + ")"));
      }

      var profilePath = profileUrlPath.substring(gaiaReadUrlPath.length + 1);
      return profilePath;
    });
  }
}

function gaiaUploadProfile(network, gaiaHubURL, gaiaData, privateKey, blockstackID) {
  var hubConfig;
  return gaiaConnect(network, gaiaHubURL, privateKey).then(function (hubconf) {
    hubConfig = hubconf;
    return gaiaFindProfileName(network, hubConfig, blockstackID);
  }).then(function (profilePath) {
    return uploadToGaiaHub(profilePath, gaiaData, hubConfig);
  });
}
function gaiaUploadProfileAll(network, gaiaUrls, gaiaData, privateKey, blockstackID) {
  var sanitizedGaiaUrls = gaiaUrls.map(function (gaiaUrl) {
    var urlInfo = parse(gaiaUrl);

    if (!urlInfo.protocol) {
      return '';
    }

    if (!urlInfo.host) {
      return '';
    }

    return String(urlInfo.protocol) + "//" + String(urlInfo.host);
  }).filter(function (gaiaUrl) {
    return gaiaUrl.length > 0;
  });
  var uploadPromises = sanitizedGaiaUrls.map(function (gaiaUrl) {
    return gaiaUploadProfile(network, gaiaUrl, gaiaData, privateKey, blockstackID);
  });
  return Promise.all(uploadPromises).then(function (publicUrls) {
    return {
      error: null,
      dataUrls: publicUrls
    };
  })["catch"](function (e) {
    return {
      error: "Failed to upload: " + e.message,
      dataUrls: null
    };
  });
}
function getGaiaAddressFromURL(appUrl) {
  var matches = appUrl.match(/([13][a-km-zA-HJ-NP-Z0-9]{26,35})/);

  if (!matches) {
    throw new Error('Failed to parse gaia address');
  }

  return matches[matches.length - 1];
}
function getGaiaAddressFromProfile(network, profile, appOrigin) {
  if (!profile) {
    throw new Error('No profile');
  }

  if (!profile.apps) {
    throw new Error('No profile apps');
  }

  if (!profile.apps[appOrigin]) {
    throw new Error("No app entry for " + appOrigin);
  }

  var appUrl = profile.apps[appOrigin];
  var existingAppAddress;

  try {
    existingAppAddress = network.coerceMainnetAddress(getGaiaAddressFromURL(appUrl));
  } catch (e) {
    throw new Error("Failed to parse app URL " + appUrl);
  }

  return existingAppAddress;
}

export { gaiaAuth, gaiaConnect, gaiaUploadProfile, gaiaUploadProfileAll, getGaiaAddressFromProfile, getGaiaAddressFromURL, makeAssociationToken };
//# sourceMappingURL=data.esm.js.map
