"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function () {
    return data;
  };

  return data;
}

function _commander() {
  const data = _interopRequireDefault(require("commander"));

  _commander = function () {
    return data;
  };

  return data;
}

function _terminalLink() {
  const data = _interopRequireDefault(require("terminal-link"));

  _terminalLink = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let _bundleProgressBar;

let _oraSpinner;

let _printNewLineBeforeNextLog = false;
let _isLastLineNewLine = false;

function _updateIsLastLineNewLine(args) {
  if (args.length === 0) {
    _isLastLineNewLine = true;
  } else {
    const lastArg = args[args.length - 1];

    if (typeof lastArg === 'string' && (lastArg === '' || lastArg.match(/[\r\n]$/))) {
      _isLastLineNewLine = true;
    } else {
      _isLastLineNewLine = false;
    }
  }
}

function _maybePrintNewLine() {
  if (_printNewLineBeforeNextLog) {
    _printNewLineBeforeNextLog = false;
    console.log(); // eslint-disable-line no-console
  }
}

function consoleLog(...args) {
  _maybePrintNewLine();

  _updateIsLastLineNewLine(args);

  console.log(...args); // eslint-disable-line no-console
}

function consoleWarn(...args) {
  _maybePrintNewLine();

  _updateIsLastLineNewLine(args);

  console.warn(...args); // eslint-disable-line no-console
}

function consoleError(...args) {
  _maybePrintNewLine();

  _updateIsLastLineNewLine(args);

  console.error(...args); // eslint-disable-line no-console
}

function respectProgressBars(commitLogs) {
  if (_bundleProgressBar) {
    _bundleProgressBar.terminate();

    _bundleProgressBar.lastDraw = '';
  }

  if (_oraSpinner) {
    _oraSpinner.stop();
  }

  commitLogs();

  if (_bundleProgressBar) {
    _bundleProgressBar.render();
  }

  if (_oraSpinner) {
    _oraSpinner.start();
  }
}

function getPrefix(chalkColor) {
  return chalkColor(`[${new Date().toTimeString().slice(0, 8)}]`);
}

function withPrefixAndTextColor(args, chalkColor = _chalk().default.gray) {
  if (_commander().default.nonInteractive) {
    return [getPrefix(chalkColor), ...args.map(arg => chalkColor(arg))];
  } else {
    return args.map(arg => chalkColor(arg));
  }
}

function withPrefix(args, chalkColor = _chalk().default.gray) {
  if (_commander().default.nonInteractive) {
    return [getPrefix(chalkColor), ...args];
  } else {
    return args;
  }
}

function log(...args) {
  respectProgressBars(() => {
    consoleLog(...withPrefix(args));
  });
}

log.nested = function (message) {
  respectProgressBars(() => {
    consoleLog(message);
  });
};

log.newLine = function newLine() {
  respectProgressBars(() => {
    consoleLog();
  });
};

log.addNewLineIfNone = function addNewLineIfNone() {
  if (!_isLastLineNewLine && !_printNewLineBeforeNextLog) {
    log.newLine();
  }
};

log.printNewLineBeforeNextLog = function printNewLineBeforeNextLog() {
  _printNewLineBeforeNextLog = true;
};

log.setBundleProgressBar = function setBundleProgressBar(bar) {
  _bundleProgressBar = bar;
};

log.setSpinner = function setSpinner(oraSpinner) {
  _oraSpinner = oraSpinner;

  if (_oraSpinner) {
    const originalStart = _oraSpinner.start.bind(_oraSpinner);

    _oraSpinner.start = text => {
      // Reset the new line tracker
      _isLastLineNewLine = false;
      return originalStart(text);
    }; // All other methods of stopping will invoke the stop method.


    const originalStop = _oraSpinner.stop.bind(_oraSpinner);

    _oraSpinner.stop = () => {
      // Reset the target spinner
      log.setSpinner(null);
      return originalStop();
    };
  }
};

log.error = function error(...args) {
  respectProgressBars(() => {
    consoleError(...withPrefixAndTextColor(args, _chalk().default.red));
  });
};

log.nestedError = function (message) {
  respectProgressBars(() => {
    consoleError(_chalk().default.red(message));
  });
};

log.warn = function warn(...args) {
  respectProgressBars(() => {
    consoleWarn(...withPrefixAndTextColor(args, _chalk().default.yellow));
  });
};

log.nestedWarn = function (message) {
  respectProgressBars(() => {
    consoleWarn(_chalk().default.yellow(message));
  });
};

log.gray = function (...args) {
  respectProgressBars(() => {
    consoleLog(...withPrefixAndTextColor(args));
  });
};

log.chalk = _chalk().default;
log.terminalLink = _terminalLink().default;
var _default = log;
exports.default = _default;
//# sourceMappingURL=log.js.map