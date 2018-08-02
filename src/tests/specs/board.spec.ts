import { browser } from 'protractor';
import { PlannerPage } from '../page_objects/planner';
import * as support from '../support';


describe('Board View tests: ', () => {
  let plannerAgile: PlannerPage;
  let c = new support.Constants();
  let URL;

  beforeAll(async () => {
    await support.desktopTestSetup();
    URL = process.env.BASE_URL + '/' + 'rbajpai-preview/test_board_view/plan';
    plannerAgile = new PlannerPage(URL);
    plannerAgile.openInBrowser();
    await browser.get(URL);
    await plannerAgile.waitUntilUrlContains('typegroup');
  });

  beforeEach(async () => {
    await plannerAgile.ready();
  });

  it('should drag and drop', async () => {
    await plannerAgile.clickBoardTab();
    await plannerAgile.sidePanel.ready();
    await plannerAgile.workItemList.overlay.untilHidden();
    expect(plannerAgile.boardView.boardColumnDone.getTextWhenReady()).toContain('Add tests for Agile template');
    await plannerAgile.boardView.dragAndDrop('Add tests for Agile template');
  });
});
