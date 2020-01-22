const fs = require('fs');

module.exports = {
    syncVersions: (targetDir, version, nodeVersion) => {
        let packageJson = require(`${targetDir}/package.json`);
        let updated = false;

        console.log(`Initializing module with version: ${version} and node.js version: ${nodejsVersion}`);
        if (packageJson.version !== version) {
            packageJson.version = version;
            updated = true;
        }

        if (packageJson.engines.node !== `=${nodejsVersion}`) {
            packageJson.engines.node = `=${nodejsVersion}`;
            updated = true;
        }

        if (!updated) {
            console.log('package.json is up to date. No changes made.');
        } else {
            fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
            console.log('package.json updated.');
        }
    }
};