import { Injectable } from '@angular/core';
import { environment } from '../Environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Work, WorkDetail, CreateWork, UpdateWork, User } from '../Models/work.model';

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

  getWorkDetail(workID: string): Observable<WorkDetail> {
    return this.http.get<WorkDetail>(`${this.restApiUrl}/Work/${workID}/Detail`);
  }

  getUserWorks(userID: string): Observable<Work[]> {
    return this.http.get<Work[]>(`${this.restApiUrl}/Work/GetUserWorks/${userID}`);
  }

  createWork(work: CreateWork): Observable<{ workID: string }> {
    return this.http.post<{ workID: string }>(`${this.restApiUrl}/Work/CreateWork`, work);
  }

  updateWork(work: UpdateWork) {
    return this.http.put(`${this.restApiUrl}/Work/UpdateWork`, work);
  }

  deleteWork(workID: string) {
    return this.http.delete(`${this.restApiUrl}/Work/DeleteWork/${workID}`);
  }

  // Versions (Later)
  // getWorkVersions(id: number, limit: number = 20): Observable<WorkVersion[]> {
  //   return this.http.get<WorkVersion[]>(`${this.baseUrl}/${id}/versions?limit=${limit}`);
  // }

  // Members
  getMembers(workID: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.restApiUrl}/Work/${workID}/Members`);
  }

  addMember(workID: string, userID: string): Observable<any> {
    return this.http.post(`${this.restApiUrl}/Work/AddWorkMember`, { workID, userID });
  }

  removeMember(workID: string, userID: string): Observable<any> {
    return this.http.post(`${this.restApiUrl}/Work/DeleteWorkMember`, { workID, userID });
  }
}
