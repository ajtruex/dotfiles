"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generateBundleIdentifier;

function _base() {
  const data = require("base32.js");

  _base = function () {
    return data;
  };

  return data;
}

function _crypto() {
  const data = _interopRequireDefault(require("crypto"));

  _crypto = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-ignore: Not typed
function generateBundleIdentifier(teamId) {
  return `dev.expo.client.${base32(sha(teamId))}`;
}

function sha(data) {
  const hash = _crypto().default.createHash('sha224');

  return hash.update(data).digest();
}

function base32(buffer) {
  const encoder = new (_base().Encoder)({
    type: 'rfc4648',
    lc: true
    /* lowercase */

  });
  return encoder.write(buffer).finalize();
}
//# sourceMappingURL=generateBundleIdentifier.js.map