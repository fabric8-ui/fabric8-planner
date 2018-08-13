export class Constants {
  browserName = {
    'browserSDD': {
      'attribute1' : 'Iteration',
      'attribute2' : 'Label',
      'attribute3' : 'Creator',
      'attribute4' : 'Assignees',
      'areaTitle1': '/' + process.env.SPACE_NAME + '/Area_1',
      'areaTitle2': '/' + process.env.SPACE_NAME + '/Area_2',
      'childType': 'Experience',
      'dropdownareaTitle1': 'Area_1',
      'dropdownareaTitle2': 'Area_2',
      'dropdownIteration1': 'Iteration_1/Iteration1_1',
      'dropdownIteration_2': 'Iteration_2',
      'dropdownIteration2' : 'Iteration_1',
      'filterLabel': 'state: closed',
      'group1': 'Scenario',
      'group3': 'Requirement',
      'iteration1': '/' + process.env.SPACE_NAME + '/Iteration_1/Iteration1_1',
      'iteration2': '/' + process.env.SPACE_NAME + '/Iteration_2',
      'IterationTestTitle' : {
        'title': 'test list is not updated when new iteration is added',
        'type': 'Experience'
      },
      'rootIteration': '/' + process.env.SPACE_NAME,
      'label': 'sample_label_1',
      'label1': 'Example Label 1',
      'label2': 'sample_label_2',
      'linkType': 'blocks',
      'newLabel': 'new label',
      'newLabel1': 'new label 1',
      'newIteration': 'new Iteration',
      'newIteration1': 'new Iteration 1',
      'newWorkItem1' : {
        title: 'Workitem Title',
        description: 'Describes the work item'
      },
      'newWorkItem2' : {
        title: 'Workitem Title 1'
      },
      'newWorkItem3': {
        title:  'New Workitem'
      },
      'parentIteration': '/' + process.env.SPACE_NAME + '/Iteration_2',
      'searchWorkItem3': '2 - Workitem_Title_3',
      'searchWorkItem4': '3 - Workitem_Title_4',
      'type': ' Scenario',
      'stateOpen': 'open',
      'stateNew': 'new',
      'stateClosed': 'closed',
      'stateInProgress': 'in progress',
      'stateResolved': 'resolved',
      'updateIteration' : 'Iteration_2123',
      'updatedWorkItem' : {
        title: 'New Workitem Title',
        description: 'New WorkItem Description'
      },
      'user1': process.env.USER_FULLNAME,
       // Required since we need 2 users. Do not remove
      'user2': process.env.USER_FULLNAME,
      'workItemTitle2': 'Workitem_Title_2',
      'Workitem_Title_3': 'Workitem_Title_3',
      'Workitem_Title_4': 'Workitem_Title_4',
      'workItemCommentTest' : 'Work Item 2',
      'workItemTypeFilter' : 'workitemtype: Scenario',
      'workitem': { title : 'new detail workItem', type: 'Scenario'},
      'editWorkItemTitle1': 'Title Text "<0>"',
      'user_avatar': 'https://www.gravatar.com/avatar/f56b4884b4041f14b13d919008fd7d44.jpg&s=25',
      'comment': 'new comment',
      'randomText': 'zxz'
    },
    'browserAgile': {
      'attribute1' : 'Iteration',
      'attribute2' : 'Label',
      'attribute3' : 'Creator',
      'attribute4' : 'Assignees',
      'areaTitle1': '/' + process.env.SPACE_NAME_SCRUM + '/Area_6',
      'areaTitle2': '/' + process.env.SPACE_NAME_SCRUM + '/Area_7',
      'childType': 'Epic',
      'dropdownareaTitle1': 'Area_6',
      'dropdownareaTitle2': 'Area_7',
      'dropdownIteration1': 'Iteration_1/Iteration1_1',
      'dropdownIteration_2': 'Iteration_2',
      'dropdownIteration2' : 'Iteration_1',
      'editWorkItemTitle1': 'Title Text "<0>"',
      'filterLabel': 'state: Closed',
      'group1': 'WorkItemGroup',
      'group3': 'WorkItemGroup',
      'iteration1': '/' + process.env.SPACE_NAME_SCRUM + '/Iteration_1/Iteration1_1',
      'iteration2': '/' + process.env.SPACE_NAME_SCRUM + '/Iteration_2',
      'label': 'sample_label_1',
      'label1': 'Example Label 1',
      'label2': 'sample_label_2',
      'linkType': 'blocks',
      'newLabel': 'new label',
      'newIteration': 'new Iteration',
      'newIteration1': 'new Iteration 1',
      'newWorkItem1' : {
        title: 'Workitem Title',
        description: 'Describes the work item'
      },
      'newWorkItem2' : {
        title: 'Workitem Title 1'
      },
      'newWorkItem3': {
        title:  'New Workitem'
      },
      'parentIteration': '/' + process.env.SPACE_NAME_SCRUM + '/Iteration_2',
      'rootIteration': '/' + process.env.SPACE_NAME_SCRUM,
      'searchWorkItem3': '3 - Workitem_Title_3',
      'searchWorkItem4': '4 - Workitem_Title_4',
      'stateOpen': 'Open',
      'stateNew': 'New',
      'stateClosed': 'Closed',
      'stateInProgress': 'In Progress',
      'stateResolved': 'Resolved',
      'type': ' Defect',
      'updatedWorkItem' : {
        title: 'New Workitem Title',
        description: 'New WorkItem Description'
      },
      'user1': process.env.USER_FULLNAME,
      // Required since we need 2 users. Do not remove
      'user2': process.env.USER_FULLNAME,
      'Workitem_Title_4': 'Workitem_Title_4',
      'Workitem_Title_3': 'Workitem_Title_3',
      'workItemTitle2': 'Workitem_Title_2',
      'workitem': { title : 'new detail workItem', type: 'Task'},
      'workItemTypeFilter' : 'workitemtype: Defect',
      'workItemCommentTest' : 'Work Item 1',
      'user_avatar': 'https://www.gravatar.com/avatar/f56b4884b4041f14b13d919008fd7d44.jpg&s=25',
      'comment': 'new comment',
      'randomText': 'zxz'
    }
  };
}
