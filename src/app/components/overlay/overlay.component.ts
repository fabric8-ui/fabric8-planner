import { Component, ViewChild, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Broadcaster } from 'ngx-base';

@Component({
  selector: 'overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss']
})
export class OverlayComponent implements OnInit {

  @ViewChild('overlayModal') overlayModal: any;
  message:string = '';

  constructor() {}

  ngOnInit() {
    this.closeModal();
  }

  showModal(object: any): void {
    this.message = object.message;
    this.overlayModal.open({
      backdrop: 'static',
      keyboard: false
    });
  }

  closeModal(): void {
    this.overlayModal.close();
  }

  reloadPage(): void {
    window.location.reload();
  }

}
