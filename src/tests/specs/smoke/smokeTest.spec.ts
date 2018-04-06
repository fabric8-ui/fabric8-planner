import { browser } from 'protractor';
import { PlannerPage } from '../../page_objects/planner';
import * as support from '../../support';

/* Smoke Tests */

describe('Planner Smoke Tests:', () => {
  let planner: PlannerPage;
  let c = new support.Constants();

  beforeEach(async () => {
    await support.desktopTestSetup();
    planner = new PlannerPage(browser.baseUrl);
    await planner.openInBrowser();
    // This is necessary since the planner takes time to load on prod/prod-preview
    await browser.sleep(12000);
    await planner.ready();
  });

  it('create a work item and add/remove assignee', async () => {
    await planner.createWorkItem(c.newWorkItem1);
    expect(await planner.workItemList.hasWorkItem(c.newWorkItem1.title)).toBeTruthy();
    await planner.workItemList.clickWorkItem(c.newWorkItem1.title);
    await planner.quickPreview.addAssignee(c.user1 + " (me)");
    expect(await planner.quickPreview.hasAssignee(c.user1)).toBeTruthy();
    await planner.quickPreview.close();
    await planner.workItemList.clickWorkItem(c.newWorkItem1.title);
    await browser.sleep(2000);
    await planner.quickPreview.removeAssignee(c.user1 + " (me)");
    expect(await planner.quickPreview.hasAssignee(c.user1)).toBeFalsy();
    await planner.quickPreview.close();
  });

  it('update workitem title/description', async () => {
    await planner.createWorkItem(c.newWorkItem2);

    expect(await planner.workItemList.hasWorkItem(c.newWorkItem2.title)).toBeTruthy();
    await planner.workItemList.clickWorkItem(c.newWorkItem2.title);
    await planner.quickPreview.updateTitle(c.updatedWorkItem.title);
    await planner.quickPreview.close();
    await planner.workItemList.clickWorkItem(c.updatedWorkItem.title);
    await planner.quickPreview.updateDescription(c.updatedWorkItem.description);
    expect(await planner.quickPreview.hasDescription(c.updatedWorkItem.description)).toBeTruthy();
    await planner.quickPreview.close();
    expect(await planner.workItemList.hasWorkItem(c.newWorkItem2.title)).toBeFalsy();
    expect(await planner.workItemList.hasWorkItem(c.updatedWorkItem.title)).toBeTruthy();
  });

  it('update of empty workitem title is not allowed', async () => {
    await planner.workItemList.clickWorkItem(c.workItemTitle1);
    await planner.quickPreview.updateTitle('');
    expect(await planner.quickPreview.hasTitleError('Empty title not allowed')).toBeTruthy();
  })

  it('Check WorkItem creator name and image is reflected', async () => {
    await planner.workItemList.clickWorkItem(c.workItemTitle1);
    await planner.quickPreview.ready();
    expect(await planner.quickPreview.hasCreator(c.user1)).toBeTruthy();
    expect(await planner.quickPreview.hasCreatorAvatar(c.user_avatar)).toBeTruthy()
    await planner.quickPreview.close();
  });

  it('Associate workitem with an Area', async () => {
    await planner.workItemList.clickWorkItem(c.workItemTitle1);
    await planner.quickPreview.addArea(c.areaTitle1);
    expect(await planner.quickPreview.hasArea(c.areaTitle1)).toBeTruthy();
    await planner.quickPreview.close();

    await planner.workItemList.clickWorkItem(c.workItemTitle1);
    expect(await planner.quickPreview.hasArea(c.areaTitle1)).toBeTruthy();
    await planner.quickPreview.addArea(c.areaTitle2);
    expect(await planner.quickPreview.hasArea(c.areaTitle1)).toBeFalsy();
    expect(await planner.quickPreview.hasArea(c.areaTitle2)).toBeTruthy();
    await planner.quickPreview.close();
  });

  it('Associate/Re-associate workitem with an Iteration', async () => {
    await planner.workItemList.clickWorkItem(c.workItemTitle3);
    await planner.quickPreview.addIteration(c.dropdownIteration1);
    expect(await planner.quickPreview.hasIteration(c.iteration1)).toBeTruthy();
    await planner.quickPreview.close();

    await planner.workItemList.clickWorkItem(c.workItemTitle2);
    expect(await planner.quickPreview.hasIteration(c.iteration1)).toBeTruthy();
    await planner.quickPreview.addIteration(c.dropdownIteration2);
    expect(await planner.quickPreview.hasIteration(c.iteration2)).toBeTruthy();
    await planner.quickPreview.close();

    await planner.workItemList.clickWorkItem(c.workItemTitle2);
    expect(await planner.quickPreview.hasIteration(c.iteration2)).toBeTruthy();
    await planner.quickPreview.close();

    await planner.workItemList.clickWorkItem(c.workItemTitle3);
    await planner.quickPreview.typeaHeadSearch(c.randomText);
    expect(await planner.quickPreview.iterationDropdown.menu.getTextWhenReady()).toBe('No matches found.');
    await planner.quickPreview.iterationCancelButton.clickWhenReady();
    await planner.quickPreview.iterationDropdown.clickWhenReady();
    expect(await planner.quickPreview.iterationDropdown.menu.getTextWhenReady()).not.toBe('No matches found.');
    await planner.quickPreview.close();
  });

  it('Scenario-Quick Add should support Scenario, papercuts and fundamentals' ,async () => {
    await planner.quickPreview.loadingAnimation.untilHidden();
    let wiTypes = await planner.quickAdd.workItemTypes();
    expect(wiTypes.length).toBe(3);
    expect(wiTypes[0]).toBe('Scenario');
    expect(wiTypes[1]).toBe('Fundamental');
    expect(wiTypes[2]).toBe('Papercuts');
  });

  it('Experiences-Quick Add should support Experience and Value proposition', async () => {
    await planner.sidePanel.clickExperience();
    await planner.quickPreview.loadingAnimation.untilHidden();
    let wiTypes = await planner.quickAdd.workItemTypes();
    expect(wiTypes.length).toBe(2);
    expect(wiTypes[0]).toBe('Experience');
    expect(wiTypes[1]).toBe('Value Proposition');
  });

  it('Requirement-Quick Add should support Feature and Bug', async () => {
    await planner.sidePanel.clickRequirement();
    let wiTypes = await planner.quickAdd.workItemTypes();
    expect(wiTypes.length).toBe(2);
    expect(wiTypes[0]).toBe('Feature');
    expect(wiTypes[1]).toBe('Bug');
  });

  it('Edit Comment and Save', async() => {
    await planner.createWorkItem(c.newWorkItem3);
    expect(await planner.workItemList.hasWorkItem(c.newWorkItem3.title)).toBeTruthy();
    await planner.workItemList.clickWorkItem(c.newWorkItem3.title);
    await planner.quickPreview.addCommentAndSave(c.comment);
    expect(await planner.quickPreview.hasComment(c.comment)).toBeTruthy();
  });

  it('Edit Comment and Cancel', async() => {
    await planner.workItemList.clickWorkItem(c.workItemTitle2);
    await planner.quickPreview.addCommentAndCancel(c.comment);
    expect(await planner.quickPreview.hasComment('new comment')).toBeFalsy();
  });

  it('update of empty workitem title is not allowed', async () => {
    await planner.workItemList.clickWorkItem(c.workItemTitle1);
    await planner.quickPreview.updateTitle('');
    expect(await planner.quickPreview.hasTitleError('Empty title not allowed')).toBeTruthy();
  });

  it('Create custom query', async() => {
    await planner.sidePanel.clickRequirement();
    await planner.header.selectFilter('State','in progress');
    await planner.header.saveFilters('Query 1');
    expect(await planner.sidePanel.hasCustomQuery('Query 1')).toBeTruthy();
  });

});

