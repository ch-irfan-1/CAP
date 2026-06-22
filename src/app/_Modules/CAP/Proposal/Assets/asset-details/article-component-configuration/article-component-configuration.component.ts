import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef } from '@angular/material/dialog';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { InsuranceMasterDataService } from '@NFS_Core/NFSServices/MasterData/insurance-master-data.service';
import { IPRPL_CMPT_CNFGInfo } from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import { AssetComponentsFinancialConfiguration } from '@NFS_Enums/AssetComponentsFinancialConfiguration.enum';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { CalculationService } from '@NFS_Modules/CAP/CAPServices/calculation.service';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalManagerService } from '@NFS_Modules/CAP/_helpers/proposal-manager.service';
import { FormArray, FormBuilder } from 'src/Library';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-article-component-configuration',
    templateUrl: './article-component-configuration.component.html',
    styleUrls: ['./article-component-configuration.component.css'],
    standalone: false
})
export class ArticleComponentConfigurationComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['AMNTCMPTCDE', 'AMNTCMPTCNFG', 'PAYTOINTRODUCERIND'];
  public PRPLCMPTCNFG!: FormArray<IPRPL_CMPT_CNFGInfo>;
  private subscription$ = new Subject();
  isCF: boolean = true;
  IsChanged: boolean = false;
  isViewMode = false;
  filteredAssetComponent: any;

  dataSource2 = ELEMENT_DATA2;

  constructor(private _dataService: ProposalDataService, public _insMasterData: InsuranceMasterDataService,
    private _calculationService: CalculationService, private _formBuilder: FormBuilder, private _formModeService: FormModeService,
    private toastr: ToastrService, public dialogRef: MatDialogRef<ArticleComponentConfigurationComponent>, private _managerService: ProposalManagerService) { }

  ngOnInit(): void {
    this.PRPLCMPTCNFG=this._dataService.PRPLCMPTCNFG;
    // this.PRPLCMPTCNFG= this._formBuilder.array(this._dataService.PRPLCMPTCNFG.controls.filter((p:any)=>p.value.RowState!=DataRowState.Removed));
    // this._dataService.PRPLCMPTCNFG.controls.forEach(p => {
    //   if (p.controls.RowState.value != DataRowState.Removed)
    //     this.PRPLCMPTCNFG.push(p);
    // });
    if (this._formModeService.FormMode != FormMode.VIEW) {
      this.PRPLCMPTCNFG.controls.forEach(p => {
        if (p.value.AMNTCMPTCNFG == AssetComponentsFinancialConfiguration.Finance)
          p.controls.IsDisabled.setValue(true);
      });
    }
    else {
      this.isViewMode = true;
    }
    this._insMasterData.getarticleComponentLookups().pipe(takeUntil(this.subscription$)).subscribe(a => {
      this._insMasterData.InitializeAssetDetailMasterData(a);
    });

    if (this._managerService.ISCFNONMCOMIND) {
      this.isCF = false;
    }
    this.filteredAssetComponent = this._insMasterData.AssetComponents.filter(x =>x.TextValue !== 'Waived');
  }

  showOptions(event: MatCheckboxChange, index: any) {
    this.PRPLCMPTCNFG.controls[index].controls.PAYTOINTRODUCERIND.setValue(Boolean(event));
    if (this._dataService.PROPOSAL.controls.ISMCOMCAMPAIGN.value == true)
      this.PRPLCMPTCNFG.controls[index].controls.PAYTOINTRODUCERIND.setValue(false);
    this.IsChanged = true;
    if (this.PRPLCMPTCNFG.controls[index].value.RowState != DataRowState.Removed && this.PRPLCMPTCNFG.controls[index].value.RowState != DataRowState.Added) {
      this.PRPLCMPTCNFG.controls[index].controls.RowState.setValue(DataRowState.Updated)
    }
  }

  someMethod(index: any, element: any) {

    if (element.AMNTCMPTCNFG == AssetComponentsFinancialConfiguration.Finance
      || this._dataService.PROPOSAL.controls.ISMCOMCAMPAIGN.value == true) {
      this.PRPLCMPTCNFG.controls[index].controls.AMNTCMPTCNFG.setValue(element.AMNTCMPTCNFG);
      this.PRPLCMPTCNFG.controls[index].controls.PAYTOINTRODUCERIND.setValue(false);
    }
    if (this._managerService.ISCFNONMCOMIND) {
      if (element.AMNTCMPTCNFG == AssetComponentsFinancialConfiguration.Finance) {
        this.PRPLCMPTCNFG.controls[index].controls.AMNTCMPTCNFG.setValue(element.AMNTCMPTCNFG);
        this.PRPLCMPTCNFG.controls[index].controls.PAYTOINTRODUCERIND.setValue(false);
        this.PRPLCMPTCNFG.controls[index].controls.IsDisabled.setValue(true);
      }
      else {
        this.PRPLCMPTCNFG.controls[index].controls.AMNTCMPTCNFG.setValue(element.AMNTCMPTCNFG);
        this.PRPLCMPTCNFG.controls[index].controls.PAYTOINTRODUCERIND.setValue(false);
        this.PRPLCMPTCNFG.controls[index].controls.IsDisabled.setValue(false);
      }
    }
    if (this.PRPLCMPTCNFG.controls[index].value.RowState != DataRowState.Removed && this.PRPLCMPTCNFG.controls[index].value.RowState != DataRowState.Added) {
      this.PRPLCMPTCNFG.controls[index].controls.RowState.setValue(DataRowState.Updated)
    }
    this.IsChanged = true;
  }

  btnOk_Click() {
    this.PRPLCMPTCNFG.value.forEach(element => {
      if (!element.AMNTCMPTCNFG)
        this.toastr.error('Article Component configuration is Missing.');
      return;
    });
    if (this.IsChanged) {
      this._calculationService.ResetRentalDetail();
      this._calculationService.CalculateNetFinanceAmt();
      this._calculationService.UpdateAdminFeeFields();
      // Controller.FirstPaymentConfig();
      this._calculationService.FirstPaymentConfig();
      this._calculationService.CalculateFirstPayment();
      // Controller.UpdateAdminFeeFeilds();
    }
    this.dialogRef.close();


  }

  btnCancel_Click() {
    if (this.IsChanged) {
      this._calculationService.ResetRentalDetail();
      this._calculationService.CalculateNetFinanceAmt();
      this._calculationService.UpdateAdminFeeFields();
      // Controller.FirstPaymentConfig();
      this._calculationService.FirstPaymentConfig();
      this._calculationService.CalculateFirstPayment();
      // Controller.UpdateAdminFeeFeilds();
    }
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }


}

// Demo Data
export interface PeriodicElement {
  Component: string;
  ConfigurationType: string;
  ReceivedbyDealer: boolean;

}

const ELEMENT_DATA2: PeriodicElement[] = [
  { Component: '', ConfigurationType: '', ReceivedbyDealer: true },
  { Component: '', ConfigurationType: '', ReceivedbyDealer: false }
];
