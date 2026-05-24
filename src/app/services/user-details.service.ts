import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {
  userDetails: UserDetails | null = null;

  setUserDetails(details: UserDetails | null) {
    this.userDetails = details;
  }
}

export interface UserDetails {
  UserID: string;
  UserName: string;
  FirstName: string;
  LastName: string;
  Email: string;
}