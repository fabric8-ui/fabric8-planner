import { Component, HostListener, OnInit, Input, OnChanges, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

import { cloneDeep } from 'lodash';
import { Broadcaster } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';
import { Subscription } from 'rxjs/Subscription';
import { Space, Spaces } from 'ngx-fabric8-wit';

import { WorkItemService } from './../../work-item.service';
import { WorkItemListEntryComponent } from './../../work-item-list/work-item-list-entry/work-item-list-entry.component';
import { WorkItemType } from './../../../models/work-item-type';
import { WorkItem } from './../../../models/work-item';

import {
  AlmArrayFilter
} from 'ngx-widgets';

@Component({
  selector: 'detail-add-type-selector-widget',
  templateUrl: './work-item-detail-add-type-selector-widget.component.html',
  styleUrls: ['./work-item-detail-add-type-selector-widget.component.scss']
})
export class WorkItemDetailAddTypeSelectorWidgetComponent implements OnInit {

  @Input() workItemTypes: WorkItemType[] = [];
  @Output('onSelect') onSelect = new EventEmitter();
  @Output('onClose') onClose = new EventEmitter();

  @ViewChild('typeList') typeList: any;


  panelState: string = 'out';
  selectedType: WorkItemType;
  selectedPosition: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private broadcaster: Broadcaster,
    private workItemService: WorkItemService,
    private auth: AuthenticationService,
    private spaces: Spaces) {
  }

  ngOnInit() {
  }

  close() {
    this.onClose.emit();
    this.panelState = 'out';
  }

  open() {
    this.panelState = 'in';
    this.selectedType = this.workItemTypes[0];
    this.selectedPosition = 0;
  }

  select(type: WorkItemType) {
    this.onSelect.emit(type);
    this.panelState = 'out';
  }

  @HostListener('window:keydown', ['$event'])
  onKeyEvent(event: any) {
    if(this.panelState === 'in') {
      let list = this.typeList.nativeElement.children;
      let witLength = this.workItemTypes.length;
      switch(event.keyCode){
        case 40://down
        case 37://left
          //left or down - go to the previous work item type
          this.selectedPosition--;
          if(this.selectedPosition <= 0 ) {
            this.selectedPosition = 0
          }
          this.selectedType = this.workItemTypes[this.selectedPosition];
        break;
        case 38://top
        case 39://right
          //top or right - go to the next work item type
          this.selectedPosition++;
          if(this.selectedPosition >= witLength) {
            this.selectedPosition = witLength - 1;
          }
          this.selectedType = this.workItemTypes[this.selectedPosition];
        break;
        case 13://enter
          this.select(this.selectedType);
        break
        default:
        //check for starting letter of work item type
        let char = String.fromCharCode(event.keyCode);
        this.workItemTypes.filter( (item,index) => {
          if((item.attributes.name).charAt(0).toLocaleLowerCase() === char.toLocaleLowerCase())
            this.selectedPosition = index;
        });
        this.selectedType = this.workItemTypes[this.selectedPosition];
        break;
      }
    }
  }
}
