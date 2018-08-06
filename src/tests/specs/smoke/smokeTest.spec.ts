import { browser } from 'protractor';
import { PlannerPage } from '../../page_objects/planner';
import * as support from '../../support';

/* Smoke Tests */

describe('Planner Smoke Tests:', () => {
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
    await planner.ready();
    await planner.workItemList.overlay.untilHidden();
  });

  afterEach(async () => {
    await planner.resetState();
  });

  it('create a work item and add/remove assignee', async () => {
    await planner.createWorkItem(testData.newWorkItem1);
    expect(await planner.workItemList.hasWorkItem(testData.newWorkItem1.title)).toBeTruthy();
    await planner.workItemList.clickWorkItem(testData.newWorkItem1.title);
    await planner.quickPreview.addAssignee(testData.user1 + ' (me)');
    expect(await planner.quickPreview.getAssignees()).toContain(testData.user1);
    await planner.quickPreview.close();
    await planner.workItemList.clickWorkItem(testData.newWorkItem1.title);
    await browser.sleep(2000);
    await planner.quickPreview.removeAssignee(testData.user1 + ' (me)');
    expect(await planner.quickPreview.getAssignees()).not.toContain(testData.user1);
    await planner.quickPreview.close();
  });

  it('update workitem title/description', async () => {
    await planner.createWorkItem(testData.newWorkItem2);
    expect(await planner.workItemList.hasWorkItem(testData.newWorkItem2.title)).toBeTruthy();
    await planner.workItemList.clickWorkItem(testData.newWorkItem2.title);
    await planner.quickPreview.updateTitle(testData.updatedWorkItem.title);
    await planner.quickPreview.close();
    await planner.workItemList.clickWorkItem(testData.updatedWorkItem.title);
    await planner.quickPreview.updateDescription(testData.updatedWorkItem.description);
    expect(await planner.quickPreview.getDescription()).toBe(testData.updatedWorkItem.description);
    await planner.quickPreview.close();
    expect(await planner.workItemList.hasWorkItem(testData.newWorkItem2.title, true)).toBeFalsy();
    expect(await planner.workItemList.hasWorkItem(testData.updatedWorkItem.title)).toBeTruthy();
  });

  it('update of empty workitem title is not allowed', async () => {
    let title = await planner.createUniqueWorkItem();
    await planner.workItemList.clickWorkItem(title);
    await planner.quickPreview.updateTitle('');
    expect(await planner.quickPreview.getTitleError()).toBe('Empty title not allowed');
  });

  it('Check WorkItem creator name and image is reflected', async () => {
    let prodAvatar = 'https://avatars0.githubusercontent.com/u/563119?v=3&s=25',
      prodPreviewAvatar = 'https://www.gravatar.com/avatar/d77d23eebe9907842b8ad9f1d9905454.jpg&s=25';
    await planner.workItemList.clickWorkItem(testData.workItemTitle2);
    await planner.quickPreview.ready();
    /* Run tests against production or prod-preview */
    let url = await browser.getCurrentUrl();
    if (url.startsWith('https://openshift.io')) {
      expect(await planner.quickPreview.getCreatorAvatar()).toBe(prodAvatar);
    } else if (url.startsWith('https://prod-preview.openshift.io/')) {
      expect(await planner.quickPreview.getCreatorAvatar()).toBe(prodPreviewAvatar);
    } else {
      expect(await planner.quickPreview.getCreatorAvatar()).toBe(testData.user_avatar);
    }
    expect(await planner.quickPreview.getCreator()).toBe(testData.user1);
    await planner.quickPreview.close();
  });

  it('Associate workitem with an Area', async () => {
    let title = await planner.createUniqueWorkItem();
    await planner.workItemList.clickWorkItem(title);
    await planner.quickPreview.addArea(testData.dropdownareaTitle1);
    expect(await planner.quickPreview.getArea()).toBe(testData.areaTitle1);
    await planner.quickPreview.close();

    await planner.workItemList.clickWorkItem(title);
    expect(await planner.quickPreview.getArea()).toBe(testData.areaTitle1);
    await planner.quickPreview.addArea(testData.dropdownareaTitle2);
    expect(await planner.quickPreview.getArea()).not.toBe(testData.areaTitle1);
    expect(await planner.quickPreview.getArea()).toBe(testData.areaTitle2);
    await planner.quickPreview.close();
  });

  it('Associate/Re-associate workitem with an Iteration', async () => {
    //add new iteration
    let title = await planner.createUniqueWorkItem();
    await planner.workItemList.clickWorkItem(title);
    await planner.quickPreview.addIteration(testData.dropdownIteration1);
    expect(await planner.quickPreview.getIteration()).toBe(testData.iteration1);
    await planner.quickPreview.close();

    //update iteration
    await planner.workItemList.clickWorkItem(title);
    expect(await planner.quickPreview.getIteration()).toBe(testData.iteration1);
    await planner.quickPreview.addIteration(testData.dropdownIteration_2);
    expect(await planner.quickPreview.getIteration()).toBe(testData.iteration2);

    //search iteration
    await planner.workItemList.clickWorkItem(title);
    await planner.quickPreview.typeaHeadSearch(testData.randomText);
    expect(await planner.quickPreview.iterationDropdown.menu.getTextWhenReady()).toBe('No matches found.');
    await planner.quickPreview.iterationDropdownCloseButton.clickWhenReady();
    await planner.quickPreview.iterationDropdown.clickWhenReady();
    expect(await planner.quickPreview.iterationDropdown.menu.getTextWhenReady()).not.toBe('No matches found.');
  });

  it('Quick Add should support Scenario, papercuts and fundamentals' , async () => {
    let wiTypes = await planner.quickAdd.workItemTypes();
    switch (browser.browserName) {
      case 'browserSDD':
        expect(wiTypes.length).toBe(3);
        expect(wiTypes[0]).toBe('Scenario');
        expect(wiTypes[1]).toBe('Fundamental');
        expect(wiTypes[2]).toBe('Papercuts');
        break;
      case 'browserAgile':
        expect(wiTypes.length).toBe(6);
        expect(wiTypes[0]).toBe('Theme');
        expect(wiTypes[1]).toBe('Epic');
        expect(wiTypes[2]).toBe('Story');
        expect(wiTypes[3]).toBe('Task');
        expect(wiTypes[4]).toBe('Defect');
        expect(wiTypes[5]).toBe('Impediment');
         break;
      default:
        break;
    }
  });

  xit('Experiences-Quick Add should support Experience and Value proposition', async () => {
    await planner.sidePanel.clickExperience();
    let wiTypes = await planner.quickAdd.workItemTypes();
    expect(wiTypes.length).toBe(2);
    expect(wiTypes[0]).toBe('Experience');
    expect(wiTypes[1]).toBe('Value Proposition');
  });

  xit('Requirement-Quick Add should support Feature and Bug', async () => {
    await planner.sidePanel.clickRequirement();
    let wiTypes = await planner.quickAdd.workItemTypes();
    expect(wiTypes.length).toBe(2);
    expect(wiTypes[0]).toBe('Feature');
    expect(wiTypes[1]).toBe('Bug');
  });

  it('Edit Comment and Save', async () => {
    await planner.createWorkItem(testData.newWorkItem3);
    expect(await planner.workItemList.hasWorkItem(testData.newWorkItem3.title)).toBeTruthy();
    await planner.workItemList.clickWorkItem(testData.newWorkItem3.title);
    await planner.quickPreview.addCommentAndSave(testData.comment);
    expect(await planner.quickPreview.getComments()).toContain(testData.comment);
  });

  it('Edit Comment and Cancel', async () => {
    let title = await planner.createUniqueWorkItem();
    await planner.workItemList.clickWorkItem(title);
    await planner.quickPreview.addCommentAndCancel(testData.comment);
    expect(await planner.quickPreview.getComments()).not.toContain('new comment');
  });

  xit('Create custom query', async () => {
    await planner.sidePanel.clickRequirement();
    await planner.workItemList.overlay.untilHidden();
    await planner.header.selectFilter('State', 'in progress');
    await planner.workItemList.overlay.untilHidden();
    await planner.header.saveFilters('Query 1');
    await planner.workItemList.overlay.untilHidden();
    await planner.sidePanel.customQuery.untilTextIsPresent('Query 1');
    expect(await planner.sidePanel.getMyFiltersList()).toContain('Query 1');
  });

  xit('Delete custom query', async () => {
    await planner.sidePanel.clickRequirement();
    await planner.workItemList.overlay.untilHidden();
    await planner.header.selectFilter('State', 'resolved');
    await planner.workItemList.overlay.untilHidden();
    await planner.header.saveFilters('My filter');
    await planner.workItemList.overlay.untilHidden();
    await planner.sidePanel.customQuery.untilTextIsPresent('My filter');
    expect(await planner.sidePanel.getMyFiltersList()).toContain('My filter');
    await planner.sidePanel.selectcustomFilterKebab('My filter');
    await planner.sidePanel.deleteCustomQuery.clickWhenReady();
    await planner.confirmModalButton.clickWhenReady();
    await browser.sleep(1000);
    expect(await planner.sidePanel.getMyFiltersList()).not.toContain('My filter');
  });

  it('Update work item with a label and validate description', async () => {
    let title = await planner.createUniqueWorkItem();
    await planner.workItemList.clickWorkItem(title);
    await planner.quickPreview.updateDescription('My new description');
    await planner.quickPreview.createNewLabel('Validate description label');
    expect(await planner.quickPreview.getLabels()).toContain('Validate description label');
    await planner.quickPreview.close();
    await planner.workItemList.clickWorkItem(title);
    await planner.quickPreview.addLabel('Validate description label', true);
    expect(await planner.quickPreview.getDescription()).toBe('My new description');
    await planner.quickPreview.close();
  });

  it('Create a work item and Open detail page', async () => {
    await planner.quickAdd.addAndOpenWorkItem(testData.workitem);
    await planner.waitUntilUrlContains('detail');
    await planner.detailPage.titleInput.untilTextIsPresentInValue('new detail workItem');
    await planner.detailPage.closeButton.ready();
    expect(await browser.getCurrentUrl()).toContain('detail');
    await planner.detailPage.close();
    await planner.waitUntilUrlContains('typegroup');
    expect(await planner.workItemList.hasWorkItem('new detail workItem')).toBeTruthy();
  });

  xit('Infotip opens on clicking on infotip icon and closes on outside click', async () => {
    await planner.sidePanel.infotipIconExperience.clickWhenReady();
    await planner.sidePanel.infotipIconRequirement.clickWhenReady();
    expect(await planner.sidePanel.infotipPopover.count()).toBe(1);
  });

  xit('Add new work-item to the selected iteration', async () => {
    await planner.workItemList.overlay.untilHidden();
    await planner.sidePanel.clickIteration('Iteration_1');
    await planner.workItemList.overlay.untilHidden();
    await planner.quickAdd.addWorkItem({title : 'Add new work item to iteration test'});
    expect(await planner.workItemList.hasWorkItem('Add new work item to iteration test')).toBeTruthy();
    await planner.sidePanel.clickScenarios();
    await planner.workItemList.overlay.untilHidden();
    await planner.sidePanel.clickIteration('Iteration_1');
    expect(await planner.workItemList.hasWorkItem('Add new work item to iteration test')).toBeTruthy();
  });
});
