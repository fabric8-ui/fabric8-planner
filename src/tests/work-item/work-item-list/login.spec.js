/**
 * POC test for automated UI tests for ALMighty
 *  Story: Display and Update Work Item Details
 *  https://github.com/almighty/almighty-core/issues/296
 *
 * Note on screen resolutions - See: http://www.itunesextractor.com/iphone-ipad-resolution.html
 * Tests will be run on these resolutions:
 * - iPhone6s - 375x667
 * - iPad air - 768x1024
 * - Desktop -  1920x1080
 *
 * beforeEach will set the mode to phone. Any tests requiring a different resolution will must set explicitly.
 *
 * @author nverma
 */

var WorkItemListPage = require('./work-item-list.page'),
  testSupport = require('./testSupport');

describe('Work item list', function () {
  var page, items, startCount, browserMode;

  beforeEach(function () {
    testSupport.setBrowserMode('phone');
    page = new WorkItemListPage();
  });
  it('Test Login in mobile mode', function() {
    page.clickCaret();
    //page.clickLoginButtonMobile();
    page.clickLogoutButtonMobile();
    page.clickCaret();
    page.clickLoginButtonMobile();
    browser.ignoreSynchronization = true;
    page.signInGithub('almightytest','mytestaccount@123');
    browser.ignoreSynchronization = true;
     if(browser.getTitle()=='Authorize almighty'){
       browser.ignoreSynchronization = true;
       element(By.css('.btn.btn-primary')).click();
     }
     else{
       expect(page.clickWorkItemQuickAdd().isPresent()).toBeTruthy();

     }
  });
  it('Test Login with desktop mode ', function() {
          testSupport.setBrowserMode('desktop');
          page.clickLoginButton(); //If the browser is already login
          page.clickLoginButton();
          browser.ignoreSynchronization = true;
          page.signInGithub('almightytest','mytestaccount@123');

           browser.ignoreSynchronization = true;
           if(browser.getTitle()=='Authorize almighty'){
             browser.ignoreSynchronization = true;
             element(By.css('.btn.btn-primary')).click();
           }
           else{
             expect(page.clickWorkItemQuickAdd().isPresent()).toBeTruthy();
           }
});

});
