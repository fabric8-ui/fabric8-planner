import { browser } from 'protractor';
import { PlannerPage } from '../page_objects/planner';
import * as support from '../support';


describe('Planner Collaborator Tests:', () => {
  let planner: PlannerPage;
  let planner1: PlannerPage;
  let c = new support.Constants();

  beforeAll(async () => {
    await support.desktopTestSetup();
    planner = new PlannerPage(browser.baseUrl);
    await planner.openInBrowser();
    let url = await browser.getCurrentUrl()
    let urlPathName = await browser.executeScript('return document.location.pathname');
    let URL = url.replace(urlPathName,'/rbajpai-test-preview/DO_NOT_DELETE/plan');
    planner1 = new PlannerPage(URL);
    await browser.get(URL);
    await browser.sleep(5000);
    await planner.ready();
    });
 
   it('Non Collaborator should not be able create a workItem ', async() => {
   });
 });

