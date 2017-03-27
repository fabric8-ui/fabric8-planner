exports.config = {
    useAllAngular2AppRoots: true,
    getPageTimeout: 30000,
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['src/tests/**/*.spec.js'],
    exclude: ['src/tests/**/EE/*.spec.js', 'src/tests/**/TBD/*.spec.js', 'src/tests/**/orderOfExecution.spec.js', 'src/tests/**/work-item-timeStamp.spec.js', 'src/tests/**/testHelpers*.spec.js', 'src/tests/**/unauthorizeduser*.spec.js'],
    suites: {
    smokeTest: 'src/tests/**/smokeTest.spec.js'
    },
    jasmineNodeOpts: {
        defaultTimeoutInterval: 60000
    },

  capabilities: {  
    'browserName': 'chrome',
    'chromeOptions': {
        'args': ['--window-size=1440,1024', '--test-type', '--no-sandbox']
    }
} 
};  