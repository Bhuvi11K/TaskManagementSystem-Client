import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { NotificationService } from '../notification.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnDestroy {
  loginForm!: FormGroup;
  isLoading = false;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService, 
    private notificationService: NotificationService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm && this.loginForm.valid) {
      this.isLoading = true;
      const loginData = this.loginForm.value;

      this.authService
      .login(loginData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (response) => {
          console.log('User logged in successfully', response);
         // Check if the token and user data are received in the response
        // Log user data and token to the console
        if (response && response.token && response.user) {
          console.log('Received Token:', response.token);
          console.log('User Data:', response.user);
          this.router.navigate(['/dashboard']);
        }
        // Reset form and navigate to the next page
        this.loginForm.reset();
        this.isLoading = false;
        },
        (error) => {
          console.error('Error during login', error);
          this.isLoading = false;
        
          if (error.status === 401) {
            if (error.error.error === 'Invalid Email') {
              this.notificationService.showNotification('Email not found');
            } else if (error.error.error === 'Incorrect Password') {
              this.notificationService.showNotification('Incorrect password');
            }
          } else {
            this.notificationService.showNotification('Something went wrong; please try again later.');
          }
        }          
      );
    }
  }

  onLogout() {
    // Call logout method from AuthService on logout action
    this.authService.logout();
    // Check if the token was removed from localStorage
    const tokenAfterLogout = localStorage.getItem('authToken');
    console.log('Token After Logout:', tokenAfterLogout); // Should log null or undefined
    // Perform any additional logout actions if needed
  }
  
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
