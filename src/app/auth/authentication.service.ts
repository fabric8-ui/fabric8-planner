import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { Logger } from '../shared/logger.service';

@Injectable()
export class AuthenticationService {
  private authToken: any = null;

  constructor(private router: Router, private logger: Logger) {
    //If a token is passed part of the url - extract that and set it    
    if((window.location.href).indexOf('?token=')>0){
      logger.log("Setting token from URL");
      let p1 = (window.location.href).indexOf('?token=')+7;//6 for ?token=
      this.authToken = (window.location.href).substring(p1,(window.location.href).length)
      localStorage.setItem('auth_token', this.authToken);
    }else{
      //If no token is passed as part of the URL, check for local storage
      this.authToken = localStorage.getItem('auth_token');
      logger.log("Setting token from local storage");
      if(!this.authToken || this.authToken =="") this.router.navigate(['login']);
    }
  }

  logout() {
    this.authToken = "";
    localStorage.removeItem('auth_token');
    this.router.navigate(['login']);
  }

  getToken() {
    if(this.authToken) return this.authToken;
    else this.router.navigate(['login']);
  }
}
