const path = require('path');
const into = require('into');
const chalk = require('chalk');
const shelljs = require('shelljs');
const {
  isRepository
} = require('./search');
const fsts = require('../fstreesearch');

exports.find = function(path, cb) {
  fsts.find(
    path,
    (path, next) => {
      return isRepository(path, (err, res) => next(err, res.found))
    },
    (err, results) => {
      results.reverse();
      if (results.length === 0) {
        cb(new Error('No repository found!'));
      } else {
        cb(null, results[0]);
      }
    }
  );
};