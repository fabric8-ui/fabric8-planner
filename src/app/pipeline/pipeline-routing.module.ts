import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PipelineComponent } from './pipeline.component';

const routes: Routes = [
  {
    path: 'pipeline',
    component: PipelineComponent
  },

];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class PipelineRoutingModule {}
