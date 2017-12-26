/**
 * POC test for automated UI tests for Planner
 *  Story: Display and Update Work Item Details
 *  https://github.com/almighty/almighty-core/issues/298
 *
 * Note on screen resolutions - See: http://www.itunesextractor.com/iphone-ipad-resolution.html
 * Tests will be run on these resolutions:
 * - iPhone6s - 375x667
 * - iPad air - 768x1024
 * - Desktop -  1920x1080
 *
 * beforeEach will set the mode to desktop. Any tests requiring a different resolution will must set explicitly.
 *
 * @author naina-verma
 */

var WorkItemListPage = require('./page-objects/work-item-list.page'),
  testSupport = require('./testSupport'),
  constants = require('./constants'),
  OpenShiftIoRHDLoginPage = require('./page-objects/openshift-io-RHD-login.page');

describe('Link item ', function () {
  var page, AUTH_TOKEN, REFRESH_TOKEN, until = protractor.ExpectedConditions;

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

  it('Create a link item planner to planner - Desktop', function () {
    var detailPage = page.clickWorkItemTitle(constants.WORK_ITEM_TITLE);
    expect(detailPage.commentDiv().isPresent()).toBe(true);
    expect(detailPage.linkItemHeaderCaret().isPresent()).toBe(true);

    browser.wait(until.elementToBeClickable(detailPage.linkItemHeaderCaret()), constants.WAIT, 'Link icon is not clickable');
    detailPage.linkItemHeaderCaret().click();
    detailPage.clickCreateLinkButton();
    detailPage.clickLinkDropDown();
    detailPage.linkTypeDropDownListString("is related to").click();

    detailPage.setSearchLinkItem(constants.WORK_ITEM_TITLE_2);
    detailPage.clickOnLinkBind();
    expect(detailPage.linkTitle()).toBe(constants.WORK_ITEM_TITLE_2);
    expect(detailPage.linkclose("0").isPresent()).toBe(true);
    expect(detailPage.linkTotalByTypes()).toBe("1");
   });

  it('Read a link item - Desktop', function () {
    var detailPage = page.clickWorkItemTitle(constants.WORK_ITEM_TITLE_1);
    expect(detailPage.commentDiv().isPresent()).toBe(true);
    expect(detailPage.linkItemHeaderCaret().isPresent()).toBe(true);

    browser.wait(until.elementToBeClickable(detailPage.linkItemHeaderCaret()), constants.WAIT, 'Link icon is not clickable');
    detailPage.linkItemHeaderCaret().click();
    expect(detailPage.linkTitle()).toBe(constants.WORK_ITEM_TITLE_3);
    expect(detailPage.linkItemTotalCount().getText()).toBe('1');
    expect(detailPage.linkclose("0").isPresent()).toBe(true);
   });

  it('Delete link and check if it exists in list or not - Desktop', function () {
    var detailPage = page.clickWorkItemTitle(constants.WORK_ITEM_TITLE_1);
    expect(detailPage.commentDiv().isPresent()).toBe(true);
    expect(detailPage.linkItemHeaderCaret().isPresent()).toBe(true);

    browser.wait(until.elementToBeClickable(detailPage.linkItemHeaderCaret()), constants.WAIT, 'Link icon is not clickable');
    detailPage.linkItemHeaderCaret().click();
    expect(detailPage.linkTitle()).toBe(constants.WORK_ITEM_TITLE_3);
    expect(detailPage.linkclose("0").isPresent()).toBe(true);
    detailPage.linkclose("0").click();
    expect(detailPage.linkclose("0").isPresent()).toBe(false);
    expect(detailPage.createLinkButton.isPresent()).toBe(true);
   });

  it('Update link child and check if it exists in list or not - Desktop', function () {
    var detailPage = page.clickWorkItemTitle(constants.WORK_ITEM_TITLE_4);
    detailPage.clickWorkItemDetailTitleClick();
    detailPage.setWorkItemDetailTitle("0", true); // Update title
    detailPage.clickWorkItemTitleSaveIcon();
    detailPage.clickWorkItemDetailCloseButton();
    var detailPage = page.clickWorkItemTitle(constants.WORK_ITEM_TITLE_3);
    expect(detailPage.commentDiv().isPresent()).toBe(true);
    expect(detailPage.linkItemHeaderCaret().isPresent()).toBe(true);
    detailPage.linkItemHeaderCaret().click();
    expect(detailPage.linkTitle()).toBe(constants.WORK_ITEM_TITLE_4 + '0'); // Verify new title
    expect(detailPage.linkclose("0").isPresent()).toBe(true);
    detailPage.linkclose("0").click();
    expect(detailPage.linkclose("0").isPresent()).toBe(false);
    expect(detailPage.createLinkButton.isPresent()).toBe(true);
   });

  it('Check the elements of link item div are visible - Desktop', function () {
    var detailPage = page.clickWorkItemTitle(constants.WORK_ITEM_TITLE);
    expect(detailPage.commentDiv().isPresent()).toBe(true);
    expect(detailPage.linkItemHeaderCaret().isPresent()).toBe(true);

    browser.wait(until.elementToBeClickable(detailPage.linkItemHeaderCaret()), constants.WAIT, 'Link icon is not clickable');
    detailPage.linkItemHeaderCaret().click();
    expect(detailPage.linkItemTitle()).toBe("This item, " + constants.WORK_ITEM_TITLE);
    expect(detailPage.checkLinkDropDown.isPresent()).toBe(true);
   });

});


