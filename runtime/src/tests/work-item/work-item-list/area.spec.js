/**Note on screen resolutions - See: http://www.itunesextractor.com/iphone-ipad-resolution.html
 * Tests will be run on these resolutions:
 * - iPhone6s - 375x667
 * - iPad air - 768x1024
 * - Desktop -  1920x1080
 *
 * beforeEach will set the mode to Desktop. Any tests requiring a different resolution will must set explicitly.
 *
 * @author naina-verma
 */

var WorkItemListPage = require('./page-objects/work-item-list.page'),
  constants = require('./constants'),
  testSupport = require('./testSupport'),
  OpenShiftIoRHDLoginPage = require('./page-objects/openshift-io-RHD-login.page');

describe('Area tests :: ', function () {
  var page;
  var until = protractor.ExpectedConditions;
  // TODO find a better way to fetch this
  var EXAMPLE_USER = browser.params.fullName;
  var SPACE_NAME = browser.params.spaceName;
  var AREA_1_TITLE = '/' + SPACE_NAME + '/Area_1';
  var AREA_2_TITLE = '/' + SPACE_NAME + '/Area_2';
  var ITERATION_1_TITLE = '/' + SPACE_NAME + '/Iteration_1';
  var ITERATION_2_TITLE = '/' + SPACE_NAME + '/Iteration_2';
  var NEW_WORK_ITEM_TITLE_1 = "New Work Item 1"
  var NEW_WORK_ITEM_TITLE_2 = "New Work Item 2"
  var WORK_ITEM_TITLE = "Workitem_Title_20";
  var WORK_ITEM_TITLE_1 = "Workitem_Title_19";
  var WORKITEM_0_ID = 'id0';
  var WORKITEM_1_ID = 'id1';
  var AUTH_TOKEN = "";
  var REFRESH_TOKEN = "";

  beforeEach(function () {
    browser.ignoreSynchronization = false;
    testSupport.setBrowserMode('desktop');
    if (AUTH_TOKEN && REFRESH_TOKEN){
      console.log("AUTH and REFRESH tokens found. Skipping login.")
      page = new WorkItemListPage(this.AUTH_TOKEN, this.REFRESH_TOKEN);
    } else {
      page = new WorkItemListPage()
    }
  });

  /* Simple test for registered user */
  it("should perform - LOGIN", function() {
    /* Login to SUT */
    page.clickLoginButton();
    browser.ignoreSynchronization = true;
    var RHDpage = new OpenShiftIoRHDLoginPage();
    RHDpage.doLogin(browser);
    browser.executeScript("return window.localStorage.getItem('auth_token');").then(function(val) {
      this.AUTH_TOKEN = val;
    });
    browser.executeScript("return window.localStorage.getItem('refresh_token');").then(function(val) {
      this.REFRESH_TOKEN = val
    });
  });

  it('Verify Area elements are present -desktop ', function() {
    var detailPage = page.clickWorkItem(page.firstWorkItem);
    browser.wait(until.elementToBeClickable(detailPage.areaLabel), constants.WAIT, 'Failed to find areaLabel');
    expect(detailPage.AreaSelect.isPresent()).toBe(true);
  });

  it('Adding area to a WI -desktop ', function() {
    var detailPage = page.clickWorkItem(page.firstWorkItem);
    browser.wait(until.elementToBeClickable(detailPage.areaLabel), constants.WAIT, 'Failed to find areaLabel');
    detailPage.clickAreaSelect();
    detailPage.searchAreaInput(AREA_1_TITLE);
    detailPage.selectArea(AREA_1_TITLE);
    expect(detailPage.saveAreasButton().isPresent()).toBe(true);

    detailPage.SaveAreas();
    browser.wait(until.elementToBeClickable(detailPage.AreaSelect), constants.WAIT, 'Failed to find area');
    expect(detailPage.AreaSelect.getText()).toBe(AREA_1_TITLE);
  });

  it('Updating area to a WI -desktop ', function() {
    var detailPage = page.clickWorkItemTitle(WORK_ITEM_TITLE_1);
    browser.wait(until.elementToBeClickable(detailPage.workItemDetailCloseButton), constants.WAIT, 'Failed to find areaLabel');
    detailPage.clickAreaSelect();
    detailPage.searchAreaInput(AREA_1_TITLE);
    detailPage.selectArea(AREA_1_TITLE);
    expect(detailPage.saveAreasButton().isPresent()).toBe(true);
    detailPage.SaveAreas();

    browser.wait(until.elementToBeClickable(detailPage.AreaSelect), constants.WAIT, 'Failed to find area');
    expect(detailPage.AreaSelect.getText()).toBe(AREA_1_TITLE);
    detailPage.clickAreaSelect();
    detailPage.searchAreaInput(AREA_2_TITLE);
    detailPage.selectArea(AREA_2_TITLE);
    detailPage.SaveAreas();
    browser.wait(until.elementToBeClickable(detailPage.AreaSelect), constants.WAIT, 'Failed to find area');
    expect(detailPage.AreaSelect.getText()).toBe(AREA_2_TITLE);
  });

  it('Try Removing area from a WI -desktop ', function() {
    var detailPage = page.clickWorkItem(page.firstWorkItem);
    browser.wait(until.elementToBeClickable(detailPage.areaLabel), constants.WAIT, 'Failed to find areaLabel');
    detailPage.clickAreaSelect();
    detailPage.searchAreaInput(AREA_1_TITLE);
    detailPage.selectArea(AREA_1_TITLE);
    expect(detailPage.saveAreasButton().isPresent()).toBe(true);
    detailPage.SaveAreas();

    browser.wait(until.elementToBeClickable(detailPage.AreaSelect), constants.WAIT, 'Failed to find area');
    expect(detailPage.AreaSelect.getText()).toBe(AREA_1_TITLE);
    detailPage.clickAreaSelect();
    detailPage.ClosekAreas();
    expect(detailPage.AreaSelect.getText()).toBe(AREA_1_TITLE);
    });
});
