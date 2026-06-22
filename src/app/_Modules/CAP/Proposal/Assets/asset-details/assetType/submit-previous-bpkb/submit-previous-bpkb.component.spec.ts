import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitPreviousBPKBComponent } from './submit-previous-bpkb.component';

describe('SubmitPreviousBPKBComponent', () => {
  let component: SubmitPreviousBPKBComponent;
  let fixture: ComponentFixture<SubmitPreviousBPKBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitPreviousBPKBComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitPreviousBPKBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
