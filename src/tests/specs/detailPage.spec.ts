import { browser } from 'protractor';
import { PlannerPage } from '../page_objects/planner';
import * as support from '../support';


describe('Detail View test: ', () => {
  let planner: PlannerPage;
  let c = new support.Constants();
  
  beforeAll( async () => {
    await support.desktopTestSetup();
    planner = new PlannerPage(browser.baseUrl);
    await planner.openInBrowser();
    // This is necessary since the planner takes time to load on prod/prod-preview
    await browser.sleep(5000);
    await planner.ready();
  });

  beforeEach( async () => {
    await planner.workItemList.untilUrlContains('typegroup');
    await planner.ready();
  });

  afterEach( async () => {
    await browser.executeScript("document.getElementsByClassName('f8-detail--close')[0].click()");
    await planner.quickPreview.notificationToast.untilHidden();
  });
  
  it('should open detail view and apply label', async () => {
    let workitemname = {"title": "detail page test"},
      label = 'Label1';
    await planner.createWorkItem(workitemname);
    await planner.workItemList.openDetailPage(workitemname.title);
    await planner.detailPage.addLabel(c.label);
    expect(await planner.detailPage.getLabels()).toContain(c.label);
  });
  
  it('should update title and description', async () => {
    let workitemname = {"title": "detail page title test"},
     updatedWorkItem = {
      title: "detail page title updated",
      description: 'New WorkItem Description'
    };
    await planner.createWorkItem(workitemname);
    await planner.workItemList.openDetailPage(workitemname.title);
    await planner.detailPage.updateTitle(updatedWorkItem.title);
    expect(await planner.detailPage.titleInput.getAttribute('value')).toBe(updatedWorkItem.title);
    await planner.detailPage.updateDescription(updatedWorkItem.description);
    expect(await planner.detailPage.getDescription()).toBe(updatedWorkItem.description);
  });
    
  it('Associate workitem with an Area', async () => {
    let workitemname = {"title": "detail page test"};
    await planner.workItemList.openDetailPage(workitemname.title);
    await planner.detailPage.addArea(c.dropdownareaTitle1);
    expect(await planner.detailPage.getArea()).toBe(c.areaTitle1);
  });

  it('Associate workitem with an Iteration', async () => {
    let workitemname = {"title": "detail page test"};
    await planner.workItemList.openDetailPage(workitemname.title);
    await planner.detailPage.addIteration(c.dropdownIteration1);
    expect(await planner.detailPage.getIteration()).toBe(c.iteration1);
  });

  it('should add comment', async () => {
    let workitemname = {"title": "detail page test"};
    await planner.workItemList.openDetailPage(workitemname.title);
    await planner.detailPage.addCommentAndSave(c.comment);
    expect(await planner.detailPage.getComments()).toContain(c.comment);
  });

  it('should link a workitem', async () => {
    let linkType = 'blocks',
      workItemTitle20 = 'Workitem_Title_20',
      workitemname = {"title": "detail page test"};
    await planner.workItemList.openDetailPage(workitemname.title);
    await planner.detailPage.addLink(linkType, workItemTitle20);
    expect(await planner.detailPage.getLinkedItems()).toContain(workItemTitle20);
  });

  it('should change the state of workitem', async () => {
    let workitemname = {"title": "detail page test"};
    await planner.workItemList.openDetailPage(workitemname.title);
    await planner.detailPage.changeStateTo('open');
    expect(planner.detailPage.stateToggle.getTextWhenReady()).toContain('open');
  });
});