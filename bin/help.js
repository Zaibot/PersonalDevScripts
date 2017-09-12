#! /usr/bin/env node
exports.help = { description: 'This help message.' };

if (require.main === module) {
  const path = require('path');
  const chalk = require('chalk');

  console.log(chalk.yellow(`PersonalDevScripts`));
  console.log(`Version ${require(path.join(__dirname, '../package.json')).version}`);
  console.log(`Commit ${require(path.join(__dirname, '../package.json')).gitHead}`);
  console.log(`Commands:`);

  const { getEntryPoints } = require(path.join(__dirname, '../src/zds/packages'));
  getEntryPoints().forEach(x => {
    console.log(` - ${pad(' '.repeat(15), x.name)} ${x.help.description}`);
  });
}

function pad(pad, str) {
  return (str + pad).substring(0, pad.length);
}
