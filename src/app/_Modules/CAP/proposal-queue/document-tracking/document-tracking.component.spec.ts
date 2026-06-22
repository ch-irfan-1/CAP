import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentTrackingComponent } from './document-tracking.component';

describe('DocumentTrackingComponent', () => {
  let component: DocumentTrackingComponent;
  let fixture: ComponentFixture<DocumentTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentTrackingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
