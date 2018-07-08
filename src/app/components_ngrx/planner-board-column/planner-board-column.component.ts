import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkItemQuery, WorkItemUI } from './../../models/work-item';

@Component({
  selector: 'f8-planner-column',
  templateUrl: './planner-board-column.component.html',
  styleUrls: ['./planner-board-column.component.less']
})

export class PlannerBoardColumnComponent {
  @Input('workItemIds') set WorkItemIds(ids: string[]) {
    // Change this to this.workItemQuery.getWorkitemsById(ids)
    this.workItems = Observable.of([] as WorkItemUI[]);
  }
  @Input() columnName: string;

  private workItems: Observable<WorkItemUI[]>;

  constructor(private workItemQuery: WorkItemQuery) {}
}
