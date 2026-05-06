import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {

  private userDetailsSubject: BehaviorSubject<UserDetails | null> = new BehaviorSubject<UserDetails | null>(null);
  userDetails$ = this.userDetailsSubject.asObservable();

  setUserDetails(details: UserDetails | null) {
    this.userDetailsSubject.next(details);
  }
}

export interface UserDetails {
  UserID: string;
  FirstName: string;
  LastName: string;
  Email: string;
}