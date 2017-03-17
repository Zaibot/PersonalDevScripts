#! /usr/bin/env node

exports.help = {
  description: 'Installs tslint and configured it with @zaibot/tslint-preset.'
};
exports.defaultConfig = {
  chromium: 'C:/'
};

const defaultsTslint = {
  "extends": "@zaibot/tslint-preset",
  "rules": {
  }
};

if (require.main === module) {
  const config = require('../config');
  const process = require('process');
  const path = require('path');
  const fs = require('fs');
  const child_process = require('child_process');

  const args = process.argv.slice(2).map(x => x.indexOf(' ') > -1 ? `"${x.replace('"', '\\"')}"` : x).join(' ');

  config.readConfiguration(process.cwd(), function(err, config) {
    fs.writeFileSync(path.resolve(process.cwd(), 'tslint.json'), JSON.stringify(defaultsTslint))
    child_process.spawn(`npm i --save-dev zaibot/tslint-preset`, { shell: true, stdio: 'inherit' });
  });
}
