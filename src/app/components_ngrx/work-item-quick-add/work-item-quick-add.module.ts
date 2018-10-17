import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PermissionQuery } from '../../models/permission.model';
import { CommonSelectorModule } from '../common-selector/common-selector.module';
import { InfotipModule } from '../infotip/infotip.module';
import { WorkItemQuickAddComponent } from './work-item-quick-add.component';

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule,
    CommonSelectorModule,
    FormsModule,
    InfotipModule
  ],
  declarations: [WorkItemQuickAddComponent],
  exports: [WorkItemQuickAddComponent],
  providers: [BsDropdownConfig, PermissionQuery]
})
export class WorkItemQuickAddModule {}
