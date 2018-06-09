import { NgModule } from '@angular/core';
import { Http, RequestOptions, XHRBackend } from '@angular/http';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { AuthenticationService } from 'ngx-login-client';
import { MockHttp } from './../../mock/mock-http';
import { AreaService } from './../../services/area.service';
import { CollaboratorService } from './../../services/collaborator.service';
import { HttpService } from './../../services/http-service';
import { IterationService } from './../../services/iteration.service';
import { LabelService } from './../../services/label.service';
import { WorkItemService } from './../../services/work-item.service';
import { GlobalSettings } from './../../shared/globals';
import { WorkItemDetailRoutingModule } from './work-item-detail-routing.module';
import { WorkItemDetailModule } from './work-item-detail.module';

let providers = [];

if (process.env.ENV == 'inmemory') {
  providers = [
    AreaService,
    WorkItemService,
    GlobalSettings,
    IterationService,
    LabelService,
    TooltipConfig,
    CollaboratorService,
    {
      provide: Http, useExisting: MockHttp
    }
  ];
} else {
  providers = [
    AreaService,
    WorkItemService,
    GlobalSettings,
    IterationService,
    LabelService,
    TooltipConfig,
    CollaboratorService,
    {
      provide: HttpService,
      useFactory: (backend: XHRBackend, options: RequestOptions, auth: AuthenticationService) => {
        return new HttpService(backend, options, auth);
      },
      deps: [XHRBackend, RequestOptions, AuthenticationService]
    }
  ];
}

@NgModule({
  imports: [
    WorkItemDetailRoutingModule,
    WorkItemDetailModule,
    TooltipModule
  ],
  providers: providers
})
export class WorkItemDetailExternalModule {

}
