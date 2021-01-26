"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Context = void 0;

function _config() {
  const data = require("@expo/config");

  _config = function () {
    return data;
  };

  return data;
}

function _xdl() {
  const data = require("@expo/xdl");

  _xdl = function () {
    return data;
  };

  return data;
}

function _pick() {
  const data = _interopRequireDefault(require("lodash/pick"));

  _pick = function () {
    return data;
  };

  return data;
}

function _appleApi() {
  const data = require("../appleApi");

  _appleApi = function () {
    return data;
  };

  return data;
}

function _log() {
  const data = _interopRequireDefault(require("../log"));

  _log = function () {
    return data;
  };

  return data;
}

function _AndroidApi() {
  const data = _interopRequireDefault(require("./api/AndroidApi"));

  _AndroidApi = function () {
    return data;
  };

  return data;
}

function _IosApi() {
  const data = _interopRequireDefault(require("./api/IosApi"));

  _IosApi = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Context {
  constructor() {
    _defineProperty(this, "_hasProjectContext", false);

    _defineProperty(this, "_projectDir", void 0);

    _defineProperty(this, "_user", void 0);

    _defineProperty(this, "_manifest", void 0);

    _defineProperty(this, "_apiClient", void 0);

    _defineProperty(this, "_iosApiClient", void 0);

    _defineProperty(this, "_androidApiClient", void 0);

    _defineProperty(this, "_appleCtxOptions", void 0);

    _defineProperty(this, "_appleCtx", void 0);

    _defineProperty(this, "_nonInteractive", void 0);
  }

  get nonInteractive() {
    return this._nonInteractive === true;
  }

  get user() {
    return this._user;
  }

  get hasProjectContext() {
    return this._hasProjectContext;
  }

  get projectDir() {
    return this._projectDir;
  }

  get manifest() {
    if (!this._manifest) {
      throw new Error('Manifest (app.json) not initialized.');
    }

    return this._manifest;
  }

  get api() {
    return this._apiClient;
  }

  get android() {
    return this._androidApiClient;
  }

  get ios() {
    return this._iosApiClient;
  }

  get appleCtx() {
    if (!this._appleCtx) {
      throw new Error('Apple context not initialized.');
    }

    return this._appleCtx;
  }

  set manifest(value) {
    this._manifest = value;
  }

  hasAppleCtx() {
    return !!this._appleCtx;
  }

  async ensureAppleCtx() {
    if (!this._appleCtx) {
      this._appleCtx = await (0, _appleApi().authenticate)(this._appleCtxOptions);
    }
  }

  logOwnerAndProject() {
    var _this$manifest$owner;

    // Figure out if User A is configuring credentials as admin for User B's project
    const isProxyUser = this.manifest.owner && this.manifest.owner !== this.user.username;
    (0, _log().default)(`Accessing credentials ${isProxyUser ? 'on behalf of' : 'for'} ${(_this$manifest$owner = this.manifest.owner) !== null && _this$manifest$owner !== void 0 ? _this$manifest$owner : this.user.username} in project ${this.manifest.slug}`);
  }

  async init(projectDir, options = {}) {
    if (options.allowAnonymous) {
      this._user = (await _xdl().UserManager.getCurrentUserAsync()) || undefined;
    } else {
      this._user = await _xdl().UserManager.ensureLoggedInAsync();
    }

    this._projectDir = projectDir;
    this._apiClient = _xdl().ApiV2.clientForUser(this.user);
    this._iosApiClient = new (_IosApi().default)(this.api);
    this._androidApiClient = new (_AndroidApi().default)(this.api);
    this._appleCtxOptions = (0, _pick().default)(options, ['appleId', 'appleIdPassword', 'teamId']);
    this._nonInteractive = options.nonInteractive; // try to acccess project context

    try {
      const {
        exp
      } = (0, _config().getConfig)(projectDir, {
        skipSDKVersionRequirement: true
      });
      this._manifest = exp;
      this._hasProjectContext = true;
      this.logOwnerAndProject();
    } catch (error) {// ignore error
      // startcredentials manager without project context
    }
  }

}

exports.Context = Context;
//# sourceMappingURL=context.js.map