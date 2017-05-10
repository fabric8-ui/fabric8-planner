import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Broadcaster, Logger } from 'ngx-base';

import { WorkItem } from './../models/work-item';

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() item: WorkItem;

  @Output() isSelectedEvent: EventEmitter<CardComponent> = new EventEmitter<CardComponent>();

  constructor() {}

  ngOnInit() {

  }
}
