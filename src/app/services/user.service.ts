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

  getTokenBySignIn(UserName: string, Password: string) {
    var request = { UserName, Password };

    return this.http.post(`${this.restApiUrl}/User/SignIn`, request)
      .pipe(
        catchError(err => {
          return throwError(() => err);
        })
      )
  }

  getTokenBySignUp(UserName: string, FirstName: string, LastName: string, Email: string, Password: string) {
    var request = { UserName, FirstName, LastName, Email, Password };

    return this.http.post(`${this.restApiUrl}/User/SignUp`, request)
      .pipe(
        catchError(err => {
          return throwError(() => err);
        })
      )
  }

  userNameExists(UserName: string) {
    return this.http.get(`${this.restApiUrl}/User/Exists?UserName=${UserName}`)
      .pipe(
        catchError(err => {
          return throwError(() => err);
        })
      );
  }
}
