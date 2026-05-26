import { TestBed } from '@angular/core/testing';

import { WorkDetailsService } from './work-details.service';

describe('WorkDetailsService', () => {
  let service: WorkDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
