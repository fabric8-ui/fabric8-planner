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
  recentContexts: Context[] = [];
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
      this.headerService.activateMenuItemById('planner_list');
  }

  private goTo(menuItem: MenuItem) {
    for (let m of menuItem.contextLinks) {
      if (m.context == "planner") {
        if (m.type == "internal") {
          this.logger.log('[PlannerHeader] internal link found for MenuItem: ' + m.path);
          this.goToInternal(m.path);
        } else if (m.type == "external") {
          this.logger.log('[PlannerHeader] external link found for MenuItem: ' + m.path);
          this.goToExternal(m.path);
        } else {
          this.logger.warn('[PlannerHeader] No link found for MenuItem: ' + menuItem.id)
        }
      }
    }
  } 

  private getBaseURL() {
    // TODO Integration: this might change (and possibly be a runtime configuration) as we might want to use subdomains: planner.os.io etc.
    let l = document.createElement("a");
    l.href = location.href;
    return l.protocol + '//' + l.host + '/';
  }

  private goToInternal(path: string) {
    this.logger.log('[PlannerHeader] Switching to internal route: ' + path);
    this.router.navigate([path]);
  }

  private goToExternal(path: string) {
    this.logger.log('[PlannerHeader] Switching to external route: ' + path);   
    window.location.href = path;
  }

  onSelectMenuItem(menuItem: MenuItem) {
    this.goTo(menuItem);
  }    

  onSelectLogout() {
    this.logger.log('[PlannerHeader] Logging out user.');   
    this.auth.logout();
    this.loggedInUser = null as User;
    this.headerService.clean();
  }

  onSelectLogin() {
    this.router.navigate(['/login']);
  }

  onSelectAbout() {
    this.logger.log('[PlannerHeader] Showing about modal.');       
    // TODO Integration: this currently opens a modal dialog
    // This should be part of the header, or at least a common component in a library
  }

  onSelectCreateSpace() {
    this.logger.log('[PlannerHeader] Showing create new space.');       
    // TODO Integration: this currently opens a modal dialog
    // This should either be a common component from a library OR an external link to a platform dialog
  }

  onSelectRecentContext(context: Context) {
    // TODO Integration: this should just switch the space, not leave Planner (or at least for certain options in the recent dropdown)
    this.goToExternal(this.getBaseURL() + context.path);
  }

  onSelectViewAllSpaces() {
    this.goToExternal(this.getBaseURL() + this.loggedInUser.id + '/_spaces');
  }

  onSelectAccountHome() {
    this.goToExternal(this.getBaseURL() + '_home');
  }

  onSelectUserProfile() {
    this.goToExternal(this.getBaseURL() + this.loggedInUser.id);
  }

  onFollowedLink(url: string) {
    // NOP
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
        this.loggedInUser = null;        
      }
    });

    // we subscribe to the current space to get notified when the space switches. This only fires if a switch is happening, not on bootstrap
    this.spacesService.current.subscribe(space => {
      this.currentSpace = space;
      if (this.currentSpace) {       
        // Note: the ""+this.currentSpace.path is needed because Space is broken
        this.logger.log('[PlannerHeader] Received from SpaceService new currentContext: ' + space.id);
        let context = this.headerService.createContext(this.currentSpace.attributes.name, ""+this.currentSpace.id, this.currentSpace, this.loggedInUser);
        this.currentContext = context;
      } else {
        this.currentContext = null;
      }
    });

    // we subscribe to all spaces list to get notified when the spaces list changes
    this.spacesService.getAllSpaces().subscribe((spaces) => {
      this.logger.log('[PlannerHeader] Received from SpaceService new spaces list with length: ' + spaces.length);
      this.spaces = spaces as Space[];
      for (let thisSpace of this.spaces) {
        this.logger.log('[PlannerHeader] Prepare space from allSpaces: ' + thisSpace.id);
        let context = this.headerService.createContext(thisSpace.attributes.name, ""+thisSpace.id, thisSpace, this.loggedInUser);        
        this.recentContexts.push(context);
        this.headerService.addRecentContext(context);
      } 
      // if there is no currentSpace yet, we select the first one to be the new currentSpace
      if (!this.currentSpace) {
        this.currentSpace = spaces[0];
        if (this.currentSpace) {
          this.logger.log('[PlannerHeader] Selected new Space on result of getAllSpaces: ' + this.currentSpace.id);
          // Note: the ""+this.currentSpace.path is needed because Space is broken
          let context = this.headerService.createContext(this.currentSpace.attributes.name, ""+this.currentSpace.id, this.currentSpace, this.loggedInUser);
          this.currentContext = context;
          this.spacesService.setCurrent(this.currentSpace);
        } else {
          this.logger.log('[PlannerHeader] Deselected Space.');
          this.currentContext = null;
          this.spacesService.setCurrent(null);
        }
      }
    });

    // we preserve the iteration query params TODO: is this needed?
    this.route.queryParams.subscribe(params => {
      this.logger.warn('[PlannerHeader] QueryParams changed.')        
      this.followQueryParams = {};
      if (Object.keys(params).indexOf('iteration') > -1) {
        this.followQueryParams['iteration'] = params['iteration'];
      }
    });
    
    // if there is no systemStatus retrieved from the storage, init it with something meaningful
    this.headerService.retrieveSystemStatus().subscribe((systemStatus: SystemStatus[]) => {
      // TODO: instead of adding template data here, retrieve the real systemStatus somewhere, because the user could have used a deepLink
      if (!systemStatus || systemStatus.length==0) {
        this.systemStatus = [
          {
            id: 'planner',
            name: 'Planner',
            statusOk: true
          } as SystemStatus 
        ]
        this.headerService.persistSystemStatus(this.systemStatus);    
      }
    })
  }

}
