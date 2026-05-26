import { Component, Input, OnInit } from '@angular/core';
import { WorkRealtimeService } from '../services/work-realtime.service';
import { WorkService } from '../services/work.service';
import { UserDetails, UserDetailsService } from '../services/user-details.service';
import { ActiveUser, WorkDetail } from '../Models/work.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-work-editor',
  standalone: true,
  imports: [],
  templateUrl: './work-editor.component.html',
  styleUrl: './work-editor.component.scss'
})
export class WorkEditorComponent implements OnInit {
  @Input() workID!: string;

  userDetails: UserDetails | null = null;

  // Work details
  work: WorkDetail | null = null;
  currentCode: string = '';
  cursorPosition: number = 0;

  // Active users
  activeUsers: ActiveUser[] = [];

  // Monoco editor object
  editorOptions = {
    theme: 'vs-dark',
    language: 'javascript',
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on'
  }

  // Subjects for real-time events
  private codeChange$ = new Subject<string>();
  private cursorChange$ = new Subject<number>();
  private autoSaveInterval: any;

  constructor(private workRealitimeService: WorkRealtimeService, private workService: WorkService,
    private userDetailsService: UserDetailsService) { }

  ngOnInit(): void {
    // console.log('WorkEditorComponent initialized with workID:', this.workID);
    this.userDetails = this.userDetailsService.userDetails;

    this.workRealitimeService.startConnection();


  }

  subscribeToRealTimeWorkEvents() {
    // Work loaded from server
    this.workRealitimeService.workLoaded$.subscribe(data => {
      this.work = data;
      this.currentCode = data.code;
      this.editorOptions = { ...this.editorOptions, language: data.language };
    })

    // Code updated by other users
    this.workRealitimeService.codeUpdated$.subscribe(data => {
      if (data.updatedBy !== this.userDetails?.UserID) {
        this.currentCode = data.code;
      }
    })
  }
}
