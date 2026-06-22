import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import  { NgsFormsModule  } from 'src/Library';

import { IOPSRoutingModule } from './iops-routing.module';
import { NfsControlsModule } from '@NFS_Core/NFSControls/nfs-controls.module';
import { dragAndDropFileDirective } from '../../_Core/_directives/drag-and-drop-fileUpload.directive';

import { IOPSMainComponent } from './Components/iopsmain/iopsmain.component';
import { IOPSCustomerInfoComponent } from './Components/iopscustomer-info/iopscustomer-info.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { AddressInfoComponent } from './Components/address-info/address-info.component';
import { GeneralInfoComponent } from './Components/general-info/general-info.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from '@NFS_Core/_interceptors/loading.interceptor';
import { DocumentsInfoComponent } from './Components/documents-info/documents-info.component';
import { ApplicationTypeComponent } from './Components/application-type/application-type.component';
import { DocumentsViewComponent } from './Components/documents-view/documents-view.component';
import { ExistingBpSearchComponent } from './Components/existing-bp-search/existing-bp-search.component';
import { MatTableModule } from '@angular/material/table';
import { EkycInfoComponent } from './Components/ekyc-info/ekyc-info.component'
import { MatDialogModule } from '@angular/material/dialog';
import { CaptureImageComponent } from './Components/capture-image/capture-image.component';
import { WebcamModule } from 'ngx-webcam';
import { IOPSFilterPipe } from 'src/app/Helpers/IOPSFilterPipe';
import { NgxImageCompressService } from 'ngx-image-compress';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SubAddressComponent } from './Components/Sub-Address/sub-address/sub-address.component';

@NgModule({
  declarations: [dragAndDropFileDirective,IOPSMainComponent, IOPSCustomerInfoComponent, AddressInfoComponent, GeneralInfoComponent, DocumentsInfoComponent, ApplicationTypeComponent, DocumentsViewComponent, ExistingBpSearchComponent, EkycInfoComponent, CaptureImageComponent, IOPSFilterPipe, SubAddressComponent],
  imports: [
    CommonModule,
    NfsControlsModule,
    IOPSRoutingModule,
    NgsFormsModule,
    MatTabsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatExpansionModule,
    MatSelectModule,
    MatIconModule,
    MatMenuModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatRadioModule,
    MatTableModule,
    MatDialogModule,
    WebcamModule,
    MatTooltipModule,
    MatPaginatorModule

  ],
  providers: [
  {provide: HTTP_INTERCEPTORS, useClass:LoadingInterceptor, multi:true},
  NgxImageCompressService,
  {provide: HTTP_INTERCEPTORS, useClass:LoadingInterceptor, multi:true},
  IOPSFilterPipe
],
})
export class IOPSModule { }
