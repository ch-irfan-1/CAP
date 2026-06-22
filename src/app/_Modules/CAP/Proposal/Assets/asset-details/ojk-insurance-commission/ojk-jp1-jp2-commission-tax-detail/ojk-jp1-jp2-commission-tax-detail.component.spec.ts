import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OJKJP1JP2CommissionTaxDetailComponent } from './ojk-jp1-jp2-commission-tax-detail.component';

describe('OJKJP1JP2CommissionTaxDetailComponent', () => {
  let component: OJKJP1JP2CommissionTaxDetailComponent;
  let fixture: ComponentFixture<OJKJP1JP2CommissionTaxDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OJKJP1JP2CommissionTaxDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OJKJP1JP2CommissionTaxDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
