#! /usr/bin/env node

exports.help = {
  description: 'Entry point of commands.'
};

if (require.main === module) {
  const process = require('process');
  const chalk = require('chalk');
  const fs = require('fs');
  const config = require('../config');
  const packages = require('./packages');
  config.readConfiguration(process.cwd(), (err, stat) => {
    console.log(JSON.stringify(stat, null, 4));
  });
}