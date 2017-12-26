/**
 * Planner page object example module for work item list page
 * See: http://martinfowler.com/bliki/PageObject.html,
 * https://www.thoughtworks.com/insights/blog/using-page-objects-overcome-protractors-shortcomings
 * @author ldimaggi@redhat.com
 * TODO - Complete the page object model pending completion of UI at: http://demo.almighty.io/
 */

'use strict';

/*
 * Constants Definition
 */

function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}
define("WAIT", 30000);
define("LONG_WAIT", 60000);
define("NEW_WORK_ITEM_TITLE_1", "New Work Item 1")
define("NEW_WORK_ITEM_TITLE_2", "New Work Item 2");
define("WORK_ITEM_TITLE", "Workitem_Title_20");
define("WORK_ITEM_TITLE_1", "Workitem_Title_19");
define("WORK_ITEM_TITLE_2", "Workitem_Title_18");
define("WORK_ITEM_TITLE_3", "Workitem_Title_17");
define("WORK_ITEM_TITLE_4", "Workitem_Title_11");
define("WORK_ITEM_UPDATED_TITLE", "Test workitem title-UPDATED");
define("WORK_ITEM_DESCRIPTION", "The test workitem description");
define("WORK_ITEM_UPDATED_DESCRIPTION", "Test description-UPDATED");
define("EXAMPLE_USER", USER_FULL_NAME); // Global value from config
define("SPACE_NAME", SPACE_NAME);
define("AREA_1_TITLE", '/' + this.SPACE_NAME + '/Area_1');
define("AREA_2_TITLE", '/' + this.SPACE_NAME + '/Area_2');
define("ITERATION_1_TITLE", '/' + this.SPACE_NAME + '/Iteration_1');
define("ITERATION_2_TITLE", '/' + this.SPACE_NAME + '/Iteration_2');
define("NEW_LABEL_TITLE", "My Test Label");
define("NEW_ITERATION_TITLE", "New Iteration");
define("NEW_ITERATION_DESCRIPTION", "New Iteration Description");
define("NEW_LABEL_TITLE", "My Test Label");
define("PRE_SELECTED_LABEL", "sample_label_3");
define("LABEL_1", "sample_label_1");
define("LABEL_2", "sample_label_2");
