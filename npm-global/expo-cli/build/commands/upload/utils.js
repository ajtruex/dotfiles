"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runFastlaneAsync = runFastlaneAsync;

function _xdl() {
  const data = require("@expo/xdl");

  _xdl = function () {
    return data;
  };

  return data;
}

const {
  spawnAsyncThrowError
} = _xdl().ExponentTools;

async function runFastlaneAsync(program, args, {
  appleId,
  appleIdPassword,
  appleTeamId,
  itcTeamId,
  companyName
}, pipeToLogger = false) {
  const pipeToLoggerOptions = pipeToLogger ? {
    pipeToLogger: {
      stdout: true
    }
  } : {
    stdio: [0, 1, 'pipe']
  };
  const fastlaneData = appleId && appleIdPassword ? {
    FASTLANE_USER: appleId,
    FASTLANE_PASSWORD: appleIdPassword,
    FASTLANE_DONT_STORE_PASSWORD: '1',
    FASTLANE_TEAM_ID: appleTeamId,
    ...(itcTeamId && {
      FASTLANE_ITC_TEAM_ID: itcTeamId
    }),
    ...(companyName && {
      PRODUCE_COMPANY_NAME: companyName
    })
  } : {};
  const env = { ...process.env,
    ...fastlaneData
  };
  const spawnOptions = { ...pipeToLoggerOptions,
    env
  };
  const {
    stderr
  } = await spawnAsyncThrowError(program, args, spawnOptions);
  const res = JSON.parse(stderr);

  if (res.result !== 'failure') {
    return res;
  } else {
    var _res$rawDump$message, _res$rawDump, _res$rawDump2;

    let message = res.reason !== 'Unknown reason' ? res.reason : (_res$rawDump$message = (_res$rawDump = res.rawDump) === null || _res$rawDump === void 0 ? void 0 : _res$rawDump.message) !== null && _res$rawDump$message !== void 0 ? _res$rawDump$message : 'Unknown error when running fastlane';
    message = `${message}${(res === null || res === void 0 ? void 0 : (_res$rawDump2 = res.rawDump) === null || _res$rawDump2 === void 0 ? void 0 : _res$rawDump2.backtrace) ? `\n${res.rawDump.backtrace.map(i => `    ${i}`).join('\n')}` : ''}`;
    throw new Error(message);
  }
}
//# sourceMappingURL=utils.js.map