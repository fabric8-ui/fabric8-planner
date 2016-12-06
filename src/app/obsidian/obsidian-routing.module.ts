import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FormComponent } from 'obsidian-generator-frontend/src/app/wizard/wizard.component';

const routes: Routes = [
  {
    path: 'wizard',
    component: FormComponent,
    children: [
      {
        path: ''
      }
    ]
  },

];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ObsidianRoutingModule {}