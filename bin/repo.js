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
  } = require('../src/repo');
  const fsts = require('../src/fstreesearch');

  fsts.find(
    process.cwd(),
    (path, next) => isRepository(path, (err, res) => next(err, res.found)),
    (err, results) => {
      results.reverse();
      if (results.length === 0) {
        console.log(chalk.red('No repository found.'));
      } else {
        shelljs.cd(x[0].dir);
        shelljs.exec(process.argv.slice(2));
      }
    }
  );
}