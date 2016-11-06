#! /usr/bin/env node
exports.help = { description: 'Install new version DevScripts.' };

const gitUrl = 'https://github.com/zaibot/PersonalDevScripts.git';

if (require.main === module) {
  const chalk = require('chalk');
  const shell = require("shelljs");
  const { exec } = require('child_process');

  console.log(chalk.yellow(`Checking latest version of PersonalDevScripts...`));

  const currentVersion = require('../package.json').gitHead;
  getLatestVersion(gitUrl, (err, serverVersion) => {
    if (currentVersion === serverVersion) {
      console.log(chalk.green(`Up to date`))
    } else {
      console.log(chalk.cyan(`Local:  ${currentVersion}`));
      console.log(chalk.cyan(`Server: ${serverVersion}`));
      console.log(``);
      console.log(chalk.yellow(`Installing latest version of PersonalDevScripts...`));
      exec(`npm install -g ${gitUrl}`, (err, stdout, stderr) => {
        if (stderr) {
          console.log(chalk.red(stderr));
        }
        console.log(chalk.cyan(`Done.`));
      });
    }
  });

  function getLatestVersion(git, cb) {
    var matcher = /([0-9a-fA-F]{40})\s+HEAD/g;
    exec(`git ls-remote ${git}`, (err, stdout, stderr) => {
      if (err) return cb(err, null);
      const serverVersion = matcher.exec(stdout)[1];
      if (!serverVersion) return cb(new Error('No HEAD found in ls-remote.'), null);
      cb(null, serverVersion);
    });
  }
}
