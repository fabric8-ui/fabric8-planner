import { State } from '@ngrx/store';
import { ActionReducer } from '@ngrx/store';
import * as WorkItemTypeActions from './../actions/work-item-type.actions';

import { createEntityAdapter } from '@ngrx/entity';
import { WorkItemTypeUI } from '../models/work-item-type';
import { initialState, WorkItemTypeState } from '../states/work-item-type.state';

export type Action = WorkItemTypeActions.All;

export function WorkItemTypeReducer(state = initialState, action: Action) {
  const workItemTypeAdapter = createEntityAdapter<WorkItemTypeUI>();
  switch (action.type) {
    case WorkItemTypeActions.GET_SUCCESS: {
      return workItemTypeAdapter.addAll(action.payload, state);
    }

    case WorkItemTypeActions.GET_ERROR: {
      return state;
    }

    default: {
      return state;
    }
  }
}
