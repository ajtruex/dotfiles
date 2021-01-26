"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _generateModuleAsync() {
  const data = _interopRequireDefault(require("./generate-module/generateModuleAsync"));

  _generateModuleAsync = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(program) {
  program.command('generate-module [path]').description('Generate a universal module for Expo from a template in the specified directory').helpGroup('internal').option('--template <TemplatePath>', 'Local directory or npm package containing template for universal Expo module').asyncAction(_generateModuleAsync().default);
}
//# sourceMappingURL=generate-module.js.map