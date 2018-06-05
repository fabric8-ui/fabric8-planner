import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnDestroy,
  OnChanges
} from '@angular/core';
import { User } from 'ngx-login-client';

@Component({
  selector: 'switch',
  template: require('./switch.component.html'),
  styles: [require('./switch.component.css').toString()]
})
export class SwitchComponent {
  @Input() isChecked: Boolean;
  @Output() onChecked = new EventEmitter();

  toggleSwitch(event) {
    this.onChecked.emit(event);
  }
}
