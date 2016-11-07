exports.getEntryPoints = getEntryPoints;

function getEntryPoints() {
  const dic = require('../../package.json').bin;
  return Object.keys(dic).map(x => Object.assign({
    name: x
  }, require(`../../${dic[x]}`)));
}

function getNodeModulePaths(pathFolder, cb) {
  const path = require('path');
  const fsts = require('../fstreesearch');
  const fs = require('fs');
  fsts.list(pathFolder, (err, paths) => {
    fsts.filter(
      paths.map(p => path.resolve(p, 'node_modules')),
      (item, next) => {
        fs.stat(item, function(err, stats) {
          if (stats && stats.isDirectory()) {
            return next(null, true);
          } else {
            return next(null, false);
          }
        });
      },
      (err, results) => {
        cb(err, results);
      })
  });
}