"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collectMetadata = collectMetadata;

/**
 * We use require() to exclude package.json from TypeScript's analysis since it lives outside
 * the src directory and would change the directory structure of the emitted files
 * under the build directory
 */
const packageJSON = require('../../../../package.json');

async function collectMetadata(ctx, {
  credentialsSource
}) {
  return {
    appVersion: ctx.commandCtx.exp.version,
    cliVersion: packageJSON.version,
    workflow: ctx.buildProfile.workflow,
    credentialsSource,
    sdkVersion: ctx.commandCtx.exp.sdkVersion,
    trackingContext: ctx.trackingCtx,
    releaseChannel: ctx.buildProfile.releaseChannel
  };
}
//# sourceMappingURL=metadata.js.map