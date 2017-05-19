#! /usr/bin/env node --harmony-async-await
exports.help = { description: 'This help message.' };

if (require.main === module) {
  const chalk = require('chalk');
  const shell = require("shelljs");

  console.log(chalk.yellow(`PersonalDevScripts`));
  console.log(`Version ${require('../package.json').version}`);
  console.log(`Commit ${require('../package.json').gitHead}`);
  console.log(`Commands:`);

  const { getEntryPoints } = require('../src/zds/packages');
  getEntryPoints().forEach(x => {
    console.log(` - ${pad(' '.repeat(15), x.name)} ${x.help.description}`);
  });
}

function pad(pad, str) {
  return (str + pad).substring(0, pad.length);
}