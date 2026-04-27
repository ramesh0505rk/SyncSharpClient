import { Injectable } from '@angular/core';
import { environment } from '../Environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  restApiUrl: string = environment.restApiUrl;
  constructor(private readonly http: HttpClient) { }

  getTokenBySignIn(Email: string, Password: string) {
    var request = { Email, Password };

    return this.http.post(`${this.restApiUrl}/User/SignIn`, request)
      .pipe(
        catchError(err => {
          return throwError(() => err);
        })
      )
  }

  getTokenBySignUp(FirstName: string, LastName: string, Email: string, Password: string) {
    var request = { FirstName, LastName, Email, Password };

    return this.http.post(`${this.restApiUrl}/User/SignUp`, request)
      .pipe(
        catchError(err => {
          return throwError(() => err);
        })
      )
  }
}
