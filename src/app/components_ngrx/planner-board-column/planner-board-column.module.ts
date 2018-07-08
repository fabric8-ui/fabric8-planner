import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WorkItemQuery } from '../../models/work-item';
import { PlannerCardModule } from './../planner-card/planner-card.module';
import { PlannerBoardColumnComponent } from './planner-board-column.component';

@NgModule({
  imports: [
    CommonModule,
    PlannerCardModule
  ],
  declarations: [ PlannerBoardColumnComponent ],
  exports: [ PlannerBoardColumnComponent ],
  providers: [WorkItemQuery]
})

export class PlannerBoardColumnModule {}
