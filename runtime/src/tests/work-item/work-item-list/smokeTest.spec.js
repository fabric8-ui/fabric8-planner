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
  constants = require('./constants');

describe('Work item list', function () {
  var page, until = protractor.ExpectedConditions;

  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    page = new WorkItemListPage()
  });

  /* User can read, update, remove assignee on a workitem  */
  it('User can read, update, remove assignee', function() {
    page.clickWorkItemQuickAdd();
    page.typeQuickAddWorkItemTitle(constants.NEW_WORK_ITEM_TITLE_1);
    page.clickQuickAddSave().then(function() {
      var detailPage = page.clickWorkItemTitle(constants.NEW_WORK_ITEM_TITLE_1);
      browser.wait(until.elementToBeClickable(detailPage.workItemDetailCloseButton), constants.WAIT, 'Failed to find detail page close Icon');
      //Assign the user
      detailPage.clickAddAssigneeButton();
      detailPage.clickAssigneeListItem(constants.EXAMPLE_USER);
      detailPage.clickCloseAssigneeDropdown();
      //Verify assignee has been assigned
      expect(detailPage.AssignUsers.getText()).toContain(constants.EXAMPLE_USER);
      //unassign the user
      detailPage.clickAddAssigneeButton();
      detailPage.clickAssigneeListItem(constants.EXAMPLE_USER);
      detailPage.clickCloseAssigneeDropdown();
      //Verify assignee has been unassigned
      expect(detailPage.AssignUsers.getText()).not.toContain(constants.EXAMPLE_USER);
     });
  });

  /* Create a new workitem, fill in the details, save, retrieve, update, save, verify updates are saved */
  it('should find and update the workitem through its detail page', function() {
    /* Create a new workitem */
    page.clickWorkItemQuickAdd();
    page.typeQuickAddWorkItemTitle(constants.NEW_WORK_ITEM_TITLE_2);
    page.clickQuickAddSave().then(function() {
      /* Fill in/update the new work item's title and details field */
      expect(page.workItemByTitle(constants.NEW_WORK_ITEM_TITLE_2).isPresent()).toBe(true);
      var detailPage = page.clickWorkItemTitle(constants.NEW_WORK_ITEM_TITLE_2);
      browser.wait(until.elementToBeClickable(detailPage.workItemDetailCloseButton), constants.WAIT, 'Failed to find Assignee Icon');
      detailPage.clickWorkItemDetailTitleClick();
      detailPage.setWorkItemDetailTitle (constants.WORK_ITEM_UPDATED_TITLE, false);
      detailPage.clickWorkItemTitleSaveIcon();
      detailPage.clickWorkItemDescriptionEditIcon();
      detailPage.clickWorkItemDetailDescription()
      detailPage.setWorkItemDetailDescription (constants.WORK_ITEM_UPDATED_DESCRIPTION, false);
      detailPage.clickWorkItemDescriptionSaveIcon();
      detailPage.clickWorkItemDetailCloseButton();
      browser.wait(until.presenceOf(page.workItemByTitle(constants.WORK_ITEM_UPDATED_TITLE)), constants.WAIT, 'Failed to find workItemList');
      expect(page.workItemByTitle(constants.WORK_ITEM_UPDATED_TITLE).isPresent()).toBe(true);
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
    var detailPage = page.clickWorkItemTitle(constants.WORK_ITEM_TITLE_1);
    detailPage.clickWorkItemTitleDiv();
    detailPage.setWorkItemDetailTitle(constants.NEW_WORK_ITEM_TITLE_2, false);
    detailPage.clickWorkItemTitleSaveIcon();
    detailPage.clickWorkItemDescriptionEditIcon();
    detailPage.clickWorkItemDetailDescription()
    detailPage.setWorkItemDetailDescription (constants.WORK_ITEM_DESCRIPTION, true);
    detailPage.clickWorkItemDescriptionSaveIcon();
    expect(detailPage.getCreatorUsername()).toBe(constants.EXAMPLE_USER);
    expect(detailPage.getCreatorAvatar().isPresent()).toBe(true);
    detailPage.clickWorkItemDetailCloseButton();

    expect(page.workItemByTitle(constants.NEW_WORK_ITEM_TITLE_2).isPresent()).toBe(true);

    detailPage = page.clickWorkItemTitle(constants.NEW_WORK_ITEM_TITLE_2);
    expect(detailPage.getCreatorUsername()).toBe(constants.EXAMPLE_USER);
    expect(detailPage.getCreatorAvatar().isPresent()).toBe(true);
    expect(detailPage.getImageURL()).toBe(constants.USER_IMAGE);
  });

  it('Updating area to a WI -desktop ', function() {
    var detailPage = page.clickWorkItemTitle(constants.WORK_ITEM_TITLE);
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

  it('Re-Associate Workitem from detail page', function() {
    var detailPage = page.clickWorkItemTitle(constants.WORK_ITEM_TITLE);
    detailPage.IterationOndetailPage().click();
    detailPage.associateIterationByName(constants.ITERATION_TITLE_1);
    detailPage.saveIteration();
    expect(detailPage.getAssociatedIteration()).toContain(constants.ITERATION_TITLE_1);
    detailPage.clickWorkItemDetailCloseButton();
    // Re - assocaite
    var detailPage = page.clickWorkItemTitle(constants.WORK_ITEM_TITLE);
    detailPage.IterationOndetailPage().click();
    detailPage.associateIterationByName(constants.ITERATION_TITLE_2);
    detailPage.saveIteration();
    expect(detailPage.getAssociatedIteration()).toContain(constants.ITERATION_TITLE_2);
  });

  it('Edit comment and cancel - Desktop ', function() {
    var detailPage = page.clickWorkItemTitle(constants.WORK_ITEM_TITLE);
    detailPage.scrollToBottomRight().then(function() {
      detailPage.clickCommentEdit('0');
      detailPage.editComments('updated comment!','0',false);
      detailPage.scrollToBottomRight().then(function(){
        detailPage.clickCloseComment('0');
      });
      expect(detailPage.getCommentBody('0')).toBe(constants.COMMENT_1);
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
    // Skip test in inmemory mode
    if(process.env.NODE_ENV){
      return
    }
    page.clickLogoutButton();
    expect(page.quickAddbuttonById().isPresent()).toBeFalsy();
  });

});

/* Compare an expected and actual work item - the offset values enable us to track
   workitems after they have been moved. */
  var compareWorkitems = function(page, targetIndex, expectedTitle) {
    expect(page.workItemTitle(page.workItemByIndex(targetIndex))).toBe(expectedTitle);
  }
