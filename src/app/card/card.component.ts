import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Broadcaster, Logger, Notification, NotificationType, Notifications } from 'ngx-base';
import { User } from 'ngx-login-client';

import { WorkItem } from './../models/work-item';
import { WorkItemService } from './../work-item/work-item.service';

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() item: WorkItem;
  @Input() title: string;
  @Input() user: User;

  @Output() isSelectedEvent: EventEmitter<CardComponent> = new EventEmitter<CardComponent>();

  constructor(
    private notifications: Notifications,
    private workItemService: WorkItemService,
  ) {}

  ngOnInit() {

  }

  kebabClick(event: any): void {
    event.stopPropagation();
  }

  onMoveToBacklog(event: any): void {
    event.stopPropagation();
    //set this work item's iteration to None
    //send a patch request
    this.item.relationships.iteration = {}
    this.workItemService
      .update(this.item)
      .subscribe(workItem => {
        this.item = workItem;
        try {
          this.notifications.message({
            message: workItem.attributes['system.title'] + ' has been moved to the Backlog.',
            type: NotificationType.SUCCESS
          } as Notification);
        } catch (e) {
          console.log('Error displaying notification. Iteration was moved to Backlog.')
        }

    },
    (err) => {
      try {
        this.notifications.message({
          message: this.item.attributes['system.title'] + ' could not be moved to the Backlog.',
          type: NotificationType.DANGER
        } as Notification);
      } catch (e) {
        console.log('Error displaying notification. Error moving Iteration to Backlog.')
      }

    });
  }

}
