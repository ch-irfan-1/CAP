import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BBNChargesComponent } from './bbn-charges.component';

describe('BBNChargesComponent', () => {
  let component: BBNChargesComponent;
  let fixture: ComponentFixture<BBNChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BBNChargesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BBNChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
