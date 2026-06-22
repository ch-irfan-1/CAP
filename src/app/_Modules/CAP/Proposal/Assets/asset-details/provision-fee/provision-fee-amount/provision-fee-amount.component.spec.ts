import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisionFeeAmountComponent } from './provision-fee-amount.component';

describe('ProvisionFeeAmountComponent', () => {
  let component: ProvisionFeeAmountComponent;
  let fixture: ComponentFixture<ProvisionFeeAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvisionFeeAmountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvisionFeeAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
