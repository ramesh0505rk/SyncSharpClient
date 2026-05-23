import { Injectable } from '@angular/core';
import { environment } from '../Environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Work, WorkDetail } from '../Models/work.model';

@Injectable({
  providedIn: 'root'
})
export class WorkService {
  restApiUrl: string = environment.restApiUrl;

  constructor(private readonly http: HttpClient) { }

  // WORKS CRUD
  getWorkByID(workID: string): Observable<Work> {
    return this.http.get<Work>(`${this.restApiUrl}/Work/${workID}`);
  }

  getWorkDetail(workID: string) {
    return this.http.get<WorkDetail>(`${this.restApiUrl}/Work/${workID}/Detail`);
  }
}
