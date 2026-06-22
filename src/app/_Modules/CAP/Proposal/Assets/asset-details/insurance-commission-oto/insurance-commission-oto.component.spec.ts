import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceCommissionOTOComponent } from './insurance-commission-oto.component';

describe('InsuranceCommissionOTOComponent', () => {
  let component: InsuranceCommissionOTOComponent;
  let fixture: ComponentFixture<InsuranceCommissionOTOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceCommissionOTOComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceCommissionOTOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
