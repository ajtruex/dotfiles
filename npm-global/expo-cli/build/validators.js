"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nonEmptyInput = nonEmptyInput;
exports.promptsExistingFile = exports.promptsNonEmptyInput = exports.existingFile = void 0;

function _fsExtra() {
  const data = _interopRequireDefault(require("fs-extra"));

  _fsExtra = function () {
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

function nonEmptyInput(val) {
  return val !== '';
}

const existingFile = async (filePath, verbose = true) => {
  try {
    const stats = await _fsExtra().default.stat(filePath);
    return stats.isFile();
  } catch (e) {
    if (verbose) {
      (0, _log().default)('\nFile does not exist.');
    }

    return false;
  }
}; // note(cedric): export prompts-compatible validators,
// refactor when prompt is replaced with prompts


exports.existingFile = existingFile;
const promptsNonEmptyInput = nonEmptyInput;
exports.promptsNonEmptyInput = promptsNonEmptyInput;

const promptsExistingFile = async filePath => {
  try {
    const stats = await _fsExtra().default.stat(filePath);

    if (stats.isFile()) {
      return true;
    }

    return 'Input is not a file.';
  } catch (_unused) {
    return 'File does not exist.';
  }
};

exports.promptsExistingFile = promptsExistingFile;
//# sourceMappingURL=validators.js.map