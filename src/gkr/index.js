#! /usr/bin/env node

exports.help = {
  description: 'Launches GIT Kraken for current repository.'
};
exports.defaultConfig = {
  gitkraken: '%userprofile%/AppData/Local/gitkraken/Update.exe'
};

if (require.main === module) {
  const config = require('../config');
  const process = require('process');
  const path = require('path');
  const chalk = require('chalk');
  const { find } = require('../repo/find');
  const child_process = require('child_process');

  config.readConfiguration(process.cwd(), function(err, config) {
    Object.assign(config, exports.defaultConfig);
    find(process.cwd(), (err, pathRepository) => {
      if (err) return console.log(chalk.red(err.message));
      console.log('Opening GIT Kraken...');
      const cmd = `"${config.gitkraken}"  --processStart "gitkraken.exe" --process-start-args "-p "${path.resolve(pathRepository)}"`;
      // console.error(cmd);
      child_process.spawn(cmd, { shell: true, detached: true, stdio: 'ignore' }).unref();
    })
  });
}
