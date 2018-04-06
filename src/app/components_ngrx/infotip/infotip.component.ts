import { Component, Input } from '@angular/core';

@Component({
  selector: 'infotip',
  template: `<template #popoverTemplate>
             <span>{{infotipText}}</span>
             <span class="pficon-close close-popover" (click)="handlePropagation($event); pop.hide();"></span>
             </template>
             <span class="pficon-info infotip-icon"
             (click)="handlePropagation($event)" 
             [popover]="popoverTemplate" placement="right" 
             containerClass="popover-container" #pop="bs-popover">
             </span>`
})

export class InfotipComponent {
  @Input() infotipText: string;

  handlePropagation(e) {
    e.stopPropagation(); 
    e.preventDefault();
  }

  handleClose(e, pop) {
    pop.hide();
    this.handlePropagation(e);
  }

} 