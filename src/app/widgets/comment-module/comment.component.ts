import {
  Component, Input,
  EventEmitter, Output, ViewChild
} from '@angular/core';

import { CommentUI } from './../../models/comment';
import { WorkItemService } from './../../services/work-item.service';
import { MarkdownComponent } from 'ngx-widgets';

@Component({
  selector: 'fabric8-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.less']
})
export class CommentComponent {
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

  /**
   * This output is emitted when new comment is added
   */
  @Output('onCreateRequest') onCreateRequest: EventEmitter<CommentUI> =
   new EventEmitter();

  /**
   * This is an output event for any update request
   * to the comment or it's children
   */
  @Output('onUpdateRequest') onUpdateRequest: EventEmitter<CommentUI> =
   new EventEmitter();

  @ViewChild('commentEditor') commentEditor: MarkdownComponent;
  @ViewChild('replyEditor') replyEditor: MarkdownComponent;

  private replyActive: boolean = false;

  constructor() {}

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

  updateComment(event: any, comment: CommentUI): void {
    if (event.rawText !== "") {
      const rawText = event.rawText;
      let updatedComment: CommentUI = {
        body: rawText,
        id: comment.id,
        selfLink: comment.selfLink
      } as CommentUI;
      this.onUpdateRequest.emit(updatedComment);
    }
  }

  onCommentEditorKeyUp(event) {
    let inputText = this.commentEditor.editorInput.nativeElement.innerText.trim();
    if (inputText.length) {
      this.commentEditor.saving = false;
    } else {
      this.commentEditor.saving = true;
    }
  }

  updateChildComment(updatedComment: CommentUI) {
    this.onUpdateRequest.emit(updatedComment);
  }

  onReplyEditorKeyUp(event) {
    let inputText = this.replyEditor.editorInput.nativeElement.innerText.trim();
    if (inputText.length) {
      this.replyEditor.saving = false;
    } else {
      this.replyEditor.saving = true;
    }
  }

  onReplyClick() {
    this.replyActive=true;
    this.replyEditor.enableEditor();
    this.replyEditor.saving = true;
  }
}
