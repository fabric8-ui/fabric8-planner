import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { sortBy } from 'lodash';
import { DragulaService } from 'ng2-dragula';
import { Subject } from 'rxjs';
import { BoardQuery, BoardUIQuery } from '../../models/board.model';
import { cleanObject } from '../../models/common.model';
import { WorkItemQuery, WorkItemUI } from '../../models/work-item';
import { AppState } from '../../states/app.state';
import * as BoardUIActions from './../../actions/board-ui.actions';
import * as ColumnWorkItemAction from './../../actions/column-workitem.action';
import { GroupTypeQuery, GroupTypeUI } from './../../models/group-types.model';
import { IterationQuery } from './../../models/iteration.model';
import { SpaceQuery } from './../../models/space';
import { WorkItemPreviewPanelComponent } from './../work-item-preview-panel/work-item-preview-panel.component';


@Component({
    selector: 'planner-board',
    templateUrl: './planner-board.component.html',
    styleUrls: ['./planner-board.component.less']
})
export class PlannerBoardComponent implements AfterViewChecked, OnInit, OnDestroy {
    @ViewChild('boardContainer') boardContainer: ElementRef;
    @ViewChild('quickPreview') quickPreview: WorkItemPreviewPanelComponent;


    private uiLockedSidebar: boolean = false;
    private sidePanelOpen: boolean = true;
    private eventListeners: any[] = [];
    private board$;
    private columns;
    private destroy$ = new Subject();

    constructor(
      private dragulaService: DragulaService,
      private renderer: Renderer2,
      private spaceQuery: SpaceQuery,
      private groupTypeQuery: GroupTypeQuery,
      private iterationQuery: IterationQuery,
      private boardQuery: BoardQuery,
      private route: ActivatedRoute,
      private store: Store<AppState>,
      private router: Router,
      private workItemQuery: WorkItemQuery,
      private boardUiQuery: BoardUIQuery
    ) {
      this.dragulaService.drop.asObservable().takeUntil(this.destroy$).subscribe((value) => {
        this.onDrop(value.slice(1));
      });
    }

    ngOnInit() {
      this.iterationQuery.deselectAllIteration();
      this.eventListeners.push(
        this.spaceQuery.getCurrentSpace
          .switchMap(() => {
            return this.groupTypeQuery.getFirstGroupType;
          }).take(1)
          .do((groupType) => {
            this.setDefaultUrl(groupType);
            this.checkUrl(groupType);
          })
          .subscribe()
      );
    }

    setDefaultUrl(groupType: GroupTypeUI) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { boardContextId: groupType.id }
      });
    }

    checkUrl(groupType) {
      this.eventListeners.push(
        this.router.events
          .filter(event => event instanceof NavigationStart)
          .map((e: NavigationStart) => e.url)
          .subscribe(url => {
            if (url.indexOf('?boardContextId') === -1 &&
              url.indexOf('/plan/board') > -1) {
              this.setDefaultUrl(groupType);
            }
          })
      );

      this.eventListeners.push(
        this.route.queryParams
          .filter(params => params.hasOwnProperty('boardContextId'))
          .map(params => params.boardContextId)
          .subscribe(contextId => {
            this.board$ = this.boardQuery.getBoardById(contextId);
            // Fetching work item
            // Dispatch action to fetch work items per lane for this context ID
          })
      );
    }

    ngOnDestroy() {
      this.destroy$.next();
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

    openQuickPreview(workItem: WorkItemUI) {
      this.quickPreview.open(workItem);
    }

    onDrop(args) {
      const [el, target, source, sibling] = args;
      let direction: string | null;
      let destinationWorkItemID: string;
      if (sibling === null && el.previousElementSibling !== null) {
        direction = 'below';
        destinationWorkItemID = el.previousElementSibling.children[0].getAttribute('data-id');
      } else if (sibling !== null) {
        direction = 'above';
        destinationWorkItemID = sibling.children[0].getAttribute('data-id');
      } else if (sibling === null && el.previousElementSibling === null) {
        // no reorder action dispatch only update action will dispatch
        direction = null;
      }
      this.workItemQuery.getWorkItemWithId(el.children[0].getAttribute('data-id'))
        .take(1)
        .subscribe((workItem: WorkItemUI) => {
          let workitem = {} as WorkItemUI;
          workitem['version'] = workItem.version;
          workitem['link'] = workItem.link;
          workitem['id'] = workItem.id;
          workitem['type'] = workItem.type;
          const payload = {
            workitem: workitem,
            destinationWorkitemID: destinationWorkItemID,
            direction: direction
          };
          workitem.columnIds = [target.getAttribute('data-id')];
          this.store.dispatch(new ColumnWorkItemAction.Update(
            {
              workItem: workitem,
              reorder: payload,
              prevColumnId: source.getAttribute('data-id')
            }
          ));
          this.store.dispatch(
            new BoardUIActions.LockBoard()
          );
      });
    }
}
