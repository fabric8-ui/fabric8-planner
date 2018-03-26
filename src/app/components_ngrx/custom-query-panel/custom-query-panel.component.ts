import { cloneDeep } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Params, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';

import { AuthenticationService } from 'ngx-login-client';
import { Space, Spaces } from 'ngx-fabric8-wit';

import { CustomQueryModel } from '../../models/custom-query.model';
import { FilterService } from '../../services/filter.service';

// ngrx stuff
import { Store } from '@ngrx/store';
import { AppState } from './../../states/app.state';
import * as CustomQueryActions from './../../actions/custom-query.actions';

@Component({
  selector: 'custom-query',
  templateUrl: './custom-query-panel.component.html',
  styleUrls: ['./custom-query-panel.component.less']
})
export class CustomQueryComponent implements OnInit, OnDestroy {

  @Input() sidePanelOpen: boolean = true;

  authUser: any = null;
  private spaceId;
  private eventListeners: any[] = [];
  private customQueries: CustomQueryModel[] = [];

  constructor(
    private auth: AuthenticationService,
    private filterService: FilterService,
    private route: ActivatedRoute,
    private spaces: Spaces,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    console.log('abc');
    const spaceData = this.store
      .select('listPage')
      .select('space')
      .filter(space => space !== null);

    const customQueriesData = this.store
      .select('listPage')
      .select('customQueries')
      //.filter(customQueries => !!customQueries.length);

    this.eventListeners.push(
      Observable.combineLatest(
        customQueriesData,
        spaceData
      ).subscribe(([customQueries, space]) => {
        this.customQueries = customQueries;
        this.spaceId = space.id;
      })
    );
  }

  ngOnDestroy() {
    this.eventListeners.forEach(e => e.unsubscribe());
  }

  constructUrl(attributes) {
    let jsonAttributes = JSON.parse(attributes);
    let jsonQuery = this.filterService.jsonToQuery(jsonAttributes);
    return jsonQuery;
  }

}
