import { TestBed } from '@angular/core/testing';

import { WorkQueueHelperService } from './work-queue-helper.service';

describe('WorkQueueHelperService', () => {
  let service: WorkQueueHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkQueueHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
