import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LogoutComponent } from '../modal-dialog/logout/logout/logout.component';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  constructor(public dialog: MatDialog,public authService: AuthService) {}

  openLogoutDialog() {
    const dialogRef = this.dialog.open(LogoutComponent, {
      width: '300px',
    });
  }
}
