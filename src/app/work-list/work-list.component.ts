import { Component, OnInit } from '@angular/core';
import { WorkService } from '../services/work.service';
import { WorkRealtimeService } from '../services/work-realtime.service';
import { Work } from '../Models/work.model';
import { UserDetailsService } from '../services/user-details.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WorkDetailsService } from '../services/work-details.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-work-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './work-list.component.html',
  styleUrl: './work-list.component.scss'
})
export class WorkListComponent implements OnInit {

  workList: Work[] = [];

  constructor(private userDetailsService: UserDetailsService, private workService: WorkService,
    private workRealtimeService: WorkRealtimeService, private workDetailsService: WorkDetailsService,
    private router: Router) { }

  ngOnInit(): void {
    this.loadWorkList();
    this.workDetailsService.loadWorkList$.subscribe(load => {
      if (load) {
        this.loadWorkList();
        this.workDetailsService.setLoadWorkList(false);
      }
    });
  }

  loadWorkList() {
    // Fetch user's works
    this.workService.getUserWorks(this.userDetailsService.userDetails!.UserID).subscribe({
      next: (response) => {
        if (response.success) {
          this.workList = response.data;
          console.log('Fetched user works:', this.workList);
        } else {
          console.error('Error fetching user works:', response.responseMessage);
        }
      },
      error: (err) => {
        console.error('Error fetching user works:', err);
      }
    });
  }

  loadWork(workID: string) {
    this.router.navigate(['/work', workID]);
  }
}
