const fs = require('fs');
const shell = require(`shelljs`);

const { error } = require('./error-handler');


module.exports = {
    nextSnapshotVersion: targetDir => {
        const packageFile = `${targetDir}/package.json`;
        let package = JSON.parse(fs.readFileSync(packageFile));
        const matchResult = package.version.match(/^(.*-SNAPSHOT.)(\d+)/);
        if (matchResult && matchResult.length == 3) {
            const currentSnapshotVersion = matchResult[2];
            const newSnapshotVersion = `${matchResult[1]}${parseInt(currentSnapshotVersion) + 1}`;
            package.version = newSnapshotVersion;
            fs.writeFileSync(packageFile, JSON.stringify(package, null, 2));
            console.log(`Increased SNAPSHOT version number to ${newSnapshotVersion} on ${packageFile}`)
            shell.exec("npm i");
        } else {
            console.log(`${packageFile} does not have a SNAPSHOT version`);
        }
    },
    deploy: (registryUrl, targetDir) => {
        try {
            // Check it is a snapshot version
            let package = JSON.parse(fs.readFileSync(`${targetDir}/package.json`));
            if (package.version.includes("-SNAPSHOT.")) {
                shell.exec(`npm publish --registry ${registryUrl}`);
                this.nextSnapshotVersion(targetDir);
            } else {
                error(`This package with version ${package.version} is not a SNAPSHOT version`);
            }
        } catch (e) {
            error(e);
        }
    },
    release: (registryUrl, targetDir) => {

    }
};