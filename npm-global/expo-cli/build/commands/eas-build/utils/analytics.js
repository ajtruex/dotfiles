"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _xdl() {
  const data = require("@expo/xdl");

  _xdl = function () {
    return data;
  };

  return data;
}

const packageJSON = require('../../../../package.json');

const client = new (_xdl().AnalyticsClient)();
client.setSegmentNodeKey(process.env.EXPO_LOCAL || process.env.EXPO_STAGING ? '9qenkcMBJllh4gXYSN4BfJjJNPT7PULm' : 'TbWjTSn84LrRhfVEAfS6PG1wQoSCUYGp');
client.setVersionName(packageJSON.version);
var _default = client;
exports.default = _default;
//# sourceMappingURL=analytics.js.map