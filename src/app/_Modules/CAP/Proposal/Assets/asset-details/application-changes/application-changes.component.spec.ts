import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationChangesComponent } from './application-changes.component';

describe('ApplicationChangesComponent', () => {
  let component: ApplicationChangesComponent;
  let fixture: ComponentFixture<ApplicationChangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationChangesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
