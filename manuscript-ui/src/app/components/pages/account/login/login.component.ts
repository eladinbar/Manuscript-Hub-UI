import {Component} from '@angular/core';
import {AuthService} from '../../../../services/auth/auth.service';
import {AccountService} from '../../../../services/auth/account.service';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'dhv-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public formGroup: FormGroup;
  public inputType: string = "password";
  hide = true;


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

  login(value: any) {
    this.authService.signIn(value.username, value.password).then(res => {
      if (res) {
        res.user?.reload();
        if (res.user?.emailVerified) {
          this.authUser(res);
        } else {
          Swal.fire('Important Notice', 'You have to verify your mail before singing in ', 'error');
        }
      }

    })
  }

  googleLoginAction(): void {
    this.authService.googleLogin().then(this.authUser).catch(this.error);
  }


  error = (err: any) => {
    Swal.fire('Canceled', 'Operation was Canceled', 'error');
    this.router.navigate(['/login']);
  }

  authUser = (res: any) => {
    const user = res.user;
    res.user.getIdToken(false)
      .then((token: string) => {
        if (res.additionalUserInfo.isNewUser) {
          this.accountService
            .authenticateUser(res.user.uid, res.user.email, res.user.displayName, token)
            .subscribe({
              next: result => {
                if (result.status) {
                  result.token = token;

                  this.authService.updateLocalStorage(result, user, );
                  this.reload();

                } else {
                  Swal.fire('Credentials Error'
                    , 'An error occurred while authenticating your credentials, Try again in a moment'
                    , 'error');
                  this.authService.deleteUser();
                }
              },
              error: err => {
                Swal.fire('Error occured while saving user', 'Try again in a few moments', 'error');
                this.authService.deleteUser();
              }
            });
        } else {
          this.accountService
            .authenticateUser(user.uid, user.email, user.displayName, token)
            .subscribe({
              next: value => {
                console.log(value)
                if (value.status) {
                  value.token = token;
                  this.authService.updateLocalStorage(value, user);
                  this.reload();

                } else {
                  Swal.fire('Credentials Error'
                    , 'An error occurred while authenticating your credentials, Try again in a moment'
                    , 'error');
                }
              },
              error: err => {
                Swal.fire('Credentials Error'
                  , 'An error occurred while authenticating your credentials, Try again in a moment'
                  , 'error');
              }
            });
        }
      });
  }


  showPassword() {
    if (this.inputType === 'password') {
      this.inputType = 'text';
      this.hide = true;
    } else {
      this.inputType = 'password'
      this.hide = false;

    }

  }


  redirectToRegister() {
    this.router.navigate(['/register']);

  }
}
