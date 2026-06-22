import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerPOAmountComponent } from './dealer-po-amount.component';

describe('DealerPOAmountComponent', () => {
  let component: DealerPOAmountComponent;
  let fixture: ComponentFixture<DealerPOAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerPOAmountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerPOAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
