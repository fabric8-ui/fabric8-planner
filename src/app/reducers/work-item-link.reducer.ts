import { State, ActionReducer } from '@ngrx/store';
import * as WorkItemLinkActions from './../actions/work-item-link.actions';
import { WorkItemLinkState, initialState } from './../states/work-item-link.state';

export type Action = WorkItemLinkActions.All;

export const WorkItemLinkReducer: ActionReducer<WorkItemLinkState> =
  (state = initialState, action: Action) => {
    switch(action.type) {
      case WorkItemLinkActions.GET_SUCCESS: {
        return action.payload;
      }
      default: {
        return state;
      }
    }
  }
