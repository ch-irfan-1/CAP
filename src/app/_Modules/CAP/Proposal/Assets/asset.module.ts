import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetDetailsComponent } from './asset-details/asset-details.component';
import { AssetTypeComponent } from './asset-details/assetType/assetType.component';
import { AssetSubTypeComponent } from './asset-details/asset-sub-type/asset-sub-type.component';
import { AssetModelComponent } from './asset-details/asset-model/asset-model.component';
import { SupplierComponent } from './asset-details/supplier/supplier.component';
import { ApplicationChangesComponent } from './asset-details/application-changes/application-changes.component';
import { AccessoriesComponent } from './asset-details/accessories/accessories.component';
import { NetFinancedAmountComponent } from './asset-details/net-financed-amount/net-financed-amount.component';
import { InterestRateComponent } from './asset-details/interest-rate/interest-rate.component';
import { CommissionComponent } from './asset-details/commission/commission.component';
import { TotalAdminFeeComponent } from './asset-details/total-admin-fee/total-admin-fee.component';
import { ProvisionFeeComponent } from './asset-details/provision-fee/provision-fee.component';
import { PolicyFeeComponent } from './asset-details/policy-fee/policy-fee.component';
import { FiduciaFeeComponent } from './asset-details/fiducia-fee/fiducia-fee.component';
import { CommissionSchemeConfigurationsComponent } from './asset-details/commission-scheme-configurations/commission-scheme-configurations.component';
import { TotalSubsidyAmountComponent } from './asset-details/total-subsidy-amount/total-subsidy-amount.component';
import { InsurancePremiumComponent } from './asset-details/insurance-premium/insurance-premium.component';
import { InsuranceCommissionOTOComponent } from './asset-details/insurance-commission-oto/insurance-commission-oto.component';
import { OJKInsuranceCommissionComponent } from './asset-details/ojk-insurance-commission/ojk-insurance-commission.component';
import { BBNChargesComponent } from './asset-details/bbn-charges/bbn-charges.component';
import { CommissionDistributionComponent } from './asset-details/commission-distribution/commission-distribution.component';
import { ArticleComponentConfigurationComponent } from './asset-details/article-component-configuration/article-component-configuration.component';
import { StructuredComponent } from './asset-details/structured/structured.component';
import { TotalFirstPaymentComponent } from './asset-details/total-first-payment/total-first-payment.component';
import { TotalGPInterestAmountComponent } from './asset-details/total-gp-interest-amount/total-gp-interest-amount.component';
import { TotalAcquisitionIncomeComponent } from './asset-details/total-acquisition-income/total-acquisition-income.component';
import { NMSIRComponent } from './asset-details/nmsir/nmsir.component';
import { DealerPOAmountComponent } from './asset-details/dealer-po-amount/dealer-po-amount.component';
import { TotalSecurityDepositComponent } from './asset-details/total-security-deposit/total-security-deposit.component';
import { RepaymentPlanComponent } from './asset-details/repayment-plan/repayment-plan.component';
import { JP1JP2CommissionTaxDetailComponent } from './asset-details/commission-distribution/jp1-jp2-commission-tax-detail/jp1-jp2-commission-tax-detail.component';
import { OJKJP1JP2CommissionTaxDetailComponent } from './asset-details/ojk-insurance-commission/ojk-jp1-jp2-commission-tax-detail/ojk-jp1-jp2-commission-tax-detail.component';
import { ProvisionFeeAmountComponent } from './asset-details/provision-fee/provision-fee-amount/provision-fee-amount.component';
import { TotalAdminFeesComponent } from './asset-details/total-admin-fee/total-admin-fees/total-admin-fees.component';
import { DepreciationPolicyComponent } from './asset-details/insurance-premium/depreciation-policy/depreciation-policy.component';
import { BaseRateComponent } from './asset-details/interest-rate/base-rate/base-rate.component';
import { SubmitPreviousBPKBComponent } from './asset-details/assetType/submit-previous-bpkb/submit-previous-bpkb.component';
import { AssetDetailsDefaultComponent } from './asset-details/asset-details-default/asset-details-default.component';
import { AssetDetailsCommonComponent } from './asset-details/asset-details-common/asset-details-common.component';
import { AssetModelOlComponent } from './asset-details/asset-model-ol/asset-model-ol.component';


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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { IsControlVisibleDirective } from '@NFS_Core/_directives/isControlVisible.directive';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { TruckDetailComponent } from './asset-details/truck-detail/truck-detail.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ProposalModule } from '../proposal.module';
import { ResizableModule } from 'angular-resizable-element';
import { OldContractComponent } from './asset-details/old-contract/old-contract.component';


export const options: Partial<IConfig> = {
  thousandSeparator: ","
};

@NgModule({
  declarations: [RepaymentPlanComponent,AssetDetailsComponent,AssetTypeComponent,
    AssetSubTypeComponent,
    AssetModelComponent,
    SupplierComponent,
    ApplicationChangesComponent,
    AccessoriesComponent,
    NetFinancedAmountComponent,
    InterestRateComponent,
    CommissionComponent,
    TotalAdminFeeComponent,
    ProvisionFeeComponent,
    PolicyFeeComponent,
    FiduciaFeeComponent,
    CommissionSchemeConfigurationsComponent,
    TotalSubsidyAmountComponent,
    InsurancePremiumComponent,
    InsuranceCommissionOTOComponent,
    OJKInsuranceCommissionComponent,
    BBNChargesComponent,
    CommissionDistributionComponent,
    ArticleComponentConfigurationComponent,
    StructuredComponent,
    TotalFirstPaymentComponent,
    TotalGPInterestAmountComponent,
    TotalAcquisitionIncomeComponent,
    NMSIRComponent,
    DealerPOAmountComponent,
    TotalSecurityDepositComponent,JP1JP2CommissionTaxDetailComponent,
    OJKJP1JP2CommissionTaxDetailComponent,
    ProvisionFeeAmountComponent,
    TotalAdminFeesComponent,
    DepreciationPolicyComponent,
    BaseRateComponent,
    SubmitPreviousBPKBComponent,AssetDetailsDefaultComponent, AssetDetailsCommonComponent,AssetModelOlComponent, TruckDetailComponent,OldContractComponent],
    imports: [
      NgxMatSelectSearchModule,
      CommonModule,
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
      FormsModule,MatDatepickerModule,
      NgxMaskModule.forRoot(options),
      ProposalModule,
      ResizableModule
    ],
})
export class AssetModule { 
  static getMyComponent() {
    return AssetDetailsComponent
  }
}
