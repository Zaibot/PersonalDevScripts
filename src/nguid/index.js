#! /usr/bin/env node

exports.help = {
  description: 'Generates a new GUID.'
};

if (require.main === module) {
  const chalk = require('chalk');
  const uuid = require('uuid');
  const val = uuid.v4();
  console.log(chalk.cyan(val));
  console.log(chalk.cyan(`{${val}}`));
}