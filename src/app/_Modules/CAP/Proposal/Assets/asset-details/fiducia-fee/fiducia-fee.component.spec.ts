import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiduciaFeeComponent } from './fiducia-fee.component';

describe('FiduciaFeeComponent', () => {
  let component: FiduciaFeeComponent;
  let fixture: ComponentFixture<FiduciaFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiduciaFeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiduciaFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
