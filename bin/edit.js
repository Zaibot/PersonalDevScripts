#! /usr/bin/env node

exports.help = {
  description: 'Open configuration files in editor.'
};

if (require.main === module) {
  const config = require('../src/config');
  const process = require('process');
  const chalk = require('chalk');
  const child_process = require('child_process');
  config.readConfiguration(process.cwd(), (err, c) => {
    config.getConfigPaths(process.cwd(), (err, paths) => {
      paths.forEach(p => {
        console.log(chalk.cyan(p));
        child_process.spawn(`"${c.edit}" "${p}"`, { shell: true, detached: true, stdio: 'ignore' }).unref();
      });
    });
  });
}
