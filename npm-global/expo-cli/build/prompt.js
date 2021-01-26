"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = prompt;
Object.defineProperty(exports, "ChoiceType", {
  enumerable: true,
  get: function () {
    return _inquirer().ChoiceType;
  }
});
Object.defineProperty(exports, "Question", {
  enumerable: true,
  get: function () {
    return _inquirer().Question;
  }
});

function _commander() {
  const data = _interopRequireDefault(require("commander"));

  _commander = function () {
    return data;
  };

  return data;
}

function _inquirer() {
  const data = _interopRequireWildcard(require("inquirer"));

  _inquirer = function () {
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

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @deprecated this prompt is now deprecated in favor of ./prompts */
function prompt(questions, {
  nonInteractiveHelp
} = {}) {
  questions = Array.isArray(questions) ? questions : [questions];
  const nAllQuestions = questions.length;

  if (_commander().default.nonInteractive) {
    const nQuestionsToAsk = questions.filter(question => {
      if (!('when' in question)) {
        return true;
      } else if (typeof question.when === 'function') {
        // if `when` is a function it takes object containing previous answers as argument
        // in this case we want to detect if any question will be asked, so it
        // always will be empty object
        return question.when({});
      } else {
        return question.when;
      }
    }).length;

    if (nAllQuestions === 0 || nQuestionsToAsk === 0) {
      return {};
    }

    let message = `Input is required, but Expo CLI is in non-interactive mode.\n`;

    if (nonInteractiveHelp) {
      message += nonInteractiveHelp;
    } else {
      const question = Array.isArray(questions) ? questions[0] : questions;
      message += `Required input:\n${(question.message || '').trim().replace(/^/gm, '> ')}`;
    }

    throw new (_CommandError().default)('NON_INTERACTIVE', message);
  }

  return _inquirer().default.prompt(questions);
}

prompt.separator = (...args) => new (_inquirer().default.Separator)(...args);
//# sourceMappingURL=prompt.js.map