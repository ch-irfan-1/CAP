import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyFeeComponent } from './policy-fee.component';

describe('PolicyFeeComponent', () => {
  let component: PolicyFeeComponent;
  let fixture: ComponentFixture<PolicyFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicyFeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
