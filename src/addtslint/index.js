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
    // Update package info
    const p = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json')));
    p['scripts']["tslint"] = "tslint --config tslint.json --project tsconfig.json --type-check";
    p['scripts']["tslint:fix"] = "tslint --config tslint.json --project tsconfig.json --type-check --fix";
    if (!p['scripts']["lint"]) {
      p['scripts']["lint"] = "npm run tslint";
    }
    if (!p['scripts']["lint:fix"]) {
      p['scripts']["lint:fix"] = "npm run tslint:fix";
    }
    fs.writeFileSync(path.resolve(process.cwd(), 'package.json'), JSON.stringify(p, null, 2));
    console.log('package.json configured for scripts ./src/**/*.tsx');
    // Write tslint config
    fs.writeFileSync(path.resolve(process.cwd(), 'tslint.json'), JSON.stringify(defaultsTslint, null, 2));
    // Install tslint
    child_process.spawn(`npm i --save-dev tslint zaibot/tslint-preset`, { shell: true, stdio: 'inherit' });
  });
}
