import {Component} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AccountService} from "../../../../services/auth/account.service";
import {Router} from "@angular/router";
import {TownCrierService} from "../../../../services/town-crier.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  public formGroup: FormGroup;
  public inputType: string = "password";
  hide = true;
  roles = ['Developer', 'User', 'Guest'];


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
    debugger;
    if (email != null && password != null) {
      this.auth.createUserWithEmailAndPassword(email, password)
        .then(user => {
          this.sendEmail();

          this.accountService.registerNewUser(user.user?.email!, user.user?.uid!, name, phoneNumber, role).subscribe(result => {
            console.log("result: ", result);
            if (result) {
              this.townCrier.info('Registration successful!');
              setInterval(() => {
                this.router.navigate(['/login']);
              }, 5000);
            } else {
              //TODO: need to delete it from firebase
              this.townCrier.error('Registration failed!');

            }
          })
        })
        .catch(error => {
          this.townCrier.error('Registration failed ! ' +  error);
        });
    } else {
      this.townCrier.error("Make sure that fill all fields");
    }
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
  sendEmail() {
    this.auth.currentUser.then((u) => {
      //If a user is successfully created with an appropriate email
      if (u != null){
        u?.sendEmailVerification();
      }
    }).catch(error => {
      this.townCrier.error('could not send email verification ' +  error);
    });
  }
}
