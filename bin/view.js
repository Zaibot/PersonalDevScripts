#! /usr/bin/env node

exports.help = {
  description: 'Print configuration.'
};

if (require.main === module) {
  const process = require('process');
  const chalk = require('chalk');
  const fs = require('fs');
  const config = require('../src/config');
  config.readConfiguration(process.cwd(), (err, stat) => {
    console.log(JSON.stringify(stat, null, 4));
  });
}