#! /usr/bin/env node

exports.help = {
  description: 'Launches SourceTree for current repository.'
};
exports.defaultConfig = {
  sourcetree: 'C:/Program Files (x86)/Atlassian/SourceTree/SourceTree.exe'
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
      console.log('Opening SourceTree...');
      child_process.spawn(`"${path.resolve(config.sourcetree)}" -f "${path.resolve(pathRepository)}" log`, { shell: true, detached: true, stdio: 'ignore' }).unref();
    })
  });
}
