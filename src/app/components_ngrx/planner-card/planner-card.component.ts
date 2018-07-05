import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardConfig } from 'patternfly-ng/card';
import { WorkItemUI } from './../../models/work-item';

@Component({
    selector: 'f8-planner-card',
    templateUrl: './planner-card.component.html',
    styleUrls: ['./planner-card.component.less']
})
export class PlannerCardComponent {

  @Input() workItem: WorkItemUI;
  @Output() readonly onCardClick = new EventEmitter();
  @Output() readonly onTitleClick = new EventEmitter();

  private config: CardConfig = {
    noPadding: true,
    topBorder: false,
    titleBorder: false
  };

  private labels = [{
    backgroundColor: '#d1d1d1',
    borderColor: '#8461f7',
    id: '22fdcbda-6556-4940-8637-8af834499271',
    name: 'Area/Planner',
    textColor: '#000000',
    version: 0
  }, {
    backgroundColor: '#a18fff',
    borderColor: '#bbbbbb',
    id: '2698b84a-c121-47b2-8ff5-28a76c808958',
    name: 'Important',
    textColor: '#000000',
    version: 0
  }, {
    backgroundColor: '#fbeabc',
    borderColor: '#f39d3c',
    id: '197725a8-1cd4-4e25-a763-b4a2747fc92b',
    name: 'label 9',
    textColor: '#000000',
    version: 0
  }, {
    backgroundColor: '#a18fff',
    borderColor: '#bbbbbb',
    id: '2698b84a-c121-47b2-8ff5-28a76c808958',
    name: 'Important',
    textColor: '#000000',
    version: 0
  }, {
    backgroundColor: '#fbeabc',
    borderColor: '#f39d3c',
    id: '197725a8-1cd4-4e25-a763-b4a2747fc92b',
    name: 'label 9',
    textColor: '#000000',
    version: 0
  }];

  cardClick(workItem: WorkItemUI, event) {
    event.stopPropagation();
    this.onCardClick.emit(workItem);
  }

  titleClick(workItem: WorkItemUI, event) {
    event.stopPropagation();
    this.onTitleClick.emit(workItem);
  }
}
