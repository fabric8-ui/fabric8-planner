import { Component, Input } from '@angular/core';

@Component({
  selector: 'infotip',
  templateUrl: './infotip.component.html',
  styleUrls: ['./infotip.component.less']
})

export class InfotipComponent {
  @Input() infotipText: string;
  @Input() infotipId: string = '';

  handlePropagation(e) {
    if (e.path[2].classList.contains('f8-group-filter__type') ||
    e.path[2].classList.contains('popover-container')) {
      e.stopPropagation();
      e.preventDefault();
    }
    let pops = Array.from(document.getElementsByClassName('popover-container')) as Array<HTMLElement>;
    pops.forEach(pop => {
      if (!pop.classList.contains(this.infotipId)) {
        pop.style.display = 'none';
      }
    });
  }
}
