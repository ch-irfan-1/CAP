import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelleadComponent } from './cancellead.component';

describe('CancelleadComponent', () => {
  let component: CancelleadComponent;
  let fixture: ComponentFixture<CancelleadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelleadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelleadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
