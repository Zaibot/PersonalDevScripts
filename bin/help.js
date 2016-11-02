#! /usr/bin/env node
exports.help = { description: 'This help message.' };

if (require.main === module) {
  const chalk = require('chalk');
  const shell = require("shelljs");

  console.log(chalk.yellow(`PersonalDevScripts`));
  console.log(`Version ${require('../package.json').version}`);
  console.log(`Commit ${require('../package.json').gitHead}`);
  console.log(`Commands:`);
  const dic = require('../package.json').bin;
  Object.keys(dic).forEach(x => {
    console.log(` - ${pad(' '.repeat(15), x)} ${require(`../${dic[x]}`).help.description}`);
  });
}

function pad(pad, str) {
  return (str + pad).substring(0, pad.length);
}