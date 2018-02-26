import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as LinkTypeActions from './../actions/link-type.actions';

import { Observable } from 'rxjs';
import { WorkItemService } from './../services/work-item.service';
import {
  LinkTypeService,
  LinkTypeMapper
} from './../models/link-type';

export type Action = LinkTypeActions.All;

@Injectable()
export class LinkTypeEffects {
  constructor(
    private actions$: Actions,
    private workItemService: WorkItemService
  ){}

  @Effect() getLinkTypes$: Observable<Action> = this.actions$
    .ofType(LinkTypeActions.GET)
    .switchMap(action => {
      return this.workItemService.getAllLinkTypes()
        .map((linkTypes) => {
          const ltm = new LinkTypeMapper();
          return new LinkTypeActions.GetSuccess(
            linkTypes.json().data.map(l => ltm.toUIModel(l))
          )
        })
    })
}
