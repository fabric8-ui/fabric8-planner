describe('Splash page', function() {

  beforeEach(function() {
      browser.get(browser.params.target.url);
  });

  it('should redirect to the worklist.', function() {
      expect(browser.getCurrentUrl()).toMatch(browser.params.target.url);
  });
});
