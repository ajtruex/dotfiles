"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Platform", {
  enumerable: true,
  get: function () {
    return _easBuildJob().Platform;
  }
});
exports.AnalyticsEvent = exports.BuildStatus = exports.BuildCommandPlatform = void 0;

function _easBuildJob() {
  const data = require("@expo/eas-build-job");

  _easBuildJob = function () {
    return data;
  };

  return data;
}

let BuildCommandPlatform;
exports.BuildCommandPlatform = BuildCommandPlatform;

(function (BuildCommandPlatform) {
  BuildCommandPlatform["ANDROID"] = "android";
  BuildCommandPlatform["IOS"] = "ios";
  BuildCommandPlatform["ALL"] = "all";
})(BuildCommandPlatform || (exports.BuildCommandPlatform = BuildCommandPlatform = {}));

let BuildStatus;
exports.BuildStatus = BuildStatus;

(function (BuildStatus) {
  BuildStatus["IN_QUEUE"] = "in-queue";
  BuildStatus["IN_PROGRESS"] = "in-progress";
  BuildStatus["ERRORED"] = "errored";
  BuildStatus["FINISHED"] = "finished";
})(BuildStatus || (exports.BuildStatus = BuildStatus = {}));

let AnalyticsEvent;
exports.AnalyticsEvent = AnalyticsEvent;

(function (AnalyticsEvent) {
  AnalyticsEvent["BUILD_COMMAND"] = "builds cli build command";
  AnalyticsEvent["PROJECT_UPLOAD_SUCCESS"] = "builds cli project upload success";
  AnalyticsEvent["PROJECT_UPLOAD_FAIL"] = "builds cli project upload fail";
  AnalyticsEvent["GATHER_CREDENTIALS_SUCCESS"] = "builds cli gather credentials success";
  AnalyticsEvent["GATHER_CREDENTIALS_FAIL"] = "builds cli gather credentials fail";
  AnalyticsEvent["CONFIGURE_PROJECT_SUCCESS"] = "builds cli configure project success";
  AnalyticsEvent["CONFIGURE_PROJECT_FAIL"] = "builds cli configure project fail";
  AnalyticsEvent["BUILD_REQUEST_SUCCESS"] = "build cli build request success";
  AnalyticsEvent["BUILD_REQUEST_FAIL"] = "builds cli build request fail";
  AnalyticsEvent["BUILD_STATUS_COMMAND"] = "builds cli build status";
  AnalyticsEvent["CREDENTIALS_SYNC_COMMAND"] = "builds cli credentials sync command";
  AnalyticsEvent["CREDENTIALS_SYNC_UPDATE_LOCAL_SUCCESS"] = "builds cli credentials sync update local success";
  AnalyticsEvent["CREDENTIALS_SYNC_UPDATE_LOCAL_FAIL"] = "builds cli credentials sync update local fail";
  AnalyticsEvent["CREDENTIALS_SYNC_UPDATE_REMOTE_SUCCESS"] = "builds cli credentials sync update remote success";
  AnalyticsEvent["CREDENTIALS_SYNC_UPDATE_REMOTE_FAIL"] = "builds cli credentials sync update remote fail";
})(AnalyticsEvent || (exports.AnalyticsEvent = AnalyticsEvent = {}));
//# sourceMappingURL=types.js.map