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
  var page, AUTH_TOKEN, REFRESH_TOKEN;
  var until = protractor.ExpectedConditions;

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
    detailPage.searchAreaInput(constants.AREA_1_TITLE);
    detailPage.selectArea(constants.AREA_1_TITLE);
    expect(detailPage.saveAreasButton().isPresent()).toBe(true);

    detailPage.SaveAreas();
    browser.wait(until.elementToBeClickable(detailPage.AreaSelect), constants.WAIT, 'Failed to find area');
    expect(detailPage.AreaSelect.getText()).toBe(constants.AREA_1_TITLE);
  });

  it('Updating area to a WI -desktop ', function() {
    var detailPage = page.clickWorkItemTitle(constants.WORK_ITEM_TITLE_1);
    browser.wait(until.elementToBeClickable(detailPage.workItemDetailCloseButton), constants.WAIT, 'Failed to find areaLabel');
    detailPage.clickAreaSelect();
    detailPage.searchAreaInput(constants.AREA_1_TITLE);
    detailPage.selectArea(constants.AREA_1_TITLE);
    expect(detailPage.saveAreasButton().isPresent()).toBe(true);
    detailPage.SaveAreas();

    browser.wait(until.elementToBeClickable(detailPage.AreaSelect), constants.WAIT, 'Failed to find area');
    expect(detailPage.AreaSelect.getText()).toBe(constants.AREA_1_TITLE);
    detailPage.clickAreaSelect();
    detailPage.searchAreaInput(constants.AREA_2_TITLE);
    detailPage.selectArea(constants.AREA_2_TITLE);
    detailPage.SaveAreas();
    browser.wait(until.elementToBeClickable(detailPage.AreaSelect), constants.WAIT, 'Failed to find area');
    expect(detailPage.AreaSelect.getText()).toBe(constants.AREA_2_TITLE);
  });

  it('Try Removing area from a WI -desktop ', function() {
    var detailPage = page.clickWorkItem(page.firstWorkItem);
    browser.wait(until.elementToBeClickable(detailPage.areaLabel), constants.WAIT, 'Failed to find areaLabel');
    detailPage.clickAreaSelect();
    detailPage.searchAreaInput(constants.AREA_1_TITLE);
    detailPage.selectArea(constants.AREA_1_TITLE);
    expect(detailPage.saveAreasButton().isPresent()).toBe(true);
    detailPage.SaveAreas();

    browser.wait(until.elementToBeClickable(detailPage.AreaSelect), constants.WAIT, 'Failed to find area');
    expect(detailPage.AreaSelect.getText()).toBe(constants.AREA_1_TITLE);
    detailPage.clickAreaSelect();
    detailPage.ClosekAreas();
    expect(detailPage.AreaSelect.getText()).toBe(constants.AREA_1_TITLE);
    });
});
