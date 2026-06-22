import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NFSDatePickerComponent } from './nfs-datepicker.component';

describe('NFSDatePickerComponent', () => {
  let component: NFSDatePickerComponent;
  let fixture: ComponentFixture<NFSDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NFSDatePickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NFSDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
