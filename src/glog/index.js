#! /usr/bin/env node --harmony-async-await

exports.help = {
  description: 'GIT Merged History.'
};

const Git = require("nodegit");
const chalk = require('chalk');

class Level {
  constructor() {
    this._depths = new Map();
  }
  adviceDown(child, parent) {
    if (this._depths.get(parent)) {
      return;
    }
    const childLevel = this._depths.get(child) || 0;
    this._depths.set(parent, childLevel + 1);
  }
  adviceUp(child, parent) {
    if (this._depths.get(parent)) {
      return;
    }
    const childLevel = this._depths.get(child) || 0;
    this._depths.set(parent, childLevel);
  }
  get(hash) {
    return this._depths.get(hash) || 0;
  }
}

function oneLine(message) {
  return message.split('\n')[0].trim();
}

function remainderLines(message) {
  return message.split('\n').slice(1).map(x => x.trim()).filter(Boolean);
}

function indent(level, ch = '  ') {
  var r = '';
  while (level-- > 0) {
    r += ch;
  }
  return r;
}
async function find(repo, text) {
  try {
    var p = Git.Oid.fromString(text);
    if (!p.iszero()) {
      return p;
    }
  } catch (ex) {
    console.error(`[find] ${ex.toString()}`);
  }
  const ref = await repo.getReference(text);
  const t = await ref.resolve();
  const targ = await t.target();
  return targ;
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
    const startCommit = start && await repo.getCommit(await find(repo, start));
    const endCommit = end && await repo.getCommit(await find(repo, end));
    return {
      startCommit,
      endCommit
    };
  } catch (ex) {
    await listReferences(repo);
    throw ex;
  }
}

function printInfo(startCommit, endCommit) {
  console.log(chalk.grey(`Changes from ${chalk.white(oneLine(startCommit.message()))} till ${chalk.white(endCommit ? oneLine(endCommit.message()) : 'start')}`));
}

function printGenericMergeCommits(depth, count) {
  console.log(`${chalk.grey(indent(8, '~'))} ${indent(depth)}${chalk.yellow(`~~~ ${count} generic merge commits ~~~`)}`);
}

function printCommit(depth, sha, message) {
  console.log(`${chalk.grey(sha.substr(0, 8))} ${indent(depth)}${chalk.cyan(oneLine(message))}`);
  const lines = remainderLines(message);
  if (lines.length) {
    for (const line of lines) {
      console.log(`${indent(8, ' ')} ${indent(depth)}${chalk.grey('+')} ${chalk.grey(line)}`);
    }
  }
}

function isGenericMergeCommit(message) {
  return /^Merge branch/.test(message);
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
    const depths = new Level();
    let genericMergeCommits = 0;
    printInfo(startCommit, endCommit);
    history.on("end", async function(commit) {
      if (genericMergeCommits > 0) {
        // Report generic merge commits
        printGenericMergeCommits(depths.get(sha), genericMergeCommits);
        genericMergeCommits = 0;
      }
    });
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
      if (parents[0]) {
        depths.adviceUp(sha.toString(), parents[0].toString());
      }
      if (parents[1]) {
        depths.adviceDown(sha.toString(), parents[1].toString());
      }
      if (parents.length === 1) {
        return;
      }
      if (isGenericMergeCommit(message)) {
        return genericMergeCommits++;
      }
      if (genericMergeCommits > 0) {
        // Report generic merge commits
        printGenericMergeCommits(depths.get(sha), genericMergeCommits);
        genericMergeCommits = 0;
      }
      printCommit(depths.get(sha), sha, message);
    });
    history.start();
  } catch (err) {
    console.error(err);
  }
}

function main() {
  const [start, end] = process.argv.slice(2);
  printHistory(start, end);
}

if (require.main === module) {
  main();
}