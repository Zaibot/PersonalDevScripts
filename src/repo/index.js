const path = require('path');
const fs = require('fs');

exports.isRepository = function(pathRep, cb) {
  fs.stat(path.join(pathRep, '.git'), function(err, stats) {
    if (err && err.code === 'ENOENT') return cb(null, { dir: pathRep, type: null, found: false });
    if (err) return cb(err);

    if (stats.isDirectory()) {
      cb(err, { dir: pathRep, type: 'git', found: true });
    } else {
      cb(err, { dir: pathRep, type: null, found: false });
    }
  });
};