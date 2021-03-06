"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AbortCommandError = exports.default = exports.ErrorCodes = void 0;

function _es6Error() {
  const data = _interopRequireDefault(require("es6-error"));

  _es6Error = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const ERROR_PREFIX = 'Error: ';
const ErrorCodes = {
  INVALID_PROJECT_DIR: 'INVALID_PROJECT_DIR',
  INVALID_PROJECT_NAME: 'INVALID_PROJECT_NAME',
  INVALID_PUBLIC_URL: 'INVALID_PUBLIC_URL',
  NOT_LOGGED_IN: 'NOT_LOGGED_IN',
  NON_INTERACTIVE: 'NON_INTERACTIVE',
  BAD_CHOICE: 'BAD_CHOICE',
  MISSING_PUBLIC_URL: 'MISSING_PUBLIC_URL',
  APPLE_DIST_CERTS_TOO_MANY_GENERATED_ERROR: 'APPLE_DIST_CERTS_TOO_MANY_GENERATED_ERROR',
  APPLE_PUSH_KEYS_TOO_MANY_GENERATED_ERROR: 'APPLE_PUSH_KEYS_TOO_MANY_GENERATED_ERROR',
  MISSING_SLUG: 'MISSING_SLUG',
  PROJECT_NOT_FOUND: 'PROJECT_NOT_FOUND'
};
exports.ErrorCodes = ErrorCodes;

class CommandError extends _es6Error().default {
  constructor(code, message = '') {
    // If e.toString() was called to get `message` we don't want it to look
    // like "Error: Error:".
    if (message.startsWith(ERROR_PREFIX)) {
      message = message.substring(ERROR_PREFIX.length);
    }

    super(message || code);

    _defineProperty(this, "code", void 0);

    _defineProperty(this, "isCommandError", void 0);

    this.code = code;
    this.isCommandError = true;
  }

}

exports.default = CommandError;

class AbortCommandError extends CommandError {
  constructor() {
    super('ABORTED', 'Interactive prompt was cancelled.');
  }

}

exports.AbortCommandError = AbortCommandError;
//# sourceMappingURL=CommandError.js.map