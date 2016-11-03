const path = require('path');
const fs = require('fs');

exports.isConfigFolder = function(pathRep, cb) {
  fs.access(path.join(pathRep, '.zdsconfig'), fs.constants.R_OK, function(err, stats) {
    cb(null, !err);
  });
};