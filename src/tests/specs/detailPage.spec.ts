import { browser } from 'protractor';
import { PlannerPage } from '../page_objects/planner';
import * as support from '../support';


fdescribe('Detail View test: ', () => {
  let planner: PlannerPage;
  let c = new support.Constants();
  let testData;

  beforeAll(async () => {
    await support.desktopTestSetup();
    planner = new PlannerPage(browser.baseUrl);
    await planner.openInBrowser();
    await planner.waitUntilUrlContains('typegroup');
    testData = c.browserName[browser.browserName];
  });

  beforeEach(async () => {
    await planner.waitUntilUrlContains('typegroup');
    await planner.ready();
    await planner.workItemList.overlay.untilHidden();
  });

  afterEach(async () => {
    await planner.quickPreview.close();
  });

  it('should open detail view and apply label', async () => {
    let workitemname = {'title': 'detail page test'};
    await planner.createWorkItem(workitemname);
    await planner.workItemList.openDetailPage(workitemname.title);
    await planner.waitUntilUrlContains('detail');
    await planner.detailPage.titleInput.untilTextIsPresentInValue(workitemname.title);
    await planner.detailPage.addLabel(testData.label);
    expect(await planner.detailPage.getLabels()).toContain(testData.label);
  });

  it('should update title and description', async () => {
    let workitemname = {'title': 'detail page title test'},
     updatedWorkItem = {
      title: 'detail page title updated',
      description: 'New WorkItem Description'
    };
    await planner.createWorkItem(workitemname);
    await planner.workItemList.openDetailPage(workitemname.title);
    await planner.waitUntilUrlContains('detail');
    await planner.detailPage.titleInput.untilTextIsPresentInValue(workitemname.title);
    await planner.detailPage.updateTitle(updatedWorkItem.title);
    await planner.detailPage.updateDescription(updatedWorkItem.description);
    expect(await planner.detailPage.titleInput.getAttribute('value')).toBe(updatedWorkItem.title);
    expect(await planner.detailPage.getDescription()).toBe(updatedWorkItem.description);
  });

  it('should associate workitem with an Area', async () => {
    await planner.workItemList.openDetailPage(testData.workItemTitle2);
    await planner.waitUntilUrlContains('detail');
    await planner.detailPage.titleInput.untilTextIsPresentInValue(testData.workItemTitle2);
    await planner.detailPage.addArea(testData.dropdownareaTitle1);
    expect(await planner.detailPage.getArea()).toBe(testData.areaTitle1);
  });

  it('should associate workitem with an Iteration', async () => {
    await planner.workItemList.openDetailPage(testData.workItemTitle2);
    await planner.waitUntilUrlContains('detail');
    await planner.detailPage.titleInput.untilTextIsPresentInValue(testData.workItemTitle2);
    await planner.detailPage.addIteration(testData.dropdownIteration1);
    expect(await planner.detailPage.getIteration()).toBe(testData.iteration1);
  });

  it('should add comment', async () => {
    await planner.workItemList.openDetailPage(testData.workItemTitle2);
    await planner.waitUntilUrlContains('detail');
    await planner.detailPage.titleInput.untilTextIsPresentInValue(testData.workItemTitle2);
    await planner.detailPage.addCommentAndSave(testData.comment);
    expect(await planner.detailPage.getComments()).toContain(testData.comment);
  });

  it('should link a workitem', async () => {
    let linkType = 'blocks';
    await planner.workItemList.openDetailPage(testData.workItemTitle2);
    await planner.waitUntilUrlContains('detail');
    await planner.detailPage.titleInput.untilTextIsPresentInValue(testData.workItemTitle2);
    await planner.detailPage.addLink(linkType, testData.searchWorkItem3, testData.Workitem_Title_3);
    expect(await planner.detailPage.getLinkedItems()).toContain(testData.Workitem_Title_3);
  });

  it('should remove link from workitem', async () => {
    let workItemName1 = {'title': 'Remove_link_from_workitem_test'},
      linkType = 'blocks';
    await planner.createWorkItem(workItemName1);
    await planner.workItemList.openDetailPage(workItemName1.title);
    await planner.waitUntilUrlContains('detail');
    await planner.detailPage.titleInput.untilTextIsPresentInValue(workItemName1.title);
    await planner.detailPage.addLink(linkType, testData.searchWorkItem4, testData.Workitem_Title_4);
    expect(await planner.detailPage.getLinkedItems()).toContain(testData.Workitem_Title_4);
    await planner.detailPage.removeLink(testData.Workitem_Title_4);
    await planner.detailPage.linkCount.untilTextIsPresent('0');
    expect(await planner.detailPage.linkCount.getTextWhenReady()).toBe('0');
  });

  it('should change the state of workitem', async () => {
    await planner.workItemList.openDetailPage(testData.workItemTitle2);
    await planner.waitUntilUrlContains('detail');
    await planner.detailPage.titleInput.untilTextIsPresentInValue(testData.workItemTitle2);
    await planner.detailPage.changeState(testData.stateOpen);
    await planner.detailPage.stateToggle.untilTextIsPresent(testData.stateOpen);
    expect(planner.detailPage.stateToggle.getTextWhenReady()).toContain(testData.stateOpen);
  });
});