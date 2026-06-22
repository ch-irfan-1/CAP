import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ApplicationRef, Component, HostListener, Renderer2 } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
import { AuthenticationService } from '@NFS_Core/NFSServices/Authentication/authentication.service';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { DialogBoxService } from '@NFS_Core/NFSServices/DialogBox/dialog-box.service';
import { interval, map, Observable, Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent implements AfterViewInit{
  title = 'Ang11Proj';
  
  ;

// .src=`https://maps.googleapis.com/maps/api/js?key=${this.apiKey}';

  //companyCode = 1;
  currentRoute: any;
  userActivity: any;
  userInactive: Subject<any> = new Subject();
  userActivityRefresh: any;
  userInactiveRefresh: Subject<any> = new Subject();
  hideHeader: boolean = false;
  subs: Subscription;
  ngAfterViewInit(): void {
   
   
  }

  constructor(private renderer: Renderer2,private http:HttpClient,
    private authService: AuthenticationService,
    private router: Router,
    private storageService: ClientStoreService,
    private _AppConfig: AppConfigService,
    private route: ActivatedRoute,
    private _dialog: DialogBoxService,
    private appRef: ApplicationRef,
    private update: SwUpdate) {


    this.subs = interval(60000).subscribe((val) => {
      if (this.update.isEnabled) {
        update.checkForUpdate().then((value: boolean) => {
          if (value)
            this.openDialog();
        })
      }
    });

    if (this._AppConfig.CompanyCode === '001') {
      this.renderer.addClass(document.body, "theme1");
      this.renderer.addClass(document.body, "light");
    }
    else if (this._AppConfig.CompanyCode === '002') {
      this.renderer.addClass(document.body, "theme2");
      this.renderer.addClass(document.body, "light");
    }

    this.setTimeout();
    this.userInactive.subscribe((message: any) => {
      clearTimeout(this.userActivity);
      this.authService.Logout().subscribe(res => {
        this.router.navigate(['/login']);
      });
    });

    this.setRefreshTimeout();
    this.userInactiveRefresh.subscribe((message: any) => {
      clearTimeout(this.userActivityRefresh);
      window.location.reload();
    });

    this.route.queryParams
      .subscribe(params => {
        if (params.ProposalId > 0) {
          this.hideHeader = true;
        }
      }
      );
  }
 

  openDialog() {
    var dialog = this._dialog.openDialog("information !", "New build is available, you will be log out to apply latest version", true, "Ok");
    dialog.afterClosed().subscribe(result => {
      if (result === "ok") {
        this.logout(result);
      }
    });
  }

  public logout(event: Event) {
    this.authService.Logout().subscribe(res => {
      const navigationExtras: NavigationExtras = { state: { hardRefresh: true } }
      this.router.navigate(['/login'], navigationExtras);
    });
  }

  setTimeout() {
    if (this.userInactive) {
      this.userActivity = setTimeout(() =>
        this.userInactive.next("User has been inactive for " + this._AppConfig.GetIdleTimeout / 1000 + " seconds"), this._AppConfig.GetIdleTimeout);
    }
  }

  setRefreshTimeout() {
    if (this.userInactiveRefresh) {
      this.userActivityRefresh = setTimeout(() =>
        this.userInactiveRefresh.next("User has been inactive for 1 hour"), 3600000);
    }
  }


  @HostListener('document:mousemove')
  @HostListener('document:keypress')
  @HostListener('document:click')
  @HostListener('document:wheel')
  refreshUserState() {
    clearTimeout(this.userActivity);
    clearTimeout(this.userActivityRefresh);
    this.setTimeout();
    this.setRefreshTimeout();
  }

  get ShowHeader() {
    if (this.hideHeader) {
      return false;
    }
    else if (this.storageService.IsAppLoggedIn) {
      return true;
    }
    return false;
  }

  public onClick(event: Event) {
    this.authService.Logout().subscribe(res => {

    });
  }

  hasRoute(route: string) {
    return this.router.url.includes(route);
  }
  
  latitude = 37.7749; // Example latitude
  longitude = -122.4194; // Example longitude
  address: string | undefined;


  reverseGeocode(latitude: number, longitude: number): void {
    const geocoder = new google.maps.Geocoder();
    const latlng = new google.maps.LatLng(latitude, longitude);

    geocoder.geocode({ 'location': latlng }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results) {
          console.log(results[0].formatted_address);
          // Handle the formatted address as needed
        } else {
          console.error('No results found');
        }
      } else {
        console.error('Geocoder failed due to: ' + status);
      }
    });

  }
  geocodeLatLng(location: google.maps.LatLngLiteral): Promise<any> {
    let geocoder = new google.maps.Geocoder();

    return new Promise((resolve, reject) => {
      geocoder.geocode({ 'location': location }, (results, status) => {
       // const response = new GeocoderResponse(status, results);
        resolve(results);
      });
    });
  }
  }

