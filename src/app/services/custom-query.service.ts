import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { cloneDeep } from 'lodash';
import { Injectable, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { ActivatedRoute } from '@angular/router';

import { WIT_API_URL, Space, Spaces } from 'ngx-fabric8-wit';
import { HttpService } from './http-service';
import { CustomQueryModel, CustomQueryService as CQService } from '../models/custom-query.model';

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
   * getCustomQueries - Fetches all the available custom queries
   * @param apiUrl - The url to get list of all filters
   * @return Observable of FilterModel[] - Array of filters
   */
  getCustomQueries(): Observable<CustomQueryModel[]> {
    console.log('********* get custom queries');
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

  /**
    * Usage: This method create a new item
    * adds the new item to the big list
    * resolve the users for the item
    * re build the ID-Index map
    *
    * @param: WorkItem - workItem (Item to be created)
    */
    create(customQuery: CustomQueryModel): Observable<CustomQueryModel> {
      let payload = JSON.stringify({data: customQuery});
      if (this._currentSpace) {
        let queryUrl = this._currentSpace.links.self + '/queries';
        return this.http
          .post(queryUrl, payload)
          .map(response => {
            return response.json().data as CustomQueryModel;
          }).catch((error: Error | any) => {
            console.log('Creating custom query failed.', error);
            return Observable.throw(new Error(error.message));
          });
      } else {
        return Observable.of<CustomQueryModel>( new CustomQueryModel() );
      }
    }
}
