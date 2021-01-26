import { asyncToGenerator as _asyncToGenerator } from './_virtual/_rollupPluginBabelHelpers.js';
import runtime_1 from './node_modules/regenerator-runtime/runtime.esm.js';
import { fetchAppManifest, verifyAuthRequest, updateQueryStringParameter, verifyAuthResponse, makeAuthResponse, config } from 'blockstack';
import { error, debug, info } from 'winston';
import { randomBytes } from 'crypto';
import { decodeToken, TokenSigner } from 'jsontokens';
import { makeProfileJWT, nameLookup } from './utils.esm.js';
import { getOwnerKeyInfo, extractAppKey, getApplicationKeyInfo } from './keys.esm.js';
import { gaiaUploadProfileAll, gaiaConnect, getGaiaAddressFromProfile, makeAssociationToken } from './data.esm.js';

var SIGNIN_CSS = "\nh1 { \n  font-family: monospace; \n  font-size: 24px; \n  font-style: normal; \n  font-variant: normal; \n  font-weight: 700; \n  line-height: 26.4px; \n} \nh3 { \n  font-family: monospace; \n  font-size: 14px; \n  font-style: normal; \n  font-variant: normal; \n  font-weight: 700; \n  line-height: 15.4px; \n}\np { \n  font-family: monospace; \n  font-size: 14px; \n  font-style: normal; \n  font-variant: normal; \n  font-weight: 400; \n  line-height: 20px; \n}\nb {\n  background-color: #e8e8e8;\n}\npre { \n  font-family: monospace; \n  font-size: 13px; \n  font-style: normal; \n  font-variant: normal; \n  font-weight: 400; \n  line-height: 18.5714px;\n}";
var SIGNIN_HEADER = "<html><head><style>" + SIGNIN_CSS + "</style></head></body><h3>Blockstack CLI Sign-in</h3><br>";
var SIGNIN_DESC = '<p>Sign-in request for <b>"{appName}"</b></p>';
var SIGNIN_SCOPES = '<p>Requested scopes: <b>"{appScopes}"</b></p>';
var SIGNIN_FMT_NAME = '<p><a href="{authRedirect}">{blockstackID}</a> ({idAddress})</p>';
var SIGNIN_FMT_ID = '<p><a href="{authRedirect}">{idAddress}</a> (anonymous)</p>';
var SIGNIN_FOOTER = '</body></html>';
var authTransitNonce = /*#__PURE__*/randomBytes(32).toString('hex');

function getAppPrivateKey(_x, _x2, _x3, _x4) {
  return _getAppPrivateKey.apply(this, arguments);
}

function _getAppPrivateKey() {
  _getAppPrivateKey = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(network, mnemonic, id, appOrigin) {
    var appKeyInfo, appPrivateKey, existingAppAddress;
    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return getApplicationKeyInfo(network, mnemonic, id.idAddress, appOrigin, id.index);

          case 2:
            appKeyInfo = _context.sent;

            try {
              existingAppAddress = getGaiaAddressFromProfile(network, id.profile, appOrigin);
              appPrivateKey = extractAppKey(network, appKeyInfo, existingAppAddress);
            } catch (e) {
              appPrivateKey = extractAppKey(network, appKeyInfo);
            }

            return _context.abrupt("return", appPrivateKey);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getAppPrivateKey.apply(this, arguments);
}

function makeSignInLink(_x5, _x6, _x7, _x8, _x9, _x10) {
  return _makeSignInLink.apply(this, arguments);
}

function _makeSignInLink() {
  _makeSignInLink = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2(network, authPort, mnemonic, authRequest, hubUrl, id) {
    var appOrigin, appPrivateKey, associationToken, authResponseTmp, authResponsePayload, id_public, tokenSigner, authResponse;
    return runtime_1.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            appOrigin = authRequest.domain_name;
            _context2.next = 3;
            return getAppPrivateKey(network, mnemonic, id, appOrigin);

          case 3:
            appPrivateKey = _context2.sent;
            associationToken = makeAssociationToken(appPrivateKey, id.privateKey);
            authResponseTmp = makeAuthResponse(id.privateKey, {}, id.name, {
              email: undefined,
              profileUrl: id.profileUrl
            }, undefined, appPrivateKey, undefined, authRequest.public_keys[0], hubUrl, config.network.blockstackAPIUrl, associationToken);
            authResponsePayload = decodeToken(authResponseTmp).payload;
            id_public = Object.assign({}, id);
            id_public.profile = {};
            id_public.privateKey = undefined;
            authResponsePayload.metadata = {
              id: id_public,
              profileUrl: id.profileUrl,
              appOrigin: appOrigin,
              redirect_uri: authRequest.redirect_uri,
              scopes: authRequest.scopes,
              salt: randomBytes(16).toString('hex'),
              nonce: authTransitNonce
            };
            tokenSigner = new TokenSigner('ES256k', id.privateKey);
            authResponse = tokenSigner.sign(authResponsePayload);
            return _context2.abrupt("return", updateQueryStringParameter("http://localhost:" + authPort + "/signin", 'authResponse', authResponse));

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _makeSignInLink.apply(this, arguments);
}

function makeAuthPage(_x11, _x12, _x13, _x14, _x15, _x16, _x17) {
  return _makeAuthPage.apply(this, arguments);
}

function _makeAuthPage() {
  _makeAuthPage = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee3(network, authPort, mnemonic, hubUrl, manifest, authRequest, ids) {
    var signinBody, signinDescription, signinScopes, i, signinEntry;
    return runtime_1.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            signinBody = SIGNIN_HEADER;
            signinDescription = SIGNIN_DESC.replace(/{appName}/, manifest.name || '(Unknown app)');
            signinScopes = SIGNIN_SCOPES.replace(/{appScopes}/, authRequest.scopes.length > 0 ? authRequest.scopes.join(', ') : '(none)');
            signinBody = "" + signinBody + signinDescription + signinScopes;
            i = 0;

          case 5:
            if (!(i < ids.length)) {
              _context3.next = 24;
              break;
            }

            signinEntry = void 0;

            if (!ids[i].name) {
              _context3.next = 15;
              break;
            }

            _context3.t0 = SIGNIN_FMT_NAME;
            _context3.next = 11;
            return makeSignInLink(network, authPort, mnemonic, authRequest, hubUrl, ids[i]);

          case 11:
            _context3.t1 = _context3.sent;
            signinEntry = _context3.t0.replace.call(_context3.t0, /{authRedirect}/, _context3.t1).replace(/{blockstackID}/, ids[i].name).replace(/{idAddress}/, ids[i].idAddress);
            _context3.next = 20;
            break;

          case 15:
            _context3.t2 = SIGNIN_FMT_ID;
            _context3.next = 18;
            return makeSignInLink(network, authPort, mnemonic, authRequest, hubUrl, ids[i]);

          case 18:
            _context3.t3 = _context3.sent;
            signinEntry = _context3.t2.replace.call(_context3.t2, /{authRedirect}/, _context3.t3).replace(/{idAddress}/, ids[i].idAddress);

          case 20:
            signinBody = "" + signinBody + signinEntry;

          case 21:
            i++;
            _context3.next = 5;
            break;

          case 24:
            signinBody = "" + signinBody + SIGNIN_FOOTER;
            return _context3.abrupt("return", signinBody);

          case 26:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _makeAuthPage.apply(this, arguments);
}

function loadNamedIdentitiesLoop(_x18, _x19, _x20, _x21) {
  return _loadNamedIdentitiesLoop.apply(this, arguments);
}

function _loadNamedIdentitiesLoop() {
  _loadNamedIdentitiesLoop = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee4(network, mnemonic, index, identities) {
    var keyInfo, nameList, i, identity;
    return runtime_1.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!(index > 65536)) {
              _context4.next = 2;
              break;
            }

            throw new Error('Too many names');

          case 2:
            _context4.next = 4;
            return getOwnerKeyInfo(network, mnemonic, index);

          case 4:
            keyInfo = _context4.sent;
            _context4.next = 7;
            return network.getNamesOwned(keyInfo.idAddress.slice(3));

          case 7:
            nameList = _context4.sent;

            if (!(nameList.length === 0)) {
              _context4.next = 10;
              break;
            }

            return _context4.abrupt("return", identities);

          case 10:
            for (i = 0; i < nameList.length; i++) {
              identity = {
                name: nameList[i],
                idAddress: keyInfo.idAddress,
                privateKey: keyInfo.privateKey,
                index: index,
                profile: {},
                profileUrl: ''
              };
              identities.push(identity);
            }

            _context4.next = 13;
            return loadNamedIdentitiesLoop(network, mnemonic, index + 1, identities);

          case 13:
            return _context4.abrupt("return", _context4.sent);

          case 14:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _loadNamedIdentitiesLoop.apply(this, arguments);
}

function loadNamedIdentities(network, mnemonic) {
  return loadNamedIdentitiesLoop(network, mnemonic, 0, []);
}

function loadUnnamedIdentity(_x22, _x23, _x24) {
  return _loadUnnamedIdentity.apply(this, arguments);
}

function _loadUnnamedIdentity() {
  _loadUnnamedIdentity = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee5(network, mnemonic, index) {
    var keyInfo, idInfo;
    return runtime_1.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return getOwnerKeyInfo(network, mnemonic, index);

          case 2:
            keyInfo = _context5.sent;
            idInfo = {
              name: '',
              idAddress: keyInfo.idAddress,
              privateKey: keyInfo.privateKey,
              index: index,
              profile: {},
              profileUrl: ''
            };
            return _context5.abrupt("return", idInfo);

          case 5:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _loadUnnamedIdentity.apply(this, arguments);
}

function sendJSON(res, data, statusCode) {
  info("Respond " + statusCode + ": " + JSON.stringify(data));
  res.writeHead(statusCode, {
    'Content-Type': 'application/json'
  });
  res.write(JSON.stringify(data));
  res.end();
}

function getIdentityInfo(_x25, _x26, _x27, _x28) {
  return _getIdentityInfo.apply(this, arguments);
}

function _getIdentityInfo() {
  _getIdentityInfo = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee6(network, mnemonic, _appGaiaHub, _profileGaiaHub) {
    var identities, nameInfoPromises, nameDatas, i, nextIndex;
    return runtime_1.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            network.setCoerceMainnetAddress(true);
            _context6.prev = 1;
            _context6.next = 4;
            return loadNamedIdentities(network, mnemonic);

          case 4:
            identities = _context6.sent;
            nameInfoPromises = identities.map(function (id) {
              var lookup = nameLookup(network, id.name, true)["catch"](function () {
                return null;
              });
              return lookup;
            });
            _context6.next = 8;
            return Promise.all(nameInfoPromises);

          case 8:
            nameDatas = _context6.sent;
            network.setCoerceMainnetAddress(false);
            nameDatas = nameDatas.filter(function (p) {
              return p !== null && p !== undefined;
            });

            for (i = 0; i < nameDatas.length; i++) {
              if (nameDatas[i].hasOwnProperty('error') && nameDatas[i].error) {
                identities[i].profileUrl = '';
              } else {
                identities[i].profileUrl = nameDatas[i].profileUrl;
                identities[i].profile = nameDatas[i].profile;
              }
            }

            nextIndex = identities.length + 1;
            identities = identities.filter(function (id) {
              return !!id.profileUrl;
            });
            _context6.t0 = identities;
            _context6.next = 17;
            return loadUnnamedIdentity(network, mnemonic, nextIndex);

          case 17:
            _context6.t1 = _context6.sent;

            _context6.t0.push.call(_context6.t0, _context6.t1);

            _context6.next = 25;
            break;

          case 21:
            _context6.prev = 21;
            _context6.t2 = _context6["catch"](1);
            network.setCoerceMainnetAddress(false);
            throw _context6.t2;

          case 25:
            return _context6.abrupt("return", identities);

          case 26:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[1, 21]]);
  }));
  return _getIdentityInfo.apply(this, arguments);
}

function handleAuth(_x29, _x30, _x31, _x32, _x33, _x34, _x35) {
  return _handleAuth.apply(this, arguments);
}

function _handleAuth() {
  _handleAuth = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee7(network, mnemonic, gaiaHubUrl, profileGaiaHub, port, req, res) {
    var authToken, errorMsg, identities, valid, appManifest, decodedAuthToken, decodedAuthPayload, authPage;
    return runtime_1.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            authToken = req.query.authRequest;

            if (authToken) {
              _context7.next = 3;
              break;
            }

            return _context7.abrupt("return", Promise.resolve().then(function () {
              sendJSON(res, {
                error: 'No authRequest given'
              }, 400);
            }));

          case 3:
            errorMsg = '';
            identities = [];
            _context7.prev = 5;
            _context7.next = 8;
            return getIdentityInfo(network, mnemonic, gaiaHubUrl, profileGaiaHub);

          case 8:
            identities = _context7.sent;
            errorMsg = 'Unable to verify authentication token';
            _context7.next = 12;
            return verifyAuthRequest(authToken);

          case 12:
            valid = _context7.sent;

            if (valid) {
              _context7.next = 16;
              break;
            }

            errorMsg = 'Invalid authentication token: could not verify';
            throw new Error(errorMsg);

          case 16:
            errorMsg = 'Unable to fetch app manifest';
            _context7.next = 19;
            return fetchAppManifest(authToken);

          case 19:
            appManifest = _context7.sent;
            errorMsg = 'Unable to decode token';
            decodedAuthToken = decodeToken(authToken);
            decodedAuthPayload = decodedAuthToken.payload;

            if (decodedAuthPayload) {
              _context7.next = 26;
              break;
            }

            errorMsg = 'Invalid authentication token: no payload';
            throw new Error(errorMsg);

          case 26:
            errorMsg = 'Unable to make auth page';
            _context7.next = 29;
            return makeAuthPage(network, port, mnemonic, gaiaHubUrl, appManifest, decodedAuthPayload, identities);

          case 29:
            authPage = _context7.sent;
            res.writeHead(200, {
              'Content-Type': 'text/html',
              'Content-Length': authPage.length
            });
            res.write(authPage);
            res.end();
            _context7.next = 41;
            break;

          case 35:
            _context7.prev = 35;
            _context7.t0 = _context7["catch"](5);

            if (!errorMsg) {
              errorMsg = _context7.t0.message;
            }

            console.log(_context7.t0.stack);
            error(errorMsg);
            sendJSON(res, {
              error: "Unable to authenticate app request: " + errorMsg
            }, 400);

          case 41:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[5, 35]]);
  }));
  return _handleAuth.apply(this, arguments);
}

function updateProfileApps(network, id, appOrigin, appGaiaConfig, profile) {
  var needProfileUpdate = false;
  var profilePromise = Promise.resolve().then(function () {
    if (profile === null || profile === undefined) {
      return nameLookup(network, id.name)["catch"](function (_e) {
        return null;
      });
    } else {
      return {
        profile: profile
      };
    }
  });
  return profilePromise.then(function (profileData) {
    if (profileData) {
      profile = profileData.profile;
    }

    if (!profile) {
      debug("Profile for " + id.name + " is " + JSON.stringify(profile));
      debug("Instantiating profile for " + id.name);
      needProfileUpdate = true;
      profile = {
        type: '@Person',
        account: [],
        apps: {}
      };
    }

    if (profile.apps === null || profile.apps === undefined) {
      needProfileUpdate = true;
      debug("Adding multi-reader Gaia links to profile for " + id.name);
      profile.apps = {};
    }

    var gaiaPrefix = "" + appGaiaConfig.url_prefix + appGaiaConfig.address + "/";

    if (!profile.apps.hasOwnProperty(appOrigin) || !profile.apps[appOrigin]) {
      needProfileUpdate = true;
      debug("Setting Gaia read URL " + gaiaPrefix + " for " + appOrigin + " " + ("in profile for " + id.name));
      profile.apps[appOrigin] = gaiaPrefix;
    } else if (!profile.apps[appOrigin].startsWith(gaiaPrefix)) {
      needProfileUpdate = true;
      debug("Overriding Gaia read URL for " + appOrigin + " from " + profile.apps[appOrigin] + " " + ("to " + gaiaPrefix + " in profile for " + id.name));
      profile.apps[appOrigin] = gaiaPrefix;
    }

    return {
      profile: profile,
      changed: needProfileUpdate
    };
  });
}

function updateProfileAPISettings(network, id, appGaiaConfig, profile) {
  var needProfileUpdate = false;
  var profilePromise = Promise.resolve().then(function () {
    if (profile === null || profile === undefined) {
      return nameLookup(network, id.name)["catch"](function (_e) {
        return null;
      });
    } else {
      return {
        profile: profile
      };
    }
  });
  return profilePromise.then(function (profileData) {
    if (profileData) {
      profile = profileData.profile;
    }

    if (!profile) {
      debug("Profile for " + id.name + " is " + JSON.stringify(profile));
      debug("Instantiating profile for " + id.name);
      needProfileUpdate = true;
      profile = {
        type: '@Person',
        account: [],
        api: {}
      };
    }

    if (profile.api === null || profile.api === undefined) {
      needProfileUpdate = true;
      debug("Adding API settings to profile for " + id.name);
      profile.api = {
        gaiaHubConfig: {
          url_prefix: appGaiaConfig.url_prefix
        },
        gaiaHubUrl: appGaiaConfig.server
      };
    }

    if (!profile.hasOwnProperty('api') || !profile.api.hasOwnProperty('gaiaHubConfig') || !profile.api.gaiaHubConfig.hasOwnProperty('url_prefix') || !profile.api.gaiaHubConfig.url_prefix || !profile.api.hasOwnProperty('gaiaHubUrl') || !profile.api.gaiaHubUrl) {
      debug("Existing profile for " + id.name + " is " + JSON.stringify(profile));
      debug("Updating API settings to profile for " + id.name);
      profile.api = {
        gaiaHubConfig: {
          url_prefix: appGaiaConfig.url_prefix
        },
        gaiaHubUrl: appGaiaConfig.server
      };
    }

    return {
      profile: profile,
      changed: needProfileUpdate
    };
  });
}

function handleSignIn(_x36, _x37, _x38, _x39, _x40, _x41) {
  return _handleSignIn.apply(this, arguments);
}

function _handleSignIn() {
  _handleSignIn = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee8(network, mnemonic, appGaiaHub, profileGaiaHub, req, res) {
    var authResponseQP, nameLookupUrl, errorMsg, errorStatusCode, authResponsePayload, id, profileUrl, appOrigin, redirectUri, scopes, authResponse, hubConfig, needProfileAPIUpdate, profileAPIUpdate, valid, authResponseToken, nonce, appPrivateKey, appHubConfig, newProfileData, profile, needProfileSigninUpdate, gaiaUrls, profileJWT, _profileJWT, appUri;

    return runtime_1.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            authResponseQP = req.query.authResponse;

            if (authResponseQP) {
              _context8.next = 3;
              break;
            }

            return _context8.abrupt("return", Promise.resolve().then(function () {
              sendJSON(res, {
                error: 'No authResponse given'
              }, 400);
            }));

          case 3:
            nameLookupUrl = network.legacyNetwork.blockstackAPIUrl + "/v1/names/";
            errorMsg = '';
            errorStatusCode = 400;
            needProfileAPIUpdate = false;
            _context8.prev = 7;
            _context8.next = 10;
            return verifyAuthResponse(authResponseQP, nameLookupUrl);

          case 10:
            valid = _context8.sent;

            if (valid) {
              _context8.next = 14;
              break;
            }

            errorMsg = "Unable to verify authResponse token " + authResponseQP;
            throw new Error(errorMsg);

          case 14:
            authResponseToken = decodeToken(authResponseQP);
            authResponsePayload = authResponseToken.payload;
            id = authResponsePayload.metadata.id;
            profileUrl = authResponsePayload.metadata.profileUrl;
            appOrigin = authResponsePayload.metadata.appOrigin;
            redirectUri = authResponsePayload.metadata.redirect_uri;
            scopes = authResponsePayload.metadata.scopes;
            nonce = authResponsePayload.metadata.nonce;

            if (!(nonce != authTransitNonce)) {
              _context8.next = 24;
              break;
            }

            throw new Error('Invalid auth response: not generated by this authenticator');

          case 24:
            _context8.next = 26;
            return getOwnerKeyInfo(network, mnemonic, id.index);

          case 26:
            id.privateKey = _context8.sent.privateKey;
            _context8.next = 29;
            return getAppPrivateKey(network, mnemonic, id, appOrigin);

          case 29:
            appPrivateKey = _context8.sent;
            authResponsePayload.metadata = {
              profileUrl: profileUrl
            };
            authResponse = new TokenSigner('ES256K', id.privateKey).sign(authResponsePayload);
            debug("App " + appOrigin + " requests scopes " + JSON.stringify(scopes));
            _context8.next = 35;
            return gaiaConnect(network, appGaiaHub, appPrivateKey);

          case 35:
            appHubConfig = _context8.sent;
            hubConfig = appHubConfig;
            _context8.next = 39;
            return updateProfileAPISettings(network, id, hubConfig);

          case 39:
            newProfileData = _context8.sent;
            needProfileAPIUpdate = newProfileData.changed;
            profileAPIUpdate = newProfileData.profile;
            _context8.next = 44;
            return updateProfileApps(network, id, appOrigin, hubConfig, profileAPIUpdate);

          case 44:
            newProfileData = _context8.sent;
            profile = newProfileData.profile;
            needProfileSigninUpdate = newProfileData.changed && scopes.includes('store_write');
            debug("Resulting profile for " + id.name + " is " + JSON.stringify(profile));

            if (!needProfileSigninUpdate) {
              _context8.next = 56;
              break;
            }

            debug("Upload new profile with new sign-in data to " + profileGaiaHub);
            profileJWT = makeProfileJWT(profile, id.privateKey);
            _context8.next = 53;
            return gaiaUploadProfileAll(network, [profileGaiaHub], profileJWT, id.privateKey, id.name);

          case 53:
            gaiaUrls = _context8.sent;
            _context8.next = 66;
            break;

          case 56:
            if (!needProfileAPIUpdate) {
              _context8.next = 64;
              break;
            }

            debug("Upload new profile with new API settings to " + profileGaiaHub);
            _profileJWT = makeProfileJWT(profileAPIUpdate, id.privateKey);
            _context8.next = 61;
            return gaiaUploadProfileAll(network, [profileGaiaHub], _profileJWT, id.privateKey, id.name);

          case 61:
            gaiaUrls = _context8.sent;
            _context8.next = 66;
            break;

          case 64:
            debug("Gaia read URL for " + appOrigin + " is " + profile.apps[appOrigin]);
            gaiaUrls = {
              dataUrls: [],
              error: null
            };

          case 66:
            if (!(gaiaUrls.hasOwnProperty('error') && gaiaUrls.error)) {
              _context8.next = 70;
              break;
            }

            errorMsg = "Failed to upload new profile: " + gaiaUrls.error;
            errorStatusCode = 502;
            throw new Error(errorMsg);

          case 70:
            debug("Handled sign-in to " + appOrigin + " using " + id.name);
            appUri = updateQueryStringParameter(redirectUri, 'authResponse', authResponse);
            info("Redirect to " + appUri);
            res.writeHead(302, {
              Location: appUri
            });
            res.end();
            _context8.next = 82;
            break;

          case 77:
            _context8.prev = 77;
            _context8.t0 = _context8["catch"](7);
            error(_context8.t0);
            error(errorMsg);
            sendJSON(res, {
              error: "Unable to process signin request: " + errorMsg
            }, errorStatusCode);

          case 82:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[7, 77]]);
  }));
  return _handleSignIn.apply(this, arguments);
}

export { SIGNIN_CSS, SIGNIN_DESC, SIGNIN_FMT_ID, SIGNIN_FMT_NAME, SIGNIN_FOOTER, SIGNIN_HEADER, SIGNIN_SCOPES, handleAuth, handleSignIn, loadNamedIdentities };
//# sourceMappingURL=auth.esm.js.map
