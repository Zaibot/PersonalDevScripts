#! /usr/bin/env node
const process = require('process');
const path = require('path');
const into = require('into');
const chalk = require('chalk');
const shelljs = require('shelljs');
const { isRepository } = require('../src/repo');

const folders = getFolderPaths(process.cwd()).reverse();

into(folders)
  .map((x, next) => {
    isRepository(x, (err, res) => {
      next(err, { dir: res.dir, found: res.found });
    });
  })
  .filter((x, next) => next(null, x.found))
  .then(x => {
    if (x.length === 0) {
      console.log(chalk.red('No repository found.'));
    } else {
      shelljs.cd(x[0].dir);
      shelljs.exec(process.argv[2]);
    }
  });

function getFolderPaths(target) {
  const names = path.resolve(target).split(path.sep);

  var current = names[0];
  const folders = names.slice(1).map(x => {
    return (current = path.normalize(path.join(current, x)))
  });

  return folders;
}
