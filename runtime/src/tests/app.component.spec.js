describe('Splash page', function() {

  beforeEach(function() {
      browser.get(browser.params.host);
  });

  it('should redirect to the worklist.', function() {
      expect(browser.getCurrentUrl()).toMatch(browser.params.host);
  });
});
