describe('Splash page', function() {

  beforeEach(function() {
      browser.get(browser.params.target.url + "/");
//      browser.get('http://localhost:8088/');
  });

  it('should redirect to the worklist.', function() {
      expect(browser.getCurrentUrl()).toMatch(browser.params.target.url + "/");
//      expect(browser.getCurrentUrl()).toMatch("http://localhost:8088/");
  });
});
