import {
  State,
  ActionReducer
} from '@ngrx/store';
import * as CustomQueryActions from './../actions/custom-query.actions';
import {
  CustomQueryState,
  initialState
} from '../states/custom-query.state';

export type Action = CustomQueryActions.All;

export const CustomQueryReducer: ActionReducer<CustomQueryState> =
  (state = initialState, action: Action) => {
    switch(action.type) {
      case CustomQueryActions.GET_SUCCESS: {
        return action.payload;
      }

      case CustomQueryActions.GET_ERROR: {
        return state;
      }

      default: {
        return state;
      }
    }
  }
