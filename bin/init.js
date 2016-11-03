#! /usr/bin/env node

exports.help = {
  description: 'Initialize config in current folder.'
};
exports.defaultConfig = {
  vlc: 'C:/',
  edit: 'notepad'
};

if (require.main === module) {
  const chalk = require('chalk');
  const fs = require('fs');

  const { getEntryPoints } = require('../src/zds/packages');
  const defaultConfig = Object.assign.apply(Object, [{}].concat(getEntryPoints().map(x => x.defaultConfig)));

  fs.stat('./.zdsconfig', (err, stat) => {
    if (err && err.code !== 'ENOENT') throw err;
    if (stat && stat.isFile()) {
      console.log(chalk.red('ZDS config file already exists!'));
      return;
    }
    fs.writeFile('./.zdsconfig', JSON.stringify(defaultConfig, null, 2), (err) => {
      if (err) throw err;
      console.log(chalk.green(`Written .zdsconfig`));
    });
  });
}