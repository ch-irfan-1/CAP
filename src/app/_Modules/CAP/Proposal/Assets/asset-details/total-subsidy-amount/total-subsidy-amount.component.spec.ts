import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalSubsidyAmountComponent } from './total-subsidy-amount.component';

describe('TotalSubsidyAmountComponent', () => {
  let component: TotalSubsidyAmountComponent;
  let fixture: ComponentFixture<TotalSubsidyAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalSubsidyAmountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalSubsidyAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
