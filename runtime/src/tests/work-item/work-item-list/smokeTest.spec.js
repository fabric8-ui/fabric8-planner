/**
 * POC test for automated UI tests for Planner
 *  Story: Display and Update Work Item Details
 *  https://github.com/almighty/almighty-core/issues/298
 *
 * Note on screen resolutions - See: http://www.itunesextractor.com/iphone-ipad-resolution.html
 * Tests will be run on these resolutions:
 * - iPhone6s - 375x667
 * - iPad air - 768x1024
 * - Desktop -  1440x900
 *
 * beforeEach will set the mode to phone. Any tests requiring a different resolution will must set explicitly.
 *
 * @author naina-verma, rgarg@redhat.com, ijarif@redhat.com
 */

var WorkItemListPage = require('./page-objects/work-item-list.page'),
  testSupport = require('./testSupport'),
  constants = require('./constants'),
  OpenShiftIoRHDLoginPage = require('./page-objects/openshift-io-RHD-login.page');

describe('Work item list', function () {
  var page, items, browserMode;

  var until = protractor.ExpectedConditions;
  var NEW_WORK_ITEM_TITLE_1 = "New Work Item 1"
  var NEW_WORK_ITEM_TITLE_2 = "New Work Item 2"
  var WORK_ITEM_TITLE = "Workitem_Title_20";
  var WORK_ITEM_TITLE_1 = "Workitem_Title_19";
  var WORK_ITEM_UPDATED_TITLE = "Test workitem title-UPDATED";
  var WORK_ITEM_DESCRIPTION = "The test workitem description";
  var WORK_ITEM_UPDATED_DESCRIPTION = "Test description-UPDATED";
  // TODO find a better way to fetch this
  var EXAMPLE_USER = browser.params.fullName;
  var SPACE_NAME = browser.params.spaceName;
  var AREA_1_TITLE = '/' + SPACE_NAME + '/Area_1';
  var AREA_2_TITLE = '/' + SPACE_NAME + '/Area_2';
  var ITERATION_1_TITLE = '/' + SPACE_NAME + '/Iteration_1';
  var ITERATION_2_TITLE = '/' + SPACE_NAME + '/Iteration_2';
  var newLabelTitle = "My Test Label";
  var testLabelTitle = "Example Label 0";
  var AUTH_TOKEN = "";
  var REFRESH_TOKEN = "";

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

  /* User can read, update, remove assignee on a workitem  */
  it('User can read, update, remove assignee', function() {
    page.clickWorkItemQuickAdd();
    page.typeQuickAddWorkItemTitle(NEW_WORK_ITEM_TITLE_1);
    page.clickQuickAddSave().then(function() {
      var detailPage = page.clickWorkItemTitle(WORK_ITEM_TITLE);
      browser.wait(until.elementToBeClickable(detailPage.workItemDetailCloseButton), constants.WAIT, 'Failed to find detail page close Icon');
      //Assign the user
      detailPage.clickAddAssigneeButton();
      detailPage.setAssigneeSearch(EXAMPLE_USER_1, false);
      detailPage.clickAssigneeListItem(EXAMPLE_USER_1);
      detailPage.clickCloseAssigneeDropdown();
      //Verify assignee has been assigned
      expect(detailPage.AssignUsers.getText()).toContain(EXAMPLE_USER_1);
      //unassign the user
      detailPage.clickAddAssigneeButton();
      detailPage.setAssigneeSearch(EXAMPLE_USER_1, false);
      detailPage.clickAssigneeListItem(EXAMPLE_USER_1);
      detailPage.clickCloseAssigneeDropdown();
      //Verify assignee has been unassigned
      expect(detailPage.AssignUsers.getText()).not.toContain(EXAMPLE_USER_1);
     });
  });

  /* Create a new workitem, fill in the details, save, retrieve, update, save, verify updates are saved */
  it('should find and update the workitem through its detail page', function() {
    /* Create a new workitem */
    page.clickWorkItemQuickAdd();
    page.typeQuickAddWorkItemTitle(NEW_WORK_ITEM_TITLE_2);
    page.typeQuickAddWorkItemDesc(WORK_ITEM_DESCRIPTION);
    page.clickQuickAddSave().then(function() {
      /* Fill in/update the new work item's title and details field */
      var detailPage = page.clickWorkItemTitle(WORK_ITEM_TITLE);
      browser.wait(until.elementToBeClickable(detailPage.workItemDetailCloseButton), constants.WAIT, 'Failed to find Assignee Icon');
      detailPage.clickWorkItemDetailTitleClick();
      detailPage.setWorkItemDetailTitle (WORK_ITEM_UPDATED_TITLE, false);
      detailPage.clickWorkItemTitleSaveIcon();
      detailPage.clickWorkItemDescriptionEditIcon();
      detailPage.clickWorkItemDetailDescription()
      detailPage.setWorkItemDetailDescription (WORK_ITEM_UPDATED_DESCRIPTION, false);
      detailPage.clickWorkItemDescriptionSaveIcon();
      detailPage.clickWorkItemDetailCloseButton();
      browser.wait(until.presenceOf(page.workItemByTitle(WORK_ITEM_UPDATED_TITLE)), constants.WAIT, 'Failed to find workItemList');
      expect(page.workItemTitle(page.firstWorkItem)).toBe(WORK_ITEM_UPDATED_TITLE);
    });
  });

  //Commenting out this one - need to fix!
  /* Vary the order of execution of the workitems */
  // it('should top workitem to the bottom and back to the top via the workitem kebab', function() {
  //   page.allWorkItems.count().then(function (text) {
  //     var totalCount = text
  //     /* Verify that the first work item is in the correct position */
  //     expect(page.workItemTitle(page.workItemByIndex(0))).toBe(MOCK_WORKITEM_TITLE_0);
  //     compareWorkitems (page, 0, MOCK_WORKITEM_TITLE_0);
  //     /* Move the workitem to the bottom */
  //     page.clickWorkItemKebabButton (page.workItemByTitle(MOCK_WORKITEM_TITLE_0)).then(function() {
  //       page.clickWorkItemKebabMoveToBottomButton(page.workItemByTitle(MOCK_WORKITEM_TITLE_0));
  //       compareWorkitems (page, totalCount - 1, MOCK_WORKITEM_TITLE_0);
  //     });
  //   });
  // });

  /* Create workitem - verify user and icon */
  it('Edit and check WorkItem, creator name and image is reflected', function () {
    var detailPage = page.clickWorkItemTitle(WORK_ITEM_UPDATED_TITLE);
    detailPage.clickWorkItemTitleDiv();
    detailPage.setWorkItemDetailTitle(NEW_WORK_ITEM_TITLE_2, false);
    detailPage.clickWorkItemTitleSaveIcon();
    detailPage.clickWorkItemDescriptionEditIcon();
    detailPage.clickWorkItemDetailDescription()
    detailPage.setWorkItemDetailDescription (WORK_ITEM_DESCRIPTION, true);
    detailPage.clickWorkItemDescriptionSaveIcon();
    expect(detailPage.getCreatorUsername()).toBe(EXAMPLE_USER);
    expect(detailPage.getCreatorAvatar().isPresent()).toBe(true);
    detailPage.clickWorkItemDetailCloseButton();

    expect(page.workItemTitle(page.workItemByTitle(NEW_WORK_ITEM_TITLE_2))).toBe(NEW_WORK_ITEM_TITLE_2);

    detailPage = page.clickWorkItemTitle(NEW_WORK_ITEM_TITLE_2);
    expect(detailPage.getCreatorUsername()).toBe(EXAMPLE_USER);
    expect(detailPage.getCreatorAvatar().isPresent()).toBe(true);
    expect(detailPage.getImageURL()).toBe('https://www.gravatar.com/avatar/6c96128e82945d7f89ff253c1bfd5353.jpg&s=20');
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

  it('Re-Associate Workitem from detail page', function() {
    var detailPage = page.clickWorkItemTitle(WORK_ITEM_TITLE);
    detailPage.IterationOndetailPage().click();
    detailPage.associateIteration(ITERATION_1_TITLE);
    detailPage.saveIteration();
    expect(detailPage.getAssociatedIteration()).toBe(ITERATION_1_TITLE);
    detailPage.clickWorkItemDetailCloseButton();
    // Re - assocaite
    var detailPage = page.clickWorkItemTitle(WORK_ITEM_TITLE);
    detailPage.IterationOndetailPage().click();
    detailPage.associateIteration(ITERATION_2_TITLE);
    detailPage.saveIteration();
    expect(detailPage.getAssociatedIteration()).toBe(ITERATION_2_TITLE);
  });

  it('Edit comment and cancel - Desktop ', function() {
    var detailPage = page.clickWorkItemTitle(WORK_ITEM_TITLE);
    detailPage.scrollToBottomRight().then(function() {
      detailPage.clickCommentEdit('0');
      detailPage.editComments('updated comment!','0',false);
      detailPage.scrollToBottomRight().then(function(){
        detailPage.clickCloseComment('0');
      });
      expect(detailPage.getCommentBody('0')).toBe('Some Comment 0');
    });
  });

    /* Commenting the following two tests as they are unreliable; failing often.
  They will be added back once they attain certain reliability */

  // it('Verify create new Label', function(){
  //   var detailPage = page.clickWorkItem(page.firstWorkItem);
  //   detailPage.clickAddLabelButton();
  //   let origLabelCount
  //   detailPage.labelsCount.then(function(count){
  //     origLabelCount = count
  //   });
  //   detailPage.clickCreateLabelButton();
  //   detailPage.setLabelName(newLabelTitle);
  //   detailPage.clickLabelCheckbox();
  //   // Verify label count has increased by 1
  //   detailPage.labelsCount.then(function(count){
  //     expect(count).toBe(origLabelCount + 1);
  //   });
  //   // Verify label exists in the list
  //   expect(detailPage.listOfLabels().getText()).toContain(detailPage.getLabelByTitle(newLabelTitle).getText());
  // })

  // it('Verify added label appears on the list page', function(){
  //   var detailPage = page.clickWorkItem(page.firstWorkItem);
  //   detailPage.clickAddLabelButton();
  //   detailPage.selectLabelByTitle(testLabelTitle);
  //   detailPage.clickLabelClose();
  //   detailPage.clickWorkItemDetailCloseButton();
  //   browser.sleep(3000);
  //   expect(page.workItemAttachedLabels(page.firstWorkItem).getText()).toContain(testLabelTitle);
  // });


  /* Test that the Quick add work item is visible */
  it('Test Quick workitem not visible without authorization', function () {
    page.clickLogoutButton();
    expect(page.quickAddbuttonById().isPresent()).toBeFalsy();
  });

});

/* Compare an expected and actual work item - the offset values enable us to track
   workitems after they have been moved. */
  var compareWorkitems = function(page, targetIndex, expectedTitle) {
    expect(page.workItemTitle(page.workItemByIndex(targetIndex))).toBe(expectedTitle);
  }
