import { ActionReducer } from '@ngrx/store';
import * as  WorkItemActions  from '../actions/work-item.actions';
import { ColumnWorkItemState, InitialColumnWorkItemState } from '../states/index.state';
import * as ColumnWorkItemActions from './../actions/column-workitem.action';


export type Action = WorkItemActions.All | ColumnWorkItemActions.All;

export const ColumnWorkItemReducer: ActionReducer<ColumnWorkItemState> = (state = InitialColumnWorkItemState, action: Action) => {
  switch (action.type) {
    case WorkItemActions.GET_SUCCESS: {
      let cwState = {};
      action.payload.forEach(item => {
        if (item.columnIds !== null) {
          item.columnIds.forEach(col => {
            if (cwState.hasOwnProperty(col)) {
              cwState[col] = [...cwState[col], item.id];
            } else {
              cwState[col] = [item.id];
            }
          });
        }
      });
      return {...cwState};
    }
    case ColumnWorkItemActions.UPDATE_SUCCESS: {
      const cwState = {...state};
      console.log('#### -- 1', cwState);
      cwState[action.payload.prevColumnId] =
        cwState[action.payload.prevColumnId]
          .filter(id => id !== action.payload.workItemId) ;
      action.payload.newColumnIds.forEach(col => {
        if (cwState.hasOwnProperty(col)) {
          cwState[col] = [...cwState[col], action.payload.workItemId];
        } else {
          cwState[col] = [action.payload.workItemId];
        }
      });
      console.log('#### -- 2', cwState);
      return {...cwState};
    }
    default:  {
      return {...state};
    }
  }
};
