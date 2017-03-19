#! /usr/bin/env node

exports.help = {
    description: 'Apply default configuration values to tsconfig.'
};

const defaultCompilerOptions = {
    "allowSyntheticDefaultImports": true,
    "target": "es6",
    "module": "es6",
    "moduleResolution": "node",
    "isolatedModules": false,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "declaration": true,
    "noImplicitAny": true,
    "noImplicitUseStrict": false,
};
const defaultConfig = {
    "compileOnSave": false,
    "buildOnSave": false,
    "filesGlob": [
        "src/**/*.ts",
        "src/**/*.tsx",
        "!node_modules/**"
    ],
    "atom": {
        "rewriteTsconfig": true
    },
};

if (require.main === module) {
    const config = require('../config');
    const path = require('path');
    const fs = require('fs');

    config.readConfiguration(process.cwd(), function(err, config) {
        // Update package info
        const p = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'tsconfig.json')));
        Object.assign(p, defaultConfig);
        Object.assign(p.compilerOptions, defaultCompilerOptions);
        fs.writeFileSync(path.resolve(process.cwd(), 'tsconfig.json'), JSON.stringify(p));
    });
}
