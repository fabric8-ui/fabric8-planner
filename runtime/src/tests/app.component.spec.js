describe('Splash page', function() {

  beforeEach(function() {
      browser.get('https://openshift.io/rgarg-osiotest1/rgarg-osiotest1-sep4space1/plan');
  });

  it('should redirect to the worklist.', function() {
      expect(browser.getCurrentUrl()).toMatch("https://openshift.io/rgarg-osiotest1/rgarg-osiotest1-sep4space1/plan");
  });
});
