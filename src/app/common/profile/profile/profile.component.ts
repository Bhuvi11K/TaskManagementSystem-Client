import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  userData: any = {};

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData(): void {
    const userDataString = localStorage.getItem('userData');

    if (userDataString !== null) {
      this.userData = JSON.parse(userDataString);
    } else {
      this.userData = {};
    }
  }
}
