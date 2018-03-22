import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as CustomQueryActions from './../actions/custom.query.actions';
import { Observable } from 'rxjs';
import {
  CustomQueryService
} from './../services/custom-query.service';
import { CustomQueryModel } from './../models/custom.query.model';
import {
  Notification,
  Notifications,
  NotificationType
} from "ngx-base";

export type Action = CustomQueryActions.All;

@Injectable()
export class CustomQueryEffects {
  constructor(
    private actions$: Actions,
    private customQueryService: CustomQueryService,
    private notifications: Notifications
  ) {}

  @Effect() GetCustomQueries$: Observable<Action> = this.actions$
    .ofType(CustomQueryActions.GET)
    .switchMap(action => {
      return this.customQueryService.getCustomqueries()
        .map((types: CustomQueryModel[]) => {
          return new CustomQueryActions.GetSuccess(types);
        })
        .catch(e => {
          try {
            this.notifications.message({
              message: 'Problem in fetching custom queries.',
              type: NotificationType.DANGER
            } as Notification);
          } catch (e) {
            console.log('Problem in fetching custom queries');
          }
          return Observable.of(new CustomQueryActions.GetError());
        })
    })
}
