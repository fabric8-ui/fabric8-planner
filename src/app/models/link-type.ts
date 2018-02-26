import { LinkCategory } from './link-category';
import {
  modelUI,
  modelService,
  Mapper,
  MapTree,
  switchModel,
  cleanObject
} from './common.model';

export class LinkType {
  id: string;
  type: string;
  attributes: {
    'description': string
    'forward_name': string,
    'name': string,
    'reverse_name': string,
    'topology': string,
    'version': number
  };
  relationships: {
    // 'link_category': LinkCategory,
    'link_category': {
      'data': {
        'id': string,
        'type': string
      }
    }
  };
}

export class MinimizedLinkType {
  name: string;
  linkId: string;
  linkType: string;
}

export interface LinkTypeService extends LinkType {}

export interface LinkTypeUI {
  id: string;
  name: string;
  forwardName: string;
  reverseName: string;
  topology: string;
  version: number;
  type: string;
}

export class LinkTypeMapper implements Mapper<LinkTypeService, LinkTypeUI> {

  serviceToUiMapTree: MapTree = [{
    fromPath: ['id'],
    toPath: ['id']
  }, {
    fromPath: ['attributes', 'name'],
    toPath: ['name']
  }, {
    fromPath: ['attributes', 'forward_name'],
    toPath: ['forwardName']
  }, {
    fromPath: ['attributes', 'reverse_name'],
    toPath: ['reverseName']
  }, {
    fromPath: ['attributes', 'topology'],
    toPath: ['topology']
  }, {
    fromPath: ['attributes', 'version'],
    toPath: ['version']
  }, {
    fromPath: ['type'],
    toPath: ['type']
  }];

  uiToServiceMapTree: MapTree = [{
    toPath: ['id'],
    fromPath: ['id']
  }, {
    toPath: ['attributes', 'name'],
    fromPath: ['name']
  }, {
    toPath: ['attributes', 'forward_name'],
    fromPath: ['forwardName']
  }, {
    toPath: ['attributes', 'reverse_name'],
    fromPath: ['reverseName']
  }, {
    toPath: ['attributes', 'topology'],
    fromPath: ['topology']
  }, {
    toPath: ['attributes', 'version'],
    fromPath: ['version']
  }, {
    toPath: ['type'],
    fromPath: ['type']
  }];

  toUIModel(arg: LinkTypeService): LinkTypeUI {
    return switchModel<LinkTypeService, LinkTypeUI> (
      arg, this.serviceToUiMapTree
    )
  }

  toServiceModel(arg: LinkTypeUI): LinkTypeService {
    return switchModel<LinkTypeUI, LinkTypeService> (
      arg, this.uiToServiceMapTree
    )
  }
}
