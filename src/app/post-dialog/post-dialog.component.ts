import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { PostService } from '../_services/post.service';
import { UserService } from '../_services/user.service';
import { AuthService } from '../core/auth.service';
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-post-dialog',
  templateUrl: './post-dialog.component.html',
  styleUrls: ['./post-dialog.component.scss']
})
export class PostDialogComponent implements OnInit, OnDestroy {

  user: any;
  postUser: any;
  liked: boolean = false;
  likesCount: number;
  userSubscription: ISubscription;

  constructor(
    private _authS: AuthService,
    public dialogRef: MatDialogRef<PostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _pS: PostService,
    private _uS: UserService
  ) {
      this._authS.user.subscribe(user => {
        this.user = user
        this.likesCount = this.data.likes;
        this._pS.isPostLikedByUser(this.data.id, user.uid).subscribe(likes => likes.length > 0 ? this.liked = true : this.liked = false);
      });
    }

    ngOnInit() {
      this.userSubscription = this.data.user.subscribe(user => this.postUser = user);
    }

    ngOnDestroy() {
      this.userSubscription.unsubscribe();
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

    updatePostLikes(post_id, action, user_id) {
      this._pS.updatePostLikes(post_id, action, user_id);
      this._uS.updateUserLikes(user_id, action, post_id);
      if (action === 'inc') {
        this.liked = true;
        ++this.likesCount;
      } else {
        this.liked = false;
        --this.likesCount;
      }
    }

    deletePost(post_id) {
      this.dialogRef.close();
      this._pS.softDeletePost(post_id);
    }

}
