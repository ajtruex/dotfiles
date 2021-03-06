"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("commander");
const leven = require("leven");
const package_1 = require("./package");
const publish_1 = require("./publish");
const show_1 = require("./show");
const search_1 = require("./search");
const store_1 = require("./store");
const npm_1 = require("./npm");
const util_1 = require("./util");
const semver = require("semver");
const tty_1 = require("tty");
const pkg = require('../package.json');
function fatal(message, ...args) {
    if (message instanceof Error) {
        message = message.message;
        if (/^cancell?ed$/i.test(message)) {
            return;
        }
    }
    util_1.log.error(message, ...args);
    if (/Unauthorized\(401\)/.test(message)) {
        util_1.log.error(`Be sure to use a Personal Access Token which has access to **all accessible accounts**.
See https://code.visualstudio.com/api/working-with-extensions/publishing-extension#publishing-extensions for more information.`);
    }
    process.exit(1);
}
function main(task) {
    let latestVersion = null;
    const token = new util_1.CancellationToken();
    if (tty_1.isatty(1)) {
        npm_1.getLatestVersion(pkg.name, token)
            .then(version => latestVersion = version)
            .catch(_ => { });
    }
    task
        .catch(fatal)
        .then(() => {
        if (latestVersion && semver.gt(latestVersion, pkg.version)) {
            util_1.log.info(`\nThe latest version of ${pkg.name} is ${latestVersion} and you have ${pkg.version}.\nUpdate it now: npm install -g ${pkg.name}`);
        }
        else {
            token.cancel();
        }
    });
}
module.exports = function (argv) {
    program
        .version(pkg.version)
        .usage('<command> [options]');
    program
        .command('ls')
        .description('Lists all the files that will be published')
        .option('--yarn', 'Use yarn instead of npm')
        .option('--packagedDependencies <path>', 'Select packages that should be published only (includes dependencies)', (val, all) => all ? all.concat(val) : [val], undefined)
        .option('--ignoreFile [path]', 'Indicate alternative .vscodeignore')
        .action(({ yarn, packagedDependencies, ignoreFile }) => main(package_1.ls(undefined, yarn, packagedDependencies, ignoreFile)));
    program
        .command('package')
        .description('Packages an extension')
        .option('-o, --out [path]', 'Output .vsix extension file to [path] location')
        .option('--baseContentUrl [url]', 'Prepend all relative links in README.md with this url.')
        .option('--baseImagesUrl [url]', 'Prepend all relative image links in README.md with this url.')
        .option('--yarn', 'Use yarn instead of npm')
        .option('--ignoreFile [path]', 'Indicate alternative .vscodeignore')
        .option('--noGitHubIssueLinking', 'Prevent automatic expansion of GitHub-style issue syntax into links')
        .action(({ out, baseContentUrl, baseImagesUrl, yarn, ignoreFile, noGitHubIssueLinking }) => main(package_1.packageCommand({ packagePath: out, baseContentUrl, baseImagesUrl, useYarn: yarn, ignoreFile, expandGitHubIssueLinks: noGitHubIssueLinking })));
    program
        .command('publish [<version>]')
        .description('Publishes an extension')
        .option('-p, --pat <token>', 'Personal Access Token', process.env['VSCE_PAT'])
        .option('-m, --message <commit message>', 'Commit message used when calling `npm version`.')
        .option('--packagePath [path]', 'Publish the VSIX package located at the specified path.')
        .option('--baseContentUrl [url]', 'Prepend all relative links in README.md with this url.')
        .option('--baseImagesUrl [url]', 'Prepend all relative image links in README.md with this url.')
        .option('--yarn', 'Use yarn instead of npm while packing extension files')
        .option('--noVerify')
        .option('--ignoreFile [path]', 'Indicate alternative .vscodeignore')
        .action((version, { pat, message, packagePath, baseContentUrl, baseImagesUrl, yarn, noVerify, ignoreFile }) => main(publish_1.publish({ pat, commitMessage: message, version, packagePath, baseContentUrl, baseImagesUrl, useYarn: yarn, noVerify, ignoreFile })));
    program
        .command('unpublish [<extensionid>]')
        .description('Unpublishes an extension. Example extension id: microsoft.csharp.')
        .option('-p, --pat <token>', 'Personal Access Token')
        .option('-f, --force', 'Forces Unpublished Extension')
        .action((id, { pat, force }) => main(publish_1.unpublish({ id, pat, force })));
    program
        .command('ls-publishers')
        .description('List all known publishers')
        .action(() => main(store_1.listPublishers()));
    program
        .command('create-publisher <publisher>')
        .description('Creates a new publisher')
        .action(publisher => main(store_1.createPublisher(publisher)));
    program
        .command('delete-publisher <publisher>')
        .description('Deletes a publisher')
        .action(publisher => main(store_1.deletePublisher(publisher)));
    program
        .command('login <publisher>')
        .description('Add a publisher to the known publishers list')
        .action(name => main(store_1.loginPublisher(name)));
    program
        .command('logout <publisher>')
        .description('Remove a publisher from the known publishers list')
        .action(name => main(store_1.logoutPublisher(name)));
    program
        .command('show <extensionid>')
        .option('--json', 'Output data in json format', false)
        .description('Show extension metadata')
        .action((extensionid, { json }) => main(show_1.show(extensionid, json)));
    program
        .command('search <text>')
        .option('--json', 'Output result in json format', false)
        .description('search extension gallery')
        .action((text, { json }) => main(search_1.search(text, json)));
    program
        .command('*', '', { noHelp: true })
        .action((cmd) => {
        program.help(help => {
            const availableCommands = program.commands.map(c => c._name);
            const suggestion = availableCommands.find(c => leven(c, cmd) < c.length * 0.4);
            help = `${help}
Unknown command '${cmd}'`;
            return suggestion ? `${help}, did you mean '${suggestion}'?\n` : `${help}.\n`;
        });
    });
    program.parse(argv);
    if (process.argv.length <= 2) {
        program.help();
    }
};
