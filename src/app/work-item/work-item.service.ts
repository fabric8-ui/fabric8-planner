import { Injectable } from '@angular/core';
import { Logger } from '../shared/logger.service';

import 'rxjs/add/operator/toPromise';

import { WorkItem } from './work-item';
import { Requests } from './../../utils/requests';

@Injectable()
export class WorkItemService {
  // private workItemUrl = 'app/workItems';  // URL to web api
  private workItemUrl = process.env.API_URL+'workitems';  // URL to web api

  constructor(private requests: Requests,
              private logger: Logger) { 
    logger.log("WorkItemService running in " + process.env.ENV + " mode.");
    logger.log("WorkItemService using url " + this.workItemUrl);
  }

  getWorkItems(): Promise<WorkItem[]> {
	return this.requests.get(this.workItemUrl)
		.then(response => response as WorkItem[])
		.catch(this.requests.handleError);
  }

  getWorkItem(id: string): Promise<WorkItem> {
    return this.getWorkItems()
      .then(workItems => workItems.find(workItem => workItem.id === id));
  }

  delete(workItem: WorkItem): Promise<void> {
    const url = `${this.workItemUrl}/${workItem.id}`;
    return this.requests.delete(url)
    	.then(() => null)
    	.catch(this.requests.handleError);
  }

  create(workItem: WorkItem): Promise<WorkItem> {
    return this.requests.post(this.workItemUrl, workItem)
      .then(response => response as WorkItem)
      .catch(this.requests.handleError);
  }

  update(workItem: WorkItem): Promise<WorkItem> {
    const url = `${this.workItemUrl}/${workItem.id}`;
    return this.requests.put(url, workItem)
      .then(() => workItem)
      .catch(this.requests.handleError);
  }
}
