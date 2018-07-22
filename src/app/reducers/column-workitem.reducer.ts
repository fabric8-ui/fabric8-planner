import { ActionReducer } from '@ngrx/store';
import * as  WorkItemActions  from '../actions/work-item.actions';
import { ColumnWorkItemState, InitialColumnWorkItemState } from '../states/index.state';
import * as ColumnWorkItemActions from './../actions/column-workitem.action';


export type Action = WorkItemActions.All | ColumnWorkItemActions.All;

export const ColumnWorkItemReducer: ActionReducer<ColumnWorkItemState> = (state = InitialColumnWorkItemState, action: Action) => {
  switch (action.type) {
    case WorkItemActions.GET_SUCCESS: {
      const cwState = {...state};
      action.payload.forEach(item => {
        if (item.columnIds !== null) {
          item.columnIds.forEach(col => {
            if (cwState.hasOwnProperty(col)) {
              cwState[col].add(item.id);
            } else {
              cwState[col] = new Set([item.id]);
            }
          });
        }
      });
      return {...cwState};
    }
    case ColumnWorkItemActions.UPDATE_SUCCESS: {
      const cwState = {...state};
      cwState[action.payload.prevColumnId].delete(action.payload.workItemId);
      action.payload.newColumnIds.forEach(id => {
        cwState[id].add(action.payload.workItemId);
      });
      return cwState;
    }
    default:  {
      return {...state};
    }
  }
};
