import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalSecurityDepositComponent } from './total-security-deposit.component';

describe('TotalSecurityDepositComponent', () => {
  let component: TotalSecurityDepositComponent;
  let fixture: ComponentFixture<TotalSecurityDepositComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalSecurityDepositComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalSecurityDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
