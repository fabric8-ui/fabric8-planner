import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[dropdown-not-closable-zone]'
})
export class DropdownNotClosableZone {
    
    @Input('dropdown-not-closable-zone')
    dropdownNotClosabledZone: boolean;

    constructor(private elementRef: ElementRef) {
    }

    contains(element: HTMLElement) {
        if (this.dropdownNotClosabledZone === false)
            return false;
        
        const thisElement: HTMLElement = this.elementRef.nativeElement;
        return thisElement.contains(element);
    }
}