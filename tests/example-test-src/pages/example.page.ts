
import { browser, element, by, ExpectedConditions, ElementFinder } from 'protractor';
import { promise } from 'selenium-webdriver';

export class OSIOPlannerMain {

  constructor(login: boolean) {
    if (login) {
      console.log(browser.params.accessToken);
      let url = encodeURIComponent(JSON.stringify(JSON.parse(browser.params.accessToken)));
      browser.get(browser.baseUrl + "/?token_json=" + url);
    } else {
      browser.get(browser.baseUrl);
    }
  }

  get(): void {
    browser.get(browser.baseUrl + '/plan/list');
  }

  getWorkItemQuickAddTitleElement(): ElementFinder {
    return element(by.css(".f8-quickadd-input"));
  }

  typeQuickAddWorkItemTitle(text: string): promise.Promise<void> {
    let until = ExpectedConditions;
    browser.wait(until.presenceOf(this.getWorkItemQuickAddTitleElement()), 30000, 'Failed to find workItemQuickAddTitle');
    return this.getWorkItemQuickAddTitleElement().sendKeys(text);
  }

  getWorkItemQuickAddTitleValue(): promise.Promise<string> {
    return element(by.css(".f8-quickadd-input")).getAttribute('value');
  }
}