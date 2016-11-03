#! /usr/bin/env node

exports.help = {
  description: 'Launches Chromium.'
};
exports.defaultConfig = {
  chromium: 'C:/'
};

if (require.main === module) {
  const config = require('../config');
  const process = require('process');
  const path = require('path');
  const shelljs = require('shelljs');

  config.readConfiguration(process.cwd(), function(err, config) {
    const args = process.argv.slice(2).map(x => x.indexOf(' ') > -1 ? `"${x.replace('"', '\\"')}"` : x).join(' ');
    shelljs.exec(`"${path.resolve(config.chromium)}" ${args}`);
  });
}