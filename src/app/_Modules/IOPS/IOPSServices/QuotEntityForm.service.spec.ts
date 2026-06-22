import { TestBed } from '@angular/core/testing';

import { QuotEntityFormService } from './QuotEntityForm.service';

describe('QuotEntityFormService', () => {
  let service: QuotEntityFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuotEntityFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
