import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldContractComponent } from './old-contract.component';

describe('OldContractComponent', () => {
  let component: OldContractComponent;
  let fixture: ComponentFixture<OldContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OldContractComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OldContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
