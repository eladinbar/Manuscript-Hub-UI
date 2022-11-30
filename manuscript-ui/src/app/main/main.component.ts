import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  sidenavWidth = 18;

  sidenavStatus = true;


  constructor() { }

  ngOnInit(): void {
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



}
