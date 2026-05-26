import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkDetailsService {

  private loadWorkList = new BehaviorSubject<boolean>(false);
  loadWorkList$ = this.loadWorkList.asObservable();

  constructor() { }

  setLoadWorkList(value: boolean) {
    this.loadWorkList.next(value);
  }
}
