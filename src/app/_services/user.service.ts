import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';

import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { AuthService } from '../core/auth.service';

@Injectable()
export class UserService {

  constructor(
    private _aS: AuthService,
    private _afs: AngularFirestore
  ) { }

  getProfileInfo() {
    return this._aS.user;
  }

  getProfile(id: string) {
    return this._afs.doc<any>(`users/${id}`);
  }

  updateProfile(id, displayName) {
    return this.getProfile(id).update({displayName});
  }

  uploadProfilePicture(upload, id) {
    const storageRef = firebase.storage().ref();
    const imageName = new Date().getTime();
    const uploadTask = storageRef.child(`users/${imageName}`).put(upload);

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
          this.changeUserProfilePicture(upload, id);
          return;
        } else {
          console.log('File not uploaded')
        }
      }
    );
  }

  changeUserProfilePicture(upload, uid) {
    this.getProfile(uid).update({'photoURL': upload.url});
  }

}
