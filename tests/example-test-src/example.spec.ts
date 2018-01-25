// local import of the exported AngularPage class
import { OSIOPlannerMain } from './pages/example.page';

// The jasmine typings are brought in via DefinitelyTyped ambient typings.
describe('angularjs homepage', () => {
  it('should greet the named user', () => {
    let examplePage = new OSIOPlannerMain(true);
    examplePage.get();
    examplePage.typeQuickAddWorkItemTitle('Some New Work Item Title');
    expect(examplePage.getWorkItemQuickAddTitleValue()).toEqual('Some New Work Item Title');
  });
});