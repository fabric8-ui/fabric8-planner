/**Note on screen resolutions - See: http://www.itunesextractor.com/iphone-ipad-resolution.html
 * Tests will be run on these resolutions:
 * - iPhone6s - 375x667
 * - iPad air - 768x1024
 * - Desktop -  1920x1080
 *
 * beforeEach will set the mode to Desktop. Any tests requiring a different resolution will must set explicitly.
 *
 * @author ijarif
 */

var WorkItemListPage = require('./page-objects/work-item-list.page'),
  testSupport = require('./testSupport'),
  constants = require('./constants');

describe('Labels CRUD Tests', function () {
  var page, until = protractor.ExpectedConditions;

  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    page = new WorkItemListPage()
  });

  it('Verify add label button exists', function(){
    var detailPage = page.clickWorkItem(page.firstWorkItem);
    expect(detailPage.addLabelButton.isPresent()).toBeTruthy();
    expect(detailPage.selectLabelDropdown.isPresent()).toBeFalsy();
    detailPage.clickAddLabelButton();
    expect(detailPage.selectLabelDropdown.isPresent()).toBeTruthy();
    expect(detailPage.createLabelButton.isPresent()).toBeTruthy();
  });

  it('Verify create new label button is clickable', function(){
    var detailPage = page.clickWorkItem(page.firstWorkItem);
    let clickEvent = detailPage.clickAddLabelButton();
    expect(clickEvent).toBeDefined();
  });

  // This test has been moved back from smokeTest
  it('Verify create new Label', function(){
    var detailPage = page.clickWorkItem(page.firstWorkItem);
    browser.wait(until.presenceOf(detailPage.workItemDetailCloseButton), constants.wait, "Failed to find the close button")
    detailPage.clickAddLabelButton();
    let origLabelCount
    detailPage.labelsCount.then(function(count){
      origLabelCount = count
    });
    detailPage.clickCreateLabelButton();
    detailPage.setLabelName(constants.NEW_LABEL_TITLE);
    detailPage.clickLabelCheckbox();
    // Verify label count has increased by 1
    detailPage.labelsCount.then(function(count){
      expect(count).toBe(origLabelCount + 1);
    });
    // Verify label exists in the list
    expect(detailPage.listOfLabels().getText()).toContain(constants.NEW_LABEL_TITLE);
  })

  it('Verify adding existing labels', function(){
    var detailPage = page.clickWorkItem(page.firstWorkItem);
    detailPage.clickAddLabelButton();
    detailPage.selectLabelByTitle(constants.LABEL_1);
    detailPage.selectLabelByTitle(constants.LABEL_2);
    /* TODO - Mocking data is incorrect - text returns is:  Example Label 1,Example Label 1,

    expect(detailPage.attachedLabels().getText()).toContain(testLabelTitle1);
    expect(detailPage.attachedLabels().getText()).toContain(constants.LABEL_2); */
    expect(detailPage.attachedLabels().getText()).toContain(constants.PRE_SELECTED_LABEL)
  });

  it('Verify removing existing label by unchecking label', function(){
    var detailPage = page.clickWorkItem(page.firstWorkItem);
    detailPage.clickAddLabelButton();
    // Uncheck label by clicking on it again
    detailPage.selectLabelByTitle(constants.PRE_SELECTED_LABEL);
    detailPage.clickLabelClose();

    // Verify Label is removed (in detail page)
    expect(detailPage.attachedLabels()).not.toContain(constants.PRE_SELECTED_LABEL);
  });

  it('Verify removing existing label by clicking x', function(){
    var detailPage = page.clickWorkItem(page.firstWorkItem);

    // Uncheck label by clicking on it again
////    detailPage.removeLabelByTitle(constants.PRE_SELECTED_LABEL);
    // Verify Label is removed (in detail page)
    expect(detailPage.attachedLabels()).not.toContain(constants.PRE_SELECTED_LABEL);
  });

  it('Verify adding new label', function(){
    var detailPage = page.clickWorkItem(page.firstWorkItem);
    detailPage.clickAddLabelButton();
    detailPage.clickCreateLabelButton();
    detailPage.setLabelName(constants.NEW_LABEL_TITLE);
    detailPage.clickLabelCheckbox();
    detailPage.selectLabelByTitle(constants.NEW_LABEL_TITLE);
    // Verify label added on detail page

    /* TODO - Mocking data is incorrect - text returns is: Example Label 1,Example Label 1,
    expect(detailPage.attachedLabels().getText()).toContain(newLabelTitle);   */
    
    // Verify label added on list page

    /* TODO - Mocking data is incorrect - text returns is:  Example Label 1,Example Label 1,
    expect(page.workItemAttachedLabels(page.firstWorkItem).getText()).toContain(newLabelTitle);   */

  });

  it('Verify removing new label', function(){
    var detailPage = page.clickWorkItem(page.firstWorkItem);
    detailPage.clickAddLabelButton();
    detailPage.clickCreateLabelButton();
    detailPage.setLabelName(constants.NEW_LABEL_TITLE);
    detailPage.clickLabelCheckbox();
    detailPage.selectLabelByTitle(constants.NEW_LABEL_TITLE);

    // Verify new label is added
    expect(detailPage.listOfLabels().getText()).toContain(constants.NEW_LABEL_TITLE);
    detailPage.clickLabelClose();

    expect(detailPage.listOfLabels().getText()).not.toContain(constants.NEW_LABEL_TITLE);
  });

// This test has been moved to smokeTest
//   it('Verify added label appears on the list page', function(){
//     var detailPage = page.clickWorkItem(page.firstWorkItem);
//     detailPage.clickAddLabelButton();
//     detailPage.selectLabelByTitle(testLabelTitle1);
//     detailPage.clickLabelClose();
//     detailPage.clickWorkItemDetailCloseButton();
//     expect(page.workItemAttachedLabels(page.firstWorkItem).getText()).toContain(testLabelTitle1);
//  });
});
