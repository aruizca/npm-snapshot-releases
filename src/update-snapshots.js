const fs = require('fs');
const shell = require('shelljs');
const { error } = require('./error-handler');

function retrieveSnapshotDependencies(dependencies) {
    if (dependencies) {
        return Object.entries(dependencies).filter(([dependencyName, dependency]) => dependency.version.includes('-SNAPSHOT.'));
    }
    return [];
}

module.exports = {
    updateSnapshots: (targetDir) => {
        try {
            const lockFile = `${targetDir}/package-lock.json`;
            console.log(`Processing file: ${lockFile}`);
            let packageLock = JSON.parse(fs.readFileSync(lockFile));;
            const snapshotDependencies = retrieveSnapshotDependencies(packageLock.dependencies);
            if (snapshotDependencies) {
                snapshotDependencies.forEach(([dependencyName, dependency]) => {
                    shell.exec(`npm uninstall ${dependencyName} --no-save`);
                    delete packageLock.dependencies[dependencyName];
                    console.log(`Dependency ${dependencyName}:${dependency.version} was removed so it can be updated.`)
                });
                fs.writeFileSync(lockFile, JSON.stringify(packageLock, null, 2));
            }
        } catch (e) {
            error(e);
        }
    }
};