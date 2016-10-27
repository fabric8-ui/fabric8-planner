exports.config = {
    useAllAngular2AppRoots: true,
    getPageTimeout: 30000,
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['src/tests/**/*.spec.js'],
    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    },
    capabilities: {
        'browserName': 'phantomjs',
        'phantomjs.binary.path': require('phantomjs').path,
        'phantomjs.ghostdriver.cli.args': ['--loglevel=DEBUG', '--webdriver-loglevel=ERROR', '--local-storage-path=/tmp/phantom_' + Math.random()]
    }
};