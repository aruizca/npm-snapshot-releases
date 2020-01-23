#!/usr/bin/env node
const { syncVersions } = require('../src/sync-versions');
const { updateSnapshots } = require('../src/update-snapshots');
const { nextSnapshotVersion, deploy, release } = require('../src/release-managemement');

// Grab provided args
const [,, ...args] = process.argv;
const targetDir = process.cwd();

switch (args[0]) {
    case 'next':
        console.log(`Setting next development version`);
        console.log(`--------------------------------`);
        nextSnapshotVersion(targetDir);
        break;
    case 'update':
        console.log('Removing snapshot reference from package-lock.json and the library from node_modules');
        console.log('------------------------------------------------------------------------------------');
        updateSnapshots(targetDir);
        break;
    case 'deploy':
        console.log('Deploying the snapshot release to provided registry');
        console.log('---------------------------------------------------');
        if (!args[1]) {
            showHelp();
        }
        deploy(args[1], targetDir);
        break;
    case 'release':
        console.log('Performing a final release to provided registry...');
        if (!args[1]) {
            showHelp();
        }
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

function showHelp() {
    console.log(`
These are the available commands:
- next: set next snapshot development version by increasing bugfix number
- update: install dependencies while updating the snapshot dependencies
- deploy <registry url>: Deploys the SNAPSHOT and increases to next number
- release <registry url>: TODO
- mvn-sync <version> <node.js runtime version>: It syncs a Maven module with an NPM module
- mvn-verify: TODO 
    `);
    process.exit(0);
}