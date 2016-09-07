import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";

import { Logger } from '../../shared/logger.service';
import { WorkItem } from '../work-item';
import { WorkItemService } from '../work-item.service';

/*
    Work Item List Entry Component - Displays a work item and action elements for it.

    Inputs: workItem:WorkItem - the WorkItem to be displayed.
    Events: selectEvent(WorkItemListEntryComponent) - Entry is selected.        
            detailEvent(WorkItemListEntryComponent) - Detail view for entry is requested.
            deleteEvent(WorkItemListEntryComponent) - Signals deletion (see note below!).

    Note: all navigational events are delegated to a parent component:
    detailEvent, selectEvent. The parent component has the obligation to manually call
    select() on this component! Why? Because this allows the parent component to customize
    the select behaviour (like multi-selects or xor selects).

    All data events (deleteEvent only currently) are done inside this component (the service
    is called to delete the workItem) and an event is delegated back to the parent for 
    information purposes. The parent MUST NOT delete the workItem associated. The event is
    intended for display purposes, like removing the entry element and reloading the list.
*/

@Component({
  selector: 'work-item-list-entry',
  templateUrl: '/work-item-list-entry.component.html',
  styleUrls: ['/work-item-list-entry.component.css'],
})
export class WorkItemListEntryComponent {
  
  @Input() workItem: WorkItem;
  @Output() selectEvent: EventEmitter<WorkItemListEntryComponent> = new EventEmitter<WorkItemListEntryComponent>();
  @Output() detailEvent: EventEmitter<WorkItemListEntryComponent> = new EventEmitter<WorkItemListEntryComponent>();
  @Output() deleteEvent: EventEmitter<WorkItemListEntryComponent> = new EventEmitter<WorkItemListEntryComponent>();

  selected: boolean = false;
  actionDropdownOpen: boolean = false;

  constructor(
    private router: Router,
    private workItemService: WorkItemService,
    private logger: Logger) {
  }

  getWorkItem(): WorkItem {
    return this.workItem;
  }

  select(): void {
    event.stopPropagation();
    this.selected = true;
  }

  deselect(): void {
    console.log("DESELECT " + this.workItem.id);
    this.actionDropdownOpen = false;
    this.selected = false;
  }

  isSelected(): boolean {
    return this.selected;
  }

  // event handlers

  onToggleActionDropdown(event: MouseEvent): void {
    event.stopPropagation();  
    console.log("PRE " + this.workItem.id + " - " + this.actionDropdownOpen);
    this.actionDropdownOpen = !this.actionDropdownOpen;
    console.log("POST " + this.workItem.id + " - " + this.actionDropdownOpen);
    // clicking on the action menu automatically selects the entry
    this.selectEvent.emit(this);  
  }

  onDelete(event: MouseEvent): void {
    event.stopPropagation();
    this.workItemService
      .delete(this.workItem)
      .then(() => {
        this.deleteEvent.emit(this);
      });
  }

  onSelect(event: MouseEvent): void {
    event.stopPropagation();
    this.selectEvent.emit(this);    
  }

  onDetail(event: MouseEvent): void {
    event.stopPropagation();
    this.detailEvent.emit(this);
  }

  onMoveToBacklog(event: MouseEvent): void {
    alert("NOT IMPLEMENTED YET.")
  }

  onChangeState(event: MouseEvent): void {
    alert("NOT IMPLEMENTED YET.")
  }
}
