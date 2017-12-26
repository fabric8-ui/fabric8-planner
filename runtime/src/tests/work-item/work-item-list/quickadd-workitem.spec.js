/**
 * POC test for automated UI tests for Planner
 *  Story: Display and Update Work Item Details
 *  https://github.com/almighty/almighty-core/issues/296
 *
 * Note on screen resolutions - See: http://www.itunesextractor.com/iphone-ipad-resolution.html
 * Tests will be run on these resolutions:
 * - iPhone6s - 375x667
 * - iPad air - 768x1024
 * - Desktop -  1920x1080
 *
 * beforeEach will set the mode to phone. Any tests requiring a different resolution will must set explicitly.
 *
 * @author nverma
 */

var WorkItemListPage = require('./page-objects/work-item-list.page'),
  constants = require('./constants'),
  testSupport = require('./testSupport'),
  OpenShiftIoRHDLoginPage = require('./page-objects/openshift-io-RHD-login.page');

describe('Quickadd - Work item list', function () {
  var page, AUTH_TOKEN, REFRESH_TOKEN, until = protractor.ExpectedConditions;
//  var char255 = '<div *ngFor=let comment of workItem.relationalData.comments; let counter = index" class="comments-wrap">   +            <div *ngFor="let comment of workItem.relationalData?.comments?.slice().reverse()" class="comments-wrap">                  <div>                      <div class="user-avatar pull-left">                          <img id="{{"comment_avatar_" + counter}}" -                        class="user-assign-avatar pull-left"  +                               />';
  var char255 = 'abcde1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890';
  var char255Expected = '<div *ngFor=let comment of workItem.relationalData.comments; let counter = index" class="comments-wrap"> + <div *ngFor="let comment of workItem.relationalData?.comments?.slice().reverse()" class="comments-wrap"> <div> <div class="user-avatar pull-left"> <img id="{{"comment_avatar_" + counter}}" - class="user-assign-avatar pull-left" + />';

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

// March 28 - Failing due to: https://github.com/fabric8-ui/fabric8-planner/issues/1348
 it('Quickadd - Creating a new quick add work item and delete - desktop.', function () {
    testSupport.setBrowserMode('desktop');
    page.clickWorkItemQuickAdd();
    page.typeQuickAddWorkItemTitle('Quick Add and Delete');
    page.clickQuickAddSave().then(function() {
      expect(page.workItemTitle(page.firstWorkItem)).toBe('Quick Add and Delete');
      expect(page.workItemTitle(page.workItemByNumber(0))).toBe('Quick Add and Delete');

      //Commented Due to Delete is temporarily not supported
      
      // page.clickWorkItemKebabButton(page.firstWorkItem);
      // page.clickWorkItemKebabDeleteButton(page.firstWorkItem);
      // page.clickWorkItemPopUpDeleteConfirmButton().then(function() {
      //   browser.wait(until.textToBePresentInElement((page.firstWorkItem), "Quick Add and Delete" ), constants.WAIT, 'Failed to find text in workitem');
      //   expect(page.workItemTitle(page.firstWorkItem)).toBe('Quick Add and Delete');
      //   expect(page.workItemTitle(page.workItemByNumber(0))).toBe('Quick Add and Delete');
      // });

    });
  });

  it('Verify that data is persisted and is not truncated if text fields receive data with a length greater that 255 characters. - desktop.', function () {
    testSupport.setBrowserMode('desktop');
    page.clickWorkItemQuickAdd();
    page.typeQuickAddWorkItemTitle(char255);
    page.clickQuickAddSave().then(function() {
      expect(page.workItemTitle(page.firstWorkItem)).toBe(char255);
      expect(page.workItemTitle(page.workItemByNumber(0))).toBe(char255);
      //commented due to delete is temporarily removed
      // page.clickWorkItemKebabButton(page.firstWorkItem);

      // browser.wait(until.elementToBeClickable(page.workItemKebabDeleteButton(page.firstWorkItem)), constants.WAIT, 'Failed to find clickWorkItemKebabDeleteButton');
 
      // page.clickWorkItemKebabDeleteButton(page.firstWorkItem);

      // browser.wait(until.elementToBeClickable(page.workItemPopUpDeleteCancelConfirmButton), constants.WAIT, 'Failed to find workItemPopUpDeleteCancelConfirmButton');

      // page.clickWorkItemPopUpDeleteCancelConfirmButton().then(function() {
      //   browser.wait(until.textToBePresentInElement((page.firstWorkItem), char255Expected), constants.WAIT, 'Failed to text in workitem');
      //   expect(page.workItemTitle(page.firstWorkItem)).toBe(char255Expected);
      //   expect(page.workItemTitle(page.workItemByNumber(0))).toBe(char255Expected);
      // });
    });
  });

});
