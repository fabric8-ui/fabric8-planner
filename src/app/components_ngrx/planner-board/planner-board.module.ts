import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { BoardEffects } from '../../effects/board.effect';
import { BoardReducer, ColumnWorkItemReducer } from '../../reducers/index.reducer';
import { InitialBoardState, InitialColumnWorkItemState } from './../../states/index.state';
import { PlannerBoardRoutingModule } from './planner-board-routing.module';
import { PlannerBoardComponent } from './planner-board.component';

@NgModule({
  imports: [
    CommonModule,
    PlannerBoardRoutingModule,
    StoreModule.forFeature('boardView', {
      boards: BoardReducer,
      columnWorkItem: ColumnWorkItemReducer
    }, {
      initialState: {
        boards: InitialBoardState,
        columnWorkItem: InitialColumnWorkItemState
      }
    }),
    EffectsModule.forFeature([
      BoardEffects
    ])
  ],
  declarations: [PlannerBoardComponent],
  exports: [PlannerBoardComponent]
})
export class PlannerBoardModule {}
