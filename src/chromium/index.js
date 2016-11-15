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
  const child_process = require('child_process');

  const args = process.argv.slice(2).map(x => x.indexOf(' ') > -1 ? `"${x.replace('"', '\\"')}"` : x).join(' ');
  
  config.readConfiguration(process.cwd(), function(err, config) {
    child_process.spawn(`"${path.resolve(config.chromium)}" ${args}`, { shell: true, detached: true, stdio: 'ignore' }).unref();
  });
}
