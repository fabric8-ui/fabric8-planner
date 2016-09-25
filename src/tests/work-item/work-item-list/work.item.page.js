/*
* AlMighty page object example module for work item list page
* See: http://martinfowler.com/bliki/PageObject.html
* @author ldimaggi@redhat.com
* TODO - Complete the page object mdel pending completion of UI at: http://demo.almighty.io/
*/

'use strict';

var WorkItemPage = function () {
  browser.get('http://localhost:8088/');
};

WorkItemPage.prototype  = Object.create({}, {

  workItemTitle:  {   
	get: function ()     
		{ return element(by.xpath("//my-app/work-item-list/div/div/div[1]/div/work-item-quick-add/div/div/div[2]/div/input"));
	}},

  workItemDescription:  {   
	get: function ()     
		{ return element(by.xpath("//my-app/work-item-list/div/div/div[1]/div/work-item-quick-add/div/div/div[3]/div/input"));
	}},

  saveButton:  {   
	get: function ()     
		{ return element(by.xpath("//my-app/work-item-list/div/div/div[1]/div/work-item-quick-add/div/div/div[4]/div/a[1]"));
	}},

  allWorkItems:  {   
	get: function ()     
		{ return element.all(by.id('work-item-list'));
	}},

  firstWorkItem:  {   
	get: function ()     
		{ return element(by.xpath(".//*[@id='work-item-list'][1]"));
	}},

   typeWorkItemTitle:  { 
	value: function (keys) { 
		return this.workItemTitle.sendKeys(keys);              
	}},

  typeWorkItemDescription:  { 
	value: function (keys) { 
		return this.workItemDescription.sendKeys(keys);              
	}},

  clickSave:   {
	value: function () { 
		this.saveButton.click();              
	}}

});

module.exports = WorkItemPage;

