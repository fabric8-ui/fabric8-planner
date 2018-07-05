import { Injectable } from '@angular/core';
import { Actions, Effect } from  '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Notification, Notifications, NotificationType } from 'ngx-base';
import { Observable } from 'rxjs';
import { BoardMapper } from '../models/board.model';
import { normalizeArray } from '../models/common.model';
import { spaceSelector } from '../models/space';
import { BoardService } from '../services/board.service';
import { AppState } from '../states/app.state';
import * as BoardActions from './../actions/board.actions';

export type Action = BoardActions.All;

@Injectable()
export class BoardEffects {
  constructor(
    private actions$: Actions,
    private boardService: BoardService,
    private store: Store<AppState>,
    private notifications: Notifications
  ) {}

  @Effect() getBoardApi: Observable<Action> = this.actions$
    .ofType(BoardActions.GET_BOARD_URL)
    .withLatestFrom(this.store.select(spaceSelector))
    .switchMap(([actions, space]) => {
      const spaceTemplateUrl = space.relationships['space-template'].links.related;
      return this.boardService.getBoardApiUrl(spaceTemplateUrl)
        .map(url => new BoardActions.Get(url))
        .catch((e) => {
          try {
            this.notifications.message({
              message: `Problem in fetching Board.`,
              type: NotificationType.DANGER
            } as Notification);
          } catch (e) {
            console.log('Problem in fetching Board.');
          }
          return Observable.of(
            new BoardActions.GetBoardUrlError()
          );
        });
    });

  @Effect() getBoards: Observable<Action> = this.actions$
    .ofType<BoardActions.Get>(BoardActions.GET)
    .switchMap((action) => {
      return this.boardService.getBoards(action.payload)
        .map(boards => {
          const boardmapper = new BoardMapper();
          return boards.map(board => {
            return boardmapper.toUIModel(board);
          });
        })
        .map(boards => new BoardActions.GetSuccess(normalizeArray(boards, 'context')))
        .catch((e) => {
          try {
            this.notifications.message({
              message: `Problem in fetching Board.`,
              type: NotificationType.DANGER
            } as Notification);
          } catch (e) {
            console.log('Problem in fetching Board.');
          }
          return Observable.of(
            new BoardActions.GetError()
          );
        });
    });
}
