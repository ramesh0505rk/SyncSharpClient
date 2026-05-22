import { TestBed } from '@angular/core/testing';

import { WorkRealtimeService } from './work-realtime.service';

describe('WorkRealtimeService', () => {
  let service: WorkRealtimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkRealtimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
