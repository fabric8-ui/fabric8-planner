import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { AreaQuery } from '../models/area.model';
import { IterationQuery } from '../models/iteration.model';
// import { LabelQuery } from '../models/label.model';
// import { UserQuery } from '../models/user';
import {
  AND, ENCLOUSER, EQUAL_QUERY,
  IN, NOT_EQUAL_QUERY, NOT_IN, OR,
  P_END, P_START, SUB_STR
} from './query-keys';

const keys_before_field = [
  AND, OR, P_START
];
const keys_before_value = [
  EQUAL_QUERY, NOT_EQUAL_QUERY
];


@Injectable()
export class QuerySuggestionService {
  public queryObservable: BehaviorSubject<string> = new BehaviorSubject('-');
  constructor(
    private areaQuery: AreaQuery,
    private iterationQuery: IterationQuery
  ) {}

  private fields = of({
    'area': this.areaQuery.getAreaIds(),
    'area.name': this.areaQuery.getAreaNames(),
    'iteration': this.iterationQuery.getIterationIds,
    'iteration.name': this.iterationQuery.getIterationNames
  });

  /**
   * Takes the entire query written so far
   * split the query by keywords for the
   * ease of processing
   * @param query
   */
  shouldSuggestField(query: string):
  {suggest: boolean; value: string; lastKey: string} {
    let output = { suggest: true, value: query.trim(), lastKey: '' };

    for (let i = 0; i < keys_before_field.length; i++) {
      let temp = output.value.split(keys_before_field[i]);
      if (temp.length > 1) {
        // split with the key and take the last value from the array
        output = {
          suggest: true,
          value: temp[temp.length - 1].trim(),
          lastKey: keys_before_field[i]
        };
      }
    }

    if (output.value.indexOf(EQUAL_QUERY) > -1 ||
      output.value.indexOf(NOT_EQUAL_QUERY) > -1) {
      output = {
        suggest: false,
        value: output.value,
        lastKey: ''
      };
    }

    return output;
  }

  /**
   * Takes a chunk of the query
   * extract the field and typed value
   * @param query
   */
  suggestValue(query: string): { field: string; value: string; } {
    let splitField = query.split(EQUAL_QUERY);
    if (splitField.length === 1) {
      splitField = query.split(NOT_EQUAL_QUERY);
    }
    const field = splitField[0].trim();
    // could be a IN query so we split it by ,
    let splittedvalues = splitField[1].split(',');
    // take the last one from the array
    let value = splittedvalues[splittedvalues.length - 1].trim();
    // trim the value if it has enclouser
    if (value[0] == ENCLOUSER) {
      value = value.substr(1);
    }
    if (value[value.length - 1] == ENCLOUSER) {
      value = value.substr(0, value.length - 1);
    }
    return {field, value};
  }

  getSuggestions(): Observable<string[]> {
    return this.queryObservable
      .pipe(
        distinctUntilChanged(),
        switchMap(query => {
          const fieldSuggest = this.shouldSuggestField(query);
          if (fieldSuggest.suggest) {
            return this.fields.pipe(
              map(fields => Object.keys(fields)
                .filter(f => f.indexOf(fieldSuggest.value) > -1)
              )
            );
          } else {
            const fieldValue = this.suggestValue(fieldSuggest.value);
            return this.fields.pipe(
              switchMap(fields => {
                if (fields[fieldValue.field]) {
                  return fields[fieldValue.field].pipe(
                    map((values: string[]) =>
                      values.filter(v => v.indexOf(fieldValue.value) > -1)
                    )
                  );
                } else {
                  return of([]);
                }
              })
            );
          }
        })
      );
  }
}
