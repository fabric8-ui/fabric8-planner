import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as WorkItemLinkActions from './../actions/work-item-link.actions';
import { Observable } from 'rxjs';
import { AppState } from './../states/app.state';
import { WorkItemLinkMapper } from './../models/link';
import { WorkItemService } from './../services/work-item.service';
import * as WorkItemActions from './../actions/work-item.actions';

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
    .withLatestFrom(this.store.select('listPage').select('workItems'))
    .map(([action, workItems]) => {
      return {
        payload: action.payload,
        workItems: workItems
      }
    })
    .switchMap(p => {
      let createLinkPayload = {'data': p.payload};
      return this.workItemService
        .createLink(createLinkPayload)
        .map(([link, includes]) => {
          link.relationships.link_type.data = includes.find(i => i.id === link.relationships.link_type.data.id);
          link.relationships.source.data = includes.find(i => i.id === link.relationships.source.data.id);
          link.relationships.target.data = includes.find(i => i.id === link.relationships.target.data.id);
          let sourceWIIndex = p.workItems.findIndex(w => w.id === p.payload.relationships.source.data.id);
          let targetWIIndex = p.workItems.findIndex(w => w.id === p.payload.relationships.target.data.id);
          let sourceWorkItem;
          let targetWorkItem;
          if (sourceWIIndex > -1) {
            sourceWorkItem = p.workItems[sourceWIIndex];
          }
          if (targetWIIndex > -1) {
            targetWorkItem = p.workItems[targetWIIndex];
          }
          if (sourceWIIndex > -1 && targetWIIndex > -1) {
            if (sourceWorkItem.treeStatus === 'expanded' ||
            sourceWorkItem.childrenLoaded) {
              this.store.dispatch(new WorkItemActions.CreateLink({
                source: sourceWorkItem,
                target: targetWorkItem,
                sourceTreeStatus: sourceWorkItem.treeStatus
              }));
            } else {
              this.store.dispatch(new WorkItemActions.CreateLink({
                source: sourceWorkItem,
                target: targetWorkItem,
                sourceTreeStatus: sourceWorkItem.treeStatus
              }));
            }
          }
          return new WorkItemLinkActions.AddSuccess(
            this.wilMapper.toUIModel(link)
          )
        })
    })

  @Effect() deleteLink$: Observable<Action> = this.actions$
    .ofType<WorkItemLinkActions.Delete>(WorkItemLinkActions.DELETE)
    .withLatestFrom(this.store.select('listPage').select('workItems'))
    .map(([action, workItems]) => {
      return {
        payload: action.payload,
        workItems: workItems
      }
    })
    .switchMap(p => {
      let wiLink = this.wilMapper.toServiceModel(p.payload.wiLink);
      return this.workItemService
        .deleteLink(wiLink, p.payload.workItemId)
        .map(response => {
          let targetWIIndex = p.workItems.findIndex(w => w.id === p.payload.wiLink.target.id);
          let sourceWIIndex = p.workItems.findIndex(w => w.id === p.payload.wiLink.source.id);
          let targetWorkItem;
          let sourceWorkItem;
          if (targetWIIndex > -1) {
            targetWorkItem = p.workItems[targetWIIndex];
          }
          if (sourceWIIndex > -1) {
            sourceWorkItem = p.workItems[sourceWIIndex];
          }
          this.store.dispatch(new WorkItemActions.DeleteLink({
            source: sourceWorkItem,
            target: targetWorkItem,
            sourceTreeStatus: ''
          }))
          return new WorkItemLinkActions.DeleteSuccess(p.payload.wiLink);
        })
    })
}
