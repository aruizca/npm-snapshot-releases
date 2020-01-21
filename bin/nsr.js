#!/usr/bin/env node
const { next } = require('../src/next');

// Grab provided args
const [,, ...args] = process.argv;

switch (args[0]) {
    case 'next':
        next();
        console.log('Setting next development version to ...');
        break;
    case 'unlock':
        console.log('Removing snapshot reference from package-lock.json and the library from node_modules');
        break;
    case 'deploy':
        console.log('Deploys a snapshot release to provided registry...');
        break;
    case 'release':
        console.log('Perform a final release to provided registry...');
        break;
    case 'mvn-sync':
        console.log('Sync Maven version and Node.js runtime');
        break;
    case 'mvn-verify':
        console.log('Checks for snapshot dependencies');
        break;
    default:
        console.log('Provide help');
}