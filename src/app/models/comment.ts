import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { User } from 'ngx-login-client';

import { UserUI, UserMapper, UserResolver } from './user';
import {
  Mapper,
  MapTree,
  switchModel,
  modelService
} from './common.model';

export class Comment extends modelService {
    attributes: CommentAttributes;
    relationships: {
        'creator'?: {
          data: {
            id: string;
            type: string;
          };
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
    'body.rendered': string;
    'markup': string;
    'created-at': string;
}

export class Comments {
    data: Comment[];
}

export class CommentPost {
    data: Comment;
}

export class RelationalData {
  creator?: User;
}

export interface CommentUI {
  id: string;
  body: string;
  markup: string;
  createdAt: string;
  creator: Observable<UserUI>;
  bodyRendered: string;
  selfLink: string;
}

export interface CommentService extends Comment {}

@Injectable()
export class CommentMapper implements Mapper<CommentService, CommentUI> {
  constructor(private userResolver: UserResolver){}

  serviceToUiMapTree: MapTree = [{
    fromPath: ['id'],
    toPath: ['id']
  }, {
    fromPath: ['attributes', 'body'],
    toPath: ['body']
  }, {
    fromPath: ['attributes', 'markup'],
    toPath: ['markup']
  }, {
    fromPath: ['attributes', 'created-at'],
    toPath: ['createdAt']
  }, {
    fromPath: ['attributes', 'body.rendered'],
    toPath: ['bodyRendered']
  }, {
    fromPath: ['relationships', 'creator', 'data', 'id'],
    toPath: ['creator'],
    toFunction: (val) => this.userResolver.getUserObservableById(val)
  }, {
    fromPath: ['links', 'self'],
    toPath: ['selfLink']
  }];

  uiToServiceMapTree: MapTree = [{
    toPath: ['id'],
    fromPath: ['id']
  }, {
    toPath: ['attributes', 'body'],
    fromPath: ['body']
  }, {
    toPath: ['attributes', 'markup'],
    fromPath: ['markup']
  }, {
    toPath: ['attributes', 'created-at'],
    fromPath: ['createdAt']
  }, {
    toPath: ['attributes', 'body.rendered'],
    fromPath: ['bodyRendered']
  }, {
    toPath: ['type'],
    toValue: 'comments'
  }, {
    toPath: ['links', 'self'],
    fromPath: ['selfLink']
  }];

  toUIModel(arg: CommentService): CommentUI {
    return switchModel<CommentService, CommentUI>(
      arg, this.serviceToUiMapTree
    )
  }

  toServiceModel(arg: CommentUI): CommentService {
    return switchModel<CommentUI, CommentService>(
      arg, this.uiToServiceMapTree
    )
  }
}
