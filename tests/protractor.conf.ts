import { Config } from 'protractor';

let SpecReporter = require('jasmine-spec-reporter').SpecReporter;

export let config: Config = {
  useAllAngular2AppRoots: true,
  getPageTimeout: 30000,
  directConnect: process.env.DIRECT_CONNECT === 'true',
  framework: 'jasmine',
  jasmineNodeOpts: {
    isVerbose: true,
    showColors: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 300000,
    print: function () {
    }
  },
  troubleshoot: true,
  capabilities: {
    browserName: 'chrome',
    shardTestFiles: true,
    loggingPrefs: {
      driver: 'WARNING',
      server: 'WARNING',
      browser: 'INFO'
    },
    chromeOptions: {
        args: process.env.HEADLESS_MODE === 'true'? ['--no-sandbox', '--headless'] : ['--no-sandbox']
    }
  },
  seleniumAddress: 'http://localhost:4444/wd/hub',
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
  }
};