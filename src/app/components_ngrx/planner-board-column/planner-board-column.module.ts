import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PlannerCardModule } from './../planner-card/planner-card.module';
import { PlannerBoardColumnComponent } from './planner-board-column.component';

@NgModule({
  imports: [
    CommonModule,
    PlannerCardModule
  ],
  declarations: [ PlannerBoardColumnComponent ],
  exports: [ PlannerBoardColumnComponent ]
})

export class PlannerBoardColumnModule {}
