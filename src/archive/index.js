#! /usr/bin/env node

exports.help = {
    description: 'Archive folders under the current path.'
};
exports.defaultConfig = {
    '7zip': 'C:/Program Files/7-zip/7z.exe',
};
  
if (require.main === module) {
    const async = require('async');
    const chalk = require('chalk');
    const child_process = require('child_process');
    const config = require('../config');
    const fs = require('fs');
    const inquirer = require('inquirer');
    const path = require('path');
    const process = require('process');
  
    config.readConfiguration(process.cwd(), function(err, config) {
      main(Object.assign({}, exports.defaultConfig, config));
    });

    async function main(config) {
        try {
            const cwd = process.cwd();
            const entries = await listFileSystem(cwd);
            const folders = await listFilter(entries.map((f) => path.join(cwd, f)), async (f) => await isDirectory(f));
            const choices = await chooseMultiple(`Choose which folders to archive`, folders.map((p) => path.basename(p)));
            console.log();
            let i = 0;
            for (const name of choices) {
                console.log(chalk.yellowBright(`[${++i}/${choices.length}] Archiving ${name}`));
                const date = new Date().toISOString().substring(0, 10).replace('-', '');
                const source = path.join(cwd, name, '*');
                const target = path.join(cwd, `${name}.7z`);
                await run(path.resolve(config['7zip']), ['a', '-r', '-sdel', '-mmt', '-mx=1', '--', target, source]);
                const folder = path.join(cwd, name);
                fs.rmdirSync(folder);
            }
            console.log(chalk.greenBright(`Done.`));
        } catch (ex) {
            console.log(chalk.redBright(ex));
        }
    }

    async function run(cmd, args) {
        const cmdFull = [cmd].concat(args).map((p) => p.includes(' ') ? `"${p}"` : p).join(' ');
        console.error(chalk.gray(`${cmdFull}`));
        return await silent(cmdFull);
    }
    
    function silent(cmd, args) {
      const child_process = require('child_process');
      return new Promise((resolve, reject) => {
        child_process.exec(cmd, { shell: true } , (err, stdout, stderr) => {
          if (err) { reject(Error(`error code ${err.code}`)); } else { resolve(stdout.trim().split(/\r?\n/)) }
        });
      });
    }

    function chooseMultiple(question, list) {
        return new Promise((resolve, reject) => {
            inquirer.prompt({
                type: 'checkbox',
                name: 'choice',
                message: question,
                choices: list,
                pageSize: 50,
            }).then(function (answers) {
                resolve(answers.choice);
            });
        });
    }

    async function listFilter(list, filter) {
        const res = [];
        for (const item of list) {
            if (await filter(item)) {
                res.push(item);
            }
        }
        return res;
    }

    function isDirectory(path) {
        return new Promise((resolve, reject) => {
            fs.stat(path, (err, stat) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(stat.isDirectory());
                }
            });
        });
    }

    function listFileSystem(path) {
        return new Promise((resolve, reject) => {
            fs.readdir(path, (err, files) => {
                if (err) { 
                    reject(err);
                } else {
                    resolve(files);
                }
            });
        });
    }
}