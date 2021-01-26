"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configureModule;

function _fsExtra() {
  const data = _interopRequireDefault(require("fs-extra"));

  _fsExtra = function () {
    return data;
  };

  return data;
}

function _klawSync() {
  const data = _interopRequireDefault(require("klaw-sync"));

  _klawSync = function () {
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

function _CommandError() {
  const data = _interopRequireDefault(require("../../CommandError"));

  _CommandError = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * prepares _Expo_ prefixes for specified name
 * @param name module name, e.g. JS package name
 * @param prefix prefix to prepare with, defaults to _Expo_
 * @returns tuple `[nameWithPrefix: string, nameWithoutPrefix: string]`
 */
const preparePrefixes = (name, prefix = 'Expo') => name.startsWith(prefix) ? [name, name.substr(prefix.length)] : [`${prefix}${name}`, name];

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};
/**
 * Removes specified files. If one file doesn't exist already, skips it
 * @param directoryPath directory containing files to remove
 * @param filenames array of filenames to remove
 */


async function removeFiles(directoryPath, filenames) {
  await Promise.all(filenames.map(filename => _fsExtra().default.remove(_path().default.resolve(directoryPath, filename))));
}
/**
 * Renames files names
 * @param directoryPath - directory that holds files to be renamed
 * @param extensions - array of extensions for files that would be renamed, must be provided with leading dot or empty for no extension, e.g. ['.html', '']
 * @param renamings - array of filenames and their replacers
 */


const renameFilesWithExtensions = async (directoryPath, extensions, renamings) => {
  await asyncForEach(renamings, async ({
    from,
    to
  }) => await asyncForEach(extensions, async extension => {
    const fromFilename = `${from}${extension}`;

    if (!_fsExtra().default.existsSync(_path().default.join(directoryPath, fromFilename))) {
      return;
    }

    const toFilename = `${to}${extension}`;
    await _fsExtra().default.rename(_path().default.join(directoryPath, fromFilename), _path().default.join(directoryPath, toFilename));
  }));
};
/**
 * Enters each file recursively in provided dir and replaces content by invoking provided callback function
 * @param directoryPath - root directory
 * @param replaceFunction - function that converts current content into something different
 */


const replaceContents = async (directoryPath, replaceFunction) => {
  await Promise.all((0, _klawSync().default)(directoryPath, {
    nodir: true
  }).map(file => replaceContent(file.path, replaceFunction)));
};
/**
 * Replaces content in file. Does nothing if the file doesn't exist
 * @param filePath - provided file
 * @param replaceFunction - function that converts current content into something different
 */


const replaceContent = async (filePath, replaceFunction) => {
  if (!_fsExtra().default.existsSync(filePath)) {
    return;
  }

  const content = await _fsExtra().default.readFile(filePath, 'utf8');
  const newContent = replaceFunction(content);

  if (newContent !== content) {
    await _fsExtra().default.writeFile(filePath, newContent);
  }
};
/**
 * Removes all empty subdirs up to and including dirPath
 * Recursively enters all subdirs and removes them if one is empty or cantained only empty subdirs
 * @param dirPath - directory path that is being inspected
 * @returns whether the given base directory and any empty subdirectories were deleted or not
 */


const removeUponEmptyOrOnlyEmptySubdirs = async dirPath => {
  const contents = await _fsExtra().default.readdir(dirPath);
  const results = await Promise.all(contents.map(async file => {
    const filePath = _path().default.join(dirPath, file);

    const fileStats = await _fsExtra().default.lstat(filePath);
    return fileStats.isDirectory() && (await removeUponEmptyOrOnlyEmptySubdirs(filePath));
  }));
  const isRemovable = results.reduce((acc, current) => acc && current, true);

  if (isRemovable) {
    await _fsExtra().default.remove(dirPath);
  }

  return isRemovable;
};
/**
 * Prepares iOS part, mainly by renaming all files and some template word in files
 * Versioning is done automatically based on package.json from JS/TS part
 * @param modulePath - module directory
 * @param configuration - naming configuration
 */


async function configureIOS(modulePath, {
  podName,
  jsPackageName,
  viewManager
}) {
  const iosPath = _path().default.join(modulePath, 'ios'); // remove ViewManager from template


  if (!viewManager) {
    await removeFiles(_path().default.join(iosPath, 'EXModuleTemplate'), [`EXModuleTemplateView.h`, `EXModuleTemplateView.m`, `EXModuleTemplateViewManager.h`, `EXModuleTemplateViewManager.m`]);
  }

  await renameFilesWithExtensions(_path().default.join(iosPath, 'EXModuleTemplate'), ['.h', '.m'], [{
    from: 'EXModuleTemplateModule',
    to: `${podName}Module`
  }, {
    from: 'EXModuleTemplateView',
    to: `${podName}View`
  }, {
    from: 'EXModuleTemplateViewManager',
    to: `${podName}ViewManager`
  }]);
  await renameFilesWithExtensions(iosPath, ['', '.podspec'], [{
    from: 'EXModuleTemplate',
    to: `${podName}`
  }]);
  await replaceContents(iosPath, singleFileContent => singleFileContent.replace(/EXModuleTemplate/g, podName).replace(/ExpoModuleTemplate/g, jsPackageName));
}
/**
 * Gets path to Android source base dir: android/src/main/[java|kotlin]
 * Defaults to Java path if both exist
 * @param androidPath path do module android/ directory
 * @param flavor package flavor e.g main, test. Defaults to main
 * @throws INVALID_TEMPLATE if none exist
 * @returns path to flavor source base directory
 */


function findAndroidSourceDir(androidPath, flavor = 'main') {
  const androidSrcPathBase = _path().default.join(androidPath, 'src', flavor);

  const javaExists = _fsExtra().default.pathExistsSync(_path().default.join(androidSrcPathBase, 'java'));

  const kotlinExists = _fsExtra().default.pathExistsSync(_path().default.join(androidSrcPathBase, 'kotlin'));

  if (!javaExists && !kotlinExists) {
    throw new (_CommandError().default)('INVALID_TEMPLATE', `Invalid template. Android source directory not found: ${androidSrcPathBase}/[java|kotlin]`);
  }

  return _path().default.join(androidSrcPathBase, javaExists ? 'java' : 'kotlin');
}
/**
 * Finds java package name based on directory structure
 * @param flavorSrcPath Path to source base directory: e.g. android/src/main/java
 * @returns java package name
 */


function findTemplateAndroidPackage(flavorSrcPath) {
  const srcFiles = (0, _klawSync().default)(flavorSrcPath, {
    filter: item => item.path.endsWith('.kt') || item.path.endsWith('.java'),
    nodir: true,
    traverseAll: true
  });

  if (srcFiles.length === 0) {
    throw new (_CommandError().default)('INVALID TEMPLATE', 'No Android source files found in the template');
  } // srcFiles[0] will always be at the most top-level of the package structure


  const packageDirNames = _path().default.relative(flavorSrcPath, srcFiles[0].path).split('/').slice(0, -1);

  if (packageDirNames.length === 0) {
    throw new (_CommandError().default)('INVALID TEMPLATE', 'Template Android sources must be within a package.');
  }

  return packageDirNames.join('.');
}
/**
 * Prepares Android part, mainly by renaming all files and template words in files
 * Sets all versions in Gradle to 1.0.0
 * @param modulePath - module directory
 * @param configuration - naming configuration
 */


async function configureAndroid(modulePath, {
  javaPackage,
  jsPackageName,
  viewManager
}) {
  const androidPath = _path().default.join(modulePath, 'android');

  const [, moduleName] = preparePrefixes(jsPackageName, 'Expo');
  const androidSrcPath = findAndroidSourceDir(androidPath);
  const templateJavaPackage = findTemplateAndroidPackage(androidSrcPath);

  const sourceFilesPath = _path().default.join(androidSrcPath, ...templateJavaPackage.split('.'));

  const destinationFilesPath = _path().default.join(androidSrcPath, ...javaPackage.split('.')); // remove ViewManager from template


  if (!viewManager) {
    removeFiles(sourceFilesPath, [`ModuleTemplateView.kt`, `ModuleTemplateViewManager.kt`]);
    replaceContent(_path().default.join(sourceFilesPath, 'ModuleTemplatePackage.kt'), packageContent => packageContent.replace(/(^\s+)+(^.*?){1}createViewManagers[\s\W\w]+?\}/m, '').replace(/^.*ViewManager$/, ''));
  }

  await _fsExtra().default.mkdirp(destinationFilesPath);
  await _fsExtra().default.copy(sourceFilesPath, destinationFilesPath); // Remove leaf directory content

  await _fsExtra().default.remove(sourceFilesPath); // Cleanup all empty subdirs up to template package root dir

  await removeUponEmptyOrOnlyEmptySubdirs(_path().default.join(androidSrcPath, templateJavaPackage.split('.')[0])); // prepare tests

  if (_fsExtra().default.existsSync(_path().default.resolve(androidPath, 'src', 'test'))) {
    const androidTestPath = findAndroidSourceDir(androidPath, 'test');
    const templateTestPackage = findTemplateAndroidPackage(androidTestPath);

    const testSourcePath = _path().default.join(androidTestPath, ...templateTestPackage.split('.'));

    const testDestinationPath = _path().default.join(androidTestPath, ...javaPackage.split('.'));

    await _fsExtra().default.mkdirp(testDestinationPath);
    await _fsExtra().default.copy(testSourcePath, testDestinationPath);
    await _fsExtra().default.remove(testSourcePath);
    await removeUponEmptyOrOnlyEmptySubdirs(_path().default.join(androidTestPath, templateTestPackage.split('.')[0]));
    await replaceContents(testDestinationPath, singleFileContent => singleFileContent.replace(new RegExp(templateTestPackage, 'g'), javaPackage));
    await renameFilesWithExtensions(testDestinationPath, ['.kt', '.java'], [{
      from: 'ModuleTemplateModuleTest',
      to: `${moduleName}ModuleTest`
    }]);
  } // Replace contents of destination files


  await replaceContents(androidPath, singleFileContent => singleFileContent.replace(new RegExp(templateJavaPackage, 'g'), javaPackage).replace(/ModuleTemplate/g, moduleName).replace(/ExpoModuleTemplate/g, jsPackageName));
  await replaceContent(_path().default.join(androidPath, 'build.gradle'), gradleContent => gradleContent.replace(/\bversion = ['"][\w.-]+['"]/, "version = '1.0.0'").replace(/versionCode \d+/, 'versionCode 1').replace(/versionName ['"][\w.-]+['"]/, "versionName '1.0.0'"));
  await renameFilesWithExtensions(destinationFilesPath, ['.kt', '.java'], [{
    from: 'ModuleTemplateModule',
    to: `${moduleName}Module`
  }, {
    from: 'ModuleTemplatePackage',
    to: `${moduleName}Package`
  }, {
    from: 'ModuleTemplateView',
    to: `${moduleName}View`
  }, {
    from: 'ModuleTemplateViewManager',
    to: `${moduleName}ViewManager`
  }]);
}
/**
 * Prepares TS part.
 * @param modulePath - module directory
 * @param configuration - naming configuration
 */


async function configureTS(modulePath, {
  jsPackageName,
  viewManager
}) {
  const [moduleNameWithExpoPrefix, moduleName] = preparePrefixes(jsPackageName);

  const tsPath = _path().default.join(modulePath, 'src'); // remove View Manager from template


  if (!viewManager) {
    await removeFiles(_path().default.join(tsPath), ['ExpoModuleTemplateView.tsx', 'ExpoModuleTemplateNativeView.ts', 'ExpoModuleTemplateNativeView.web.tsx']);
    await replaceContent(_path().default.join(tsPath, 'ModuleTemplate.ts'), fileContent => fileContent.replace(/(^\s+)+(^.*?){1}ExpoModuleTemplateView.*$/m, ''));
  }

  await renameFilesWithExtensions(_path().default.join(tsPath, '__tests__'), ['.ts'], [{
    from: 'ModuleTemplate-test',
    to: `${moduleName}-test`
  }]);
  await renameFilesWithExtensions(tsPath, ['.tsx', '.ts'], [{
    from: 'ExpoModuleTemplateView',
    to: `${moduleNameWithExpoPrefix}View`
  }, {
    from: 'ExpoModuleTemplateNativeView',
    to: `${moduleNameWithExpoPrefix}NativeView`
  }, {
    from: 'ExpoModuleTemplateNativeView.web',
    to: `${moduleNameWithExpoPrefix}NativeView.web`
  }, {
    from: 'ExpoModuleTemplate',
    to: moduleNameWithExpoPrefix
  }, {
    from: 'ExpoModuleTemplate.web',
    to: `${moduleNameWithExpoPrefix}.web`
  }, {
    from: 'ModuleTemplate',
    to: moduleName
  }, {
    from: 'ModuleTemplate.types',
    to: `${moduleName}.types`
  }]);
  await replaceContents(tsPath, singleFileContent => singleFileContent.replace(/ExpoModuleTemplate/g, moduleNameWithExpoPrefix).replace(/ModuleTemplate/g, moduleName));
}
/**
 * Prepares files for npm (package.json and README.md).
 * @param modulePath - module directory
 * @param configuration - naming configuration
 */


async function configureNPM(modulePath, {
  npmModuleName,
  podName,
  jsPackageName
}) {
  const [, moduleName] = preparePrefixes(jsPackageName);
  await replaceContent(_path().default.join(modulePath, 'package.json'), singleFileContent => singleFileContent.replace(/expo-module-template/g, npmModuleName).replace(/"version": "[\w.-]+"/, '"version": "1.0.0"').replace(/ExpoModuleTemplate/g, jsPackageName).replace(/ModuleTemplate/g, moduleName));
  await replaceContent(_path().default.join(modulePath, 'README.md'), readmeContent => readmeContent.replace(/expo-module-template/g, npmModuleName).replace(/ExpoModuleTemplate/g, jsPackageName).replace(/EXModuleTemplate/g, podName));
}
/**
 * Configures TS, Android and iOS parts of generated module mostly by applying provided renamings.
 * @param modulePath - module directory
 * @param configuration - naming configuration
 */


async function configureModule(newModulePath, configuration) {
  await configureNPM(newModulePath, configuration);
  await configureTS(newModulePath, configuration);
  await configureAndroid(newModulePath, configuration);
  await configureIOS(newModulePath, configuration);
}
//# sourceMappingURL=configureModule.js.map