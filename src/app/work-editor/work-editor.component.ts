import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { WorkRealtimeService } from '../services/work-realtime.service';
import { WorkService } from '../services/work.service';
import { UserDetails, UserDetailsService } from '../services/user-details.service';
import { ActiveUser, UpdateWork, WorkDetail } from '../Models/work.model';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-work-editor',
  standalone: true,
  imports: [],
  templateUrl: './work-editor.component.html',
  styleUrl: './work-editor.component.scss'
})
export class WorkEditorComponent implements OnInit, OnDestroy {
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

    // Connect to signalR hub
    this.workRealitimeService.startConnection();

    // Subscribe to real-time events
    this.subscribeToRealtimeWorkEvents();

    // Debounce code & cursor changes
    this.codeChange$.pipe(debounceTime(300)).subscribe(code => {
      this.workRealitimeService.updateCode(this.workID, code, this.cursorPosition);
    });

    this.cursorChange$.pipe(debounceTime(300)).subscribe(position => {
      const lineNumber = this.calculateLineNumber(position);
      this.workRealitimeService.updateCursor(this.workID, position, lineNumber);
    });

    this.workRealitimeService.joinWork(this.workID, this.userDetails?.UserID as string, this.userDetails?.UserName as string);

    this.autoSaveInterval = setInterval(() => {

    }, 30000) // Auto-save every 30 seconds
  }

  subscribeToRealtimeWorkEvents() {
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

    // Active users list
    this.workRealitimeService.activeUsers$.subscribe(activeUsers => {
      this.activeUsers = activeUsers.filter(u => u.userID !== this.userDetails?.UserID);
    });

    // User joined
    this.workRealitimeService.userJoined$.subscribe(data => {
      if (data.userID != this.userDetails?.UserID) {
        this.activeUsers.push(data);
      }
    })

    // User left
    this.workRealitimeService.userLeft$.subscribe(data => {
      this.activeUsers = this.activeUsers.filter(u => u.connectionID != data.connectionID);
    })

    // Snapshot saved
    this.workRealitimeService.snapshotSaved$.subscribe(data => {

    })

    // Errors
    this.workRealitimeService.error$.subscribe(error => {

    })
  }

  onCodeChange(newCode: string) {
    this.currentCode = newCode;
    this.codeChange$.next(newCode);
  }

  onCursorChange(newPosition: number) {
    this.cursorPosition = newPosition;
    this.cursorChange$.next(newPosition);
  }

  saveWork() {
    const updateData: UpdateWork = {
      workID: this.workID,
      code: this.currentCode,
      language: this.work?.language as string,
      modifiedBy: this.userDetails?.UserID as string
    }

    this.workService.updateWork(updateData).subscribe({
      next: () => {
        this.workRealitimeService.saveSnapshot(this.workID, this.currentCode, this.userDetails?.UserID as string, 'Manual save');
      },
      error: (err) => {
        console.error('Error saving work: ', err);
      }
    });
  }

  calculateLineNumber(position: number): number {
    const textBeforeCursor = this.currentCode.substring(0, position);
    return (textBeforeCursor.match(/\n/g) || []).length + 1;
  }

  ngOnDestroy(): void {
  }
}
