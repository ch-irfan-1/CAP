import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalAdminFeeComponent } from './total-admin-fee.component';

describe('TotalAdminFeeComponent', () => {
  let component: TotalAdminFeeComponent;
  let fixture: ComponentFixture<TotalAdminFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalAdminFeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalAdminFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
