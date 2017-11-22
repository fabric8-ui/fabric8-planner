/**
 * Script to log the test user into the test setup
 *
 * Note on screen resolutions - See: http://www.itunesextractor.com/iphone-ipad-resolution.html
 * Tests will be run on these resolutions:
 * - iPhone6s - 375x667
 * - iPad air - 768x1024
 * - Desktop -  1920x1080
 *
 * beforeEach will set the mode to phone. Any tests requiring a different resolution will must set explicitly.
 *
 * @author rgarg@redhat.com
 */

var WorkItemListPage = require('./page-objects/work-item-list.page'),
  OpenShiftIoRHDLoginPage = require('./page-objects/openshift-io-RHD-login.page'),
  testSupport = require('./testSupport'),
  constants = require('./constants');

describe('Work item list', function () {
  var page, items, browserMode;

  var until = protractor.ExpectedConditions;

  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    page = new WorkItemListPage();
    browser.ignoreSynchronization = true;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 6000000;   /* 10 minutes */
  });

  /* Simple test for registered user */
  it("should perform - LOGIN", function() {
    console.log ("Login test for target URL: " + browser.params.target.url);
    /* Login to SUT */
    page.clicklocalLoginButton();
    var RHDpage = new OpenShiftIoRHDLoginPage();
    RHDpage.doLogin(browser);
    browser.sleep(constants.LONG_WAIT);
  });

});