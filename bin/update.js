#! /usr/bin/env node
const chalk = require('chalk');
const shell = require("shelljs");

console.log(chalk.yellow(`Install latest version of PersonalDevScripts...`));
shell.exec("npm install -g Zaibot/PersonalDevScripts");