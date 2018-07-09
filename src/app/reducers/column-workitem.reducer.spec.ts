import { GET_SUCCESS, GetSuccess } from '../actions/work-item.actions';
import { WorkItemUI } from '../models/work-item';
import { ColumnWorkItemState, InitialColumnWorkItemState  } from '../states/index.state';
import { ColumnWorkItemReducer } from './column-workitem.reducer';


describe('ColumnWorkitemReducer: ', () => {
  it('should update column-workitem state on [workitem] Get Success', () => {
    const workitem: WorkItemUI[] = [
      {
        id: '1',
        title: 'Work Item 1',
        number: '1',
        createdAt: '00:00',
        updatedAt: '00:00',
        state: 'new',
        descriptionMarkup: 'Markup',
        descriptionRendered: '<p>Hello Word</p>',
        description: 'Hello Workd',
        version: 0,
        order: 1000,
        areaId: null,
        iterationId: null,
        assignees: null,
        creator: null,
        labels: null,
        comments: null,
        children: null,
        commentLink: '',
        childrenLink: '',
        hasChildren: false,
        parentID: '',
        link: '',
        WILinkUrl: '',
        treeStatus: 'collapsed',
        childrenLoaded: false,
        bold: false,
        createId: 1,
        type: null,
        eventLink: '',
        selected: false,
        columnsId: [
          {
            id: '0000-000-05',
            type: 'boardColumns'
          },
          {
            id: '0000-000-06',
            type: 'boardColumns'
          }
        ]
      },
      {
        id: '2',
        title: 'Work Item 1',
        number: '1',
        createdAt: '00:00',
        updatedAt: '00:00',
        state: 'new',
        descriptionMarkup: 'Markup',
        descriptionRendered: '<p>Hello Word</p>',
        description: 'Hello Workd',
        version: 0,
        order: 1000,
        areaId: null,
        iterationId: null,
        assignees: null,
        creator: null,
        labels: null,
        comments: null,
        children: null,
        commentLink: '',
        childrenLink: '',
        hasChildren: false,
        parentID: '',
        link: '',
        WILinkUrl: '',
        treeStatus: 'collapsed',
        childrenLoaded: false,
        bold: false,
        createId: 1,
        type: null,
        eventLink: '',
        selected: false,
        columnsId: [
          {
            id: '0000-000-05',
            type: 'boardColumns'
          },
          {
            id: '0000-000-07',
            type: 'boardColumns'
          }
        ]
      }
    ];

    const columWorkItemState: ColumnWorkItemState = {
      '0000-000-05': ['1', '2'],
      '0000-000-06': ['1'],
      '0000-000-07': ['2']
    };

    const action = new GetSuccess(workitem);
    const state = ColumnWorkItemReducer(InitialColumnWorkItemState, action);

    expect(state).toEqual(columWorkItemState);
  });

  it('should not update the state when there are no columnIds', () => {
    const workitem: WorkItemUI[] = [
      {
        id: '1',
        title: 'Work Item 1',
        number: '1',
        createdAt: '00:00',
        updatedAt: '00:00',
        state: 'new',
        descriptionMarkup: 'Markup',
        descriptionRendered: '<p>Hello Word</p>',
        description: 'Hello Workd',
        version: 0,
        order: 1000,
        areaId: null,
        iterationId: null,
        assignees: null,
        creator: null,
        labels: null,
        comments: null,
        children: null,
        commentLink: '',
        childrenLink: '',
        hasChildren: false,
        parentID: '',
        link: '',
        WILinkUrl: '',
        treeStatus: 'collapsed',
        childrenLoaded: false,
        bold: false,
        createId: 1,
        type: null,
        eventLink: '',
        selected: false,
        columnsId: null
      }
    ];

    const action = new GetSuccess(workitem);
    const state = ColumnWorkItemReducer(InitialColumnWorkItemState, action);

    expect(state).toEqual(InitialColumnWorkItemState);

  });
});
