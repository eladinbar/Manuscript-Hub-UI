import {Injectable} from '@angular/core';
import firebase from 'firebase/compat/app';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {GoogleAuthProvider} from "firebase/auth";

import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import UserCredential = firebase.auth.UserCredential;
import User = firebase.User;
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user?: User;
  private lang = 'heb';
  userData: any; // Save logged in user data

  constructor(public afAuth: AngularFireAuth, public afs: AngularFirestore, private router: Router) {
    (async () => {
      this.afAuth.authState.subscribe(user => {
        if (user) {
          this.userData = user;
          localStorage.setItem('user', JSON.stringify(this.userData));
          user.getIdTokenResult().then(res => {
            this.updateLocalStorage(res, user);
          })
        } else {
          localStorage.setItem('user', 'null');
        }
      });
    })()
    let tokenIntervalId = setInterval(this.refreshToken, 20000);

  }
  refreshToken(){

    if(this.userData) {
      this.userData.getIdToken().then((token: any) => {
        localStorage.setItem('token', token);
      });
    }
  }


  logout() {
    this.afAuth.signOut();
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    console.log(user)
    return true //&& user.emailVerified !== false;
  }

  checkLogin(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    if (user) {
      return true;
    } else {
      return false;
    }
  }

  signIn(email: string, password: string): Promise<any> {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log(result)
        this.SetUserData(result.user).then();
        this.updateLocalStorage(result, result.user);
        return result;

      })
      .catch((error) => {
        window.alert(error.message);
        return null;
      });
  }

  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: { uid: any; photoURL: any; emailVerified: any; displayName: any; email: any } = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }


  updateLocalStorage(result: any, user: any): void {
    const u = {
      displayName: user.displayName,
      photoUrl: user.photoURL
    };
    localStorage.setItem('user', JSON.stringify(u));
    localStorage.setItem('uid', user.uid);
    localStorage.setItem('token', result.token);
    localStorage.setItem('lang', this.lang);
    localStorage.setItem('direction', this.lang == 'en' ? 'ltr' : 'rtl');


  }

  async googleLogin(): Promise<UserCredential> {


    const provider = new GoogleAuthProvider();

    return await this.afAuth.signInWithPopup(provider);
  }

  deleteUser(): Promise<any> {
    // @ts-ignore
    return this.afAuth.currentUser.then((user: User) => {
      user.delete();
    });
  }
}
