import { Component, ViewChild, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';


@Component({
  selector: 'fab-planner-associate-iteration-modal',
  templateUrl: './work-item-iteration-association-modal.component.html',
  styleUrls: ['./work-item-iteration-association-modal.component.scss']
})
export class FabPlannerAssociateIterationModalComponent implements OnInit, OnChanges {

  @ViewChild('iterationAssociationModal') iterationAssociationModal: any;

  ngOnInit() {

  }

  ngOnChanges() {

  }

  openAssociateIterationModal() {
    this.iterationAssociationModal.open();
  }
}
