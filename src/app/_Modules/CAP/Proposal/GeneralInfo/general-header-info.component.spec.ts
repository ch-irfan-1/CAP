import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralHeaderInfoComponent } from './general-header-info.component';

describe('GeneralHeaderInfoComponent', () => {
  let component: GeneralHeaderInfoComponent;
  let fixture: ComponentFixture<GeneralHeaderInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralHeaderInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralHeaderInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
