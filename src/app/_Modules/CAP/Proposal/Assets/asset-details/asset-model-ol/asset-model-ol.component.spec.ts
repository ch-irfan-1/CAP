import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetModelOlComponent } from './asset-model-ol.component';

describe('AssetModelOlComponent', () => {
  let component: AssetModelOlComponent;
  let fixture: ComponentFixture<AssetModelOlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetModelOlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetModelOlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
