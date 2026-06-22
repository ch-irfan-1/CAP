import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepresentativeShareholderComponent } from './representative-shareholder.component';

describe('RepresentativeShareholderComponent', () => {
  let component: RepresentativeShareholderComponent;
  let fixture: ComponentFixture<RepresentativeShareholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepresentativeShareholderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepresentativeShareholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
