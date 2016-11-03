const async = require('async');
const path = require('path');

exports.list = listFolders;
exports.find = findFolders;

function listFolders(path, cb) {
  cb(null, getFolderPaths(path));
};

function findFolders(path, filter, cb) {
  async.filter(getFolderPaths(path), filter, function(err, results) {
    if (err) throw err;
    cb(err, results);
  });
}

function getFolderPaths(target) {
  const names = path.resolve(target).split(path.sep);

  var current = '';
  const folders = names.map(x => {
    return (current = path.normalize(path.join(current, x, '.\\')))
  });
  
  return folders;
}