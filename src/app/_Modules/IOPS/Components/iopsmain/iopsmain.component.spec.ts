import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IOPSMainComponent } from './iopsmain.component';

describe('IOPSMainComponent', () => {
  let component: IOPSMainComponent;
  let fixture: ComponentFixture<IOPSMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IOPSMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IOPSMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
