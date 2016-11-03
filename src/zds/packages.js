exports.getEntryPoints = getEntryPoints;

function getEntryPoints() {
  const dic = require('../../package.json').bin;
  return Object.keys(dic).map(x => Object.assign({ name: x }, require(`../../${dic[x]}`)));
}