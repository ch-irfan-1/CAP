import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OJKInsuranceCommissionComponent } from './ojk-insurance-commission.component';

describe('OJKInsuranceCommissionComponent', () => {
  let component: OJKInsuranceCommissionComponent;
  let fixture: ComponentFixture<OJKInsuranceCommissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OJKInsuranceCommissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OJKInsuranceCommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
