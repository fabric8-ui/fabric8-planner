/**
 * POC test for automated UI tests for Planner
 *  
 * Note on screen resolutions - See: http://www.itunesextractor.com/iphone-ipad-resolution.html
 * Tests will be run on these resolutions:
 * - iPhone6s - 375x667
 * - iPad air - 768x1024
 * - Desktop -  1920x1080
 * 
 * beforeEach will set the mode to phone. Any tests requiring a different resolution will must set explicitly. 
 * 
 * @author ldimaggi, rgarg
 * 
 * March 28, 2017 - This test is excluded from the functional tests. The supporting mock code 
 * functions correctly when filters are defined and executed manually in the Chrome browser.
 * When the test is run under Protractor, the filtering is not performed. 
 * 
 */

var WorkItemListPage = require('./page-objects/work-item-list.page'),
  testSupport = require('./testSupport'),
  CommonPage = require('./page-objects/common.page'),
  constants = require('./constants'),
  OpenShiftIoRHDLoginPage = require('./page-objects/openshift-io-RHD-login.page');

describe('Basic filter workitems by assignee Test', function () {
  var page, AUTH_TOKEN, REFRESH_TOKEN;
  var until = protractor.ExpectedConditions;

  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    if (AUTH_TOKEN && REFRESH_TOKEN){
      console.log("AUTH and REFRESH tokens found. Skipping login.")
      page = new WorkItemListPage(this.AUTH_TOKEN, this.REFRESH_TOKEN);
    } else {
      page = new WorkItemListPage()
    }
    browser.ignoreSynchronization = false;
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

  it ('should add workitems in the context of current Assignee filter', function() {
    /*Set filter by Assignee*/
    page.clickWorkItemFilterFieldsPulldown();
    page.clickFilterByAssignee();
    page.clickWorkItemFilterPulldownDefault();
    page.clickFilterAssignToMe();

    browser.wait(until.presenceOf(page.currentActiveFilter), constants.WAIT, 'Failed to find active filter');  
    page.clickWorkItemQuickAdd();
    page.typeQuickAddWorkItemTitle(constants.NEW_WORK_ITEM_TITLE_1);
    page.clickQuickAddSave().then(function() {
      var detailPage = page.clickWorkItemTitle(constants.NEW_WORK_ITEM_TITLE_1);
      expect(detailPage.details_assigned_user().getText()).toContain(constants.EXAMPLE_USER);
      detailPage.clickWorkItemDetailCloseButton();
    })
  });

  it ('should add workitems in the context of current Area filter', function() {
    /*Set filter by Area*/
    page.clickWorkItemFilterFieldsPulldown();
    page.clickFilterByArea();
    page.clickWorkItemFilterPulldownEdited();
    page.clickFilterAssignArea('Area_1');

    browser.wait(until.presenceOf(page.currentActiveFilter), constants.WAIT, 'Failed to find active filter');  
      page.clickWorkItemQuickAdd();
      page.typeQuickAddWorkItemTitle(constants.NEW_WORK_ITEM_TITLE_1);
      page.clickQuickAddSave().then(function() {
        var detailPage = page.clickWorkItemTitle(constants.NEW_WORK_ITEM_TITLE_1);
        expect(detailPage.AreaSelect.getText()).toContain(constants.AREA_1_TITLE);
        detailPage.clickWorkItemDetailCloseButton();
      })
  });

    /* The following 2 tests are commented out due to bug where quick add button is not displayed  
       https://openshift.io/openshiftio/openshiftio/plan/detail/1522  */
//       
//    it ('should add workitems in the context of current Workitem Type filter', function() {
//    /*Set filter by Workitem Type*/
//    page.clickWorkItemFilterFieldsPulldown();
//    page.clickFilterByWorkitemType();
//    page.clickWorkItemFilterPulldownEdited();
//    page.clickFilterAssignWIType();
//
//    browser.wait(until.presenceOf(page.currentActiveFilter), constants.WAIT, 'Failed to find active filter');  
//    expect (page.allWorkItems.count()).toBe(2).then(function(){
//      page.clickWorkItemQuickAdd();
//      page.typeQuickAddWorkItemTitle(WORK_ITEM_TITLE);
//      page.clickQuickAddSave().then(function() {
//        page.workItemViewId(page.workItemByTitle(WORK_ITEM_TITLE)).getText().then(function (text) {
//          var detailPage = page.clickWorkItemTitle(page.workItemByTitle(WORK_ITEM_TITLE), text);
//          expect(detailPage.workItemType().getText()).toContain(WORK_ITEM_TYPE);
//          detailPage.clickWorkItemDetailCloseButton();
//        })
//      })
//    })
//  });
//
//  it ('should add workitems in the context of current Assignee+Area+WiType filters', function() {
//    /*Set filter by Assignee*/
//    page.clickWorkItemFilterFieldsPulldown();
//    page.clickFilterByAssignee();
//    page.clickWorkItemFilterPulldownDefault();
//    page.clickFilterAssignToMe();
//
//    /*Set filter by Area*/
//    page.clickWorkItemFilterFieldsPulldown();
//    page.clickFilterByArea();
//    page.clickWorkItemFilterPulldownEdited();
//    page.clickFilterAssignArea();
//
//    /*Set filter by Workitem Type*/
//    page.clickWorkItemFilterFieldsPulldown();
//    page.clickFilterByWorkitemType();
//    page.clickWorkItemFilterPulldownEdited();
//    page.clickFilterAssignWIType();
//
//    browser.wait(until.presenceOf(page.currentActiveFilter), constants.WAIT, 'Failed to find active filter');  
//    expect (page.allWorkItems.count()).toBe(0).then(function(){
//      page.clickWorkItemQuickAdd();
//      page.typeQuickAddWorkItemTitle(WORK_ITEM_TITLE);
//      page.clickQuickAddSave().then(function() {
//        page.workItemViewId(page.workItemByTitle(WORK_ITEM_TITLE)).getText().then(function (text) {
//          var detailPage = page.clickWorkItemTitle(page.workItemByTitle(WORK_ITEM_TITLE), text);
//          expect(detailPage.details_assigned_user().getText()).toContain(EXAMPLE_USER_0_VERIFY);
//          expect(detailPage.AreaSelect().getText()).toContain(AREA_0_TITLE);
//          expect(detailPage.workItemType().getText()).toContain(WORK_ITEM_TYPE);
//          detailPage.clickWorkItemDetailCloseButton();
//        })
//      })
//    })
//  });

  // TDO - Add more tests after enhancement for dynamic refresh of filters is implemented
  // see: https://github.com/fabric8io/fabric8-planner/issues/791
});
