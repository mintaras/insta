import { Injectable } from '@angular/core';

import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { AuthService } from '../core/auth.service';
import { UserService } from '../_services/user.service';

@Injectable()
export class PostService {

  private postsCollection: AngularFirestoreCollection<any>;
  likes: number = 0;
  post: any;

  constructor(
    private _aS: AuthService,
    private _afs: AngularFirestore,
    private _uS: UserService
  ) { }

  uploadPicture(upload, id) {
    const storageRef = firebase.storage().ref();
    const imageName = new Date().getTime();
    const uploadTask = storageRef.child(`posts/${imageName}`).put(upload);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot: firebase.storage.UploadTaskSnapshot) => {
        upload.progress = (uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100
      },
      (error) => {
        console.error(error)
      },
      () => {
        if (uploadTask.snapshot.downloadURL) {
          let newPicture = {
            photoURL: uploadTask.snapshot.downloadURL,
            imageName: imageName
          }
          this.updatePicture(newPicture, id);
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

  getPosts(user_id = '') {
    this.postsCollection = this._afs.collection('posts', post => {
        if (user_id !== '') {
          return post
            .where('status', '==', 'active')
            .where('user_uid', '==', user_id)
            .orderBy('created_at', 'desc')
        } else {
          return post.where('status', '==', 'active')
            .orderBy('created_at', 'desc')
        }
    });

    return this.postsCollection.snapshotChanges().map(
    (posts) => {
      return posts.map(
        (post) => {
          const data = post.payload.doc.data();
          const user = this._uS.getProfile(data.user_uid).valueChanges();

          return {
            id: post.payload.doc.id,
            user_id: data.user_uid,
            description: data.description,
            photoURL: data.photoURL,
            likes: data.likes,
            user: user
          }
        }
      );
    }
  );
  }

  private updatePicture(upload, id) {
    this.getPost(id).update(upload);
  }

  updateDescription(description = '', id) {
    this.getPost(id).update({"description": description});
  }

  sharePost(id) {
      return this.getPost(id).update({"status": "active"});
  }

  createPostPicture(uid) {
      const picture = {
        "user_uid": uid,
        "status": "draft",
        "description": '',
        "likes": 0,
        "created_at": new Date().getTime(),
        "updated_at": new Date().getTime()
      };
      return this._afs.collection('posts').add(picture);
  }

  deletePhoto(id: string, pictureName: string) {
    this.getPost(id).update({
      "photoURL": "",
      "imageName": ""
    }).then(
      () => {
        const storageRef = firebase.storage().ref();
        storageRef.child(`posts/${pictureName}`).delete();
      }
    );
  }

  updatePostLikes(id, action, user_id): void {
    const postDoc = this.getPost(id);
    postDoc.valueChanges().subscribe(post => {
      this.likes = post.likes;
    });

    if (action === 'dec') {

      let likesCollection = postDoc.collection(`likes`, like => {
        return like.where('user_id', '==', user_id)
      });

      likesCollection.snapshotChanges().map(likes => {
        return likes.map(like => {
          const like_id = like.payload.doc.id;
          this._afs.doc(`posts/${id}/likes/${like_id}`).delete()
            .then(() => postDoc.update({"likes": --this.likes}));
          return;
        });
      }).subscribe();

    } else if (action === 'inc') {

      postDoc.collection('likes').add({
        "user_id": user_id
      }).then(() => postDoc.update({"likes": ++this.likes}));

    }
  }

  isPostLikedByUser(post_id, user_id) {
    return this.getPost(post_id).collection(`likes`, like => {
      return like.where('user_id', '==', user_id)
    }).valueChanges()
  }

}
