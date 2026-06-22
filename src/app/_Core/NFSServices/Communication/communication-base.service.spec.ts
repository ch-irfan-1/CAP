import { TestBed } from '@angular/core/testing';

import { CommunicationBaseService } from './communication-base.service';

describe('CommunicationBaseService', () => {
  let service: CommunicationBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommunicationBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
