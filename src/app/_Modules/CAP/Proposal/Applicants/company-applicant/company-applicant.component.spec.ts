import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyApplicantComponent } from './company-applicant.component';

describe('CompanyApplicantComponent', () => {
  let component: CompanyApplicantComponent;
  let fixture: ComponentFixture<CompanyApplicantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyApplicantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyApplicantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
