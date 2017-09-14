import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef
} from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';


@Component({
  selector: 'alm-planner-layout',
  styleUrls: ['./planner-layout.component.less'],
  animations:
  [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translateX(0px)',
        width: '50px'

      })),
      state('out', style({
        transform: 'translateX(0px)',
        width: '320px'
      })),
      transition('in <=> out', animate('300ms ease-in-out'))
    ]),
    trigger('slideInOutContent', [
      state('out', style({
        transform: 'translateX(0px)',
        marginLeft: '50px'

      })),
      state('in', style({
        transform: 'translateX(0px)',
        marginLeft: '320px'
      })),
      transition('in <=> out', animate('300ms ease-in-out'))
    ]),
  ],
  templateUrl: './planner-layout.component.html'
})

export class PlannerLayoutComponent implements OnInit, AfterViewInit {

  @Input() itemName: string;
  @Input() itemIcon: string;
  @Input() sidePanelContent: TemplateRef<any>;
  @Input() sectionContent: TemplateRef<any>;

  @Output() sidePanelStateChange = new EventEmitter<string>();

  contentHide: Boolean = false;
  sidePanelState: string = 'in';

  constructor(
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  test() {
    console.log('kasjlkasdhalksdhalsh');
  }

  getCurrentState() {
    return this.sidePanelState;
  }

  toggleSidePanel(): void {
    this.sidePanelState = this.sidePanelState === 'in' ? 'out' : 'in';
    this.sidePanelStateChange.emit(this.sidePanelState);
  }
}
