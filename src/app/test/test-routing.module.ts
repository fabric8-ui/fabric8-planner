import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TestComponent } from './test.component';

const routes: Routes = [
  {
    path: 'test',
    component: TestComponent
  },

];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class TestRoutingModule {}
