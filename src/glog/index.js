#! /usr/bin/env node --harmony-async-await

exports.help = {
    description: 'GIT Merged History.'
};

const Git = require("nodegit");
const chalk = require('chalk');

function oneLine(message) {
  return message.split('\n')[0].trim();
}
async function listReferences(repo) {
  const refs = (await repo.getReferenceNames(Git.Reference.TYPE.OID)).sort();
  for (const r of refs) {
    const [_, head] = /^refs\/heads\/([a-zA-Z0-9\.\-]+)/.exec(r) || [];
    if (head) {
      console.log(` # ${head} ${chalk.grey(r)}`);
    }
  }
  console.log(``);
  for (const r of refs) {
    const [_, tag] = /^refs\/tags\/([a-zA-Z0-9\.\-]+)/.exec(r) || [];
    if (tag) {
      console.log(`${tag} ${chalk.grey(r)}`);
    }
  }
  console.log(``);
}
async function resolveRange(repo, start, end) {
  try {
    const startCommit = start && await repo.getReferenceCommit(start);
    const endCommit = end && await repo.getReferenceCommit(end);
    return {
      startCommit,
      endCommit
    };
  } catch (ex) {
    await listReferences(repo);
    throw ex;
  }
}
async function printHistory(start = 'HEAD', end) {
  try {
    const repo = await Git.Repository.open(process.cwd())
    const {
      startCommit,
      endCommit
    } = await resolveRange(repo, start, end);
    const history = startCommit.history();
    let completed = false;
    const endCommitHash = endCommit && endCommit.sha();

    console.log(chalk.grey(`Changes from ${chalk.white(oneLine(startCommit.message()))} till ${chalk.white(endCommit ? oneLine(endCommit.message()) : 'start')}`));
    history.on("commit", async function(commit) {
      if (completed) {
        return;
      }
      if (endCommitHash === commit.sha()) {
        completed = true;
        return;
      }
      const sha = commit.sha();
      const message = commit.message();
      const parents = commit.parents();
      if (parents.length === 1) { return; }
      if (/^Merge branch/.test(message)) { return; }
      console.log(`${chalk.grey(sha.substr(0, 8))} ${chalk.cyan(oneLine(commit.message()))}`);
    });
    history.start();
  } catch (err) {
    console.error(err);
  }
}
async function depth(commit, num = 0) {
  const p = await commit.getParents(8);
  if (p.length > 0) {
    return await depth(p[p.length - 1], num + 1)
  } else {
    return num + 1;
  }
}

function main() {
  const [ start, end ] = process.argv.slice(2);
  printHistory(start, end);
}

main();
