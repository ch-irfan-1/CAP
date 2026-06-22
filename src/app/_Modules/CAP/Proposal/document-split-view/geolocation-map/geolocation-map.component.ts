import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-geolocation-map',
    templateUrl: './geolocation-map.component.html',
    styleUrls: ['./geolocation-map.component.css'],
    standalone: false
})
export class GeolocationMapComponent implements  AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer: ElementRef | undefined;
  map: google.maps.Map | null = null;
  marker: google.maps.Marker | null = null;
  directionsService: google.maps.DirectionsService | null = null;
  directionsRenderer: google.maps.DirectionsRenderer | null = null;

  useEmbedMap = false;
  embedMapUrl: SafeResourceUrl | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public Param: any,
    private _AppConfig: AppConfigService,
    private toaster: ToastrService,
    private _sanitizer : DomSanitizer
  ) {}

  ngAfterViewInit(): void {
    this.useEmbedMap = this.Param?.docCode !== '00019';

    if (this.useEmbedMap) {
      this.setEmbedMapUrl();
    } else {
      this.loadGoogleMapsScript();
    }
  }

  setEmbedMapUrl(): void {

    const source = this.getLatLng(this.Param.latlng);
    if (source) {
      const query = `${source.lat},${source.lng}`;
      let url = `https://www.google.com/maps/embed/v1/place?key=${this._AppConfig.googleMapsApi}&q=${encodeURIComponent(query)}`;
      this.embedMapUrl = this._sanitizer.bypassSecurityTrustResourceUrl(url);
    } else {
      this.toaster.warning("No valid location provided to embed map.");
    }
  }

  loadGoogleMapsScript(): void {

    if (typeof google !== 'undefined' && google.maps) {
      this.initMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${this._AppConfig.googleMapsApi}&callback=initMapCallback&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;

    (window as any).initMapCallback = () => this.initMap();

    document.head.appendChild(script);
  }

  initMap(): void {
    if (!this.mapContainer) return;

    this.map = new google.maps.Map(this.mapContainer.nativeElement, {
      zoom: parseInt(this._AppConfig.googleMapZoomLevel),
      center: { lat: 0, lng: 0 }
    });

    this.processMapData();
  }
  isValidLatLng(value: google.maps.LatLngLiteral | null): boolean {
    return !!value && value.lat !== 0 && value.lng !== 0;
  }

  processMapData(): void {

    const source = this.getLatLng(this.Param.latlng);
    const destination = this.getLatLng(this.Param.destinationLngLat);
    const docCode = this.Param.docCode;


    const hasSource = this.isValidLatLng(source);
    const hasDestination = this.isValidLatLng(destination);

    if (!hasSource && !hasDestination) {
      this.toaster.warning("No valid coordinates provided for source or destination.");
      return;
    }

    if (hasSource && hasDestination && docCode === '00019') {
      this.drawRoute(source!, destination!);
    } else {
      if (!hasSource && hasDestination && docCode === '00019') {
        this.toaster.warning("Source coordinates are missing. Pinning destination only.");
        this.pinLocation(destination);
      } else if (hasSource && !hasDestination && docCode === '00019') {
        this.toaster.warning("Destination coordinates are missing. Pinning source only.");
        this.pinLocation(source);
      } else if (hasSource && docCode !== '00019') {
        this.pinLocation(source);
      }
      else {
        this.pinLocation(source || destination);
      }
    }
  }

  getLatLng(coordString: string): google.maps.LatLngLiteral | null {
    if (!coordString) return null;
    const [lat, lng] = coordString.trim().split(',').map(Number);
    return isNaN(lat) || isNaN(lng) ? null : { lat, lng };
  }

  drawRoute(source: google.maps.LatLngLiteral, destination: google.maps.LatLngLiteral): void {
    if (!this.map) return;

    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({ map: this.map });

    this.directionsService.route(
      {
        origin: source,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (response, status) => {
        if (status === google.maps.DirectionsStatus.OK && this.directionsRenderer) {
          this.directionsRenderer.setDirections(response);

          const bounds = new google.maps.LatLngBounds();
          const route = response?.routes[0];

          route?.legs.forEach((leg) => {
            bounds.extend(leg.start_location);
            bounds.extend(leg.end_location);
          });

          this.map?.fitBounds(bounds);
        } else {
          console.error("Failed to load route:", status);

          if (status === google.maps.DirectionsStatus.ZERO_RESULTS) {
            this.toaster.warning('No route found between the selected locations.', 'Route Not Found');
          } else {
            this.toaster.error('Direction request failed. Please retry');
            console.log(`Google API request failed with error: ${status}`);
          }
        }
      }
    );
  }

  pinLocation(location: google.maps.LatLngLiteral | null): void {
    if (!this.map || !location) return;

    this.map.setCenter(location);
    this.map.setZoom(14);
    this.marker = new google.maps.Marker({
      position: location,
      map: this.map
    });
  }

}
