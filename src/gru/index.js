#! /usr/bin/env node

exports.help = {
    description: 'GIT fetch & rebase onto upstream.'
};

if (require.main === module) {
    const chalk = require('chalk');
    const child_process = require('child_process');

    console.log(chalk.cyan('Fetching...'));
    git('fetch origin', (err, res) => {
      if (res.code) {
        console.log(chalk.grey(`fetch exit code: ${res.code}`));
      }

      console.log(chalk.cyan('Rebase onto upstream...'));
      git('rebase @{u} --autostash', (err, res) => {
        console.log(chalk.grey(`rebase exit code: ${res.code}`));
        child_process.spawn('grl', { shell: true, stdio: 'inherit' });
      });
    });

    // Commands
    function git(args, cb) {
        const {
            exec
        } = require('child_process');
        exec(`git ${args}`, (err, stdout, stderr) => {
            return cb(null, {
                code: err ? err.code : 0,
                error: stderr.trim(),
                message: stdout.trim()
            });
        });
    }
}
