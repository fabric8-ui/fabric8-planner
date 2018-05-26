import { DomSanitizer } from '@angular/platform-browser';
import { Component, Input, EventEmitter, Output } from '@angular/core';

import { CommentUI } from './../../models/comment';
import { WorkItemService } from './../../services/work-item.service';

@Component({
  selector: 'fabric8-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.less']
})
export class CommentComponent {
  /**
   * This boolean value decides if the comment is editable or not
   */
  @Input('editAllow') editAllow: boolean = true;

  /**
   * This is the comment input
   */
  @Input('comment') comment: CommentUI = null;

  /**
   * Event to show preview in markdown
   */
  @Output('onShowPreview') onPreview: EventEmitter<{
    rawText: string, callBack: (x: string, y:string) => void
  }> = new EventEmitter();

  @Output('onCreateRequest') onCreateRequest: EventEmitter<CommentUI> =
   new EventEmitter();


  constructor(
    private sanitizer: DomSanitizer,
    private workItemService: WorkItemService) {}

  showPreview(event: {rawText: string, callBack: (x: string, y:string) => void}): void {
    this.onPreview.emit(event);
  }

  createComment(event): void {
    const rawText = event.rawText;
    const callBack = event.callBack;
    callBack('', '');
    let newComment: CommentUI = {
      body: rawText,
      parentId: this.comment.id
    } as CommentUI;
    this.onCreateRequest.emit(newComment);
  }
}
