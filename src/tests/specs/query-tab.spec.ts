import { browser } from 'protractor';
import { PlannerPage } from '../page_objects/planner';
import * as support from '../support';

describe('Query tests', () => {
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

  it('should display search query result', async () => {
    let searchQuery = `typegroup.name : ${testData.group1}`;
    await planner.clickQueryTab();
    await planner.waitUntilUrlContains('query');
    expect(await browser.getCurrentUrl()).toContain('query');
    await planner.query.enterQuery(searchQuery);
    expect(await planner.query.getDataTableHeaderCellCount()).toBe(8);
  });
});
