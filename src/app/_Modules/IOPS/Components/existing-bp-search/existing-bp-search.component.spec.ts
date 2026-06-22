import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingBpSearchComponent } from './existing-bp-search.component';

describe('ExistingBpSearchComponent', () => {
  let component: ExistingBpSearchComponent;
  let fixture: ComponentFixture<ExistingBpSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExistingBpSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingBpSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
