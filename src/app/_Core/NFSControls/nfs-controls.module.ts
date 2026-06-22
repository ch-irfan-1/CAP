import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { DynamicPipe } from 'src/app/Helpers/DynamicPipe.pipe';
import { NfsButtonComponent } from './nfs-button/nfs-button.component';
import { NFSCheckboxComponent } from './nfs-checkbox/nfs-checkbox.component';
import { NfsCurrencyComponent } from './nfs-currency/nfs-currency.component';
import { NFSDatePickerComponent } from './nfs-datepicker/nfs-datepicker.component';
import { NfsDialogComponent } from './nfs-dialog/nfs-dialog.component';
import { NFSDropdownComponent } from './nfs-dropdown/nfs-dropdown.component';
import { NfsEmailComponent } from './nfs-email/nfs-email.component';
import { NfsGridComponent } from './nfs-grid/nfs-grid.component';
import { NfsIdComponent } from './nfs-id/nfs-id.component';
import { NfsNumberComponent } from './nfs-number/nfs-number.component';
import { NfsPasswordComponent } from './nfs-password/nfs-password.component';
import { NfsPercentageComponent } from './nfs-percentage/nfs-percentage.component';
import { NfsStaticGridComponent } from './nfs-static-grid/nfs-static-grid.component';
import { NfsTextareaComponent } from './nfs-textarea/nfs-textarea.component';
import { NFSTextboxComponent } from './nfs-textbox/nfs-textbox.component';
import { NfsYeardatepickerComponent } from './nfs-yeardatepicker/nfs-yeardatepicker.component';
import { NfsMonthYearFindComponent } from './nfs-month-year-find/nfs-month-year-find.component';
import { IsControlVisibleDirective } from '@NFS_Core/_directives/isControlVisible.directive';
import { ResizableModule } from 'angular-resizable-element';
import { NfsImageViewerComponent } from './nfs-image-viewer/nfs-image-viewer.component';
// import { ResizeColumnDirective } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/resize-column.directive';

export const options: Partial<IConfig> = {
  thousandSeparator: ","
};

@NgModule({
  declarations: [NFSDropdownComponent, NFSTextboxComponent, NFSDatePickerComponent, NfsPasswordComponent, NfsEmailComponent, NfsNumberComponent, NfsGridComponent, 
    NfsStaticGridComponent, NfsCurrencyComponent, NfsPercentageComponent, NfsButtonComponent, NfsIdComponent, NfsDialogComponent, NfsTextareaComponent, DynamicPipe, 
    NFSCheckboxComponent, NfsYeardatepickerComponent, NfsMonthYearFindComponent, IsControlVisibleDirective, NfsImageViewerComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    // BrowserAnimationsModule,
    MatSelectModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatTableModule,
    CdkTableModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    NgxMaskModule.forRoot(options),
    MatDialogModule,
    MatCheckboxModule,
    MatSortModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatBadgeModule,
    ResizableModule
  ],
  exports: [
    NFSDropdownComponent, NFSTextboxComponent, NFSDatePickerComponent, NfsPasswordComponent, NfsEmailComponent, NfsNumberComponent, NfsGridComponent, NfsStaticGridComponent, NfsCurrencyComponent, NfsPercentageComponent, NfsButtonComponent,
     NfsIdComponent, NfsTextareaComponent, NFSCheckboxComponent, NfsYeardatepickerComponent, NfsMonthYearFindComponent, IsControlVisibleDirective, NfsImageViewerComponent
  ],
  providers: [DatePipe]

})
export class NfsControlsModule { }
