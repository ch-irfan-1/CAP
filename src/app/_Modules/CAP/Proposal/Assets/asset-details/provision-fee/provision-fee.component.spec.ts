import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisionFeeComponent } from './provision-fee.component';

describe('ProvisionFeeComponent', () => {
  let component: ProvisionFeeComponent;
  let fixture: ComponentFixture<ProvisionFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvisionFeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvisionFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
