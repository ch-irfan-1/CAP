import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NFSDropdownComponent } from './nfs-dropdown.component';

describe('NFSDroddownComponent', () => {
  let component: NFSDropdownComponent;
  let fixture: ComponentFixture<NFSDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NFSDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NFSDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
