import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as SpaceActions from './../actions/space.actions';
import { Observable } from 'rxjs';
import { Spaces, Space } from 'ngx-fabric8-wit';

import * as CollaboratorActions from './../actions/collaborator.actions';
import * as AreaActions from './../actions/area.actions';
import * as FilterActions from './../actions/filter.actions';
import * as GroupTypeActions from './../actions/group-type.actions';
import * as IterationActions from './../actions/iteration.actions';
import * as LabelActions from './../actions/label.actions';
import * as WorkItemTypeActions from './../actions/work-item-type.actions';

export type Action = SpaceActions.All;

@Injectable()
export class SpaceEffects {
  private oldSpaceId: string | null = null;

  constructor(
    private actions$: Actions,
    private spaces: Spaces
  ){}

  @Effect() getSpace$: Observable<Action> = this.actions$
    .ofType(SpaceActions.GET)
    .switchMap(action => this.spaces.current)
    .switchMap(space => Observable.of(new SpaceActions.GetSuccess(space)));

  @Effect() getSpaceSuccess$: Observable<any> = this.actions$
    .ofType(SpaceActions.GET_SUCCESS)
    .map(v => v as any)
    .filter(v => !!v && !!v.payload)
    .filter(action => action.payload.id !== this.oldSpaceId)
    .do(action => this.oldSpaceId = action.payload.id)
    .switchMap(() => [
      new CollaboratorActions.Get(),
      new AreaActions.Get(),
      new FilterActions.Get(),
      new GroupTypeActions.Get(),
      new IterationActions.Get(),
      new LabelActions.Get(),
      new WorkItemTypeActions.Get()
    ]);
}
