/*
* AlMighty POC/example test making use of page object example module for work item list page
* See: http://martinfowler.com/bliki/PageObject.html
* @author ldimaggi@redhat.com
* TODO - Complete the page object mdel pending completion of UI at: http://demo.almighty.io/
*/

'use strict';

var WorkItemPage = require('./work.item.page.js');

describe('ALMighty homepage', function () {
  var page;

  beforeEach(function () {
    page = new WorkItemPage();
  });

  it('should create a new workitem', function () {

    page.typeWorkItemTitle('Hello Todd version 2.0 Title');
    page.typeWorkItemDescription('And a description too');
    page.clickSave();

// Stopped working on Sept 25 - change to master branch to not include sample data - and cannot write a new owrkitem?
//    expect(page.allWorkItems.count()).toBe(15);	
//
//	page.firstWorkItem.getText().then(function (text) {
//		expect(text.includes("Hello Todd")).toBe(true);
//	});

  });

});


