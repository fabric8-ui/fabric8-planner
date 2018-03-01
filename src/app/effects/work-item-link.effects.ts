import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as WorkItemLinkActions from './../actions/work-item-link.actions';
import { Observable } from 'rxjs';
import { AppState } from './../states/app.state';
import { WorkItemLinkMapper } from './../models/link';
import { WorkItemService } from './../services/work-item.service';

export type Action = WorkItemLinkActions.All;

@Injectable()
export class WorkItemLinkEffects {
  private wilMapper = new WorkItemLinkMapper();

  constructor(
    private actions$: Actions,
    private workItemService: WorkItemService,
    private store: Store<AppState>
  ) {}

  @Effect() getLinks$: Observable<Action> = this.actions$
    .ofType<WorkItemLinkActions.Get>(WorkItemLinkActions.GET)
    .map(action => action.payload)
    .switchMap(payload => {
      return this.workItemService.resolveLinks(payload)
        .map(([links, includes]) => {
          return links.map(link => {
            link.relationships.link_type.data = includes.find(i => i.id === link.relationships.link_type.data.id);
            link.relationships.source.data = includes.find(i => i.id === link.relationships.source.data.id);
            link.relationships.target.data = includes.find(i => i.id === link.relationships.target.data.id);
            return link;
          });
        }).map(links => {
          return new WorkItemLinkActions.GetSuccess(
            links.map(l => this.wilMapper.toUIModel(l))
          );
        });
    });

  @Effect() createLink$: Observable<Action> = this.actions$
    .ofType<WorkItemLinkActions.Add>(WorkItemLinkActions.ADD)
    .map(action => action.payload)
    .switchMap(payload => {
      let createLinkPayload = {'data': payload};
      return this.workItemService
        .createLink(createLinkPayload)
        .map(([link, includes]) => {
          link.relationships.link_type.data = includes.find(i => i.id === link.relationships.link_type.data.id);
          link.relationships.source.data = includes.find(i => i.id === link.relationships.source.data.id);
          link.relationships.target.data = includes.find(i => i.id === link.relationships.target.data.id);
          return new WorkItemLinkActions.AddSuccess(
            this.wilMapper.toUIModel(link)
          )
        })
    })
}
