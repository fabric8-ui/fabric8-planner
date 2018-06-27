import { browser } from 'protractor';
import { PlannerPage } from '../page_objects/planner';
import * as support from '../support';

describe('Agile template tests: ', () => {
  let planner: PlannerPage;
  let planner1: PlannerPage;

  beforeAll( async () => {
    await support.desktopTestSetup();
    planner = new PlannerPage(browser.baseUrl);
    await planner.openInBrowser();
    let url = await browser.getCurrentUrl()
    let urlPathName = await browser.executeScript('return document.location.pathname');
    let URL = url.replace(urlPathName,'/' + process.env.USER_NAME + '/' + process.env.SPACE_NAME_SCRUM + '/plan');
    planner1 = new PlannerPage(URL);
    await browser.get(URL);
    await planner1.waitUntilUrlContains('typegroup');
  });

  beforeEach( async () => {
    await planner1.sidePanel.workItemsGroup.clickWhenReady();
  });

  afterEach( async() => {
  });

  it('should have workitem types', async() => {
    await planner1.sidePanel.workItemsGroup.clickWhenReady();
    let wiTypes = await planner1.quickAdd.workItemTypes();
    expect(wiTypes.length).toBe(5);
    expect(wiTypes[0]).toBe('Theme');
    expect(wiTypes[1]).toBe('Epic');
    expect(wiTypes[2]).toBe('Story');
    expect(wiTypes[3]).toBe('Task');
    expect(wiTypes[4]).toBe('Defect');
  });

  it('should create a defect and assign priority and severity', async() => {
    let newWorkItem = { title: "Workitem Title 1", type : "Defect"};
    await planner1.createWorkItem(newWorkItem);
    expect(planner1.workItemList.hasWorkItem(newWorkItem.title)).toBeTruthy();
  });
});
