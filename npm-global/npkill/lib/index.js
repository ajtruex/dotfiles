#!/usr/bin/env node
"use strict";
const tsConfig = require('./tsconfig.build.json');
const tsConfigPaths = require('tsconfig-paths');
const baseUrl = __dirname;
const cleanup = tsConfigPaths.register({
    baseUrl,
    paths: tsConfig.compilerOptions.paths,
});
require('./main');
