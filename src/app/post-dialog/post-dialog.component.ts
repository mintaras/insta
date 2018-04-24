import { Component, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { PostService } from '../_services/post.service';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-post-dialog',
  templateUrl: './post-dialog.component.html',
  styleUrls: ['./post-dialog.component.scss']
})
export class PostDialogComponent {

  user: any;
  liked: boolean = false;

  constructor(
    private _authS: AuthService,
    public dialogRef: MatDialogRef<PostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _pS: PostService) {
      this._authS.user.subscribe(user => {
        this.user = user
        this._pS.isPostLikedByUser(this.data.id, user.uid).subscribe(likes => likes.length > 0 ? this.liked = true : this.liked = false);
      });
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

    updatePostLikes(post_id, action, user_id) {
      this._pS.updatePostLikes(post_id, action, user_id);
    }

}
