"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateDistributionCertificate = validateDistributionCertificate;
exports.getDistCertFromParams = getDistCertFromParams;
exports.useDistCertFromParams = useDistCertFromParams;
exports.CreateOrReuseDistributionCert = exports.UseExistingDistributionCert = exports.UpdateIosDist = exports.RemoveIosDist = exports.CreateIosDist = void 0;

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

function _dateformat() {
  const data = _interopRequireDefault(require("dateformat"));

  _dateformat = function () {
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

function _ora() {
  const data = _interopRequireDefault(require("ora"));

  _ora = function () {
    return data;
  };

  return data;
}

function _terminalLink() {
  const data = _interopRequireDefault(require("terminal-link"));

  _terminalLink = function () {
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

function _appleApi() {
  const data = require("../../appleApi");

  _appleApi = function () {
    return data;
  };

  return data;
}

function _log() {
  const data = _interopRequireDefault(require("../../log"));

  _log = function () {
    return data;
  };

  return data;
}

function _prompt() {
  const data = _interopRequireDefault(require("../../prompt"));

  _prompt = function () {
    return data;
  };

  return data;
}

function _prompts() {
  const data = require("../../prompts");

  _prompts = function () {
    return data;
  };

  return data;
}

function _list() {
  const data = require("../actions/list");

  _list = function () {
    return data;
  };

  return data;
}

function _promptForCredentials() {
  const data = require("../actions/promptForCredentials");

  _promptForCredentials = function () {
    return data;
  };

  return data;
}

function _IosApi() {
  const data = require("../api/IosApi");

  _IosApi = function () {
    return data;
  };

  return data;
}

function _credentials() {
  const data = require("../credentials");

  _credentials = function () {
    return data;
  };

  return data;
}

function _IosProvisioningProfile() {
  const data = require("./IosProvisioningProfile");

  _IosProvisioningProfile = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const APPLE_DIST_CERTS_TOO_MANY_GENERATED_ERROR = `
You can have only ${_chalk().default.underline('three')} Apple Distribution Certificates generated on your Apple Developer account.
Please revoke the old ones or reuse existing from your other apps.
Please remember that Apple Distribution Certificates are not application specific!
`;

class CreateIosDist {
  constructor(accountName) {
    this.accountName = accountName;
  }

  async create(ctx) {
    const newDistCert = await this.provideOrGenerate(ctx);
    return await ctx.ios.createDistCert(this.accountName, newDistCert);
  }

  async open(ctx) {
    const distCert = await this.create(ctx);
    (0, _log().default)(_chalk().default.green('Successfully created Distribution Certificate\n'));
    (0, _list().displayIosUserCredentials)(distCert);
    (0, _log().default)();
    return null;
  }

  async provideOrGenerate(ctx) {
    if (!ctx.nonInteractive) {
      const userProvided = await promptForDistCert(ctx);

      if (userProvided) {
        const isValid = await validateDistributionCertificate(ctx, userProvided);
        return isValid ? userProvided : await this.provideOrGenerate(ctx);
      }
    }

    return await generateDistCert(ctx, this.accountName);
  }

}

exports.CreateIosDist = CreateIosDist;

class RemoveIosDist {
  constructor(accountName, shouldRevoke = false) {
    this.accountName = accountName;
    this.shouldRevoke = shouldRevoke;
  }

  async open(ctx) {
    const selected = await selectDistCertFromList(ctx, this.accountName);

    if (selected) {
      await this.removeSpecific(ctx, selected);
      (0, _log().default)(_chalk().default.green('Successfully removed Distribution Certificate\n'));
    }

    return null;
  }

  async removeSpecific(ctx, selected) {
    const credentials = await ctx.ios.getAllCredentials(this.accountName);
    const apps = credentials.appCredentials.filter(cred => cred.distCredentialsId === selected.id);
    const appsList = apps.map(appCred => _chalk().default.green(appCred.experienceName)).join(', ');

    if (appsList && !ctx.nonInteractive) {
      (0, _log().default)('Removing Distribution Certificate');
      const confirm = await (0, _prompts().confirmAsync)({
        message: `You are removing certificate used by ${appsList}. Do you want to continue?`
      });

      if (!confirm) {
        (0, _log().default)('Aborting');
        return;
      }
    }

    (0, _log().default)('Removing Distribution Certificate...\n');
    await ctx.ios.deleteDistCert(selected.id, this.accountName);
    let shouldRevoke = this.shouldRevoke;

    if (selected.certId) {
      if (!shouldRevoke && !ctx.nonInteractive) {
        const revoke = await (0, _prompts().confirmAsync)({
          message: `Do you also want to revoke it on Apple Developer Portal?`
        });
        shouldRevoke = revoke;
      }

      if (shouldRevoke) {
        await ctx.ensureAppleCtx();
        await new (_appleApi().DistCertManager)(ctx.appleCtx).revoke([selected.certId]);
      }
    }

    for (const appCredentials of apps) {
      const appLookupParams = (0, _IosApi().getAppLookupParams)(appCredentials.experienceName, appCredentials.bundleIdentifier);

      if (!(await ctx.ios.getProvisioningProfile(appLookupParams))) {
        continue;
      }

      (0, _log().default)(`Removing Provisioning Profile for ${appCredentials.experienceName} (${appCredentials.bundleIdentifier})`);
      const view = new (_IosProvisioningProfile().RemoveProvisioningProfile)(this.accountName, shouldRevoke);
      await view.removeSpecific(ctx, appLookupParams);
    }
  }

}

exports.RemoveIosDist = RemoveIosDist;

class UpdateIosDist {
  constructor(accountName) {
    this.accountName = accountName;
  }

  async open(ctx) {
    const selected = await selectDistCertFromList(ctx, this.accountName);

    if (selected) {
      await this.updateSpecific(ctx, selected);
      (0, _log().default)(_chalk().default.green('Successfully updated Distribution Certificate\n'));
      const credentials = await ctx.ios.getAllCredentials(this.accountName);
      const updated = credentials.userCredentials.find(i => i.id === selected.id);

      if (updated) {
        (0, _list().displayIosUserCredentials)(updated);
      }

      (0, _log().default)();
    }

    return null;
  }

  async updateSpecific(ctx, selected) {
    const credentials = await ctx.ios.getAllCredentials(this.accountName);
    const apps = credentials.appCredentials.filter(cred => cred.distCredentialsId === selected.id);
    const appsList = apps.map(appCred => _chalk().default.green(appCred.experienceName)).join(', ');

    if (apps.length > 1) {
      if (ctx.nonInteractive) {
        throw new (_CommandError().default)('NON_INTERACTIVE', `Start the CLI without the '--non-interactive' flag to update the certificate used by ${appsList}.`);
      }

      const confirm = await (0, _prompts().confirmAsync)({
        message: `You are updating certificate used by ${appsList}. Do you want to continue?`
      });

      if (!confirm) {
        (0, _log().default)('Aborting update process');
        return;
      }
    }

    const newDistCert = await this.provideOrGenerate(ctx);
    await ctx.ios.updateDistCert(selected.id, this.accountName, newDistCert);

    for (const appCredentials of apps) {
      (0, _log().default)(`Removing Provisioning Profile for ${appCredentials.experienceName} (${appCredentials.bundleIdentifier})`);
      const appLookupParams = (0, _IosApi().getAppLookupParams)(appCredentials.experienceName, appCredentials.bundleIdentifier);
      await new (_IosProvisioningProfile().RemoveProvisioningProfile)(this.accountName, true).removeSpecific(ctx, appLookupParams);
    }
  }

  async provideOrGenerate(ctx) {
    const userProvided = await promptForDistCert(ctx);

    if (userProvided) {
      const isValid = await validateDistributionCertificate(ctx, userProvided);
      return isValid ? userProvided : await this.provideOrGenerate(ctx);
    }

    return await generateDistCert(ctx, this.accountName);
  }

}

exports.UpdateIosDist = UpdateIosDist;

class UseExistingDistributionCert {
  constructor(app) {
    this.app = app;
  }

  async open(ctx) {
    const selected = await selectDistCertFromList(ctx, this.app.accountName, {
      filterInvalid: true
    });

    if (selected) {
      await ctx.ios.useDistCert(this.app, selected.id);
      (0, _log().default)(_chalk().default.green(`Successfully assigned Distribution Certificate to @${this.app.accountName}/${this.app.projectName} (${this.app.bundleIdentifier})`));
    }

    return null;
  }

}

exports.UseExistingDistributionCert = UseExistingDistributionCert;

class CreateOrReuseDistributionCert {
  constructor(app) {
    this.app = app;
  }

  async assignDistCert(ctx, userCredentialsId) {
    await ctx.ios.useDistCert(this.app, userCredentialsId);
    (0, _log().default)(_chalk().default.green(`Successfully assigned Distribution Certificate to @${this.app.accountName}/${this.app.projectName} (${this.app.bundleIdentifier})`));
  }

  async open(ctx) {
    if (!ctx.user) {
      throw new Error(`This workflow requires you to be logged in.`);
    }

    const existingCertificates = await getValidDistCerts((await ctx.ios.getAllCredentials(this.app.accountName)), ctx);

    if (existingCertificates.length === 0) {
      const distCert = await new CreateIosDist(this.app.accountName).create(ctx);
      await this.assignDistCert(ctx, distCert.id);
      return null;
    } // autoselect creds if we find valid certs


    const autoselectedCertificate = existingCertificates[0];

    if (!ctx.nonInteractive) {
      const confirm = await (0, _prompts().confirmAsync)({
        message: `${formatDistCert(autoselectedCertificate, (await ctx.ios.getAllCredentials(this.app.accountName)), 'VALID')} \n Would you like to use this certificate?`,
        limit: Infinity
      });

      if (!confirm) {
        return await this._createOrReuse(ctx);
      }
    } // Use autosuggested push key


    (0, _log().default)(`Using Distribution Certificate: ${autoselectedCertificate.certId || '-----'}`);
    await this.assignDistCert(ctx, autoselectedCertificate.id);
    return null;
  }

  async _createOrReuse(ctx) {
    const choices = [{
      name: '[Choose existing certificate] (Recommended)',
      value: 'CHOOSE_EXISTING'
    }, {
      name: '[Add a new certificate]',
      value: 'GENERATE'
    }];
    const question = {
      type: 'list',
      name: 'action',
      message: 'Select an iOS distribution certificate to use for code signing:',
      choices,
      pageSize: Infinity
    };
    const {
      action
    } = await (0, _prompt().default)(question);

    if (action === 'GENERATE') {
      const distCert = await new CreateIosDist(this.app.accountName).create(ctx);
      await this.assignDistCert(ctx, distCert.id);
      return null;
    } else if (action === 'CHOOSE_EXISTING') {
      return new UseExistingDistributionCert(this.app);
    }

    throw new Error('unsupported action');
  }

}

exports.CreateOrReuseDistributionCert = CreateOrReuseDistributionCert;

async function getValidDistCerts(iosCredentials, ctx) {
  const distCerts = iosCredentials.userCredentials.filter(cred => cred.type === 'dist-cert');

  if (!ctx.hasAppleCtx()) {
    (0, _log().default)(_chalk().default.yellow(`Unable to determine validity of Distribution Certificates.`));
    return distCerts;
  }

  const distCertManager = new (_appleApi().DistCertManager)(ctx.appleCtx);
  const certInfoFromApple = await distCertManager.list();
  const validCerts = await filterRevokedDistributionCerts(certInfoFromApple, distCerts);
  return sortByExpiryDesc(certInfoFromApple, validCerts);
}

function getValidityStatus(distCert, validDistCerts) {
  if (!validDistCerts) {
    return 'UNKNOWN';
  }

  return validDistCerts.includes(distCert) ? 'VALID' : 'INVALID';
}

async function selectDistCertFromList(ctx, accountName, options = {}) {
  const iosCredentials = await ctx.ios.getAllCredentials(accountName);
  let distCerts = iosCredentials.userCredentials.filter(cred => cred.type === 'dist-cert');
  let validDistCerts = null;

  if (ctx.hasAppleCtx()) {
    const distCertManager = new (_appleApi().DistCertManager)(ctx.appleCtx);
    const certInfoFromApple = await distCertManager.list();
    validDistCerts = await filterRevokedDistributionCerts(certInfoFromApple, distCerts);
  }

  distCerts = options.filterInvalid && validDistCerts ? validDistCerts : distCerts;

  if (distCerts.length === 0) {
    _log().default.warn('There are no Distribution Certificates available in your expo account');

    return null;
  }

  const question = {
    type: 'list',
    name: 'credentialsIndex',
    message: 'Select certificate from the list.',
    choices: distCerts.map((entry, index) => ({
      name: formatDistCert(entry, iosCredentials, getValidityStatus(entry, validDistCerts)),
      value: index
    }))
  };
  const {
    credentialsIndex
  } = await (0, _prompt().default)(question);
  return distCerts[credentialsIndex];
}

function formatDistCertFromApple(appleInfo, credentials) {
  const userCredentials = credentials.userCredentials.filter(cred => cred.type === 'dist-cert' && cred.certId === appleInfo.id);
  const appCredentials = userCredentials.length !== 0 ? credentials.appCredentials.filter(cred => cred.distCredentialsId === userCredentials[0].id) : [];
  const joinApps = appCredentials.map(i => `      ${i.experienceName} (${i.bundleIdentifier})`).join('\n');
  const usedByString = joinApps ? `    ${_chalk().default.gray(`used by\n${joinApps}`)}` : `    ${_chalk().default.gray(`not used by any apps`)}`;
  const {
    name,
    status,
    id,
    expires,
    created,
    ownerName,
    serialNumber
  } = appleInfo;
  const expiresDate = (0, _dateformat().default)(new Date(expires * 1000));
  const createdDate = (0, _dateformat().default)(new Date(created * 1000));
  return `${name} (${status}) - Cert ID: ${id}, Serial number: ${serialNumber}, Team ID: ${appleInfo.ownerId}, Team name: ${ownerName}
    expires: ${expiresDate}, created: ${createdDate}
  ${usedByString}`;
}

function formatDistCert(distCert, credentials, validityStatus = 'UNKNOWN') {
  const appCredentials = credentials.appCredentials.filter(cred => cred.distCredentialsId === distCert.id);
  const joinApps = appCredentials.map(i => `${i.experienceName} (${i.bundleIdentifier})`).join(', ');
  const usedByString = joinApps ? `\n    ${_chalk().default.gray(`used by ${joinApps}`)}` : `\n    ${_chalk().default.gray(`not used by any apps`)}`;
  let serialNumber = distCert.distCertSerialNumber;

  try {
    if (!serialNumber) {
      serialNumber = _xdl().IosCodeSigning.findP12CertSerialNumber(distCert.certP12, distCert.certPassword);
    }
  } catch (error) {
    serialNumber = _chalk().default.red('invalid serial number');
  }

  let validityText;

  if (validityStatus === 'VALID') {
    validityText = _chalk().default.gray("\n    ✅ Currently valid on Apple's servers.");
  } else if (validityStatus === 'INVALID') {
    validityText = _chalk().default.gray("\n    ❌ No longer valid on Apple's servers.");
  } else {
    validityText = _chalk().default.gray("\n    ❓ Validity of this certificate on Apple's servers is unknown.");
  }

  return `Distribution Certificate (Cert ID: ${distCert.certId || '-----'}, Serial number: ${serialNumber}, Team ID: ${distCert.teamId})${usedByString}${validityText}`;
}

async function generateDistCert(ctx, accountName) {
  await ctx.ensureAppleCtx();
  const manager = new (_appleApi().DistCertManager)(ctx.appleCtx);

  try {
    return await manager.create();
  } catch (e) {
    if (e.code === 'APPLE_DIST_CERTS_TOO_MANY_GENERATED_ERROR') {
      const certs = await manager.list();

      _log().default.warn('Maximum number of Distribution Certificates generated on Apple Developer Portal.');

      _log().default.warn(APPLE_DIST_CERTS_TOO_MANY_GENERATED_ERROR);

      if (ctx.nonInteractive) {
        throw new (_CommandError().default)('NON_INTERACTIVE', "Start the CLI without the '--non-interactive' flag to revoke existing certificates.");
      }

      const credentials = await ctx.ios.getAllCredentials(accountName);
      const usedByExpo = credentials.userCredentials.filter(cert => cert.type === 'dist-cert' && !!cert.certId).reduce((acc, cert) => ({ ...acc,
        [cert.certId || '']: cert
      }), {}); // https://docs.expo.io/distribution/app-signing/#summary

      const here = (0, _terminalLink().default)('here', 'https://bit.ly/3cfJJkQ');
      (0, _log().default)(_chalk().default.grey(`✅  Distribution Certificates can be revoked with no production side effects`));
      (0, _log().default)(_chalk().default.grey(`ℹ️  Learn more ${here}`));
      (0, _log().default)();
      const {
        revoke
      } = await (0, _prompt().default)([{
        type: 'checkbox',
        name: 'revoke',
        message: 'Select certificates to revoke.',
        choices: certs.map((cert, index) => ({
          value: index,
          name: formatDistCertFromApple(cert, credentials)
        })),
        pageSize: Infinity
      }]);

      for (const index of revoke) {
        const certInfo = certs[index];

        if (certInfo && usedByExpo[certInfo.id]) {
          await new RemoveIosDist(accountName, true).removeSpecific(ctx, usedByExpo[certInfo.id]);
        } else {
          await manager.revoke([certInfo.id]);
        }
      }
    } else {
      throw e;
    }
  }

  return await generateDistCert(ctx, accountName);
}

function _getRequiredQuestions(ctx) {
  const requiredQuestions = { ..._credentials().distCertSchema
  };

  if (ctx.hasAppleCtx() && requiredQuestions.required) {
    requiredQuestions.required = requiredQuestions.required.filter(q => q !== 'teamId');
  }

  return requiredQuestions;
}

function _ensureDistCert(ctx, partialCert) {
  if (ctx.hasAppleCtx()) {
    partialCert.teamId = ctx.appleCtx.team.id;
  }

  if (!(0, _appleApi().isDistCert)(partialCert)) {
    throw new Error(`Not of type DistCert: ${partialCert}`);
  }

  return partialCert;
}

async function promptForDistCert(ctx) {
  const requiredQuestions = _getRequiredQuestions(ctx);

  const userProvided = await (0, _promptForCredentials().askForUserProvided)(requiredQuestions);

  if (userProvided) {
    const distCert = _ensureDistCert(ctx, userProvided);

    return await _getDistCertWithSerial(distCert);
  } else {
    return null;
  }
}

async function _getDistCertWithSerial(distCert) {
  try {
    distCert.distCertSerialNumber = _xdl().IosCodeSigning.findP12CertSerialNumber(distCert.certP12, distCert.certPassword);
  } catch (error) {
    _log().default.warn('Unable to access certificate serial number.');

    _log().default.warn('Make sure that certificate and password are correct.');

    _log().default.warn(error);
  }

  return distCert;
}

async function validateDistributionCertificate(ctx, distributionCert) {
  if (!ctx.hasAppleCtx()) {
    _log().default.warn('Unable to validate distribution certificate due to insufficient Apple Credentials');

    return true;
  }

  const spinner = (0, _ora().default)(`Checking validity of distribution certificate on Apple Developer Portal...`).start();
  const distCertManager = new (_appleApi().DistCertManager)(ctx.appleCtx);
  const certInfoFromApple = await distCertManager.list();
  const validDistributionCerts = await filterRevokedDistributionCerts(certInfoFromApple, [distributionCert]);
  const isValidCert = validDistributionCerts.length > 0;

  if (isValidCert) {
    const successMsg = `Successfully validated Distribution Certificate against Apple Servers`;
    spinner.succeed(successMsg);
  } else {
    const failureMsg = `The Distribution Certificate is no longer valid on the Apple Developer Portal`;
    spinner.fail(failureMsg);
  }

  return isValidCert;
}

async function filterRevokedDistributionCerts(certInfoFromApple, distributionCerts) {
  if (distributionCerts.length === 0) {
    return [];
  } // if the credentials are valid, check it against apple to make sure it hasnt been revoked


  const validCertSerialsOnAppleServer = certInfoFromApple.filter( // remove expired certs
  cert => cert.expires > Math.floor(Date.now() / 1000)).map(cert => cert.serialNumber);
  const validDistributionCerts = distributionCerts.filter(cert => {
    const serialNumber = cert.distCertSerialNumber;

    if (!serialNumber) {
      return false;
    }

    return validCertSerialsOnAppleServer.includes(serialNumber);
  });
  return validDistributionCerts;
}

function sortByExpiryDesc(certInfoFromApple, distributionCerts) {
  return distributionCerts.sort((certA, certB) => {
    const certAInfo = certInfoFromApple.find(cert => cert.id === certA.certId);
    const certAExpiry = certAInfo ? certAInfo.expires : Number.NEGATIVE_INFINITY;
    const certBInfo = certInfoFromApple.find(cert => cert.id === certB.certId);
    const certBExpiry = certBInfo ? certBInfo.expires : Number.NEGATIVE_INFINITY;
    return certBExpiry - certAExpiry;
  });
}

async function getDistCertFromParams(builderOptions) {
  const {
    distP12Path,
    teamId
  } = builderOptions;
  const certPassword = process.env.EXPO_IOS_DIST_P12_PASSWORD; // none of the distCert params were set, assume user has no intention of passing it in

  if (!distP12Path && !certPassword) {
    return null;
  } // partial distCert params were set, assume user has intention of passing it in


  if (!(distP12Path && certPassword && teamId)) {
    throw new Error('In order to provide a Distribution Certificate through the CLI parameters, you have to pass --dist-p12-path parameter, --team-id parameter and set EXPO_IOS_DIST_P12_PASSWORD environment variable.');
  }

  const distCert = {
    certP12: await _fsExtra().default.readFile(distP12Path, 'base64'),
    teamId,
    certPassword
  };
  return await _getDistCertWithSerial(distCert);
}

async function useDistCertFromParams(ctx, app, distCert) {
  const isValid = await validateDistributionCertificate(ctx, distCert);

  if (!isValid) {
    throw new Error('Cannot validate uploaded Distribution Certificate');
  }

  const iosDistCredentials = await ctx.ios.createDistCert(app.accountName, distCert);
  await ctx.ios.useDistCert(app, iosDistCredentials.id);
  (0, _log().default)(_chalk().default.green(`Successfully assigned Distribution Certificate to @${app.accountName}/${app.projectName} (${app.bundleIdentifier})`));
  return iosDistCredentials;
}
//# sourceMappingURL=IosDistCert.js.map