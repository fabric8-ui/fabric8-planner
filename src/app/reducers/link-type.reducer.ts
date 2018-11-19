import { ActionReducer, State } from '@ngrx/store';
import * as LinkTypeActions from './../actions/link-type.actions';
import { initialState, LinkTypeState } from './../states/link-type.state';

export type Action = LinkTypeActions.All;

export function LinkTypeReducer(state = initialState, action: Action) {
  switch (action.type) {
    case LinkTypeActions.GET_SUCCESS: {
      return action.payload;
    }

    case LinkTypeActions.GET_ERROR: {
      return state;
    }

    default: {
      return state;
    }
  }
}
