import { Component, OnDestroy, ViewChild } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Modal } from 'ngx-modal';

import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'osio-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.less']
})
export class ModalComponent implements OnDestroy {

  @ViewChild('OSIOModal') private modal: Modal;
  private title: string;
  private buttonText1: string;
  private buttonText2: string;
  private message: string;
  private actionKey1: string;
  private actionKey2: string;
  eventListeners: any[] = [];

  constructor(private modalService: ModalService) {
    this.eventListeners.push(
      this.modalService.getComponentObservable().subscribe((params: string[]) => {
        this.actionKey1 = params[4];
        this.actionKey2 = params[5];
        this.open(params[0], params[1], params[2], params[3]);
      })
    );
  }

  ngOnDestroy() {
    this.eventListeners.forEach(e => e.unsubscribe());
  }

  public open(title: string, message: string, buttonText1: string, buttonText2?: string) {
    this.title = title;
    this.message = message;
    this.buttonText1 = buttonText1;
    this.buttonText2 = buttonText2;
    this.modal.open();
  }

  public doAction(actionKey) {
    this.modalService.doAction(actionKey);
  }
}
