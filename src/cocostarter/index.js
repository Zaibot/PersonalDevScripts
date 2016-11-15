#! /usr/bin/env node

exports.help = {
  description: 'Compare current repo to starter.'
};
exports.defaultConfig = {
  codecompare: 'C:/',
  starter: 'C:/'
};

if (require.main === module) {
  const config = require('../config');
  const process = require('process');
  const path = require('path');
  const chalk = require('chalk');
  const { find } = require('../repo/find');
  const child_process = require('child_process');

  config.readConfiguration(process.cwd(), function(err, config) {
    find(process.cwd(), (err, pathRepository) => {
      if (err) return console.log(chalk.red(err.message));
      console.log('Opening Code Compare...');
      child_process.spawn(`"${config.codecompare}" ".\\" "${path.resolve(config.starter)}"`, { cwd: pathRepository, shell: true, detached: true, stdio: 'ignore' }).unref();
    });
  });
}
