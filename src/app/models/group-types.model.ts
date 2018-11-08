import { Injectable } from '@angular/core';
// MemoizedSelector is needed even if it's not being used in this file
// Else you get this error
// Exported variable 'groupTypeSelector' has or is using name 'MemoizedSelector'
// from external module "@ngrx/store/src/selector" but cannot be named.
import { createSelector, MemoizedSelector, select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { AppState } from './../states/app.state';
import {
  Mapper,
  MapTree,
  modelService,
  modelUI,
  switchModel
} from './common.model';
import {
  ATTRIBUTES,
  BUCKET,
  DATA,
  DESCRIPTION,
  GROUP,
  ICON,
  ID,
  LEVEL,
  NAME,
  RELATIONSHIPS,
  SHOW_IN_SIDEBAR,
  SUBLEVEL,
  TYPE,
  TYPELIST
} from './constant';
import { plannerSelector } from './space';

export class GroupTypesModel extends modelService {
  attributes: WITGroupAttributes;
  links?: {
    related: string;
  };
  relationships?: WorkItemRelations;
}

export class WITGroupAttributes {
  bucket: string;
  level: number[];
  icon: string;
  sublevel?: number;
  group: string;
  name: string;
  [SHOW_IN_SIDEBAR]: boolean;
  description: string;
}

export class WorkItemRelations {
  defaultType?: {
    data?: object;
    links?: object;
  };
  nextGroup?: {
    data?: object;
    links?: object;
  };
  spaceTemplate?: {
    data?: object;
    links?: object;
  };
  typeList?: {
    data?: TypeListData[];
  };
}

export class TypeListData {
  id: string;
  workitemtype: string;
}

export interface GroupTypeService extends GroupTypesModel {}

// id: id
// name: attributes / name
export interface GroupTypeUI extends modelUI {
  bucket: string; // attributes / bucket
  level: number[]; // attributes / level
  icon: string; // attributes / icon
  sublevel?: number; // attributes / sublevel
  group: string; // attributes / group
  selected: boolean;
  showInSideBar: boolean; // attributes / show-in-sidebar
  typeList: TypeListData[]; // relationships / typeList / data
  description: string; // attributes / description
}

export class GroupTypeMapper implements Mapper<GroupTypeService, GroupTypeUI> {
  serviceToUiMapTree: MapTree = [
    {
      fromPath: [ID],
      toPath: [ID]
    },
    {
      fromPath: [ATTRIBUTES, NAME],
      toPath: [NAME]
    },
    {
      fromPath: [ATTRIBUTES, BUCKET],
      toPath: [BUCKET]
    },
    {
      fromPath: [ATTRIBUTES, LEVEL],
      toPath: [LEVEL]
    },
    {
      fromPath: [ATTRIBUTES, ICON],
      toPath: [ICON]
    },
    {
      fromPath: [ATTRIBUTES, SUBLEVEL],
      toPath: [SUBLEVEL]
    },
    {
      fromPath: [ATTRIBUTES, GROUP],
      toPath: [GROUP]
    },
    {
      toPath: ['selected'],
      toValue: false
    },
    {
      fromPath: [ATTRIBUTES, SHOW_IN_SIDEBAR],
      toPath: ['showInSideBar']
    },
    {
      fromPath: [RELATIONSHIPS, TYPELIST, DATA],
      toPath: [TYPELIST]
    },
    {
      fromPath: [ATTRIBUTES, DESCRIPTION],
      toPath: [DESCRIPTION],
      toFunction: value => value || 'no info-tip'
    }
  ];

  uiToServiceMapTree: MapTree = [
    {
      fromPath: [ID],
      toPath: [ID]
    },
    {
      fromPath: [NAME],
      toPath: [ATTRIBUTES, NAME]
    },
    {
      fromPath: [BUCKET],
      toPath: [ATTRIBUTES, BUCKET]
    },
    {
      fromPath: [LEVEL],
      toPath: [ATTRIBUTES, LEVEL]
    },
    {
      fromPath: [ICON],
      toPath: [ATTRIBUTES, ICON]
    },
    {
      fromPath: [SUBLEVEL],
      toPath: [ATTRIBUTES, SUBLEVEL]
    },
    {
      fromPath: [GROUP],
      toPath: [ATTRIBUTES, GROUP]
    },
    {
      fromPath: ['showInSideBar'],
      toPath: [ATTRIBUTES, SHOW_IN_SIDEBAR]
    },
    {
      fromPath: [TYPELIST],
      toPath: [RELATIONSHIPS, TYPELIST, DATA]
    },
    {
      toPath: [TYPE],
      toValue: 'grouptypes'
    }
  ];

  toUIModel(arg: GroupTypeService): GroupTypeUI {
    return switchModel<GroupTypeService, GroupTypeUI>(
      arg,
      this.serviceToUiMapTree
    );
  }

  toServiceModel(arg: GroupTypeUI): GroupTypeService {
    return switchModel<GroupTypeUI, GroupTypeService>(
      arg,
      this.uiToServiceMapTree
    );
  }
}

export const groupTypeSelector = createSelector(
  plannerSelector,
  state => state.groupTypes
);
@Injectable()
export class GroupTypeQuery {
  constructor(private store: Store<AppState>) {}
  get getGroupTypes(): Observable<GroupTypeUI[]> {
    return this.store.pipe(
      select(groupTypeSelector),
      filter(g => g.length > 0)
    );
  }
  get getFirstGroupType(): Observable<GroupTypeUI> {
    return this.getGroupTypes.pipe(map(g => g[0]));
  }
}
