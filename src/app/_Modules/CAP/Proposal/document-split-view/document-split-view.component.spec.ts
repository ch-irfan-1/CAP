import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentSplitViewComponent } from './document-split-view.component';

describe('DocumentSplitViewComponent', () => {
  let component: DocumentSplitViewComponent;
  let fixture: ComponentFixture<DocumentSplitViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentSplitViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentSplitViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
