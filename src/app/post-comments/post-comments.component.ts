import { Component, OnInit, Input, Inject } from '@angular/core';
import { CommentService } from '../_services/comment.service';
import { PostDialogComponent } from '../post-dialog/post-dialog.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-post-comments',
  templateUrl: './post-comments.component.html',
  styleUrls: ['./post-comments.component.scss']
})
export class PostCommentsComponent implements OnInit {

  comments: any;
  comment: string;
  post: any;

  constructor(private _cS: CommentService,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    this.post = data;
  }

  ngOnInit() {
    this._cS.getComments(this.post.id).subscribe(comments => {
      this.comments = comments
    });

  }

  addComment(postId, userid) {
    this._cS.addComment(postId, userid, this.comment);
  }

}
