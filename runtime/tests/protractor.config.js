let SpecReporter = require('jasmine-spec-reporter').SpecReporter;

exports.config = {
    useAllAngular2AppRoots: true,
    getPageTimeout: 30000,
    directConnect: process.env.DIRECT_CONNECT === 'true',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['./../src/tests/**/*.spec.js'],
    exclude: ['./../src/tests/**/EXCLUDED/*.spec.js'],
    suites: {
        smokeTest: './../src/tests/**/smokeTest.spec.js',
        fullTest:  './../src/tests/**/*.spec.js'
    },
    jasmineNodeOpts: {
        isVerbose: true,
        showColors: true,
        includeStackTrace: true,
        defaultTimeoutInterval: 60000,
        print: function () {
        }
    },
    troubleshoot: true,
    capabilities: {
      'browserName': 'chrome',
      'shardTestFiles': true,
      'maxInstances': 4,        
      'loggingPrefs': {
        'driver': 'WARNING',
        'server': 'WARNING',
        'browser': 'INFO'
      },
      'chromeOptions': {
        'args': process.env.HEADLESS_MODE === 'true'? ['--no-sandbox', '--headless'] : ['--no-sandbox']
      }
    },

    onPrepare: function () {
        jasmine.getEnv().addReporter(new SpecReporter({
        spec: {
            displayStacktrace: true,
            displayDuration: true,
        },
        summary: {
            displayDuration: true
        }
      }));
      if (process.env.NODE_ENV == "inmemory") {
        global.PLANNER_URL = browser.baseUrl + '/plan/list'
      } else {
        global.SPACE_NAME = process.env.SPACE_NAME;
        global.PLANNER_URL = browser.baseUrl + '/' + process.env.USER + '/' + SPACE_NAME + '/plan';
      }
      global.USER_FULL_NAME = process.env.FULL_NAME || "Example User 0";
      token = encodeURIComponent(JSON.stringify({
        access_token: process.env.AUTH_TOKEN || "somerandomtoken",
        expires_in: 1800,
        refresh_expires_in: 1800,
        refresh_token: process.env.REFRESH_TOKEN || "somerandomtoken",
        token_type: "bearer"
      }));
      // Bypass login by supplying auth and refresh token
      browser.get(browser.baseUrl + "/?token_json=" + token);
    }
};
