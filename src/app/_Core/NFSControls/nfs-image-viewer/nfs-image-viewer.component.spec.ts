import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NfsImageViewerComponent } from './nfs-image-viewer.component';

describe('NfsImageViewerComponent', () => {
  let component: NfsImageViewerComponent;
  let fixture: ComponentFixture<NfsImageViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NfsImageViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NfsImageViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
