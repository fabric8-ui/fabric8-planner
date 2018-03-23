import { BaseElement } from './../base.element';
import { ElementFinder, browser } from 'protractor';
import * as ui from '../../ui';

export class ToolbarHeader extends BaseElement {
  notificationToast = new ui.BaseElementArray($$('pfng-toast-notification'), 'Notification Toast');
  header = new BaseElement(this.$('.toolbar-pf-view-selector'), 'header div');
  showTree = new BaseElement(this.$('.toolbar-pf-view-selector #showTree'), 'show Tree');
  filterDropdown = new ui.Dropdown(
    this.$('.input-group-btn'),
    this.$('.input-group-btn .dropdown-menu'),
    'Filter-By dropdown'
  );
  selectFilterCondition = new ui.Dropdown(
    this.$('.filter-select'),
    this.$('.filter-select .dropdown-menu'),
    'Select Filter Condition'
  );
  private clearAllFilter = new ui.Clickable(this.$('.clear-filters'), 'Clear All filters');
  showCompleted = new BaseElement(this.$('.toolbar-pf-view-selector #showCompleted'), 'Show Completed');

  constructor(el: ElementFinder, name = 'ToolBar Header') {
    super(el, name);
  }

  async ready() {
    await super.ready();
    await this.header.untilPresent();
  }

  async clickShowTree() {
    await this.ready();
    await this.showTree.untilDisplayed();
    await this.showTree.clickWhenReady();
  }

  async selectFilter(Label: string, LabelTest: string) {
    await this.ready();
    await this.filterDropdown.clickWhenReady();
    await this.filterDropdown.select(Label);
    await this.selectFilterCondition.clickWhenReady();
    await this.selectFilterCondition.select(LabelTest);
  }

  async clickClearAllFilters() {
    await this.clearAllFilter.clickWhenReady();
  }

  async clickShowCompleted() {
    await this.ready();
    await this.showCompleted.untilDisplayed();
    while(true) {
      try {
        await this.showCompleted.clickWhenReady();
        break;
      } catch(e) {
        await browser.sleep(1000);
        await this.notificationToast.untilCount(0);
      }
    }
  }
}
