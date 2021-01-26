#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cli_1 = require("./cli");
exports.CLIMain = cli_1.CLIMain;
// implement just enough of window to be useful to blockstack.js.
// do this here, so we can be *sure* it's in RAM.
const localStorageRAM = {};
global['window'] = {
    location: {
        origin: 'localhost'
    },
    localStorage: {
        getItem: function (itemName) {
            return localStorageRAM[itemName];
        },
        setItem: function (itemName, itemValue) {
            localStorageRAM[itemName] = itemValue;
        },
        removeItem: function (itemName) {
            delete localStorageRAM[itemName];
        }
    }
};
global['localStorage'] = global['window'].localStorage;
require('.').CLIMain();
//# sourceMappingURL=index.js.map