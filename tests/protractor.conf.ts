import { SpecReporter } from 'jasmine-spec-reporter';
import { browser, Config } from 'protractor';

// Workaround to get global var in typescript
const globalAny: any = global;
const token: string = '';

var data = {
  'browserSDD': {
    'dropdownareaTitle1': 'Area_1',
    'dropdownareaTitle2': 'Area_2',
    'dropdownIteration1': 'Iteration_1/Iteration1_1',
    'dropdownIteration_2': 'Iteration_2',
    'areaTitle1': '/' + process.env.SPACE_NAME + '/Area_1',
    'areaTitle2': '/' + process.env.SPACE_NAME + '/Area_2',
    'iteration1': '/' + process.env.SPACE_NAME + '/Iteration_1/Iteration1_1',
    'iteration2': '/' + process.env.SPACE_NAME + '/Iteration_2',
    'workitem': { title : 'new detail workItem', type: 'Scenario'}
  },
  'browserAgile': {
    'dropdownareaTitle1': 'Area_6',
    'dropdownareaTitle2': 'Area_7',
    'dropdownIteration1': 'Iteration_1/Iteration1_1',
    'dropdownIteration_2': 'Iteration_2',
    'areaTitle1': '/' + process.env.SPACE_NAME_SCRUM + '/Area_6',
    'areaTitle2': '/' + process.env.SPACE_NAME_SCRUM + '/Area_7',
    'iteration1': '/' + process.env.SPACE_NAME_SCRUM + '/Iteration_1/Iteration1_1',
    'iteration2': '/' + process.env.SPACE_NAME_SCRUM + '/Iteration_2',
    'workitem': { title : 'new detail workItem', type: 'Task'}
  }
};

// Validate test config.
function validate_config() {
  // Mysteriously, NODE_ENV is set to "test". NODE_ENV should not have been set to "test"
  // Unset NODE_ENV variable.
  process.env.NODE_ENV = '';
  process.env.SPACE_NAME || new Error('SPACE_NAME variable not set');
  process.env.SPACE_NAME_SCRUM || new Error('SPACE_NAME_SCRUM variable not set');
  process.env.USER_NAME || new Error('USER_NAME variable not set');
  process.env.USER_FULLNAME || new Error('USER_FULLNAME variable not set');
  process.env.AUTH_TOKEN || new Error('TOKEN (Auth token) variable not set');
  process.env.REFRESH_TOKEN || new Error('OFFLINE_TOKEN (Refresh token) variable not set');
}

// Full protractor configuration file reference could be found here:
// https://github.com/angular/protractor/blob/master/lib/config.ts
let conf: Config = {
  framework: 'jasmine2',

  jasmineNodeOpts: {
    showColors: true,
    silent: true,
    isVerbose: true,
    defaultTimeoutInterval: 60 * 60 * 1000 // 60 mins for spec to run
  },

  directConnect: process.env.DIRECT_CONNECTION === 'true',
  useAllAngular2AppRoots: true,
  getPageTimeout: 3 * 60 * 1000, // must load within 3 min
  seleniumAddress: 'http://localhost:4444/wd/hub',

  // Ref: https://github.com/angular/protractor/tree/master/exampleTypescript/asyncAwait
  SELENIUM_PROMISE_MANAGER: false,

  specs: [
    'specs/smoke/smokeTest.spec.js',
    'specs/*.js'
  ],
  suites: {
    smokeTest: ['specs/smoke/smokeTest.spec.js'],
    quickPreviewTest: ['specs/**/quickPreview.spec.js'],
    workItemTableTest: ['specs/**/workItemTableTest.spec.js'],
    fullTest: ['specs/**/*.spec.js']
  },

  // see: https://github.com/angular/protractor/blob/master/docs/timeouts.md
  multiCapabilities: [
    {
      'browserName': 'chrome',
      chromeOptions: {
        args: process.env.HEADLESS_MODE === 'true' ? ['--no-sandbox', '--headless'] : ['--no-sandbox']
      },
       name: 'browserSDD'
      },
    {
      'browserName': 'chrome',
      chromeOptions: {
        args: process.env.HEADLESS_MODE === 'true' ? ['--no-sandbox', '--headless'] : ['--no-sandbox']
      },
       name: 'browserAgile'
    }
  ],
  // capabilities: {
  //   browserName: 'chrome',
  //   chromeOptions: {
  //     args: process.env.HEADLESS_MODE === 'true' ? ['--no-sandbox', '--headless'] : ['--no-sandbox']
  //   }
  // },

  // Assign the test reporter to each running instance
  onPrepare: function() {
    validate_config();
    browser.getProcessedConfig().then(function(config) {
      switch (config.capabilities.name) {
          case 'browserSDD':
            browser.baseUrl = browser.baseUrl + '/' + process.env.USER_NAME + '/' + process.env.SPACE_NAME + '/plan';
            break;
          case 'browserAgile':
            browser.baseUrl = browser.baseUrl + '/' + process.env.USER_NAME + '/' + process.env.SPACE_NAME_SCRUM + '/plan';
            break;
          default:
            browser.baseUrl = browser.baseUrl + '/' + process.env.USER_NAME + '/' + process.env.SPACE_NAME + '/plan';
          break;
      }
      browser.browserName = config.capabilities.name;
      browser.dropdownareaTitle1 = data[browser.browserName].dropdownareaTitle1;
      browser.dropdownareaTitle2 = data[browser.browserName].dropdownareaTitle2;
      browser.dropdownIteration1 = data[browser.browserName].dropdownIteration1;
      browser.dropdownIteration_2 = data[browser.browserName].dropdownIteration_2;
      browser.areaTitle1 = data[browser.browserName].areaTitle1;
      browser.areaTitle2 = data[browser.browserName].areaTitle2;
      browser.iteration1 = data[browser.browserName].iteration1;
      browser.iteration2 = data[browser.browserName].iteration2;
      browser.workitem = data[browser.browserName].workitem;
    });

    jasmine.getEnv().addReporter(
      new SpecReporter({
        spec: {
          displayStacktrace: true,
          displayDuration: true
        },
        summary: {
          displayDuration: true
        }
      })
    );
    // Disable control flow
    browser.ignoreSynchronization = true;
    // browser.baseUrl = browser.baseUrl + '/' + process.env.USER_NAME + '/' + process.env.SPACE_NAME_SCRUM + '/plan';
    browser.token = encodeURIComponent(JSON.stringify({
      access_token: process.env.AUTH_TOKEN,
      expires_in: 1800,
      refresh_token: process.env.REFRESH_TOKEN,
      token_type: 'bearer'
    }));
  }
};

exports.config = conf;
