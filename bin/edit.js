#! /usr/bin/env node

exports.help = {
  description: 'Open configuration files in editor.'
};

if (require.main === module) {
  const config = require('../src/config');
  const process = require('process');
  const chalk = require('chalk');
  const shelljs = require('shelljs');
  config.readConfiguration(process.cwd(), (err, c) => {
    config.getConfigPaths(process.cwd(), (err, paths) => {
      paths.forEach(p => {
        console.log(chalk.cyan(p));
        shelljs.exec(`"${c.edit}" "${p}"`, { async: true }).unref();
      });
      process.exit(0);
    });
  });
}