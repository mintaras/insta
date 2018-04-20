import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { PostService } from '../_services/post.service';
import { AuthService } from '../core/auth.service';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  picture: any;
  description: any;
  id: string;
  isLinear = true;
  posts: any;
  post: any = {
    photoURL: '',
    description: ''
  };

  constructor(
    private _formBuilder: FormBuilder,
    private _pS: PostService,
    private _authS: AuthService,
    private router: Router,
    private aR: ActivatedRoute
  ) { }

  ngOnInit() {
    this.id = this.aR.snapshot.params['id'];
    if (this.id) {
      this._pS.getPost(this.id).valueChanges()
        .subscribe(post => this.post = post);
    } else {
      this.createPost();
    }
  }

  createPost() {
    this._authS.user.subscribe(user => {
      this._pS.createPostPicture(user.uid).then(post => {
        return this.router.navigate(['post/', post.id]);
      });
    })
  }

  updateDescription() {
    this._pS.updateDescription(this.post.description, this.id);
  }

  sharePost() {
    this._pS.sharePost(this.id).then(post => {
      return this.router.navigate(['/dashboard']);
    });
  }

  detectFile(event: Event) {
    const selectFile = (event.target as HTMLInputElement).files;
    const files = selectFile;

    if (!files || files.length === 0) {
      console.warn('No files found');
      return;
    }
    this._pS.uploadPicture(files[0], this.id);
    event.target['value'] = "";
  }

  deletePhoto(event: any) {
    event.stopPropagation();
    this._pS.deletePhoto(this.id, this.post.imageName);
  }

}
