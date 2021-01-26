"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startAsync = exports.printServerInfo = void 0;

function _xdl() {
  const data = require("@expo/xdl");

  _xdl = function () {
    return data;
  };

  return data;
}

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function () {
    return data;
  };

  return data;
}

function _openBrowser() {
  const data = _interopRequireDefault(require("react-dev-utils/openBrowser"));

  _openBrowser = function () {
    return data;
  };

  return data;
}

function _readline() {
  const data = _interopRequireDefault(require("readline"));

  _readline = function () {
    return data;
  };

  return data;
}

function _wordwrap() {
  const data = _interopRequireDefault(require("wordwrap"));

  _wordwrap = function () {
    return data;
  };

  return data;
}

function _accounts() {
  const data = require("../../accounts");

  _accounts = function () {
    return data;
  };

  return data;
}

function _log() {
  const data = _interopRequireDefault(require("../../log"));

  _log = function () {
    return data;
  };

  return data;
}

function _urlOpts() {
  const data = _interopRequireDefault(require("../../urlOpts"));

  _urlOpts = function () {
    return data;
  };

  return data;
}

function _EditorUtils() {
  const data = require("../utils/EditorUtils");

  _EditorUtils = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CTRL_C = '\u0003';
const CTRL_D = '\u0004';
const CTRL_L = '\u000C';

const {
  bold: b,
  italic: i,
  underline: u
} = _chalk().default;

const clearConsole = () => {
  process.stdout.write(process.platform === 'win32' ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H');
};

const printHelp = () => {
  const PLATFORM_TAG = _xdl().ProjectUtils.getPlatformTag('Expo');

  _log().default.newLine();

  _log().default.nested(`${PLATFORM_TAG} Press ${b('?')} to show a list of all available commands.`);
};

const div = _chalk().default.dim(`|`);

const printUsage = async (projectDir, options = {}) => {
  const {
    dev
  } = await _xdl().ProjectSettings.readAsync(projectDir);
  const openDevToolsAtStartup = await _xdl().UserSettings.getAsync('openDevToolsAtStartup', true);
  const devMode = dev ? 'development' : 'production';
  const currentToggle = openDevToolsAtStartup ? 'enabled' : 'disabled';
  const isMac = process.platform === 'darwin';
  const ui = [[], ['a', `open Android`], ['shift+a', `select a device or emulator`], isMac && ['i', `open iOS simulator`], isMac && ['shift+i', `select a simulator`], ['w', `open web`], [], ['o', `open project code in your editor`], ['c', `show project QR`], ['p', `toggle build mode`, devMode], ['r', `restart bundler`], ['shift+r', `restart and clear cache`], [], ['d', `open Expo DevTools`], ['shift+d', `toggle auto opening DevTools on startup`, currentToggle], !options.webOnly && ['e', `share the app link by email`]];

  _log().default.nested(ui.filter(Boolean) // @ts-ignore: filter doesn't work
  .map(([key, message, status]) => {
    if (!key) return '';
    let view = ` \u203A `;
    if (key.length === 1) view += 'Press ';
    view += `${b(key)} ${div} `;
    view += message; // let view = ` \u203A Press ${b(key)} ${div} ${message}`;

    if (status) {
      view += ` ${_chalk().default.dim(`(${i(status)})`)}`;
    }

    return view;
  }).join('\n'));
};

const printServerInfo = async (projectDir, options = {}) => {
  if (options.webOnly) {
    _xdl().Webpack.printConnectionInstructions(projectDir);

    printHelp();
    return;
  }

  const url = await _xdl().UrlUtils.constructManifestUrlAsync(projectDir);

  _log().default.newLine();

  _log().default.nested(`  ${u(url)}`);

  _log().default.newLine();

  _urlOpts().default.printQRCode(url);

  const wrap = (0, _wordwrap().default)(2, process.stdout.columns || 80);
  const wrapItem = (0, _wordwrap().default)(4, process.stdout.columns || 80);

  const item = text => '  \u2022 ' + wrapItem(text).trimStart();

  const iosInfo = process.platform === 'darwin' ? `, or ${b('i')} for iOS simulator` : '';
  const webInfo = `${b`w`} to run on ${u`w`}eb`;

  _log().default.nested(wrap(u('To run the app with live reloading, choose one of:')));

  _log().default.nested(item(`Scan the QR code above with the Expo app (Android) or the Camera app (iOS).`));

  _log().default.nested(item(`Press ${b`a`} for Android emulator${iosInfo}, or ${webInfo}.`));

  _log().default.nested(item(`Press ${b`e`} to send a link to your phone with email.`));

  _xdl().Webpack.printConnectionInstructions(projectDir);

  printHelp();
};

exports.printServerInfo = printServerInfo;

const startAsync = async (projectRoot, options) => {
  const {
    stdin
  } = process;

  const startWaitingForCommand = () => {
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    stdin.on('data', handleKeypress);
  };

  const stopWaitingForCommand = () => {
    stdin.removeListener('data', handleKeypress);
    stdin.setRawMode(false);
    stdin.resume();
  };

  startWaitingForCommand();

  _xdl().Prompts.addInteractionListener(({
    pause
  }) => {
    if (pause) {
      stopWaitingForCommand();
    } else {
      startWaitingForCommand();
    }
  });

  _xdl().UserManager.setInteractiveAuthenticationCallback(async () => {
    stopWaitingForCommand();

    try {
      return await (0, _accounts().loginOrRegisterIfLoggedOutAsync)();
    } finally {
      startWaitingForCommand();
    }
  });

  await printServerInfo(projectRoot, options);

  async function handleKeypress(key) {
    if (options.webOnly) {
      switch (key) {
        case 'A':
        case 'a':
          clearConsole();
          (0, _log().default)('Opening the web project in Chrome on Android...');
          await _xdl().Android.openWebProjectAsync({
            projectRoot,
            shouldPrompt: !options.nonInteractive && key === 'A'
          });
          printHelp();
          break;

        case 'i':
        case 'I':
          clearConsole();
          (0, _log().default)('Opening the web project in Safari on iOS...');
          await _xdl().Simulator.openWebProjectAsync({
            projectRoot,
            shouldPrompt: !options.nonInteractive && key === 'I' // note(brentvatne): temporarily remove logic for picking the
            // simulator until we have parity for Android. this also ensures that we
            // don't interfere with the default user flow until more users have tested
            // this out.
            //
            // If no simulator is booted, then prompt which simulator to use.
            // (key === 'I' || !(await Simulator.isSimulatorBootedAsync())),

          });
          printHelp();
          break;

        case 'e':
          (0, _log().default)(_chalk().default.red` \u203A Sending a URL is not supported in web-only mode`);
          break;
      }
    } else {
      switch (key) {
        case 'A':
          clearConsole();
          await _xdl().Android.openProjectAsync({
            projectRoot,
            shouldPrompt: true
          });
          printHelp();
          break;

        case 'a':
          {
            clearConsole();
            (0, _log().default)('Opening on Android...');
            await _xdl().Android.openProjectAsync({
              projectRoot
            });
            printHelp();
            break;
          }

        case 'I':
          clearConsole();
          await _xdl().Simulator.openProjectAsync({
            projectRoot,
            shouldPrompt: true
          });
          printHelp();
          break;

        case 'i':
          {
            clearConsole(); // note(brentvatne): temporarily remove logic for picking the
            // simulator until we have parity for Android. this also ensures that we
            // don't interfere with the default user flow until more users have tested
            // this out.
            //
            // If no simulator is booted, then prompt for which simulator to use.
            // const shouldPrompt =
            //   !options.nonInteractive && (key === 'I' || !(await Simulator.isSimulatorBootedAsync()));

            (0, _log().default)('Opening on iOS...');
            await _xdl().Simulator.openProjectAsync({
              projectRoot,
              shouldPrompt: false
            });
            printHelp();
            break;
          }

        case 'e':
          {
            stopWaitingForCommand();
            const lanAddress = await _xdl().UrlUtils.constructManifestUrlAsync(projectRoot, {
              hostType: 'lan'
            });
            const defaultRecipient = await _xdl().UserSettings.getAsync('sendTo', null);

            const rl = _readline().default.createInterface({
              input: process.stdin,
              output: process.stdout
            });

            const handleKeypress = (chr, key) => {
              if (key && key.name === 'escape') {
                cleanup();
                cancel();
              }
            };

            const cleanup = () => {
              rl.close();
              process.stdin.removeListener('keypress', handleKeypress);
              startWaitingForCommand();
            };

            const cancel = async () => {
              clearConsole();
              printHelp();
            };

            clearConsole();
            process.stdin.addListener('keypress', handleKeypress);
            (0, _log().default)('Please enter your email address (press ESC to cancel) ');
            rl.question(defaultRecipient ? `[default: ${defaultRecipient}]> ` : '> ', async sendTo => {
              cleanup();

              if (!sendTo && defaultRecipient) {
                sendTo = defaultRecipient;
              }

              sendTo = sendTo && sendTo.trim();

              if (!sendTo) {
                cancel();
                return;
              }

              (0, _log().default)(`Sending ${lanAddress} to ${sendTo}...`);
              let sent = false;

              try {
                await _xdl().Exp.sendAsync(sendTo, lanAddress);
                sent = true;
                (0, _log().default)(`Sent link successfully.`);
              } catch (err) {
                (0, _log().default)(`Could not send link. ${err}`);
              }

              printHelp();

              if (sent) {
                await _xdl().UserSettings.setAsync('sendTo', sendTo);
              }
            });
            break;
          }
      }
    }

    switch (key) {
      case CTRL_C:
      case CTRL_D:
        {
          // @ts-ignore: Argument of type '"SIGINT"' is not assignable to parameter of type '"disconnect"'.
          process.emit('SIGINT');
          break;
        }

      case CTRL_L:
        {
          clearConsole();
          break;
        }

      case '?':
        {
          await printUsage(projectRoot, options);
          break;
        }

      case 'w':
        {
          clearConsole();
          (0, _log().default)('Attempting to open the project in a web browser...');
          await _xdl().Webpack.openAsync(projectRoot);
          await printServerInfo(projectRoot, options);
          break;
        }

      case 'c':
        {
          clearConsole();
          await printServerInfo(projectRoot, options);
          break;
        }

      case 'd':
        {
          const {
            devToolsPort
          } = await _xdl().ProjectSettings.readPackagerInfoAsync(projectRoot);
          (0, _log().default)('Opening DevTools in the browser...');
          (0, _openBrowser().default)(`http://localhost:${devToolsPort}`);
          printHelp();
          break;
        }

      case 'D':
        {
          clearConsole();
          const enabled = !(await _xdl().UserSettings.getAsync('openDevToolsAtStartup', true));
          await _xdl().UserSettings.setAsync('openDevToolsAtStartup', enabled);
          (0, _log().default)(`Automatically opening DevTools ${b(enabled ? 'enabled' : 'disabled')}.\nPress ${b`d`} to open DevTools now.`);
          printHelp();
          break;
        }

      case 'p':
        {
          clearConsole();
          const projectSettings = await _xdl().ProjectSettings.readAsync(projectRoot);
          const dev = !projectSettings.dev;
          await _xdl().ProjectSettings.setAsync(projectRoot, {
            dev,
            minify: !dev
          });
          (0, _log().default)(`Metro bundler is now running in ${_chalk().default.bold(dev ? 'development' : 'production')}${_chalk().default.reset(` mode.`)}
Please reload the project in the Expo app for the change to take effect.`);
          printHelp();
          break;
        }

      case 'r':
      case 'R':
        {
          clearConsole();
          const reset = key === 'R';

          if (reset) {
            (0, _log().default)('Restarting Metro bundler and clearing cache...');
          } else {
            (0, _log().default)('Restarting Metro bundler...');
          }

          _xdl().Project.startAsync(projectRoot, { ...options,
            reset
          });

          break;
        }

      case 'o':
        (0, _log().default)('Trying to open the project in your editor...');
        await (0, _EditorUtils().startProjectInEditorAsync)(projectRoot);
    }
  }
};

exports.startAsync = startAsync;
//# sourceMappingURL=TerminalUI.js.map