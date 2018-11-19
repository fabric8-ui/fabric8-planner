import { ActionReducer } from '@ngrx/store';
import * as BoardUIActions  from './../actions/board-ui.actions';
import { BoardUIState, initialState } from './../states/board-ui.state';

export type Action = BoardUIActions.All;

export function BoardUIReducer(state = initialState, action: Action) {
  switch (action.type) {
    case BoardUIActions.LOCK_BOARD: {
      return {...state, ...{lockBoard: true}};
    }
    case BoardUIActions.UNLOCK_BOARD: {
      return {...state, ...{lockBoard: false}};
    }
    default: {
      return state;
    }
  }
}
