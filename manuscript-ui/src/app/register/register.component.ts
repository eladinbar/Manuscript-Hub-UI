import {Component} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  public email?: string;
  public password?: string;

  constructor(private auth: AngularFireAuth) {
  }

  register() {
    if (this.email != null && this.password != null) {
      this.auth.createUserWithEmailAndPassword(this.email, this.password)
        .then(user => {
          console.log('Registration successful!');
        })
        .catch(error => {
          console.log('Registration failed:', error);
        });
    }
  }
}
