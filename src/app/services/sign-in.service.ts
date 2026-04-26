import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignInService {

  restApiUrl: string = 'https://localhost:44322/api';

  constructor() { }
}
