"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.promptPublicUrlAsync = promptPublicUrlAsync;
exports.ensurePublicUrlAsync = ensurePublicUrlAsync;
exports.collectMergeSourceUrlsAsync = collectMergeSourceUrlsAsync;
exports.action = action;
exports.default = _default;

function _config() {
  const data = require("@expo/config");

  _config = function () {
    return data;
  };

  return data;
}

function _xdl() {
  const data = require("@expo/xdl");

  _xdl = function () {
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

function _crypto() {
  const data = _interopRequireDefault(require("crypto"));

  _crypto = function () {
    return data;
  };

  return data;
}

function _fsExtra() {
  const data = _interopRequireDefault(require("fs-extra"));

  _fsExtra = function () {
    return data;
  };

  return data;
}

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
    return data;
  };

  return data;
}

function _validator() {
  const data = _interopRequireDefault(require("validator"));

  _validator = function () {
    return data;
  };

  return data;
}

function _CommandError() {
  const data = _interopRequireDefault(require("../CommandError"));

  _CommandError = function () {
    return data;
  };

  return data;
}

function _log() {
  const data = _interopRequireDefault(require("../log"));

  _log = function () {
    return data;
  };

  return data;
}

function _prompts() {
  const data = _interopRequireDefault(require("../prompts"));

  _prompts = function () {
    return data;
  };

  return data;
}

function CreateApp() {
  const data = _interopRequireWildcard(require("./utils/CreateApp"));

  CreateApp = function () {
    return data;
  };

  return data;
}

function _Tar() {
  const data = require("./utils/Tar");

  _Tar = function () {
    return data;
  };

  return data;
}

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function promptPublicUrlAsync() {
  try {
    const {
      value
    } = await (0, _prompts().default)({
      type: 'text',
      name: 'value',
      validate: _xdl().UrlUtils.isHttps,
      message: `What is the public url that will host the static files?`
    });
    return value;
  } catch (_unused) {
    throw new (_CommandError().default)('MISSING_PUBLIC_URL', 'Missing required option: --public-url');
  }
}

async function ensurePublicUrlAsync(url, isDev) {
  if (!url) {
    if (_commander().default.nonInteractive) {
      throw new (_CommandError().default)('MISSING_PUBLIC_URL', 'Missing required option: --public-url');
    }

    url = await promptPublicUrlAsync();
  } // If we are not in dev mode, ensure that url is https


  if (!isDev && !_xdl().UrlUtils.isHttps(url)) {
    throw new (_CommandError().default)('INVALID_PUBLIC_URL', '--public-url must be a valid HTTPS URL.');
  } else if (!_validator().default.isURL(url, {
    protocols: ['http', 'https']
  })) {
    _log().default.nestedWarn(`Dev Mode: --public-url ${url} does not conform to the required HTTP(S) protocol.`);
  }

  return url;
} // TODO: We shouldn't need to wrap a method that is only used for one purpose.


async function exportFilesAsync(projectRoot, options) {
  var _options$target;

  // Make outputDir an absolute path if it isnt already
  const exportOptions = {
    dumpAssetmap: options.dumpAssetmap,
    dumpSourcemap: options.dumpSourcemap,
    isDev: options.dev,
    publishOptions: {
      resetCache: !!options.clear,
      target: (_options$target = options.target) !== null && _options$target !== void 0 ? _options$target : (0, _config().getDefaultTarget)(projectRoot)
    }
  };

  const absoluteOutputDir = _path().default.resolve(process.cwd(), options.outputDir);

  return await _xdl().Project.exportForAppHosting(projectRoot, options.publicUrl, options.assetUrl, absoluteOutputDir, exportOptions);
}

async function mergeSourceDirectoriresAsync(projectDir, mergeSrcDirs, options) {
  if (!mergeSrcDirs.length) {
    return;
  }

  const srcDirs = options.mergeSrcDir.concat(options.mergeSrcUrl).join(' ');

  _log().default.nested(`Starting project merge of ${srcDirs} into ${options.outputDir}`); // Merge app distributions


  await _xdl().Project.mergeAppDistributions(projectDir, [...mergeSrcDirs, options.outputDir], // merge stuff in srcDirs and outputDir together
  options.outputDir);

  _log().default.nested(`Project merge was successful. Your merged files can be found in ${options.outputDir}`);
}

async function collectMergeSourceUrlsAsync(projectDir, mergeSrcUrl) {
  // Merge src dirs/urls into a multimanifest if specified
  const mergeSrcDirs = []; // src urls were specified to merge in, so download and decompress them

  if (mergeSrcUrl.length > 0) {
    // delete .tmp if it exists and recreate it anew
    const tmpFolder = _path().default.resolve(projectDir, '.tmp');

    await _fsExtra().default.remove(tmpFolder);
    await _fsExtra().default.ensureDir(tmpFolder); // Download the urls into a tmp dir

    const downloadDecompressPromises = mergeSrcUrl.map(async url => {
      // Add the absolute paths to srcDir
      const uniqFilename = `${_path().default.basename(url, '.tar.gz')}_${_crypto().default.randomBytes(16).toString('hex')}`;

      const tmpFolderUncompressed = _path().default.resolve(tmpFolder, uniqFilename);

      await _fsExtra().default.ensureDir(tmpFolderUncompressed);
      await (0, _Tar().downloadAndDecompressAsync)(url, tmpFolderUncompressed); // add the decompressed folder to be merged

      mergeSrcDirs.push(tmpFolderUncompressed);
    });
    await Promise.all(downloadDecompressPromises);
  }

  return mergeSrcDirs;
}

function collect(val, memo) {
  memo.push(val);
  return memo;
}

async function action(projectDir, options) {
  // Ensure URL
  options.publicUrl = await ensurePublicUrlAsync(options.publicUrl, options.dev); // Ensure the output directory is created

  const outputPath = _path().default.resolve(projectDir, options.outputDir);

  await _fsExtra().default.ensureDir(outputPath); // Assert if the folder has contents

  if (!(await CreateApp().assertFolderEmptyAsync({
    projectRoot: outputPath,
    folderName: options.outputDir,
    overwrite: options.force
  }))) {
    _log().default.newLine();

    _log().default.nested(`Try using a new directory name with ${_log().default.chalk.bold('--output-dir')}, moving these files, or using ${_log().default.chalk.bold('--force')} to overwrite them.`);

    _log().default.newLine();

    process.exit(1);
  } // Wrap the XDL method for exporting assets


  await exportFilesAsync(projectDir, options); // Merge src dirs/urls into a multimanifest if specified

  const mergeSrcDirs = await collectMergeSourceUrlsAsync(projectDir, options.mergeSrcUrl); // add any local src dirs to be merged

  mergeSrcDirs.push(...options.mergeSrcDir);
  await mergeSourceDirectoriresAsync(projectDir, mergeSrcDirs, options);
  (0, _log().default)(`Export was successful. Your exported files can be found in ${options.outputDir}`);
}

function _default(program) {
  program.command('export [path]').description('Export the static files of the app for hosting it on a web server').helpGroup('core').option('-p, --public-url <url>', 'The public url that will host the static files. (Required)').option('--output-dir <dir>', 'The directory to export the static files to. Default directory is `dist`', 'dist').option('-a, --asset-url <url>', "The absolute or relative url that will host the asset files. Default is './assets', which will be resolved against the public-url.", './assets').option('-d, --dump-assetmap', 'Dump the asset map for further processing.').option('--dev', 'Configure static files for developing locally using a non-https server').option('-f, --force', 'Overwrite files in output directory without prompting for confirmation').option('-s, --dump-sourcemap', 'Dump the source map for debugging the JS bundle.').option('-q, --quiet', 'Suppress verbose output.').option('-t, --target [env]', 'Target environment for which this export is intended. Options are `managed` or `bare`.').option('--merge-src-dir [dir]', 'A repeatable source dir to merge in.', collect, []).option('--merge-src-url [url]', 'A repeatable source tar.gz file URL to merge in.', collect, []).option('--max-workers [num]', 'Maximum number of tasks to allow Metro to spawn.').asyncActionProjectDir(action, {
    checkConfig: true
  });
}
//# sourceMappingURL=export.js.map