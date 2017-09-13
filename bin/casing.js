#! /usr/bin/env node

exports.help = {
  description: 'Correct casing of filenames in GIT.'
};

if (require.main === module) {
  main();
}

async function main() {
  const cache = new Map();
  const getList = async (p) => {
    if (cache.has(p)) {
      return cache.get(p);
    } else {
      const l = await silent(`ls -a ${p}`);
      cache.set(p, l);
      return l;
    }
  };
  const fs = require('fs');
  const path = require('path');
  const chalk = require('chalk');
  const files = await silent(`git ls-files`);
  console.log(chalk.cyanBright(`Correcting casings in GIT`));
  for (const file of files) {
    const folder = path.resolve(path.dirname(file));
    const actual = (await getList(folder)).map((cur) => path.basename(cur));
    const nameGit = path.basename(file);
    const nameFs = actual.reduce((state, cur) => cur.toLowerCase() === nameGit.toLowerCase() ? cur : state, null);
    if (nameFs && nameGit) { 
      if (nameFs !== nameGit) {
        try{
          console.log(chalk.yellowBright(`correcting ${path.join(folder, nameFs)}`));
          await run(`git mv "${path.join(folder, nameGit)}" "${path.join(folder, nameFs)}"`);
        }catch (ex) {
          console.log(chalk.redBright(`failed ${file}: ${ex}`));
        }
      }
    }
  }
  console.log(chalk.cyanBright(`Done.`));
}

function silent(cmd) {
  const child_process = require('child_process');
  return new Promise((resolve, reject) => {
    child_process.exec(cmd, (err, stdout, stderr) => {
      if (err) { reject(Error(`error code ${err.code}`)); } else { resolve(stdout.trim().split(/\r?\n/)) }
    });
  });
}

async function run(cmd) {
  const chalk = require('chalk');
  console.error(chalk.gray(cmd));
  return await silent(cmd);
}
