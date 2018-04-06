import { WorkItemService } from './work-item';
import { Space } from "ngx-fabric8-wit";
import {
  modelUI,
  Mapper,
  MapTree,
  switchModel,
  modelService
} from './common.model';

export class WorkItemType extends modelService{
    attributes?: {
      name: string;
      version: number;
      description: string;
      icon: string;
      fields: any;
    };
    relationships? : {
      guidedChildTypes?: {
        data?: WorkItemType[]
      },
      space?: Space
    }
}

export class WorkItemTypeField {
    description?: string;
    label: string;
    required: boolean;
    type: {
      componentType?: string,
      baseType?: string,
      kind: string,
      values?: string[]
    };
}

export interface WorkItemTypeService extends WorkItemType {}

export interface WorkItemTypeUI extends modelUI {
  icon: string;
  version: number;
  type: string;
  description: string;
  childTypes: any;
  infotipTextMap: object;
  fields: Map<string, WorkItemTypeField>;
}

export class WorkItemTypeMapper implements Mapper<WorkItemTypeService, WorkItemTypeUI> {

    serviceToUiMapTree: MapTree = [{
        fromPath: ['id'],
        toPath: ['id']
      }, {
        fromPath: ['attributes','name'],
        toPath: ['name']
      }, {
        fromPath: ['attributes','icon'],
        toPath: ['icon']
      }, {
        fromPath: ['attributes','version'],
        toPath: ['version']
      }, {
        fromPath: ['attributes','description'],
        toPath: ['description']
      }, {
        fromPath: ['relationships', 'guidedChildTypes', 'data'],
        toPath: ['childTypes'],
        toFunction: (item: WorkItemTypeService) => {
          return !!item ? item : [];
        }
      }, {
        fromPath: ['attributes', 'fields'],
        toPath: ['fields']
      }, {
        toPath: ['type'],
        toValue: 'workitemtypes'
      }, {
        toPath: ['infotipTextMap'],
        toValue: { 
            'Scenario': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            'Fundamental': 'Work item type that focuses on getting the basic foundations of a product right to make it more efficient.',
            'Papercuts': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            'Experience': 'Experience describes the envisioned user experience in the product to actualize a parent work item. Each parent work item can have multiple experiences.',
            'Value Proposition': 'Work item type that states the value provided to the user by addressing a parent work item. Each parent work item can have multiple value propositions.',
            'Feature': 'A feature is a detailed user-story that helps actualize parent experiences. It can support multiple experiences and is generally achievable within a sprint.',
            'Bug': 'Defect that causes unexpected behavior in the software.',
            'Task': 'Work assigned to various team members to implement a feature. They are generally measured in units of 0.5 days, for example, four hours, eight hours, sixteen hours.'
     }
    }];

    uiToServiceMapTree: MapTree = [{
        toPath: ['id'],
        fromPath: ['id']
      }, {
        toPath: ['attributes','name'],
        fromPath: ['name']
      }, {
        toPath: ['attributes','icon'],
        fromPath: ['icon']
      }, {
        toPath: ['attributes','version'],
        fromPath: ['version']
      }, {
        toPath: ['attributes','description'],
        fromPath: ['description']
      }, {
        toPath: ['type'],
        toValue: 'workitemtypes'
      }, {
        fromPath: ['childTypes'],
        toPath: ['relationships', 'guidedChildTypes', 'data'],
        toFunction: (item: WorkItemTypeUI) => {
          return !!item ? item : [];
        }
      }, {
        toPath: ['attributes', 'fields'],
        fromPath: ['fields']
      }
    ];

    toUIModel(arg: WorkItemTypeService): WorkItemTypeUI {
      return switchModel<WorkItemTypeService, WorkItemTypeUI>(
        arg, this.serviceToUiMapTree
      );
    }

    toServiceModel(arg: WorkItemTypeUI): WorkItemTypeService {
      return switchModel<WorkItemTypeUI, WorkItemTypeService>(
        arg, this.uiToServiceMapTree
      );
    }
}


export class WorkItemTypeResolver {
  private allTypes:  WorkItemTypeUI[];

  constructor(allTypes: WorkItemTypeUI[] = []) {
    this.allTypes = allTypes;
  }

  resolveChildren() {
    this.allTypes.forEach(type => {
      type.childTypes = this.allTypes.filter(t => {
        return type.childTypes.findIndex(ct => ct.id === t.id) > -1;
      })
    })
  }

  getResolvedWorkItemTypes() {
    return this.allTypes;
  }
}
