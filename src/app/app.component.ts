import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Task-Management-System';
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.checkToken();
    this.authService.checkSession();
  }

  checkToken(): void {
    const token = localStorage.getItem('authToken');

    if (token) {
      console.log('Token exists:', token);
    } else {
      console.log('Token does not exist');
    }
  }
}
