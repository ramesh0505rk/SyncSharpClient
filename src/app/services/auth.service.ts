import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor() { }
}
