import {Directive, ElementRef, ContentChild, Output, EventEmitter, Input} from '@angular/core';
import {DropdownNotClosableZone} from './DropdownNotClosableZone';

@Directive({
    selector: '[dropdown]',
    exportAs: 'dropdown'
})
export class Dropdown {

    // -------------------------------------------------------------------------
    // Inputs / Outputs
    // -------------------------------------------------------------------------

    @Input('dropdownToggle')
    toggleClick = true;

    @Input('dropdownFocusActivate')
    activateOnFocus = false;

    @Output()
    onOpen = new EventEmitter();

    @Output()
    onClose = new EventEmitter();

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    @ContentChild(DropdownNotClosableZone)
    notClosableZone: DropdownNotClosableZone;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private elementRef: ElementRef) {
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    open() {
        const element: HTMLElement = this.elementRef.nativeElement;
        element.classList.add('open');
        this.onOpen.emit(undefined);
    }

    close() {
        const element: HTMLElement = this.elementRef.nativeElement;
        element.classList.remove('open');
        this.onClose.emit(undefined);
    }

    isOpened() {
        const element: HTMLElement = this.elementRef.nativeElement;
        return element.classList.contains('open');
    }

    isInClosableZone(element: HTMLElement) {
        if (!this.notClosableZone)
            return false;

        return this.notClosableZone.contains(element);
    }

}