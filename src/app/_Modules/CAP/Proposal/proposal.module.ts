import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalMainComponent } from './proposal-main.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { NgsFormsModule  } from 'src/Library';
import { NfsControlsModule } from '@NFS_Core/NFSControls/nfs-controls.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from '@NFS_Core/_interceptors/loading.interceptor';
import { ProposalRoutingModule } from './proposal-routing.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GeneralHeaderInfoComponent } from './GeneralInfo/general-header-info.component';
import { DealerSearchComponent } from './GeneralInfo/dealer-search.component';
import { IdSearchComponent } from './Applicants/Id-Detail/id-search.component';
import { CompanyApplicantComponent } from './Applicants/company-applicant/company-applicant.component';
import { IndividualApplicantComponent } from './Applicants/individual-applicant/individual-applicant.component';
import { AddressComponent } from './Applicants/address/address.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BankComponent } from './Applicants/bank/bank.component';
import { EmploymentComponent } from './Applicants/employment/employment.component';
import { FamilyMemberComponent } from './Applicants/family-member/family-member.component';
import { ReferenceComponent } from './Applicants/reference/reference.component';
import { exposureComponent } from './Applicants/exposure/exposure.component';
import { BusinessComponent } from './Applicants/business/business.component';
import { RepresentativeShareholderComponent } from './Applicants/representative-shareholder/representative-shareholder.component';
import { AnnualFinancialsComponent } from './Applicants/annual-financials/annual-financials.component';
import { incomeExpanseComponent } from './Applicants/income-expanse/income-expanse.component';
import { assetLiabilityComponent } from './Applicants/asset-liabililty/assetLiability.component';
import { familyExposureComponent } from './Applicants/family-exposure/family-exposure.component';
import { FinancialInfoComponent } from './Financials/financial-info/financial-info.component';
import { ApplicantDocumentsComponent } from './Documents/applicant-documents/applicant-documents.component';
import { SubAddressComponent } from './Applicants/sub-address/sub-address.component';
import { SubEmploymentComponent } from './Applicants/sub-employment/sub-employment.component';
import { SubBankComponent } from './Applicants/sub-bank/sub-bank.component';
import { SubFamilyMemberComponent } from './Applicants/sub-family-member/sub-family-member.component';
import { SubReferenceComponent } from './Applicants/sub-reference/sub-reference.component';
import { SubBusinessComponent } from './Applicants/sub-business/sub-business.component';
import { SubRepresentativeShareholderComponent } from './Applicants/sub-representative-shareholder/sub-representative-shareholder.component';
import { RemovedStateFilterPipe } from 'src/app/_Filters/removed-state-filter.pipe';
import { FormsModule } from '@angular/forms';
import { DealerSupplierSearchComponent } from './dealer-supplier-search/dealer-supplier-search.component';
import { DocumentSplitViewComponent } from './document-split-view/document-split-view.component';
import { LastYearNetProfitComponent } from './Applicants/last-year-net-profit/last-year-net-profit.component';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { GoogleMapsModule } from '@angular/google-maps';
export const options: Partial<IConfig> = {
  thousandSeparator: ","
};

@NgModule({
  declarations: [ProposalMainComponent, GeneralHeaderInfoComponent, DealerSearchComponent, IdSearchComponent, CompanyApplicantComponent,
    IndividualApplicantComponent, AddressComponent, BankComponent, EmploymentComponent, FamilyMemberComponent, ReferenceComponent,
    exposureComponent, BusinessComponent, RepresentativeShareholderComponent, incomeExpanseComponent, assetLiabilityComponent,
    AnnualFinancialsComponent, familyExposureComponent, FinancialInfoComponent, ApplicantDocumentsComponent,
    SubAddressComponent,
    SubEmploymentComponent,
    SubBankComponent,
    SubFamilyMemberComponent,
    SubReferenceComponent,
    SubBusinessComponent,
    SubRepresentativeShareholderComponent, RemovedStateFilterPipe, DealerSupplierSearchComponent, DocumentSplitViewComponent, LastYearNetProfitComponent,
  ],
  imports: [
    CommonModule,

    GoogleMapsModule,
    ProposalRoutingModule,
    NfsControlsModule,
    NgsFormsModule ,
    MatTabsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatSelectModule,
    MatIconModule,
    MatMenuModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatRadioModule,
    MatTableModule,
    MatDialogModule,
    MatTooltipModule,
    MatPaginatorModule,
    FormsModule,
    NgxImageZoomModule ,
    NgxMaskModule.forRoot(options)

  ],
  exports: [DocumentSplitViewComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }, RemovedStateFilterPipe
  ],
})
export class ProposalModule { }
