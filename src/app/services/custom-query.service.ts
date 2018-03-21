import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { cloneDeep } from 'lodash';
import { Injectable, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { ActivatedRoute } from '@angular/router';

import { WIT_API_URL, Space, Spaces } from 'ngx-fabric8-wit';
import { HttpService } from './http-service';
import { CustomQueryModel } from '../models/custom.query.model';

@Injectable()
export class CustomQueryService {
  private _currentSpace: Space;
  private customQueries: CustomQueryModel[] = [];

  constructor(
    private http: HttpService,
    private spaces: Spaces,
    private route: ActivatedRoute
  ) {
    this.spaces.current.subscribe(val => this._currentSpace = val);
  }

  /**
   * getFilters - Fetches all the available filters
   * @param apiUrl - The url to get list of all filters
   * @return Observable of FilterModel[] - Array of filters
   */
  getCustomqueries(): Observable<CustomQueryModel[]> {
    if (this._currentSpace) {
      if (this.customQueries.length > 0 ) {
        return Observable.of(this.customQueries);
      } else {
        // get the current iteration url from the space service
        return this.spaces.current.take(1).switchMap(space => {
          let queryUrl = this._currentSpace.links.self + '/queries';
          return this.http
            .get(queryUrl)
            .map (response => {
              if (/^[5, 4][0-9]/.test(response.status.toString())) {
                throw new Error('API error occured');
              }
              return response.json().data as CustomQueryModel[];
            })
            .map((data) => {
              this.customQueries = data;
              return this.customQueries;
            })
            .catch ((error: Error | any) => {
              if (error.status === 401) {
                console.log('You have been logged out.', error);
              } else {
                console.log('Fetch iteration API returned some error - ', error.message);
              }
              return Observable.throw(new Error(error.message));
            });
        });
      }
    }
  }
}
