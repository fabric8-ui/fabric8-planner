import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BsDropdownConfig,
  BsDropdownModule
} from 'ngx-bootstrap/dropdown';
import { WorkItemLinkComponent } from './work-item-link.component';
import {
  WorkItemLinkFilterByTypeName,
  WorkItemLinkTypeFilterByTypeName
} from '../../pipes/work-item-link-filters.pipe';

@NgModule({
  imports: [
    CommonModule,
    BsDropdownModule
  ],
  declarations: [
    WorkItemLinkComponent,
    WorkItemLinkFilterByTypeName,
    WorkItemLinkTypeFilterByTypeName
   ],
  exports: [ WorkItemLinkComponent ],
  providers: [BsDropdownConfig]
})
export class WorkItemLinkModule {}
