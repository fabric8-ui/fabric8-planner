import { WidgetsModule } from 'ngx-widgets';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AssigneesComponent } from './assignee.component';
import { UserAvatarModule } from './../../widgets/user-avatar/user-avatar.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TooltipModule,
    BsDropdownModule,
    UserAvatarModule,
    WidgetsModule
  ],
  declarations: [
    AssigneesComponent
  ],
  providers: [ TooltipConfig, BsDropdownConfig ],
  exports: [AssigneesComponent]
})
export class AssigneesModule { }
