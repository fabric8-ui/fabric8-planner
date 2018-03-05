import { AppState } from './../states/app.state';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as GroupTypeActions from './../actions/group-type.actions';
import { Observable } from 'rxjs';
import { GroupTypesService as GTService } from './../services/group-types.service';
import {
  GroupTypeService,
  GroupTypeMapper
} from './../models/group-types.model';

export type Action = GroupTypeActions.All;

@Injectable()
export class GroupTypeEffects {
  constructor(
    private actions$: Actions,
    private groupTypeService: GTService,
    private store: Store<AppState>
  ){}

  @Effect() getGroupTypes$: Observable<Action> = this.actions$
    .ofType(GroupTypeActions.GET)
    .withLatestFrom(this.store.select('listPage').select('space'))
    .switchMap(([action, space]) => {
      return this.groupTypeService.getGroupTypes2(
          space.relationships.workitemtypegroups.links.related
        )
        .map((types: GroupTypeService[]) => {
          const gtm = new GroupTypeMapper();
          return new GroupTypeActions.GetSuccess(
            types.map(t => gtm.toUIModel(t))
          )
        })
    })
}
