import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalFirstPaymentComponent } from './total-first-payment.component';

describe('TotalFirstPaymentComponent', () => {
  let component: TotalFirstPaymentComponent;
  let fixture: ComponentFixture<TotalFirstPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalFirstPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalFirstPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
