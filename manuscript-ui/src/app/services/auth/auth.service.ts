import {Injectable} from '@angular/core';
import firebase from 'firebase/compat/app';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {GoogleAuthProvider} from "firebase/auth";
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import {Router} from "@angular/router";
import {CryptoService} from "../crypto.service";
import UserCredential = firebase.auth.UserCredential;
import User = firebase.User;
import {RouterEnum} from "../../enums/RouterEnum";
import IdTokenResult = firebase.auth.IdTokenResult;
import {TownCrierService} from "../town-crier.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private lang: string = 'en';
  firebaseUser?: firebase.User; // Save logged in user data

  constructor(public afAuth: AngularFireAuth, public afs: AngularFirestore, private router: Router,
              public cryptoService: CryptoService, private townCrier: TownCrierService) { }

  async googleLogin(): Promise<UserCredential> {
    const provider: GoogleAuthProvider = new GoogleAuthProvider();
    this.townCrier.info("Logging in...");
    return await this.afAuth.signInWithPopup(provider);
  }

  signIn(email: string, password: string): Promise<UserCredential | null> {
    this.townCrier.info("Logging in...");
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((credential: UserCredential) => {
        return credential;
      })
      .catch((error) => {
        window.alert(error.message);
        return null;
      });
  }

  signOut() {
    this.townCrier.info("Logging out...");
    this.afAuth.signOut();
    localStorage.clear();
    this.router.navigate(['/' + RouterEnum.Login]);
    this.townCrier.info("Logged out successfully.");
  }

  setUserData(user: firebase.User): Promise<void> {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: { uid: any; photoURL: any; emailVerified: any; displayName: any; email: any } = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };

    user.getIdTokenResult().then((idTokenResult: IdTokenResult): void => {
      this.updateLocalStorage(idTokenResult, user);
    });

    return userRef.set(userData, {
      merge: true,
    });
  }

  updateLocalStorage(idTokenResult: IdTokenResult, user: firebase.User): void {
    const u = {
      displayName: user.displayName,
      photoUrl: user.photoURL
    };
    localStorage.setItem('user', JSON.stringify(u));
    localStorage.setItem('displayName', user.displayName!);
    localStorage.setItem('uid', user.uid);
    localStorage.setItem('email', user.email!);
    localStorage.setItem('token', idTokenResult.token);
    localStorage.setItem('lang', this.lang);
    localStorage.setItem('direction', this.lang == 'en' ? 'ltr' : 'rtl'); //TODO requires generalization
  }

  refreshToken(): void {
    if (this.firebaseUser) {
      this.firebaseUser.getIdToken().then((token: any) => {
        localStorage.setItem('token', token);
      });
    }
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return !!user;
  }

  get isDeveloper(): boolean {
    const role = localStorage.getItem('role')!;
    return this.cryptoService.decrypt(role) === 'Developer' || this.cryptoService.decrypt(role) === 'Admin';
  }

  get isAdmin(): boolean {
    const role = localStorage.getItem('role')!;
    return this.cryptoService.decrypt(role) === 'Admin';
  }

  deleteUser(): Promise<any> {
    // @ts-ignore
    return this.afAuth.currentUser.then((user: User) => {
      user.delete();
    });
  }
}
