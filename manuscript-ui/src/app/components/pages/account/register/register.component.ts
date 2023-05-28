import {Component} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AccountService} from "../../../../services/auth/account.service";
import {Router} from "@angular/router";
import {TownCrierService} from "../../../../services/town-crier.service";
import {RouterEnum} from "../../../../enums/RouterEnum";
import firebase from "firebase/compat";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  public formGroup: FormGroup;
  public inputType: string = "password";
  hidePassword: boolean = true;
  roles: string[] = ['Developer', 'User'];

  constructor(private auth: AngularFireAuth, private formBuilder: FormBuilder, private accountService: AccountService, public router: Router, public townCrier: TownCrierService) {
    this.formGroup = this.formBuilder.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
      name: [null, [Validators.required]],
      phoneNumber: [null, [Validators.required]],
      role: [null, [Validators.required]],
    });
  }

  register(value: any) {
    const email = this.formGroup.controls['email'].value;
    const password = this.formGroup.controls['password'].value;
    const name = this.formGroup.controls['name'].value;
    const phoneNumber = this.formGroup.controls['phoneNumber'].value;
    const role = this.formGroup.controls['role'].value;
    if (email && password && role && name) {
      this.auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
          const user: firebase.User | null = userCredential.user;
          user?.updateProfile({
            displayName: name
          }).then(() => {
            this.sendEmail();
            this.accountService.registerNewUser(user?.email!, user?.uid!, name, phoneNumber, role).subscribe(result => {
              if (result) {
                this.townCrier.info('Registration successful!');
                this.router.navigate(['/' + RouterEnum.Login]);
              } else {
                //TODO: need to delete it from firebase
                this.townCrier.error('Registration failed!');
              }
            });
          });
        }).catch(error => {
          this.townCrier.error('Registration failed ! ' + error);
        });
    } else {
      this.townCrier.error("Make sure that all fields are filled before submitting.");
    }
  }

  showPassword() {
    this.hidePassword = !this.hidePassword;
    if (this.inputType === 'password') {
      this.inputType = 'text';
    } else {
      this.inputType = 'password'
    }
  }

  sendEmail() {
    this.auth.currentUser.then((u) => {
      //If a user is successfully created with an appropriate email
      if (u != null) {
        u?.sendEmailVerification();
      }
    }).catch(error => {
      this.townCrier.error('Could not send email verification ' + error);
    });
  }
}
