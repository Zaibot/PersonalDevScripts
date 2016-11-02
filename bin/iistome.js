#! /usr/bin/env node
exports.help = { description: 'Change physical IIS Dev website to cwd.' };

if (require.main === module) {
  const chalk = require('chalk');
  const iis = require('iis');

  console.log(chalk.cyan(`Changing Dev to ${process.cwd()}...`));
  iis.setPhysicalPath('Dev', process.cwd(), function(err,rsp) {
      if (err) {
        console.log(chalk.cyan(`Error: ${err}`));
        return;
      }
      console.log(chalk.green(`Done.`));
  });
}