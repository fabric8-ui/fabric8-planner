import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { User, UserService } from 'ngx-login-client';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import {
  Add as AddCommentAction,
  Get as GetCommentActions,
  Update as UpdateCommentAction
} from './../actions/comment.actions';
import { AppState } from './../states/app.state';
import {
  cleanObject,
  Mapper,
  MapTree,
  modelService,
  switchModel
} from './common.model';
import { ATTRIBUTES, BODY, BODY_RENDERED, BODY_RENDERED_UI, CREATED_AT, CREATED_AT_UI, CREATOR, CREATOR_ID, DATA, ID, LINKS, MARKUP, PARENT_COMMENT, PARENT_ID, RELATIONSHIPS, SELF, SELFLINK_UI, TYPE } from './constant';
import { UserMapper, UserQuery, UserUI } from './user';

export class Comment extends modelService {
    attributes: CommentAttributes;
    relationships: {
        creator?: {
          data: {
            id: string;
            type: string;
          };
        },
        parent?: {
          data: {
            id: string;
            type: string;
          }
        }
    };
    links: CommentLink;
    relationalData?: RelationalData;
}

export class CommentLink {
    self: string;
}

export class CommentAttributes {
    body: string;
    BODY_RENDERED: string;
    MARKUP: string;
    CREATED_AT: string;
}

export class Comments {
    data: Comment[];
}

export class RelationalData {
  creator?: User;
}

export interface CommentUI {
  id: string;
  body: string;
  markup: string;
  createdAt: string;
  creatorId: string;
  creator?: Observable<UserUI>;
  bodyRendered: string;
  selfLink: string;
  parentId: string;
  children?: CommentUI[];
  allowEdit?: boolean;
}

export interface CommentService extends Comment {}

export class CommentMapper implements Mapper<CommentService, CommentUI> {
  constructor() {}

  serviceToUiMapTree: MapTree = [{
    fromPath: [ID],
    toPath: [ID]
  }, {
    fromPath: [ATTRIBUTES, BODY],
    toPath: [BODY]
  }, {
    fromPath: [ATTRIBUTES, MARKUP],
    toPath: [MARKUP]
  }, {
    fromPath: [ATTRIBUTES, CREATED_AT],
    toPath: [CREATED_AT_UI]
  }, {
    fromPath: [ATTRIBUTES, BODY_RENDERED],
    toPath: [BODY_RENDERED_UI]
  }, {
    fromPath: [RELATIONSHIPS, CREATOR, DATA, ID],
    toPath: [CREATOR_ID]
  }, {
    fromPath: [LINKS, SELF],
    toPath: [SELFLINK_UI]
  }, {
    fromPath: [RELATIONSHIPS, PARENT_COMMENT, DATA, ID],
    toPath: [PARENT_ID]
  }];

  uiToServiceMapTree: MapTree = [{
    toPath: [ID],
    fromPath: [ID]
  }, {
    toPath: [ATTRIBUTES, BODY],
    fromPath: [BODY]
  }, {
    toPath: [ATTRIBUTES, MARKUP],
    toValue: 'Markdown'
  }, {
    toPath: [ATTRIBUTES, CREATED_AT],
    fromPath: [CREATED_AT_UI]
  }, {
    toPath: [ATTRIBUTES, BODY_RENDERED],
    fromPath: [BODY_RENDERED_UI]
  }, {
    toPath: [TYPE],
    toValue: 'comments'
  }, {
    toPath: [LINKS, SELF],
    fromPath: [SELFLINK_UI]
  }, {
    toPath: [RELATIONSHIPS, PARENT_COMMENT, DATA, ID],
    fromPath: [PARENT_ID]
  }, {
    toPath: [RELATIONSHIPS, PARENT_COMMENT, DATA, TYPE],
    fromPath: [PARENT_ID],
    toFunction: (v) => !!v ? 'comments' : null
  }];

  toUIModel(arg: CommentService): CommentUI {
    return switchModel<CommentService, CommentUI>(
      arg, this.serviceToUiMapTree
    );
  }

  toServiceModel(arg: CommentUI): CommentService {
    return cleanObject(switchModel<CommentUI, CommentService>(
      arg, this.uiToServiceMapTree
    ));
  }
}


@Injectable()
export class CommentQuery {
  private commentSource = this.store.pipe(
    select(state => state.detailPage),
    select(state => state.comments)
  );
  constructor(
    private store: Store<AppState>,
    private userQuery: UserQuery,
    private userService: UserService
  ) {}

  getComments(commentIds: string[]) {
    // Not needed now
  }

  getCommentsWithCreators(): Observable<CommentUI[]> {
    return this.commentSource
      .pipe(
        map(comments => {
          return comments.map(comment => {
            return {
              ...comment,
              creator: this.userQuery.getUserObservableById(comment.creatorId)
            };
          });
        }),
        switchMap(comments => {
          return this.userService.loggedInUser
            .pipe(
              map(user => user ? user : {id: '0'}),
              map(user => {
                return comments.map(c => {
                  return {...c, allowEdit: c.creatorId === user.id};
                });
              })
            );
        })
      );
  }

  getCommentsWithChildren(): Observable<CommentUI[]> {
    return this.getCommentsWithCreators()
      .pipe(
        map((comments: CommentUI[]) => {
          return comments.map(comment => {
            return {
              ...comment,
              children: comments.filter(c => c.parentId === comment.id)
            } as CommentUI;
          })
          // keep only the root comments
          .filter(comment => !comment.parentId);
        })
      );
  }

  createComment(url: string, comment: CommentUI): void {
    const comMapper = new CommentMapper();
    this.store.dispatch(new AddCommentAction({
      comment: comMapper.toServiceModel(comment),
      url: url
    }));
  }

  updateComment(comment: CommentUI): void {
    const comMapper = new CommentMapper();
    this.store.dispatch(new UpdateCommentAction(
      comMapper.toServiceModel(comment)
    ));
  }

  dispatchGet(url: string) {
    this.store.dispatch(new GetCommentActions(url));
  }
}
