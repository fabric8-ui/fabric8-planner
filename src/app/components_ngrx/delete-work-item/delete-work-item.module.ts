import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalService } from '../../services/modal.service';
import { DeleteWorkitemComponent } from './delete-work-item.component';

@NgModule({
  imports: [CommonModule, TooltipModule],
  declarations: [DeleteWorkitemComponent],
  exports: [DeleteWorkitemComponent],
  providers: [ModalService, TooltipConfig]
})

export class DeleteWorkitemModule {}

