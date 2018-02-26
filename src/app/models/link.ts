import { LinkType, LinkTypeUI } from './link-type';
import { WorkItemUI } from './work-item';

export class Link {
  id: string;
  type: string;
  attributes: {
    'version': Number
  };
  relationships: {
    // "link_type": LinkType
    'link_type': {
      'data': {
        'id': string,
        'type': string
      }
    },
    'source': {
      'data': {
        'id': string,
        'type': string
      }
    },
    'target': {
      'data': {
        'id': string
        'type': string
      }
    }
  };
  relationalData?: RelationalData;
}


export class RelationalData {
  source?: {
    title: string;
    id: string;
    number: string;
    state: string;
  };
  target?: {
    title: string;
    id: string;
    number: string;
    state: string;
  };
  linkType?: string;
}

export interface WorkItemLinkService extends Link {}

export interface WorkItemLinkUI {
  id: string;
  type: string;
  version: number;
  linkType: LinkTypeUI;
  source: WorkItemUI;
  target: WorkItemUI;
}
