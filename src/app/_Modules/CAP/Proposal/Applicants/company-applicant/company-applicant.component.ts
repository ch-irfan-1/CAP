import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { EmploymentMasterDataService } from '@NFS_Core/NFSServices/MasterData/employment-master-data.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { StateManagment } from '@NFS_Core/RowStateManagement/FormStateManagement';
import * as PROPOSALENTITY from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import { IProposalApplicantEntity } from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import { IMPOS_APLT_DCMTInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/ProposalApplicantEntity.model.index';
import { ComponentName } from '@NFS_Enums/ComponentName.enum';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FinanceType } from '@NFS_Enums/FinanceType';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { IDTypeCode } from '@NFS_Enums/IDTypeCode';
import { ReturnCode } from '@NFS_Enums/ReturnCode.enum';
import { RoleCode } from '@NFS_Enums/RoleCode';
import { IBusinessPartnerInfoParm } from '@NFS_Interfaces/RequestInterfaces/BusinessPartnerInfoParm';
import { IExistingBPInfoParm } from '@NFS_Interfaces/RequestInterfaces/iexisting-bpinfo-parm';
import { DateParam } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalEntityMapperService } from '@NFS_Modules/CAP/CAPServices/proposal-entity-mapper.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { FormGroup } from 'src/Library';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DealerSearchComponent } from '../../GeneralInfo/dealer-search.component';
import { exposureComponent } from '../exposure/exposure.component';
import { IdSearchComponent } from '../Id-Detail/id-search.component';
import { LastYearNetProfitComponent } from '../last-year-net-profit/last-year-net-profit.component';

@Component({
    selector: 'app-company-applicant',
    templateUrl: './company-applicant.component.html',
    styleUrls: ['./company-applicant.component.css'],
    standalone: false
})
export class CompanyApplicantComponent implements OnInit, OnDestroy {
  @Input() Applicant!: FormGroup<PROPOSALENTITY.IProposalApplicantEntity>;
  @Input() ComponentName!: string;

  tempData: any = ["Dealer 1", "Dealer 2", "Dealer 3"];
  checked = false;
  maxDate: Date = new Date();
  indeterminate = false;
  oldSIUPID: string = '';
  phoneColumns: string[] = ['phoneType', 'country', 'countryCode', 'phoneNumber', 'ext', 'def', 'ufs', 'del'];
  addTpeDetColumns: string[] = ['addressType', 'applicable', 'default'];
  dataSource = [
    { position: 1, addressType: 'Contact Address', weight: 1.0079, symbol: 'H' },
    { position: 1, addressType: 'Emergency Address', weight: 1.0079, symbol: 'H' },
    { position: 1, addressType: 'International Address', weight: 1.0079, symbol: 'H' },
    { position: 1, addressType: 'Legal Address', weight: 1.0079, symbol: 'H' },
    { position: 1, addressType: 'NPWP Address', weight: 1.0079, symbol: 'H' },
    { position: 1, addressType: 'Office Address', weight: 1.0079, symbol: 'H' },
    { position: 1, addressType: 'Residence Address', weight: 1.0079, symbol: 'H' },
  ];
  addressDataSource = [
    { position: 1, addressType: 'Contact Address', weight: 1.0079, symbol: 'H' }
  ];
  PRPOSALAPPLICANT!: FormGroup<PROPOSALENTITY.IProposalApplicantEntity>[];
  PROPOSAL!: FormGroup<PROPOSALENTITY.IPRPLInfo>;
  private subscription$ = new Subject();
  isSignatureVerified!: boolean;
  mask: string = "separator.2";
  public isExistingBPLoaded = false;
  isControlDisabledView = false;
  tempBusinessLineArray: any

  constructor(private dialog: MatDialog, public _masterDataService: MasterDataService, public _proposaldataService: ProposalDataService,
    public _employmentMasterDataService: EmploymentMasterDataService, private _proposalMapperService: ProposalEntityMapperService,
    private _FormModeService: FormModeService, private _proposalSertvice: ProposalService,
    private _proposalForm: ProposalEntityFormService, private _FormState: StateManagment) { }

  panelOpenState = false;

  ngOnInit(): void {

    if (this._FormModeService.FormMode == FormMode.VIEW) {
      this.isControlDisabledView = true;
    }

    this._proposaldataService.SetCurrentApplicant = this.Applicant;
    this._proposaldataService.ApplicantType = this.Applicant.value.PROPOSALAPPLICANTMAIN.APPLICANTTYP;
    this._employmentMasterDataService.getmasterDataForEmployment().pipe(takeUntil(this.subscription$)).subscribe(data => {
      this._employmentMasterDataService.BusinessLine = data?.BusinessLine?.ResultSet?.DataCollection;
      this._employmentMasterDataService.BusinessType = data?.BusinessType?.ResultSet?.DataCollection;
      this._employmentMasterDataService.EconomicSector = data?.EconomicSector?.ResultSet?.DataCollection;
    });
    this.PRPOSALAPPLICANT = this._proposaldataService.PROPOSALAPPLICANT.controls.filter(x => x.controls.RowState.value != DataRowState.Removed);
    this._proposaldataService.PROPOSALAPPLICANT.controls[0].controls.ISAUDITABLE.setValue(true);

    this.valueChangeSubscription();
    this.CalculateEstablishmentDate();
    this.PROPOSAL = this._proposaldataService.PROPOSAL;

    let SIUPIdType = this.Applicant.value.PROPOSALAPPLICANTIDDETAIL.filter(x => x.IDTYPECDE == IDTypeCode.SIUP && x.RowState !== DataRowState.Removed)[0];

    ///[load BP disble/enable fields based on ind]
    if (SIUPIdType?.BPIDSEQ > 0) {
      this.isExistingBPLoaded = true;
    }
    else {
      this.isExistingBPLoaded = false;
    }

    //----------------mPOS APPLICATION

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


    this.isOfficeNFactoryChecked.ownOffice = this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.OFFICEOWN.value;
    this.isOfficeNFactoryChecked.leaseOffice = this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.OFFICELEASE.value;
    this.isOfficeNFactoryChecked.ownFactory = this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.FACTORYOWN.value;
    this.isOfficeNFactoryChecked.leaseFactory = this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.FACTORYLEASE.value;
    if (this._proposaldataService.CurrentApplicant != null && this._proposaldataService.CurrentApplicant.controls.PROPOSALAPPLICANTIDDETAIL != null) {
      let _IdDetails = this._proposaldataService.CurrentApplicant.controls.PROPOSALAPPLICANTIDDETAIL.controls.find(p => p.controls.DEFAULTIND.value == true && p.controls.RowState.value != DataRowState.Removed);
      if (_IdDetails != null || _IdDetails != undefined) {
        this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.IDCARDTYP.setValue(_IdDetails.controls.IDTYPECDE.value);
      }
      else {
        this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.COMPANYNBR.setValue('');
      }
    }
  }

  IsOL() {
    return this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.OperatingLease;
  }
  openDealerSearch() {

    const dialogRef = this.dialog.open(DealerSearchComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      disableClose: true,
      panelClass: 'cdk-overlay-pane-custom',
      data: { "id": 123456 },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
      }
    });
  }

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

  setmPOSDocumentData(doc: any): IMPOS_APLT_DCMTInfo {
    let mPosDoc: any = this._proposalForm.mPOSApplicantDocumentInfoForm().value;
    if (doc !== null) {
      mPosDoc.DOCUMENTCDE = doc.DOCUMENTCDE;
      mPosDoc.DOCUMENTNAME = doc.DOCUMENTNAME;
      mPosDoc.DOCUMENTPATH = doc.DOCUMENTPATH;
      mPosDoc.DOCUMENTSEQID = doc.DOCUMENTSEQID;
      mPosDoc.DOCUMENTTYPE = doc.DOCUMENTTYPE;
      mPosDoc.IMAGETYPE = doc.IMAGETYPE;
      mPosDoc.ISMANDATORY = doc.ISMANDATORY;
      mPosDoc.LATITUDE = doc.LATITUDE;
      mPosDoc.LONGITUDE = doc.LONGITUDE;
      mPosDoc.PROPOSALID = doc.PROPOSALID;
      mPosDoc.ROLECDE = doc.ROLECDE;
      mPosDoc.TIMESTAMP = doc.TIMESTAMP;
    }
    return mPosDoc;
  }

  openIdSearch() {
    let SIUPIdType = this.Applicant.value.PROPOSALAPPLICANTIDDETAIL.filter(x => x.IDTYPECDE == IDTypeCode.SIUP && x.RowState !== DataRowState.Removed)[0];
    this.oldSIUPID = SIUPIdType?.IDTYPENBR;

    const dialogRef = this.dialog.open(IdSearchComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: {
        "IDTypeArray": this.Applicant.controls.PROPOSALAPPLICANTIDDETAIL,
        "ProposalId": this.Applicant.controls.PROPOSALAPPLICANT.value.PROPOSALID
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      let index = 0;
      if (typeof result == 'object') {
        index = this._proposaldataService.PROPOSALAPPLICANT.value.findIndex(app => app === this.Applicant.value);

        result.PROPOSALAPPLICANT.ROLECDE = this.Applicant.value.PROPOSALAPPLICANT.ROLECDE;
        result.PROPOSALAPPLICANTMAIN.APPLICANTTYP = this.Applicant.value.PROPOSALAPPLICANTMAIN.APPLICANTTYP;
        result.PROPOSALAPPLICANTMAIN.ROLECDE = result.PROPOSALAPPLICANT.ROLECDE;

        if (this._proposaldataService.PROPOSAL.value.ISFROMMPOS && this.Applicant.value.PROPOSALAPPLICANT.ROLECDE === RoleCode.Borrower &&
          this.Applicant.value.MPOSDOCUMENTS !== null && this.Applicant.value.MPOSDOCUMENTS.length > 0) {
          result.MPOSDOCUMENTS = [];
          this.Applicant.value.MPOSDOCUMENTS.forEach(doc => {
            result.MPOSDOCUMENTS.push(this.setmPOSDocumentData(doc));
          })
        }

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
        bpInfoParam.BranchId = this._proposaldataService.PROPOSAL.value.BPCOMPANYBRANCHID;
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

      let SIUPIdType = this.Applicant.value.PROPOSALAPPLICANTIDDETAIL.filter(x => x.IDTYPECDE == IDTypeCode.SIUP && x.RowState !== DataRowState.Removed)[0];
      ///[load BP disble/enable fields based on ind]
      if (result?.APPLICANTTYPE !== undefined && result?.APPLICANTTYPE !== null) {
        if (result?.APPLICANTTYPE === "Contract") {
          this.isExistingBPLoaded = true;
        }
        else {
          this.isExistingBPLoaded = false;
        }
      }
      else if (this.oldSIUPID !== SIUPIdType.IDTYPENBR) {
        let existingBPParams = {} as IExistingBPInfoParm;
        existingBPParams.IdCardNumber = SIUPIdType.IDTYPENBR;
        existingBPParams.IdCardTyp = SIUPIdType.IDTYPECDE;

        this._proposalSertvice.ReadExistingBPCompany(existingBPParams).pipe(takeUntil(this.subscription$)).subscribe(res => {
          if (res && res.ResultSet && res.ResultSet.length > 0 && res.ResultSet[0].APPLICANTTYPE === "Contract") {
            this.isExistingBPLoaded = true;
            this._proposaldataService.CurrentApplicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.patchValue({
              NAME: ''
            });
          }
          else {
            this.isExistingBPLoaded = false;
          }
        });
      }

      let defaultIdTypeExist = this.Applicant.value.PROPOSALAPPLICANTIDDETAIL.filter(x => x.DEFAULTIND == true && x.RowState !== DataRowState.Removed)[0];
      if (defaultIdTypeExist) {
        this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.IDCARDTYP.setValue(defaultIdTypeExist.IDTYPECDE);
        this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.COMPANYNBR.setValue(defaultIdTypeExist.IDTYPENBR);
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
        _param.ApplicantType = this._proposaldataService.ApplicantType;
        _param.LegalStatusCde = '00001';
        _param.ApplicantName =
          this.Applicant.value.PROPOSALAPPLICANTMAIN.APPLICANTNME;
        _param.IdCardNumber =
          this.Applicant.value.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL?.IDCARDNBR;
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
      if (typeof result == 'object') {
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
    });
  }
  public get CompName(): typeof ComponentName {
    return ComponentName;
  }

  CalculateEstablishmentDate() {
    let DateStart = this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.ESTABLISHEDSINCE.value;
    let DateEnd = new Date();

    let tempObj = this.dateParam(DateStart, DateEnd);
    this._proposalSertvice.GetDateDifference(tempObj).pipe(takeUntil(this.subscription$))
      .subscribe(response => {
        this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.ESTABLISHEDSINCEYY.setValue(response.ResultSet.Years);
        this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.ESTABLISHEDSINCEMM.setValue(response.ResultSet.Months);
      });
  }

  valueChangeSubscription() {
    this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.ESTABLISHEDSINCE.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(date => {

      if (date == undefined) {
        this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.ESTABLISHEDSINCEYY.setValue(0);
        this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.ESTABLISHEDSINCEMM.setValue(0);
      }
      else {
        this.CalculateEstablishmentDate();
      }
    });

    this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY?.controls.NAME.valueChanges
      .pipe(takeUntil(this.subscription$))
      .subscribe((val) => {
        this.SetApplicantName(val);
      });

    if (this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.INDUSTRYTYPECDE != undefined) {
      this.tempBusinessLineArray = this._employmentMasterDataService.BusinessLine.filter((ele: any) => ele.OptionalData.INDUSTRYTYPECDE == this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.INDUSTRYTYPECDE.value)
    }
  }

  SetApplicantName(val: string) {
    this.Applicant.controls.PROPOSALAPPLICANTMAIN.controls.APPLICANTNME.setValue(val);
    if (this.Applicant.value.PROPOSALAPPLICANTMAIN.RowState !== DataRowState.Added) {
      this.Applicant.controls.PROPOSALAPPLICANTMAIN.controls.RowState.setValue(DataRowState.Updated);
    }
  }

  ResetOLConfiguration() {
    if (this.PROPOSAL.controls.FINANCIALPRODUCTID.value != 13) {
      this.Applicant.controls.PROPOSALAPPLICANTMAIN.controls.INVCOPTNCDE.setValue(null);
      this.Applicant.controls.PROPOSALAPPLICANTMAIN.controls.ACCTYPCDE.setValue(null);
      this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.SHOWWHTOL.setValue(null);
    }
  }

  isOfficeNFactoryChecked = {
    "ownOffice": false,
    "leaseOffice": false,
    "ownFactory": false,
    "leaseFactory": false
  }


  officeTypeChange(evnt: any) {
    if (evnt.value == 1) {
      if (this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.RowState.value != DataRowState.Added) {
        this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.RowState.setValue(DataRowState.Updated);
      }
      this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.OFFICEOWN.setValue(true);
      this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.OFFICELEASE.setValue(false);
      this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.OFFICELEASEAMOUNT.setValue(0);
      this.isOfficeNFactoryChecked.ownOffice = true;
      this.isOfficeNFactoryChecked.leaseOffice = false;
    }
    if (evnt.value == 2) {
      if (this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.RowState.value != DataRowState.Added) {
        this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.RowState.setValue(DataRowState.Updated);
      }
      this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.OFFICELEASE.setValue(true);
      this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.OFFICEOWN.setValue(false);
      this.isOfficeNFactoryChecked.ownOffice = false;
      this.isOfficeNFactoryChecked.leaseOffice = true;
    }
  }

  FactoryTypeChange(evnt: any) {
    if (evnt.value == 1) {
      if (this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.RowState.value != DataRowState.Added) {
        this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.RowState.setValue(DataRowState.Updated);
      }
      this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.FACTORYOWN.setValue(true);
      this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.FACTORYLEASE.setValue(false);
      this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.FACTORYLEASEAMOUNT.setValue(0);
      this.isOfficeNFactoryChecked.ownFactory = true;
      this.isOfficeNFactoryChecked.leaseFactory = false;
    }
    if (evnt.value == 2) {
      if (this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.RowState.value != DataRowState.Added) {
        this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.RowState.setValue(DataRowState.Updated);
      }
      this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.FACTORYLEASE.setValue(true);
      this.Applicant.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.FACTORYOWN.setValue(false);
      this.isOfficeNFactoryChecked.ownFactory = false;
      this.isOfficeNFactoryChecked.leaseFactory = true;
    }
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

  onChangeBusinessType(evnt: any) {
    if (evnt != undefined) {
      this.tempBusinessLineArray = this._employmentMasterDataService.BusinessLine.filter((ele: any) => ele.OptionalData.INDUSTRYTYPECDE == evnt.value)
    }
  }
}
