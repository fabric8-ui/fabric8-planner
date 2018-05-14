import { CommentReducer } from './comment.reducer';
import { initialState as CommentInitialState, initialState } from './../states/comment.state';
import * as CommentActions from './../actions/comment.actions';
import { CommentUI } from './../models/comment';

export type Action = CommentActions.All;

describe('CommentReducer:', () => {
  it('undefined action should return the default state', () => {
    const action = {} as Action;
    const state = CommentReducer(undefined, action);

    expect(state).toBe(CommentInitialState);
  });

  it('Initial state should be an empty array', () => {
    const initialState = [];
    expect(CommentInitialState).toEqual(initialState);
  });

  it('GetSuccess action should return new state', () => {
    const comments: CommentUI[] = [
      {
        id: '1',
        body: 'comment 1',
        markup: 'MarkUp',
        createdAt: '00:00',
        creator: {
          id: '1',
          name: 'user 1',
          username: 'user1',
          avatar: 'user1.jpg',
          currentUser: false
        },
        bodyRendered: '<p>comment 1</p>',
        selfLink: '/'
      },
      {
        id: '2',
        body: 'comment 2',
        markup: 'MarkUp',
        createdAt: '00:01',
        creator: {
          id: '1',
          name: 'user 1',
          username: 'user1',
          avatar: 'user1.jpg',
          currentUser: false
        },
        bodyRendered: '<p>comment 2</p>',
        selfLink: '/1'
      }
    ];
    const action = new CommentActions.GetSuccess(comments);
    const state = CommentReducer(initialState, action);

    expect(state).toEqual(comments);
  });

  it('GetError Actions should return previous state', () => {
    const comments: CommentUI[] = [
      {
        id: '1',
        body: 'comment 1',
        markup: 'MarkUp',
        createdAt: '00:00',
        creator: {
          id: '1',
          name: 'user 1',
          username: 'user1',
          avatar: 'user1.jpg',
          currentUser: false
        },
        bodyRendered: '<p>comment 1</p>',
        selfLink: '/'
      }
    ];
    const action = new CommentActions.GetError();
    const state = CommentReducer(comments, action);

    expect(comments).toEqual(state);
  });

  it('AddSuccess actions should retrun the updated state', () => {
    const comments: CommentUI[] = [
      {
        id: '1',
        body: 'comment 1',
        markup: 'MarkUp',
        createdAt: '00:00',
        creator: {
          id: '1',
          name: 'user 1',
          username: 'user1',
          avatar: 'user1.jpg',
          currentUser: false
        },
        bodyRendered: '<p>comment 1</p>',
        selfLink: '/'
      }
    ];
    const newComment: CommentUI = {
      id: '2',
      body: 'comment 2',
      markup: 'MarkUp',
      createdAt: '00:00',
      creator: {
        id: '1',
        name: 'user 1',
        username: 'user1',
        avatar: 'user1.jpg',
        currentUser: false
      },
      bodyRendered: '<p>comment 2</p>',
      selfLink: '/'
    };

    const newCommentState: CommentUI[] = [
      {
        id: '2',
        body: 'comment 2',
        markup: 'MarkUp',
        createdAt: '00:00',
        creator: {
          id: '1',
          name: 'user 1',
          username: 'user1',
          avatar: 'user1.jpg',
          currentUser: false
        },
        bodyRendered: '<p>comment 2</p>',
        selfLink: '/'
      },
      {
        id: '1',
        body: 'comment 1',
        markup: 'MarkUp',
        createdAt: '00:00',
        creator: {
          id: '1',
          name: 'user 1',
          username: 'user1',
          avatar: 'user1.jpg',
          currentUser: false
        },
        bodyRendered: '<p>comment 1</p>',
        selfLink: '/'
      }
    ];

    const getSuccessAction = new CommentActions.GetSuccess(comments);
    const state = CommentReducer(initialState, getSuccessAction);

    const addSuccessAction = new CommentActions.AddSuccess(newComment);
    const newState = CommentReducer(state, addSuccessAction);

    expect(newState).toEqual(newCommentState);
  });

  it('AddError action should return the previous state', () => {
    const comments: CommentUI[] = [
      {
        id: '1',
        body: 'comment 1',
        markup: 'MarkUp',
        createdAt: '00:00',
        creator: {
          id: '1',
          name: 'user 1',
          username: 'user1',
          avatar: 'user1.jpg',
          currentUser: false
        },
        bodyRendered: '<p>comment 1</p>',
        selfLink: '/'
      }
    ];

    const getSuccessAction = new CommentActions.GetSuccess(comments);
    const state = CommentReducer(initialState, getSuccessAction);

    const addErrorAction = new CommentActions.AddError();
    const newState = CommentReducer(state, addErrorAction);

    expect(newState).toEqual(state);
  });
});
