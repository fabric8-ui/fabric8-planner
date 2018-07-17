import { Injectable } from '@angular/core';

// MemoizedSelector is needed even if it's not being used in this file
// Else you get this error
// Exported variable 'plannerSelector' has or is using name 'MemoizedSelector'
// from external module "@ngrx/store/src/selector" but cannot be named.
import { createFeatureSelector, createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BoardViewState } from '../states/app.state';
import { AppState } from '../states/index.state';
import {
    cleanObject,
    CommonSelectorUI,
    Mapper,
    MapTree,
    modelService,
    switchModel
} from './common.model';
import { WorkItemQuery, WorkItemUI } from './work-item';

export class BoardModelData {
    id: string;
    attributes: {
        name: string;
        description: string;
        contextType: string;  // this designates the type of the context
        context: string;  // this designates the ID of the context, in this case the typegroup ID
        'created-at': string;
        'updated-at': string;
    };
    relationships: {
        spaceTemplate: {
            data: {
                id: string;
                type: string;
            }
        };
        columns: {
            data?: {
                id: string;
                type: string;
            }[];
        };
    };
    type: string;
}

export class BoardModel {
    data: BoardModelData[];
    included: ({
        attributes: {
            id: string;
            name: string;
        }
        columnOrder: 0;  // the left-to-right order of the column in the view
        type: string;
    } | any)[];
}


export class BoardModelUI {
    id: string;
    name: string;
    description: string;
    contextType: string;
    context: string;
    columns: {
        id: string;
        title: string;
        columnOrder: number;
        type: string;
        workItems?: Observable<WorkItemUI[]>
    }[];
}


export class BoardMapper implements Mapper<BoardModelData, BoardModelUI> {
    serviceToUiMapTree: MapTree = [{
        fromPath: ['id'],
        toPath: ['id']
    }, {
        fromPath: ['attributes', 'name'],
        toPath: ['name']
    }, {
        fromPath: ['attributes', 'description'],
        toPath: ['description']
    }, {
        fromPath: ['attributes', 'contextType'],
        toPath: ['contextType']
    }, {
        fromPath: ['attributes', 'context'],
        toPath: ['context']
    }, {
        fromPath: ['relationships', 'columns', 'data'],
        toPath: ['columns'],
        toFunction: (data) => {
            return Array.isArray(data) ? data.map(col => {
              return {
                id: col.id,
                title: col.attributes.name,
                columnOrder: col.attributes.order,
                type: col.type
              };
            }) : [];
        }
    }];

    uiToServiceMapTree: MapTree = [];

    toUIModel(arg: BoardModelData): BoardModelUI {
        return switchModel<BoardModelData, BoardModelUI>(
          arg, this.serviceToUiMapTree
        );
    }

    toServiceModel(arg: BoardModelUI): BoardModelData {
        return {} as BoardModelData;
    }
}

export const boardSelector = createFeatureSelector<BoardViewState>('boardView');

@Injectable()
export class BoardQuery {
    private boards = createSelector(
        boardSelector,
        (state) => state ? state.boards : {}
    );
    private boardSource = this.store.select(this.boards);

    constructor(private store: Store<AppState>,
                private columnWorkItemQuery: ColumnWorkItemQuery,
                private workItemQuery: WorkItemQuery) {}

    getBoardById(id: string): Observable<BoardModelUI> {
        return this.boardSource.filter(boards => !!boards[id])
            .do((boards) => {
                console.log('#### - 2 boards', boards);
            })
            .map(boards => boards[id])
            .do((board) => {
                console.log('### - 2.1 - selected board', board);
            })
            .map(board => {
                board.columns = board.columns
                .map(col => {
                    return {
                        ...col,
                        workItems: this.columnWorkItemQuery.getWorkItemIdsByColumnId(col.id)
                            .do((ids) => {
                                console.log('### - 3 - columnworkitemids', ids);
                            })
                            .flatMap(ids => {
                                return this.workItemQuery.getWorkItemsWithIds(ids);
                            })
                    };
                });
                return board;
            });
    }
}

@Injectable()
export class ColumnWorkItemQuery {
    private columnWorkitems = createSelector(
        boardSelector,
        (state) => state ? state.columnWorkItem : {}
    );

    private columnWorkitemSource = this.store.select(this.columnWorkitems);

    constructor(private store: Store<AppState>) {}

    getWorkItemIdsByColumnId(id: string): Observable<string[]> {
        return this.columnWorkitemSource.select(state => state[id]);
    }
}
