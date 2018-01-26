import { OSIOPlannerMain } from './pages/example.page';

describe('example test', () => {
  it('should do an example test', () => {
    let examplePage = new OSIOPlannerMain(true);
    examplePage.get();
    examplePage.typeQuickAddWorkItemTitle('Some New Work Item Title');
    expect(examplePage.getWorkItemQuickAddTitleValue()).toEqual('Some New Work Item Title');
  });
});
