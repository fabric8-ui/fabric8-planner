import {Directive, ElementRef, Output, EventEmitter, HostListener} from '@angular/core';

@Directive({
   selector: '[click-outside-popup]'
})

export class ClickOutsideDirective {
   constructor(private eref : ElementRef) {
   }

   @Output()
   public clickOutsidePopup = new EventEmitter();

   @HostListener('document:click', ['$event.target'])
   public onClick(targetElement) {
       const clickedInsidePopup = this.eref.nativeElement.contains(targetElement);
       const assigned_user = targetElement.classList.contains('assigned_user');
       if (!clickedInsidePopup&&!assigned_user) {   
           this.clickOutsidePopup.emit(null);
       }
   }
}

