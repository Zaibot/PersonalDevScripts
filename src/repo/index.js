#! /usr/bin/env node

exports.help = {
  description: 'Run command from folder of current repository.'
};

if (require.main === module) {
  const process = require('process');
  const path = require('path');
  const into = require('into');
  const chalk = require('chalk');
  const shelljs = require('shelljs');
  const {
    isRepository
  } = require('./search');
  const fsts = require('../fstreesearch');

  fsts.find(
    process.cwd(),
    (path, next) => isRepository(path, (err, res) => next(err, res.found)),
    (err, results) => {
      results.reverse();
      if (results.length === 0) {
        console.log(chalk.red(`No repository found.`));
      } else if (process.argv.length <= 2) {
        console.log(chalk.yellow(`Specify a command: repo [command] [args]*`));
      } else {
        const cmd = process.argv.slice(2).map(x => x.indexOf(' ') > -1 ? `"${x.replace('"', '\\"')}"` : x).join(' ');
        shelljs.cd(results[0]);
        shelljs.exec(cmd);
      }
    }
  );
}