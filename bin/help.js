#! /usr/bin/env node
const chalk = require('chalk');
const shell = require("shelljs");

console.log(chalk.yellow(`PersonalDevScripts`));
console.log(`Version ${require('../package.json').version}`);
console.log(`Commit ${require('../package.json').gitHead}`);
console.log(`Commands:`);
const dic = require('../package.json').bin;
Object.keys(dic).forEach(x => {
  console.log(` - ${x}`);
});
