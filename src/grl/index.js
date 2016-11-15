#! /usr/bin/env node

exports.help = {
    description: 'GIT rebase loop.'
};

if (require.main === module) {
    const config = require('../config');
    const process = require('process');
    const fs = require('fs');
    const path = require('path');
    const chalk = require('chalk');
    const {
        find
    } = require('../repo/find');
    const child_process = require('child_process');

    var startHash  = '';
    var origHead  = '';
    config.readConfiguration(process.cwd(), function(err, config) {
        find(process.cwd(), (err, pathRepository) => {
            if (err) return console.log(chalk.red(err.message));

            orighead((err, hash) => {
              if (err) return console.log(chalk.red(`No rebase in progress.`));
              origHead = hash;
              console.log(chalk.grey(`ORIG_HEAD: ${origHead}`));
              git('rev-parse HEAD', (err, res) => {
                startHash = res.message;
                console.log(chalk.grey(`GIT HEAD:  ${startHash}`));
                choice_refresh(pathRepository);
              });
            });
        })
    });

    function orighead(cb) {
      fs.readFile('./.git/rebase-apply/orig-head', (err, data) => {
        if (err) {
          fs.readFile('./.git/rebase-merge/orig-head', (err, data) => {
            cb(err, err ? null : data.toString().trim());
          });
        } else {
          cb(err, err ? null : data.toString().trim());
        }
      });
    }

    // Handlers
    function choice_exit() {
      git('rev-parse HEAD', (err, res) => {
        const endHash = res.message;
        if (startHash !== endHash) {
          console.log(chalk.yellow(`ORIG_HEAD:  ${origHead}`));
          console.log(chalk.yellow(`HEAD Start: ${startHash}`));
          console.log(chalk.yellow(`HEAD End:   ${endHash}`));
        }
      });
    }

    function rebaseInProgress(rep) {
        whatToDo(rep);
    }

    function choice_refresh(rep) {
        console.log('');
        git(`status`, (err, res) => {
            console.log(chalk.grey(`status status exit code: ${res.code}`));
            orighead((err, hash) => {
              if (err) {
                  console.log(res.message);
                  choice_exit();
              } else {
                console.log(chalk.cyan(`Rebase in progress`));
                rebaseInProgress(rep);
              }
            });
        });
    }

    function choice_continue(rep) {
        git(`rebase --continue`, (err, res) => {
            console.log(chalk.grey(`rebase continue exit code: ${res.code}`));

            if (res.code === 1) {
                console.log(chalk.red(`Resolve conflicts...`));
                gst();
                choice_tool(rep);
            } else {
                console.log(res);
                choice_exit();
            }
        });
    }

    function choice_tool(rep) {
        git('mergetool -y', (err, res) => {
            console.log(chalk.grey(`mergetool exit code: ${res.code}`));
            choice_refresh(rep);
        });
    }

    function choice_abort(rep) {
        git(`rebase --abort`, (err, res) => {
            console.log(chalk.grey(`rebase abort exit code: ${res.code}`));
            choice_exit();
        });
    }

    function choice_skip(rep) {
        git(`rebase --skip`, (err, res) => {
            console.log(chalk.grey(`rebase skip exit code: ${res.code}`));
            choice_refresh(rep);
        });
    }

    function whatToDo(rep) {
        const prompt = require('prompt');
        const chalk = require('chalk');
        prompt.message = '';
        prompt.delimiter = '';

        prompt.get({
            name: 'main',
            message: chalk.green(`${chalk.white("C")}ontinue, ${chalk.white("S")}kip, ${chalk.white("T")}ool, ${chalk.white("A")}bort, ${chalk.white("Q")}uit`),
            validator: /^(c(ontinue)?|s(kip)?|t(ool)?|a(bort)?|q(uit)?|r(efresh)?)$/,
            warning: 'Must respond Refresh, Continue, Skip, Tool, Abort, Quit.',
            default: 'refresh'
        }, function(err, result) {
            //console.log();
            switch (result.main) {
                case 'c':
                case 'continue':
                    console.log(chalk.yellow(`Continueing rebase...`));
                    choice_continue(rep);
                    break;

                case 's':
                case 'skip':
                    console.log(chalk.yellow(`Skipping...`));
                    choice_skip(rep);
                    break;

                case 't':
                case 'tool':
                    console.log(chalk.yellow(`Mergetool...`));
                    choice_tool(rep);
                    break;

                case 'a':
                case 'abort':
                    console.log(chalk.yellow(`Aborting...`));
                    choice_abort(rep);
                    break;

                case 'q':
                case 'quit':
                    console.log(chalk.yellow(`Stopping...`));
                    break;

                case 'r':
                case 'refresh':
                    console.log(chalk.yellow(`Refreshing...`));
                    choice_refresh(rep);
                    break;
            }
            prompt.pause();
        });
    }

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

    function gst() {
        const {
            spawn
        } = require('child_process');
        spawn('gst', {
            shell: true,
            stdio: 'ignore'
        }).unref();
    }
}
