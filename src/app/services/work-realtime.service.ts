import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../Environments/environment';
import { Subject } from 'rxjs';
import { ActiveUser } from '../Models/work.model';

@Injectable({
  providedIn: 'root'
})
export class WorkRealtimeService {
  baseUrl: string = environment.baseUrl;
  private hubConnection!: signalR.HubConnection;
  private isConnected: boolean = false;

  // Observables for real-time events
  public workLoaded$ = new Subject<any>();
  public codeUpdated$ = new Subject<{ code: string; cursorPosition: number; updatedBy: string }>();
  public userJoined$ = new Subject<{ userID: string; username: string; connectionID: string }>();
  public userLeft$ = new Subject<{ userID: string; username: string; connectionID: string }>();
  public userDisconnected$ = new Subject<{ userID: string; username: string; workID: string }>();
  public activeUsers$ = new Subject<ActiveUser>();
  public cursorMoved$ = new Subject<{ connectionID: string; cursorPosition: number; lineNumber: number }>();
  public snapshotSaved$ = new Subject<{ workID: string; savedBy: string }>();
  public error$ = new Subject<string>();

  constructor() { }

  public startConnection(): Promise<void> {
    if (this.isConnected) {
      return Promise.resolve();
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.baseUrl}/workhub`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();

    return this.hubConnection.start()
      .then(() => {
        this.isConnected = true;
        this.registerHandlers();
        console.log('SignalR connection started');
      })
      .catch(err => {
        this.isConnected = false;
        console.error('Error while starting SignalR connection: ', err);
      })
  }

  // Register all signalR event handlers here
  private registerHandlers() {
    // Work loaded
    this.hubConnection.on('WorkLoaded', (data) => {
      this.workLoaded$.next(data);
    });

    // Code updated by another user
    this.hubConnection.on('CodeUpdated', (data) => {
      this.codeUpdated$.next(data);
    });

    // User joined
    this.hubConnection.on('UserJoined', (data) => {
      this.userJoined$.next(data);
    });

    // User left
    this.hubConnection.on('UserLeft', (data) => {
      this.userLeft$.next(data);
    });

    // User disconnected
    this.hubConnection.on('UserDisconnected', (data) => {
      this.userDisconnected$.next(data);
    });

    // Active users list
    this.hubConnection.on('ActiveUsers', (data) => {
      this.activeUsers$.next(data);
    });

    // Cursor moved
    this.hubConnection.on('CursorMoved', (data) => {
      this.cursorMoved$.next(data);
    });

    // Snapshot saved
    this.hubConnection.on('SnapshotSaved', (data) => {
      this.snapshotSaved$.next(data);
    });

    // Error
    this.hubConnection.on('Error', (message) => {
      this.error$.next(message);
    })
  }

  // Join a work
  public joinWork(workID: string, userID: string, username: string) {
    if (!this.isConnected) {
      console.error('Cannot join work - SignalR connection is not established');
      return;
    }

    this.hubConnection.invoke('JoinWork', workID, userID, username)
      .catch(err => console.error('Error while joining work: ', err));
  }

  // Send code update real-time
  public updateCode(workID: string, code: string, cursorPosition: number) {
    if (!this.isConnected) return;

    this.hubConnection.invoke('UpdateCode', workID, code, cursorPosition)
      .catch(err => console.error('Error while updating code: ', err));
  }

  // Save snapshot (manual or auto-save)
  public saveSnapshot(workID: string, code: string, userID: string, description: string) {
    if (!this.isConnected) return;

    this.hubConnection.invoke('SaveSnapshot', workID, code, userID, description)
      .catch(err => console.error('Error while saving snapshot: ', err));
  }

  // Update cursor position
  public updateCursor(workID: string, cursorPosition: number, lineNumber: number) {
    if (!this.isConnected) return;

    this.hubConnection.invoke('UpdateCursor', workID, cursorPosition, lineNumber)
      .catch(err => console.error('Error while updating cursor position: ', err));
  }

  // Leave work
  public leaveWork(workID: string, userID: string, username: string) {
    if (!this.isConnected) return;

    this.hubConnection.invoke('LeaveWork', workID, userID, username)
      .catch(err => console.error('Error while leaving work: ', err));
  }

  // Stop connection
  public stopConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop();
      this.isConnected = false;
      console.log('SignalR connection stopped');
    }
  }
}
