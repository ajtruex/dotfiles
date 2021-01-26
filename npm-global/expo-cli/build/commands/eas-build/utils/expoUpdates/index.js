"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "configureUpdatesAndroidAsync", {
  enumerable: true,
  get: function () {
    return _android().configureUpdatesAndroidAsync;
  }
});
Object.defineProperty(exports, "setUpdatesVersionsAndroidAsync", {
  enumerable: true,
  get: function () {
    return _android().setUpdatesVersionsAndroidAsync;
  }
});
Object.defineProperty(exports, "configureUpdatesIOSAsync", {
  enumerable: true,
  get: function () {
    return _ios().configureUpdatesIOSAsync;
  }
});
Object.defineProperty(exports, "setUpdatesVersionsIOSAsync", {
  enumerable: true,
  get: function () {
    return _ios().setUpdatesVersionsIOSAsync;
  }
});

function _android() {
  const data = require("./android");

  _android = function () {
    return data;
  };

  return data;
}

function _ios() {
  const data = require("./ios");

  _ios = function () {
    return data;
  };

  return data;
}
//# sourceMappingURL=index.js.map