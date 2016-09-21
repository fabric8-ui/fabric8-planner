import { Component } from '@angular/core';
import { Routes, RouterModule, RouterLink } from '@angular/router';


@Component({
    selector: 'app-header',
    templateUrl: '/header.component.html'
})

export class HeaderComponent {
  title = 'Almighty';
}
