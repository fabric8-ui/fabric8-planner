import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';

import { AlmIconModule }      from './../../shared-component/icon/almicon.module';
import { DialogModule }   from './../../shared-component/dialog/dialog.module';
import { DropdownModule } from './../../shared-component/ng2-dropdown/index';

import { WorkItemListComponent } from './work-item-list.component';
import { WorkItemDetailModule } from './work-item-detail/work-item-detail.module';
import { WorkItemQuickAddModule } from './../work-item-quick-add/work-item-quick-add.module';
import { WorkItemListEntryComponent } from './work-item-list-entry/work-item-list-entry.component';

import { WorkItemListRoutingModule } from './work-item-list-routing.module';

@NgModule({
  imports:      [
    AlmIconModule,
    CommonModule,
    DialogModule,
    DropdownModule,
    WorkItemDetailModule,
    WorkItemListRoutingModule,
    WorkItemQuickAddModule,
  ],
  declarations: [
     WorkItemListComponent,
     WorkItemListEntryComponent 
  ],
  exports: [
     WorkItemListComponent
  ]
})
export class WorkItemListModule { }