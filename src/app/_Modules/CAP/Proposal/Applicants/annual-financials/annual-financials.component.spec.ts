import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualFinancialsComponent } from './annual-financials.component';

describe('AnnualFinancialsComponent', () => {
  let component: AnnualFinancialsComponent;
  let fixture: ComponentFixture<AnnualFinancialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnualFinancialsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualFinancialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
