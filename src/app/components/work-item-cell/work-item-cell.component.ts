import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'work-item-cell',
  template: require('./work-item-cell.component.html'),
  styles: [require('./work-item-cell.component.css').toString()]
})

export class WorkItemCellComponent {
    constructor() {
    }
    @Input() col: string;
    @Input() row: object;
    @Output() onDetailPreview = new EventEmitter();
    @Output() onQuickPreview = new EventEmitter();
    @Output() clickLabel = new EventEmitter();

    onDetail(Event: MouseEvent, id: string) {
      this.onDetailPreview.emit(id);
    }

    labelClick(event) {
      this.clickLabel.emit(event);
    }

    onPreview(Event: MouseEvent, id: string) {
      this.onQuickPreview.emit(id);
    }
}
