import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule, inject, provideAppInitializer } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NfsControlsModule } from '@NFS_Core/NFSControls/nfs-controls.module';
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
import { AuthGuard } from '@NFS_Core/NFSServices/Authentication/auth.guard';
import { HasClaimDirective } from '@NFS_Core/_directives/has-claim.directive';
import { IsControlEnabledDirective } from '@NFS_Core/_directives/is-control-enabled.directive';
import { AuthInterceptor } from '@NFS_Core/_interceptors/auth.interceptor';
import { ErrorInterceptor } from '@NFS_Core/_interceptors/error.interceptor';
import { LoadingInterceptor } from '@NFS_Core/_interceptors/loading.interceptor';
import { TimeoutInterceptor } from '@NFS_Core/_interceptors/timeout.interceptor';
import { LoginModule } from '@NFS_Modules/login/login.module';
// import { StoreModule } from '@ngrx/store';
import { NgsFormsModule } from 'src/Library/';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
// import { ChartsModule } from 'ng2-charts';
import { WebcamModule } from 'ngx-webcam';
import { provideNgxWebstorage, withLocalStorage, withNgxWebstorageConfig, withSessionStorage } from 'ngx-webstorage';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorsComponent } from './errors/errors.component';
import { IOPSFilterPipe } from './Helpers/IOPSFilterPipe';
import { SideNavComponent } from './side-nav/side-nav.component';
import { RemovedStateFilterPipe } from './_Filters/removed-state-filter.pipe';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { GeolocationMapComponent } from './_Modules/CAP/Proposal/document-split-view/geolocation-map/geolocation-map.component';
import {MatDialogModule } from '@angular/material/dialog';
import { DocumentViewPopupComponent } from '@NFS_Modules/CAP/Proposal/document-split-view/document-view-popup/document-view-popup.component';




@NgModule({ declarations: [
        AppComponent,
        SideNavComponent,
        ErrorsComponent,
        HasClaimDirective,
        IsControlEnabledDirective,
        DocumentViewPopupComponent,
        GeolocationMapComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        NgsFormsModule,
        NfsControlsModule,
        LoginModule,
        MatExpansionModule,
        
        NgxSpinnerModule,
        ToastrModule.forRoot({
            positionClass: 'toast-top-right',
            disableTimeOut: false,
            enableHtml: true,
            preventDuplicates: true
        }),
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        MatToolbarModule,
        MatTabsModule,
        MatInputModule,
        MatButtonModule,
        MatRadioModule,
        MatTooltipModule,
        WebcamModule,
        MatDialogModule,
        MatBadgeModule,
        MatMenuModule,
        NgxImageZoomModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the app is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        })], providers: [
            provideNgxWebstorage(
                withNgxWebstorageConfig({ separator: ':', caseSensitive: true }),
                withLocalStorage(),
                withSessionStorage()
            ),
        AuthGuard,
        provideAppInitializer(() => {
        const initializerFn = ((appConfigService: AppConfigService) => {
                return () => {
                    //Make sure to return a promise!
                    return appConfigService.loadAppConfig();
                };
            })(inject(AppConfigService));
        return initializerFn();
      }),
        { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true },
        IOPSFilterPipe, RemovedStateFilterPipe,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
