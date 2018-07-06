import { Component, Input } from '@angular/core';
import { WorkItemUI } from './../../models/work-item';

@Component({
  selector: 'f8-planner-column',
  templateUrl: './planner-board-column.component.html',
  styleUrls: ['./planner-board-column.component.less']
})

export class PlannerBoardColumnComponent {
  @Input() workItems: WorkItemUI[];
}
