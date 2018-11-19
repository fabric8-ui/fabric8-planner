import { createEntityAdapter } from '@ngrx/entity';
import {
  WorkItemTypeStateModel, WorkItemTypeUI
} from './../models/work-item-type';

export const workItemTypeAdapter = createEntityAdapter<WorkItemTypeUI>();

export const initialState: WorkItemTypeStateModel = workItemTypeAdapter.getInitialState();

export {
  WorkItemTypeStateModel as WorkItemTypeState
} from './../models/work-item-type';
