import { Component } from '@angular/core';
import { Router } from "@angular/router";

import { LoginItem } from './login-item';
import { LoginService } from './login.service';


@Component({
    selector: 'login-form',
    templateUrl: '/login.component.html',
    styleUrls: ['/login.component.scss'],
})

export class LoginComponent {
  loginItem: LoginItem;
  showError: boolean = false;
  feedbackMessage: string = '';
  statusCode: number = 0;

  constructor(
    private router: Router,
    private loginService: LoginService) {
  }

  gitSignin() {
    this.loginService.gitHubSignIn();
  }

}
