#!/usr/bin/env node
const { nextSnapshotVersion } = require('../src/next-version');
const { syncVersions } = require('../src/sync-versions');
const { updateSnapshots } = require('../src/update-snapshots');

// Grab provided args
const [,, ...args] = process.argv;
const targetDir = process.cwd();

function showHelp() {
    console.log(`
These are the available commands:
- next: set next snapshot development version by increasing bugfix number
- update: install dependencies while updating the snapshot dependencies
- deploy <registry url>: TODO
- release <registry url>: TODO
- mvn-sync <version> <node.js runtime version>: TODO
- mvn-verify: TODO 
    `);
    process.exit(0);
}

switch (args[0]) {
    case 'next':
        console.log(`Setting next development version`);
        console.log(`--------------------------------`);
        nextSnapshotVersion();
        break;
    case 'update':
        console.log('Removing snapshot reference from package-lock.json and the library from node_modules');
        console.log('------------------------------------------------------------------------------------');
        updateSnapshots(targetDir);
        break;
    case 'deploy':
        console.log('Deploys a snapshot release to provided registry...');
        break;
    case 'release':
        console.log('Perform a final release to provided registry...');
        break;
    case 'mvn-sync':
        console.log('Syncing Maven version and Node.js runtime...');
        console.log('--------------------------------------------');
        if (!args[1] || !args[2]) {
            showHelp();
        }
        syncVersions(targetDir, args[1], args[2]);
        break;
    case 'mvn-verify':
        console.log('Checks for snapshot dependencies');
        break;
    default:
        showHelp();
}