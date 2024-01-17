import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = false;

  private apiUrl = 'http://localhost:3000/api';
  private tokenKey = 'authToken'; 

  constructor(private http: HttpClient) {}

  checkSession(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.isLoggedIn = true;
    }
  }

  signUp(userData: any): Observable<any> {
    const signUpUrl = `${this.apiUrl}/signup`;
    return this.http
      .post<any>(signUpUrl, userData)
      .pipe(catchError(this.handleError));
  }

  login(userData: any): Observable<any> {
    const loginUrl = `${this.apiUrl}/login`;
    return this.http.post<any>(loginUrl, userData).pipe(
      catchError(this.handleError),
      tap((response) => {
        if (response && response.token) {
          // Store token in localStorage upon successful login
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem('userData', JSON.stringify(response.user));
          this.isLoggedIn = true;
        }
      })
    );
  }

  logout(): void {
    console.log('Logout method in AuthService triggered');
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('userData');
    this.isLoggedIn = false;
    // this.checkSession();
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError('Something went wrong; please try again later.');
  }
}
