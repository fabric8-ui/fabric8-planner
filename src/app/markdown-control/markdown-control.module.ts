import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }  from '@angular/forms';

import {
  AlmEditableModule,
  WidgetsModule
} from 'ngx-widgets';

import { MarkdownControlComponent } from './markdown-control.component';

@NgModule({
  imports: [ CommonModule, WidgetsModule, AlmEditableModule ],
  providers: [ ],
  declarations: [ MarkdownControlComponent ],
  exports: [ MarkdownControlComponent ],
})
export class MarkdownControlModule { }
