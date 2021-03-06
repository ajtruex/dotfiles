"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SetupIosDist = void 0;

function iosDistView() {
  const data = _interopRequireWildcard(require("./IosDistCert"));

  iosDistView = function () {
    return data;
  };

  return data;
}

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class SetupIosDist {
  constructor(app) {
    this.app = app;
  }

  async open(ctx) {
    if (!ctx.user) {
      throw new Error(`This workflow requires you to be logged in.`);
    }

    const configuredDistCert = await ctx.ios.getDistCert(this.app);

    if (configuredDistCert) {
      // we dont need to setup if we have a valid dist cert on file
      const isValid = await iosDistView().validateDistributionCertificate(ctx, configuredDistCert);

      if (isValid) {
        return null;
      }
    }

    return new (iosDistView().CreateOrReuseDistributionCert)(this.app);
  }

}

exports.SetupIosDist = SetupIosDist;
//# sourceMappingURL=SetupIosDist.js.map