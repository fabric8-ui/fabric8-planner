import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { FeatureFlagModule } from 'ngx-feature-flag';
import { ModalService } from '../../services/modal.service';
import { DeleteWorkitemComponent } from './delete-work-item.component';

@NgModule({
  imports: [
    CommonModule,
    TooltipModule,
    FeatureFlagModule
  ],
  declarations: [
    DeleteWorkitemComponent
  ],
  exports: [
    DeleteWorkitemComponent
  ],
  providers: [
    ModalService,
    TooltipConfig
  ]
})

export class DeleteWorkitemModule {}

