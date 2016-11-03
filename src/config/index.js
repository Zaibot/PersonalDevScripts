const fs = require('fs');
const path = require('path');
const async = require('async');
const fsts = require('../fstreesearch');
const { isConfigFolder } = require('./search');

exports.readConfiguration = readConfiguration;

function readConfiguration(path, cb) {
  getConfigPaths(path, (err, results) => {
    async.map(results, readConfigFile, (err, results) => {
      cb(err, Object.assign.apply(Object, [{}].concat(results)));
    });
  });
}

function readConfigFile(pathConfig, cb) {
  fs.readFile(pathConfig, function(err, data) {
    if (err) throw err;
    cb(err, JSON.parse(data));
  });
}

function getConfigPaths(pathFolder, cb) {
  fsts.find(pathFolder, isConfigFolder, (err, results) => {
    cb(err, results.map(x => `${path.join(x, '.zdsconfig')}`));
  });
}

