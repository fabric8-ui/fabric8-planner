import { Action } from '@ngrx/store';
import { UserUI } from './../models/user';
import { UserState } from './../states/user.state';

export const SET = '[users] Get';

/**
 * This action class set the normalized user data
 * Be it one user or number of users we can use
 * this action to update the user state
 * The payload value is a disctionary of users
 * where the id is the key and value is the entire
 */
export class Set implements Action {
  payload: UserState;
  constructor(payload: UserState) {
    this.payload = payload;
  }
  readonly type = SET;
}

export type All
  = Set
