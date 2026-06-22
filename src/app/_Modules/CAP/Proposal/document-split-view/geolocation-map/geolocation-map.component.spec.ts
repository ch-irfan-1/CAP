import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeolocationMapComponent } from './geolocation-map.component';

describe('GeolocationMapComponent', () => {
  let component: GeolocationMapComponent;
  let fixture: ComponentFixture<GeolocationMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeolocationMapComponent]
    });
    fixture = TestBed.createComponent(GeolocationMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
