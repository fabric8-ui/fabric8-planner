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
import { cloneDeep, isEqual } from 'lodash';
import {
  SelectDropdownComponent
} from './../../widgets/select-dropdown/select-dropdown.component';
import {
  AuthenticationService,
  User,
  UserService
} from 'ngx-login-client';
import { UserUI } from './../../models/user'
import { WorkItem, WorkItemRelations } from '../../models/work-item';
import { WorkItemService } from '../../services/work-item.service';

@Component({
  selector: 'assignee-selector',
  templateUrl: './assignee-selector.component.html',
  styleUrls: ['./assignee-selector.component.less']
})
export class AssigneeSelectorComponent {

  @ViewChild('userSearch') userSearch: any;
  @ViewChild('userList') userList: any;
  @ViewChild('dropdown') dropdownRef: SelectDropdownComponent;

  @Input() loggedInUser: UserUI;

  allUsers: UserUI[] = [];
  @Input('allUsers') set allUsersSetter(val: UserUI[]) {
    this.allUsers = cloneDeep(val);
    this.backup = cloneDeep(this.allUsers.map(user => {
      return {
        name: user.name,
        src: user.avatar,
        id: user.id,
        stickontop: false,
        selected: false
      }
    }));
    if (this.searchValue.length) {
      this.assignees =
        cloneDeep(this.backup.filter(i => i.name.indexOf(this.searchValue) > - 1));
    }
    else {
      this.assignees = cloneDeep(this.backup);
    }
    if (this.loggedInUser) {
      this.backup = [{
        name: this.loggedInUser.name,
        src: this.loggedInUser.avatar,
        id: this.loggedInUser.id,
        stickontop: true,
        selected: false
      }, ...this.backup];
      this.assignees = [this.backup[0], ...this.assignees];
      this.allUsers = [this.loggedInUser, ...this.allUsers];
    }
    this.updateSelection();
  }

  selectedAssignees: UserUI[] = [];
  prevSelected: UserUI[] = [];
  @Input('selectedAssignees') set selectedAssigneesSetter(val) {
    this.prevSelected = cloneDeep(val);
    this.selectedAssignees = cloneDeep(val);
    this.updateSelection();
  }

  @Output() onSelectAssignee: EventEmitter<UserUI[]> = new EventEmitter();
  @Output() onOpenAssignee: EventEmitter<any> = new EventEmitter();
  @Output() onCloseAssignee: EventEmitter<any> = new EventEmitter();

  workItem: WorkItem;
  workItemRef: WorkItem;
  users: User[] = [];
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
      if (this.selectedAssignees.find(a => assignee.id === a.id)) {
        this.assignees[index].selected = true;
      } else {
        this.assignees[index].selected = false;
      }
    });
    this.backup.forEach((assignee, index) => {
      if (this.selectedAssignees.find(a => assignee.id === a.id)) {
        this.backup[index].selected = true;
      } else {
        this.backup[index].selected = false;
      }
    });
  }

  onSearch(event: any) {
    let needle = event.trim();
    this.searchValue = needle;
    if (needle.length) {
      this.assignees = cloneDeep(
        this.backup.filter(
          i =>
            i.name.toLowerCase().indexOf(needle.toLowerCase()) > -1 ||
            i.stickontop
        ));
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
    const update = !isEqual(this.prevSelected, this.selectedAssignees);
      this.onCloseAssignee.emit({
        users: cloneDeep(this.selectedAssignees),
        update: update
      });
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
