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
      // default:
      //   //check for starting letter of work item type
      //var x = event.keyCode;                // Get the Unicode value
      //var y = String.fromCharCode(x);
      // break;
    }
    console.log('event.keyCode', event.keyCode);
  }

  keyboardSelect(event) {
    //Starting letters to select
    //Arrow navigation
    //If type is selected, hit enter to go to the detail view
    //this.log.log(event.keyCode);
    console.log('hello34', event.keyCode);
    // Down arrow or up arrow
    //typeList
    // // Down arrow or up arrow
    // if (event.keyCode == 40 || event.keyCode == 38) {
    //   let lis = this.areaList.nativeElement.children;
    //   let i = 0;
    //   for (; i < lis.length; i++) {
    //     if (lis[i].classList.contains('selected')) {
    //       break;
    //     }
    //   }
    //   if (i == lis.length) { // No existing selected
    //     if (event.keyCode == 40) { // Down arrow
    //       lis[0].classList.add('selected');
    //       lis[0].scrollIntoView(false);
    //     } else { // Up arrow
    //       lis[lis.length - 1].classList.add('selected');
    //       lis[lis.length - 1].scrollIntoView(false);
    //     }
    //   } else { // Existing selected
    //     lis[i].classList.remove('selected');
    //     if (event.keyCode == 40) { // Down arrow
    //       lis[(i + 1) % lis.length].classList.add('selected');
    //       lis[(i + 1) % lis.length].scrollIntoView(false);
    //     } else { // Down arrow
    //       // In javascript mod gives exact mod for negative value
    //       // For example, -1 % 6 = -1 but I need, -1 % 6 = 5
    //       // To get the round positive value I am adding the divisor
    //       // with the negative dividend
    //       lis[(((i - 1) % lis.length) + lis.length) % lis.length].classList.add('selected');
    //       lis[(((i - 1) % lis.length) + lis.length) % lis.length].scrollIntoView(false);
    //     }
    //   }
    // } else if (event.keyCode == 13) { // Enter key event
    //   let lis = this.areaList.nativeElement.children;
    //   let i = 0;
    //   for (; i < lis.length; i++) {
    //     if (lis[i].classList.contains('selected')) {
    //       break;
    //     }
    //   }
    //   if (i < lis.length) {
    //     let selectedId = lis[i].dataset.value;
    //     this.selectedArea = lis[i];
    //     this.setArea();
    //   }
    // } else {
    //   let inp = this.areaSearch.nativeElement.value.trim();
    //   this.filteredAreas = this.areas.filter((item) => {
    //      return item.attributes.name.toLowerCase().indexOf(inp.toLowerCase()) > -1;
    //   });
    // }
  }
}
