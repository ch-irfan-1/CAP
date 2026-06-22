import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepaymentPlanComponent } from './repayment-plan.component';

describe('RepaymentPlanComponent', () => {
  let component: RepaymentPlanComponent;
  let fixture: ComponentFixture<RepaymentPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepaymentPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepaymentPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
