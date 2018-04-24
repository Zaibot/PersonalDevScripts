#! /usr/bin/env node

exports.help = {
  description: 'Correct casing of filenames in GIT.'
};

if (require.main === module) {
  main();
}

async function main() {
  const chalk = require('chalk');
  const ProgressBar = require('progress');
  const trueCasePath = require('true-case-path');
  try {
    const cache = new Map();
    const getDirectoryContents = async (p, output) => {
      if (cache.has(p)) {
        return cache.get(p);
      } else {
        const isDir = await isDirectory(p);
        if (!isDir) {
          output.log(chalk.yellowBright(`Skipping ${p}`));
        }
        const l = isDir ? await silent(`ls -a "${p}"`) : [];
        cache.set(p, l);
        return l;
      }
    };
    const pathRepo = process.cwd();
    const fs = require('fs');
    const path = require('path');
    const files = await silent(`git ls-files`);
    const bar = new ProgressBar(':percent :folder', { total: files.length });
    output = {
      error: (...args) => bar.interrupt(...args),
      log: (...args) => bar.interrupt(...args),
    };
    output.log(chalk.cyanBright(`Correcting casings in GIT`));
    for (const file of files) {
      const nameGit = file;
      const nameFs = trueCasePath(nameGit);
      if (nameFs && nameGit) {
        if (nameFs !== nameGit) {
          try {
            output.log(chalk.yellowBright(`correcting ${nameFs}`));
            await run(`git mv "${nameGit}" "${nameFs}"`, output);
          } catch (ex) {
            output.log(chalk.redBright(`failed ${file}: ${ex}`));
          }
        }
      }
      bar.tick({ folder: path.dirname(file) });
    }
    console.log();
    console.log(chalk.cyanBright(`Done.`));
  } catch (ex) {
    console.log();
    console.error(chalk.redBright(ex.toString()));
  }
}

function isDirectory(path) {
  const fs = require('fs');
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        if (err.code === 'ENOENT') {
          resolve(false);
        } else {
          reject(err);
        }
      } else {
        resolve(stats.isDirectory());
      }
    })
  });
}

function silent(cmd, output) {
  const chalk = require('chalk');
  const child_process = require('child_process');
  return new Promise((resolve, reject) => {
    child_process.exec(cmd, { maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) {
        output.error(chalk.redBright(cmd));
        output.error(chalk.gray(err));
        reject(err);
      } else {
        resolve(stdout.trim().split(/\r?\n/));
      }
    });
  });
}

async function run(cmd, output) {
  const chalk = require('chalk');
  output.log(chalk.gray(cmd));
  return await silent(cmd);
}
