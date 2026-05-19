import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription, timer } from 'rxjs';
import { UserDetails, UserDetailsService } from './user-details.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenExpirationTimer: Subscription | null = null;
  public isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor(private router: Router, private userDetailsService: UserDetailsService) {
    this.checkAuthStatus();
  }

  checkAuthStatus() {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const isValid = this.isTokenValid(token);
      this.isAuthenticatedSubject.next(isValid);

      if (isValid) {
        this.setAutoLogoutAndUserDetails(token);
      }
      else {
        this.logout();
      }
    }
    else {
      this.isAuthenticatedSubject.next(false);
    }
  }

  isTokenValid(token: string) {
    try {
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));

      const expirationTime = payload.exp * 1000;
      return expirationTime > Date.now();
    }
    catch (err) {
      console.error('Error parsing the access token');
      return false;
    }
  }

  setAutoLogoutAndUserDetails(token: string) {
    if (this.tokenExpirationTimer)
      this.tokenExpirationTimer.unsubscribe();

    try {
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));
      const expirationTime = payload.exp * 1000;

      const timeUntilExpire = expirationTime - Date.now();

      const userDetails: UserDetails = {
        UserID: payload.UserID,
        UserName: payload.UserName,
        FirstName: payload.FirstName,
        LastName: payload.LastName,
        Email: payload.Email
      }

      this.userDetailsService.setUserDetails(userDetails);

      if (timeUntilExpire <= 0) {
        this.logout();
        return;
      }

      this.tokenExpirationTimer = timer(timeUntilExpire).subscribe(() => {
        console.log('Token expired, logging out');
        this.logout();
      })
    }
    catch (err) {
      console.error('Error setting auto logout');
    }
  }

  logout() {
    localStorage.removeItem('accessToken');
    this.isAuthenticatedSubject.next(false);
    this.userDetailsService.setUserDetails(null);

    if (this.tokenExpirationTimer) {
      this.tokenExpirationTimer.unsubscribe();
      this.tokenExpirationTimer = null;
    }
    this.router.navigate(['/signin']);
  }
}
