/**
 * AlMighty page object example module for openshift.io start page
 * See: http://martinfowler.com/bliki/PageObject.html,
 * https://www.thoughtworks.com/insights/blog/using-page-objects-overcome-protractors-shortcomings
 * @author ldimaggi@redhat.com
 */

'use strict';

/*
 * openshift.io Start Page Definition
 */

var testSupport = require('../testSupport'),
    constants = require("../constants"),

var until = protractor.ExpectedConditions;

class OpenShiftIoRHDLoginPage {

  constructor() {
  };

  doLogin(browser) {
    this.clickRhdUsernameField();
    this.typeRhdUsernameField(browser.params.login.user);
    this.clickRhdPasswordField();
    this.typeRhdPasswordField(browser.params.login.password);
    return this.clickRhdLoginButton();
  }

  /* Red Hat Developer Login */

  /* Username related changes caused by Sept 12, 2017 UI change - the username label is now
     displayed inside the username field - the label must be clicked before the username text is
     entered */
  get rhdUsernameFieldLabel () {
    return element(by.css(".login-username-field.field>label"));
  }
  get rhdUsernameField () {
    return element(by.id("username"));
  }

  clickRhdUsernameField () {
      browser.wait(until.elementToBeClickable(this.rhdUsernameFieldLabel), constants.LONG_WAIT, 'Failed to find rhdUsernameField');
      return this.rhdUsernameFieldLabel.click().then(function(){
      console.log("OpenShiftIoRHDLoginPage - clicked element:rhdUsernameField");
    });
    // return;
  }

  typeRhdUsernameField (usernameString) {
     return this.rhdUsernameField.sendKeys(usernameString);
  }

  get rhdPasswordField () {
     return element(by.id("password"));
  }
  clickRhdPasswordField () {
    browser.wait(until.elementToBeClickable(this.rhdPasswordField), constants.LONG_WAIT, 'Failed to find rhdPasswordField');
    return this.rhdPasswordField.click().then(function(){
       console.log("OpenShiftIoRHDLoginPage - clicked element:rhdPasswordField");
    });
    // return;
  }
  typeRhdPasswordField (passwordString) {
     return this.rhdPasswordField.sendKeys(passwordString);
  }

  get rhdLoginButton () {
     return element(by.id("kc-login"));
  }
  clickRhdLoginButton () {
    browser.wait(until.presenceOf(this.rhdLoginButton), constants.WAIT, 'Failed to find RHD login');
    this.rhdLoginButton.click().then(function(){
      console.log("OpenShiftIoRHDLoginPage - clicked element:rhdLoginButton");
    });
    return;
  }

}

module.exports = OpenShiftIoRHDLoginPage;
