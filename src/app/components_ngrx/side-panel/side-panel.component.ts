import { Component, Input, OnInit } from '@angular/core';
import { WorkItemPreviewPanelComponent } from '../work-item-preview-panel/work-item-preview-panel.component';

@Component({
  selector: 'side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.less']
})
export class SidepanelComponent implements OnInit {

  @Input() sidePanelOpen: boolean = true;
  @Input() context: 'list' | 'board' = 'list'; // 'list' or 'board'
  @Input() quickPreview: WorkItemPreviewPanelComponent;
  @Input() isQuickPreviewOpen: boolean;

  backlogSelected: boolean = true;
  typeGroupSelected: boolean = true;

  constructor() {
  }

  ngOnInit() {}
  setGuidedTypeWI() {}
}
