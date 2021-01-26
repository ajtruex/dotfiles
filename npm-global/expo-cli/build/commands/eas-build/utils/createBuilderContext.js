"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createBuilderContext;

function createBuilderContext({
  platform,
  easConfig,
  commandCtx
}) {
  const buildProfile = easConfig.builds[platform];

  if (!buildProfile) {
    throw new Error(`${platform} build profile does not exist`);
  }

  const builderTrackingCtx = { ...commandCtx.trackingCtx,
    platform
  };
  return {
    commandCtx,
    trackingCtx: builderTrackingCtx,
    platform,
    buildProfile
  };
}
//# sourceMappingURL=createBuilderContext.js.map