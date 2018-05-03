import { Component, Input } from '@angular/core';

@Component({
  selector: 'infotip',
  template: `<ng-template #popoverTemplate>
             <span class="popover-text">{{infotipText}}</span>
             <span class="pficon-close close-popover" 
             (click)="handlePropagation($event); pop.hide();"></span>
             </ng-template>
             <span class="pficon-info infotip-icon"
             (click)="handlePropagation($event)"
             [style.opacity]="pop.isOpen ? '1' : ''"   
             [popover]="popoverTemplate" placement="right" 
             containerClass="popover-container" #pop="bs-popover">
             </span>`
})

export class InfotipComponent {
  @Input() infotipText: string;
  
  handlePropagation(e) {
    if(e) {
      e.stopPropagation(); 
      e.preventDefault();
    }
  }
} 