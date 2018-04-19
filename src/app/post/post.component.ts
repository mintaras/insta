import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { PostService } from '../_services/post.service';

import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  picture: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _pS: PostService,
    private _authS: AuthService
  ) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  detectFile(event: Event) {
    const selectFile = (event.target as HTMLInputElement).files;
    const files = selectFile;

    if (!files || files.length === 0) {
      console.log('No files found');
      return;
    }
    this._authS.user.subscribe(user => {
      this._pS.createPostPicture(user.uid).then(data => {
        this._pS.uploadPicture(files[0], data.id);
        this.picture = this._pS.getPost(data.id).valueChanges();
      }
      );
    })
  }

}
