const fs = require('fs');
const shell = require('shelljs');


function getPackageLock(lockFile) {
    try {
        return JSON.parse(fs.readFileSync(lockFile));
    } catch (e) {
        error(e);
    }
}

function retrieveSnapshotDependencies(dependencies) {
    if (dependencies) {
        return Object.values(dependencies).filter(dependency => dependency.version.includes('-SNAPSHOT.'));
    }
    return [];
}

module.exports = {
    unlockSnapshots: (targetDir) => {
        const lockFile = `${targetDir}/package-lock.json`;
        let packageLock = getPackageLock(targetDir);
        const snapshotDependencies = retrieveSnapshotDependencies(packageLock.dependencies);
        if (snapshotDependencies) {
            snapshotDependencies.forEach(snapshotDependency => {
                shell.exec("npm uninstall my-lib --no-save)
                delete packageLock.dependencies[snapshotDependency];
                console.log("Dependency ")
            });
            fs.writeFileSync(lockFile, JSON.stringify(packageLock, null, 2));
        }
    }
};