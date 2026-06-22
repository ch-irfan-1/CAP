import { animate, state, style, transition, trigger } from '@angular/animations';
import { DatePipe } from "@angular/common";
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DialogBoxService } from '@NFS_Core/NFSServices/DialogBox/dialog-box.service';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { AssetDetailsMasterdataService } from '@NFS_Core/NFSServices/MasterData/asset-details-masterdata.service';
import { AssetSearchMasterdataService } from '@NFS_Core/NFSServices/MasterData/asset-search-masterdata.service';
import { InsuranceMasterDataService } from '@NFS_Core/NFSServices/MasterData/insurance-master-data.service';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { StateManagment } from '@NFS_Core/RowStateManagement/FormStateManagement';
import { IProposalArticleEntity } from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import { IMainInsuranceEntity, IPRPL_ADDL_INSRInfo, IPRPL_STND_INSRInfo, IStandardInsuranceDetailEntity, IStandardInsuranceEntity } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/ProposalArticleEntity.model.index';
import { AmountClassification } from '@NFS_Enums/AmountClassification.enum';
import { AmountComponent } from '@NFS_Enums/AmountComponent';
import { AssetComponentsFinancialConfiguration } from '@NFS_Enums/AssetComponentsFinancialConfiguration.enum';
import { AssetInsuranceType } from '@NFS_Enums/AssetInsuranceType.enum';
import { CommissionType } from '@NFS_Enums/CommissionType.enum';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FinanceType } from '@NFS_Enums/FinanceType.enum';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { InsuranceCollectionTypes } from '@NFS_Enums/InsuranceCollectionTypes.enum';
import { InsurancePremiumTypes } from '@NFS_Enums/InsurancePremiumTypes.enum';
import { InsuranceType } from '@NFS_Enums/InsuranceType.enum';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { RoleCode } from '@NFS_Enums/RoleCode';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { IBusinessPartnerInfoParm } from '@NFS_Interfaces/RequestInterfaces/BusinessPartnerInfoParm';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { CalculationService } from '@NFS_Modules/CAP/CAPServices/calculation.service';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalEntityMapperService } from '@NFS_Modules/CAP/CAPServices/proposal-entity-mapper.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { ProposalManagerService } from '@NFS_Modules/CAP/_helpers/proposal-manager.service';
import { FormArray, FormBuilder, FormGroup } from 'src/Library';
import  moment from 'moment';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { DepreciationPolicyComponent } from './depreciation-policy/depreciation-policy.component';


export const MY_FORMATS_ORG = {
  parse: {
    dateInput: 'DD-MM-YYYY'
  },
  display: {
    dateInput: "DD-MM-YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};

@Component({
    selector: 'app-insurance-premium',
    templateUrl: './insurance-premium.component.html',
    styleUrls: ['./insurance-premium.component.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE]
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_ORG },
        DatePipe
    ],
    standalone: false
})
export class InsurancePremiumComponent implements OnInit, OnDestroy {


  private subscription$ = new Subject();
  public insuranceCompanies: INFSDropDownData[] = [];
  //public PRPLINSR !: FormGroup<IPRPL_INSRInfo>;

  isCertificateNumberEnabled: boolean = true;
  tempData: any = [{ code: "00001", TextValue: "one 1" }, { code: "00002", TextValue: "two 2" }, { code: "00003", TextValue: "three 3" }];
  panelOpenState = false;
  InsurancePanelOpenState = false;
  InsuranceDetailPanelOpenState = false;
  Mode = FormMode.NEW;
  isViewModeInsurance = false;
  public msg: Array<string> = [];
  public STANDARDINSURANCE !: FormArray<IStandardInsuranceEntity>;// =this._formBuilder.array<IStandardInsuranceEntity>([]);
  public STANDARDINSURANCEDetail: FormArray<IStandardInsuranceDetailEntity> = this._formBuilder.array<IStandardInsuranceDetailEntity>([]);
  // public PROPOSALINSURANCEMAIN !: FormArray<IMainInsuranceEntity>;
  public btnCalculateIsEnabled: boolean = this._calService.btnInsCalculateIsEnabled;
  private identifier = 0;
  public standardInsurance: boolean = false;

  private AmntTotal: number = 0;
  private OldReceiveByDealer: boolean = false;
  isCF: boolean = false;
  isCOVERAGEAMT: boolean = false;
  INSURANCEB2BIND: boolean = false;
  UPDATEDB2BIND: boolean = false;
  chkReceiveByDealer: boolean = false;
  RECEIVEBYDEALERIND: boolean = false;
  public mask: string = "separator.2";
  policyCodePreviousValue = '';
  private IsCalculationPerformed: boolean = false;
  classAppliedInsurance = false;

  constructor(private dialog: MatDialog, public _prplData: ProposalDataService, public _calService: CalculationService, public _assetMasterData: AssetDetailsMasterdataService,
    public _proposalManager: ProposalManagerService, public _insuranceMasterDataService: InsuranceMasterDataService, public _assetSearchMasterData: AssetSearchMasterdataService, private _dialog: DialogBoxService,
    private _FormMode: FormModeService, private _proposalService: ProposalService, private _messageService: MessageService,
    private _formBuilder: FormBuilder, private _FormState: StateManagment, private _formService: ProposalEntityFormService, private _prplEntityMapper: ProposalEntityMapperService) { }
  // private _FormMode: FormModeService, private _proposalService: ProposalService, private _messageService: MessageService) { }
  // private _FormMode: FormModeService, private _proposalService: ProposalService, private _messageService: MessageService, private _FormState: StateManagment, private _formService: ProposalEntityFormService) { }

  ngOnInit(): void {
    // this.PRPLINSR = this._prplData.PRPLINSR;
    // this.PRPLINSR.controls.ASSETCOST.setValue(this._prplData.PROPOSALFINANCIALAGREEMENT.controls.ASSETAMT.value);
    this.AmntTotal = this._prplData.PROPOSALFINANCIALAGREEMENT.value.INSURANCEPREMIUM;
    this.OldReceiveByDealer = this._prplData.ASSETENTITY.value.PROPOSALINSURANCEMAIN.find(x => x.RowState != DataRowState.Removed)?.PRPLINSR.RECEIVEBYDEALERIND as boolean;

    this._insuranceMasterDataService.GetAllAssetInsuranceLookup().pipe(takeUntil(this.subscription$)).subscribe(res => {
      this._insuranceMasterDataService.AddlInsurances = res.ResultSet.ADDLINSRCODE?.map((a: any) => { return { code: a.ADDLINSRCDE, TextValue: a.ADDLINSRDSC, OptionalData: { COVERAGEAMT: a.COVERAGEAMT } } });
      this._insuranceMasterDataService.CmptFinTypeCde = res.ResultSet.CMPTFINETYPECODE.map((a: any) => { return { code: a.CMPTFINETYPECDE, TextValue: a.CMPTFINETYPEDSC } });;
      this._insuranceMasterDataService.InsrUsageTypeCode = res.ResultSet.INSRASETUSAGETYPECODE.map((a: any) => { return { code: a.INSRASETUSGETYPECDE, TextValue: a.INSRASETUSGETYPEDSC } });;
      this._insuranceMasterDataService.InsrCompany = res.ResultSet.INSRCOMPANY.map((a: any) => { return { code: String(a.BUSINESSPARTNERID), TextValue: a.BUSINESSPARTNERNME } });
      this._insuranceMasterDataService.InsrExtTypeCode = res.ResultSet.INSREXTNTYPECODE.map((a: any) => { return { code: a.INSREXTNTYPECDE, TextValue: a.INSREXTNTYPEDSC } });;
      this._insuranceMasterDataService.InsuranceTypes = res.ResultSet.INSRTYPECODE.map((a: any) => { return { code: a.INSRTYPECDE, TextValue: a.INSRTYPEDSC } });;
      this._insuranceMasterDataService.InsuranceRegions = res.ResultSet.RGNSCODE.map((a: any) => { return { code: a.RGNSCDE, TextValue: a.RGNSDSC } });
    });
    this.ucInsuranceDetails_Loaded();
    this.valueChangeSubscriptions();
    let prpl = {} as IProposalInfoParm;
    prpl.FinanceType = this._prplData.PROPOSAL.controls.FINANCETYP.value;
    this._insuranceMasterDataService.GetInsuranceCollection(prpl).subscribe(res => {
      if (this._prplData.PROPOSAL.value.FINANCETYP == FinanceType.Refinance) {
        //let temp =this._insuranceMasterDataService.InsrCollectionMethodCode
        this._insuranceMasterDataService.InsrCollectionMethodCode = (res.ResultSet[0].DataCollection as Array<INFSDropDownData>).filter(x => x.code == InsuranceCollectionTypes.Upfront || x.id == InsuranceCollectionTypes.Upfront)
      }
      else {
        this._insuranceMasterDataService.InsrCollectionMethodCode = res.ResultSet[0].DataCollection;
      }

      this._insuranceMasterDataService.InsrPremiumType = res.ResultSet[1].DataCollection
    });


    // this.STANDARDINSURANCE.value.map((c: any) => {
    //   this.dataSource.push(c);
    // });

    this._calService.BindDepreciationCharts();
    this.policyCodePreviousValue = this._prplData.PRPLINSR.controls.DEPRECIATIONPOLICYCDE.value;
    if (this._FormMode.FormMode == FormMode.VIEW) {
      this.isViewModeInsurance = true;
    }
  }

  standardInsuranceDetailDataSource = new MatTableDataSource<IStandardInsuranceDetailEntity>();
  // standardInsuranceDataSource = this._prplData.STANDARDINSURANCE.value;
  standardInsuranceDataSource = new MatTableDataSource<IStandardInsuranceEntity>();

  columnsToDisplay = ['addDataRow', 'PRPLSTNDINSR.COLLECTIONMETHODCDE', 'PRPLSTNDINSR.INSURANCEPREMIUMTYPECDE', 'PRPLSTNDINSR.INSRTYPECDE', 'PRPLSTNDINSR.TERMFROM', 'PRPLSTNDINSR.TERMTO', 'PRPLSTNDINSR.TOTALPREMIUMAMNT', 'PRPLSTNDINSR.STARTDTE', 'PRPLSTNDINSR.ENDDTE', 'PRPLSTNDINSR.INSURANCECERTIFICATENUMBER', 'PRPLSTNDINSR.INSURANCECOMPANYID', 'removeDataRow'];
  displayedColumns3 = ['addRow2', 'PRPLADDLINSR.ADDITIONALCOVERAGECDE', 'PRPLADDLINSR.EXTENTIONTYPECDE', 'PRPLADDLINSR.TPLCOVERAGEAMNT', 'PRPLADDLINSR.TOTALPREMIUMAMNT', 'removeRow'];
  StandardInduranceDetailColumns = ['addDataRow', 'PRPLSTNDINSRDETL.COLLECTIONMETHODCDE', 'PRPLSTNDINSRDETL.INSRTYPECDE', 'PRPLSTNDINSRDETL.TERMFROM', 'PRPLSTNDINSRDETL.TERMTO', 'PRPLSTNDINSRDETL.DEPRECIATIONRTE', 'PRPLSTNDINSRDETL.STARTDTE', 'PRPLSTNDINSRDETL.ENDDTE', 'PRPLSTNDINSRDETL.SUMINSUREDAMNT', 'PRPLSTNDINSRDETL.MININSRPREMIUMRTE', 'PRPLSTNDINSRDETL.MAXINSRPREMIUMRTE', 'PRPLSTNDINSRDETL.DEFAULTPREMIUMRTE', 'PRPLSTNDINSRDETL.FINALPREMIUMRTE', 'PRPLSTNDINSRDETL.PREMIUMAMNT', 'PRPLSTNDINSRDETL.LOADINGRTE', 'PRPLSTNDINSRDETL.INSURANCEPREMIUMTYPECDE', 'PRPLSTNDINSRDETL.FIXPREMIUMAMT'];
  columnsAdditionalInsuranceDetail = ['PRPLADDLINSRDETL.ADDITIONALCOVERAGECDE', 'PRPLADDLINSRDETL.INSURANCEPREMIUMTYPECDE', 'PRPLADDLINSRDETL.FIXPREMIUMAMT', 'PRPLADDLINSRDETL.EXTENSIONTYPECDE', 'PRPLADDLINSRDETL.MININSRPREMIUMRTE', 'PRPLADDLINSRDETL.MAXINSRPREMIUMRTE', 'PRPLADDLINSRDETL.DEFAULTPREMIUMRTE', 'PRPLADDLINSRDETL.TPLCOVERAGEAMNT', 'PRPLADDLINSRDETL.TPLCOVERAGERTE', 'PRPLADDLINSRDETL.PREMIUMAMNT'];
  expandedElement: any;
  expandedElement1: any;
  openAdditionalInsurance() {
    this.classAppliedInsurance = !this.classAppliedInsurance;
  }

  openDepreciationPolicy() {
    const dialogRef = this.dialog.open(DepreciationPolicyComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      disableClose: true,
      panelClass: 'cdk-overlay-pane-custom',
      data: { "id": 221 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  valueChangeSubscriptions() {
    /*this.PRPLINSR.controls.INSURER.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.subscription$)).subscribe(() => {
      this.PRPLINSR.controls.CERTIFICATENBR.setValue('');
      this._assetMasterData.DepreciationPolicy = [];
      this.PRPLINSR.controls.DEPRECIATIONPOLICYCDE.setValue('');
      this._calService.ApplyInsuranceChart(true);

      if (this._prplData.PROPOSALFINANCIALAGREEMENT.value != null) {
        this._prplData.PROPOSALFINANCIALAGREEMENT.controls.INSURANCEPREMIUM.setValue(this._proposalManager.TotalPremiumAmount);
      }
      this._calService.ReadBPInsuranceDetailInsurance(false);
    });*/
    /*this.PRPLINSR.controls.DEPRECIATIONPOLICYCDE.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.subscription$)).subscribe(res => {
      // if (previous != current) {
      if (this._proposalManager.TotalPremiumAmount > 0 || (this._prplData.STANDARDINSURANCE != null
          && this._prplData.STANDARDINSURANCE.length > 0
          && this._prplData.STANDARDINSURANCE.controls.filter(p => p.value.PRPLSTNDINSR.COLLECTIONMETHODCDE != InsuranceCollectionTypes.LeaseClause).length > 0)) {
        var dialog = this._dialog.openDialog("Confirmation", "Standard Insurance Premium amount will be reset. Are you sure?", false, "Yes", "No");
        dialog.afterClosed().subscribe((result: any) => {
          if (result === "ok") {

          }
        })
      }
      else {
        this._calService.PopulateDepreciationPolicy();
      }
       // }
    });
    this.PRPLINSR.controls.ASSETUSAGECDE.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.subscription$)).subscribe(res => {
      this._calService.ReadBPInsuranceDetailInsurance(true);
    })*/
    this._prplData.PRPLINSR.controls.ASSETUSAGEDEFAULTRTE.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.subscription$)).subscribe(res => {
      if (this._prplData.PROPOSALINSURANCEMAIN != null) {
        if (!(this._prplData.PRPLINSR.value.ASSETUSAGEMINRTE <= this._prplData.PRPLINSR.controls.ASSETUSAGEDEFAULTRTE.value) || !(this._prplData.PRPLINSR.value.ASSETUSAGEMAXRTE >= this._prplData.PRPLINSR.controls.ASSETUSAGEDEFAULTRTE.value)) {
          this._prplData.PRPLINSR.controls.ASSETUSAGEDEFAULTRTE.setValue(this._prplData.PRPLINSR.value.ASSETUSAGEMINRTE);
          this._messageService.showMesssage("RateMustInBetween", MessageType.Warning);
        }

        this._prplData.PRPLINSR.updateValueAndValidity({ emitEvent: false, onlySelf: true });
        this._proposalManager.ReCalculateInsurancePremiumRate();
        this.updateTable();
        /* if (!Controller.DataContext.PROPOSAL.ISPACKAGE) {
           Controller.ReCalculateInsurancePremiumRate();
           txtTotalPremiumAmount.Value = Controller.TotalPremiumAmount;
         }*/
      }
    })
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }

  ucInsuranceDetails_Loaded() {
    if (this._prplData.PROPOSALINSURANCEMAIN.value.filter(x => x.RowState != DataRowState.Removed).length == 0) {
      this._prplData.PROPOSALINSURANCEMAIN.push(this._formService.PropsalMainInsuranceForm());
    }
    //    this.loadData();
    this.convertINSURANCECOMPANYIDToString();
    this.isCertificateNumberEnabled = this._prplData.PRPLINSR.controls.UPDATEDB2BIND.value;
    //this.PRPLINSR = this._prplData.PRPLINSR;
    this.STANDARDINSURANCE = this._prplData.STANDARDINSURANCE;
    this._prplData.PRPLINSR.controls.ASSETCOST.setValue(this._prplData.PROPOSALFINANCIALAGREEMENT.controls.ASSETAMT.value);
    this._prplData.PRPLINSR.controls.STARTDTE.setValue(this._prplData.PROPOSALFINANCIALAGREEMENT.controls.CONTRACTSTARTDTE.value);
    if (this._FormMode.FormMode != FormMode.VIEW) {
      let tempDate: Date = this._prplData.PROPOSALFINANCIALAGREEMENT.controls.CONTRACTSTARTDTE.value;
      //tempDate.setMonth(this._prplData.getMonths(this._prplData.PROPOSALFINANCIALAGREEMENT.controls.CONTRACTSTARTDTE.value)[1] + this._prplData.PROPOSALFINANCIALAGREEMENT.controls.CONTRACTTRM.value);
      this._prplData.PRPLINSR.controls.EXPIRYDTE.setValue(moment(tempDate).add(Number(this._calService.contractTerms), 'months').toDate()); //this._prplData.PROPOSALFINANCIALAGREEMENT.controls.CONTRACTTRM.value
    }

    if (this._prplData.PROPOSALVEHICLEDETAIL.controls.CITYOFREGISTRATIONOTO.value > 0) {
      // Read Province of City by CityofRegistration
      let param = {} as IProposalInfoParm;
      param.CountryId = this._prplData.PROPOSALVEHICLEDETAIL.controls.CITYOFREGISTRATIONOTO.value;
      this._proposalService.ReadProvinceofCity(param).pipe(takeUntil(this.subscription$)).subscribe(result => {
        if (result) {
          this._prplData.PRPLINSR.controls.REGIONCDE.setValue(result.ResultSet[0].INSURANCEREGIONCDE);
        }
      });
    }
    if (this._prplData.PRPLINSR.value.TOTALUPFRONTAMNT > 0 && this._FormMode.FormMode != FormMode.VIEW && this._prplData.PROPOSAL.value.FINANCETYP != FinanceType.Refinance) {
      this._proposalManager.chkReceiveByDealer = true;
    }
    else {
      this._proposalManager.chkReceiveByDealer = false;
    }
    if (this._prplData.PROPOSAL.value.ISMCOMCAMPAIGN == true)
      this._proposalManager.chkReceiveByDealer = false;
    this.updateTable();
    this._assetMasterData.DepreciationPolicy = [];
  }

  //@ViewChild(MatTable) table1 !: MatTable<IStandardInsuranceEntity>;

  addStandardInsuranceRow() {
    //let standardInsuranceForm: FormGroup<IStandardInsuranceEntity> = this._formService.StandardInsuranceForm();
    if (this._FormMode.FormMode != FormMode.VIEW) {
      if (this._prplData.STANDARDINSURANCE.controls.length > 0) {
        if (this.isInsuranceDataValid()) {
          // this.STANDARDINSURANCE.push(standardInsuranceForm);
          this.AddRows();
          this._calService.EnableInsuranceCalculateButton();
        }
        else {
          // this._messageService.showMesssage(this.msg,  MessageType.Info);
        }
      }
      else {
        if (this.isInsuranceDataValid()) {
          //this.STANDARDINSURANCE.push(standardInsuranceForm);
          this.AddRows();
          this._calService.EnableInsuranceCalculateButton();
        }
        else {
          //Message.ErrorMessage(msg.ToString());
        }
      }
      this.updateTable();
    }
  }

  removeStandardInsuranceRow(indexCurrent: number) {
    var dialog = this._dialog.openDialog("Confirmation", "Are you want to remove standard insurance and all the standard insurance details?", false, "Yes", "No");
    dialog.afterClosed().subscribe((result: any) => {
      if (result === "ok") {
        //let main = this._prplData.STANDARDINSURANCE.controls[indexCurrent];//.controls
        // let lastIndex = this._prplData.STANDARDINSURANCE.controls.length - 1;
        let tempSndArrray = this._prplData.STANDARDINSURANCE.value.filter(x => x.RowState != DataRowState.Removed);
        let main = tempSndArrray[indexCurrent];
        let index = this._prplData.STANDARDINSURANCE.value.indexOf(main);
        //indexCurrent = tempSndArrray.indexOf(main.value); comment as now index comes from filtered array
        let lastIndex = tempSndArrray.length - 1;
        if (indexCurrent == lastIndex && indexCurrent != 0) {
          if (tempSndArrray[indexCurrent - 1] != null) {
            tempSndArrray[indexCurrent - 1].PRPLSTNDINSR.TERMTO = main.PRPLSTNDINSR.TERMTO;
            tempSndArrray[indexCurrent - 1].PRPLSTNDINSR.ENDDTE = main.PRPLSTNDINSR.ENDDTE;
            //Controller.PROPOSAL_INSURANCE_DETAIL.MAININSURANCE[indexCurrent - 1].PRPLSTNDINSR.TERMTO = main.PRPLSTNDINSR.TERMTO;

            let element = tempSndArrray[indexCurrent - 1];
            let currentIndex = this._prplData.STANDARDINSURANCE.value.indexOf(element);
            this._prplData.STANDARDINSURANCE.controls[currentIndex].patchValue(element);
            this.rowStateOnStandardInsuraceValueChange(currentIndex); // to mark row state updated in standard insurance at index
          }
        }
        else {
          if (tempSndArrray[indexCurrent + 1] != null) {
            tempSndArrray[indexCurrent + 1].PRPLSTNDINSR.TERMFROM = main.PRPLSTNDINSR.TERMFROM;
            tempSndArrray[indexCurrent + 1].PRPLSTNDINSR.STARTDTE = main.PRPLSTNDINSR.STARTDTE;
            let element = tempSndArrray[indexCurrent + 1];
            let currentIndex = this._prplData.STANDARDINSURANCE.value.indexOf(element);
            this._prplData.STANDARDINSURANCE.controls[currentIndex].patchValue(element);
            this.rowStateOnStandardInsuraceValueChange(currentIndex); // to mark row state updated in standard insurance at index
          }
          //Controller.PROPOSAL_INSURANCE_DETAIL.MAININSURANCE[indexCurrent + 1].PRPLSTNDINSR.TERMFROM = main.PRPLSTNDINSR.TERMFROM;
        }
        /*main.STANDARDINSURANCEDETAIL.RemoveAll();
          main.PRPLADDLINSR.RemoveAll();
          if (this.Mode == FormMode.New)
          RearrangeID(main);
          Controller.MainInsuranceEntity.STANDARDINSURANCE.Remove(main);*/
        if (this._prplData.STANDARDINSURANCE.controls[index].controls.RowState.value == DataRowState.Added) {
          this._prplData.STANDARDINSURANCE.removeAt(index);
        }
        else {
          //this.STANDARDINSURANCE.controls[indexCurrent].controls.RowState.setValue(DataRowState.Removed)
          this._FormState.ResetFormState(this._prplData.STANDARDINSURANCE.controls[index], DataRowState.Removed);
          // this._FormState.ResetFormArrayState(this._prplData.STANDARDINSURANCE.controls[indexCurrent].controls.STANDARDINSURANCEDETAIL, DataRowState.Removed);
        }
        this._calService.EnableInsuranceCalculateButton();
        //this.gdInsuranceMainDetail.ItemsSource = Controller.StandardInsuranceDetailEntityColl;
        this.updateTable();
      }
    });

    // ELEMENT_DATA.pop();
    //this.table1.renderRows();
  }

  //////Table child
  //@ViewChild('subTable') subTable !: MatTable<IStandardInsuranceEntity>;

  addAdditionalInsurance(index: number) {
    if (this._FormMode.FormMode != FormMode.VIEW) {
      let main: FormGroup<IStandardInsuranceEntity> = this._prplData.STANDARDINSURANCE.controls[index];
      let lengths = this._prplData.STANDARDINSURANCE.controls.filter(s => s.controls.PRPLSTNDINSR.value == main.controls.PRPLSTNDINSR.value)[0].controls.PRPLADDLINSR.controls.length;
      let tempFilterEntity = this._prplData.STANDARDINSURANCE.controls.filter(s => s.controls.PRPLSTNDINSR.value == main.controls.PRPLSTNDINSR.value)[0];
      var identifier = 0;
      if (main.controls != null) {
        if (tempFilterEntity != null
          && tempFilterEntity.controls.PRPLSTNDINSR.controls.COLLECTIONMETHODCDE.value != InsuranceCollectionTypes.LeaseClause) {
          if (this._prplData.STANDARDINSURANCE.controls.filter(s => s.controls.PRPLSTNDINSR.value == main.controls.PRPLSTNDINSR.value).length > 0
            && tempFilterEntity.controls.PRPLADDLINSR.controls.length > 0)
            //identifier = tempFilterEntity.controls.PRPLADDLINSR.controls[lengths - 1].controls.PRPLADDLINSRID.value + 1;
            identifier = tempFilterEntity.value.PRPLADDLINSR.reduce((op, item) => op = op > item.PRPLADDLINSRID ? op : item.PRPLADDLINSRID, 0);
          //else
          //this.identifier++;
          let addInsurance = this._formService.ProposalAdditionalInsuranceInfoForm() as FormGroup<IPRPL_ADDL_INSRInfo>;
          addInsurance.controls.PRPLADDLINSRID.setValue(identifier + 1);
          addInsurance.controls.PRPLSTNDINSRID.setValue(main.controls.PRPLSTNDINSR.controls.PRPLSTNDINSRID.value);
          addInsurance.controls.INSRTYPECDE.setValue(main.controls.PRPLSTNDINSR.controls.INSRTYPECDE.value);
          tempFilterEntity.controls.PRPLADDLINSR.push(addInsurance);
          //this._calService.EnableCalculateButton();
        }
        else if (tempFilterEntity != null
          && tempFilterEntity.controls.PRPLSTNDINSR.controls.COLLECTIONMETHODCDE.value == InsuranceCollectionTypes.LeaseClause) {
          this._messageService.showMesssage("CantAddLeaseClause", MessageType.Error);
        }
        this.updateTable();
        this.expandedElement = this._prplData.STANDARDINSURANCE.controls[index].value;
        this.InsurancePanelOpenState = true
      }
    }
    //let addInsurance: FormGroup<IPRPL_ADDL_INSRInfo> = this._formService.ProposalAdditionalInsuranceInfoForm();
    //this.STANDARDINSURANCE.controls[index].controls.PRPLADDLINSR.push(addInsurance);
    //this.expandedElement = this.STANDARDINSURANCE.controls[index].value;
    // ELEMENT_DATA3.push(
    //   {
    //     addRow2: '',
    //     position: 2,
    //     name: 'Hydrogen',
    //     weight: 1.0079,
    //     symbol: 'H',
    //     removeRow: ''
    //   }
    // );
    // this.subTable.renderRows();
    // this.table1.renderRows();
    //console.log(ELEMENT_DATA3, this.subTable);
  }

  removeAdditionalRow(STNDIndex: number, object: any, childIndex: number) {
    let index = this._prplData.STANDARDINSURANCE.controls[STNDIndex].controls.PRPLADDLINSR.controls.findIndex(x => x.value === object);
    let additionalInsurance = this._prplData.STANDARDINSURANCE.controls[STNDIndex].controls.PRPLADDLINSR;
    var dialog = this._dialog.openDialog("Confirmation", "Are you want to remove additonal insurance?", false, "Yes", "No");
    dialog.afterClosed().subscribe((result: any) => {
      if (result === "ok") {
        if (additionalInsurance.controls[index].controls.RowState.value == DataRowState.Added) {
          additionalInsurance.removeAt(index);
        }
        else {
          this._FormState.ResetFormState(additionalInsurance.controls[index], DataRowState.Removed);
        }
        this._calService.EnableInsuranceCalculateButton();
        this.updateTable();
      }
    });

    //ELEMENT_DATA3.pop();
    // this.table1.renderRows();
    //this.subTable.renderRows();
  }

  InsrCompanyChange(event: any) {
    if (event != undefined) {
      if (this._FormMode.FormMode != FormMode.VIEW) {
        if (this._prplData.PRPLINSR.controls.INSURER.value != null) {
          this._prplData.PRPLINSR.controls.CERTIFICATENBR.setValue('');
          this._assetMasterData.DepreciationPolicy = [];
          this._prplData.PRPLINSR.controls.DEPRECIATIONPOLICYCDE.setValue('');
          this._calService.ApplyInsuranceChart(true);
          if (this._prplData.PROPOSALFINANCIALAGREEMENT.value != null) {
            this._prplData.PROPOSALFINANCIALAGREEMENT.controls.INSURANCEPREMIUM.setValue(this._proposalManager.TotalPremiumAmount);
          }
          this._calService.ReadBPInsuranceDetailInsurance(false);
          if (this._prplData.PRPLINSR.controls.INSURANCEB2BIND.value == true) {
            this.isCertificateNumberEnabled = false;
          } else {
            this.isCertificateNumberEnabled = true;
          }
        }
      }
      this._calService.EnableInsuranceCalculateButton();
      this._calService.ResetAllAmounts();
      this.updateTable();
    }
    // if (this._FormMode.FormMode != FormMode.VIEW) {
    //   if (this.PRPLINSR.controls.INSURER.value != null) {
    //     this._calService.ApplyInsuranceChart(true);
    //     if (this._prplData.PROPOSALFINANCIALAGREEMENT.value != null) {
    //       this._prplData.PROPOSALFINANCIALAGREEMENT.controls.INSURANCEPREMIUM.setValue(this._proposalManager.TotalPremiumAmount);
    //     }
    //     this._calService.ReadBPInsuranceDetailInsurance(false);
    //   }
    // }
    else if (this._FormMode.FormMode == FormMode.VIEW) {
      this._calService.BindDepreciationCharts();
    }
    this.BindInsuranceCompanyBranch();
    //this.loadData();
  }

  public isInsuranceTermsValidate(): boolean {
    let tempStndArray = this._prplData.STANDARDINSURANCE.value.filter(x => x.RowState != DataRowState.Removed);

    if (this.isInsuranceDataValid() && tempStndArray.length > 0) {
      //if (this._prplData.STANDARDINSURANCE.controls.length > 0) {
      this.msg = [];
      let entityLCCollection = tempStndArray.filter(s => s.PRPLSTNDINSR.COLLECTIONMETHODCDE == InsuranceCollectionTypes.LeaseClause);
      let entityAROCollection = tempStndArray.filter(s => s.PRPLSTNDINSR.COLLECTIONMETHODCDE == InsuranceCollectionTypes.ARO);
      //StandardInsuranceEntity entityLC = this._prplData.STANDARDINSURANCE.Where(s=>s.PRPLSTNDINSR.COLLECTIONMETHODCDE == InsuranceCollectionTypes.LeaseClause.GetStringValue()).FirstOrDefault();
      if (entityLCCollection != null && entityLCCollection.length > 0
        && entityLCCollection[0] != tempStndArray[0]) {
        if (entityLCCollection.length > 1) {
          this.msg.push("TermLeaseClauseMultipleInsrs", MessageType.Info);
          //return false;
        }
        else {
          this.msg.push("TermLeaseClause", MessageType.Info);
          //return false;
        }
      }
      else if (entityLCCollection != null && entityLCCollection.length > 1) {
        this.msg.push("TermLeaseClauseMultipleInsrs", MessageType.Info);
        //return false;
      }
      else if (entityLCCollection.some(p => p.PRPLSTNDINSR.INSURANCECOMPANYID == 0)) {
        this.msg.push("msgSelectInsrCompLC", MessageType.Info);
        //return false;
      }

      if (entityAROCollection != null && entityAROCollection.length > 0 && entityAROCollection.length > 1) {
        let AROTerms = entityAROCollection.length;
        let LastIndex = tempStndArray.length - 1;
        for (let i = AROTerms; i >= 1; i--, LastIndex--) {
          if (tempStndArray[LastIndex].PRPLSTNDINSR.COLLECTIONMETHODCDE != InsuranceCollectionTypes.ARO) {
            this.msg.push("AROTypeAdded", MessageType.Info);
            break;
          }

        }
        //return false;
      }

      let entityARO = tempStndArray.filter(s => s.PRPLSTNDINSR.COLLECTIONMETHODCDE == InsuranceCollectionTypes.ARO)[0]/*[tempStndArray.length - 1]*/;
      if (entityARO != null && entityARO != tempStndArray[tempStndArray.length - 1]) {
        this.msg.push("TermARO", MessageType.Info);
        //return false;
      }
      //}
      if (tempStndArray[tempStndArray.length - 1].PRPLSTNDINSR.TERMTO != Number(this._prplData.PROPOSALFINANCIALAGREEMENT.controls.CONTRACTTRM.value) + this._prplData.PROPOSALFINANCIALAGREEMENT.controls.GPTERMS.value) {
        this.msg.push("TermsNtCorctInsr", MessageType.Info);
        //return false;
      }

      if (this._prplData.PRPLINSR.controls.DEPRECIATIONPOLICYCDE.value == '') {
        this.msg.push("msgmissingdepriciation", MessageType.Info);
        //return false;
      }
      /* msg1 = ValidateMultipleTermsforRF();
       if (msg.Length > 1) {
         this._messageService.showMesssage("msgMultipleStandardInsurance");
         return false;
       }*/
      //if (msg.Length > 0)
      //{
      //    return msg.Length > 1 ? false : true;
      //}

      let msgs: Array<string> = this.msg;
      if (msgs.length > 0) {
        let lstStr = msgs

        for (let i = 0; i < lstStr.length; i++) {
          this._messageService.showMesssage(lstStr[i], MessageType.Info);
          return false;
        }
      }
      else {
        return true;
      }

    }
    return false;

    // let msgs: Array<string> = this.msg;
    // if (msgs.length > 0) {
    //   let lstStr = msgs

    //   for (let i = 0; i < lstStr.length; i++) {
    //     this._messageService.showMesssage(lstStr[i], MessageType.Info);
    //     return false;
    //   }
    // }
    // return true;
  }

  public isInsuranceDataValid(): boolean {
    this.msg = [];
    let msgs: Array<string> = this.msg;

    this.ValidateAssetCost();
    this.ValidateInsuranceCompany();
    this.ValidateAssetTerms();
    this.ValidateCollectionType();
    this.ValidateExtentionType();
    this.ValidateStndInsuranceType();
    this.ValidateAddlInsuranceType();
    this.ValidateInsurancePremiumType();
    this.ValidateMultipleTermsforRF();
    this.ValidateAdditionalCoverageType();
    if (msgs.length > 0) {
      let lstStr = msgs

      for (let i = 0; i < lstStr.length; i++) {
        this._messageService.showMesssage(lstStr[i], MessageType.Info);
        return false;
      }
    }
    return true;
  }

  //region validationmsg
  private ValidateAssetCost() {
    if (this._prplData.PRPLINSR.controls.ASSETCOST.value <= 0) {
      this.msg.push("PlzSelectAsetCost");
    }
  }

  private ValidateMultipleTermsforRF() {
    if (this._prplData.PROPOSAL.controls.FINANCETYP.value == FinanceType.Refinance && this._prplData.STANDARDINSURANCE.controls.filter(x => x.value.RowState != DataRowState.Removed).length > 1) {
      this.msg.push("msgMultipleStandardInsurance");
    }
  }

  private ValidateAssetTerms() {
    if (this._calService.contractTerms <= 0) { //this._prplData.PROPOSALFINANCIALAGREEMENT.controls.CONTRACTTRM.value + this._prplData.PROPOSALFINANCIALAGREEMENT.controls.GPTERMS.value
      this.msg.push("PlzSelectAsetTerms");
    }
  }

  private ValidateCollectionType() {
    if (this._prplData.STANDARDINSURANCE.controls.filter(x => x.value.RowState != DataRowState.Removed).length > 0) {
      let coll = this._prplData.STANDARDINSURANCE.controls.filter(s => s.value.PRPLSTNDINSR.COLLECTIONMETHODCDE == '' && s.value.RowState != DataRowState.Removed);
      if (coll.length > 0) {
        this.msg.push("CollMetdReqStnd");
      }
    }
  }

  private ValidateExtentionType() {
    if (this._prplData.STANDARDINSURANCE.controls.filter(x => x.value.RowState != DataRowState.Removed).length > 0) {
      this._prplData.STANDARDINSURANCE.controls.forEach(item => {
        if (item.value.RowState != DataRowState.Removed) {
          let coll = item.controls.PRPLADDLINSR.controls.filter(n => n.controls.EXTENTIONTYPECDE.value == '');
          if (coll.length > 0) {
            this.msg.push("ExtMetdReqAddl");
            return;
          }
        }
      })
    }

  }

  private ValidateStndInsuranceType() {

    if (this._prplData.STANDARDINSURANCE.controls.filter(x => x.value.RowState != DataRowState.Removed).length > 0) {
      let coll = this._prplData.STANDARDINSURANCE.controls.filter(s => s.controls.PRPLSTNDINSR.controls.INSRTYPECDE.value == '' && s.value.RowState != DataRowState.Removed);
      if (coll.length > 0) {
        this.msg.push("InsrTypeStndReq");
      }
    }

  }

  private ValidateAddlInsuranceType() {

    if (this._prplData.STANDARDINSURANCE.controls.filter(x => x.value.RowState != DataRowState.Removed).length > 0) {
      this._prplData.STANDARDINSURANCE.controls.forEach(item => {
        if (item.value.RowState != DataRowState.Removed) {
          let coll = item.controls.PRPLADDLINSR.controls.filter(n => n.controls.INSRTYPECDE.value == '');
          if (coll.length > 0) {
            this.msg.push("InsrTypeAddlReq");
            return;
          }
        }
      })
    }

  }

  private ValidateInsuranceCompany() {

    if (!(this._prplData.PRPLINSR.controls.INSURER.value > 0)) {
      this.msg.push("InsrCompSelect");
    }

  }

  private ValidateInsurancePremiumType() {

    if (this._prplData.STANDARDINSURANCE.controls.filter(x => x.value.RowState != DataRowState.Removed).length > 0) {
      let coll = this._prplData.STANDARDINSURANCE.controls.filter(s => (s.controls.PRPLSTNDINSR.controls.INSURANCEPREMIUMTYPECDE.value == '' || s.controls.PRPLSTNDINSR.controls.INSURANCEPREMIUMTYPECDE.value == null) && s.controls.PRPLSTNDINSR.controls.COLLECTIONMETHODCDE.value != InsuranceCollectionTypes.LeaseClause);
      if (coll.length > 0) {
        this.msg.push("InsrPremTypeReqStnd");
      }
    }

  }

  private ValidateAdditionalCoverageType() {
    if (this._prplData.STANDARDINSURANCE.controls.filter(x => x.value.RowState != DataRowState.Removed).length > 0) {
      this._prplData.STANDARDINSURANCE.controls.forEach(item => {
        if (item.value.RowState != DataRowState.Removed) {
          let coll = item.controls.PRPLADDLINSR.controls.filter(n => n.value.RowState != DataRowState.Removed && (n.controls.ADDITIONALCOVERAGECDE.value == '' || n.controls.ADDITIONALCOVERAGECDE.value == null));
          if (coll.length > 0) {
            this.msg.push("AdditionalCoverage");
            return;
          }
        }
      })
    }

  }
  //endregion
  public insuranceCalculateClicked() {
    if (this.isInsuranceTermsValidate()) {
      this._calService.btnInsCalculateIsEnabled = false;
      //Controller.StandardInsuranceDetailEntityColl.RemoveAll();
      this._calService.ResetAllAmounts();
      let prplEntity = this._prplData.ProposalEntity.value;
      let removeIndex = this._prplData.PROPOSALINSURANCEMAIN.controls.length - 1;
      this._proposalService.PopulateCalculatedData(prplEntity).subscribe(res => {
        this._prplData.STANDARDINSURANCE.controls.forEach(stDetail => {
          this._FormState.ResetFormArrayState(stDetail.controls.STANDARDINSURANCEDETAIL, DataRowState.Removed)
        });

        res.ResultSet.STANDARDINSURANCE.forEach((item: any, index: any) => {
          if (item.RowState != DataRowState.Removed) {
            let actulaIndex = 0;
            actulaIndex = this._prplData.STANDARDINSURANCE.value.indexOf(this._prplData.STANDARDINSURANCE.value.filter(x => x.RowState != DataRowState.Removed && x.PRPLSTNDINSR.TERMFROM == item.PRPLSTNDINSR.TERMFROM && Number(x.PRPLSTNDINSR.TERMTO) == item.PRPLSTNDINSR.TERMTO)[0]);
            if (item.PRPLSTNDINSR.INSURANCECOMPANYID > 0) {
              item.PRPLSTNDINSR.INSURANCECOMPANYID = String(item.PRPLSTNDINSR.INSURANCECOMPANYID);
            };
            this.colapseExpandable(index);
            this._prplData.STANDARDINSURANCE.controls[actulaIndex].controls.PRPLSTNDINSR.patchValue(item.PRPLSTNDINSR);
            if (item.PRPLSTNDINSR.RowState != DataRowState.Added && item.PRPLSTNDINSR.RowState != DataRowState.Removed) {
              this._FormState.ResetFormState(this._prplData.STANDARDINSURANCE.controls[actulaIndex].controls.PRPLSTNDINSR, DataRowState.Updated);
            }
            item.STANDARDINSURANCEDETAIL.forEach((element: any) => {
              if (this._prplData.STANDARDINSURANCE.value[actulaIndex].PRPLSTNDINSR.PRPLSTNDINSRID == element.PRPLSTNDINSRDETL.PRPLSTNDINSRID) {
                this._prplData.STANDARDINSURANCE.controls[actulaIndex].controls.STANDARDINSURANCEDETAIL.push(this._prplEntityMapper.STANDARDINSURANCEDETAILMapper(this._formService.StandardInsuranceDetailForm(), element))
              }
            });
            //Additional Insurance Mapping
            item.PRPLADDLINSR.forEach((element: any, index: number) => {
              if (this._prplData.STANDARDINSURANCE.value[actulaIndex].PRPLSTNDINSR.PRPLSTNDINSRID == element.PRPLSTNDINSRID) {
                let addInsrIndex = this._prplData.STANDARDINSURANCE.value[actulaIndex].PRPLADDLINSR.findIndex(ins => ins.PRPLADDLINSRID === element.PRPLADDLINSRID);
                this._prplData.STANDARDINSURANCE.controls[actulaIndex].controls.PRPLADDLINSR.controls[addInsrIndex].patchValue(element);
                if (element.RowState != DataRowState.Added && element.RowState != DataRowState.Removed) {
                  this._FormState.ResetFormState(this._prplData.STANDARDINSURANCE.controls[actulaIndex].controls.PRPLADDLINSR.controls[addInsrIndex], DataRowState.Updated);
                }
              }
            });
          }
          this.IsCalculationPerformed = true;
        });
        /*this._FormState.ResetFormArrayState(this._prplData.INSRDPRNPLCY, DataRowState.Removed);
        this._FormState.ResetFormArrayState(this._prplData.STANDARDINSURANCE, DataRowState.Removed);
        this._FormState.ResetFormArrayState(this._prplData.PROPOSALINSURANCEMAIN, DataRowState.Removed);*/
        //this._prplData.PROPOSALINSURANCEMAIN.removeAt(removeIndex);
        //let prplInsuranceMain = this._formService.StandardInsuranceDetailForm();
        //res.ResultSet.STANDARDINSURANCE = res.ResultSet.STANDARDINSURANCE.filter((x:any) => x.RowState != DataRowState.Removed)
        //this._prplEntityMapper.STANDARDINSURANCEDETAILMapper(prplInsuranceMain, res.ResultSet);

        //prplInsuranceMain.patchValue(res.ResultSet);
        //this._FormState.ResetFormState(prplInsuranceMain, DataRowState.Added);
        // this._prplData.PROPOSALINSURANCEMAIN.push(prplInsuranceMain);
        this.STANDARDINSURANCE = this._prplData.STANDARDINSURANCE;
        //this.PRPLINSR = this._prplData.PRPLINSR;
        this._proposalManager.CalculateAmounts();
        this._calService.btnInsCalculateIsEnabled = false;
        if (//--this._prplData.StandardInsuranceEntityColl != null &&
          !(this._prplData.STANDARDINSURANCE.controls.filter(s => s.controls.PRPLSTNDINSR.controls.COLLECTIONMETHODCDE.value != InsuranceCollectionTypes.LeaseClause).length > 0)) {
          this._prplData.PROPOSALFINANCIALAGREEMENT.controls.POLICYFEE.setValue(0);
        }
        else {
          this._prplData.PROPOSALFINANCIALAGREEMENT.controls.POLICYFEE.setValue(this._prplData.PRPLINSR.controls.POLICYFEE.value);
        }
        this.updateTable();
      });
      //--Controller.clearSIDetailEntity();

      // await viewModel.PopulateCalculatedData(m_ContractTerms);
      /* this._proposalManager.CalculateAmounts();
       //this.gdInsuranceMainDetail.ItemsSource = Controller.StandardInsuranceDetailEntityColl;
       this.btnCalculateIsEnabled = false;
       //--Controller.InsrCalIndicator = false;
       //--Controller.InsuranceCalculated = true;
       if (//--this._prplData.StandardInsuranceEntityColl != null &&
         !(this._prplData.STANDARDINSURANCE.controls.filter(s => s.controls.PRPLSTNDINSR.controls.COLLECTIONMETHODCDE.value != InsuranceCollectionTypes.LeaseClause).length > 0)) {
         this._prplData.PROPOSALFINANCIALAGREEMENT.controls.POLICYFEE.setValue(0);
       }
       else {
         this._prplData.PROPOSALFINANCIALAGREEMENT.controls.POLICYFEE.setValue(this._prplData.PRPLINSR.controls.POLICYFEE.value);
       }*/
      //-- PopulateData();
    }
    else {
      //this._messageService.showMesssage.(msg.ToString());
      this._calService.btnInsCalculateIsEnabled = true;
      this.IsCalculationPerformed = false;
    }
  }

  public AddRows(index: any = 0) {
    let ContractTerms = this._calService.contractTerms;//this._prplData.PROPOSALFINANCIALAGREEMENT.controls.CONTRACTTRM.value;
    let identifier = 0;
    //let length = this._prplData.STANDARDINSURANCE.controls.length;
    let tempStndArray = this._prplData.STANDARDINSURANCE.value.filter(x => x.RowState != DataRowState.Removed);
    let templength = tempStndArray.length;

    let lastEndDate = new Date();
    lastEndDate = this._prplData.PROPOSALFINANCIALAGREEMENT.controls.CONTRACTSTARTDTE.value;
    let addMonthsInStartDate = moment(lastEndDate).add(Number(ContractTerms), 'months').subtract(1, 'day');
    //let addMonthsInStartDate = new Date(new Date(lastEndDate).setMonth(new Date(lastEndDate).getMonth() + Number(ContractTerms)))

    if (tempStndArray.length > 0) {
      //... identifier = this._prplData.STANDARDINSURANCE.controls[length - 1].controls.PRPLSTNDINSR.controls.PRPLSTNDINSRID.value + 1;
      identifier = this._prplData.STANDARDINSURANCE.value.reduce((op, item) => op = op > item.PRPLSTNDINSR.PRPLSTNDINSRID ? op : item.PRPLSTNDINSR.PRPLSTNDINSRID, 0);
      lastEndDate = moment(tempStndArray[templength - 1].PRPLSTNDINSR.ENDDTE).add(1, 'day').toDate();
    }
    if (tempStndArray.length > 0) {
      let indexofLast = templength - 1;
      if (indexofLast > -1 && tempStndArray[templength - 1].PRPLSTNDINSR.TERMTO < ContractTerms) //&& TermStructures.Last().PRPLSTNDINSR.COLLECTIONMETHODCDE != InsuranceCollectionTypes.ARO.GetStringValue())
      {
        let termStandardEntity: FormGroup<IStandardInsuranceEntity> = this._formService.StandardInsuranceForm();
        termStandardEntity.controls.PRPLSTNDINSR.controls.TERMFROM.setValue(tempStndArray[templength - 1].PRPLSTNDINSR.TERMTO + 1);
        termStandardEntity.controls.PRPLSTNDINSR.controls.TERMTO.setValue(ContractTerms);
        termStandardEntity.controls.PRPLSTNDINSR.controls.STARTDTE.setValue(lastEndDate);
        termStandardEntity.controls.PRPLSTNDINSR.controls.ENDDTE.setValue((addMonthsInStartDate).toDate());
        termStandardEntity.controls.PRPLSTNDINSR.controls.PRPLSTNDINSRID.setValue(identifier + 1);
        this._prplData.STANDARDINSURANCE.push(termStandardEntity);

      }
      else {
        //if (TermStructures.Last().PRPLSTNDINSR.COLLECTIONMETHODCDE == InsuranceCollectionTypes.ARO.GetStringValue())
        //{
        //    Message.ErrorMessage("AROTypeAdded");
        //}
        //else
        //{
        this._messageService.showMesssage("InsuranceTerm", MessageType.Warning);
        //}
      }
      this.rowStateOnStandardInsuraceValueChange(index); // to mark row state updated at index
    }
    else {
      let termStandardEntity: FormGroup<IStandardInsuranceEntity> = this._formService.StandardInsuranceForm();
      termStandardEntity.controls.PRPLSTNDINSR.controls.TERMFROM.setValue(1);
      termStandardEntity.controls.PRPLSTNDINSR.controls.TERMTO.setValue(ContractTerms);
      termStandardEntity.controls.PRPLSTNDINSR.controls.STARTDTE.setValue(lastEndDate);
      termStandardEntity.controls.PRPLSTNDINSR.controls.ENDDTE.setValue(addMonthsInStartDate.toDate());
      this._prplData.STANDARDINSURANCE.push(termStandardEntity);
    }
    this.updateTable();
  }

  TermToValueChanged(object: any, value: string, index: number) {
    this._calService.EnableInsuranceCalculateButton();
    if ((value != '' /*&& rowClicked != null && rowClicked.Item.GetType() == typeof(StandardInsuranceEntity*/)) {
      let num = Number(value);
      let PreviousToTerm = Number(value);
      let filteredArray = this._prplData.STANDARDINSURANCE.controls.filter(x => x.value.RowState != DataRowState.Removed);
      let indexInActualArray = this._prplData.STANDARDINSURANCE.value.indexOf(object); // as index comes as parameter is index number of filter array
      let main: FormGroup<IStandardInsuranceEntity> = filteredArray[index];
      //main= object;
      let main2: FormGroup<IStandardInsuranceEntity> = filteredArray[index];
      //main2= object;
      if (main.controls != null) {
        if (!(num < main2.controls.PRPLSTNDINSR.controls.TERMFROM.value)) {
          main2.controls.PRPLSTNDINSR.controls.TERMTO.setValue(num);
          this.SetExpiryDate(main2.controls.PRPLSTNDINSR);
          this.ResetTerms(main2);
          this.AddRows(index);
          //this._calService.EnableCalculateButton();
        }
        else if (!(num < main.controls.PRPLSTNDINSR.controls.TERMFROM.value)) {
          main2.controls.PRPLSTNDINSR.controls.TERMTO.setValue(num);
          this.SetExpiryDate(main.controls.PRPLSTNDINSR);
          this.ResetTerms(main);
          this.AddRows(index);
          //this._calService.EnableCalculateButton();
        }

        else {
          this._messageService.showMesssage("msgIncorrectTerms", MessageType.Warning);
          this._prplData.STANDARDINSURANCE.controls[index].controls.PRPLSTNDINSR.controls.TERMTO.setValue(PreviousToTerm); //main.PRPLSTNDINSR.TERMTO;
        }
      }
    }
    /*  else if ((sender as BaseNumericBox).Value != null && rowClickedUp != null
       && rowClickedUp.Item.GetType() == typeof (StandardInsuranceEntity)) {
                     int num = Convert.ToInt32((sender as BaseNumericBox).Value);
                     StandardInsuranceEntity main = new StandardInsuranceEntity();
       main = (StandardInsuranceEntity)rowClickedUp.Item;
       if (main != null) {
         if (!(num < main.PRPLSTNDINSR.TERMFROM)) {
           main.PRPLSTNDINSR.TERMTO = num;
           SetExpiryDate(main.PRPLSTNDINSR);
           ResetTerms(main);
           viewModel.AddRows(Controller.MainInsuranceEntity.STANDARDINSURANCE, m_ContractTerms);
           EnableCalculateButton();
         }
         else {
           Message.ErrorMessage("msgIncorrectTerms");

           (sender as BaseNumericBox).Value = PreviousToTerm;
         }
       }
     }*/
  }

  private SetExpiryDate(info: FormGroup<IPRPL_STND_INSRInfo>) {

    let dt = new Date();
    let currentIndex = 0;
    let previousIndex = 0;
    let nextIndex = 0;
    if (this._prplData.STANDARDINSURANCE.controls.filter(s => s.controls.PRPLSTNDINSR == info)[0] != null) {
      currentIndex = this._prplData.STANDARDINSURANCE.controls.indexOf(this._prplData.STANDARDINSURANCE.controls.filter(s => s.controls.PRPLSTNDINSR == info)[0]);
      if (currentIndex != 0) {
        previousIndex = currentIndex - 1; //--currentIndex;
        nextIndex = currentIndex + 1; //++currentIndex;
        dt = moment(this._prplData.STANDARDINSURANCE.controls[previousIndex].controls.PRPLSTNDINSR.controls.ENDDTE.value).add(1, 'day').toDate();

      }
      else {
        dt = info.controls.STARTDTE.value;
      }
    }
    else {
      dt = info.controls.STARTDTE.value;
    }
    info.controls.STARTDTE.setValue(dt);
    let terms = info.controls.TERMTO.value;
    let months = terms - (info.controls.TERMFROM.value - 1);
    info.controls.ENDDTE.setValue(moment(info.controls.STARTDTE.value).add(Number(months), 'months').subtract(1, 'day').toDate());
  }

  private ResetTerms(main: FormGroup<IStandardInsuranceEntity>) {
    let tempStndArray = this._prplData.STANDARDINSURANCE.value.filter(x => x.RowState != DataRowState.Removed);
    //let currentIndex = this._prplData.STANDARDINSURANCE.controls.indexOf(main);
    let currentIndex = tempStndArray.indexOf(main.value);
    let templength = tempStndArray.length;
    // let currentIndex = this._prplData.STANDARDINSURANCE.value.indexOf(element);
    let nextIndex = currentIndex + 1;
    let prevIndex = currentIndex - 1;
    if (templength > nextIndex) {
      tempStndArray[nextIndex].PRPLSTNDINSR.TERMFROM = main.controls.PRPLSTNDINSR.controls.TERMTO.value + 1;
      let element = tempStndArray[nextIndex];
      let actualIndex = this._prplData.STANDARDINSURANCE.value.indexOf(element);
      this._prplData.STANDARDINSURANCE.controls[actualIndex].patchValue(element);

      if (tempStndArray[nextIndex].PRPLSTNDINSR.TERMFROM > tempStndArray[nextIndex].PRPLSTNDINSR.TERMTO) {
        tempStndArray[nextIndex].PRPLSTNDINSR.TERMTO = tempStndArray[nextIndex].PRPLSTNDINSR.TERMFROM + 1;
        this._prplData.STANDARDINSURANCE.controls[actualIndex].patchValue(element);

        this.SetExpiryDate(this._prplData.STANDARDINSURANCE.controls[actualIndex].controls.PRPLSTNDINSR);
        this.ResetTerms(this._prplData.STANDARDINSURANCE.controls[actualIndex]);
      }
      else {
        this.SetExpiryDate(this._prplData.STANDARDINSURANCE.controls[actualIndex].controls.PRPLSTNDINSR);
      }
    }
    //////////////////////////
    if (currentIndex > 0) {
      let element = tempStndArray[prevIndex];
      let actualIndex = this._prplData.STANDARDINSURANCE.value.indexOf(element);

      tempStndArray[prevIndex].PRPLSTNDINSR.TERMTO = main.controls.PRPLSTNDINSR.controls.TERMFROM.value - 1;
      this._prplData.STANDARDINSURANCE.controls[actualIndex].patchValue(element);
      if (tempStndArray[prevIndex].PRPLSTNDINSR.TERMTO < tempStndArray[prevIndex].PRPLSTNDINSR.TERMFROM) {
        if (prevIndex == 0)
          tempStndArray[prevIndex].PRPLSTNDINSR.TERMFROM = 1; //Controller.MainInsuranceEntity.STANDARDINSURANCE[prevIndex].PRPLSTNDINSR.TERMTO - 1;
        else
          tempStndArray[prevIndex].PRPLSTNDINSR.TERMFROM = tempStndArray[--prevIndex].PRPLSTNDINSR.TERMTO + 1;
        this._prplData.STANDARDINSURANCE.controls[actualIndex].patchValue(element);

        this.SetExpiryDate(this._prplData.STANDARDINSURANCE.controls[actualIndex].controls.PRPLSTNDINSR);
        this.ResetTerms(this._prplData.STANDARDINSURANCE.controls[actualIndex]);
      }
      else {
        this.SetExpiryDate(this._prplData.STANDARDINSURANCE.controls[actualIndex].controls.PRPLSTNDINSR);
      }
    }
  }

  isCFInd(a: any): boolean {
    if (a.PRPLSTNDINSR.COLLECTIONMETHODCDE === InsuranceCollectionTypes.LeaseClause) {
      return false;
    } else {
      return true;
    }
  }

  isPercentage(a: any): boolean {
    if (a.PRPLSTNDINSRDETL.INSURANCEPREMIUMTYPECDE === InsurancePremiumTypes.Percentage) {
      return true;
    }
    else {
      return false;
    }
  }

  isTPL(ele: any) {
    if (ele.INSURANCEPREMIUMTYPECDE == InsurancePremiumTypes.FixAmount && ele.INSRTYPECDE != InsuranceType.VoluntaryInsurance) {
      return this._insuranceMasterDataService.AddlInsurances.filter(obj => (obj.code === ele.ADDITIONALCOVERAGECDE)).map((a: any) => { return a.OptionalData.COVERAGEAMT })[0];
    }
    else {
      ele.FIXPREMIUMAMT = 0;
      return true;
    }
  }

  isTPLAddionalInsurance(val: any) {
    return this._insuranceMasterDataService.AddlInsurances.filter(obj => (obj.code === val)).map((a: any) => { return a.OptionalData.COVERAGEAMT })[0];
  }

  focusout_defaultPremium(ele: any) {
    console.log(ele.DEFAULTPREMIUMRTE);
    if (ele.DEFAULTPREMIUMRTE > ele.MAXINSRPREMIUMRTE || ele.DEFAULTPREMIUMRTE < ele.MININSRPREMIUMRTE) {
      ele.DEFAULTPREMIUMRTE = ele.MAXINSRPREMIUMRTE;
      if (ele.PRPLSTNDINSRDETL.INSURANCEPREMIUMTYPECDE === InsurancePremiumTypes.FixAmount) {
        this._messageService.showMesssage("MinMaxRateCheck", MessageType.Error);
      }
    }
  }
  updateStandardInsuranceControls(mode: any, object: any, index: number) {

    switch (mode) {
      case AssetInsuranceType.CollectionMethod:
      case AssetInsuranceType.InsurancePremiumType:
      case AssetInsuranceType.InsuranceType:
      case AssetInsuranceType.StandardPremiumAmount:
      case AssetInsuranceType.InsuranceCompanyName:
        index = object.PRPLSTNDINSRPARENTINDEX;
        this._prplData.STANDARDINSURANCE.controls[index].patchValue(object);

        //this._prplEntityMapper.STANDARDINSURANCEMapper(this._prplData.STANDARDINSURANCE.controls[index], object);
        // this._prplData.STANDARDINSURANCE.controls[index].controls.RowState.setValue(DataRowState.Updated);
        if (AssetInsuranceType.CollectionMethod == mode) {
          if (object.PRPLSTNDINSR.COLLECTIONMETHODCDE !== InsuranceCollectionTypes.LeaseClause) {
            this._prplData.STANDARDINSURANCE.controls[index].controls.PRPLSTNDINSR.controls.INSURANCECERTIFICATENUMBER.setValue('');
            this._prplData.STANDARDINSURANCE.controls[index].controls.PRPLSTNDINSR.controls.INSURANCECOMPANYID.setValue(0);
            this._prplData.STANDARDINSURANCE.controls[index].controls.PRPLSTNDINSR.controls.TOTALPREMIUMAMNT.setValue(0);
            //this._prplData.STANDARDINSURANCE.controls[index].controls.PRPLSTNDINSR.controls.ENABLESTANDARDINSURANCEPREMIUMTYPE.setValue(true);
          }
          else if (object.PRPLSTNDINSR.COLLECTIONMETHODCDE == InsuranceCollectionTypes.LeaseClause) {
            this._prplData.STANDARDINSURANCE.controls[index].controls.PRPLSTNDINSR.controls.INSURANCECERTIFICATENUMBER.setValue('');
            this._prplData.STANDARDINSURANCE.controls[index].controls.PRPLSTNDINSR.controls.INSURANCEPREMIUMTYPECDE.setValue('');
            this._prplData.STANDARDINSURANCE.controls[index].controls.PRPLSTNDINSR.controls.TOTALPREMIUMAMNT.setValue(0);
            //this._prplData.STANDARDINSURANCE.controls[index].controls.PRPLSTNDINSR.controls.ENABLESTANDARDINSURANCEPREMIUMTYPE.setValue(false);


            if (this._prplData.STANDARDINSURANCE.controls[index].controls.RowState.value == DataRowState.Added) {
              this._prplData.STANDARDINSURANCE.controls[index].controls.PRPLADDLINSR.clear();
            }
            else {
              this._FormState.ResetFormArrayState(this._prplData.STANDARDINSURANCE.controls[index].controls.PRPLADDLINSR, DataRowState.Removed);
            }
          }
        }
        this._calService.EnableInsuranceCalculateButton();
        this.updateTable();
        this.rowStateOnStandardInsuraceValueChange(index); // to mark row state updated in standard insurance at index
        break;
      case AssetInsuranceType.AdditionalCoverageType:
      case AssetInsuranceType.InsuranceExtMethod:
      case AssetInsuranceType.ADDITIONALCOVERAGEAMOUNT:
        // this._prplData.STANDARDINSURANCE.controls[index].patchValue(object);
        if (object.PRPLADDLINSR[index].RowState !== DataRowState.Added) {
          object.PRPLADDLINSR[index].RowState = DataRowState.Updated;
        }
        this._prplEntityMapper.PRPLADDLINSRMapper(this._prplData.STANDARDINSURANCE.controls[object.PRPLSTNDINSRPARENTINDEX].controls.PRPLADDLINSR.controls.filter(s => s.value.RowState != DataRowState.Removed)[index], object.PRPLADDLINSR[index]);
        if (mode == AssetInsuranceType.AdditionalCoverageType) {
          this.isCOVERAGEAMT = this._insuranceMasterDataService.AddlInsurances.filter(obj => (obj.code === object.ADDITIONALCOVERAGECDE)).map((a: any) => { return a.OptionalData.COVERAGEAMT })[0];
          console.log(this.isCOVERAGEAMT);
          if (!this.isCOVERAGEAMT) {
            this._prplData.STANDARDINSURANCE.controls[object.PRPLSTNDINSRPARENTINDEX].controls.PRPLADDLINSR.controls[index].controls.TPLCOVERAGEAMNT.setValue(0);
          }
          if (this._prplData.STANDARDINSURANCE.value.filter(s => s.RowState != DataRowState.Removed).length > 0) {
            let AddlInsrDup = object.PRPLADDLINSR[index];
            this._prplData.STANDARDINSURANCE.value.forEach(item => {
              if (item.RowState != DataRowState.Removed) {
                let coll = item.PRPLADDLINSR.filter(s => s.RowState != DataRowState.Removed);
                if (coll.filter(s => s.ADDITIONALCOVERAGECDE == AddlInsrDup.ADDITIONALCOVERAGECDE && s.ADDITIONALCOVERAGECDE != null
                  && s.EXTENTIONTYPECDE == AddlInsrDup.EXTENTIONTYPECDE && s.EXTENTIONTYPECDE != null
                  && s.PRPLSTNDINSRID == AddlInsrDup.PRPLSTNDINSRID).length > 1) {
                  this._messageService.showMesssage("msgDuplicateAdditionalInsr", MessageType.Error);
                  this._prplData.STANDARDINSURANCE.controls[object.PRPLSTNDINSRPARENTINDEX].controls.PRPLADDLINSR.controls.filter(s => s.value.RowState != DataRowState.Removed)[index].controls.ADDITIONALCOVERAGECDE.setValue('');
                  this._prplData.STANDARDINSURANCE.controls[object.PRPLSTNDINSRPARENTINDEX].controls.PRPLADDLINSR.controls.filter(s => s.value.RowState != DataRowState.Removed)[index].controls.EXTENTIONTYPECDE.setValue('');
                }
              }
            })

          }
        }
        else if (mode == AssetInsuranceType.InsuranceExtMethod) { //cmbInsuranceExtMethod_SelectionChanged in old cap
          if (this._prplData.STANDARDINSURANCE.value.filter(s => s.RowState != DataRowState.Removed).length > 0) {
            let AddlInsrDup = object.PRPLADDLINSR[index];
            this._prplData.STANDARDINSURANCE.value.forEach(item => {
              if (item.RowState != DataRowState.Removed) {
                let coll = item.PRPLADDLINSR.filter(s => s.RowState != DataRowState.Removed);
                if (coll.filter(s => s.ADDITIONALCOVERAGECDE == object.PRPLADDLINSR[index].ADDITIONALCOVERAGECDE && s.ADDITIONALCOVERAGECDE != ''
                  && s.EXTENTIONTYPECDE == object.PRPLADDLINSR[index].EXTENTIONTYPECDE && s.EXTENTIONTYPECDE != ''
                  && s.PRPLSTNDINSRID == object.PRPLADDLINSR[index].PRPLSTNDINSRID).length > 1) {
                  this._messageService.showMesssage("msgDuplicateAdditionalInsr", MessageType.Error);
                  this._prplData.STANDARDINSURANCE.controls[object.PRPLSTNDINSRPARENTINDEX].controls.PRPLADDLINSR.controls.filter(s => s.value.RowState != DataRowState.Removed)[index].controls.ADDITIONALCOVERAGECDE.setValue('');
                  this._prplData.STANDARDINSURANCE.controls[object.PRPLSTNDINSRPARENTINDEX].controls.PRPLADDLINSR.controls.filter(s => s.value.RowState != DataRowState.Removed)[index].controls.EXTENTIONTYPECDE.setValue('');
                }
              }
            })

          }
        }
        // this.expandedElement = this._prplData.STANDARDINSURANCE.controls[object.PRPLSTNDINSRPARENTINDEX].value;
        this._calService.EnableInsuranceCalculateButton();
        this.updateTable();
        break;
    }
    //this.expandedElement = this._prplData.STANDARDINSURANCE.controls[object.PRPLSTNDINSRPARENTINDEX].value;
    // this._prplData.STANDARDINSURANCE.controls[index].patchValue(object);
    // this.updateTable();

    //this.expandedElement = this.STANDARDINSURANCE.controls[index].value;
    // this._calService.EnableInsuranceCalculateButton();
  };

  updateTable() {
    this.standardInsuranceDataSource = new MatTableDataSource<IStandardInsuranceEntity>();
    this._prplData.STANDARDINSURANCE.controls.forEach((item, index) => {
      if (item.value.RowState != DataRowState.Removed) {
        item.controls.PRPLSTNDINSRPARENTINDEX.setValue(index);
      }
    })
    this._prplData.STANDARDINSURANCE.value.filter(x => x.RowState != DataRowState.Removed).map((c: any, index) => {
      this.standardInsuranceDataSource.data.push({ ...c });
      this.standardInsuranceDataSource.data[index].PRPLADDLINSR = this.standardInsuranceDataSource.data[index].PRPLADDLINSR.filter(x => x.RowState != DataRowState.Removed);
    });

    //this.STANDARDINSURANCEDetail = this._formBuilder.array<IStandardInsuranceDetailEntity>([]);
    if (this._prplData.STANDARDINSURANCE.value.filter(x => x.RowState != DataRowState.Removed).length > 0) {
      this.standardInsuranceDetailDataSource = new MatTableDataSource<IStandardInsuranceDetailEntity>();
      this._prplData.STANDARDINSURANCE.value.forEach((Stnd, index) => {
        Stnd.STANDARDINSURANCEDETAIL.forEach((StndDetail, detailIndex) => {
          StndDetail.PARENTINDEX = index;
          if (StndDetail.RowState != DataRowState.Removed) {
            this.standardInsuranceDetailDataSource.data.push(StndDetail as IStandardInsuranceDetailEntity);
            StndDetail.INDEX = detailIndex;
          }
        });
      });
    }
  }

  depreciationPolicySelectionChanged(event: Event) {
    if (event != undefined) {
      let filteredArray = this._prplData.STANDARDINSURANCE.value.filter(x => x.RowState != DataRowState.Removed);

      if (this._proposalManager.TotalPremiumAmount > 0 && (filteredArray.length > 0
        && filteredArray.filter(p => p.PRPLSTNDINSR.COLLECTIONMETHODCDE != InsuranceCollectionTypes.LeaseClause).length > 0)) {
        var dialog = this._dialog.openDialog("Confirmation", "Standard Insurance Premium amount will be reset. ?", false, "Yes", "No");
        dialog.afterClosed().subscribe((result: any) => {
          if (result === "ok") {
            this._calService.EnableInsuranceCalculateButton();
            if (this._prplData.PRPLINSR.controls.DEPRECIATIONPOLICYCDE.value != '') {
              this._calService.PopulateDepreciationPolicy();
              this.policyCodePreviousValue = this._prplData.PRPLINSR.controls.DEPRECIATIONPOLICYCDE.value;
            }
            /* if (this._prplData.PRPLINSR.controls.DEPRECIATIONPOLICYCDE.value == '') {
               if (Controller.MainInsuranceEntity != null) {
                 Controller.MainInsuranceEntity.INSRDPRNPLCY.RemoveAll();
                 Controller.MainInsuranceEntity.PRPLINSR.DEPRECIATIONPOLICYCDE = null;
               }
             }*/
          }
          else {
            this._prplData.PRPLINSR.controls.DEPRECIATIONPOLICYCDE.setValue(this.policyCodePreviousValue);
          }
        })
      }
      else {
        this._calService.PopulateDepreciationPolicy();
      }
      if (this.policyCodePreviousValue == '') {
        this.policyCodePreviousValue = this._prplData.PRPLINSR.controls.DEPRECIATIONPOLICYCDE.value;
      }
    }
  }

  btnCancel() {

    var dialog = this._dialog.openDialog("Confirmation", "Do you want to remove all insurances?", false, "Yes", "No");
    dialog.afterClosed().subscribe((result: any) => {
      if (result === "ok") {
        this._calService.ResetAllAmounts();
        this._prplData.PROPOSALFINANCIALAGREEMENT.controls.POLICYFEE.setValue(0);
        this._calService.btnInsCalculateIsEnabled = true;
        this._prplData.PROPOSALINSURANCEMAIN.controls.forEach((item, index) => {
          if (this._prplData.PROPOSALINSURANCEMAIN.value[index].RowState == DataRowState.Added) {
            this._prplEntityMapper.PropsalMainInsuranceMapper(this._prplData.PROPOSALINSURANCEMAIN.controls[index], this._formService.PropsalMainInsuranceForm().value as IMainInsuranceEntity);
          }
          else {
            if (this._prplData.PROPOSALINSURANCEMAIN.value[index].RowState != DataRowState.Removed) {
              this._FormState.ResetFormState(this._prplData.PROPOSALINSURANCEMAIN.controls[index], DataRowState.Removed);
              this._prplData.PROPOSALINSURANCEMAIN.push(this._formService.PropsalMainInsuranceForm());
            }
          }
        })
        this._dialog.dialog.closeAll();
      }
      // else {
      //   this._dialog.dialog.closeAll();
      // }
    })


  }

  btnOk() {
    if (this._calService.btnInsCalculateIsEnabled) {
      this._messageService.showMesssage("CalInsr", MessageType.Warning);
      return;
    }
    if (this._prplData.PROPOSALFINANCIALAGREEMENT.value.INSURANCEPREMIUM != this.AmntTotal
      || this.OldReceiveByDealer != this._prplData.ASSETENTITY.value.PROPOSALINSURANCEMAIN.find(x => x.RowState != DataRowState.Removed)?.PRPLINSR.RECEIVEBYDEALERIND
      || this.IsCalculationPerformed) {

      //let newInsuredPremium = this._prplData.PROPOSALFINANCIALAGREEMENT.value.INSURANCEPREMIUM;
      let newInsuredPremium = this._proposalManager.TotalPremiumAmount;
      if (this._prplData.PROPOSALFINANCIALAGREEMENT.value.INSURANCEPREMIUM != null && (this.AmntTotal != newInsuredPremium)) {
        this._calService.btnInsCalculateIsEnabled = true;
        this._calService.ResetRentalDetail();
      }
      this._calService.RemoveArticleComponent(AmountComponent.InsuranceCommission);
      this._prplData.PROPOSALFINANCIALAGREEMENT.controls.INSURANCEPREMIUM.setValue(0);

      //Controller.PROPOSAL_FINANCIAL_AGRM.INSURANCEPREMIUM = result.PostData != null ? Convert.ToDecimal(result.PostData) : 0;
      this._prplData.PROPOSALFINANCIALAGREEMENT.controls.INSURANCEPREMIUM.setValue(newInsuredPremium != null ? Math.round((newInsuredPremium + Number.EPSILON) * 100) / 100 : 0);


      //let InsurenceAmount = this._prplData.ASSETENTITY.value.PROPOSALASSETINSURANCE.Sum(x => x.INSUREDAMT);
      let InsurenceAmount = this._prplData.ASSETENTITY.value.PROPOSALASSETINSURANCE?.filter((x) => x.INSUREDAMT).reduce(function (tot, record) {
        return tot + record.INSUREDAMT;
      }, 0);

      this._prplData.PROPOSALFINANCIALAGREEMENT.controls.INSURANCEAMT.setValue(0);
      //Controller.DataContext.PROPOSALARTICLE[Controller.Helper.AssetIndex].ASSETENTITY.PRPLARTICLECOMPONENTENTITYCOL.FindAll(p => (p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.TLO.GetStringValue() || p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.Comprehensive.GetStringValue() || p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.AdditionalCoverage.GetStringValue())).ForEach(x => Controller.DataContext.PROPOSALARTICLE[Controller.Helper.AssetIndex].ASSETENTITY.PRPLARTICLECOMPONENTENTITYCOL.Remove(x));

      this._prplData.ASSETENTITY.controls.PRPLARTICLECOMPONENTENTITYCOL.controls.forEach((col, index) => {
        if (col.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.TLO) || col.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.Comprehensive) || col.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AdditionalCoverage)) {
          if (col.value.RowState != DataRowState.Added)
            col.controls.RowState.setValue(DataRowState.Removed);
          else
            this._prplData.ASSETENTITY.controls.PRPLARTICLECOMPONENTENTITYCOL.removeAt(index)
        }
      })

      let insurer = this._prplData.ASSETENTITY.value.PROPOSALASSETINSURANCE[0]?.INSURER;
      this._calService.RemoveArticleComponent(AmountComponent.FinancedInsurancePremium);
      this._calService.RemoveArticleComponent(AmountComponent.AROInsurancePremium);
      this._calService.RemoveArticleComponent(AmountComponent.InsuranceSubsidy);
      this._calService.RemoveArticleComponent(AmountComponent.UpfrontInsurancePremium);
      this._calService.RemoveArticleComponent(AmountComponent.B2BFee);
      this._calService.RemoveArticleComponent(AmountComponent.InsurancePremium);
      this._calService.RemoveArticleComponent(AmountComponent.DealerInsuranceCommission);

      this._prplData.PROPOSALFINANCIALAGREEMENT.controls.INSURANCECOMMISSIONAMOUNT.setValue(0);
      //this.txtInsrComm.Value = 0;
      this._calService.SetDownpayment();
      this._calService.CreateFinlAgreementDetails();

      //MAXIMUM DEALER INSURANCE COMMISION
      //this._calService.CalculateInsuranceCommissionToPIC();     //Not required for current OTO Business

      //INSURANCE COMMISSION FOR OTO
      this._prplData.PROPOSALFINANCIALAGREEMENT.controls.INSRCOMMAMTOTO.setValue(0);
      if (this._prplData.PROPOSALFINANCIALAGREEMENT.value.INSRCOMMPCTOTO > 0) {
        let amt = (this._prplData.PROPOSALFINANCIALAGREEMENT.value.INSURANCEPREMIUM * this._prplData.PROPOSALFINANCIALAGREEMENT.value.INSRCOMMPCTOTO) / 100
        this._prplData.PROPOSALFINANCIALAGREEMENT.controls.INSRCOMMAMTOTO.setValue(+amt.toFixed(2));
        this._calService.UpdateFinancialAgreementDetail(this._prplData.PROPOSALFINANCIALAGREEMENT.value.INSRCOMMAMTOTO, AmountComponent.InsuranceCommission, '00001', null, this._prplData.ASSETENTITY.value.PROPOSALINSURANCEMAIN[0].PRPLINSR.INSURER, 1, AmountClassification.Payable);
        if (this._prplData.PROPOSALFINANCIALAGREEMENT.controls.INSRCOMMAMTOTO.value > 0) {

          this._calService.CalculateTaxByComponent(AmountComponent.GetStringValue(AmountComponent.InsuranceCommission), CommissionType.GetStringValue(CommissionType.InsuranceCommission))
        }
        this._calService.ReCalculateOJKCommission(AmountComponent.InsuranceCommission, CommissionType.InsuranceCommission);
      }
      //Controller.InsrCalIndicator = false;
      //Controller.InsuranceCalculated = false;
      this._calService.btnInsCalculateIsEnabled = false;

      //if (Controller.TotalInsuranceSubsidy > 0)
      //    UpdateInsuranceSubsidyInArteTrans();

      //txtDealerPOAmount.Value = Controller.DealerPOAmount;
      let articleEntity = this._prplData.PROPOSALARTICLE.value.find(x => x.RowState != DataRowState.Removed) as IProposalArticleEntity;
      if (articleEntity.ASSETENTITY.PROPOSALFINANCIALAGREEMENT != null)
        this._prplData.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.DEALERPOAMOUNT.setValue(this._proposalManager.DealerPOAmount())

      if (this._prplData.ASSETENTITY.value.PROPOSALINSURANCEMAIN[0].PRPLINSR.INSURER != null) {
        //this._calService.DoubleCheckInsuranceforPACMAS();      // Not required for current OTO Business
      }

    }
    else {
      let TotalInsuranceAROAmnt = this._prplData.ASSETENTITY.value.PROPOSALINSURANCEMAIN[0].PRPLINSR.TOTALAROAMNT
      if (TotalInsuranceAROAmnt > 0) {
        this._calService.UpdateFinancialAgreementDetail(TotalInsuranceAROAmnt, AmountComponent.AROInsurancePremium, '00001', AssetComponentsFinancialConfiguration.None, (this._prplData.ASSETENTITY.value.PROPOSALINSURANCEMAIN.find(x => x.RowState != DataRowState.Removed) as IMainInsuranceEntity).PRPLINSR.INSURER, 1, AmountClassification.Payable);
        this._calService.UpdateFinancialAgreementDetail(TotalInsuranceAROAmnt, AmountComponent.AROInsurancePremium, '00001', AssetComponentsFinancialConfiguration.None, null, 1, AmountClassification.Receivable);
      }
    }

    // Commenting these lines against item SOCD-27917, as below line of code does not have any reference in insurance section in old cap.
    // let isDisburseAmountValid = false;
    // if (this._prplData.PROPOSALFINANCIALAGREEMENT.value.INSURANCEPREMIUM == 0) {
    //   isDisburseAmountValid = this._calService.CalculateDisburseAmountOTO(0, 0, true);
    // }
    // else {
    //   isDisburseAmountValid = this._calService.CalculateDisburseAmountOTO();
    // }
    // if (isDisburseAmountValid == false)
    //   this._prplData.PROPOSALFINANCIALAGREEMENT.controls.ETAMNTOTO.setValue(0);
    // this._calService.UpdateCalculatedFields();

    this._dialog.dialog.closeAll();
  }
  assetUsageSelectionChanged(event: any) {
    if (event != undefined) {
      this._calService.ReadBPInsuranceDetailInsurance(true);
    }
  }
  chkB2bInd_Checked(event: any) {
    //if (event != undefined) {
    if (this._FormMode.FormMode != FormMode.VIEW)//&& Controller.PROPOSAL_FINANCIAL_AGRM.INSURANCEPREMIUM > 0
    {
      if (event.checked == true) {
        this._calService.RemoveArticleComponent(AmountComponent.B2BFee);
        this._prplData.PRPLINSR.controls.UPDATEDB2BIND.setValue(true);
        this._prplData.PRPLINSR.controls.CERTIFICATENBR.setValue('');
        this._prplData.PRPLINSR.controls.INSURANCEB2BAMNT.setValue(Math.round((((this._proposalManager.TotalPremiumAmount * this._prplData.PRPLINSR.value.INSURANCEB2BPCT) / 100) + Number.EPSILON) * 100) / 100);
        this._calService.UpdateFinancialAgreementDetail(this._prplData.PRPLINSR.value.INSURANCEB2BAMNT, AmountComponent.B2BFee, this._prplData.PROPOSAL.value.CURRENCYCDE, AssetComponentsFinancialConfiguration.None, this._prplData.PRPLINSR.value.INSURER, 1, AmountClassification.Receivable);
      }
      else {
        this._calService.RemoveArticleComponent(AmountComponent.B2BFee);
        this._prplData.PRPLINSR.controls.UPDATEDB2BIND.setValue(false);
        this._prplData.PRPLINSR.controls.INSURANCEB2BAMNT.setValue(0);
      }
    }
    this.isCertificateNumberEnabled = this._prplData.PRPLINSR.controls.UPDATEDB2BIND.value;
    //this.txtCertificateNumber.IsEnabled = !Controller.MainInsuranceEntity.PRPLINSR.UPDATEDB2BIND;
    // }
  }
  prcDefaultPRERTE_ValueChanged(event: any, object: any, index: number) {
    let value = 0;
    let totalmonths = 0;
    let parentIndex = object.PARENTINDEX;
    //let childIndex = this._prplData.STANDARDINSURANCE.value[object.PARENTINDEX].STANDARDINSURANCEDETAIL.findIndex(x => (x.PRPLSTNDINSRDETL.TERMFROM == object.PRPLSTNDINSRDETL.TERMFROM && x.PRPLSTNDINSRDETL.TERMTO == object.PRPLSTNDINSRDETL.TERMTO) && x.RowState != DataRowState.Removed);
    let childIndex = object.INDEX;
    if (object.PRPLSTNDINSRDETL.DEFAULTPREMIUMRTE != null)
      value = object.PRPLSTNDINSRDETL.DEFAULTPREMIUMRTE;
    let DetailMain: IStandardInsuranceDetailEntity // = new StandardInsuranceDetailEntity();
    //if (rowClickedUp != null) {
    DetailMain = object;
    if (DetailMain != null && DetailMain.PRPLSTNDINSRDETL != null) {
      totalmonths = Number(DetailMain.PRPLSTNDINSRDETL.TERMTO) - Number(DetailMain.PRPLSTNDINSRDETL.TERMFROM) + 1;
      if (value > DetailMain.PRPLSTNDINSRDETL.MAXINSRPREMIUMRTE
        || value < DetailMain.PRPLSTNDINSRDETL.MININSRPREMIUMRTE) {
        DetailMain.PRPLSTNDINSRDETL.DEFAULTPREMIUMRTE = DetailMain.PRPLSTNDINSRDETL.MININSRPREMIUMRTE;
        this._prplData.STANDARDINSURANCE.controls[parentIndex].controls.STANDARDINSURANCEDETAIL.controls[childIndex].controls.PRPLSTNDINSRDETL.controls.DEFAULTPREMIUMRTE.setValue(DetailMain.PRPLSTNDINSRDETL.MININSRPREMIUMRTE);
        //if (DetailMain.PRPLSTNDINSRDETL.INSURANCEPREMIUMTYPECDE == InsurancePremiumTypes.FixAmount.GetStringValue())
        //    DetailMain.PRPLSTNDINSRDETL.FIXPREMIUMAMT = ((DetailMain.PRPLSTNDINSRDETL.SUMINSUREDAMNT * (DetailMain.PRPLSTNDINSRDETL.DEFAULTPREMIUMRTE / 100)) / 12) * totalmonths;
        this.standardInsuranceDetailDataSource.data[index].PRPLSTNDINSRDETL.DEFAULTPREMIUMRTE = DetailMain.PRPLSTNDINSRDETL.MININSRPREMIUMRTE;
        if (DetailMain.PRPLSTNDINSRDETL.INSURANCEPREMIUMTYPECDE == InsurancePremiumTypes.FixAmount)
          this._messageService.showMesssage("FixPremiumAmtLimit", MessageType.Warning);
        else
          this._messageService.showMesssage("MinMaxRateCheck", MessageType.Warning);
      }
      else {
        DetailMain.PRPLSTNDINSRDETL.DEFAULTPREMIUMRTE = Number(value);
        this._prplData.STANDARDINSURANCE.controls[parentIndex].controls.STANDARDINSURANCEDETAIL.controls[childIndex].controls.PRPLSTNDINSRDETL.controls.DEFAULTPREMIUMRTE.setValue(DetailMain.PRPLSTNDINSRDETL.DEFAULTPREMIUMRTE);
        if (DetailMain.PRPLSTNDINSRDETL.INSURANCEPREMIUMTYPECDE == InsurancePremiumTypes.FixAmount)
          this._prplData.STANDARDINSURANCE.controls[parentIndex].controls.STANDARDINSURANCEDETAIL.controls[childIndex].controls.PRPLSTNDINSRDETL.controls.FIXPREMIUMAMT.setValue(((DetailMain.PRPLSTNDINSRDETL.SUMINSUREDAMNT * (DetailMain.PRPLSTNDINSRDETL.DEFAULTPREMIUMRTE / 100)) / 12) * totalmonths);
      }
    }
    //}
    this._proposalManager.ReCalculateInsurancePremiumRate();
    this.updateTable();
    this.rowStateOnStandardInsuraceValueChange(index);
    //txtTotalPremiumAmount.Value = Controller.TotalPremiumAmount;
  }
  focusout_tplCoverageRate(ele: any, index: any, i: any) {

    let value = Number(ele.TPLCOVERAGERTE);
    let parentIndex = this.standardInsuranceDetailDataSource.data[i].PARENTINDEX;
    let childIndex = this.standardInsuranceDetailDataSource.data[i].INDEX;
    this._prplData.STANDARDINSURANCE.controls[parentIndex].controls.STANDARDINSURANCEDETAIL.controls[childIndex].controls.PRPLADDLINSRDETL.controls[index].controls.TPLCOVERAGERTE.setValue(value);

    if (ele != null && (value > 100 || value < 0)) {
      this._prplData.STANDARDINSURANCE.controls[parentIndex].controls.STANDARDINSURANCEDETAIL.controls[childIndex].controls.PRPLADDLINSRDETL.controls[index].controls.TPLCOVERAGERTE.setValue(0);
      this._messageService.showMesssage("MinMaxRateCheck", MessageType.Error);
    } else {

      this._prplData.STANDARDINSURANCE.controls[parentIndex].controls.STANDARDINSURANCEDETAIL.controls[childIndex].controls.PRPLADDLINSRDETL.controls[index].controls.DEFAULTPREMIUMRTE.setValue(value);
    }
    this._proposalManager.ReCalculateInsurancePremiumRate();
    this.updateTable();
    this.rowStateOnStandardInsuraceValueChange(index);

  }

  txtFixPremiumAmt_ValueChanged(event: any, object: any, index: number) {
    let value = 0;
    let parentIndex = object.PARENTINDEX;
    // let childIndex = this._prplData.STANDARDINSURANCE.value[object.PARENTINDEX].STANDARDINSURANCEDETAIL.findIndex(x => (x.PRPLSTNDINSRDETL.TERMFROM == object.PRPLSTNDINSRDETL.TERMFROM && x.PRPLSTNDINSRDETL.TERMTO == object.PRPLSTNDINSRDETL.TERMTO) && x.RowState != DataRowState.Removed);
    let childIndex = object.INDEX;
    if (object.PRPLSTNDINSRDETL.FIXPREMIUMAMT != null)
      value = object.PRPLSTNDINSRDETL.FIXPREMIUMAMT;
    let DetailMain: IStandardInsuranceDetailEntity
    //if (rowClickedUp != null) {
    DetailMain = object;
    if (DetailMain != null && DetailMain.PRPLSTNDINSRDETL != null) {
      let totalmonths = Number(DetailMain.PRPLSTNDINSRDETL.TERMTO) - Number(DetailMain.PRPLSTNDINSRDETL.TERMFROM) + 1;
      if (DetailMain.PRPLSTNDINSRDETL.INSURANCEPREMIUMTYPECDE == InsurancePremiumTypes.FixAmount)
        DetailMain.PRPLSTNDINSRDETL.DEFAULTPREMIUMRTE = (Number(value) * 12 * 100) / (totalmonths * DetailMain.PRPLSTNDINSRDETL.SUMINSUREDAMNT);

      this.prcDefaultPRERTE_ValueChanged(event, object, index); // value changed call in old cap

      if (DetailMain.PRPLSTNDINSRDETL.DEFAULTPREMIUMRTE > DetailMain.PRPLSTNDINSRDETL.MAXINSRPREMIUMRTE
        || DetailMain.PRPLSTNDINSRDETL.DEFAULTPREMIUMRTE < DetailMain.PRPLSTNDINSRDETL.MININSRPREMIUMRTE) {
        this._prplData.STANDARDINSURANCE.controls[parentIndex].controls.STANDARDINSURANCEDETAIL.controls[childIndex].controls.PRPLSTNDINSRDETL.controls.DEFAULTPREMIUMRTE.setValue(DetailMain.PRPLSTNDINSRDETL.MININSRPREMIUMRTE);
        //box.Value = (double?)DetailMain.PRPLSTNDINSRDETL.MININSRPREMIUMRTE;
        this.standardInsuranceDetailDataSource.data[index].PRPLSTNDINSRDETL.FIXPREMIUMAMT = this._prplData.STANDARDINSURANCE.value[object.PARENTINDEX].STANDARDINSURANCEDETAIL[object.INDEX].OLDFIXPREMIUMAMT;
        this._messageService.showMesssage("FixPremiumAmtLimit", MessageType.Warning);
      }
    }
    // }
    this._proposalManager.ReCalculateInsurancePremiumRate();
    //txtTotalPremiumAmount.Value = Controller.TotalPremiumAmount;
  }
  loadData() {
    this.INSURANCEB2BIND = this._prplData.PRPLINSR?.value.INSURANCEB2BIND;
    this.UPDATEDB2BIND = this._prplData.PRPLINSR?.value.UPDATEDB2BIND;
    //this.chkReceiveByDealer=;
    this.RECEIVEBYDEALERIND = this._prplData.PRPLINSR?.value.RECEIVEBYDEALERIND;
  }

  rowStateOnStandardInsuraceValueChange(index: number) {
    //if (this._prplData.STANDARDINSURANCE.value[index].RowState != DataRowState.Added) {
    // this._prplData.STANDARDINSURANCE.controls[index].controls.RowState.setValue(DataRowState.Updated);
    this._prplData.STANDARDINSURANCE.controls.filter(x => x.controls.RowState.value != DataRowState.Removed && x.controls.RowState.value != DataRowState.Added).forEach((STANDARDINSURANCE: any, i: any) => {
      this._FormState.ResetFormState(this._prplData.STANDARDINSURANCE.controls[i].controls.PRPLSTNDINSR, DataRowState.Updated);
      this._prplData.STANDARDINSURANCE.controls[i].controls.RowState.setValue(DataRowState.Updated);
      if (this._prplData.STANDARDINSURANCE.value[i].PRPLADDLINSR.length > 0) {
        this._prplData.STANDARDINSURANCE.value[i].PRPLADDLINSR.forEach((item, index1) => {
          if (item.RowState != DataRowState.Added && item.RowState != DataRowState.Removed) {
            this._FormState.ResetFormState(this._prplData.STANDARDINSURANCE.controls[i].controls.PRPLADDLINSR.controls[index1], DataRowState.Updated);
          }
        })
      }
      if (this._prplData.STANDARDINSURANCE.value[i].STANDARDINSURANCEDETAIL.length > 0) {
        this.rowStateOnStandardInsuraceDetailValueChange(i);
      }
    })

    //}
  }
  rowStateOnStandardInsuraceDetailValueChange(index: number) {
    this._prplData.STANDARDINSURANCE.controls[index].controls.STANDARDINSURANCEDETAIL.controls.filter(x => x.controls.RowState.value != DataRowState.Removed && x.controls.RowState.value != DataRowState.Added).forEach((STANDARDINSURANCEDETAIL: any, i: any) => {
      this._FormState.ResetFormState(this._prplData.STANDARDINSURANCE.controls[index].controls.STANDARDINSURANCEDETAIL.controls[i].controls.PRPLSTNDINSRDETL, DataRowState.Updated);
      this._prplData.STANDARDINSURANCE.controls[index].controls.STANDARDINSURANCEDETAIL.controls[i].controls.RowState.setValue(DataRowState.Updated);
      if (this._prplData.STANDARDINSURANCE.controls[index].controls.STANDARDINSURANCEDETAIL.value[i].PRPLADDLINSRDETL.length > 0) {
        this._prplData.STANDARDINSURANCE.controls[index].controls.STANDARDINSURANCEDETAIL.value[i].PRPLADDLINSRDETL.forEach((item, index1) => {
          if (item.RowState != DataRowState.Added && item.RowState != DataRowState.Removed) {
            this._FormState.ResetFormState(this._prplData.STANDARDINSURANCE.controls[index].controls.STANDARDINSURANCEDETAIL.controls[i].controls.PRPLADDLINSRDETL.controls[index1], DataRowState.Updated);
          }
        })
      }
    })

    //}
  }
  convertINSURANCECOMPANYIDToString() {
    this._prplData.STANDARDINSURANCE.value.forEach((item: any) => {
      if (item.PRPLSTNDINSR.INSURANCECOMPANYID > 0 && item.PRPLSTNDINSR.RowState != DataRowState.Removed) {
        item.PRPLSTNDINSR.INSURANCECOMPANYID = String(item.PRPLSTNDINSR.INSURANCECOMPANYID);
      }
    })
  }

  toggleExpandable(index: number) {
    this._prplData.STANDARDINSURANCE.controls[index].controls.isExpanded.setValue(!this._prplData.STANDARDINSURANCE.value[index].isExpanded);
    this.updateTable();
  }
  colapseExpandable(index: number) {
    if (this._prplData.STANDARDINSURANCE.value[index].isExpanded) {
      this._prplData.STANDARDINSURANCE.controls[index].controls.isExpanded.setValue(false);
      this.updateTable();
    }
  }

  public FIXPREMIUMAMTFocus(parentIndex: number, index: number): void {
    this._prplData.STANDARDINSURANCE.controls[parentIndex].controls.STANDARDINSURANCEDETAIL.controls[index].controls.OLDFIXPREMIUMAMT.setValue(
      this._prplData.STANDARDINSURANCE.value[parentIndex].STANDARDINSURANCEDETAIL[index].PRPLSTNDINSRDETL.FIXPREMIUMAMT);
  }

  public txtAddlFixPremiumAmt_ValueChanged() {
    this._proposalManager.ReCalculateInsurancePremiumRate();
    //txtTotalPremiumAmount.Value = Controller.TotalPremiumAmount;
    if (this._proposalManager.ISDEFAULTPREMIUMRTECHANGED) {
      this._proposalManager.ISDEFAULTPREMIUMRTECHANGED = false;
      this._messageService.showMesssage("FixPremiumAmtLimit", MessageType.Error);
    }
    this.updateTable();
  }

  toggleDetailExpandable(standardInsuranceIndex: number, standardInsuranceDetailIndex: number) {
    let selectedRow = this._prplData.STANDARDINSURANCE.controls[standardInsuranceIndex].controls.STANDARDINSURANCEDETAIL.controls[standardInsuranceDetailIndex];

    selectedRow.controls.ISEXPANDED.setValue(!selectedRow.value.ISEXPANDED);
    this.updateTable();
  }

  private BindInsuranceCompanyBranch() {
    let param = {} as IBusinessPartnerInfoParm;
    param.RoleCode = RoleCode.InsuranceCompanyBranch;
    param.InsuranceCompanyId = Number(this._prplData.PRPLINSR.value.INSURER);
    param.BranchId = this._prplData.PROPOSAL.value.BPCOMPANYBRANCHID;
    this._proposalService.GetInsuranceCompanyBranch(param).pipe(takeUntil(this.subscription$)).subscribe(res => {
      this._prplData.PRPLINSR.controls.INSURANCECOMPANYBRANCHID.setValue(res.ResultSet);
    });

  }
}


