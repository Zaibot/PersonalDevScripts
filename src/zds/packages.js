module.exports = {
  getEntryPoints
};

function getEntryPoints() {
  const path = require('path');
  const mapBin = require(path.join(__dirname, '../../package.json')).bin;
  return Object
    .keys(mapBin)
    .map(keyBin => /\.js$/.test(mapBin[keyBin])
      ? Object.assign({ name: keyBin }, require(`../../${mapBin[keyBin]}`))
      : Object.assign({ name: keyBin, help: { description: '(without description)' } })
    );
}

function getNodeModulePaths(pathFolder, cb) {
  const path = require('path');
  const fs = require('fs');
  const fsts = require('../fstreesearch');
  fsts.list(pathFolder, (err, paths) => {
    fsts.filter(
      paths.map(p => path.resolve(p, 'node_modules')),
      (item, next) => {
        fs.stat(item, function (err, stats) {
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
