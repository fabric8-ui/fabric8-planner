import { browser } from 'protractor';
import { PlannerPage } from '../page_objects/planner';
import * as support from '../support';


fdescribe('Quick preview tests: ', () => {
  let planner: PlannerPage;
  let c = new support.Constants();
  let testData;

  beforeAll(async () => {
    await support.desktopTestSetup();
    planner = new PlannerPage(browser.baseUrl);
    await planner.openInBrowser();
    await planner.waitUntilUrlContains('typegroup');
    testData = await c.browserName[browser.browserName];
  });

  beforeEach(async () => {
    await planner.ready();
    await planner.workItemList.overlay.untilHidden();
  });

  afterEach(async () => {
    await planner.resetState();
  });

  it('should open quickpreview and apply label', async () => {
    await planner.workItemList.clickWorkItem(testData.workItemTitle2);
    await planner.quickPreview.addLabel(testData.label);
    expect(await planner.quickPreview.getLabels()).toContain(testData.label);
  });

  it('should open quickpreview and create new label', async () => {
    let workitemname = {'title': 'test labels'};
    await planner.createWorkItem(workitemname);
    await planner.workItemList.clickWorkItem(workitemname.title);
    await planner.quickPreview.createNewLabel(testData.newLabel);
    expect(await planner.quickPreview.getLabels()).toContain(testData.newLabel);
  });

  it('should open quickpreview and create new label using Enter Key', async () => {
    let workitemname = {'title': 'text labels'};
    let newLabel = 'Enter Key Label';
    await planner.createWorkItem(workitemname);
    await planner.workItemList.clickWorkItem(workitemname.title);
    await planner.quickPreview.createNewLabel(newLabel, true);
    expect(await planner.quickPreview.getLabels()).toContain(newLabel);
  });

  it('should link a workitem', async () => {
    let workitemname = {'title': 'link test'};
    await planner.createWorkItem(workitemname);
    await planner.workItemList.clickWorkItem(workitemname.title);
    await planner.quickPreview.addLink(testData.linkType, testData.searchWorkItem4, testData.Workitem_Title_4);
    await planner.quickPreview.linklistItem.untilTextIsPresent(testData.Workitem_Title_4);
    expect(await planner.quickPreview.getLinkedItems()).toContain(testData.Workitem_Title_4);
  });

  it('should open quick preview and edit the title', async () => {
    let title = await planner.createUniqueWorkItem();
    await planner.workItemList.clickWorkItem(title);
    await planner.quickPreview.updateTitle(testData.editWorkItemTitle1);
    expect(await planner.quickPreview.titleInput.getAttribute('value')).toBe('Title Text "<0>"');
  });

  it('description box should not be open for wis', async () => {
    let workitemname = {'title': 'quickpreview test'};
    await planner.createWorkItem(workitemname);
    await planner.workItemList.clickWorkItem(workitemname.title);
    await planner.quickPreview.openDescriptionBox();
    expect(await planner.quickPreview.isSaveButtonDisplayed()).toBeTruthy();

    // Open another WI(Note: the description box is still in edit mode)
    await planner.workItemList.clickWorkItem(testData.workItemTitle2);
    // The description box should not be in edit mode
    expect(await planner.quickPreview.isSaveButtonDisplayed()).toBeFalsy();
  });

  it('should close assignee dropdown when clicked outside', async () => {
    await planner.workItemList.clickWorkItem(testData.workItemTitle2);
    await planner.quickPreview.assigneeDropdown.clickWhenReady();
    expect(await planner.quickPreview.assigneeDropdownMenu.getAttribute('className')).toContain('show');
    await planner.quickPreview.titleInput.clickWhenReady();
    expect(await planner.quickPreview.assigneeDropdownMenu.getAttribute('className')).not.toContain('show');
  });
});
