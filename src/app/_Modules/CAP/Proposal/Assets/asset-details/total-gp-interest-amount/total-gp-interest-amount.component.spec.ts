import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalGPInterestAmountComponent } from './total-gp-interest-amount.component';

describe('TotalGPInterestAmountComponent', () => {
  let component: TotalGPInterestAmountComponent;
  let fixture: ComponentFixture<TotalGPInterestAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalGPInterestAmountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalGPInterestAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
