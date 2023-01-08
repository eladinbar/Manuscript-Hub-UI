import {Injectable} from '@angular/core';
import firebase from "firebase/compat";
import User = firebase.User;
import {Auth} from "@angular/fire/auth";
import * as auth from 'firebase/auth';

import UserCredential = firebase.auth.UserCredential;
import {AccountService} from "./account.service";
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user?: User;
  constructor(public afAuth: AngularFireAuth, private accountService: AccountService, private router: Router) {
  }

  async login(): Promise<UserCredential> {
    return await this.afAuth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  async logout(): Promise<void> {
    await this.afAuth.signOut();
    localStorage.clear();
  }



}
