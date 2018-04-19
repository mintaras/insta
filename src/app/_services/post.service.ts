import { Injectable } from '@angular/core';

import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { AuthService } from '../core/auth.service';

@Injectable()
export class PostService {

  constructor(
    private _aS: AuthService,
    private _afs: AngularFirestore
  ) { }

  uploadPicture(upload, uid) {
    const storageRef = firebase.storage().ref();
    const imageName = new Date().getTime();
    const uploadTask = storageRef.child(`posts/${imageName}`).put(upload);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot: firebase.storage.UploadTaskSnapshot) => {
        upload.progress = (uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100
      },
      (error) => {
        console.log(error)
      },
      () => {
        if (uploadTask.snapshot.downloadURL) {
          upload.url = uploadTask.snapshot.downloadURL;
          this.updatePicture(upload, uid);
          return;
        } else {
          console.log('File not uploaded')
        }
      }
    );
  }

  getPost(uid) {
    return this._afs.doc<any>(`posts/${uid}`);
  }

  private updatePicture(upload, uid) {
    this.getPost(uid).update({'photoURL': upload.url});
  }

  createPostPicture(uid) {
      const picture = {
        "user_uid": uid,
        "status": "draft"
      };
      return this._afs.collection('posts').add(picture);
  }

}
