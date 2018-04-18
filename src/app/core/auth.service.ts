import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

@Injectable()
export class AuthService {

  user: Observable<any | null>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.user = this.afAuth.authState.switchMap(user => {
      if (user) {
        return this.afs.doc<any>(`users/${user.uid}`).valueChanges();
      }
      return Observable.of(null);
    });
   }

  emailSignup(name: string, email: string, password: string) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
        .then(user => {
          return this.updateUserData(user)
        });
  }

  emailLogin(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.afAuth.auth.signOut().then(
      () => this.router.navigate(['/'])
    );
  }

  private updateUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: any = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "Guest",
      photoURL: user.photoURL || 'https://goo.gl/8kwFW5',
    };
    return userRef.set(userData, { merge: true });
  }

}
