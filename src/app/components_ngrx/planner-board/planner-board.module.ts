import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap';
import { BoardEffects } from '../../effects/board.effect';
import { BoardReducer, ColumnWorkItemReducer } from '../../reducers/index.reducer';
import { BoardService } from '../../services/board.service';
import { InitialBoardState, InitialColumnWorkItemState } from './../../states/index.state';

import { PlannerLayoutModule } from './../../widgets/planner-layout/planner-layout.module';
import { PlannerBoardColumnModule } from './../planner-board-column/planner-board-column.module';
import { PlannerCardModule } from './../planner-card/planner-card.module';
import { SidepanelModule } from './../side-panel/side-panel.module';
import { WorkItemPreviewPanelModule } from './../work-item-preview-panel/work-item-preview-panel.module';
import { PlannerBoardRoutingModule } from './planner-board-routing.module';
import { PlannerBoardComponent } from './planner-board.component';

// Data Querries
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { AreaQuery } from '../../models/area.model';
import { BoardQuery, ColumnWorkItemQuery } from '../../models/board.model';
import { GroupTypeQuery } from '../../models/group-types.model';
import { IterationQuery } from '../../models/iteration.model';
import { LabelQuery } from '../../models/label.model';
import { CommentQuery } from './../../models/comment';
import { SpaceQuery } from './../../models/space';
import { UserQuery } from './../../models/user';
import { WorkItemQuery } from './../../models/work-item';
import { F8SortByPipeModule } from './../../pipes/sort-by.module';

@NgModule({
  providers: [
    TooltipConfig,
    BoardService,
    CommentQuery,
    UserQuery,
    LabelQuery,
    IterationQuery,
    WorkItemQuery,
    AreaQuery,
    SpaceQuery,
    GroupTypeQuery,
    BoardQuery,
    ColumnWorkItemQuery
  ],
  imports: [
    CommonModule,
    F8SortByPipeModule,
    PlannerBoardRoutingModule,
    PlannerBoardColumnModule,
    PlannerLayoutModule,
    WorkItemPreviewPanelModule,
    SidepanelModule,
    TooltipModule.forRoot(),
    StoreModule.forFeature(
      'boardView',
      {
        boards: BoardReducer,
        columnWorkItem: ColumnWorkItemReducer
      },
      {
        initialState: {
          boards: InitialBoardState,
          columnWorkItem: InitialColumnWorkItemState
        }
      }
    ),
    EffectsModule.forFeature([BoardEffects])
  ],
  declarations: [PlannerBoardComponent],
  exports: [PlannerBoardComponent]
})
export class PlannerBoardModule {}
