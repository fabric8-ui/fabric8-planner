import { Injectable } from '@angular/core';
import { createFeatureSelector, createSelector, select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppState, PlannerState } from '../states/app.state';
import {
  Mapper,
  MapTree,
  modelService,
  modelUI,
  switchModel
} from './common.model';
import {
  ATTRIBUTES,
  ID, NAME,
  PARENT_PATH,
  PARENT_PATH_RESOLVED,
  PARENT_PATH_RESOLVED_UI,
  PARENT_PATH_UI,
  TYPE } from './constant';

export class AreaModel extends modelService {
  attributes?: AreaAttributes;
  links?: AreaLinks;
  relationships?: AreaRelations;
}

export class AreaAttributes {
  name: string;
  description?: string;
  parent_path: string;
  parent_path_resolved: string;
}

export class AreaLinks {
  related: string;
  self: string;
}

export class AreaRelations {
  space: {
    data: {
      id: string;
      type: string;
    },
    links: {
      self: string;
    }
  };
  workitems: {
    links: {
      related: string;
    };
  };
}

export interface AreaUI extends modelUI {
  parentPath: string;
  parentPathResolved: string;
}

export interface AreaService extends AreaModel {}

export class AreaMapper implements Mapper<AreaService, AreaUI> {

  serviceToUiMapTree: MapTree = [{
    fromPath: [ID],
    toPath: [ID]
  }, {
    fromPath: [ATTRIBUTES, NAME],
    toPath: [NAME]
  }, {
    fromPath: [ATTRIBUTES, PARENT_PATH],
    toPath: [PARENT_PATH_UI]
  }, {
    fromPath: [ATTRIBUTES, PARENT_PATH_RESOLVED],
    toPath: [PARENT_PATH_RESOLVED_UI]
  }];

  uiToServiceMapTree: MapTree = [{
    toPath: [ID],
    fromPath: [ID]
  }, {
    toPath: [ATTRIBUTES, NAME],
    fromPath: [NAME]
  }, {
    toPath: [ATTRIBUTES, PARENT_PATH],
    fromPath: [PARENT_PATH_UI]
  }, {
    toPath: [ATTRIBUTES, PARENT_PATH_RESOLVED],
    fromPath: [PARENT_PATH_RESOLVED_UI]
  }, {
    toPath: [TYPE],
    toValue: 'areas'
  }];

  toUIModel(arg: AreaService): AreaUI {
    return switchModel<AreaService, AreaUI> (
      arg, this.serviceToUiMapTree
    );
  }

  toServiceModel(arg: AreaUI): AreaService {
    return switchModel<AreaUI, AreaService> (
      arg, this.uiToServiceMapTree
    );
  }
}

@Injectable()
export class AreaQuery {
  private plannerSelector = createFeatureSelector<PlannerState>('planner');
  private areaSelector = createSelector(
    this.plannerSelector,
    (state) => state.areas
  );
  private areaSource = this.store.pipe(select(this.areaSelector));

  constructor(private store: Store<AppState>) {}

  getAreas(): Observable<AreaUI[]> {
    return this.areaSource
    .pipe(
      map(areas => {
        return Object.keys(areas).map(id => areas[id]);
      })
    );
  }

  getAreaObservableById(id: string): Observable<AreaUI> {
    return this.areaSource.pipe(select(areas => areas[id]));
  }
}
