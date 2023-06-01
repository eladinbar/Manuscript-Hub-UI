import {Component} from '@angular/core';
import {AuthService} from '../../../../services/auth/auth.service';
import {AccountService} from '../../../../services/auth/account.service';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RouterEnum} from "../../../../enums/RouterEnum";
import firebase from "firebase/compat";
import UserCredential = firebase.auth.UserCredential;

@Component({
  selector: 'dhv-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public formGroup: FormGroup;
  public inputType: string = "password";
  hidePassword = true;

  constructor(private authService: AuthService, private accountService: AccountService, public router: Router,
              private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  reload(): void {
    document.location.href = '/';
  }

  login(value: any): void {
    // Sign in with username and password
    this.authService.signIn(value.username, value.password).then((credential: UserCredential | null) => {
      // Check if credentials are valid
      if (credential) {
        const user: firebase.User | null = credential.user;
        user?.reload();
        // Check if user is email verified
        if (user?.emailVerified) {
          // Get user authentication from the backend
          this.authUser(credential)?.then((verified: boolean): void => {
            if(verified) {
              // Set user data in local storage
              this.authService.setUserData(user!);
            }
          });
        } else {
          Swal.fire('Important Notice', 'You have to verify your email before signing in.', 'error');
        }
      }
    });
  }

  googleLoginAction(): void {
    this.authService.googleLogin().then(this.authUser).catch(this.error);
  }

  error = (): void => {
    Swal.fire('Canceled', 'Operation was canceled.', 'error');
    this.router.navigate(['/' + RouterEnum.Login]);
  }

  authUser = (credential: UserCredential): Promise<boolean> | undefined => {
    const user: firebase.User | null = credential.user;
    return user?.getIdToken(false).then((token: string): Promise<boolean> => {
      if (credential.additionalUserInfo?.isNewUser) {
        return new Promise<boolean>((resolve, reject): void => {
          this.accountService.authenticateUser(user!.uid, user!.email!, user!.displayName!, token).subscribe({
              next: (result) => {
                if (result.status) {
                  this.reload();
                  resolve(true);
                } else {
                  Swal.fire('Credentials Error',
                    'An error occurred while authenticating your credentials, please try again in a moment.',
                    'error'
                  );
                  this.authService.deleteUser();
                  resolve(false);
                }
              },
              error: (err) => {
                Swal.fire('An error occurred while attempting to save the user.',
                  'Please try again in a few moments.',
                  'error'
                );
                this.authService.deleteUser();
                reject();
              },
            });
        });
      } else {
        return new Promise<boolean>((resolve, reject): void => {
          this.accountService.authenticateUser(user!.uid, user!.email!, user!.displayName!, token).subscribe({
              next: (value) => {
                console.log(value);
                if (value.status) {
                  this.reload();
                  resolve(true);
                } else {
                  Swal.fire('Credentials Error',
                    'An error occurred while authenticating your credentials, please try again in a moment.',
                    'error'
                  );
                  resolve(false);
                }
              },
              error: (err) => {
                Swal.fire('Credentials Error',
                  'An error occurred while authenticating your credentials, please try again in a moment.',
                  'error'
                );
                reject();
              },
            });
        });
      }
    });
  };

  showPassword(): void {
    this.hidePassword = !this.hidePassword;
    if (this.inputType === 'password') {
      this.inputType = 'text';
    } else {
      this.inputType = 'password'
    }
  }

  redirectToRegister(): void {
    this.router.navigate(['/' + RouterEnum.Register]);
  }
}
