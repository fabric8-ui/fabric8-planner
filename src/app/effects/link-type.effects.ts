import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as LinkTypeActions from './../actions/link-type.actions';
import { AppState } from './../states/app.state';

import { Observable } from 'rxjs';
import {
  LinkTypeService,
  LinkTypeUI
} from './../models/link-type';
import { WorkItemService } from './../services/work-item.service';

export type Action = LinkTypeActions.All;

@Injectable()
export class LinkTypeEffects {
  constructor(
    private actions$: Actions,
    private workItemService: WorkItemService,
    private store: Store<AppState>
  ) {}

  @Effect() getLinkTypes$: Observable<Action> = this.actions$
    .ofType(LinkTypeActions.GET)
    .withLatestFrom(this.store.select('listPage').select('space'))
    .map(([action, space]) => {
      return {
        payload: action,
        space: space
      };
    })
    .switchMap(lt => {
      return this.workItemService.getAllLinkTypes(lt.space.links.workitemlinktypes)
        .map((data) => {
          let lts: any = {};
          let linkTypes: LinkTypeUI[] = [];
          lts['forwardLinks'] = data.json().data;
          lts['backwardLinks'] = data.json().data;
          lts.forwardLinks.forEach((linkType) => {
            linkTypes.push({
              name: linkType.attributes['forward_name'],
              id: linkType.id,
              linkType: 'forward'
            });
          });
          lts.backwardLinks.forEach((linkType) => {
            linkTypes.push({
              name: linkType.attributes['reverse_name'],
              id: linkType.id,
              linkType: 'reverse'
            });
          });
          return new LinkTypeActions.GetSuccess(linkTypes);
        });
    });
}
