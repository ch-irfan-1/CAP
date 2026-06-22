import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { DialogBoxService } from '@NFS_Core/NFSServices/DialogBox/dialog-box.service';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { AssetDetailsMasterdataService } from '@NFS_Core/NFSServices/MasterData/asset-details-masterdata.service';
import { AssetSearchMasterdataService } from '@NFS_Core/NFSServices/MasterData/asset-search-masterdata.service';
import { FinancialClubMasterDataService } from '@NFS_Core/NFSServices/MasterData/FinancialClub-master-data.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { mPOSMasterDataRequest } from '@NFS_Core/NFSServices/MasterData/MasterdataHelper/mPOSMasterDataRequest';
import { TruckDetailsMasterdataService } from '@NFS_Core/NFSServices/MasterData/truck-detail-masteradata';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { ApplicationTypeService } from '@NFS_Core/NFSServices/_helper/application-type.service';
import { GeneralService } from '@NFS_Core/NFSServices/_helper/general.service';
import { StateManagment } from '@NFS_Core/RowStateManagement/FormStateManagement';
import * as PROPOSALENTITY from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import { IAssetEntity, IProposalApplicantEntity, IProposalArticleEntity, IProposalRoundingTemplateEntity, IPRPL_TPLE_COMM_CNFGInfo, IPRPL_TPLE_RNTL_INTInfo } from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import { IOTO_PRPL_APLT_FAMInfo, IPRPL_APLT_ADDSInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/ProposalApplicantEntity.model.index';
import { IProposalCommissionEntity, IPRPL_ACCYInfo, IPRPL_ASETInfo, IPRPL_COMM_SCHMInfo, IPRPL_FINL_AGRMInfo, IPRPL_VHCL_DETLInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/ProposalArticleEntity.model.index';
import { AdjustmentType } from '@NFS_Enums/AdjustmentType.enum';
import { AmountClassification } from '@NFS_Enums/AmountClassification.enum';
import { AmountComponent } from '@NFS_Enums/AmountComponent';
import { ApplicantRoleCode } from '@NFS_Enums/ApplicantRoleCode.enum';
import { AssetComponentsFinancialConfiguration } from '@NFS_Enums/AssetComponentsFinancialConfiguration.enum';
import { AssetSelection } from '@NFS_Enums/AssetSelection.enum';
import { CommissionCalculationMethod } from '@NFS_Enums/CommissionCalculationMethod';
import { CommissionType } from '@NFS_Enums/CommissionType.enum';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FinanceType } from '@NFS_Enums/FinanceType';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { IDTypeCode } from '@NFS_Enums/IDTypeCode';
import { MasterData } from '@NFS_Enums/MasterData.enum';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { RentalMode } from '@NFS_Enums/RentalMode';
import { ReturnCode } from '@NFS_Enums/ReturnCode.enum';
import { RoleCode } from '@NFS_Enums/RoleCode';
import { StatusCode } from '@NFS_Enums/StatusCode.enum';
import { SubsidyType } from '@NFS_Enums/SubsidyType.enum';
import { IAssetInfoParams } from '@NFS_Interfaces/RequestInterfaces/asset-search-info-params';
import { IBusinessPartnerInfoParm } from '@NFS_Interfaces/RequestInterfaces/BusinessPartnerInfoParm';
import { CommissionCalculationParam } from '@NFS_Interfaces/RequestInterfaces/CommissionCalculationParam';
import { ICalculationInfoParam } from '@NFS_Interfaces/RequestInterfaces/ICalculationInfoParam';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { CalculationService } from '@NFS_Modules/CAP/CAPServices/calculation.service';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalEntityMapperService } from '@NFS_Modules/CAP/CAPServices/proposal-entity-mapper.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { ProposalManagerService } from '@NFS_Modules/CAP/_helpers/proposal-manager.service';
import { FormArray, FormGroup } from 'src/Library';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DealerSupplierSearchComponent } from '../../dealer-supplier-search/dealer-supplier-search.component';
import { AssetModelOlComponent } from './asset-model-ol/asset-model-ol.component';
import { AssetModelComponent } from './asset-model/asset-model.component';
import { TruckDetailComponent } from './truck-detail/truck-detail.component';
// import { ThisReceiver } from '@angular/compiler';

@Component({
    selector: 'app-asset-details',
    templateUrl: './asset-details.component.html',
    styleUrls: ['./asset-details.component.css'],
    standalone: false
})
export class AssetDetailsComponent implements OnInit, OnDestroy {
  tempData: any = [{ code: "00001", TextValue: "one 1" }, { code: "00002", TextValue: "two 2" }, { code: "00003", TextValue: "three 3" }];
  panelOpenState = false;
  assetTypeFlag: Boolean = false;
  // commissionFlag : Boolean = false;
  ProposalInfoParams = {} as IProposalInfoParm;
  PROPOSALINDVFAMMEMBR!: FormArray<IOTO_PRPL_APLT_FAMInfo>;
  PROPOSAL!: FormGroup<PROPOSALENTITY.IPRPLInfo>;
  CalculationParam = {} as ICalculationInfoParam;
  PROPOSALASSET!: FormGroup<IPRPL_ASETInfo>;
  PROPOSALVEHICLEDETAIL!: FormGroup<IPRPL_VHCL_DETLInfo>;
  PROPOSALFINANCIALAGREEMENT!: FormGroup<IPRPL_FINL_AGRMInfo>;
  applicationType: any;
  isfromcalculation = false;
  private subscription$ = new Subject();
  NullVal: number | string = '';
  PROPOSALASSETInfo!: IPRPL_ASETInfo;
  PROPOSALFINANCIALAGREEMENTInfo!: IPRPL_FINL_AGRMInfo;
  OTOPRPLASSTBPKBDETLinfo!: PROPOSALENTITY.IOTO_PRPL_ASST_BPKB_DETLInfo;
  ComponentName: string = "Assets";
  Mode: any = "";
  public columns = ['STARTTRM', 'ENDTRM', 'RENTALAMT'];
  public labels = ['Start Term', 'End Term', 'Gross Rental Amount'];
  public Pipes = [null, null, 'formatCurrency'];
  PRPLASSETINFO!: FormGroup<IPRPL_ASETInfo>;
  IsInventoryVehicle = false;

  constructor(public _dataService: ProposalDataService, private dialog: MatDialog, private _proposaldataService: ProposalDataService, private router: Router, public _generalService: GeneralService,
    private _proposalForm: ProposalEntityFormService, public _masterDataService: MasterDataService, private _proposalService: ProposalService, private _msgService: MessageService,
    public _assetSearchMasterDataService: AssetSearchMasterdataService, public _proposalManagerService: ProposalManagerService, public _calculationService: CalculationService,
    private _FormState: StateManagment, public _financialClubMasterDataService: FinancialClubMasterDataService, private _appConfig: AppConfigService,
    private _storageService: ClientStoreService, private _proposalEntityMapperService: ProposalEntityMapperService,
    public _assetDetailsMasterdataService: AssetDetailsMasterdataService, private _customDialog: DialogBoxService,
    private _formModeService: FormModeService, private _toastr: ToastrService, private appTypeService: ApplicationTypeService, public _truckMasterDataService: TruckDetailsMasterdataService,) { }

  ngOnInit(): void {
    this.PROPOSAL = this._proposaldataService.PROPOSAL;
    this.PROPOSALASSET = this._proposaldataService.PROPOSALASSET;
    this.PROPOSALVEHICLEDETAIL = this._proposaldataService.PROPOSALVEHICLEDETAIL;
    this.PROPOSALFINANCIALAGREEMENT = this._proposaldataService.PROPOSALFINANCIALAGREEMENT;
    this.Mode = this._formModeService.FormMode;

    //this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CONTRACTSTARTDTE.setValue(moment(this.PROPOSALFINANCIALAGREEMENTInfo.CONTRACTSTARTDTE).toDate());

    this.applicationType = this._proposaldataService.PROPOSAL.value.FINANCETYP;
    this.valueChangeSubscriptions();
    this._assetSearchMasterDataService.getmasterDataForAssetSearch().pipe(takeUntil(this.subscription$)).subscribe(x => {
      this._assetSearchMasterDataService.InitializeMasterData(x);
    });

    this._financialClubMasterDataService.getmasterDataForFinancialClub().pipe(takeUntil(this.subscription$)).subscribe(data => {
      this._financialClubMasterDataService.BBNAgent = data?.BBNAgent?.ResultSet?.DataCollection;
      this._financialClubMasterDataService.RVBaloonApplicable = data?.RVBaloonApplicable?.ResultSet?.DataCollection;
    });

    if (this.PROPOSALASSET.controls.ASSETMODELID.value > 0) {
      let request = new mPOSMasterDataRequest();
      request.masterDataOperation = MasterData.PoliceCategory;
      request.DATAS.AssetModelId = this.PROPOSALASSET.controls.ASSETMODELID.value;
      this._masterDataService.GetMasterData(request).pipe(takeUntil(this.subscription$)).subscribe((response) => {
        this._assetSearchMasterDataService.PoliceCategory = response?.ResultSet?.DataCollection;
      });

      let request1 = new mPOSMasterDataRequest();
      request1.DATAS.AssetModelId = this.PROPOSALASSET.controls.ASSETMODELID.value;
      request1.masterDataOperation = MasterData.AssetModelColour;
      this._masterDataService.GetMasterData(request1).pipe(takeUntil(this.subscription$)).subscribe((result) => {
        this._masterDataService.AssetModelColour = result?.ResultSet?.DataCollection;
      });

      if (this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.OperatingLease && this._proposaldataService.PROPOSALASSET.controls.ASSETSELECTIONCDE.value == AssetSelection.Inventory
        && this._formModeService.FormMode != FormMode.VIEW) {
        this.IsInventoryVehicle = true;
        this._proposaldataService.PROPOSALASSET.controls.SALESANDLEASEBACKIND.setValue(false);
      }
    }

    if (this._formModeService.FormMode == FormMode.NEW && this._proposaldataService.PROPOSALASSET.controls.ASSETSELECTIONCDE.value == "") {
      this._proposaldataService.PROPOSALASSET.controls.ASSETSELECTIONCDE.setValue(AssetSelection.Purchase);
    }

    this._calculationService.UpdateCalculatedFields();
    this._proposalManagerService.loadSupplier();

    // against SOCD-27983
    if (this._dataService.PROPOSALFINANCIALAGREEMENT.value.TOTALFIRSTPAYMENT == 0 && this._formModeService.FormMode != FormMode.NEW) {
      //this._calculationService.CreateFinlAgreementDetails();
      this._proposalManagerService.FirstPayment;
      this._calculationService.CalculateFirstPayment()
    }

    this.PROPOSALASSET.controls.MODELCDE.valueChanges.subscribe(x => {
      let assetInfoParam = {} as IAssetInfoParams;
      assetInfoParam.AssetConditionCode = this.PROPOSALASSET.controls.CONDITION.value;
      assetInfoParam.AssetModelID = this.PROPOSALASSET.controls.ASSETMODELID.value;
      this._proposalService.ReadAssetConditionAndModel(assetInfoParam).subscribe((response: any) => {
        this._proposalService.getAndsetassetValidationData(response.ResultSet);
      })
    })
  }

  get isViewMode() {
    return this._formModeService.FormMode == FormMode.VIEW;
  }

  valueChangeSubscriptions() {
    let unallocatedExpenseAmount = Number(this._dataService.PROPOSALCOMMISSIONENTITY.value.find(x => x.RowState != DataRowState.Removed)?.PRPLCOMM.UNALLOCATEDEXPENSEAMT);
    if (unallocatedExpenseAmount)
      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.UNALLOCATEDEXPENSEAMT.setValue(unallocatedExpenseAmount);
    else
      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.UNALLOCATEDEXPENSEAMT.setValue(0);
  }

  openAssetType() {
    this._assetDetailsMasterdataService
      .getmasterDataForAssetDetail()
      .pipe(takeUntil(this.subscription$))
      .subscribe((a) => {
        this._assetDetailsMasterdataService.InitializeAssetDetailMasterData(a);
        this._generalService.FormMode = FormMode.VIEW;
        this.assetTypeFlag = true;
        // this._queueService = QueueOperation.VIEW;

        // const dialogRef = this.dialog.open(AssetTypeComponent, {
        //   width: '900px',
        //   height: '100%',
        //   position: { right: '1px', top: '1px' },
        //   panelClass: 'cdk-overlay-pane-custom',
        //   disableClose: true,
        //   data: { "id": 1234 },
        // });

        //     dialogRef.afterClosed().subscribe(result => {
        //       if (result != undefined) {

        //       }
        //     });
        //   });

      })
  }

  closeAssetType() {
    this.assetTypeFlag = true;
  }

  // commissionChildOutput(event : any){
  //   this.commissionFlag = true;
  // }

  openAssetSubType() {
    this._truckMasterDataService.getmasterDataForTruckDetail().pipe(takeUntil(this.subscription$)).subscribe(x => {
      this._truckMasterDataService.InitializeTruckDetailMasterData(x);
      const dialogRef = this.dialog.open(TruckDetailComponent, {
        width: '70%',
        height: '100%',
        position: { right: '1px', top: '1px' },
        panelClass: 'cdk-overlay-pane-custom',
        disableClose: true,
        data: { "id": 1235 },
      });
      dialogRef.afterClosed().subscribe(result => {
      });
    });

    // return;
    // const dialogRef = this.dialog.open(AssetSubTypeComponent, {
    //   width: '360px',
    //   height: '100%',
    //   position: { right: '1px', top: '1px' },
    //   disableClose: true,
    //   data: { "id": 1235 },
    // });
    // dialogRef.afterClosed().subscribe(result => {
    // });
  }

  openAssetModel() {
    const dialogRef = this.dialog.open(AssetModelComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: ['cdk-overlay-pane-custom','asset-model-dialog'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if ((result != null || result != undefined) && typeof result === 'object') {
        this.loadAsset(result)
      }
    });
  }

  openSupplier() {
    const dialogRef = this.dialog.open(DealerSupplierSearchComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 1236 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined && result != true) {
        this._proposaldataService.PROPOSALASSET.controls.SUPPLIERNAME.setValue(result.BUSINESSPARTNERNME);
        this._proposaldataService.PROPOSALASSET.controls.BPINTRODUCERID.setValue(result.BUSINESSPARTNERID);
        this._proposaldataService.PROPOSALASSET.controls.ROLECDE.setValue(result.ROLECDE);
        if (this._proposaldataService.PROPOSALASSET.controls.RowState.value != DataRowState.Added) {
          this._proposaldataService.PROPOSALASSET.controls.RowState.setValue(DataRowState.Updated);
        }
      }
    });
  }

  openAssetModelOL() {
    const dialogRef = this.dialog.open(AssetModelOlComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 1237 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });

  }

  SLBClicked(event: any): void {
    if (event != undefined) {
      if (event) {
        if (this._proposaldataService.CurrentApplicant.value.PROPOSALAPPLICANT.ROLECDE == ApplicantRoleCode.Borrower != null) {

          this.ProposalInfoParams.IdCardNumber = this._proposaldataService.CurrentApplicant?.value.PROPOSALAPPLICANTIDDETAIL?.filter(x => x.IDTYPECDE === IDTypeCode.KTP)[0]?.IDTYPENBR;//"ID 425606";
          this.ProposalInfoParams.IdCardTyp = IDTypeCode.KTP;
          this._proposalService.ReadExistingBP(this.ProposalInfoParams).pipe(takeUntil(this.subscription$)).subscribe(res => {
            this._proposaldataService.PROPOSALASSET.controls.BPINTRODUCERID.setValue(res?.BUSINESSPARTNERID);
          });

          this._proposaldataService.PROPOSALASSET.controls.ROLECDE.setValue(ApplicantRoleCode.Dealer);
          if (this._proposaldataService.CurrentApplicant.value.PROPOSALAPPLICANTMAIN.APPLICANTTYP == "I")
            this._proposaldataService.PROPOSALASSET.controls.SUPPLIERNAME.setValue(this._proposaldataService.CurrentApplicant.value.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.FIRSTNME);
          else if (this._proposaldataService.CurrentApplicant.value.PROPOSALAPPLICANTMAIN.APPLICANTTYP != "I")
            this._proposaldataService.PROPOSALASSET.controls.SUPPLIERNAME.setValue(this._proposaldataService.CurrentApplicant.value.COMPANYAPPLICANT.PROPOSALAPPLICANTCOMPANY.NAME);

          if (this._proposaldataService.PROPOSALASSET.controls.SUPPLIERNAME.value == null || this._proposaldataService.PROPOSALASSET.controls.SUPPLIERNAME.value == "") {
            //Show message accordingly Message.ErrorMessage("msgSelectBorrowerApplicant");
            //Uncheck SLB checkbox //chkSalesAndLeaseBack.IsChecked = false;
            this._msgService.showMesssage("msgSelectBorrowerApplicant", MessageType.Error);
            this._proposaldataService.PROPOSALASSET.controls.SALESANDLEASEBACKIND.setValue(false);
            return;
          }
          else
            this._proposaldataService.PROPOSALASSET.controls.SALESANDLEASEBACKIND.setValue(true);
        }
      }
      else {
        if (this._proposaldataService.PROPOSALAPPLICANT.value.filter(p => p.PROPOSALAPPLICANT.ROLECDE == ApplicantRoleCode.Borrower)[0] != null) {
          this._proposaldataService.PROPOSALASSET.controls.SUPPLIERNAME.setValue('');
          this._proposaldataService.PROPOSALASSET.controls.BPINTRODUCERID.setValue(0);
        }
        this._proposaldataService.PROPOSALASSET.controls.SALESANDLEASEBACKIND.setValue(false);
      }
    }
  }
  childOutput(event: any) {
    this.assetTypeFlag = false;
  }

  CalculationTrigger() {
    //if (this._proposaldataService.PROPOSALREPAYMENTPLANENTITYCOL.controls.filter(x => x.controls.RowState.value != DataRowState.Removed).length == 0)
    {
      //-- temp set value for OL case
      this._calculationService.ApplyAssetConfigurations(false, this._proposaldataService.PROPOSALARTICLE.controls[this._proposaldataService.PROPOSALARTICLE.value.length - 1], false);
      //this._calculationService.ResetRentalDetail();
      //this._proposaldataService.PROPOSAL.controls.FINANCETYP.patchValue(FinanceType.OperatingLease);



      if (this._proposaldataService != null && this._proposaldataService != null &&  //checks for migration
        this._proposaldataService.PROPOSAL != null && this._proposaldataService.PROPOSALASSET != null &&
        this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.OperatingLease &&
        this._proposaldataService.PROPOSALASSET.value.MIGRATIONIND == true) {
        if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.ORIGINALSTARTDTE == null) {
          this._msgService.showMesssage("msgActualStartDateMissing", MessageType.Warning);
          return;
        }
        if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.ORIGINALSTARTDTE != null && this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.ORIGINALSTARTDTE > this._storageService.GetUserInfo().ProcessingDate) {
          this._msgService.showMesssage("msgGreatercurrentprocessingDate", MessageType.Warning);
          return;
        }

        else if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.ORIGINALTRM <= 0) { ///commenting as this field doesnt exist on Asset screen
          this._msgService.showMesssage("msgOriginalTermsMissing", MessageType.Warning);
          return;
        }
        else if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.ORIGINALTRM <= this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.CONTRACTTRM) {
          this._msgService.showMesssage("msgOriginalTermsShouldBeGreater", MessageType.Warning);
          return;
        }
        else if (this._proposaldataService.PROPOSAL.value.ORIGINALCONTRACTNBR == "") {
          this._msgService.showMesssage("msgOldContNumberMissing", MessageType.Warning);
          return;
        }
      }
      if (!this.invalidControlsValidity()) {
        return;
      }
      // if (!this.Controller.CommissionCalcInd
      //   && !this._proposaldataService.PROPOSAL.value.ISMCOMCAMPAIGN
      //   && !this._proposaldataService.PROPOSAL.value.MCOMDEALER && this._proposaldataService.PROPOSAL.value.FINANCETYP != FinanceType.OperatingLease) {
      //   CustomeMessageBox customMessage = new CustomeMessageBox(Utilities.GetMessageDescfrmCode("msgCalculateCommissionIndicator") + "\nDo you want to calculate commission?", CustomeMessageBox.MessageType.Confirm);
      //   customMessage.OKButton.Click += (obj, args) => {
      //     if (this.Controller.DataContext.PROPOSALAPPLICANT.m_current[0].INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.ISOTOEMPLOYEEIND)
      //       this.Controller.DataContext.PROPOSALAPPLICANT.m_current[0].INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.CALCULATECOMMISSIONIND = true;

      this._calculationService.ResetRentalDetail();
      if (!this._dataService.PROPOSAL.value.ISMCOMCAMPAIGN && !this._dataService.PROPOSAL.value.MCOMDEALER && this._dataService.PROPOSAL.value.FINANCETYP !== FinanceType.FinanceLease) {
        let borrower = this._dataService.PROPOSALAPPLICANT.value.find(x => x.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower) as IProposalApplicantEntity;
        if ((borrower.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.ISOTOEMPLOYEEIND && borrower.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.CALCULATECOMMISSIONIND) || ((!borrower.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.ISOTOEMPLOYEEIND && !borrower.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.CALCULATECOMMISSIONIND))) {
          this._calculationService.CalculateAllOJKComissions();
          this.SetFirstInstalmentindicator();
          this.Calculate()
        }
        else if (borrower.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.ISOTOEMPLOYEEIND && !borrower.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.CALCULATECOMMISSIONIND) {
          var dialog = this._customDialog.openDialog("Confirmation", "System will not perform any commission calculations. Do you want to calculate commission?", false, "Yes", "No");
          dialog.afterClosed().subscribe(
            result => {
              if (result === "ok") {
                let applicant = this._dataService.PROPOSALAPPLICANT.controls.find(x => x.value.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower) as FormGroup<IProposalApplicantEntity>;
                if (applicant)
                  applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL.controls.CALCULATECOMMISSIONIND.setValue(true);
                this._calculationService.CalculateAllOJKComissions();
                this.SetFirstInstalmentindicator();
                this.Calculate()
              }
              else {
                this.SetFirstInstalmentindicator();
                this.Calculate()
              }
            }
          );
        }
      }
      else {
        this.SetFirstInstalmentindicator();
        this.Calculate()
      }
      //     return;
      //   };
      //   customMessage.CancelButton.Click += (obj, args) => {
      //     EnableReCalOJKButton();

      //     this.SetFirstInstalmentindicator();
      //     this.Calculate();
      //   };
      //   customMessage.Show();
      // }
      // else {
      //   this.SetFirstInstalmentindicator();
      //   this.Calculate();
      // }
      // if (this.Calculate()) {
      //   this._calculationService.setHelperValues();
      //   this._proposalManagerService.isCalcButtonEnabled = false;
      //   this._proposalManagerService.CalculateInclExclValues();
      //   this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.DEALERPOAMOUNT.setValue(this._proposalManagerService.DealerPOAmount());
      // }
    }
  }

  private invalidControlsValidity(): boolean {
    var isValid = true;
    [...this._msgService.ErrorMessages.entries()].filter(([k, v]) => {
      if (k.split('-')[0] == 'Assets') {
        this._toastr.warning(v);
        isValid = false;
      }
    })
    return isValid;
  }

  private SetFirstInstalmentindicator() {
    if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT != null
      && this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.RENTALMODETYP == RentalMode.ADVANCE
      && this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.FINANCETYP != FinanceType.Refinance && this._proposaldataService.PROPOSAL.value.ISMCOMCAMPAIGN != true) {
      //chkDealerFirstInstalmentind.IsEnabled = true;
    }
    else {
      //chkDealerFirstInstalmentind.IsChecked = false;
      //chkDealerFirstInstalmentind.IsEnabled = false;
    }
    this.DownpaymentSubsidyValidation();
  }

  private DownpaymentSubsidyValidation() {
    //if (this.Mode != FormMode.View) {
    if (this._proposaldataService != null && this._proposaldataService.ASSETENTITY.value.PROPOSALSUBSIDYDETAIL != null &&
      this._proposaldataService.ASSETENTITY.value.PROPOSALSUBSIDYDETAIL.SUBSIDYTYPECDE == SubsidyType.InstallmentSubsidy &&
      this._proposaldataService.ASSETENTITY.value.PROPOSALSUBSIDYDETAIL.ADJUSTMENTTYPECODE == AdjustmentType.StartTerms) {
      //this.chkDealerFirstInstalmentind.IsEnabled = false;
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.INSTALMENTPAYTOINTRODUCER.setValue(false);
    }
    else if (this._proposaldataService != null && this._proposaldataService.PROPOSALFINANCIALAGREEMENT != null && this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.RENTALMODETYP == RentalMode.ADVANCE && this._proposaldataService.PROPOSAL.value.ISMCOMCAMPAIGN != true) {
      //this.chkDealerFirstInstalmentind.IsEnabled = true;
    }
    //}
  }

  private Calculate(): boolean {
    let msg = "";

    if (this._proposaldataService.PROPOSALARTICLE.length == 0 &&
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT == null)
      return false;

    if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.GPALLOWEDIND && this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.GPFREQUENCY == null) {
      this._msgService.showMesssage("GPfrequencyNotSelected", MessageType.Warning);
      return false;

    }
    // else if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.CONTRACTTRM < this._proposalManagerService.ContractMinTerms || this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.CONTRACTTRM > this._proposalManagerService.ContractMaxTerms) {
    //   this._msgService.showMesssage("msgIncorrectTerms", MessageType.Error);
    //   return false;
    // }

    // if (this._proposaldataService.PROPOSAL.value.FINANCETYP != FinanceType.Refinance) {
    //   let error = "";
    //   let marketing: Array<CommissionValidation> = this._proposalManagerService.IsCommissionValid(CommissionType.MarketingCommission, 1);
    //   if (marketing != null && marketing.length > 0) {

    //     if (marketing[0].DevisionType == CommissionDivisionType.JP1) {
    //       this._msgService.showMesssage("msgJP1MarkGrtOne", MessageType.Warning);
    //     }
    //     else if (marketing[0].DevisionType == CommissionDivisionType.JP2) {
    //       this._msgService.showMesssage("msgJP2MarkGrtOne", MessageType.Warning);
    //     }
    //     return false;
    //   }
    //   let ProvisionFee: Array<CommissionValidation> = this._proposalManagerService.IsCommissionValid(CommissionType.ProvisionFeeCommission, 1);
    //   if (ProvisionFee != null && ProvisionFee.length > 0) {

    //     if (ProvisionFee[0].DevisionType == CommissionDivisionType.JP1) {
    //       this._msgService.showMesssage("msgJP1PrvnGrtOne", MessageType.Warning);
    //     }
    //     else if (ProvisionFee[0].DevisionType == CommissionDivisionType.JP2) {
    //       this._msgService.showMesssage("msgJP2PrvnGrtOne", MessageType.Warning);
    //     }
    //     return false;
    //   }

    //   let AdminFee: Array<CommissionValidation> = this._proposalManagerService.IsCommissionValid(CommissionType.AdminFeeCommission, 1);
    //   if (AdminFee != null && AdminFee.length > 0) {

    //     if (AdminFee[0].DevisionType == CommissionDivisionType.JP1) {
    //       this._msgService.showMesssage("msgJP1AdmnGrtOne", MessageType.Warning);
    //     }
    //     else if (AdminFee[0].DevisionType == CommissionDivisionType.JP2) {
    //       this._msgService.showMesssage("msgJP2AdmnGrtOne", MessageType.Warning);
    //     }
    //     return false;
    //   }
    //   let InsranceCommission: Array<CommissionValidation>  = this._proposalManagerService.IsCommissionValid(CommissionType.InsuranceCommission, 1);
    //   if (InsranceCommission != null && InsranceCommission.length > 0) {

    //     if (InsranceCommission[0].DevisionType == CommissionDivisionType.JP1) {
    //       this._msgService.showMesssage("msgJP1InsrGrtOne", MessageType.Warning);
    //     }
    //     else if (InsranceCommission[0].DevisionType == CommissionDivisionType.JP2) {
    //       this._msgService.showMesssage("msgJP2InsrGrtOne", MessageType.Warning);
    //     }
    //     return false;
    //   }
    //   let SOFCommission: Array<CommissionValidation>  = this._proposalManagerService.IsCommissionValid(CommissionType.SOFCommission, 1);
    //   if (SOFCommission != null && SOFCommission.length > 0) {

    //     if (SOFCommission[0].DevisionType == CommissionDivisionType.JP1) {
    //       this._msgService.showMesssage("msgJP1CommGrtOne", MessageType.Warning);
    //     }
    //     else if (SOFCommission[0].DevisionType == CommissionDivisionType.JP2) {
    //       this._msgService.showMesssage("msgJP2CommGrtOne", MessageType.Warning);
    //     }
    //     return false;
    //   }
    // }

    if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT?.value.GPALLOWEDIND && this._proposaldataService.PROPOSALFINANCIALAGREEMENT?.value.GPTERMS == 0) {
      this._msgService.showMesssage("IncoGPTerms", MessageType.Warning);
      return false;

    }
    if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT?.value.GPALLOWEDIND && this._proposaldataService.PROPOSALFINANCIALAGREEMENT?.value.GPFREQUENCY == 0) {
      this._msgService.showMesssage("IncoGPFreq", MessageType.Warning);
      return false;

    }
    ///is proposal data valid


    if (!this._calculationService.IsProposalDataValid(false, false))
      return false;
    let message = this._proposalManagerService.ValidateCalculationParameters();
    if (message != "true") {
      this._msgService.showMesssage(message, MessageType.Warning);
      return false;
    }
    //if (Mode != FormMode.View) {
    if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT != null) {
      // bool returnResult = Controller.ValidateMandatoryFinancialDetails(this._proposaldataService.PROPOSALFINANCIALAGREEMENT, out msg);
      // if (!returnResult) {
      //   // Message.ErrorMessage("Financial Mandatory data is missing.");
      //   //Utilities.ShowMessage((int)ReturnCode.Exception, ref (this.ParentContainer as ProposalNew).validator, null, "Financial Mandatory data is missing.");
      //   Utilities.ShowMessage(msg, MessageType.Information, ref(this.ParentContainer as ProposalNew).validator);
      //   return false;
      // }

      // if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.RESIDUALAMT > this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.ADJUSTEDFINANCEDAMT) {
      //   //Message.ErrorMessage("Residual Value can not be equal or greater than Finance Amount.");
      //   //Utilities.ShowMessage((int)ReturnCode.Exception, ref (this.ParentContainer as ProposalNew).validator, null, "Residual Value can not be greater than Net Finance Amount.");
      //   Utilities.ShowMessage("RsdualValueGrtrthnNtFinancAmt", MessageType.Information, ref(this.ParentContainer as ProposalNew).validator);
      //   return false;
      // }


      //Pending: read data from lookup service - GetFPCondiguraitonEntiry and set AMORTIZATIONMTD and RENTALCALCMTD
      // if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.AMORTIZATIONMTD=="" || this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.RENTALCALCMTD=="" || this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.FREQUENCYCDE=="" || this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.RENTALMODETYP=="")
      // {
      //   this._msgService.showMesssage("msgMissingFinancialMandatorydata", MessageType.Warning);
      //     return false;
      // }
      if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.RESIDUALAMT > this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.ADJUSTEDFINANCEDAMT) {
        this._msgService.showMesssage("RsdualValueGrtrthnNtFinancAmt", MessageType.Warning);
        return false;
      }
      if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.FINANCETYP == FinanceType.OperatingLease) {
        // console.log(this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.FINANCETYP);

        if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.MONTHLYLEASEFEEAMT <= 0) {
          this._msgService.showMesssage("msgPlzInputMonthlyLeaseFeeAmt", MessageType.Warning);
          this._calculationService.ResetRentalDetail();
          this.EnableCalculateButton();
          return false;
        }

        if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.MONTHLYMAINTENANCECOST <= 0) {
          this._msgService.showMesssage("msgPlzInputMonthlyMaintCostFeeAmt", MessageType.Warning);
          this._calculationService.ResetRentalDetail();
          this.EnableCalculateButton();
          return false;
        }
      }
    }

    // let address = {} as IPRPL_APLT_ADDSInfo;
    // Controller.PROPOSAL_ASSET.FINEYPECNFG = LookupCache.proposallookup.PROPOSALFPLOOKUP.FINEYPECNFG;
    //this._proposaldataService.ASSETENTITY.controls.FINEYPECNFG.patchValue(this._proposalManagerService.FINEYPECNFG);

    // if (Controller.SubsidiaryAddressTypeCode == BPAddressConfiguration.PayerRegisterAddress)
    //   address = Controller.SubsidiaryAddress.PROPOSALAPPLICANTADDRESS;
    // else if (this.Controller.DataContext.PROPOSALAPPLICANT.First(p => p.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower).ADDRESS.Count > 0
    //   && this.Controller.DataContext.PROPOSALAPPLICANT.First(p => p.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower).ADDRESS.All(j => j.PROPOSALADDRESSTYPEDETAIL != null)
    //   && this.Controller.DataContext.PROPOSALAPPLICANT.First(p => p.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower).ADDRESS.Any(x => x.PROPOSALADDRESSTYPEDETAIL.Count > 0)
    //   && this.Controller.DataContext.PROPOSALAPPLICANT.First(p => p.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower).ADDRESS.First(x => x.PROPOSALADDRESSTYPEDETAIL.Any(j => j.DEFAULTIND)) != null)
    //   address = this.Controller.DataContext.PROPOSALAPPLICANT.First(p => p.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower).ADDRESS.First(x => x.PROPOSALADDRESSTYPEDETAIL.Any(j => j.DEFAULTIND)).PROPOSALAPPLICANTADDRESS;
    // if (Controller.JP2CommSysInd)
    //   await Controller.UpdateJP2CommissionSchemes();

    if (this._proposalManagerService.isFlat) {
      this._proposalManagerService.isChartCall = true;
      this._proposalManagerService.isFlatAppliedCustomerSet = true;//setcustomermargin() should not call at this point
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.APPLIEDCUSTOMERRTE.setValue(this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.APPLIEDCUSTOMERRTECALCULATED);
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.FINANCERRTEEFFECTIVE.setValue(this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.FINANCERRTEFLAT);
      this._proposalManagerService.isFlatAppliedCustomerSet = false;
      this._proposalManagerService.isChartCall = false;
    }
    if (!this._proposalManagerService.isRefinance) {
      this._proposalManagerService.GPFrequency = this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.GPFREQUENCY;
    }

    //-- Set temporary value for test
    // this._proposaldataService.ASSETENTITY.value.PROPOSALFINANCIALAGREEMENT.NOOFMONTHSDELAY = 1
    // this._proposaldataService.ASSETENTITY.value.PROPOSALFINANCIALAGREEMENT.VATRTE = 10.00

    //-- Invoke Calculation service
    this.CalculationParam.AssetEntity = this._proposaldataService.ASSETENTITY.value as IAssetEntity;
    var proposalInfoParam = {} as IProposalInfoParm;
    proposalInfoParam.ApplicantType = this._proposaldataService.PROPOSAL.value.PROPOSALTYPECDE == '00001' ? "I" : "C";
    this.CalculationParam.proposalInfoParam = proposalInfoParam;
    this.CalculationParam.roundingEntity = this._proposaldataService.PROPOSALROUNDINGTEMPLATE.value as IProposalRoundingTemplateEntity;
    this.CalculationParam.RentalTemplateEntity = this._proposaldataService.PROPOSALTEMPLATERENTALINT.value as IPRPL_TPLE_RNTL_INTInfo;
    this.CalculationParam.RentalTemplateEntity.FINANCETYP = this._proposaldataService.PROPOSAL.value.FINANCETYP;
    this.CalculationParam.RentalTemplateEntity.TAXADDSTYPECDE = "00001";
    this.CalculationParam.InsuranceContractIncl = this._proposalManagerService.InsuranceContractInclusiveSum
    this.CalculationParam.applicantAddress = {} as IPRPL_APLT_ADDSInfo;
    this.CalculationParam.ProposalTempCommCongfig = [] as Array<IPRPL_TPLE_COMM_CNFGInfo>
    this.CalculationParam.rentalFrequency = this._calculationService.rentalFrequency
    //this.CalculationParam.proposalInfoParam.RentalDueDateCode=this._proposaldataService.PROPOSALTEMPLATERENTALINT.value.RNTLDUEDATECDE;
    // this.CalculationParam.AssetEntity.PROPOSALFINANCIALAGREEMENT.ADJUSTEDFINANCEDAMT = 25147500.00000;
    this._calculationService.CalculateNetFinanceAmt();
    this._proposalService.Calculate(this.CalculationParam).pipe(takeUntil(this.subscription$)).subscribe(result => {
      //this._calculationService.ResetRentalDetail();
      this.MapperCalculationResponse(result);
      this._calculationService.CalculateOJKTotalIncome();
    })

    //}
    return true;
  }

  private UpdateGridView() {
    // dgRentalDetail.ItemsSource = null;
    // dgRentalDetail.ItemsSource = Controller.CurrentAssetRentalDetailNew;
    // txtFiduciaFee.IsEnabled = Controller.EnabledForCF;
  }

  public EnableCalculateButton() {
    if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT != null && !this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.ISSTRUCTUREDRENTAL && (this._proposalManagerService.CurrentAssetRentalDetail == null || this._proposalManagerService.CurrentAssetRentalDetail.length == 0)) {
      //this._proposalManagerService.IsCalcButtonEnabled=true;
    }
  }

  public CalculateDisburseAmountOTO(chargesamount: number = 0, insuranceamount: number = 0, isetchange: boolean = false): boolean {
    if (this._proposaldataService.PROPOSAL.controls.FINANCETYP.value == FinanceType.Refinance) {
      let amount: number = 0;
      if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.ADJUSTEDFINANCEDAMT.value > 0)
        amount = this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.ADJUSTEDFINANCEDAMT.value - this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.ETAMNTOTO.value;

      if (insuranceamount > 0)
        amount -= insuranceamount;
      else
        amount -= this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.INSURANCEPREMIUM.value;
      if (chargesamount > 0)
        amount -= chargesamount;
      else {
        if (this._proposaldataService.ASSETENTITY.controls.PROPOSALCHARGE) {
          let tempValue: number = 0;
          this._proposaldataService.ASSETENTITY.controls.PROPOSALCHARGE.value.forEach(element => {
            tempValue = tempValue + element.TAXINCULSIVEAMT;
          });
          amount -= tempValue;
        }
      }

      if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.RENTALMODETYP.value == RentalMode.ADVANCE &&
        this._proposalManagerService.RepaymentPlan.length > 0) {
        amount -= this._proposalManagerService.RepaymentPlan[0].PRPLRPMTPLAN.RENTALAMT;
      }

      if (this._proposaldataService.ASSETENTITY.controls.PROPOSALASSET.controls.BBNCHARGES.value > 0) {
        let _taxinclusiveamt: number = 0;
        // this._proposalManagerService.RepaymentPlan.forEach(element => {
        //   // if (p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.BBNCharge)
        //   //_taxinclusiveamt = element.TAXINCULSIVEAMT.value;
        //   //added now
        // });
        this._proposaldataService.ASSETENTITY.controls.PRPLARTICLECOMPONENTENTITYCOL.controls.forEach((p) => {
          if (p.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.value == AmountComponent.GetStringValue(AmountComponent.BBNCharge)) {
            _taxinclusiveamt = p.controls.TAXEXCULSIVEAMT.value;
          }
        })
        amount -= _taxinclusiveamt;
      }
      amount-=this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.OLDCONTRCBL.value;
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.DSBRAMNTOTO.setValue(Number(amount));
      
      if (amount <= 0 && isetchange != true) {
        this._msgService.showMesssage("disbrAmtZero", MessageType.Warning);
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.DSBRAMNTOTO.setValue(0);
        return false;
      }
      this._calculationService.UpdateFinancialAgreementDetail(this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.ETAMNTOTO.value, AmountComponent.ETFromSOLOs, this._proposaldataService.PROPOSAL.value.CURRENCYCDE);
      return true;
    }
    else if (this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.HirePurchase && this._proposaldataService.PROPOSAL.value.ISMCOMCAMPAIGN) {
      let amount: number = 0;
      amount = this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.ASSETAMT.value - this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITAMT.value - this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.ETAMNTOTO.value;
      if (insuranceamount > 0)
        amount -= insuranceamount;
      else {
        if (this._proposaldataService.PRPLINSR !== undefined) {
          amount -= this._proposaldataService.PRPLINSR?.controls.TOTALUPFRONTAMNT.value;
        }
      }

      amount -= this._calculationService.FCReceiveableCharge;

      if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.RENTALMODETYP.value == RentalMode.ADVANCE &&
        this._proposalManagerService.RepaymentPlan.length > 0) {
        amount -= this._proposalManagerService.RepaymentPlan[0].PRPLRPMTPLAN.RENTALAMT;
      }

      if (this._proposaldataService.PROPOSALPROVISIONFEEDETAIL.controls.TOTALPROVISIONFEE.value > 0)
        amount -= this._proposaldataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEUPFRONT.value;

      if (this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.UPFRONTADMINFEE.value > 0)
        amount -= this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.UPFRONTADMINFEE.value;

      if (this._proposaldataService.PRPLCMPTCNFG
        && this._proposaldataService.PRPLCMPTCNFG.value.filter(x => x.AMNTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.PolicyFee)
          && x.AMNTCMPTCNFG == "00003").length > 0) {
        let _taxinclusiveamt: number = 0;
        this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.forEach(element => {
          if (element.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.PolicyFee) && element.value.RowState != DataRowState.Removed)
            _taxinclusiveamt = element.value.TAXINCULSIVEAMT;
        });
        amount -= _taxinclusiveamt;
      }
      if (this._proposaldataService.PRPLCMPTCNFG
        && this._proposaldataService.PRPLCMPTCNFG.value.filter(x => x.AMNTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.FiduciaFee)
          && x.AMNTCMPTCNFG == "00003").length > 0) {
        let _taxinclusiveamt: number = 0;
        this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.forEach(element => {
          if (element.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.FiduciaFee) && element.value.RowState != DataRowState.Removed)
            _taxinclusiveamt = element.value.TAXINCULSIVEAMT;
        });
        amount -= _taxinclusiveamt;
      }

      // if (this._dataService.ProposalEntity.controls.PRPLCMPTCNFG.value != null && this._dataService.ProposalEntity.controls.PRPLCMPTCNFG.value.filter((x) => x.AMNTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.FiduciaFee) && x.AMNTCMPTCNFG == '00003').length > 0) {
      //   this._proposaldataService.ASSETENTITY.controls.PRPLARTICLECOMPONENTENTITYCOL.value.forEach(
      //     (p) => {
      //       if (p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.FiduciaFee))
      //         amount -= p.TAXINCULSIVEAMT;
      //     }
      //   );
      // }
      if (amount <= 0 && isetchange != true) {
        this._msgService.showMesssage("disbrAmtZero", MessageType.Warning);
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.DSBRAMNTOTO.setValue(0);
        return false;
      }
      if (!isNaN(amount))
      {
        // amount -=this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.DSBRAMNTOTO.value;
        if (this._proposaldataService.PROPOSAL.controls.MCOMTOPUPIND.value === true) {
          let allOldComponentSum = this._calculationService.outFlowSum;
          amount += this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.OLDCONTRCBL.value;
          amount -= allOldComponentSum;
        }
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.DSBRAMNTOTO.setValue((+(Math.round((amount) * 100) / 100).toFixed(2)));
      }
      this._calculationService.RemoveArticleComponent(AmountComponent.ETFromSOLOs);
      this._calculationService.UpdateFinancialAgreementDetail(this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.ETAMNTOTO.value, AmountComponent.ETFromSOLOs, this._proposaldataService.PROPOSAL.value.CURRENCYCDE, AssetComponentsFinancialConfiguration.Upfront, this._proposaldataService.PROPOSAL.value.BPINTRODUCERID, 0, AmountClassification.Nettingoff);
      return true;
    }
    return true;
  }

  private MapperCalculationResponse(result: any): boolean {
    if (result.CODE == ReturnCode.Success.Code && result.ResultSet != null) {
      if (this._proposalManagerService.isFlat) {
        this.isfromcalculation = true;
        this._proposalManagerService.isFlatAppliedCustomerSet = true;//setcustomermargin() should not call at this point
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.APPLIEDCUSTOMERRTE.setValue(Math.round((result.ResultSet.CustomerEffectiveRate) * 100000) / 100000);
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.APPLIEDCUSTOMERRTECALCULATED.setValue(Math.round((result.ResultSet.CustomerFlatRate) * 100000) / 100000);// in case of comm/subsidy pass to customer it will reset back
        this._proposalManagerService.isFlatAppliedCustomerSet = false;//
        this.isfromcalculation = false;
      }
      else if (this._proposalManagerService.isEffective) {
        this.isfromcalculation = true;
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.APPLIEDCUSTOMERRTECALCULATED.setValue(Math.round((result.ResultSet.CustomerFlatRate) * 100000) / 100000);
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.APPLIEDCUSTOMERRTE.setValue(Math.round((result.ResultSet.CustomerEffectiveRate) * 100000) / 100000);// in case of comm/subsidy pass to customer it will reset back
        this.isfromcalculation = false;
      }
      if (this._proposaldataService.PROPOSAL.value.ISPACKAGE) {
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.APPLIEDCUSTOMERRTE.setValue(Math.round((result.ResultSet.CustomerEffectiveRate) * 100000) / 100000);
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.APPLIEDCUSTOMERRTECALCULATED.setValue(Math.round((result.ResultSet.CustomerFlatRate) * 100000) / 100000);
      }
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.FINANCERRTEEFFECTIVE.setValue(result.ResultSet.FinancerEffectiveRate.toFixed(5));
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.FINANCERRTEFLAT.setValue(result.ResultSet.FinancerFlatRate.toFixed(5));

      // #region Subsidy Calculation

      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.FINANCEDAMT.setValue(this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.ADJUSTEDFINANCEDAMT.value);
      if (!this._proposaldataService.PROPOSALSUBSIDYDETAIL.value.SUBSIDYTYPECDE && this._proposaldataService.ASSETENTITY.value.PROPOSALSUBSIDYDETAIL.SUBSIDYTYPECDE != SubsidyType.InterestSubsidyFixAmount) {
        this._proposaldataService.PROPOSALSUBSIDYDETAIL.controls.SUBSIDYAMOUNT.patchValue(result.ResultSet.SubsidyAmount);
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.DEALERSUBSIDYAMT.patchValue(result.ResultSet.SubsidyAmount);

        this._calculationService.removeSubsidyComponents();
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.TOTALDOWNPAYMENT.patchValue(0);
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.DEALERSUBSIDYAMT.patchValue(0);
        this._proposaldataService.PROPOSALSUBSIDYDETAIL.controls.SUBSIDYAMOUNT.patchValue(0);
        if (!this._proposaldataService.PROPOSALSUBSIDYDETAIL.value.SUBSIDYTYPECDE &&
          (this._proposaldataService.PROPOSALSUBSIDYDETAIL.value.SUBSIDYTYPECDE == SubsidyType.DownPaymentSubsidy ||
            this._proposaldataService.PROPOSALSUBSIDYDETAIL.value.SUBSIDYTYPECDE == SubsidyType.InterestSubsidyRateBased ||
            this._proposaldataService.PROPOSALSUBSIDYDETAIL.value.SUBSIDYTYPECDE == SubsidyType.InstallmentSubsidy)) {
          this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.DEALERSUBSIDYAMT = result.ResultSet.SubsidyAmount;
          this._proposaldataService.PROPOSALSUBSIDYDETAIL.value.SUBSIDYAMOUNT = result.ResultSet.SubsidyAmount;
          if (this._proposaldataService.PROPOSALSUBSIDYDETAIL.value.SUBSIDYTYPECDE == SubsidyType.DownPaymentSubsidy) {
            this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.FINANCEDAMT.patchValue(this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.FINANCEDAMT - this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.DEALERSUBSIDYAMT);
            this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.TOTALDOWNPAYMENT.patchValue(this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.DEALERSUBSIDYAMT + this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.CASHDEPOSITAMT);
          }
        }

        if (!this._proposaldataService.PROPOSALSUBSIDYDETAIL.value.SUBSIDYTYPECDE && this._proposaldataService.PROPOSALSUBSIDYDETAIL.value.SUBSIDYTYPECDE == SubsidyType.InterestSubsidyRateBased) {
          this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.DEALERSUBSIDYAMT.patchValue(this._proposaldataService.PROPOSALSUBSIDYDETAIL.value.SUBSIDYAMOUNT);
        }

        this._calculationService.UpdateSubsidyDetail();
      }
      // #endregion

      // #region Misssing Insurance Subsidy Region

      // #endregion
      //-- To DO
      // if (!this._proposalManagerService.OJKCommissionEffectiveInd && this._proposalManagerService.MarketingCommissionInd) {
      //   if (CommissionCalculationMethod.Fixed != this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.COMMMTHDCDE)
      //     this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.OJKMARKETINGCOMMISSIONAMT = this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.COMMFIXAMT = result.ResultSet.CommissionResponsePAram.TotalCommission;

      // }

      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.TOTALJP1COMMAMOUNT.setValue(result.ResultSet.CommissionResponsePAram.TotalCommission);
      //this._proposalManagerService.updateTotalCommission();
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.REVERSECUSTRTE.setValue(result.ResultSet.CalculatedIRR);

      //changed by Annam - OL Merging //Business implemented for NMSIR
      if (this._proposaldataService.PROPOSAL.value.FINANCETYP != null && this._proposaldataService.PROPOSAL.value.FINANCETYP != FinanceType.OperatingLease)
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.NMSIR.patchValue(result.ResultSet.AmortizationResponse.NetIRR);
      else
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.NMSIR.patchValue(0);

      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.TOTALGPINTERESTAMNT.setValue(result.ResultSet.GracePeriodParam.GracePeriodInterestAmount);
      //-- To DO
      // if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.COMMFIXAMT > 0 && this._proposalManagerService.MarketingCommissionInd) {
      //   this._proposalManagerService.RemoveArticleComponent(AmountComponent.AllCommissions);
      //   this._proposalManagerService.RemoveArticleComponent(AmountComponent.JP1Commission);
      //   this._proposalManagerService.UpdateFinancialAgreementDetail(this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.COMMFIXAMT, AmountComponent.JP1Commission, this._proposalManagerService.ProposalCurrencyCode, null, this._proposaldataService.PROPOSAL.value.BPINTRODUCERID, 1, AmountClassification.Payable);
      // }
      //this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.PropertyChanged -= PROPOSAL_FINANCIAL_AGRM_PropertyChanged;
      //this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.PropertyChanged += null;

      //this._calculationService.ResetRentalDetail();
      this._calculationService.FillAssetRepaymentPlan(result.ResultSet);
      //this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.PropertyChanged += new PropertyChangedEventHandler(PROPOSAL_FINANCIAL_AGRM_PropertyChanged);

      // #region WHT Picking for Charges

      // #region First Instalment Component
      this._calculationService.RemoveArticleComponent(AmountComponent.FirstRental);
      if (this._proposaldataService.PROPOSAL.value.FINANCETYP != FinanceType.Refinance && this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.RENTALMODETYP == RentalMode.ADVANCE) {
        if (this._proposaldataService.PROPOSALSUBSIDYDETAIL.value != null
          && !this._proposaldataService.PROPOSALSUBSIDYDETAIL.value.SUBSIDYTYPECDE
          && this._proposaldataService.PROPOSALSUBSIDYDETAIL.value.SUBSIDYTYPECDE == SubsidyType.InstallmentSubsidy
          && this._proposaldataService.PROPOSALSUBSIDYDETAIL.value.ADJUSTMENTTYPECODE == AdjustmentType.StartTerms) {
          this._calculationService.RemoveArticleComponent(AmountComponent.FirstRental);
        }
        else {
          let classification = {} as AmountClassification;
          if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.INSTALMENTPAYTOINTRODUCER.value)
            classification = AmountClassification.Nettingoff;
          else
            classification = AmountClassification.None;
          this._calculationService.UpdateFinancialAgreementDetail(this._proposalManagerService.RepaymentPlan[0].PRPLRPMTPLAN.GROSSRENTAL, AmountComponent.FirstRental, this._proposaldataService.PROPOSAL.controls.CURRENCYCDE.value, AssetComponentsFinancialConfiguration.Upfront, this._proposaldataService.PROPOSAL.value.BPINTRODUCERID, 1, classification, this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.INSTALMENTPAYTOINTRODUCER);

        }
      }
      // #rendregion

      ///*********************************************************
      ///        WHT Calculation for Charges.
      //Task<ResponseObject<TaxWHTResponseParam>> taskWHT = Controller.CalculateWHTTax(Controller.PROPOSAL_ASSET, Controller.GetRentalStructure(Controller.PROPOSAL_FINANCIAL_AGRM), Controller.DataContext.PROPOSALROUNDINGTEMPLATE, Controller.DataContext.PROPOSALTEMPLATERENTALINT, Controller.InsuranceContractInclusiveSum, address);
      //ResponseObject<TaxWHTResponseParam> resultWHT = await taskWHT;
      //taskWHT.Dispose();
      //if (resultWHT.CODE == (int)ReturnCode.Success && resultWHT.ResultSet != null)
      //{
      //    IEnumerable<TaxAmountComponentResponse> taxComponentResponse = resultWHT.ResultSet.TaxAmountComponentResponse.Where(k => k.AmountComponentCode == AmountComponent.InsuranceCommission || k.AmountComponentCode == AmountComponent.ChargeReceivable);
      //    if (taxComponentResponse != null && taxComponentResponse.Count() > 0)
      //        Controller.ExtractComponentTaxes(taxComponentResponse.ToGenericCollection(), Controller.PROPOSAL_ASSET, false);
      //}


      //***********************************************************************
      // #rendregion

      // #region JP1 Commission Tax
      //-- To DO
      // if (result.ResultSet.CommissionResponsePAram.CommissionParam.CalculationMethod != CommissionCalculationMethod.Fixed) {
      //   this._proposalManagerService.CalculateChargeTax(AmountComponent.JP1Commission, result.ResultSet.CommissionResponsePAram.TotalCommission, PayableTypeCode.CommissionexpenseJP1);
      // }

      // #rendregion

      this.UpdateGridView();
      //Controller.PROPOSAL_FINANCIAL_AGRM.PropertyChanged += PROPOSAL_FINANCIAL_AGRM_PropertyChanged;
      //-- To DO
      //this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.CHARGEAMT.patchValue(this._proposalManagerService.TotalChargesTaxInclusive);

      if (this._proposalManagerService.TotalFinancedCharges > 0)
        this._calculationService.UpdateFinancialAgreementDetail(this._proposalManagerService.TotalFinancedCharges, AmountComponent.ContractFinancedCharges, this._proposaldataService.PROPOSAL.controls.CURRENCYCDE.value, AssetComponentsFinancialConfiguration.Finance, null);
      this._calculationService.UpdateFinancialAgreementDetail(this._proposalManagerService.NonFinanceChargeAmt, AmountComponent.ApplicationUpfrontCharges, this._proposaldataService.PROPOSAL.controls.CURRENCYCDE.value, null, null);


      let isdsbramtvalid = this.CalculateDisburseAmountOTO();
      if (!isdsbramtvalid) {
        this._calculationService.ResetRentalDetail();
        return false;
      }
      //-- To Do
      //this._proposalManagerService.IntroducerAvailable = true;
      // btnCalculate.IsEnabled = false;
      // btnInsuranceComTaxDetail.IsEnabled = true;
      if (this._proposaldataService.PROPOSAL.value.FINANCETYP != FinanceType.Refinance) {
        //btnCommissionDetail.IsEnabled = true;
      }


      if (this._proposalManagerService.OJKCommissionEffectiveInd) {
        if (CommissionCalculationMethod.Fixed != this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.COMMMTHDCDE)
          this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.OJKMARKETINGCOMMISSIONAMT.patchValue(result.ResultSet.CommissionResponsePAram.TotalCommission);
        //if (Controller.PROPOSAL_FINANCIAL_AGRM.COMMFIXAMT ==0)
        this._calculationService.ReCalculateOJKCommission(AmountComponent.JP1Commission, CommissionType.MarketingCommission);
      }

      //-- To Do
      //Adding Due to Marketing Commission is not Calculating on Calculate Button Clicking So I Handling issue to add these line of Code Against Issue SOCD-10357
      if (this._proposaldataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY.length > 0) {
        var marketComm = this._proposaldataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].PRPLCOMMSCHM.filter(p => p.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.MarketingCommission))[0] as IPRPL_COMM_SCHMInfo;
        if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.COMMMTHDCDE != null && this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.COMMMTHDCDE != ''
          && marketComm != null) {
          //if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.COMMFIXAMT > 0 /*&& Controller.PROPOSAL_FINANCIAL_AGRM.COMMFIXAMT != oldcommFixValue*/) {
          let request = new CommissionCalculationParam();
          request.PROPOSALARTICLE = this._proposaldataService.PROPOSALARTICLE.value.find(x => x.PROPOSALARTICLE.RowState != DataRowState.Removed) as IProposalArticleEntity;
          request.COMMISSIONAMNT = this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.COMMFIXAMT;
          //request.COMMISSIONTYPE = currRow.value.COMMISSIONTYPECDE;
          request.CHKEMPLOYEE = this._proposaldataService.PROPOSALAPPLICANT.value[0].INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.ISOTOEMPLOYEEIND;
          request.COMMISSIONCALCIND = this._proposalManagerService.CommissionCalcInd;
          request.BPINTRODUCERID = this._proposaldataService.PROPOSAL.value.BPINTRODUCERID;
          request.COMMISSIONTYPE = CommissionType.GetStringValue(CommissionType.MarketingCommission);
          request.PRPLCMPTCNFG = this._proposaldataService.PRPLCMPTCNFG.value as Array<PROPOSALENTITY.IPRPL_CMPT_CNFGInfo>;
          request.PROPOSALTEMPLATERENTALINT = this._proposaldataService.ProposalEntity.value.PROPOSALTEMPLATERENTALINT as IPRPL_TPLE_RNTL_INTInfo;
          this._proposalService.CalculateCommission(request).subscribe(res => {
            //console.log(res);
            //this._FormState.ResetFormArrayState(this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY, DataRowState.Removed);
            if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.COMMFIXAMT >= 0) {
              if (this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.value.length == 0)
                this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.push(this._proposalForm.PropsalCommissionForm());
              this._proposalManagerService.ProposalCommissionMapper(res?.ResultSet[0] as IProposalCommissionEntity, '00001');
            }
            else {
              if (res.ResultSet[0]?.PRPLCOMM?.UNALLOCATEDEXPENSEAMT) {
                this._dataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.PRPLCOMM.patchValue(res.ResultSet[0]?.PRPLCOMM);
                this._dataService.PROPOSALFINANCIALAGREEMENT.controls.UNALLOCATEDEXPENSEAMT.setValue(res.ResultSet[0]?.PRPLCOMM?.UNALLOCATEDEXPENSEAMT);
                if (this._dataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].value.PRPLCOMM.RowState != DataRowState.Added)
                  this._dataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.PRPLCOMM.controls.RowState.setValue(DataRowState.Updated);
              }
            }
            this._calculationService.setHelperValues();
            this._proposalManagerService.isCalcButtonEnabled = false;
            this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.DEALERPOAMOUNT.setValue(this._proposalManagerService.DealerPOAmount());
            this._calculationService.calculateNMSIR();
            this._calculationService.CalculateTotalAcquisitionAmount();
          });

          //}
          // else {
          //   this.calculateNMSIR();
          //   this._calculationService.CalculateTotalAcquisitionAmount();
          // }
        }
        else {

          // for Unallocated Expense calculation
          let request = new CommissionCalculationParam();
          request.PROPOSALARTICLE = this._proposaldataService.PROPOSALARTICLE.value.find(x => x.PROPOSALARTICLE.RowState != DataRowState.Removed) as IProposalArticleEntity;
          request.COMMISSIONAMNT = this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.COMMFIXAMT;
          request.CHKEMPLOYEE = this._proposaldataService.PROPOSALAPPLICANT.value[0].INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.ISOTOEMPLOYEEIND;
          request.COMMISSIONCALCIND = this._proposalManagerService.CommissionCalcInd;
          request.BPINTRODUCERID = this._proposaldataService.PROPOSAL.value.BPINTRODUCERID;
          request.COMMISSIONTYPE = CommissionType.GetStringValue(CommissionType.MarketingCommission);
          request.PRPLCMPTCNFG = this._proposaldataService.PRPLCMPTCNFG.value as Array<PROPOSALENTITY.IPRPL_CMPT_CNFGInfo>;
          request.PROPOSALTEMPLATERENTALINT = this._proposaldataService.ProposalEntity.value.PROPOSALTEMPLATERENTALINT as IPRPL_TPLE_RNTL_INTInfo;
          this._proposalService.CalculateCommission(request).subscribe(res => {

            if (res.ResultSet[0]?.PRPLCOMM?.UNALLOCATEDEXPENSEAMT && !this._proposalManagerService.ISCFNONMCOMIND) {
              this._dataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.PRPLCOMM.patchValue(res.ResultSet[0]?.PRPLCOMM);
              this._dataService.PROPOSALFINANCIALAGREEMENT.controls.UNALLOCATEDEXPENSEAMT.setValue(res.ResultSet[0]?.PRPLCOMM?.UNALLOCATEDEXPENSEAMT);
              if (this._dataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].value.PRPLCOMM.RowState != DataRowState.Added)
                this._dataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.PRPLCOMM.controls.RowState.setValue(DataRowState.Updated);
            }
            if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.COMMFIXAMT >= 0) {
              if (this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.value.length == 0)
                this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.push(this._proposalForm.PropsalCommissionForm());
              this._proposalManagerService.ProposalCommissionMapper(res?.ResultSet[0] as IProposalCommissionEntity, '00001');
            }

          });

          this._calculationService.setHelperValues();
          this._proposalManagerService.isCalcButtonEnabled = false;
          this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.DEALERPOAMOUNT.setValue(this._proposalManagerService.DealerPOAmount());
          this._calculationService.calculateNMSIR();
          this._calculationService.CalculateTotalAcquisitionAmount();
        }
      }
      else {
        this._calculationService.setHelperValues();
        this._proposalManagerService.isCalcButtonEnabled = false;
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.DEALERPOAMOUNT.setValue(this._proposalManagerService.DealerPOAmount());
      }

      // #rendregion
      /// <summary>
      /// Subjected   : OL Implementation
      /// GAP         : Internal, 1.0
      /// Dated       : 28-07-2017
      /// Remarks     : Last Payment Date Value
      /// </summary>

      // #region OL Implementation
      if (this._proposaldataService.ASSETENTITY != null
        && this._proposaldataService.PROPOSALREPAYMENTPLANENTITYCOL.value.length > 0
        && this._proposaldataService.LASTPROPOSALREPAYMENTPLAN.value.PRPLRPMTPLAN != null
        && this._proposaldataService.LASTPROPOSALREPAYMENTPLAN.value.PRPLRPMTPLAN.RENTALDTE != null)

        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.LASTPAYMENTDTE.patchValue(this._proposaldataService.LASTPROPOSALREPAYMENTPLAN.value.PRPLRPMTPLAN.RENTALDTE);

      // Setting Sales Margin Rate and Amount values for OL
      if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.FINANCETYP == FinanceType.OperatingLease) {
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.MONTHLYLEASECOSTWITHOUTMAINTENANCE.patchValue(result.ResultSet.MonthlyLeaseFeeWithOutMaintenance);
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.SALESMARGINAMT.patchValue(result.ResultSet.SaleMarginAmount);
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.SALESMARGINRTE.patchValue(result.ResultSet.SaleMarginRate.toFixed(5));
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.VATRTE.patchValue(result.ResultSet.VatRate.toFixed(5));

        let _SumOfOLValues = 0;

        _SumOfOLValues = Number(this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.MONTHLYMAINTENANCECOST) + result.ResultSet.MonthlyLeaseFeeWithOutMaintenance;

        if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.MONTHLYLEASEFEEAMT < _SumOfOLValues) {
          this._msgService.showCustomMesssage("Monthly Lease Fee Amount Cannot be Less Than Rental Amount " + _SumOfOLValues, MessageType.Warning);
          // this._calculationService.ResetRentalDetail();
          // return false;
          // validationMessages.Add(new Controls.ValidationMessage() { Type = MessageType.Information, Description = string.Format(Utilities.GetMessageDescfrmCode("MonthlyLeaseFeeAmountCantbeLessThanRntlAmt"), _SumOfOLValues.ToString("N", System.Globalization.CultureInfo.InvariantCulture)) });
          // (this.ParentContainer as ProposalNew).validator.ShowWarningMessages(validationMessages);
        }

      }

      // #rendregion


    }
    else if (result.CODE != ReturnCode.Success.Code) {
      //    ReturnCode error = (ReturnCode)result.CODE;

      //    Utilities.ShowMessage(result.CODE, ref (this.ParentContainer as ProposalNew).validator, null, error.GetLocalizeStringValue());
      //}
      //else
      //{
      //Utilities.ShowMessage(result.CODE, ref (this.ParentContainer as ProposalNew).validator, null, "Exception occurred while performing Calculation !");
      /// <summary>
      /// Subjected   : OL Implementation
      /// GAP         : Internal, 1.0
      /// Dated       : 02-08-2017
      /// Remarks     : Reset OL Fields and Show Validation Message
      /// </summary>

      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.SALESMARGINRTE.patchValue(0);
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.SALESMARGINAMT.patchValue(0);
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.VATRTE.patchValue(0);
      //this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.LASTPAYMENTDTE.patchValue(null);
      this._msgService.showCustomMesssage(result.MESSAGE, MessageType.Warning);
    }
    return true;
  }

  loadAsset(obj: any) {

    this.ResetAssetInfo();
    let bpInfoParam = {} as IBusinessPartnerInfoParm;
    let assetInfoParam = {} as IAssetInfoParams;

    //this._FormState.ResetFormState(this._proposaldataService.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT, DataRowState.Removed);
    //this._proposaldataService.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT = this._proposalForm.ProposalFinancialAgreementForm();
    obj.ASSETSELECTIONCDE = this.PROPOSALASSETInfo.ASSETSELECTIONCDE;
    if (this.PROPOSALASSETInfo.ASSETSELECTIONCDE == AssetSelection.Inventory) {
      assetInfoParam.AssetID = obj.ASSETID;
      assetInfoParam.RevisionID = obj.REVISIONID;
      this._proposaldataService.PROPOSALTEMPLATERENTALINT.controls.VEHICLEAGE.setValue(0);
      this._proposalService.ReadCustomBPKBDetailOL(assetInfoParam).pipe(takeUntil(this.subscription$)).subscribe((result: any) => {
        let bpkbRowstate = this._proposaldataService.OTOPRPLASSTBPKBDETL.controls.RowState.value;
        this._proposaldataService.OTOPRPLASSTBPKBDETL.patchValue(result.ResultSet[0]);
        this._proposaldataService.OTOPRPLASSTBPKBDETL.controls.RowState.setValue(bpkbRowstate);
      })
      this._proposalService.ReadCustomBPKBGurantorOL(assetInfoParam).pipe(takeUntil(this.subscription$)).subscribe((result: any) => {
        //this._proposaldataService.ASSETENTITY.controls.OTOPRPLASSTBPKBGRTRDETL=this._formBuilder.array(result.ResultSet.map((r:any)=>this._formBuilder.group(r)));
        this._proposalEntityMapperService.OTOPRPLASSTBPKBGRTRDETLMapper(this._proposaldataService.OTOPRPLASSTBPKBGRTRDETL, result.ResultSet);
      })
      this._proposalService.ReadCustomBPKBReprDetailOL(assetInfoParam).pipe(takeUntil(this.subscription$)).subscribe((result: any) => {
        //this._proposaldataService.ASSETENTITY.controls.OTOPRPLASSTBPKBRPRSDETL=this._formBuilder.array(result.ResultSet.map((r:any)=>this._formBuilder.group(r)));
        this._proposalEntityMapperService.OTOPRPLASSTBPKBRPRSDETLMapper(this._proposaldataService.OTOPRPLASSTBPKBRPRSDETL, result.ResultSet);
      })
      this._proposalService.ReadCustomVehicleDetailOL(assetInfoParam).pipe(takeUntil(this.subscription$)).subscribe((result: any) => {
        let vehicledetailRowstate = this._proposaldataService.PROPOSALVEHICLEDETAIL.controls.RowState.value;
        this._proposaldataService.PROPOSALVEHICLEDETAIL.patchValue(result.ResultSet[0]);
        this._proposaldataService.PROPOSALVEHICLEDETAIL.controls.RowState.setValue(vehicledetailRowstate);
      })
      this._proposalService.ReadByRevisionIdAndAsetId(assetInfoParam).pipe(takeUntil(this.subscription$)).subscribe((result: any) => {
        this._proposalEntityMapperService.PROPOSALACCESSORYMapper(this._proposaldataService.PROPOSALACCESSORY, result.ResultSet);
        this._proposaldataService.PROPOSALACCESSORY.controls.filter((p: any) => p.value.RowState != DataRowState.Removed).forEach((element: FormGroup<IPRPL_ACCYInfo>) => {
          element.patchValue({
            BPSUPPLIERID: this._proposaldataService.PROPOSAL.controls.BPINTRODUCERID.value,
            BPSUPPLIERNAME: this._proposaldataService.PROPOSAL.controls.BPINTRODUCERNME.value,
            CURRENCYCDE: "00001",
            RowState: DataRowState.Added
          });
        });
      })
      //set asset cost
      if (obj.NETBOOKVALUE > 0) {
        this._proposaldataService.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.TOTALCOST.setValue(obj.NETBOOKVALUE);
        this._proposaldataService.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.ASSETAMT.setValue(obj.NETBOOKVALUE);
        this._calculationService.AssetAmtValueChange();
        this._calculationService.ResetRentalDetail();
        this._calculationService.CalculateNetFinanceAmt();
      }
      bpInfoParam.BusinessPartnerId = this._proposaldataService.PROPOSAL.controls.BPINTRODUCERID.value;
      this._proposalService.GetBPName(bpInfoParam).pipe(takeUntil(this.subscription$)).subscribe((result: any) => {

        this._proposaldataService.PROPOSALASSET.controls.SUPPLIERNAME.setValue(result?.ResultSet);
      });
    }
    else {
      assetInfoParam.AssetTypeCode = obj.ASSETTYPECDE;
      assetInfoParam.AssetSubTypeCode = obj.ASSETSUBTYPCDE;
      assetInfoParam.AssetModelID = obj.ASSETMODELID;
      this._proposalService.GetVehicleLoadingRate(assetInfoParam).pipe(takeUntil(this.subscription$)).subscribe((result: any) => {

        this._proposaldataService.PROPOSALTEMPLATERENTALINT.controls.VEHICLEAGE.setValue(result.ResultSet.LOADINGAGE | 0);
      });
    }

    this._calculationService.SetFinancialAgreementOnAssetSelect();
    let BPINTRODUCERID = this._proposaldataService.PROPOSAL.controls.BPINTRODUCERID.value;
    let SUPPLIERNAME = this._proposaldataService.ASSETENTITY.controls.PROPOSALASSET.value.SUPPLIERNAME;
    let ROLECDE = this._proposaldataService.ASSETENTITY.controls.PROPOSALASSET.value.ROLECDE;
    this._calculationService.SetProposalAssetInfoOnAssetSelect(obj);
    this._proposaldataService.ASSETENTITY.controls.PROPOSALASSET.controls.BPINTRODUCERID.setValue(BPINTRODUCERID);
    this._proposaldataService.ASSETENTITY.controls.PROPOSALASSET.controls.SUPPLIERNAME.setValue(SUPPLIERNAME);
    this._proposaldataService.ASSETENTITY.controls.PROPOSALASSET.controls.ROLECDE.setValue(ROLECDE);

    assetInfoParam.AssetConditionCode = this._proposaldataService.ASSETENTITY.controls.PROPOSALASSET.controls.CONDITION.value;
    assetInfoParam.CompanyID = 5;

    this._calculationService.BPKBExpectedOverdueDays(assetInfoParam);
    this._calculationService.ResetProvisionFeeDetail();
    this._proposaldataService.ASSETENTITY.controls.PROPOSALADMINFEEDETAIL.controls.DEALERADMINFEECOMMISSION.setValue(0);
    this._calculationService.RemoveArticleComponent(AmountComponent.AdminFeeCommission);

    // TO-DO for CF/RF
    // await Controller.UpdateAdminFeeFeilds();
    // await Controller.UpdateProvisionFeeFields();
    // await Controller.ResetAllCommissionCalculations();

    // GetCharges mathid logic trasnformed fromo ChargerComponent
    let proposalParamInfo = {} as IProposalInfoParm;
    proposalParamInfo.FinancialProductID = this._proposaldataService.PROPOSAL.controls.FINANCIALPRODUCTID.value;
    this._proposalService.GetAssociatedApplicationCharges(proposalParamInfo).subscribe((res: any) => {
      this._calculationService.AssetEntityCollection = new Array();
      this._calculationService.PrepareChargesCollection(res);
    });

    //Controller.FirstPaymentConfig();

    //this._calculationService.CalculateNFA();

    let request = new mPOSMasterDataRequest();
    request.masterDataOperation = MasterData.PoliceCategory;
    request.DATAS.AssetModelId = obj.ASSETMODELID;
    this._masterDataService.GetMasterData(request).pipe(takeUntil(this.subscription$)).subscribe((response) => {
      this._assetSearchMasterDataService.PoliceCategory = response?.ResultSet?.DataCollection;
    });

    //this._calculationService.SetDefaultCommissionSetting();
    // await Controller.CalculateCommission(CommissionType.AllCommissionTypes.GetStringValue(), -1);
    // commissionIncludeToPO();
    let request1 = new mPOSMasterDataRequest();
    request1.DATAS.AssetModelId = this.PROPOSALASSET.controls.ASSETMODELID.value;
    request1.masterDataOperation = MasterData.AssetModelColour;
    this._masterDataService.GetMasterData(request1).pipe(takeUntil(this.subscription$)).subscribe((result: any) => {
      this._masterDataService.AssetModelColour = result?.ResultSet?.DataCollection;
    });

    if (this._proposaldataService.PROPOSAL.controls.FINANCETYP.value == FinanceType.HirePurchase) {

      bpInfoParam.BranchId = this._proposaldataService.PROPOSAL.controls.BPCOMPANYBRANCHID.value;
      this._proposalService.GetReimbursmentCostInd(bpInfoParam).pipe(takeUntil(this.subscription$)).subscribe((result: any) => {

        //if (result.ResultSet != {}) {
        if (this._formModeService.FormMode == FormMode.NEW)
          this._proposaldataService.ASSETENTITY.controls.PROPOSALADMINFEEDETAIL.controls.RowState.setValue(DataRowState.Added);
        else if (this._formModeService.FormMode == FormMode.EDIT && this._proposaldataService.ASSETENTITY.value.PROPOSALADMINFEEDETAIL.RowState !== DataRowState.Added)
          this._proposaldataService.ASSETENTITY.controls.PROPOSALADMINFEEDETAIL.controls.RowState.setValue(DataRowState.Updated)

        this._proposaldataService.ASSETENTITY.controls.PROPOSALADMINFEEDETAIL.controls.REIMBURSMENTCOSTFROMFC.setValue(result?.ResultSet.REIMBURSEMENTCOSTIND);
        if (result?.ResultSet.REIMBURSEMENTCOSTIND == true)
          this._proposaldataService.ASSETENTITY.controls.PROPOSALADMINFEEDETAIL.controls.REIMBURSEMENTCOST.setValue(result?.ResultSet.REIMBURSEMENTCOST);
        else
          this._proposaldataService.ASSETENTITY.controls.PROPOSALADMINFEEDETAIL.controls.REIMBURSEMENTCOST.setValue(result?.ResultSet.BRANCHCOST);

        //}
      });
    }
    this._calculationService.ApplyAssetConfigurations(true, this._proposaldataService.PROPOSALARTICLE.controls[this._proposaldataService.PROPOSALARTICLE.value.length - 1], false);
    this._calculationService.SetAdminFeeChartConfigurations();
    this._calculationService.ResetRentalDetail();

    this._calculationService.SetDefaultCommissionSetting();
    //this._calculationService.UpdateBaseRateChart();

    if (this._storageService.GetUserInfo()?.IsOTO == true) {
      if (this._formModeService.FormMode !== FormMode.VIEW &&
        this._proposaldataService.PROPOSAL.controls.FINANCETYP.value === FinanceType.HirePurchase &&
        this._proposaldataService.PROPOSAL.controls.ISMCOMCAMPAIGN.value === false) {
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.COMMISSIONINCLUDETOPO.setValue(true);
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.COMMISSIONINCLUDETOPOACTIVEIND.setValue(false);
      }
    }
    else {
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.COMMISSIONINCLUDETOPOACTIVEIND.setValue(true);
    }
    if (this._formModeService.FormMode !== FormMode.VIEW &&
      this._proposaldataService.PROPOSAL.value != null &&
      this._proposaldataService.PROPOSAL.value.ISMCOMCAMPAIGN == true) {
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.COMMISSIONINCLUDETOPO.setValue(false);
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.COMMISSIONINCLUDETOPOACTIVEIND.setValue(false);
    }
    if (this._proposaldataService.PROPOSAL.value.FINANCETYP != null && this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.Refinance) {
      this._calculationService.DisableForRF(false);
    }
    if (!this._proposalManagerService.ISCFNONMCOMIND) {
      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.DOWNPAYMENTPAIDTOINTIND.setValue(false);
    }
  }

  ResetProposalFinancialAgreement() {

    this._proposaldataService.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.patchValue(this._proposalForm.ProposalFinancialAgreementForm().value, { emitEvent: false });
    this._proposaldataService.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.patchValue({
      PROPOSALID: this.PROPOSALFINANCIALAGREEMENTInfo.PROPOSALID,
      ASSETID: this.PROPOSALFINANCIALAGREEMENTInfo.ASSETID,
      CONTRACTTRM: this.PROPOSALFINANCIALAGREEMENTInfo.CONTRACTTRM,
      CONTRACTSTARTDTE: this.PROPOSALFINANCIALAGREEMENTInfo.CONTRACTSTARTDTE,
      FREQUENCYCDE: this.PROPOSALFINANCIALAGREEMENTInfo.FREQUENCYCDE,
      RENTALMODETYP: this.PROPOSALFINANCIALAGREEMENTInfo.RENTALMODETYP,
      SECURITYDEPIND: this.PROPOSALFINANCIALAGREEMENTInfo.SECURITYDEPIND,
      SECURITYDEPOSITPCT: this.PROPOSALFINANCIALAGREEMENTInfo.SECURITYDEPOSITPCT,
      SDCALCCDE: this.PROPOSALFINANCIALAGREEMENTInfo.SDCALCCDE,
      BASERTE: this.PROPOSALFINANCIALAGREEMENTInfo.BASERTE,
      TOTALADMINFEE: this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.TOTALADMINFEE.value,
      GPALLOWEDIND: this.PROPOSALFINANCIALAGREEMENTInfo.GPALLOWEDIND,
      RENTALCALCMTD: this._proposaldataService.PROPOSALTEMPLATERENTALINT.value.RNTLCALCLTNMTDCDE,
      NOOFMONTHSDELAY: 1,
      DEALERPCT: this.PROPOSALFINANCIALAGREEMENTInfo.DEALERPCT
    }, { emitEvent: false });
    if (this.PROPOSALFINANCIALAGREEMENTInfo.RowState !== (DataRowState.Added)) {
      this._proposaldataService.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.RowState.patchValue(DataRowState.Updated);
    }
  }

  ResetProposalAsset() {
    this._proposaldataService.ASSETENTITY.controls.PROPOSALASSET.patchValue(this._proposalForm.ProposalAssetInfoForm().value, { emitEvent: false });
    this._proposaldataService.ASSETENTITY.controls.PROPOSALASSET.patchValue({
      PROPOSALID: this.PROPOSALASSETInfo.PROPOSALID,
      ASSETID: this.PROPOSALASSETInfo.ASSETID,
      ROLECDE: this.PROPOSALASSETInfo.ROLECDE,
      SUPPLIERNAME: this.PROPOSALASSETInfo.SUPPLIERNAME,
      BPINTRODUCERID: this.PROPOSALASSETInfo.BPINTRODUCERID,
      ASSETAMT: this.PROPOSALASSETInfo.ASSETAMT,
      CONDITION: this.PROPOSALASSETInfo.CONDITION
    }, { emitEvent: false });
    if (this.PROPOSALASSETInfo.RowState !== (DataRowState.Added)) {
      this._proposaldataService.ASSETENTITY.controls.PROPOSALASSET.controls.RowState.patchValue(DataRowState.Updated);
    }
  }

  ResetAssetInfo() {

    if (this._dataService.PRPLARTICLECOMPONENTENTITYCOL.value.length > 0)
      this._FormState.ResetFormArrayState(this._dataService.PRPLARTICLECOMPONENTENTITYCOL, DataRowState.Removed);
    this._proposaldataService.ASSETENTITY.controls.PROPOSALINSURANCEMAIN.controls.forEach(p => p.controls.PRPLINSR.controls.TOTALUPFRONTAMNT.setValue(0));
    this.PROPOSALASSETInfo = this._proposaldataService.PROPOSALASSET.value as IPRPL_ASETInfo;
    this.PROPOSALFINANCIALAGREEMENTInfo = this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value as IPRPL_FINL_AGRMInfo;

    this._proposaldataService.PROPOSALASSET.controls.ASSETSUBTYPDSC.setValue('');
    //this._proposaldataService.PROPOSALARTICLE.controls.filter(a => a.controls.ASSETENTITY.controls.PROPOSALVEHICLEDETAIL.controls.COLOR.setValue(""));
    this.ResetProposalAsset();

    this._calculationService.AssetAmtValueChange();
    this.ResetProposalFinancialAgreement();

    this._proposaldataService.PROPOSALTEMPLATERENTALINT.controls.VEHICLEAGE.setValue(0);

    this.ResetBPKBFormValues();
    this._FormState.ResetFormArrayState(this._proposaldataService.ASSETENTITY.controls.PROPOSALACCESSORY, DataRowState.Removed);
    this._FormState.ResetFormArrayState(this._proposaldataService.ASSETENTITY.controls.PROPOSALASSETINSURANCE, DataRowState.Removed);
    this._FormState.ResetFormArrayState(this._proposaldataService.ASSETENTITY.controls.OTOPRPLASETADDINSR, DataRowState.Removed);
    this._FormState.ResetFormArrayState(this._proposaldataService.ASSETENTITY.controls.PROPOSALCHARGE, DataRowState.Removed);
    this._FormState.ResetFormArrayState(this._proposaldataService.ASSETENTITY.controls.PROPOSALRENTALDETAIL, DataRowState.Removed);
    this._FormState.ResetFormArrayState(this._proposaldataService.ASSETENTITY.controls.PROPOSALINSURANCEMAIN, DataRowState.Removed);

    this._proposaldataService.ASSETENTITY.controls.PROPOSALSUBSIDYDETAIL.patchValue(this._proposalForm.ProposalSubsidyForm().value, { emitEvent: false });
    this._FormState.ResetFormArrayState(this._proposaldataService.PRPLARTICLECOMPONENTENTITYCOL, DataRowState.Removed);

    if (this._proposaldataService.PROPOSALASSET.controls.ASSETSELECTIONCDE.value == AssetSelection.Purchase && this._proposaldataService.PROPOSALASSET.controls.REGISTERID.value > 0) {
      this.UpdateAssetRegisterStatus(this._proposaldataService.PROPOSALASSET.controls.PREVASSETID.value, this._proposaldataService.PROPOSALASSET.controls.CONTRACTID.value,
        this._proposaldataService.PROPOSALASSET.controls.REGISTERID.value, this._proposaldataService.PROPOSALASSET.controls.REVISIONID.value, StatusCode.Returned);
      this._proposaldataService.PROPOSALASSET.controls.REGISTERID.setValue(0);
    }
  }

  UpdateAssetRegisterStatus(assetID: number, contractID: number, registerID: number, revisionID: number, enumStatusCode: StatusCode) {
    let param = {} as IAssetInfoParams;
    param.AssetID = assetID;
    param.ContractID = contractID;
    param.RegisterID = registerID;
    param.RevisionID = revisionID;
    param.AssetStatus = enumStatusCode;
    param.AssetModuleCode = "00004"; // Asset
    param.AssetOriginationModuleCode = "00004"; // Asset

    this._proposalService.UpdateAssetRegisterStatus(param).pipe(takeUntil(this.subscription$)).subscribe(res => {
    });
  }

  ResetBPKBFormValues() {
    if (this._proposaldataService.OTOPRPLASSTBPKBDETL) {
      // this._proposaldataService.OTOPRPLASSTBPKBDETL.patchValue(this._proposaldataService.OTOPRPLASSTBPKBDETL.value);
      // this._proposaldataService.ASSETENTITY.controls.PROPOSALASSET.patchValue({
      //   PROPOSALID: this.PROPOSALASSETInfo.PROPOSALID
      // });
      this.OTOPRPLASSTBPKBDETLinfo = this._proposaldataService.OTOPRPLASSTBPKBDETL.value as PROPOSALENTITY.IOTO_PRPL_ASST_BPKB_DETLInfo;
      this._proposaldataService.OTOPRPLASSTBPKBDETL.patchValue(this._proposalForm.ProposalAssetBPKBtDetailForm().value, { emitEvent: false });
      this._proposaldataService.OTOPRPLASSTBPKBDETL.patchValue({
        PROPOSALID: this.OTOPRPLASSTBPKBDETLinfo.PROPOSALID,
        BPKBSTATUS: this.OTOPRPLASSTBPKBDETLinfo.BPKBSTATUS,
        BPKBRECEIVEDSTATUS: this.OTOPRPLASSTBPKBDETLinfo.BPKBRECEIVEDSTATUS,
        BPKBLOCATION: this.OTOPRPLASSTBPKBDETLinfo.BPKBLOCATION,
        STATUSCHANGEDTE: this.OTOPRPLASSTBPKBDETLinfo.STATUSCHANGEDTE,
        ASSETID: this.OTOPRPLASSTBPKBDETLinfo.ASSETID,
        BPKBBORROWERAGE: this.OTOPRPLASSTBPKBDETLinfo.BPKBBORROWERAGE,
        BPKBOTHERAGE: this.OTOPRPLASSTBPKBDETLinfo.BPKBOTHERAGE
      }, { emitEvent: false });
      if (this.OTOPRPLASSTBPKBDETLinfo.RowState !== (DataRowState.Added)) {
        this._proposaldataService.OTOPRPLASSTBPKBDETL.controls.RowState.patchValue(DataRowState.Updated);
      }
    }
    if (this._proposaldataService.OTOPRPLASSTBPKBRPRSDETL != null && this._proposaldataService.OTOPRPLASSTBPKBRPRSDETL.length > 0) {
      this._FormState.ResetFormArrayState(this._proposaldataService.OTOPRPLASSTBPKBRPRSDETL, DataRowState.Removed);
    }
    if (this._proposaldataService.OTOPRPLASSTBPKBGRTRDETL != null && this._proposaldataService.OTOPRPLASSTBPKBGRTRDETL.length > 0) {
      this._FormState.ResetFormArrayState(this._proposaldataService.OTOPRPLASSTBPKBGRTRDETL, DataRowState.Removed);
    }
  }

  setSupplierForOL() {
    let bpInfoParam = {} as IBusinessPartnerInfoParm;
    bpInfoParam.BusinessPartnerId = this._proposaldataService.PROPOSAL.controls.BPINTRODUCERID.value;
    this._proposalService.GetBPName(bpInfoParam).pipe(takeUntil(this.subscription$)).subscribe((result: any) => {
      this._proposaldataService.PROPOSALASSET.controls.SUPPLIERNAME.setValue(result?.ResultSet);
    });
    this._proposaldataService.PROPOSALASSET.controls.BPINTRODUCERID.setValue(this._proposaldataService.PROPOSAL.controls.BPINTRODUCERID.value);
    //this._proposaldataService.PROPOSALASSET.controls.SUPPLIERNAME.disable();
  }

  assetSelection_OnChange(event: any) {
    if (event) {
      let value = String(event?.value);
      this.ResetAssetInfo();

      if (value == AssetSelection.Purchase) {
        this.setSupplierForOL();
        this._proposaldataService.ASSETENTITY.controls.PROPOSALASSET.controls.ASSETSELECTIONCDE.setValue(AssetSelection.Purchase);
        this.PROPOSALASSETInfo.ASSETSELECTIONCDE = AssetSelection.Purchase
        this.IsInventoryVehicle = false;
      }
      if (value == AssetSelection.Inventory) {
        this._proposaldataService.PROPOSALASSET.controls.SALESANDLEASEBACKIND.setValue(false);
        this._proposaldataService.ASSETENTITY.controls.PROPOSALASSET.controls.ASSETSELECTIONCDE.setValue(AssetSelection.Inventory);
        this.PROPOSALASSETInfo.ASSETSELECTIONCDE = AssetSelection.Inventory;
        this.IsInventoryVehicle = true;
      }
    }
  }

  readOnlyControls() {

  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }

  PoliceDetail() {
    return this._assetSearchMasterDataService.PoliceCategory;
  }

  selectionChange_CONTRACTSTARTDTE(evnt: any) {
    if (evnt != undefined) {
      //this._calculationService.EnableInsuranceCalculateButton();

      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CONTRACTSTARTDTE.setValue(evnt);

      //this._dataService.PROPOSALFINANCIALAGREEMENT.updateValueAndValidity({ emitEvent: false, onlySelf: true });
      this._proposalManagerService.UpdateInsuranceDatesCF();
      //this._calculationService.UpdateBaseRateChart();
      this._calculationService.ApplyAssetConfigurations(true, this._proposaldataService.PROPOSALARTICLE.controls[this._proposaldataService.PROPOSALARTICLE.value.length - 1], false);

      let assetInfoParam = {} as IAssetInfoParams;
      assetInfoParam.AssetTypeCode = this._dataService.PROPOSALASSET.value.ASSETTYPECDE;
      assetInfoParam.AssetConditionCode = this._proposaldataService.ASSETENTITY.controls.PROPOSALASSET.controls.CONDITION.value;
      assetInfoParam.CompanyID = 5;
      this._calculationService.BPKBExpectedOverdueDays(assetInfoParam);
      this._calculationService.ResetRentalDetail();
    }
  }

  selectionChange_FREQUENCYCDE(evnt: Event) {
    if (evnt != undefined) {
      this._calculationService.ResetRentalDetail();
      this._calculationService.ApplyAssetConfigurations(true, this._proposaldataService.PROPOSALARTICLEFORMGROUP, false);
      this._calculationService.GetRentalFrequency(this._dataService.PROPOSALFINANCIALAGREEMENT.value.FREQUENCYCDE);
    }
  }

  selectionChange_CONTRACTTRM(evnt: Event) {
    if (evnt != undefined) {
      if (Number(evnt) < this._proposalManagerService.ContractMinTerms || Number(evnt) > this._proposalManagerService.ContractMaxTerms) {
        this._msgService.showMesssage("msgIncorrectTerms", MessageType.Error);
        this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CONTRACTTRM.setValue(this._dataService.PROPOSALFINANCIALAGREEMENT.value.CONTRACTTRM);
        return;
      }
      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CONTRACTTRM.setValue(Number(evnt));
      this._calculationService.EnableInsuranceCalculateButton();
      this._calculationService.ResetRentalDetail();
      this._calculationService.ApplyAssetConfigurations(true, this._proposaldataService.PROPOSALARTICLEFORMGROUP, false);
      this._calculationService.GetAdminFeeAsscociation();
      this._calculationService.SetAdminFeeChartConfigurations();
    }
  }

  selectionChange_RENTALMODETYP(evnt: Event) {
    if (evnt != undefined) {
      if (this._dataService.ASSETENTITY.controls.PROPOSALRENTALDETAIL.value.filter((p: any) => p.RowState != DataRowState.Removed).length > 0) {
        var customDialog = this._customDialog.openDialog("Information", this._appConfig.Messages["msgAllRentalsReset"]?.Message, true, "Ok");
        customDialog.afterClosed().subscribe();
      }
      this._calculationService.ResetRentalDetail();
      this._calculationService.ApplyAssetConfigurations(true, this._proposaldataService.PROPOSALARTICLEFORMGROUP, false);
    }
  }

  isControlDisable(controlName: string) {
    return this.appTypeService.isControlDisable(controlName)
  }

}

