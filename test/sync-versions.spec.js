const fs = require('fs');

const { syncVersions } = require('../src/sync-versions');

describe('Testing syncVersions modifies version and node engine when provided', () => {
    const consoleSpy = jest.spyOn(console, 'log');

    beforeEach(() => {
        fs.copyFileSync('test/package.sample.json', 'test/package.json')
    });

    afterEach(() => {
        fs.unlinkSync('test/package.json');
        jest.resetAllMocks()
    });

    it('should not change anything if versions are the same and then log nothing changed', () => {
        const version = '1.0.0';
        const nodeVersion = '12.14.0';

        syncVersions(__dirname, version, nodeVersion);
        const packageJson = require(`${__dirname}/package.json`);

        expect(packageJson.version).toEqual(version);
        expect(packageJson.engines.node).toEqual(`=${nodeVersion}`);
        expect(consoleSpy).toHaveBeenCalledTimes(2);
        expect(consoleSpy).toHaveBeenNthCalledWith(1, `Initializing module with version: ${version} and node.js version: ${nodeVersion}`);
        expect(consoleSpy).toHaveBeenNthCalledWith(2, 'package.json is up to date. No changes made.');
    });

    it('should modify versions and log it\'s been updated', () => {
        const version = '1.0.1';
        const nodeVersion = '12.14.1';

        syncVersions(__dirname, version, nodeVersion);
        const packageJson = require(`${__dirname}/package.json`);

        expect(packageJson.version).toEqual(version);
        expect(packageJson.engines.node).toEqual(`=${nodeVersion}`);
        expect(consoleSpy).toHaveBeenCalledTimes(2);
        expect(consoleSpy).toHaveBeenNthCalledWith(1, `Initializing module with version: ${version} and node.js version: ${nodeVersion}`);
        expect(consoleSpy).toHaveBeenNthCalledWith(2, 'package.json updated.');
    });

    it('should also update when changing just one version', () => {
        const version = '1.0.1';
        const nodeVersion = '12.14.0';

        syncVersions(__dirname, version, nodeVersion);
        const packageJson = require(`${__dirname}/package.json`);

        expect(packageJson.version).toEqual(version);
        expect(consoleSpy).toHaveBeenNthCalledWith(2, 'package.json updated.');
    });
});