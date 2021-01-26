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

function _indentString() {
  const data = _interopRequireDefault(require("indent-string"));

  _indentString = function () {
    return data;
  };

  return data;
}

function _qrcodeTerminal() {
  const data = _interopRequireDefault(require("qrcode-terminal"));

  _qrcodeTerminal = function () {
    return data;
  };

  return data;
}

function _CommandError() {
  const data = _interopRequireDefault(require("./CommandError"));

  _CommandError = function () {
    return data;
  };

  return data;
}

function _log() {
  const data = _interopRequireDefault(require("./log"));

  _log = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addOptions(program) {
  program.option('-a, --android', 'Opens your app in Expo client on a connected Android device').option('-i, --ios', 'Opens your app in Expo client in a currently running iOS simulator on your computer').option('-w, --web', 'Opens your app in a web browser').option('-m, --host [mode]', 'lan (default), tunnel, localhost. Type of host to use. "tunnel" allows you to view your link on other networks').option('--tunnel', 'Same as --host tunnel').option('--lan', 'Same as --host lan').option('--localhost', 'Same as --host localhost');
}

async function optsAsync(projectDir, options) {
  var opts = await _xdl().ProjectSettings.readAsync(projectDir);

  if ([options.host, options.lan, options.localhost, options.tunnel].filter(i => i).length > 1) {
    throw new (_CommandError().default)('BAD_ARGS', 'Specify at most one of --host, --tunnel, --lan, and --localhost');
  }

  opts.hostType = 'lan';

  if (options.offline) {
    // TODO: maybe let people know that we will force localhost with offline?
    _xdl().ConnectionStatus.setIsOffline(true);

    opts.hostType = 'localhost';
  }

  if (options.host) {
    opts.hostType = options.host;
  } else if (options.tunnel) {
    opts.hostType = 'tunnel';
  } else if (options.lan) {
    opts.hostType = 'lan';
  } else if (options.localhost) {
    opts.hostType = 'localhost';
  }

  await _xdl().ProjectSettings.setAsync(projectDir, opts);
  return opts;
}

function printQRCode(url) {
  _qrcodeTerminal().default.generate(url, code => (0, _log().default)(`${(0, _indentString().default)(code, 2)}\n`));
}

async function handleMobileOptsAsync(projectRoot, options) {
  await Promise.all([(async () => {
    if (options.android) {
      if (options.webOnly) {
        await _xdl().Android.openWebProjectAsync({
          projectRoot
        });
      } else {
        await _xdl().Android.openProjectAsync({
          projectRoot
        });
      }
    }
  })(), (async () => {
    if (options.ios) {
      if (options.webOnly) {
        await _xdl().Simulator.openWebProjectAsync({
          projectRoot,
          shouldPrompt: false
        });
      } else {
        await _xdl().Simulator.openProjectAsync({
          projectRoot,
          shouldPrompt: false
        });
      }
    }
  })(), (async () => {
    if (options.web) {
      await _xdl().Webpack.openAsync(projectRoot);
    }
  })()]);
  return !!options.android || !!options.ios;
}

var _default = {
  addOptions,
  handleMobileOptsAsync,
  printQRCode,
  optsAsync
};
exports.default = _default;
//# sourceMappingURL=urlOpts.js.map