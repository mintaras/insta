import { Injectable } from '@angular/core';

import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { AuthService } from '../core/auth.service';

@Injectable()
export class UserService {

  constructor(
    private _authS: AuthService,
    private _afs: AngularFirestore
  ) { }

  getProfileInfo() {
    return this._authS.user;
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
        } else {
          console.log('File not uploaded')
        }
      }
    );
  }

  changeUserProfilePicture(upload, uid) {
    this.getProfile(uid).update({'photoURL': upload.url});
  }

  updateUserLikes(user_id, action, post_id) {
    if (action === 'dec') {

      let likesCollection = this.getProfile(post_id).collection(`likes`, like => {
        return like.where('post_id', '==', post_id)
      });

      likesCollection.snapshotChanges().map(likes => {
        return likes.map(like => {
          const like_id = like.payload.doc.id;
          this._afs.doc(`users/${user_id}/likes/${like_id}`).delete();
          return;
        });
      }).subscribe();

    } else if (action === 'inc') {

      this.getProfile(user_id).collection('likes').add({
        "post_id": post_id
      });

    }
  }

}
