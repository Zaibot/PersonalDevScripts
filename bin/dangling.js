#! /usr/bin/env node

exports.help = {
    description: 'List danling GIT commits.'
};

if (require.main === module) {
    main();
}

async function main() {
    const { execSync } = require(`child_process`);
    const chalk = require(`chalk`);

    const rx = /^([a-z0-9]+) ([^ ]+) (.*)$/;
    const parse = ({ type, hash, log }) => {
        const match = rx.exec(log);
        if (!match) {
            console.log(`!!`, hash, type, log);
            return;
        }
        const [_, commit, date, subject] = match;
        return {
            type,
            commit,
            date: new Date(date),
            subject,
        }
    }
    const log = (commit) => {
        return execSync(`git log --format="%h %aI %s" -n 1 ${commit}`).toString().trim();
    }

    const dangling = execSync(`git fsck --no-reflog`).toString().trim().split(/\r?\n/);
    const results = dangling
        .map((x) => x.split(` `))
        .map(([_1, type, hash]) => ({ type, hash }))
        .filter(({ type }) => type === `commit`)
        .map(({ type, hash }) => ({ type, hash, log: log(hash) }))
        .map(parse)
        .sort((a, b) => a.date.getTime() - b.date.getTime());
    for (const result of results) {
        const { type, commit, date, subject } = result;
        console.log(`${chalk.gray(commit)} ${chalk.gray(type)} ${chalk.cyanBright(date.toISOString())} ${chalk.yellowBright(subject)}`);
    }
}
