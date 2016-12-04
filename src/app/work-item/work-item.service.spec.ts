import {
  async,
  inject,
  TestBed
} from '@angular/core/testing';
import {
  BaseRequestOptions,
  Http,
  Response,
  ResponseOptions
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { Logger } from '../shared/logger.service';

import { DropdownOption } from '../shared-component/dropdown/dropdown-option';

import { AuthenticationService } from './../auth/authentication.service';
import { WorkItem } from './work-item';
import { WorkItemType } from './work-item-type';
import { WorkItemService } from './work-item.service';


describe('Work Item Service - ', () => {

  let apiService: WorkItemService;
  let mockService: MockBackend;
  
  let fakeAuthService: any;

  beforeEach(() => {
    fakeAuthService = {
      getToken: function () {
        return '';
      },
      isLoggedIn: function() {
        return true;
      }
    };
    TestBed.configureTestingModule({
      providers: [
        Logger,
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory: (backend: MockBackend,
                       options: BaseRequestOptions) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        },
        {
          provide: AuthenticationService,
          useValue: fakeAuthService
        },
        WorkItemService
      ]
    });
  });

  beforeEach(inject(
    [WorkItemService, MockBackend],
    (service: WorkItemService, mock: MockBackend) => {
      apiService = service;
      mockService = mock;
    }
  ));
  let resp: WorkItem[] = [
    {
      'fields': {
        'system.assignee': null,
        'system.creator': 'me',
        'system.description': null,
        'system.state': 'new',
        'system.title': 'test1'
      },
      'id': '1',
      'type': 'system.userstory',
      'version': 0
    }
  ] as WorkItem[];
  let response = {data: resp};

  let resp2: WorkItemType[] = [
    {
        'fields': {
            'system.assignee': {
                'required': false,
                'type': {
                    'kind': 'user'
                }
            },
            'system.creator': {
                'required': true,
                'type': {
                    'kind': 'user'
                }
            },
            'system.description': {
                'required': false,
                'type': {
                    'kind': 'string'
                }
            },
            'system.remote_item_id': {
                'required': false,
                'type': {
                    'kind': 'string'
                }
            },
            'system.state': {
                'required': true,
                'type': {
                    'baseType': 'string',
                    'kind': 'enum',
                    'values': [
                        'new',
                        'open',
                        'in progress',
                        'resolved',
                        'closed'
                    ]
                }
            },
            'system.title': {
                'required': true,
                'type': {
                    'kind': 'string'
                }
            }
        },
        'name': 'system.userstory',
        'version': 0
    }
  ] as WorkItemType[];
  let response2 = {data: resp2};

  it('Get work items', async(() => {
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(response),
          status: 200
        })
      ));
    });

    apiService.getWorkItems()
      .then(data => {
        expect(data).toEqual(resp);
      });
  }));

  it('Get work item types', async(() => {
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(response2),
          status: 200
        })
      ));
    });

    apiService.getWorkItemTypes()
      .then(data => {
        expect(data).toEqual(resp2);
      });
  }));


  it('Add new work Item', async(() => {
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(resp[0]),
          status: 201
        })
      ));
    });

    apiService.create(resp[0])
      .then(data => {
        expect(data).toEqual(resp[0]);
      });
  }));

  it('Delete work item', async(() => {
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          status: 200
        })
      ));
    });

    apiService.delete(resp[0])
      .then(data => {
        expect(data).toBeNull();
      });
  }));

  it('Update work item', async(() => {
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(resp[0]),
          status: 200
        })
      ));
    });

    apiService.update(resp[0])
      .then(data => {
        expect(data).toEqual(resp[0]);
      });
  }));

});
