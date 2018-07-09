import { ActionReducer } from '@ngrx/store';
import * as  WorkItemActions  from '../actions/work-item.actions';
import { ColumnWorkItemState, InitialColumnWorkItemState } from '../states/index.state';

export type Action = WorkItemActions.All;

export const ColumnWorkItemReducer: ActionReducer<ColumnWorkItemState> = (state = InitialColumnWorkItemState, action: Action) => {
  switch (action.type) {
    case WorkItemActions.GET_SUCCESS: {
      action.payload.forEach(item => {
        if (item.columnsId === null) {
          return state;
        } else {
          item.columnsId.forEach(col => {
            if (state.hasOwnProperty(col.id)) {
              state[col.id].push(item.id);
            } else {
              state[col.id] = [];
              state[col.id].push(item.id);
            }
          });
        }
      });
      return {...state};
    }
  }
};
