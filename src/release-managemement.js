const fs = require('fs');
const shell = require(`shelljs`);

const { error } = require('./error-handler');


module.exports = {
    nextSnapshotVersion: targetDir => {
        const packageFile = `${targetDir}/package.json`;
        let packageJson = JSON.parse(fs.readFileSync(packageFile));
        const matchResult = packageJson.version.match(/^(.*-SNAPSHOT.)(\d+)/);
        if (matchResult && matchResult.length === 3) {
            const currentSnapshotVersion = matchResult[2];
            const newSnapshotVersion = `${matchResult[1]}${parseInt(currentSnapshotVersion) + 1}`;
            packageJson.version = newSnapshotVersion;
            fs.writeFileSync(packageFile, JSON.stringify(packageJson, null, 2));
            console.log(`Increased SNAPSHOT version number to ${newSnapshotVersion} on ${packageFile}`)
            shell.exec("npm i");
        } else {
            console.log(`${packageFile} does not have a SNAPSHOT version`);
        }
    },
    deploy: (registryUrl, targetDir) => {
        try {
            // Check it is a snapshot version
            let packageJson = JSON.parse(fs.readFileSync(`${targetDir}/package.json`));
            if (packageJson.version.includes("-SNAPSHOT.")) {
                shell.exec(`npm publish --registry ${registryUrl}`);
                module.exports.nextSnapshotVersion(targetDir);
            } else {
                error(`This package with version ${packageJson.version} is not a SNAPSHOT version`);
            }
        } catch (e) {
            error(e);
        }
    },
    release: (registryUrl, targetDir) => {

    }
};