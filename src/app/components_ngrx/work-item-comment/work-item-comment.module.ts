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

import {
  AlmEditableModule,
  AlmIconModule,
  MarkdownModule,
  WidgetsModule
} from 'ngx-widgets';
import { SafePipeModule } from '../../pipes/safe.module';
import { HttpService } from './../../services/http-service';
import { GlobalSettings } from './../../shared/globals';
import { CommentModule } from './../../widgets/comment-module/comment.module';

import { MockHttp } from '../../mock/mock-http';
import { WorkItemCommentComponent } from './work-item-comment.component';

let providers = [];

if (process.env.ENV == 'inmemory') {
  providers = [
    GlobalSettings,
    {
      provide: HttpService,
      useExisting: MockHttp
     },
    TooltipConfig,
    BsDropdownConfig
   ];
} else {
  providers = [
    {
      provide: HttpService,
      useFactory: (backend: XHRBackend, options: RequestOptions, auth: AuthenticationService) => {
        return new HttpService(backend, options, auth);
      },
      deps: [XHRBackend, RequestOptions, AuthenticationService]
    },
    GlobalSettings,
    TooltipConfig,
    BsDropdownConfig
    ];
}

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
    WorkItemCommentComponent
   ],
  exports: [ WorkItemCommentComponent ],
  providers: providers
})
export class WorkItemCommentModule { }
