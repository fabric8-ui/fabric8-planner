import { $, browser, by, WebElement } from 'protractor';
import * as ui from '../../ui';
import { BaseElement } from '../../ui';

export class BoardView extends ui.BaseElement {
  /* board Column */
  boardColumnNew = new ui.BaseElement(this.element(by.cssContainingText('.f8-board-column', 'New')));
  boardColumnOpen = new ui.BaseElement(this.element(by.cssContainingText('.f8-board-column', 'Open')));
  boardColumnInProgress = new ui.BaseElement(this.element(by.cssContainingText('.f8-board-column', 'In Progress')));
  boardColumnDone = new ui.BaseElement(this.element(by.cssContainingText('.f8-board-column', 'Done')));

  card(title: string): WebElement {
    return new ui.BaseElement(this.element(by.xpath("//f8-planner-card[.//*[text()='" + title + "']]")));
  }

  async dragAndDrop(title: string) {
    await browser.actions().dragAndDrop(this.card(title) , this.boardColumnDone).perform();
    await this.card(title).click();
  }

}
