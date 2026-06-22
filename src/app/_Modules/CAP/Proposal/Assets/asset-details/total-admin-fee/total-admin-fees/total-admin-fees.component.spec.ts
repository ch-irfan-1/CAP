import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalAdminFeesComponent } from './total-admin-fees.component';

describe('TotalAdminFeesComponent', () => {
  let component: TotalAdminFeesComponent;
  let fixture: ComponentFixture<TotalAdminFeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalAdminFeesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalAdminFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
