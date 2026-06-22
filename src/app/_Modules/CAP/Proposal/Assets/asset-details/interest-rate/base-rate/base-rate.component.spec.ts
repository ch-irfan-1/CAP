import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseRateComponent } from './base-rate.component';

describe('BaseRateComponent', () => {
  let component: BaseRateComponent;
  let fixture: ComponentFixture<BaseRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseRateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
