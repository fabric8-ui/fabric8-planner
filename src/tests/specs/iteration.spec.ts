import { browser } from 'protractor';
import { PlannerPage } from '../page_objects/planner';
import * as support from '../support';


describe('Iteration test', () => {
  let planner: PlannerPage;
  let c = new support.Constants();

  beforeEach( async () => {
    await support.desktopTestSetup();
    planner = new PlannerPage(browser.baseUrl);
    await planner.openInBrowser();
    // This is necessary since the planner takes time to load on prod/prod-preview
    await browser.sleep(12000);
    await planner.ready();
  });

  it('should create a new iteration', async () => {
    await planner.sidePanel.createNewIteration();
    await planner.iteration.addNewIteration(c.newIteration,c.iteration3);
    expect(await planner.sidePanel.hasIteration(c.newIteration)).toBeTruthy();
  });

  it('updating iteration should update workitem associated to iteration', async() => {
    await planner.sidePanel.ready();
    expect(await planner.workItemList.iterationText(c.workItemTitle1)).toBe(c.dropdownIteration1);
    await planner.sidePanel.selectIterationKebab(c.dropdownIteration1);
    await planner.sidePanel.openIterationDialogue();
    await planner.iteration.editIteration(c.iteration3);
    expect(await planner.workItemList.iterationText(c.workItemTitle1)).toBe(c.updateIteration);
  });

});
