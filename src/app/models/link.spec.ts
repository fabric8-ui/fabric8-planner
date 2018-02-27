import {
  WorkItemLinkMapper,
  WorkItemLinkService,
  WorkItemLinkUI
} from './link';

describe('WorkItemLinkMapper', () => {
  const wiLinkMapper: WorkItemLinkMapper = new WorkItemLinkMapper();

  const wilService = {
    "attributes": {
      "created-at": "2018-02-26T12:35:41.633233Z",
      "updated-at": "2018-02-26T12:35:41.633233Z",
      "version": 0
    },
    "id": "f67c1110-7ee0-4fb7-b9ec-6b948935ed36",
    "links": {
      "self": "https://api.prod-preview.openshift.io/api/workitemlinks/f67c1110-7ee0-4fb7-b9ec-6b948935ed36"
    },
    "relationships": {
      "link_type": {
        "data": {
          "id": "25c326a7-6d03-4f5a-b23b-86a9ee4171e9",
          "type": "workitemlinktypes"
        },
        "links": {
          "self": "https://api.prod-preview.openshift.io/api/spaces/2e0698d8-753e-4cef-bb7c-f027634824a2/workitemlinktypes/25c326a7-6d03-4f5a-b23b-86a9ee4171e9"
        }
      },
      "source": {
        "data": {
          "id": "f9ccc361-6a5c-4803-af93-b922489c16aa",
          "type": "workitems"
        },
        "links": {
          "related": "https://api.prod-preview.openshift.io/api/workitems/f9ccc361-6a5c-4803-af93-b922489c16aa"
        }
      },
      "target": {
        "data": {
          "id": "0cba808b-96f2-4df2-8f57-6edf8e26c0b5",
          "type": "workitems"
        },
        "links": {
          "related": "https://api.prod-preview.openshift.io/api/workitems/0cba808b-96f2-4df2-8f57-6edf8e26c0b5"
        }
      }
    },
    "type": "workitemlinks"
  } as WorkItemLinkService;

  const wilUI = {
    id: "f67c1110-7ee0-4fb7-b9ec-6b948935ed36",
    type: "workitemlinks",
    version: 0,
    linkType: {
      id: "f67c1110-7ee0-4fb7-b9ec-6b948935ed36",
      type: "linktypes",
      forwardName: "parent of",
      reverseName: "child of",
      version: "1",
      selfLink: "https://api.prod-preview.openshift.io/api/workitems/0cba808b-96f2-4df2-8f57-6edf8e26c0b5"
    },
    source: {
      id: '8bccc228-bba7-43ad-b077-15fbb9148f7f',
      title: 'DELETEME',
      number: 1343,
      order: 1045750,
      createdAt: '2017-06-28T07:44:36.640764Z',
      updatedAt: '2018-02-01T09:46:20.885811Z',
      state: 'closed',
      descriptionMarkup: 'PlainText',
      descriptionRendered: 'Cannot resolve Area/Iteration info for new WI created in in-memory mode under Backlog &gt; Quick Add',
      description: 'Cannot resolve Area/Iteration info for new WI created in in-memory mode under Backlog > Quick Add',
      version: 14,
      link: 'https://api.openshift.io/api/workitems/8bccc228-bba7-43ad-b077-15fbb9148f7f',
      WILinkUrl: 'https://api.openshift.io/api/workitems/8bccc228-bba7-43ad-b077-15fbb9148f7f/links',
      area: {
        id: 'e5fc1d21-5c56-4aef-a58a-068865621881',
        name: null, parentPath: null, parentPathResolved: null
      },
      creator: {
        id: '29f698d6-5c65-4129-9e97-5286cdb18a1c',
        name: null, avatar: null, username: null
      },
      iteration: {
        id: '2561c0c9-6d36-46de-89f4-41cbe5b02cd3',
        name: null, parentPath: null, resolvedParentPath: null,
        userActive: null, isActive: null, startAt: null,
        endAt: null, description: null, state: null,
        link: 'https://api.openshift.io/api/iterations/2561c0c9-6d36-46de-89f4-41cbe5b02cd3',
        workItemTotalCount: null, workItemClosedCount: null, hasChildren: null,
        parentId: null, selected: false, showChildren: false
      },
      type: {
        id: '71171e90-6d35-498f-a6a7-2083b5267c18', name: null, icon: null,
        version: null, description: null, childTypes: []
      },
      commentLink: 'https://api.openshift.io/api/workitems/8bccc228-bba7-43ad-b077-15fbb9148f7f/comments',
      assignees: [
        { id: '330b19d2-28d3-4b29-9abf-a324c94b437d', name: null, avatar: null, username: null },
        { id: '543d5193-d519-4126-9e9c-2d608f67639b', name: null, avatar: null, username: null }
      ],
      labels: [  ],
      children: [  ],
      hasChildren: false,
      parentID: null,
      childrenLink: 'https://api.openshift.io/api/workitems/8bccc228-bba7-43ad-b077-15fbb9148f7f/children',
      treeStatus: 'disabled',
      childrenLoaded: false,
      bold: false
    },
    target: {
      id: '8bccc228-bba7-43ad-b077-15fbb9148f7f',
      title: 'DELETEME',
      number: 1343,
      order: 1045750,
      createdAt: '2017-06-28T07:44:36.640764Z',
      updatedAt: '2018-02-01T09:46:20.885811Z',
      state: 'closed',
      descriptionMarkup: 'PlainText',
      descriptionRendered: 'Cannot resolve Area/Iteration info for new WI created in in-memory mode under Backlog &gt; Quick Add',
      description: 'Cannot resolve Area/Iteration info for new WI created in in-memory mode under Backlog > Quick Add',
      version: 14,
      link: 'https://api.openshift.io/api/workitems/8bccc228-bba7-43ad-b077-15fbb9148f7f',
      WILinkUrl: 'https://api.openshift.io/api/workitems/8bccc228-bba7-43ad-b077-15fbb9148f7f/links',
      area: {
        id: 'e5fc1d21-5c56-4aef-a58a-068865621881',
        name: null, parentPath: null, parentPathResolved: null
      },
      creator: {
        id: '29f698d6-5c65-4129-9e97-5286cdb18a1c',
        name: null, avatar: null, username: null
      },
      iteration: {
        id: '2561c0c9-6d36-46de-89f4-41cbe5b02cd3',
        name: null, parentPath: null, resolvedParentPath: null,
        userActive: null, isActive: null, startAt: null,
        endAt: null, description: null, state: null,
        link: 'https://api.openshift.io/api/iterations/2561c0c9-6d36-46de-89f4-41cbe5b02cd3',
        workItemTotalCount: null, workItemClosedCount: null, hasChildren: null,
        parentId: null, selected: false, showChildren: false
      },
      type: {
        id: '71171e90-6d35-498f-a6a7-2083b5267c18', name: null, icon: null,
        version: null, description: null, childTypes: []
      },
      commentLink: 'https://api.openshift.io/api/workitems/8bccc228-bba7-43ad-b077-15fbb9148f7f/comments',
      assignees: [
        { id: '330b19d2-28d3-4b29-9abf-a324c94b437d', name: null, avatar: null, username: null },
        { id: '543d5193-d519-4126-9e9c-2d608f67639b', name: null, avatar: null, username: null }
      ],
      labels: [  ],
      children: [  ],
      hasChildren: false,
      parentID: null,
      childrenLink: 'https://api.openshift.io/api/workitems/8bccc228-bba7-43ad-b077-15fbb9148f7f/children',
      treeStatus: 'disabled',
      childrenLoaded: false,
      bold: false
    }
  } as WorkItemLinkUI;

  it ('should correctly convert to UI model - 1', () => {
    expect(wiLinkMapper.toUIModel(wilService)).toEqual(wilUI);
  })

  it ('should correctly convert to service model - 2', () => {
    expect(wiLinkMapper.toServiceModel(wilUI)).toEqual(wilService);
  })
});
