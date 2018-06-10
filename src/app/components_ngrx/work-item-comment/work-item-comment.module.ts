import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Http, HttpModule,
  RequestOptions, XHRBackend } from '@angular/http';
import { RouterModule } from '@angular/router';

import {
  BsDropdownConfig,
  BsDropdownModule,
  CollapseModule,
  TooltipConfig,
  TooltipModule
} from 'ngx-bootstrap';
import { AuthenticationService } from 'ngx-login-client';


import { HttpService, factoryForHttpService } from './../../services/http-service';
import {
  AlmEditableModule,
  AlmIconModule,
  MarkdownModule,
  WidgetsModule
} from 'ngx-widgets';
import { SafePipeModule } from '../../pipes/safe.module';
import { GlobalSettings } from './../../shared/globals';
import { CommentModule } from './../../widgets/comment-module/comment.module';
import { WorkItemCommentWrapperComponent } from '../work-item-comment-wrapper/work-item-comment-wrapper.component';

let providers = [
  {
    provide: HttpService,
    useFactory: factoryForHttpService,
    deps: [XHRBackend, RequestOptions, AuthenticationService]
  },
  GlobalSettings,
  TooltipConfig,
  BsDropdownConfig
];

@NgModule({
  imports: [
    AlmEditableModule,
    AlmIconModule,
    CollapseModule,
    CommonModule,
    CommentModule,
    BsDropdownModule,
    FormsModule,
    MarkdownModule,
    RouterModule,
    HttpModule,
    TooltipModule,
    WidgetsModule,
    SafePipeModule
  ],
  declarations: [
    WorkItemCommentWrapperComponent
   ],
  exports: [ WorkItemCommentWrapperComponent ],
  providers: providers
})
export class WorkItemCommentModule { }
