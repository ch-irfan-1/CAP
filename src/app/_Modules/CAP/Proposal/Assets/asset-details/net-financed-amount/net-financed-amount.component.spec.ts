import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetFinancedAmountComponent } from './net-financed-amount.component';

describe('NetFinancedAmountComponent', () => {
  let component: NetFinancedAmountComponent;
  let fixture: ComponentFixture<NetFinancedAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetFinancedAmountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetFinancedAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
