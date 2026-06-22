import { TestBed } from '@angular/core/testing';

import { ProposalEntityFormService } from './ProposalEntityForm.service';

describe('ProposalEntityFormService', () => {
  let service: ProposalEntityFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProposalEntityFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
