import { Component, OnInit, Inject } from '@angular/core';
import { PostService } from '../_services/post.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PostDialogComponent } from '../post-dialog/post-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  posts: any;
  user_id: string;
  user: any;
  liked: boolean = false;
  //likesCount: number;

  constructor(
    private _authS: AuthService,
    public dialog: MatDialog,
    private _pS: PostService,
    private aR: ActivatedRoute
  ) {
      this._authS.user.subscribe(user => {
        this.user = user
        //this.likesCount = this.data.likes;
        //this._pS.isPostLikedByUser(this.data.id, user.uid).subscribe(likes => likes.length > 0 ? this.liked = true : this.liked = false);
      });
    }

  ngOnInit() {

    this.user_id = this.aR.snapshot.params['id'];

    if (this.user_id) {
      this._pS.getPosts(this.user_id).subscribe(posts => this.posts = posts);
    } else {
      this._pS.getPosts().subscribe(posts => this.posts = posts);
    }

  }

  openPost(post): void {
    let dialogRef = this.dialog.open(PostDialogComponent, {
        maxWidth: '800px',
        width: '100%',
        height: '70vh',
        panelClass: 'post-dialog',
        data: post
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
