import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NFSTextboxComponent } from './nfs-textbox.component';

describe('NFSTextboxComponent', () => {
  let component: NFSTextboxComponent;
  let fixture: ComponentFixture<NFSTextboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NFSTextboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NFSTextboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
