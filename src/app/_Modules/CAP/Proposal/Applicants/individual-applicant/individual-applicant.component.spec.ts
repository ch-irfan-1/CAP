import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualApplicantComponent } from './individual-applicant.component';

describe('IndividualApplicantComponent', () => {
  let component: IndividualApplicantComponent;
  let fixture: ComponentFixture<IndividualApplicantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualApplicantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualApplicantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
