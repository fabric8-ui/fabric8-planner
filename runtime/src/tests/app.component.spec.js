describe('Splash page', function() {

  beforeEach(function() {
      browser.get(PLANNER_URL);
  });

  it('should redirect to the worklist.', function() {
      expect(browser.getCurrentUrl()).toMatch(PLANNER_URL);
  });
});
