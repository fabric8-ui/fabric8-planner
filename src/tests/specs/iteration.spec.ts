import { browser } from 'protractor';
import { PlannerPage } from '../page_objects/planner';
import * as support from '../support';


describe('Iteration test', () => {
  let planner: PlannerPage;
  let c = new support.Constants();

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
    await planner.openInBrowser();
  });

  it('should create a new iteration', async () => {
    await planner.sidePanel.createNewIteration();
    await planner.iteration.addNewIteration(c.newIteration,c.iteration1);
    expect(await planner.sidePanel.hasIteration(c.newIteration)).toBeTruthy();
  });

  fit('updating iteration should update workitem associated to iteration', async() => {
    expect(await planner.workItemList.iterationText(c.workItemTitle1)).toBe('Iteration 0');
    await planner.sidePanel.selectIterationKebab();
    await planner.sidePanel.openIterationDialogue();
    await planner.iteration.editIteration(c.iteration3);
    expect(await planner.workItemList.iterationText(c.workItemTitle1)).toBe('Iteration 0123');
  });

});
