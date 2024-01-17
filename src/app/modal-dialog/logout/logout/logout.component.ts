import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css'],
})
export class LogoutComponent {
  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<LogoutComponent>,
    private router: Router
  ) {}

  onLogout(): void {
    console.log('onLogout method in LogoutComponent triggered');
    this.authService.logout();
    this.router.navigate(['/signin']);
    this.dialogRef.close();
  }
  
}
