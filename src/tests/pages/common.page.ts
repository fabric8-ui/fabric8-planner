import { browser, element, by, ExpectedConditions, ElementFinder } from 'protractor';

/*
 * Common Page Definition - Elements common to all pages
 */
export class CommonPage {
  
  constructor(login: boolean) {
    if (login) {
      let url = encodeURIComponent(JSON.stringify(JSON.parse(browser.params.accessToken)));
      browser.get(browser.baseUrl + "/?token_json=" + url);
    } else {
      browser.get(browser.baseUrl);
    }
  }

  public get(): void {
    browser.get(browser.baseUrl + '/plan/list');
  }

  /* Page elements - top of the page */

  /* Work (workitems) page */
  public clickDashboardMenuTab () {
    return element(by.id("header_menuHome")).click();
  }

  /* Hypothesis page */
  public clickHypothesisMenuTab() {
    return element(by.id("header_menuHypothesis")).click();
  }

  /* Notifications page */
  public clickNotificationsMenuTab () {
    return element(by.id("header_menuNotifications")).click();
  }

  /* Pipeline page */
  public clickPipelineMenuTab () {
    return element(by.id("header_menuPipeline")).click();
  }

  /* Settings page */
  public clickSettingsMenuTab () {
    return element(by.id("header_menuSettings")).click();
  }

  /* Test page */
  public clickTestMenuTab () {
    return element(by.id("header_menuTest")).click(); 
  }
}



