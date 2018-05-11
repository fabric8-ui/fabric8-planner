import { AreaReducer } from './area.reducer';
import { initialState as AreaInitialState, AreaState } from './../states/area.state';
import * as AreaActions from './../actions/area.actions';
import { AreaUI } from './../models/area.model';
export type Action = AreaActions.All;

describe('AreaReducer', () => {
  it('AreaReducer: undefined action should return the default state', () => {
    const action = {} as Action;
    const state = AreaReducer(undefined, action);

    expect(state).toBe(AreaInitialState);
  })

  it('AreaReducer: Get action should return new state', () => {
    const areas: AreaUI[] = [
      {id: '1', name: 'Area 1', parentPath: '/1223', parentPathResolved: '/space'},
      {id: '2', name: 'Area 2', parentPath: '/1224', parentPathResolved: '/space1'}
    ];

    const action = new AreaActions.GetSuccess(areas);
    const state = AreaReducer(AreaInitialState, action);

    expect(state).toEqual(areas);
  });

  it('AreaReducer: GetError Action should return previous state', () => {
    const previousState: AreaUI[] = [
      {id: '1', name: 'Area 1', parentPath: '/1223', parentPathResolved: '/space'},
      {id: '2', name: 'Area 2', parentPath: '/1224', parentPathResolved: '/space1'}
    ];
    const action = new AreaActions.GetError();
    const state = AreaReducer(previousState, action);

    expect(previousState).toEqual(state);
  });
});
