import { Injectable } from '@angular/core';

import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { AuthService } from '../core/auth.service';
import { UserService } from '../_services/user.service';

@Injectable()
export class CommentService {

  private commentsCollection: AngularFirestoreCollection<any>;

  constructor(
    private _aS: AuthService,
    private _afs: AngularFirestore,
    private _uS: UserService
  ) { }

    getComments(post_id) {
      this.commentsCollection = this._afs.collection('comments', comment => comment.where('post_id', '==', post_id));
      return this.commentsCollection.snapshotChanges().map(
      (comments) =>{
        return comments.map(
          (comment) => {
            const data = comment.payload.doc.data();
            const user = this._uS.getProfile(data.user_id).valueChanges();

            return {
              id: comment.payload.doc.id,
              post_id: data.post_id,
              user_id: data.user_id,
              text: data.text,
              user: user
            }
          }
        );
      }
    );
  }

  addComment(post_id, user_id, comment) {
      return this._afs.collection('comments').add({
        "post_id": post_id,
        "user_id": user_id,
        "text": comment,
        "created_at": new Date().getTime(),
        "updated_at": new Date().getTime()
      });
  }

}
