import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  sidenavWidth = 18;
  public role?: string;
  sidenavStatus = true;


  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.role = localStorage.getItem("role")!
  }

  toggleSidenav() {
    if (this.sidenavStatus) {
      this.sidenavStatus = true;
    } else {
      this.sidenavStatus = true;
    }
    if (this.sidenavWidth === 4) {
      this.increase();
    } else {
      this.decrease();
    }
  }


  increase() {
    this.sidenavWidth = 18;
  }

  decrease() {
    this.sidenavWidth = 4;
  }


  signout() {
    this.authService.logout();
  }
}
