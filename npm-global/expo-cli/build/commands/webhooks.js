"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.updateAsync = updateAsync;
exports.setupAsync = setupAsync;

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

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function () {
    return data;
  };

  return data;
}

function _cliTable() {
  const data = _interopRequireDefault(require("cli-table3"));

  _cliTable = function () {
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

function _invariant() {
  const data = _interopRequireDefault(require("invariant"));

  _invariant = function () {
    return data;
  };

  return data;
}

function _ora() {
  const data = _interopRequireDefault(require("ora"));

  _ora = function () {
    return data;
  };

  return data;
}

function _CommandError() {
  const data = _interopRequireWildcard(require("../CommandError"));

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

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SECRET_MIN_LENGTH = 16;
const SECRET_MAX_LENGTH = 1000;

function _default(program) {
  program.command('webhooks [path]').helpGroup('webhooks').description('List all webhooks for a project').asyncActionProjectDir(listAsync);
  program.command('webhooks:add [path]').helpGroup('webhooks').description('Add a webhook to a project').option('--url <url>', 'URL to request. (Required)').option('--event <event-type>', 'Event type that triggers the webhook. [build] (Required)').option('--secret <secret>', "Secret used to create a hash signature of the request payload, provided in the 'Expo-Signature' header.").asyncActionProjectDir(addAsync);
  program.command('webhooks:remove [path]').helpGroup('webhooks').option('--id <id>', 'ID of the webhook to remove.').description('Delete a webhook').asyncActionProjectDir(removeAsync);
  program.command('webhooks:update [path]').helpGroup('webhooks').description('Update an existing webhook').option('--id <id>', 'ID of the webhook to update.').option('--url [url]', 'URL the webhook will request.').option('--event [event-type]', 'Event type that triggers the webhook. [build]').option('--secret [secret]', "Secret used to create a hash signature of the request payload, provided in the 'Expo-Signature' header.").asyncActionProjectDir(updateAsync);
}

async function listAsync(projectRoot) {
  const {
    experienceName,
    project,
    client
  } = await setupAsync(projectRoot);
  const webhooks = await client.getAsync(`projects/${project.id}/webhooks`);

  if (webhooks.length) {
    const table = new (_cliTable().default)({
      head: ['Webhook ID', 'URL', 'Event']
    });
    table.push(...webhooks.map(hook => [hook.id, hook.url, hook.event]));
    (0, _log().default)(table.toString());
  } else {
    (0, _log().default)(`${_chalk().default.bold(experienceName)} has no webhooks.`);
    (0, _log().default)('Use `expo webhooks:add` to add one.');
  }
}

async function addAsync(projectRoot, {
  url,
  event,
  ...options
}) {
  (0, _invariant().default)(typeof url === 'string' && /^https?/.test(url), '--url: a HTTP URL is required');
  (0, _invariant().default)(typeof event === 'string', '--event: string is required');
  const secret = validateSecret(options) || generateSecret();
  const {
    experienceName,
    project,
    client
  } = await setupAsync(projectRoot);
  const spinner = (0, _ora().default)(`Adding webhook to ${experienceName}`).start();
  await client.postAsync(`projects/${project.id}/webhooks`, {
    url,
    event,
    secret
  });
  spinner.succeed();
}

async function updateAsync(projectRoot, {
  id,
  url,
  event,
  ...options
}) {
  var _event, _secret;

  (0, _invariant().default)(typeof id === 'string', '--id must be a webhook ID');
  (0, _invariant().default)(event == null || typeof event === 'string', '--event: string is required');
  let secret = validateSecret(options);
  const {
    project,
    client
  } = await setupAsync(projectRoot);
  const webhook = await client.getAsync(`projects/${project.id}/webhooks/${id}`);
  event = (_event = event) !== null && _event !== void 0 ? _event : webhook.event;
  secret = (_secret = secret) !== null && _secret !== void 0 ? _secret : webhook.secret;
  const spinner = (0, _ora().default)(`Updating webhook ${id}`).start();
  await client.patchAsync(`projects/${project.id}/webhooks/${id}`, {
    url,
    event,
    secret
  });
  spinner.succeed();
}

async function removeAsync(projectRoot, {
  id
}) {
  (0, _invariant().default)(typeof id === 'string', '--id must be a webhook ID');
  const {
    project,
    client
  } = await setupAsync(projectRoot);
  await client.deleteAsync(`projects/${project.id}/webhooks/${id}`);
}

function validateSecret({
  secret
}) {
  if (secret) {
    (0, _invariant().default)(secret.length >= SECRET_MIN_LENGTH && secret.length < SECRET_MAX_LENGTH, `--secret: should be ${SECRET_MIN_LENGTH}-${SECRET_MAX_LENGTH} characters long`);
    return secret;
  }

  return null;
}

function generateSecret() {
  // Create a 60 characters long secret from 30 random bytes.
  const randomSecret = _crypto().default.randomBytes(30).toString('hex');

  (0, _log().default)(_chalk().default.underline('Webhook signing secret:'));
  (0, _log().default)(randomSecret);
  return randomSecret;
}

async function setupAsync(projectRoot) {
  var _exp$owner;

  const {
    exp
  } = (0, _config().getConfig)(projectRoot, {
    skipSDKVersionRequirement: true
  });
  const {
    slug
  } = exp;

  if (!slug) {
    throw new (_CommandError().default)(_CommandError().ErrorCodes.MISSING_SLUG, `expo.slug is not defined in ${(0, _config().findConfigFile)(projectRoot).configName}`);
  }

  const user = await _xdl().UserManager.ensureLoggedInAsync();

  const client = _xdl().ApiV2.clientForUser(user);

  const experienceName = `@${(_exp$owner = exp.owner) !== null && _exp$owner !== void 0 ? _exp$owner : user.username}/${exp.slug}`;

  try {
    const projects = await client.getAsync('projects', {
      experienceName
    });

    if (projects.length === 0) {
      throw projectNotFoundError(experienceName);
    }

    const project = projects[0];
    return {
      experienceName,
      project,
      client
    };
  } catch (error) {
    if (error.code === 'EXPERIENCE_NOT_FOUND') {
      throw projectNotFoundError(experienceName);
    } else {
      throw error;
    }
  }
}

function projectNotFoundError(experienceName) {
  return new (_CommandError().default)(_CommandError().ErrorCodes.PROJECT_NOT_FOUND, `Project ${experienceName} not found. The project is created the first time you run \`expo publish\` or build the project (https://docs.expo.io/distribution/building-standalone-apps/).`);
}
//# sourceMappingURL=webhooks.js.map