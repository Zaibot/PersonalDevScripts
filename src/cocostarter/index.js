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
  const shelljs = require('shelljs');

  config.readConfiguration(process.cwd(), function(err, config) {
    shelljs.exec(`repo "${config.codecompare}" ".\\" "${path.resolve(config.starter)}"`);
  });
}