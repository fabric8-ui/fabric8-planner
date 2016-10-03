import { Component } from '@angular/core';
import { AuthenticationService } from './auth/authentication.service';

@Component({
  selector: 'my-app',
  templateUrl: '/app.component.html',
  styleUrls: ['/app.component.scss']
  })
export class AppComponent {
  
  constructor(auth:AuthenticationService){
    auth.isLoggedIn();
  }
}