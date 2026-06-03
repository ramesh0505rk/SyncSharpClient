import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { WorkRealtimeService } from '../services/work-realtime.service';
import { WorkService } from '../services/work.service';
import { UserDetails, UserDetailsService } from '../services/user-details.service';
import { ActiveUser, UpdateWork, WorkDetail } from '../Models/work.model';
import { debounceTime, Subject } from 'rxjs';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-work-editor',
  standalone: true,
  imports: [MonacoEditorModule, CommonModule, FormsModule],
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

  // Monaco editor instance reference
  monacoEditor: any;

  // Monoco editor object
  editorOptions: any;

  // Subjects for real-time events
  private codeChange$ = new Subject<string>();
  private cursorChange$ = new Subject<number>();
  private autoSaveInterval: any;

  constructor(private workRealitimeService: WorkRealtimeService, private workService: WorkService,
    private userDetailsService: UserDetailsService) { }

  onEditorInit(editor: any) {
    this.monacoEditor = editor;

    const monacoGlobal = (window as any).monaco;

    monacoGlobal.editor.defineTheme('myTheme', {
      base: 'vs-dark', // based on vs-dark
      inherit: true,   // inherit all vs-dark rules
      rules: [],
      colors: {
        'editor.background': '#111111', // your custom background
        'editor.lineHighlightBackground': '#161b22',
        'editorLineNumber.activeForeground': '#a6aaf8', // current line number
        'editorLineNumber.foreground': '#4a4a4a',
        'editorCursor.foreground': '#a6aaf8',


        // Search/Find matches (later)
        // 'editor.findMatchBackground': '#a6aaf8',
        // 'editor.findMatchHighlightBackground': '#f6b73c30',

        // 'scrollbarSlider.background': '#a6aaf8da',
        // 'scrollbarSlider.hoverBackground': '#a6aaf8aa',
        // 'scrollbarSlider.activeBackground': '#a6aaf8aa',

        // Later
        // Indent guides (the vertical lines)
        // 'editorIndentGuide.background': '#a6aaf8',
        // 'editorIndentGuide.activeBackground': '#a6aaf8',

        // Brackets matching highlight
        // 'editorBracketMatch.background': '#264f7850',
        // 'editorBracketMatch.border': '#264f78',

        // Suggestions/Autocomplete popup
        // 'editorSuggestWidget.background': '#1e1e1e',
        // 'editorSuggestWidget.border': '#3a3a3a',
        // 'editorSuggestWidget.selectedBackground': '#264f78',

        // Errors and warnings underline
        // 'editorError.foreground': '#ff5555',
        // 'editorWarning.foreground': '#f6b73c',
      }
    });

    monacoGlobal.editor.setTheme('myTheme');
  }

  ngOnInit(): void {

    const language = history.state.language;
    this.editorOptions = {
      theme: 'vs-dark',
      language: language,
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 14,
      lineNumbers: true,
      dragAndDrop: true
    }

    // console.log('WorkEditorComponent initialized with workID:', this.workID);
    this.userDetails = this.userDetailsService.userDetails;

    // Connect to signalR hub
    this.workRealitimeService.startConnection().then(() => {
      // Subscribe to real-time events
      this.subscribeToRealtimeWorkEvents();
      this.workRealitimeService.joinWork(this.workID, this.userDetails?.UserID as string, this.userDetails?.UserName as string);
    });

    // Debounce code & cursor changes
    this.codeChange$.pipe(debounceTime(300)).subscribe(code => {
      this.workRealitimeService.updateCode(this.workID, code, this.cursorPosition);
    });

    this.cursorChange$.pipe(debounceTime(300)).subscribe(position => {
      const lineNumber = this.calculateLineNumber(position);
      this.workRealitimeService.updateCursor(this.workID, position, lineNumber);
    });

    this.autoSaveInterval = setInterval(() => {

    }, 30000) // Auto-save every 30 seconds
  }

  subscribeToRealtimeWorkEvents() {
    // Work loaded from server
    this.workRealitimeService.workLoaded$.subscribe(data => {
      this.work = data;
      this.currentCode = data.code;
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
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }

    this.workRealitimeService.leaveWork(this.workID, this.userDetails?.UserID as string, this.userDetails?.UserName as string);
    // this.workRealitimeService.stopConnection();
  }

  showEditorOptions() {
    console.log('Editor options: ', this.editorOptions);
  }
}
