import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NfsMonthYearFindComponent } from './nfs-month-year-find.component';

describe('NfsMonthYearFindComponent', () => {
  let component: NfsMonthYearFindComponent;
  let fixture: ComponentFixture<NfsMonthYearFindComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NfsMonthYearFindComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NfsMonthYearFindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
