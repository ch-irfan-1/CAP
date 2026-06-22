import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JP1JP2CommissionTaxDetailComponent } from './jp1-jp2-commission-tax-detail.component';

describe('JP1JP2CommissionTaxDetailComponent', () => {
  let component: JP1JP2CommissionTaxDetailComponent;
  let fixture: ComponentFixture<JP1JP2CommissionTaxDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JP1JP2CommissionTaxDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JP1JP2CommissionTaxDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
