import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownNotClosableZone } from './DropdownNotClosableZone';
import { Dropdown } from './Dropdown';
import { DropdownOpen } from './DropdownOpen';

export * from './DropdownNotClosableZone';
export * from './Dropdown';
export * from './DropdownOpen';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        DropdownNotClosableZone,
        Dropdown,
        DropdownOpen,
    ],
    exports: [
        DropdownNotClosableZone,
        Dropdown,
        DropdownOpen,
    ]
})
export class DropdownModule {

}