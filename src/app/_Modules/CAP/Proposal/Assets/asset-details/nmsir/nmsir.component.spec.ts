import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NMSIRComponent } from './nmsir.component';

describe('NMSIRComponent', () => {
  let component: NMSIRComponent;
  let fixture: ComponentFixture<NMSIRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NMSIRComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NMSIRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
