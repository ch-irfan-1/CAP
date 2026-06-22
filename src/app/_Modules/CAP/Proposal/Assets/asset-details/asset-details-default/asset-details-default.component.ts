import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FinancialClubMasterDataService } from '@NFS_Core/NFSServices/MasterData/FinancialClub-master-data.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { IPRPL_FINL_AGRMInfo } from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import { CalculationService } from '@NFS_Modules/CAP/CAPServices/calculation.service';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { AccessoriesComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/accessories/accessories.component';
import { ApplicationChangesComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/application-changes/application-changes.component';
import { ArticleComponentConfigurationComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/article-component-configuration/article-component-configuration.component';
import { BBNChargesComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/bbn-charges/bbn-charges.component';
import { CommissionDistributionComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/commission-distribution/commission-distribution.component';
import { CommissionSchemeConfigurationsComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/commission-scheme-configurations/commission-scheme-configurations.component';
import { CommissionComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/commission/commission.component';
import { DealerPOAmountComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/dealer-po-amount/dealer-po-amount.component';
import { FiduciaFeeComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/fiducia-fee/fiducia-fee.component';
import { InsuranceCommissionOTOComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/insurance-commission-oto/insurance-commission-oto.component';
import { InsurancePremiumComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/insurance-premium/insurance-premium.component';
import { InterestRateComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/interest-rate/interest-rate.component';
import { NetFinancedAmountComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/net-financed-amount/net-financed-amount.component';
import { NMSIRComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/nmsir/nmsir.component';
import { OJKInsuranceCommissionComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/ojk-insurance-commission/ojk-insurance-commission.component';
import { PolicyFeeComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/policy-fee/policy-fee.component';
import { ProvisionFeeComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/provision-fee/provision-fee.component';
import { StructuredComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/structured/structured.component';
import { TotalAcquisitionIncomeComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/total-acquisition-income/total-acquisition-income.component';
import { TotalAdminFeeComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/total-admin-fee/total-admin-fee.component';
import { TotalFirstPaymentComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/total-first-payment/total-first-payment.component';
import { TotalGPInterestAmountComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/total-gp-interest-amount/total-gp-interest-amount.component';
import { TotalSecurityDepositComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/total-security-deposit/total-security-deposit.component';
import { TotalSubsidyAmountComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/total-subsidy-amount/total-subsidy-amount.component';
import { FormGroup } from 'src/Library';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RepaymentPlanComponent } from '../repayment-plan/repayment-plan.component';

@Component({
    selector: 'asset-details-default',
    templateUrl: './asset-details-default.component.html',
    styleUrls: ['./asset-details-default.component.css'],
    standalone: false
})
export class AssetDetailsDefaultComponent implements OnInit, OnDestroy {

  tempData: any = [{ code: "00001", TextValue: "one 1" }, { code: "00002", TextValue: "two 2" }, { code: "00003", TextValue: "three 3" }];
  private subscription$ = new Subject();
  PROPOSALFINANCIALAGREEMENT!: FormGroup<IPRPL_FINL_AGRMInfo>;
  constructor(private dialog: MatDialog, private _proposaldataService: ProposalDataService,
    public _masterDataService: MasterDataService, public _financialClubMasterDataService: FinancialClubMasterDataService,
    public _proposalDataService: ProposalDataService, private _calculationService: CalculationService) { }

  ngOnInit(): void {
    this.PROPOSALFINANCIALAGREEMENT = this._proposaldataService.PROPOSALFINANCIALAGREEMENT;
    this.valueChangeSubscriptions();
  }

  openInterestRate() {
    const dialogRef = this.dialog.open(InterestRateComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 1234567 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  openTotalSubsidyAmount() {
    const dialogRef = this.dialog.open(TotalSubsidyAmountComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 121 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  openApplicationCharges() {
    const dialogRef = this.dialog.open(ApplicationChangesComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 1234 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  openInsurancePremium() {
    const dialogRef = this.dialog.open(InsurancePremiumComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 1112 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });

  }

  openCommission() {
    const dialogRef = this.dialog.open(CommissionComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 113 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  openNetFinancedAmount() {
    const dialogRef = this.dialog.open(NetFinancedAmountComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 1234 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  openRepaymentPlan() {
    const dialogRef = this.dialog.open(RepaymentPlanComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: {
        "ProposalId": 0,
        "ApplicantId": 0,
        "FamilyMemberID": 0,
        "callFrom": 'assetDetail'
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  // added by Qasim 
  openFiduciaFee() {
    const dialogRef = this.dialog.open(FiduciaFeeComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 201 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  openBBNChanges() {
    const dialogRef = this.dialog.open(BBNChargesComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 202 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  openInsuranceCommissionOTO() {
    const dialogRef = this.dialog.open(InsuranceCommissionOTOComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 203 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  openTotalFirstPayment() {
    const dialogRef = this.dialog.open(TotalFirstPaymentComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 205 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  openStructured() {
    const dialogRef = this.dialog.open(StructuredComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 204 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  openArticleComponentConfiguration() {
    const dialogRef = this.dialog.open(ArticleComponentConfigurationComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 205 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  openNMSIR() {
    const dialogRef = this.dialog.open(NMSIRComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 206 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  openTotalAcquisitionAmount() {
    const dialogRef = this.dialog.open(TotalAcquisitionIncomeComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 207 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  openTotalAdminFee() {
    const dialogRef = this.dialog.open(TotalAdminFeeComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 208 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  openDealerPOAmount() {
    const dialogRef = this.dialog.open(DealerPOAmountComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 209 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  openProvisionFee() {
    const dialogRef = this.dialog.open(ProvisionFeeComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 210 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  openTotalGPAmount() {
    const dialogRef = this.dialog.open(TotalGPInterestAmountComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 210 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  openTotalSecurityDeposit() {
    const dialogRef = this.dialog.open(TotalSecurityDepositComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 211 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  openCommissionSchemeConfigurations() {
    const dialogRef = this.dialog.open(CommissionSchemeConfigurationsComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 212 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  openCommissionDistribution() {
    const dialogRef = this.dialog.open(CommissionDistributionComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 213 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  openPolicyFee() {
    const dialogRef = this.dialog.open(PolicyFeeComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 214 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  openOJKInsuranceCommission() {
    const dialogRef = this.dialog.open(OJKInsuranceCommissionComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 215 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  openAccessories() {
    const dialogRef = this.dialog.open(AccessoriesComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 215 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  valueChangeSubscriptions() {
    this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.ETAMNTOTO.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(value => {
      let isDisburseAmountValid = false;
      if (value == 0) {
        isDisburseAmountValid = this._calculationService.CalculateDisburseAmountOTO(0, 0, true);
      }
      else {
        isDisburseAmountValid = this._calculationService.CalculateDisburseAmountOTO();
      }
      if (isDisburseAmountValid == false)
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.ETAMNTOTO.setValue(0);
      this._calculationService.UpdateCalculatedFields();
    });
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }
}
