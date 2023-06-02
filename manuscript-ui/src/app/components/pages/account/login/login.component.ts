import {Component} from '@angular/core';
import {AuthService} from '../../../../services/auth/auth.service';
import {AccountService} from '../../../../services/auth/account.service';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RouterEnum} from "../../../../enums/RouterEnum";
import firebase from "firebase/compat";
import {UserModel} from "../../../../models/UserModel";
import {StatusEnum} from "../../../../enums/StatusEnum";
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

  googleLogin(): void {
    // Sign in with username and password
    this.authService.googleLogin().then((credential: UserCredential | null): void => {
      this.verifyCredentials(credential);
    }).catch((error) => {
      Swal.fire('Google authentication failed', error, 'error');
    });
  }

  login(authentication: any): void {
    // Sign in with username and password
    this.authService.signIn(authentication.username, authentication.password).then((credential: UserCredential | null): void => {
      this.verifyCredentials(credential);
    }).catch(() => {
      Swal.fire('Invalid username or password', 'You have entered an incorrect email or password.', 'error');
    });
  }

  verifyCredentials(credential: UserCredential | null): void {
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
      } else {
        Swal.fire('No Credentials Found', 'No credentials were found for the given email and password.', 'error');
      }
  }

  error = (): void => {
    Swal.fire('Canceled', 'Operation was canceled.', 'error');
    // this.router.navigate(['/' + RouterEnum.Login]);
  }

  authUser = (credential: UserCredential): Promise<boolean> | undefined => {
    const user: firebase.User | null = credential.user;
    return user?.getIdToken(false).then((token: string): Promise<boolean> => {
      if (credential.additionalUserInfo?.isNewUser) {
        return new Promise<boolean>((resolve, reject): void => {
          this.accountService.authenticateUser(user!.uid, user!.email!, user!.displayName!, token).subscribe({
              next: (userModel: UserModel) => {
                if (userModel.status === StatusEnum.Enabled) {
                  this.reload();
                  resolve(true);
                } else {
                  Swal.fire('Pending Approval',
                    'Your account request is currently being reviewed by an administrator. Please wait until it is approved.',
                    'error');
                  this.authService.deleteUser();
                  resolve(false);
                }
              },
              error: (err) => {
                Swal.fire('An error occurred while attempting to save the user.',
                  'Please try again in a few moments.',
                  'error');
                this.authService.deleteUser();
                reject();
              },
            });
        });
      } else {
        return new Promise<boolean>((resolve, reject): void => {
          this.accountService.authenticateUser(user!.uid, user!.email!, user!.displayName!, token).subscribe({
              next: (userModel: UserModel) => {
                if (userModel.status === StatusEnum.Enabled) {
                  this.reload();
                  resolve(true);
                } else {
                  Swal.fire('Account Suspended',
                    'Your account has been suspended by an administrator. To appeal, please contact the support team.',
                    'error');
                  resolve(false);
                }
              },
              error: (err) => {
                Swal.fire('System Error',
                  'An error occurred while authenticating your credentials, please try again in a moment.',
                  'error');
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
