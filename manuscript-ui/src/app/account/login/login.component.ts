import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {AccountService} from '../../auth/account.service';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';

@Component({
  selector: 'dhv-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  constructor(private authService: AuthService, private accountService: AccountService, public router: Router) {
  }

  ngOnInit(): void {
  }

  loginAction(): void {
    this.authService.login().then((res) => {
      const user = res.user;
      res.user?.getIdToken(false)
        .then(token => {
          console.log(token);
          if (res.additionalUserInfo?.isNewUser) {
            this.accountService
              .registerNewUser(res.user?.email!, res.user?.displayName!, res.user?.uid!, token)
              .subscribe({
                next: result => {
                  if (result.status) {
                    result.token = token;
                    this.updateLocalStorage(result, user);
                  } else {
                    Swal.fire('Credentials Error'
                      , 'An error occurred while authenticating your credentials, Try again in a moment'
                      , 'error');
                  }
                },
                error: err => {
                  console.log(err);
                  Swal.fire('Error occured while saving user', 'Try again in a few moments', 'error');
                }
              });
          } else {
            this.accountService
              .authenticateUser(user?.uid!, token)
              .subscribe({
                next: value => {
                  if (value.status) {
                    value.jwtToken = token;
                    this.updateLocalStorage(value, user);
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
    }).catch((err) => {
      Swal.fire('Canceled', 'Operation was Canceled', 'error');
      this.router.navigate(['/login']);
    });
  }


  reload(): void {
    document.location.href = '/map';
  }

  updateLocalStorage(result: any, user: any): void {
    const u = {
      displayName: user.displayName,
      photoUrl: user.photoURL
    };
    localStorage.setItem('user', JSON.stringify(u));
    localStorage.setItem('pinnedStations', JSON.stringify(result.pinnedStations));
    localStorage.setItem('token', result.jwtToken);
    this.reload();
  }

}
