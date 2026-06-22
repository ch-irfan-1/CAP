import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalAcquisitionIncomeComponent } from './total-acquisition-income.component';

describe('TotalAcquisitionIncomeComponent', () => {
  let component: TotalAcquisitionIncomeComponent;
  let fixture: ComponentFixture<TotalAcquisitionIncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalAcquisitionIncomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalAcquisitionIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
