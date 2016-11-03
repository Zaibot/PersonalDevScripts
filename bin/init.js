#! /usr/bin/env node

exports.help = {
  description: 'Initialize config in current folder.'
};

if (require.main === module) {
  const chalk = require('chalk');
  const fs = require('fs');
  fs.stat('./.zdsconfig', (err, stat) => {
    if (err && err.code !== 'ENOENT') throw err;
    if (stat && stat.isFile()) {
      console.log(chalk.red('ZDS config file already exists!'));
      return;
    }
    fs.writeFile('./.zdsconfig', JSON.stringify({
      diff: 'C:\\',
      edit: 'C:\\',
      vlc: 'C:\\'
    }, null, 2), (err) => {
      if (err) throw err;
      console.log(chalk.green(`Written .zdsconfig`));
    });
  });
}