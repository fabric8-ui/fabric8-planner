import { Key } from 'protractor';
import * as ui from '../../ui';
import { BaseElement } from './../base.element';
import { WorkItemList } from './workitem-list';

export class Query extends WorkItemList {
 queryTextInput = new ui.TextInput(this.$('input[placeholder="Enter your Query..."]'), 'Enter your Query');

 async enterQuery(query: string) {
   await this.queryTextInput.ready();
   await this.queryTextInput.enterText(query);
   await this.queryTextInput.enterText(Key.ENTER);
 }
}
