export class Constants {
  attribute1 = "Iteration";
  attribute2 = "Label";
  attribute3 = "Creator";
  attribute4 = "Assignees";
  dropdownIteration1 = 'Iteration 0';
  dropdownIteration2 = 'Iteration 1';
  updateIteration = 'Iteration 0123'
  label = 'Example Label 0';
  label1 = 'Example Label 1';
  label2 = 'sample_label_2';
  linkType = 'tests';
  newLabel = "new label";
  newLabel1 = "new label 1";
  newIteration ='new Iteration';
  newIteration1 ='new Iteration 1';
  areaTitle1 = '/' + process.env.SPACE_NAME + '/Area_1';
  areaTitle2 = '/' + process.env.SPACE_NAME + '/Area_2';
  iteration1 = '/' + process.env.SPACE_NAME + '/Iteration_1/Iteration1_5';
  iteration2 = '/' + process.env.SPACE_NAME + '/Iteration_2';
  parentIteration = 'Iteration_2';
  iteration3 = '/' + process.env.SPACE_NAME;
  newWorkItem1 = {
    title: "Workitem Title",
    description: "Describes the work item"
  };
  newWorkItem2 = {
    title: "Workitem Title 1"
  };
  newWorkItem3 = {
    title:  "New Workitem"
  };
  updatedWorkItem = {
    title: 'New Workitem Title',
    description: 'New WorkItem Description'
  };
  workItemTitle1 = 'Workitem_Title_10';
  workItemTitle2 = 'Workitem_Title_5';
  workItemTitle7 = 'Workitem_Title_7';
  workItemTitle13 = 'Workitem_Title_13';
  workItemTitle17 = 'Workitem_Title_17';
  user1 = process.env.USER_FULLNAME;
  // Required since we need 2 users. Do not remove
  user2 = this.user1;
  user_avatar = 'https://www.gravatar.com/avatar/37dbe6443dfbc19c54d75af648673516.jpg&s=20';
  comment = "new comment";
  randomText = "zxz"
}
