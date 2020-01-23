const fs = require('fs');
const shell = require(`shelljs`);

const { nextSnapshotVersion } = require('../src/release-managemement');

describe('Testing release management nextSnapshotVersion', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const shellSpy = jest.spyOn(shell, 'exec').mockImplementation(console.debug);

    beforeEach(() => {
        fs.copyFileSync('test/package.sample.json', 'test/package.json')
    });

    afterEach(() => {
        fs.unlinkSync('test/package.json');
        jest.resetAllMocks()
    });

    it('should console log that there is no SNAPSHOT version', () => {
        const packageFile = `${__dirname}/package.json`;

        nextSnapshotVersion(__dirname);

        expect(consoleSpy).toHaveBeenCalledWith(`${packageFile} does not have a SNAPSHOT version`);
    });

    it('should increase SNAPSHOT version and install', () => {
        const packageFile = `${__dirname}/package.json`;
        let packageJson = JSON.parse(fs.readFileSync(packageFile));
        packageJson.version = '1.0.0-SNAPSHOT.1';
        fs.writeFileSync(packageFile, JSON.stringify(packageJson, null, 2));

        nextSnapshotVersion(__dirname);

        expect(consoleSpy).toHaveBeenCalledWith(`Increased SNAPSHOT version number to 1.0.0-SNAPSHOT.2 on ${packageFile}`);
        expect(shellSpy).toHaveBeenCalledWith('npm i');
    });

    it('should increase SNAPSHOT numerically after 9', () => {
        const packageFile = `${__dirname}/package.json`;
        let packageJson = JSON.parse(fs.readFileSync(packageFile));
        packageJson.version = '1.0.0-SNAPSHOT.9';
        fs.writeFileSync(packageFile, JSON.stringify(packageJson, null, 2));

        nextSnapshotVersion(__dirname);

        expect(consoleSpy).toHaveBeenCalledWith(`Increased SNAPSHOT version number to 1.0.0-SNAPSHOT.10 on ${packageFile}`);
    });
});