import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerSearchComponent } from './dealer-search.component';

describe('DealerSearchComponent', () => {
  let component: DealerSearchComponent;
  let fixture: ComponentFixture<DealerSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
