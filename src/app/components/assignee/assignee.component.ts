import { cloneDeep } from 'lodash';
import {
  Component,
  EventEmitter,
  OnInit,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FilterService } from '../../services/filter.service';
import { Space, Spaces } from 'ngx-fabric8-wit';
import { User } from 'ngx-login-client';

@Component({
  selector: 'f8-assignee',
  template: require('./assignee.component.html'),
  styles: [require('./assignee.component.css').toString()]
})

export class AssigneesComponent implements OnInit {
  private assignees: User[] = [];

  @Input() truncateAfter: number;
  @Input() showFullName: boolean;
  @Input('assignees') set assigneeInput(val) {
    this.assignees = val;
  };

  private spaceSubscription: Subscription = null;
  private spaceId;

  constructor(
    private filterService: FilterService,
    private spaces: Spaces
  ){}

  ngOnInit() {
  }
}
