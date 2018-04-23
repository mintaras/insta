import { Component, OnInit, Inject } from '@angular/core';
import { PostService } from '../_services/post.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PostDialogComponent } from '../post-dialog/post-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  posts: any;

  constructor(
    public dialog: MatDialog,
    private _pS: PostService
  ) { }

  ngOnInit() {
    this._pS.getPosts().subscribe(posts => {
      this.posts = posts
    });
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
