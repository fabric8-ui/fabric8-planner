import {
  modelUI,
  modelService,
  Mapper,
  MapTree,
  switchModel,
} from './common.model';
export class CustomQueryModel extends modelService {
  attributes: CustomQueryAttributes;
  type: string;
}

export class CustomQueryAttributes {
  fields: string;
  title: string;
}
