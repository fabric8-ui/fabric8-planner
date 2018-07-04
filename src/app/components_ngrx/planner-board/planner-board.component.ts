import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import { SpaceQuery } from './../../models/space';

@Component({
    selector: 'planner-board',
    templateUrl: './planner-board.component.html',
    styleUrls: ['./planner-board.component.less']
})
export class PlannerBoardComponent implements AfterViewChecked, OnInit, OnDestroy {
    @ViewChild('boardContainer') boardContainer: ElementRef;

    private uiLockedSidebar: boolean = false;
    private sidePanelOpen: boolean = true;
    private eventListeners: any[] = [];

    constructor(
      private renderer: Renderer2,
      private spaceQuery: SpaceQuery
    ) {}

    ngOnInit() {
      this.eventListeners.push(
        this.spaceQuery.getCurrentSpace
          .do(() => {
            // this.uiLockedSidebar = true;
          })
          .subscribe()
      );
    }

    ngOnDestroy() {
      this.eventListeners.forEach(e => e.unsubscribe());
    }

    ngAfterViewChecked() {
      let hdrHeight = 0;
      if (document.getElementsByClassName('navbar-pf').length > 0) {
        hdrHeight = (document.getElementsByClassName('navbar-pf')[0] as HTMLElement).offsetHeight;
      }
      let targetHeight = window.innerHeight - (hdrHeight);

      if (this.boardContainer) {
        this.renderer.setStyle(
          this.boardContainer.nativeElement, 'height', targetHeight + 'px'
        );
      }
    }

    togglePanelState(event) {
      setTimeout(() => {
        this.sidePanelOpen = event === 'out';
      }, 200);
    }
}
