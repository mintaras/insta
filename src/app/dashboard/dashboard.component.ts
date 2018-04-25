import { Component, OnInit, Inject } from '@angular/core';
import { PostService } from '../_services/post.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PostDialogComponent } from '../post-dialog/post-dialog.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  posts: any;
  user_id: string;

  constructor(
    public dialog: MatDialog,
    private _pS: PostService,
    private aR: ActivatedRoute
  ) { }

  ngOnInit() {

    this.user_id = this.aR.snapshot.params['id'];

    if (this.user_id) {
      this.posts = this._pS.getPosts(this.user_id);
    } else {
      this.posts = this._pS.getPosts();
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
