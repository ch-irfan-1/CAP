import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { DialogBoxService } from '@NFS_Core/NFSServices/DialogBox/dialog-box.service';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { EmploymentMasterDataService } from '@NFS_Core/NFSServices/MasterData/employment-master-data.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { StateManagment } from '@NFS_Core/RowStateManagement/FormStateManagement';
import * as PROPOSALENTITY from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import { IProposalApplicantEntity } from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import { IPRPL_APLT_SPUS_DETLInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IPRPL_APLT_SPUS_DETLInfo.model';
import { AmountComponent } from '@NFS_Enums/AmountComponent';
import { ApplicantType } from '@NFS_Enums/ApplicantType.enum';
import { ComponentName } from '@NFS_Enums/Component.enum';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FinanceType } from '@NFS_Enums/FinanceType';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { IDTypeCode } from '@NFS_Enums/IDTypeCode';
import { MaritalStatus } from '@NFS_Enums/MaritalStatus.enum';
import { NationalityTypes } from '@NFS_Enums/NationalityTypes.enum';
import { ReturnCode } from '@NFS_Enums/ReturnCode.enum';
import { RoleCode } from '@NFS_Enums/RoleCode';
import { IBusinessPartnerInfoParm } from '@NFS_Interfaces/RequestInterfaces/BusinessPartnerInfoParm';
import { IExistingBPInfoParm } from '@NFS_Interfaces/RequestInterfaces/iexisting-bpinfo-parm';
import { DateParam } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { CalculationService } from '@NFS_Modules/CAP/CAPServices/calculation.service';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalEntityMapperService } from '@NFS_Modules/CAP/CAPServices/proposal-entity-mapper.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { ProposalManagerService } from '@NFS_Modules/CAP/_helpers/proposal-manager.service';
import { FormGroup } from 'src/Library';
import { Subject } from 'rxjs';
import { pairwise, takeUntil } from 'rxjs/operators';
import { DealerSearchComponent } from '../../GeneralInfo/dealer-search.component';
import { exposureComponent } from '../exposure/exposure.component';
import { IdSearchComponent } from '../Id-Detail/id-search.component';
import { LastYearNetProfitComponent } from '../last-year-net-profit/last-year-net-profit.component';

@Component({
    selector: 'app-individual-applicant',
    templateUrl: './individual-applicant.component.html',
    styleUrls: ['./individual-applicant.component.css'],
    standalone: false
})
export class IndividualApplicantComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input() Applicant!: FormGroup<PROPOSALENTITY.IProposalApplicantEntity>;
  @Input() ComponentName!: string;

  maxDate: Date = new Date(Date.now());
  checked = false;
  indeterminate = false;
  isNotWNA: boolean = true;
  oldKTPID: string = '';
  isFromMpos: boolean = false;
  // public isOL:boolean=false;
  // public isCF:boolean=false;
  PRPOSALAPPLICANT!: FormGroup<PROPOSALENTITY.IProposalApplicantEntity>[];
  PRPOSALAPPLICANTSPOUSE!: FormGroup<IPRPL_APLT_SPUS_DETLInfo>;
  PROPOSAL!: FormGroup<PROPOSALENTITY.IPRPLInfo>;
  private subscription$ = new Subject();
  isSignatureVerified!: boolean;
  public isExistingBPLoaded = false;

  constructor(
    private dialog: MatDialog,
    public _masterDataService: MasterDataService,
    public _proposaldataService: ProposalDataService,
    private _proposalForm: ProposalEntityFormService,
    public _employmentMasterDataService: EmploymentMasterDataService,
    private _proposalMapperService: ProposalEntityMapperService,
    private _storageService: ClientStoreService,
    private _FormState: StateManagment,
    private _FormModeService: FormModeService,
    private _messageService: MessageService,
    private _proposalSertvice: ProposalService,
    private _dialog: DialogBoxService,
    private _proposalmanagerservice: ProposalManagerService,
    private _calculationService: CalculationService
  ) { }

  panelOpenState = false;

  ngOnInit(): void {
    this._proposaldataService.SetCurrentApplicant = this.Applicant;

    this._proposaldataService.ApplicantType = this._proposaldataService.CurrentApplicant.value.PROPOSALAPPLICANTMAIN?.APPLICANTTYP;
    this.PRPOSALAPPLICANT = this._proposaldataService.PROPOSALAPPLICANT.controls.filter((x) => x.controls.RowState.value != DataRowState.Removed);

    this._proposaldataService.PROPOSALAPPLICANT.controls[0].controls.ISAUDITABLE.setValue(true);
    this._employmentMasterDataService
      .getmasterDataForEmployment()
      .pipe(takeUntil(this.subscription$))
      .subscribe((data) => {
        this._employmentMasterDataService.BusinessType = data?.BusinessType?.ResultSet?.DataCollection;
        this._employmentMasterDataService.Designation = data?.Designation?.ResultSet?.DataCollection;
        this._employmentMasterDataService.EmploymentStatus = data?.EmploymentStatus?.ResultSet?.DataCollection;
        this._employmentMasterDataService.SpAgreementType = data?.SpAgreementType?.ResultSet?.DataCollection;
      });

    this.valueChangeSubscriptions();
    // if (this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL?.controls.MARITALSTATUSCDE.value === MaritalStatus.Married) {
    //   this.valueChangeSubscriptionsSpouseDetails();
    // }

    this.PROPOSAL = this._proposaldataService.PROPOSAL;
    let KTPIdType = this.Applicant.value.PROPOSALAPPLICANTIDDETAIL.filter(x => x.IDTYPECDE == IDTypeCode.KTP && x.RowState !== DataRowState.Removed)[0];

    ///[load BP disble/enable fields based on ind]
    if (KTPIdType?.BPIDSEQ > 0) {
      this.isExistingBPLoaded = true;
    }
    else {
      this.isExistingBPLoaded = false;
    }

    //MPOS--------------
    var isSignDocAvailble: boolean = false;
    if (this._proposaldataService.PROPOSAL.controls.MPOSAPPLICATIONNBR.value !== ""
      && this._proposaldataService.PROPOSALAPPLICANT.value.filter(p => p.PROPOSALAPPLICANT.ROLECDE === RoleCode.Borrower).length > 0) {
      if (this._proposaldataService.PROPOSALAPPLICANT.value.filter(p => p.PROPOSALAPPLICANT.ROLECDE === RoleCode.Borrower)[0].MPOSDOCUMENTS != null) {
        var borrowerDocFrommPOS = this._proposaldataService.PROPOSALAPPLICANT.value.filter(p => p.PROPOSALAPPLICANT.ROLECDE === RoleCode.Borrower)[0].MPOSDOCUMENTS;
        if (borrowerDocFrommPOS.length > 0) {
          if (borrowerDocFrommPOS.filter(p => p.DOCUMENTCDE == "00201").length > 0) // Customer Signature
          {
            isSignDocAvailble = true;
          }
        }
      }
    }

    if (this._proposaldataService.CurrentApplicant.controls.PROPOSALAPPLICANTMAIN != null && this._proposaldataService.PROPOSAL.controls.FINANCETYP.value == FinanceType.HirePurchase && isSignDocAvailble == true) {
      this.isSignatureVerified = true;
      //this._proposaldataService.CurrentApplicant.controls.PROPOSALAPPLICANTMAIN.controls.SIGNATUREVERIFIED.setValue(true);
    }
    else {
      this.isSignatureVerified = false;
      this._proposaldataService.CurrentApplicant.controls.PROPOSALAPPLICANTMAIN.controls.SIGNATUREVERIFIED.setValue(false);
    }
    if (this._FormModeService.FormMode === FormMode.COPY) {
      this.isSignatureVerified = false;
      this._proposaldataService.CurrentApplicant.controls.PROPOSALAPPLICANTMAIN.controls.SIGNATUREVERIFIED.setValue(false);
    }

    this.loadData();

    if (KTPIdType && KTPIdType.EXPIRYDTE != null)
      if (KTPIdType.EXPIRYDTE < this._storageService.GetUserInfo().ProcessingDate) {
        this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL?.controls.KTPIND.setValue(true);
      }

    if ((this._FormModeService.FormMode == FormMode.EDIT || this._FormModeService.FormMode == FormMode.RESUBMIT) && this.iOPSAvailable && this.Applicant.value.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower) {
      this.isFromMpos = true;
    }
  }

  // isNotWNA() {
  //   console.log("isnotWNA");

  //   if (this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL?.controls.CITIZENSHIPCDE.value != "00002") {
  //     //this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL?.controls.CNTRYDOMCDE.setValue('');
  //     return true;
  //   }
  //   else
  //     return false;

  // }
  openLastYearsNetProfit() {
    const dialogRef = this.dialog.open(LastYearNetProfitComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      hasBackdrop: false
    });
    dialogRef.afterClosed().subscribe(result => {

    })
  }
  IsOL() {
    return this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.OperatingLease;
  }
  openDealerSearch() {
    const dialogRef = this.dialog.open(DealerSearchComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { id: 123456 },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (typeof result == 'object') {
      }
    });
  }
  openExposure() {
    let _param = {
      FirstName: '',
      LastName: '',
      IdCardNumber: '',
      ApplicantType: '',
      ApplicantName: '',
      FromDate: new Date(),
      LegalStatusCde: '',
      ApplicantAlias: '',
    };
    if (
      this.Applicant != undefined &&
      this.Applicant.value.PROPOSALAPPLICANTIDDETAIL != null
    ) {
      let IdLst = this.Applicant.value.PROPOSALAPPLICANTIDDETAIL;
      let defaultID = this.Applicant.value.PROPOSALAPPLICANTIDDETAIL.filter(
        (x) => x.RowState != DataRowState.Removed && x.DEFAULTIND == true
      );
      if (this._proposaldataService.ApplicantType == 'I') {
        let individualParam = IdLst.filter((x) => x.RowState != DataRowState.Removed && x.IDTYPECDE == ApplicantType.Individual);
        _param.ApplicantType = this._proposaldataService.ApplicantType;
        _param.LegalStatusCde = '00001';
        _param.ApplicantName =
          this.Applicant.value.PROPOSALAPPLICANTMAIN.APPLICANTNME;
        _param.IdCardNumber = individualParam[individualParam.length - 1].IDTYPENBR;
        //this.Applicant.value.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL?.IDCARDNBR;
        if (
          this.Applicant.value.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL
            ?.DATEOFBIRTH
        )
          _param.FromDate =
            this.Applicant.value.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL?.DATEOFBIRTH;
        else
          _param.FromDate =
            this._proposaldataService.PROPOSAL.value.PROPOSALDTE;
      } else if (
        this._proposaldataService.ApplicantType == 'C' &&
        this.Applicant.value.PROPOSALAPPLICANTIDDETAIL != null
      ) {
        _param.ApplicantType = this._proposaldataService.ApplicantType;
        _param.LegalStatusCde = '00002';
        _param.ApplicantName =
          this.Applicant.value.COMPANYAPPLICANT.PROPOSALAPPLICANTCOMPANY.NAME;
        _param.IdCardNumber =
          this.Applicant.value.COMPANYAPPLICANT.PROPOSALAPPLICANTCOMPANY.COMPANYNBR;
        _param.ApplicantAlias =
          this.Applicant.value.COMPANYAPPLICANT.PROPOSALAPPLICANTCOMPANY.TRUSTNME;
        if (
          this.Applicant.value.COMPANYAPPLICANT.PROPOSALAPPLICANTCOMPANY
            .ESTABLISHEDSINCE
        )
          _param.FromDate =
            this.Applicant.value.COMPANYAPPLICANT.PROPOSALAPPLICANTCOMPANY.ESTABLISHEDSINCE;
        else
          _param.FromDate =
            this._proposaldataService.PROPOSAL.value.PROPOSALDTE;
      }
    }
    const dialogRef = this.dialog.open(exposureComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: _param,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (typeof result == 'object' && result.PROPOSALAPPLICANT && result.PROPOSALAPPLICANTMAIN) {
        result.PROPOSALAPPLICANT.ROLECDE =
          this.Applicant.value.PROPOSALAPPLICANT.ROLECDE;
        result.PROPOSALAPPLICANTMAIN.APPLICANTTYP =
          this.Applicant.value.PROPOSALAPPLICANTMAIN.APPLICANTTYP;
        result.PROPOSALAPPLICANTMAIN.ROLECDE =
          result.PROPOSALAPPLICANT.ROLECDE;
        this._proposalMapperService.ProposalApplicantEntityMapper(
          this.Applicant,
          result
        );
      }
      else if (typeof result == 'object' && result.InternalBadCusomer) {

        if (result.InternalBadCusomer.length > 0 || result.InternalBadCusomer.length > 0 || result.InternalBadCusomer.length > 0 || result.InternalBadCusomer.length > 0) {
          this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL?.controls.BLACKLISTIND.setValue(true);
        }
      }
    });
  }

  get iOPSAvailable() {
    if (this._proposaldataService.ProposalEntity.value.PRPLIOPSUSER.LEADNUMBER == null || this._proposaldataService.ProposalEntity.value.PRPLIOPSUSER.LEADNUMBER === '') {
      return false;
    }
    else {
      return true;
    }
  }

  openIdSearch() {
    let KTPIdType = this.Applicant.value.PROPOSALAPPLICANTIDDETAIL.filter(x => x.IDTYPECDE == IDTypeCode.KTP && x.RowState !== DataRowState.Removed)[0];
    this.oldKTPID = KTPIdType?.IDTYPENBR;

    const dialogRef = this.dialog.open(IdSearchComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: {
        IDTypeArray: this.Applicant.controls.PROPOSALAPPLICANTIDDETAIL,
        ProposalId: this.Applicant.controls.PROPOSALAPPLICANT.value.PROPOSALID,
        ismPOS: this.isFromMpos
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      let index = 0;
      if (typeof result == 'object') {

        index = this._proposaldataService.PROPOSALAPPLICANT.value.findIndex(app => app === this.Applicant.value);

        result.PROPOSALAPPLICANT.ROLECDE = this.Applicant.value.PROPOSALAPPLICANT.ROLECDE;
        result.PROPOSALAPPLICANTMAIN.APPLICANTTYP = this.Applicant.value.PROPOSALAPPLICANTMAIN.APPLICANTTYP;
        result.PROPOSALAPPLICANTMAIN.ROLECDE = result.PROPOSALAPPLICANT.ROLECDE;

        let applicant: FormGroup<IProposalApplicantEntity> = this._proposalForm.ProposalApplicantForm();
        this._proposalMapperService.ProposalApplicantEntityMapper(applicant, result);
        this._FormState.ResetFormState(applicant, DataRowState.Added);

        if (this.Applicant.value.PROPOSALAPPLICANT.RowState !== DataRowState.Added) {
          this._FormState.ResetFormState(this.Applicant, DataRowState.Removed);
        }
        else {
          //index = this._proposaldataService.PROPOSALAPPLICANT.value.findIndex(app => app === this.Applicant.value);
          if (index > -1) {
            this._proposaldataService.PROPOSALAPPLICANT.removeAt(index);
          }
        }

        this._proposaldataService.PROPOSALAPPLICANT.insert(index, applicant);

        let bpInfoParam = {} as IBusinessPartnerInfoParm;
        bpInfoParam.BPIDTYPE = String(result.IdNumber);
        bpInfoParam.BranchId = this._storageService.GetUserInfo().BranchId;
        this._proposalSertvice.CalculateTOBAndMOB(bpInfoParam).subscribe(result => {
          if (String(result.CODE) == ReturnCode.Success.Code) {
            if (this._proposaldataService.PROPOSALAPPLICANT.value.length > 0
              && applicant.value != null) {
              applicant.controls.PROPOSALAPPLICANTMAIN.controls.MONTHONBOOK.setValue(result.ResultSet[0].MONTHONBOOK);
              applicant.controls.PROPOSALAPPLICANTMAIN.controls.TIMEONBOOK.setValue(result.ResultSet[0].TIMEONBOOK);
              if (applicant.value.INDIVIDUALAPPLICANT != null && this.Applicant.value.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL != null) {
                applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL.controls.TIMEONBOOK.setValue(result.ResultSet[0].TIMEONBOOK);
                applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL.controls.MONTHONBOOK.setValue(result.ResultSet[0].MONTHONBOOK);
              }
              else if (applicant.value.COMPANYAPPLICANT != null && this.Applicant.value.COMPANYAPPLICANT.PROPOSALAPPLICANTCOMPANY != null) {
                applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.TIMEONBOOK.setValue(result.ResultSet[0].TIMEONBOOK);
                applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.MONTHONBOOK.setValue(result.ResultSet[0].MONTHONBOOK);
              }

            }
          }
        });
      }

      let KTPIdType = this.Applicant.value.PROPOSALAPPLICANTIDDETAIL.filter(x => x.IDTYPECDE == IDTypeCode.KTP && x.RowState !== DataRowState.Removed)[0];
      ///[load BP disble/enable fields based on ind]
      if (result?.APPLICANTTYPE !== undefined && result?.APPLICANTTYPE !== null) {
        if (result?.APPLICANTTYPE === "Contract") {
          this.isExistingBPLoaded = true;
        }
        else {
          this.isExistingBPLoaded = false;
        }
      }
      else if (this.oldKTPID !== KTPIdType.IDTYPENBR) {
        let existingBPParams = {} as IExistingBPInfoParm;
        existingBPParams.IdCardNumber = KTPIdType.IDTYPENBR;
        existingBPParams.IdCardTyp = KTPIdType.IDTYPECDE;
        this._proposalSertvice.ReadExistingBPandApplicant(existingBPParams).pipe(takeUntil(this.subscription$)).subscribe(res => {
          if (res && res.ResultSet && res.ResultSet.length > 0 && res.ResultSet[0].APPLICANTTYPE === "Contract") {
            this.isExistingBPLoaded = true;
            this._proposaldataService.CurrentApplicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL.patchValue({
              FIRSTNME: '',
              MIDDLENME: '',
              LASTNME: ''
            });
          }
          else {
            this.isExistingBPLoaded = false;
          }
        });

      }

      let defaultIdTypeExist = this.Applicant.value.PROPOSALAPPLICANTIDDETAIL.filter((x) => x.DEFAULTIND == true && x.RowState !== DataRowState.Removed)[0];
      if (defaultIdTypeExist) {
        this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL?.controls.IDCARDTYP.setValue(
          defaultIdTypeExist.IDTYPECDE
        );
        this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL?.controls.IDCARDNBR.setValue(
          defaultIdTypeExist.IDTYPENBR
        );
      }

      if (KTPIdType && KTPIdType.EXPIRYDTE != null)
        if (KTPIdType.EXPIRYDTE < this._storageService.GetUserInfo().ProcessingDate) {
          this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL?.controls.KTPIND.setValue(true);
        }
        else {
          this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL?.controls.KTPIND.setValue(false);
        }

    });
  }

  selectionChange_NATIONALITYCDE(event: any) {
    if (event != undefined && this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.Refinance) {
      if (event?.value === NationalityTypes.WNA) {
        this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL.controls.DBTRCTGYCODEOTO.setValue("00107");
      }
      else {
        this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL.controls.DBTRCTGYCODEOTO.setValue("00099");
      }
    }
  }


  onDependantsChange(evnt: any) {
    if (evnt == '') {
      this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL.controls.NUMBEROFDEPENDENTS.setValue(0);
      if (this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL.controls.RowState.value != DataRowState.Added) {
        this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL.controls.RowState.setValue(DataRowState.Updated);
      }
    }
  }

  ResetSpouseDetail(event: Event) {
    if (event != undefined) {
      if (this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL?.value.MARITALSTATUSCDE === MaritalStatus.Married) {
        if (this._proposaldataService.CurrentApplicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPSPOUSEDETAIL.length === 0) {
          let spouseInfoForm: FormGroup<IPRPL_APLT_SPUS_DETLInfo> =
            this._proposalForm.proposalApplicantSpouseInfoForm();
          this._proposaldataService.CurrentApplicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPSPOUSEDETAIL?.push(spouseInfoForm);
        } else {
          this._proposaldataService.CurrentApplicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPSPOUSEDETAIL?.controls[0].controls.RowState.setValue(DataRowState.Updated);
          // this._proposaldataService.CurrentApplicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPSPOUSEDETAIL.markAsDirty();
        }

        //this.valueChangeSubscriptionsSpouseDetails();
        //let spouseInfoForm: FormGroup<IPRPL_APLT_SPUS_DETLInfo> = this._proposalForm.proposalApplicantSpouseInfoForm();

        // })=spouseInfoForm;
        // this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPSPOUSEDETAIL.setValue({Rowstate:DataRowState.Updated});
      }
      else {
        this._FormState.ResetFormArrayState(this._proposaldataService.CurrentApplicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPSPOUSEDETAIL, DataRowState.Removed);
        //this._proposalmanagerservice.AddRemoveFamilyTab(false);

        // if (this._proposaldataService.CurrentApplicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPSPOUSEDETAIL?.length > 0){
        //   this._proposaldataService.CurrentApplicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPSPOUSEDETAIL.setValue([]);
        // }
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void { }

  loadData() {
    if (this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL.controls.DATEOFBIRTH.value == undefined) {
      this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL?.controls.AGEINYEAR.setValue(0);
      this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL?.controls.AGEINMONTH.setValue(0);
    }

    if (this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.Refinance) {
      if (this.Applicant.value.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.NATIONALITYCDE === NationalityTypes.WNA) {
        this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL.controls.DBTRCTGYCODEOTO.setValue("00107");
      }
      else {
        this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL.controls.DBTRCTGYCODEOTO.setValue("00099");
      }
    }
  }

  valueChangeSubscriptions() {
    this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL?.controls.MARITALSTATUSCDE.valueChanges
      .pipe(pairwise(), takeUntil(this.subscription$))
      .subscribe(([previous, current]) => {
        if (previous !== current && current == '00001') {

          //////////// set values ---proposal family
          if (
            this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPFAMILY?.controls.filter(
              (x) => x.controls.ISSPOUSEIND.value == true
            ).length == 0
          ) {

          }
        }
        else if (current !== "00001") {
          this._FormState.ClearValidators(this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPSPOUSEDETAIL?.controls[0]);
          this._messageService.ClearValidatorMessages('IndividualBorrower-Spouse');
        }
      });


    ////////// individual applicant change
    this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL?.controls.GENDER.valueChanges
      .pipe(pairwise(), takeUntil(this.subscription$))
      .subscribe(([previous, current]) => {
        if (
          previous !== current &&
          this.Applicant.controls.INDIVIDUALAPPLICANT.controls
            .PROPOSALAPPLICANTINDIVIDUAL?.controls.MARITALSTATUSCDE.value ==
          '00001'
        ) {
          if (
            this.Applicant.controls.INDIVIDUALAPPLICANT.controls
              .PROPOSALAPPFAMILY.controls.length == 0
          ) {
            // this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPFAMILY.push(
            //   this._proposalForm.proposalIndvidualFamilyMemberForm()
            // );
          }
          // if (current == '00001') {
          //   this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPFAMILY.controls[0].controls.GENDER.setValue(
          //     '00002'
          //   );
          // } else if (current == '00002') {
          //   this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPFAMILY.controls[0].controls.GENDER.setValue(
          //     '00001'
          //   );
          // }
        }
      });

    // family card no value change
    this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL?.controls.FAMILYCARDNO.valueChanges
      .pipe(pairwise(), takeUntil(this.subscription$))
      .subscribe(([previous, current]) => {
        if (
          previous !== current &&
          this.Applicant.controls.INDIVIDUALAPPLICANT.controls
            .PROPOSALAPPLICANTINDIVIDUAL?.controls.MARITALSTATUSCDE.value ==
          '00001'
        ) {
          if (
            this.Applicant.controls.INDIVIDUALAPPLICANT.controls
              .PROPOSALAPPFAMILY.controls.length == 0
          ) {
            // this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPFAMILY.push(
            //   this._proposalForm.proposalIndvidualFamilyMemberForm()
            // );
          }
          this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPFAMILY?.controls[0].controls.FAMCRDNUM.setValue(
            current
          );
        }
      });

    this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL.controls.DATEOFBIRTH.valueChanges
      .pipe(takeUntil(this.subscription$))
      .subscribe((date) => {

        if (this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL.controls.DATEOFBIRTH.value == undefined) {
          this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL?.controls.AGEINYEAR.setValue(0);
          this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL?.controls.AGEINMONTH.setValue(0);
        }
        else {

          let DateStart = this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL.controls.DATEOFBIRTH.value;
          let DateEnd = new Date();

          let tempObj = this.dateParam(DateStart, DateEnd);
          this._proposalSertvice.GetDateDifference(tempObj).pipe(takeUntil(this.subscription$))
            .subscribe(response => {
              this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL.controls.AGEINYEAR.setValue(response.ResultSet.Years);
              this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL.controls.AGEINMONTH.setValue(response.ResultSet.Months);
            })
        }
      });

    this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL?.controls.FIRSTNME.valueChanges
      .pipe(takeUntil(this.subscription$))
      .subscribe((val) => {
        this.SetApplicantName();
      });

    this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL?.controls.MIDDLENME.valueChanges
      .pipe(takeUntil(this.subscription$))
      .subscribe((val) => {
        this.SetApplicantName();
      });

    this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL?.controls.LASTNME.valueChanges
      .pipe(takeUntil(this.subscription$))
      .subscribe((val) => {
        this.SetApplicantName();
      });
    this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL?.controls.CITIZENSHIPCDE.valueChanges.pipe(takeUntil(this.subscription$))
      .subscribe((val) => {
        if (this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL?.controls.CITIZENSHIPCDE.value != "00002") {
          this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL?.controls.CNTRYDOMCDE.setValue('');
          this.isNotWNA = true;
        }
        else this.isNotWNA = false;
      })

  }

  public FIRSTNME_ValueChanged(value: any) {
    if (this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL?.controls.MARITALSTATUSCDE.value == MaritalStatus.Married) {
      if (this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPSPOUSEDETAIL?.controls[0]?.controls.BIRTHDATE.value != null) {
        this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPSPOUSEDETAIL?.controls[0]?.controls.FIRSTNME.setValue(value);
        this._proposalmanagerservice.AddRemoveFamilyTab(true);
      }
    }
  }

  public MIDDLENME_ValueChanged(value: any) {
    if (this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL?.controls.MARITALSTATUSCDE.value == MaritalStatus.Married) {
      if (this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPSPOUSEDETAIL?.controls[0]?.controls.BIRTHDATE.value != null) {
        this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPSPOUSEDETAIL?.controls[0]?.controls.MIDDLENME.setValue(value);
        this._proposalmanagerservice.AddRemoveFamilyTab(true);
      }
    }
  }

  public LASTNME_ValueChanged(value: any) {
    if (this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL?.controls.MARITALSTATUSCDE.value == MaritalStatus.Married) {
      if (this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPSPOUSEDETAIL?.controls[0]?.controls.BIRTHDATE.value != null) {
        this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPSPOUSEDETAIL?.controls[0]?.controls.LASTNME.setValue(value);
        this._proposalmanagerservice.AddRemoveFamilyTab(true);
      }
    }
  }

  public BIRTHDATE_ValueChanged(value: any) {
    if (this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL?.controls.MARITALSTATUSCDE.value == MaritalStatus.Married) {
      if (this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPSPOUSEDETAIL?.controls[0]?.controls.FIRSTNME.value != "" ||
        this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPSPOUSEDETAIL?.controls[0]?.controls.MIDDLENME.value != "" ||
        this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPSPOUSEDETAIL?.controls[0]?.controls.LASTNME.value != "") {
        this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPSPOUSEDETAIL?.controls[0]?.controls.BIRTHDATE.setValue(value);
        this._proposalmanagerservice.AddRemoveFamilyTab(true);
      }
    }
  }

  public OCCUPATIONCDE_ValueChanged(value: any) {
    if (this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL?.controls.MARITALSTATUSCDE.value == MaritalStatus.Married) {
      if (this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPSPOUSEDETAIL?.controls[0]?.controls.BIRTHDATE.value != null &&
        (this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPSPOUSEDETAIL?.controls[0]?.controls.FIRSTNME.value != "" ||
          this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPSPOUSEDETAIL?.controls[0]?.controls.MIDDLENME.value != "" ||
          this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPSPOUSEDETAIL?.controls[0]?.controls.LASTNME.value != "")) {
        this._proposalmanagerservice.AddRemoveFamilyTab(true);
      }
    }
  }

  SetApplicantName() {
    this.Applicant.controls.PROPOSALAPPLICANTMAIN.controls.APPLICANTNME.setValue(
      this._proposaldataService.concatenateNames(
        this.Applicant.value.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL?.FIRSTNME,
        this.Applicant.value.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL?.MIDDLENME,
        this.Applicant.value.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL?.LASTNME
      )
    );

    if (this.Applicant.controls.PROPOSALAPPLICANTMAIN.controls.RowState.value !== DataRowState.Added) {
      this.Applicant.controls.PROPOSALAPPLICANTMAIN.controls.RowState.setValue(DataRowState.Updated);
    }

    this.Applicant.controls.PROPOSALAPPLICANT.controls.APPLICANTNME.setValue(
      this._proposaldataService.concatenateNames(
        this.Applicant.value.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL?.FIRSTNME,
        this.Applicant.value.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL?.MIDDLENME,
        this.Applicant.value.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL?.LASTNME
      )
    );

    if (this.Applicant.controls.PROPOSALAPPLICANT.controls.RowState.value !== DataRowState.Added) {
      this.Applicant.controls.PROPOSALAPPLICANT.controls.RowState.setValue(DataRowState.Updated);
    }
  }

  ResetOLConfiguration() {
    if (this.PROPOSAL.controls.FINANCIALPRODUCTID.value != 13) {
      this.Applicant.controls.PROPOSALAPPLICANTMAIN.controls.INVCOPTNCDE.setValue(
        null
      );
      this.Applicant.controls.PROPOSALAPPLICANTMAIN.controls.ACCTYPCDE.setValue(
        null
      );
      this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL?.controls.CUSTOMERCDEOL.setValue(
        null
      );
    }
  }
  public get CompName(): typeof ComponentName {
    return ComponentName;
  }

  public getSpouseComponent(): string {
    return this.ComponentName + "-Spouse";
  }

  IsMCOMCAMPAIGN() {
    return this._proposaldataService.PROPOSAL.value.ISMCOMCAMPAIGN;
  }

  onEmployeeCheckboxChange() {
    this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL.controls.CALCULATECOMMISSIONIND.setValue(false);
    this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.COMMFIXAMT.setValue(0);
    this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.OJKMARKETINGCOMMISSIONAMT.setValue(0);
    this._calculationService.ResetRentalDetail();
    this._calculationService.RemoveArticleComponent(AmountComponent.JP1Commission);
    this._calculationService.RemoveArticleComponent(AmountComponent.Commission);

    this._proposaldataService.PROPOSALCOMMISSIONENTITY.controls[this._proposaldataService.PROPOSALCOMMISSIONENTITY.value.length - 1].controls.JP1JP2RECIPIENT?.controls?.forEach(rcpnt => {
      rcpnt.controls.JP1TAXEXCULSIVEAMT.setValue(0);
      rcpnt.controls.JP1TAXINCULSIVEAMT.setValue(0);
      rcpnt.controls.JP2TAXEXCULSIVEAMT.setValue(0);
      rcpnt.controls.JP2TAXINCULSIVEAMT.setValue(0);
      if (rcpnt.value.RowState != DataRowState.Added)
        rcpnt.controls.RowState.setValue(DataRowState.Updated);

      this._FormState.ResetFormArrayState(rcpnt?.controls?.PRPLJP1JP2RPNTTAX, DataRowState.Removed);
    })
  }
  onCommissionCheckboxChange() {
    if (this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL.controls.CALCULATECOMMISSIONIND.value == false) {
      var dialog = this._dialog.openDialog(
        'Information',
        "System will not perform any commission calculations.",
        true,
        'Ok'
      );
    }
    this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.COMMFIXAMT.setValue(0);
    this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.OJKMARKETINGCOMMISSIONAMT.setValue(0);
    this._calculationService.ResetRentalDetail();
    this._calculationService.RemoveArticleComponent(AmountComponent.JP1Commission);
    this._calculationService.RemoveArticleComponent(AmountComponent.Commission);
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }

  dateParam(dateStart: any, dateEnd: any) {
    let params = {} as DateParam;
    params.DateStart = dateStart;
    params.DateEnd = dateEnd;
    return params
  }

}
