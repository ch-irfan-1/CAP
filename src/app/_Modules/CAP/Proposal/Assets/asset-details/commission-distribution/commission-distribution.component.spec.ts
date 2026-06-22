import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionDistributionComponent } from './commission-distribution.component';

describe('CommissionDistributionComponent', () => {
  let component: CommissionDistributionComponent;
  let fixture: ComponentFixture<CommissionDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommissionDistributionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommissionDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
