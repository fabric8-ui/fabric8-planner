import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';

import { ToolbarModule } from 'patternfly-ng/toolbar';

import { CollaboratorService } from '../../services/collaborator.service';
import { FilterService } from '../../services/filter.service';
import { WorkItemService } from '../../services/work-item.service';
import { EventService } from './../../services/event.service';
import { ToolbarPanelComponent } from './toolbar-panel.component';

import {
  AlmEditableModule,
  AlmIconModule,
  WidgetsModule
} from 'ngx-widgets';

//ngrx stuff
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AreaQuery } from '../../models/area.model';
import { IterationQuery } from '../../models/iteration.model';
import { FilterEffects } from './../../effects/filter.effects';
import { FilterReducer } from './../../reducers/filter.reducer';
import {
  initialState as initialFilterState
} from './../../states/filter.state';

@NgModule({
  imports: [
    AlmEditableModule,
    AlmIconModule,
    BsDropdownModule,
    CommonModule,
    ToolbarModule,
    TooltipModule.forRoot(),
    WidgetsModule,
    StoreModule.forFeature('toolbar', {
      filters: FilterReducer
    }, {
      initialState: {
        filters: initialFilterState
      }
    }),
    EffectsModule.forFeature([FilterEffects])
  ],
  declarations: [
    ToolbarPanelComponent
  ],
  providers: [
    BsDropdownConfig,
    CollaboratorService,
    FilterService,
    TooltipConfig,
    WorkItemService,
    EventService,
    IterationQuery,
    AreaQuery
  ],
  exports: [ToolbarPanelComponent]
})
export class ToolbarPanelModule { }
