import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IOPSCustomerInfoComponent } from './iopscustomer-info.component';

describe('IOPSCustomerInfoComponent', () => {
  let component: IOPSCustomerInfoComponent;
  let fixture: ComponentFixture<IOPSCustomerInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IOPSCustomerInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IOPSCustomerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
