#! /usr/bin/env node
exports.help = { description: 'Install new version DevScripts.' };

if (require.main === module) {
  const chalk = require('chalk');
  const shell = require("shelljs");

  console.log(chalk.yellow(`Install latest version of PersonalDevScripts...`));
  shell.exec("npm install -g Zaibot/PersonalDevScripts");
}