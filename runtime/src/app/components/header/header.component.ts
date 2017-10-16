import { SpacesService } from '../../services/spaces.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Broadcaster, Logger } from 'ngx-base';
import { AuthenticationService, User, UserService, Profile } from 'ngx-login-client';
import { Space, Spaces, SpaceService, Context, ContextType } from 'ngx-fabric8-wit';
import { MenuItem, ContextLink, SystemStatus, HeaderService } from 'osio-ngx-framework';

@Component({
  selector: 'planner-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
})
export class HeaderComponent implements OnInit {

  systemContext: string = 'planner';
  currentContext: Context;
  recentContexts: Context[];
  systemStatus: SystemStatus[];
  loggedInUser: User;
  followQueryParams: Object = {};
  spaces: Space[] = [];
  currentSpace: Space = null;

  constructor(
    private logger: Logger,
    private broadcaster: Broadcaster,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private auth: AuthenticationService,
    private spacesService: SpacesService,
    private headerService: HeaderService) {
  
      this.headerService.clean();

      this.systemStatus = [
        {
          id: 'sys0',
          name: 'Some Subsystem',
          statusOk: true
        } as SystemStatus,
        {
          id: 'sys1',
          name: 'Some Other Subsystem',
          statusOk: false
        } as SystemStatus      
      ]
    }

  onSelectRecentContext(context: Context) {
  }

  onSelectMenuItem(menuItem: MenuItem) {
  }    

  onSelectViewAllSpaces() {
  }

  onSelectAccountHome() {
  }

  onSelectUserProfile() {
  }
      
  onSelectCreateSpace() {
  }

  onSelectLogout() {
    this.auth.logout();
    this.loggedInUser = null as User;
    this.headerService.clean();
  }

  onSelectLogin() {
    this.router.navigate(['login']);
  }

  onSelectAbout() {
  }

  onFollowedLink(url: string) {
  }
  
  ngOnInit(): void {    

    // logout can also be called by an event from other parts of the app
    this.broadcaster.on<string>('logout')
      .subscribe(message => {
        this.logger.warn('[PlannerHeader] Received logout broadcast event.')        
        this.onSelectLogout();
      });

    // on an authentication error, we logout and send the user to the login
    this.broadcaster.on<any>('authenticationError')
      .subscribe(() => {
        this.logger.warn('[PlannerHeader] Received authenticationError broadcast event.')        
        this.onSelectLogout();
        this.router.navigate(['/login']);
      });

    // we subscribe to the UserService to get notified when the user switches
    this.userService.getUser().subscribe(user => {
      if (user && user.id) {
        this.logger.log('[PlannerHeader] UserService signals new user ' + user.id);
        this.loggedInUser = user;        
      } else {
        this.logger.warn('[PlannerHeader] UserService returned empty object user value.')        
      }
    });

    /*
    // we subscribe to the current space to get notified when the space switches
    this.spacesService.current.subscribe(space => {
      this.currentSpace = space;
      if (this.currentSpace) {       
        // Note: the ""+this.currentSpace.path is needed because Space is broken
        let context = this.headerService.createContext(this.currentSpace.attributes.name, ""+this.currentSpace.id, this.currentSpace, this.loggedInUser);
        console.log('##############################1');
        console.log(context);
        this.currentContext = context;
      } else {
        this.currentContext = null;
      }
    });

    // we subscribe to all spaces list to get notified when the spaces list changes
    this.spacesService.getAllSpaces().subscribe((spaces) => {
      this.spaces = spaces as Space[];
      this.currentSpace = spaces[0];
      if (this.currentSpace) {
        this.logger.log('[PlannerHeader] Selected new Space: ' + this.currentSpace.id);
        // Note: the ""+this.currentSpace.path is needed because Space is broken
        let context = this.headerService.createContext(this.currentSpace.attributes.name, ""+this.currentSpace.id, this.currentSpace, this.loggedInUser);
        console.log('##############################2');
        console.log(context);
        this.currentContext = context;
        this.spacesService.setCurrent(this.currentSpace);
      } else {
        this.logger.log('[PlannerHeader] Deselected Space.');
        this.currentContext = null;
        this.spacesService.setCurrent(null);
      }
    });
    */

    // we preserve the iteration query params TODO: is this needed?
    this.route.queryParams.subscribe(params => {
      this.logger.warn('[PlannerHeader] QueryParams changed.')        
      this.followQueryParams = {};
      if (Object.keys(params).indexOf('iteration') > -1) {
        this.followQueryParams['iteration'] = params['iteration'];
      }
    })    
  }

}
