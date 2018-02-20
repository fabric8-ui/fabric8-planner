import { browser } from 'protractor';
import { PlannerPage } from '../page_objects/planner'
import * as support from '../support';
import { Constants } from '../support/constants';

describe('Time to', () => {
  let planner: PlannerPage;
  let c = new Constants();
  
  beforeEach( async () => {
    await support.desktopTestSetup();
    let token = encodeURIComponent(JSON.stringify({
      access_token: "somerandomtoken",
      expires_in: 1800,
      refresh_token: "somerandomtoken",
      token_type: "bearer"
    }));
    let planner_url = browser.baseUrl + "/?token_json=" + token;
    planner = new PlannerPage(planner_url);
  });

  it('create a work item', async () => {
    await planner.createWorkItem(c.newWorkItem1);
    expect(await planner.workItemList.hasWorkItem(c.newWorkItem1.title)).toBeTruthy();
  });

  it('click title and open quick preview', async () => {
    await planner.workItemList.clickWorkItem(c.workItemTitle1);
    await planner.quickPreview.titleDiv.untilDisplayed();
  });

  it('click title, open quick preview and update assignee', async () => {
    await planner.workItemList.clickWorkItem(c.workItemTitle1);
    await planner.quickPreview.addAssignee(c.user2);
    expect(await planner.quickPreview.hasAssignee(c.user2)).toBeTruthy();
  });

  it('update workitem title/description', async () => {
    await planner.createWorkItem(c.newWorkItem2);
    expect(await planner.workItemList.hasWorkItem(c.newWorkItem2.title)).toBeTruthy();
    await planner.workItemList.clickWorkItem(c.newWorkItem2.title);
    await planner.quickPreview.updateTitle(c.updatedWorkItem.title);
    await planner.quickPreview.updateDescription(c.updatedWorkItem.description);
    expect(await planner.quickPreview.hasDescription(c.updatedWorkItem.description)).toBeTruthy();
  });

  it('click Experience and time for result display', async () => {
    await planner.sidePanel.clickExperience();
    expect(await planner.workItemList.hasWorkItem(c.workItemTitle1)).toBeTruthy();
  });
});