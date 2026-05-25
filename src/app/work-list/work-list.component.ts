import { Component, OnInit } from '@angular/core';
import { WorkService } from '../services/work.service';
import { WorkRealtimeService } from '../services/work-realtime.service';
import { Work } from '../Models/work.model';
import { UserDetailsService } from '../services/user-details.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-work-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './work-list.component.html',
  styleUrl: './work-list.component.scss'
})
export class WorkListComponent implements OnInit {

  workList: Work[] = [];

  constructor(private userDetailsService: UserDetailsService, private workService: WorkService, private workRealtimeService: WorkRealtimeService) { }

  ngOnInit(): void {
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
}
