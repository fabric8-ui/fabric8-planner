import { Observable } from 'rxjs/Observable';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { cloneDeep } from 'lodash';
import {
  SelectDropdownComponent
} from './../../widgets/select-dropdown/select-dropdown.component';
import {
  AuthenticationService,
  User,
  UserService
} from 'ngx-login-client';
import { WorkItem, WorkItemRelations } from '../../models/work-item';
import { WorkItemService } from '../../services/work-item.service';

@Component({
  selector: 'assignee-selector',
  templateUrl: './assignee-selector.component.html',
  styleUrls: ['./assignee-selector.component.less']
})
export class AssigneeSelectorComponent implements OnChanges {

  @ViewChild('userSearch') userSearch: any;
  @ViewChild('userList') userList: any;
  @ViewChild('dropdown') dropdownRef: SelectDropdownComponent;

  @Input() allUsers: User[] = [];

  selectedAssignees: User[] = [];
  @Input('selectedAssignees') set selectedAssigneesSetter(val) {
    this.selectedAssignees = cloneDeep(val);
  }

  @Output() onSelectAssignee: EventEmitter<User[]> = new EventEmitter();
  @Output() onOpenAssignee: EventEmitter<any> = new EventEmitter();
  @Output() onCloseAssignee: EventEmitter<User[]> = new EventEmitter();

  workItem: WorkItem;
  workItemRef: WorkItem;
  users: User[] = [];
  loggedInUser: User;
  workItemPayload: WorkItem;
  searchAssignee: Boolean = false;

  private activeAddAssignee: boolean = false;

  private backup: any[] = [];
  private assignees: any[] = [];
  private searchValue: string = '';

  constructor(
    private auth: AuthenticationService,
    private workItemService: WorkItemService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if( changes.allUsers ) {
      this.backup = cloneDeep(this.allUsers);
      if (this.searchValue.length) {
        this.assignees =
          cloneDeep(this.backup.filter(i => i.name.indexOf(this.searchValue) > - 1));
      }
      else {
        this.assignees = cloneDeep(this.backup);
      }
      console.log("assignee:"+this.assignees);
    }
    if( changes.selectedLabels ) {
      this.updateSelection();
    }
  }
  onSelect(event: any) {
    let findSelectedIndex = this.selectedAssignees.findIndex(i => i.id === event.id);
    if (findSelectedIndex > -1) {
      this.selectedAssignees.splice(findSelectedIndex, 1);
    } else {
      let findAssignee = cloneDeep(this.allUsers.find(i => i.id === event.id));
      if (findAssignee) {
        this.selectedAssignees.push(findAssignee);
      }
    }
    this.updateSelection();
    this.onSelectAssignee.emit(cloneDeep(this.selectedAssignees));
  }
  updateSelection() {
    this.assignees.forEach((assignee, index) => {
      if (this.selectedAssignees.find(l => assignee.id === l.id)) {
        this.assignees[index].selected = true;
      } else {
        this.assignees[index].selected = false;
      }
    });
    this.backup.forEach((label, index) => {
      if (this.selectedAssignees.find(l => label.id === l.id)) {
        this.backup[index].selected = true;
      } else {
        this.backup[index].selected = false;
      }
    });
  }

  onSearch(event: any) {
    let needle = event.trim();
    this.searchValue = needle;
    console.log('backup = ', this.backup);
    if (needle.length) {
      this.assignees = cloneDeep(this.backup.filter(i => i.attributes.fullName.toLowerCase().indexOf(needle.toLowerCase()) > -1));
    } else {
      this.assignees = cloneDeep(this.backup);
    }
  }
  updateOnList() {
    this.workItemService.emitEditWI(this.workItem);
  }
  cancelAssignment(): void {
    this.searchAssignee = false;
  }
  onOpen(event) {
    this.onOpenAssignee.emit('open');
  }
  onClose(event) {
    this.onCloseAssignee.emit(cloneDeep(this.selectedAssignees));
  }

  openDropdown() {
    this.dropdownRef.openDropdown();
  }

  closeDropdown() {
    this.dropdownRef.closeDropdown();
  }
  closeAddAssignee() {
    this.activeAddAssignee = false;
  }
}
