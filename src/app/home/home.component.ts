import { Component, Input, OnInit } from '@angular/core';
import { UserDetails, UserDetailsService } from '../services/user-details.service';
import { Router, RouterOutlet } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateWorkComponent } from '../create-work/create-work.component';
import { WorkDetailsService } from '../services/work-details.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private btns!: NodeListOf<HTMLButtonElement>;
  private bubble!: HTMLElement | null;
  userDetails: UserDetails | null = null;
  profileLetter: string = '';

  constructor(private userDetailsService: UserDetailsService, private router: Router, 
    private modalService: NgbModal, private workDetailsService: WorkDetailsService) {
  }

  ngOnInit(): void {
    this.btns = document.querySelectorAll('.tab-btn');
    this.bubble = document.getElementById('bubble');

    this.btns.forEach((btn, i) => {
      btn.addEventListener('click', () => { this.moveBubble(i) });
    })

    window.addEventListener('load', () => { this.moveBubble(0) });
    setTimeout(() => this.moveBubble(0), 50);

    // Subscribe to user details
    this.userDetails = this.userDetailsService.userDetails;
    this.profileLetter = this.userDetails?.FirstName.charAt(0).toUpperCase() || '';
  }

  moveBubble(index: number) {
    const btn = this.btns[index];
    const container = btn.parentElement;
    const containerRect = container?.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    this.bubble!.style.left = `${btnRect.left - containerRect!.left}px`;
    this.bubble!.style.width = `${btnRect.width}px`;

    this.btns.forEach((b, i) => {
      b.style.fontWeight = i === index ? '500' : '400';
      b.style.color = i === index ? '#FFFFFF' : '#FBFBFB';
    })
  }

  onClickSyncSharp() {
    this.router.navigate(['/']);
  }

  onCreateWork() {
    const modalRef = this.modalService.open(CreateWorkComponent, {
      size: 'lg',
      keyboard: false
    })

    modalRef.componentInstance.userID = this.userDetails?.UserID || '';

    modalRef.result.then((result) => {
      if (result === 'created') {
        this.workDetailsService.setLoadWorkList(true);
      }
    });
  }
}
