"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadAsync = uploadAsync;
exports.UploadType = void 0;

function _xdl() {
  const data = require("@expo/xdl");

  _xdl = function () {
    return data;
  };

  return data;
}

function _fs() {
  const data = _interopRequireDefault(require("fs"));

  _fs = function () {
    return data;
  };

  return data;
}

function _got() {
  const data = _interopRequireDefault(require("got"));

  _got = function () {
    return data;
  };

  return data;
}

function _md5File() {
  const data = _interopRequireDefault(require("md5-file"));

  _md5File = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UploadType;
exports.UploadType = UploadType;

(function (UploadType) {
  UploadType["TURTLE_PROJECT_SOURCES"] = "turtle-project-sources";
  UploadType["SUBMISSION_APP_ARCHIVE"] = "submission-app-archive";
})(UploadType || (exports.UploadType = UploadType = {}));

async function uploadAsync(uploadType, path, handleProgressEvent) {
  const presignedPost = await obtainS3PresignedPostAsync(uploadType, path);
  return await uploadWithPresignedPostAsync(_fs().default.createReadStream(path), presignedPost, handleProgressEvent);
}

async function obtainS3PresignedPostAsync(uploadType, filePath) {
  const fileHash = await (0, _md5File().default)(filePath);
  const api = await getApiClientForUser();
  const {
    presignedUrl
  } = await api.postAsync('upload-sessions', {
    type: uploadType,
    checksum: fileHash
  });
  return presignedUrl;
}

async function uploadWithPresignedPostAsync(stream, presignedPost, handleProgressEvent) {
  const form = new (_xdl().FormData)();

  for (const [fieldKey, fieldValue] of Object.entries(presignedPost.fields)) {
    form.append(fieldKey, fieldValue);
  }

  form.append('file', stream);
  const formHeaders = form.getHeaders();

  let uploadPromise = _got().default.post(presignedPost.url, {
    body: form,
    headers: { ...formHeaders
    }
  });

  if (handleProgressEvent) {
    uploadPromise = uploadPromise.on('uploadProgress', handleProgressEvent);
  }

  const response = await uploadPromise;
  return String(response.headers.location);
}

async function getApiClientForUser() {
  const user = await _xdl().UserManager.ensureLoggedInAsync();
  return _xdl().ApiV2.clientForUser(user);
}
//# sourceMappingURL=uploads.js.map