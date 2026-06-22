import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionSchemeConfigurationsComponent } from './commission-scheme-configurations.component';

describe('CommissionSchemeConfigurationsComponent', () => {
  let component: CommissionSchemeConfigurationsComponent;
  let fixture: ComponentFixture<CommissionSchemeConfigurationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommissionSchemeConfigurationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommissionSchemeConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
