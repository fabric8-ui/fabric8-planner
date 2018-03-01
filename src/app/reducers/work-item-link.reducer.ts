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

      case WorkItemLinkActions.GET_ERROR: {
        return [...state];
      }

      case WorkItemLinkActions.ADD_SUCCESS: {
        console.log(action.payload, '####-2');
        return [action.payload, ...state];
      }

      case WorkItemLinkActions.ADD_ERROR: {
        return [...state];
      }

      default: {
        return state;
      }
    }
  }
