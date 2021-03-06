"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _accounts() {
  const data = require("../accounts");

  _accounts = function () {
    return data;
  };

  return data;
}

function _default(program) {
  program.command('register').helpGroup('auth').description('Sign up for a new Expo account').asyncAction(() => (0, _accounts().register)());
}
//# sourceMappingURL=register.js.map