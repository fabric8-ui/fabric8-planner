import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Notification, Notifications, NotificationType } from "ngx-base";
import * as WorkItemActions from './../actions/work-item.actions';
import { AppState } from './../states/app.state';
import { Observable } from 'rxjs';
import { WorkItemService as WIService } from './../services/work-item.service';
import { WorkItemMapper, WorkItem, WorkItemService, WorkItemResolver, WorkItemUI } from './../models/work-item';

export type Action = WorkItemActions.All;

@Injectable()
export class WorkItemEffects {
  private workItemMapper: WorkItemMapper =
    new WorkItemMapper();

  constructor(
    private actions$: Actions,
    private workItemService: WIService,
    private store: Store<AppState>,
    private notifications: Notifications
  ){}

  resolveWorkItems(
    workItems, state,
    matchingQuery: boolean = false,
    ancestors: string[] = []
  ): WorkItemUI[] {
    const hasAncestors = !!ancestors.length;
    return workItems.map((wi: WorkItemService) => {
      const workItemUI = this.workItemMapper.toUIModel(wi);
      workItemUI.bold = matchingQuery;
      if (hasAncestors) {
        workItemUI.treeStatus = ancestors.findIndex(
          a => a === workItemUI.id
        ) > -1 ? 'expanded' : workItemUI.treeStatus;
        if (workItemUI.treeStatus === 'expanded') {
          workItemUI.childrenLoaded = true;
        }
      }
      const workItemResolver = new WorkItemResolver(workItemUI);
      workItemResolver.resolveArea(state.areas);
      workItemResolver.resolveIteration(state.iterations);
      workItemResolver.resolveCreator(state.collaborators);
      workItemResolver.resolveType(state.workItemTypes);
      workItemResolver.resolveAssignees(state.collaborators);
      workItemResolver.resolveWiLabels(state.labels);
      return workItemResolver.getWorkItem();
    });
  }

  @Effect() addWorkItems$ = this.actions$
    .ofType<WorkItemActions.Add>(WorkItemActions.ADD)
    .withLatestFrom(this.store.select('listPage'))
    .map(([action, state]) => {
      return {
        payload: action.payload,
        state: state
      };
    })
    .switchMap(op => {
      const payload = op.payload;
      const state = op.state;
      const createID = payload.createId;
      const workItem = payload.workItem;
      return this.workItemService.create(workItem)
        .map(item => {
          const itemUI = this.workItemMapper.toUIModel(item);
          const workItemResolver = new WorkItemResolver(itemUI);
          workItemResolver.resolveArea(state.areas);
          workItemResolver.resolveIteration(state.iterations);
          workItemResolver.resolveCreator(state.collaborators);
          workItemResolver.resolveType(state.workItemTypes);
          const wItem = workItemResolver.getWorkItem();
          wItem.createId = createID;
          try {
            this.notifications.message({
              message: `Work item is added.`,
              type: NotificationType.SUCCESS
            } as Notification);
          } catch (e) {
            console.log('Error displaying notification.')
          }
          return new WorkItemActions.AddSuccess(
            wItem
          );
        })
        .catch(() => {
          try {
            this.notifications.message({
              message: `Problem adding work item.`,
              type: NotificationType.DANGER
            } as Notification);
          } catch (e) {
            console.log('Error displaying notification.')
          }
          return Observable.of(new WorkItemActions.AddError());
        })
    });

  @Effect() getWorkItems$: Observable<Action> = this.actions$
    .ofType<WorkItemActions.Get>(WorkItemActions.GET)
    .withLatestFrom(this.store.select('listPage'))
    .map(([action, state]) => {
      return {
        payload: action.payload,
        state: state
      };
    })
    .switchMap(wp => {
      const payload = wp.payload;
      const state = wp.state;
      return this.workItemService.getWorkItems2(payload.pageSize, payload.filters)
        .map((data: any) => {
          const wis = this.resolveWorkItems(data.workItems, state, payload.isShowTree);
          if (payload.isShowTree) {
            const ancestors = data.ancestorIDs;
            const wiIncludes = this.resolveWorkItems(
              data.included, state,
              false, ancestors
            );
            return [...wis, ...wiIncludes];
          }
          return [...wis];
        })
        .map((workItems: WorkItemUI[]) => {
          return new WorkItemActions.GetSuccess(
            workItems
          );
        })
    });

  @Effect() getWorkItemChildren$: Observable<Action> = this.actions$
    .ofType<WorkItemActions.GetChildren>(WorkItemActions.GET_CHILDREN)
    .withLatestFrom(this.store.select('listPage'))
    .map(([action, state]) => {
      return {
        payload: action.payload,
        state: state
      };
    })
    .switchMap(wp => {
      const parent = wp.payload;
      const state = wp.state;
      return this.workItemService
        .getChildren2(parent.childrenLink)
        .map((data: WorkItemService[]) => {
          const wis = this.resolveWorkItems(
            data, state
          )
          // resolve parent ID
          .map(w => {
            w.parentID = parent.id
            return w;
          });
          return [...wis];
        })
        .map((workItems: WorkItemUI[]) => {
          return new WorkItemActions.GetChildrenSuccess({
            parent: parent,
            children: workItems
          });
        })
    })
}
