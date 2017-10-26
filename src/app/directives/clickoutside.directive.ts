import {Directive, ElementRef, Output, EventEmitter, HostListener} from '@angular/core';

@Directive({
   selector: '[click-outside-popup]'
})

export class ClickOutsideDirective {
   constructor(private eref : ElementRef) {
   }

   @Output()
   public clickOutsidePopup = new EventEmitter();

   @HostListener('document:click', ['$event.target','$event.target.classList.contains('+'"assigned_user"'+')'])
   public onClick(targetElement,assigned_user) {
       const clickedInsidePopup = this.eref.nativeElement.contains(targetElement);
       if (!clickedInsidePopup&&!assigned_user) {   
           this.clickOutsidePopup.emit(null);
       }
   }
}

