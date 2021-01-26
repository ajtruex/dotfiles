"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = prompt;
exports.autoCompleteAsync = autoCompleteAsync;
exports.selectAsync = selectAsync;
exports.confirmAsync = confirmAsync;
exports.toggleConfirmAsync = toggleConfirmAsync;
Object.defineProperty(exports, "PromptType", {
  enumerable: true,
  get: function () {
    return _prompts().PromptType;
  }
});
Object.defineProperty(exports, "Question", {
  enumerable: true,
  get: function () {
    return _prompts().PromptObject;
  }
});

function _commander() {
  const data = _interopRequireDefault(require("commander"));

  _commander = function () {
    return data;
  };

  return data;
}

function _prompts() {
  const data = _interopRequireWildcard(require("prompts"));

  _prompts = function () {
    return data;
  };

  return data;
}

function _CommandError() {
  const data = _interopRequireWildcard(require("./CommandError"));

  _CommandError = function () {
    return data;
  };

  return data;
}

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function prompt(questions, {
  nonInteractiveHelp,
  ...options
} = {}) {
  questions = Array.isArray(questions) ? questions : [questions];

  if (_commander().default.nonInteractive && questions.length !== 0) {
    let message = `Input is required, but Expo CLI is in non-interactive mode.\n`;

    if (nonInteractiveHelp) {
      message += nonInteractiveHelp;
    } else {
      const question = questions[0];
      const questionMessage = typeof question.message === 'function' ? question.message(undefined, {}, question) : question.message;
      message += `Required input:\n${(questionMessage || '').trim().replace(/^/gm, '> ')}`;
    }

    throw new (_CommandError().default)('NON_INTERACTIVE', message);
  }

  return (0, _prompts().default)(questions, {
    onCancel() {
      throw new (_CommandError().AbortCommandError)();
    },

    ...options
  });
} // todo: replace this workaround, its still selectable by the cursor
// see: https://github.com/terkelg/prompts/issues/254


prompt.separator = title => ({
  title,
  disable: true,
  value: undefined
});

/**
 * Create an auto complete list that can be searched and cancelled.
 *
 * @param questions
 * @param options
 */
async function autoCompleteAsync(questions, options) {
  const {
    value
  } = await prompt({
    limit: 11,

    suggest(input, choices) {
      const regex = new RegExp(input, 'i');
      return choices.filter(choice => regex.test(choice.title));
    },

    ...questions,
    name: 'value',
    type: 'autocomplete'
  }, options);
  return value !== null && value !== void 0 ? value : null;
}
/**
 * Create a selection list that can be cancelled.
 *
 * @param questions
 * @param options
 */


async function selectAsync(questions, options) {
  const {
    value
  } = await prompt({
    limit: 11,
    ...questions,
    name: 'value',
    type: 'select'
  }, options);
  return value !== null && value !== void 0 ? value : null;
}
/**
 * Create a standard yes/no confirmation that can be cancelled.
 *
 * @param questions
 * @param options
 */


async function confirmAsync(questions, options) {
  const {
    value
  } = await prompt({
    initial: true,
    ...questions,
    name: 'value',
    type: 'confirm'
  }, options);
  return value !== null && value !== void 0 ? value : null;
}
/**
 * Create a more dynamic yes/no confirmation that can be cancelled.
 *
 * @param questions
 * @param options
 */


async function toggleConfirmAsync(questions, options) {
  const {
    value
  } = await prompt({
    active: 'yes',
    inactive: 'no',
    ...questions,
    name: 'value',
    type: 'toggle'
  }, options);
  return value !== null && value !== void 0 ? value : null;
}
//# sourceMappingURL=prompts.js.map