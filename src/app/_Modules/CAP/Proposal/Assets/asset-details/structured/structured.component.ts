import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { AssetDetailsMasterdataService } from '@NFS_Core/NFSServices/MasterData/asset-details-masterdata.service';
import { FinancialClubMasterDataService } from '@NFS_Core/NFSServices/MasterData/FinancialClub-master-data.service';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { StateManagment } from '@NFS_Core/RowStateManagement/FormStateManagement';
import { IProposalEntity } from '@NFS_Entity/Proposal-Entity/IProposalEntity.model';
import { IAssetEntity, IProposalRoundingTemplateEntity, IPRPL_TPLE_COMM_CNFGInfo, IPRPL_TPLE_RNTL_INTInfo } from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import { IPRPL_APLT_ADDSInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IPRPL_APLT_ADDSInfo.model';
import { AdjustmentType } from '@NFS_Enums/AdjustmentType.enum';
import { AmountClassification } from '@NFS_Enums/AmountClassification.enum';
import { AmountComponent } from '@NFS_Enums/AmountComponent';
import { AssetComponentsFinancialConfiguration } from '@NFS_Enums/AssetComponentsFinancialConfiguration.enum';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FinanceType } from '@NFS_Enums/FinanceType';
import { FinancialComponentsOperations } from '@NFS_Enums/FinancialComponentsOperations';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { ProposalModuleCode } from '@NFS_Enums/ProposalModuleCode.enum';
import { RentalCalculationMethod } from '@NFS_Enums/RentalCalculationMethod.enum';
import { RentalMode } from '@NFS_Enums/RentalMode';
import { RentalType } from '@NFS_Enums/RentalType.enum';
import { RVBalloonType } from '@NFS_Enums/RVBalloonType.enum';
import { SubsidyType } from '@NFS_Enums/SubsidyType.enum';
import { IRentalStructure } from '@NFS_Interfaces/OtherInterfaces/IRentalStructure';
import { ICalculationInfoParam } from '@NFS_Interfaces/RequestInterfaces/ICalculationInfoParam';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { RentalStructureCountParam } from '@NFS_Interfaces/RequestInterfaces/RentalStructureCountParam';
import { CalculationService } from '@NFS_Modules/CAP/CAPServices/calculation.service';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { ProposalManagerService } from '@NFS_Modules/CAP/_helpers/proposal-manager.service';
import { FormArray, FormBuilder } from 'src/Library';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-structured',
    templateUrl: './structured.component.html',
    styleUrls: ['./structured.component.css'],
    standalone: false
})
export class StructuredComponent implements OnInit {


  IsStructuredRentalErrorPopupOpend: boolean = false;
  RentalStructures: any = [];
  public dataSource = new MatTableDataSource<any>(this.RentalStructures);

  dataSourcelength = 10;
  selectedPageSize: number = 25;
  pageSizeOptions: number[] = [25, 50, 75, 100];
  ContractTerms: number = 0;
  NumberOfTerms: number = 0;
  totalTerms: number = 0;
  private IsOpenFromRestructuring: boolean = false;
  subsidyTerms: number = 0;
  rentalType: any;
  mask: string = "separator.2";
  separatorLimit = Math.pow(10, 12);


  displayedColumns: string[] = ['StartTerm', 'EndTerm', 'RentalTypeValue', 'RentalAmount'];
  public columns = ['StartTerm', 'EndTerm', 'RentalTypValue', 'RentalAmount'];
  public pipes = [null, null, null, null, null, null];
  public Labels = ['Start Term', 'End Term', 'Rental Type', 'Rental Amount'];
  public structuredRentalPipe = [null, null, null, 'formatCurrency'];
  private subscription$ = new Subject();
  //MPOSAPLTDOCT!: FormArray<IMPOS_APLT_DCMTInfo>;
  object = { StartTerm: '1', EndTerm: '12', RentalType: 'Auto', RentalAmount: '50000' };
  group = this._formBuilder.group(this.object);
  public doctDataset: FormArray<any> = this._formBuilder.array<any>([this.group]);

  isViewMode = false;

  constructor(public dialogRef: MatDialogRef<StructuredComponent>, private _proposalDataService: ProposalDataService, public _proposalService: ProposalService, private _calculationService: CalculationService,
    private _formBuilder: FormBuilder, private _proposalmanagerservice: ProposalManagerService, public _dataService: ProposalDataService, public _assetDetailsMasterdataService: AssetDetailsMasterdataService,
    private _msgService: MessageService, private _FormState: StateManagment, public _financialClubMasterDataService: FinancialClubMasterDataService,
    private _FormMode: FormModeService, private _proposalFormService: ProposalEntityFormService) { }

  panelOpenState = false;

  ngOnInit(): void {
    this.getRentalTypes();
    if (this._FormMode.FormMode == FormMode.VIEW) {
      this.isViewMode = true;
    }
    if (this._proposalmanagerservice.PRPLMODULECODE == ""/*ProposalModuleCode.Proposal*/) {
      //txtInterestRte.Value = (double)Controller.PROPOSAL_FINANCIAL_AGRM.APPLIEDCUSTOMERRTE;

      let rentalStructureCountParam = {} as RentalStructureCountParam;
      rentalStructureCountParam.Terms = this._dataService.PROPOSALFINANCIALAGREEMENT.value.CONTRACTTRM;
      rentalStructureCountParam.RentalFrequency = this._calculationService.rentalFrequency;
      rentalStructureCountParam.ResidualAmount = this._dataService.PROPOSALFINANCIALAGREEMENT.value.RESIDUALAMT;
      rentalStructureCountParam.RVorBaloonIncluded = (this._dataService.PROPOSALFINANCIALAGREEMENT.value.PRODUCTTYP == RVBalloonType.Balloon) ? true : false;
      this._proposalService.CalculateRentalStructureCount(rentalStructureCountParam).pipe(takeUntil(this.subscription$)).subscribe((resp: any) => {
        if (resp.CODE == 1 && resp.ResultSet != null)
          this.ContractTerms = resp.ResultSet;

        if (this._dataService.PROPOSALFINANCIALAGREEMENT.value.RESIDUALTYP == RVBalloonType.Balloon && this._dataService.PROPOSALFINANCIALAGREEMENT.value.RESIDUALAMT > 0) {
          this.NumberOfTerms = this.ContractTerms - 1;
        }
        else {
          this.NumberOfTerms = this.ContractTerms;
        }

        this.totalTerms = this.NumberOfTerms;
        if (this._dataService.PROPOSALSUBSIDYDETAIL != null && this._dataService.PROPOSALSUBSIDYDETAIL.value.SUBSIDYTYPECDE == SubsidyType.DownPaymentSubsidy) {
          this.subsidyTerms = this._dataService.PROPOSALSUBSIDYDETAIL.value.NOOFINSTALLMENTS;
          this.totalTerms -= this.subsidyTerms;
        }
        this.RebindRentalStructure();
        var rental = this.RentalStructures.filter((p: any) => p.RentalType == RentalType.Balloon || p.RentalType == RentalType.ResidualValue);
        if (rental.length > 0) {
          var index = this.RentalStructures.indexOf(rental[0]);
          this.RentalStructures.splice(index, 1);
        }
        this.BindRentalStructure();

      })

      //ViewModel.ProposalController = this.ProposalManager;
    }



    // gdConfig.DataContext = this.Controller;
    // dgRentalStructure.IsReadOnly = false;

    // dgRentalStructure.RowEditEnded += new System.EventHandler<Telerik.Windows.Controls.GridViewRowEditEndedEventArgs>(dgRentalStructure_RowEditEnded);
    // AllowPostBack = false;

    //RebindRentalStructure();

    if (this.isEqualPrincipal()) {
      // dgRentalStructure.Columns[3].IsVisible = true;
      // dgRentalStructure.Columns[4].IsVisible = false;

    }
    else {
      // dgRentalStructure.Columns[3].IsVisible = false;
      // dgRentalStructure.Columns[4].IsVisible = true;
    }

    // RentalStructure rental = RentalStructures.FirstOrDefault(p => p.RentalType == RentalType.Balloon || p.RentalType == RentalType.ResidualValue);

    // if (rental != null)
    //     RentalStructures.Remove(rental);

    // if (Controller != null && Controller.DataContext != null)
    // {
    //     gdConfig.DataContext = Controller;

    //this.BindRentalStructure();
    // }

    //this.txtTerms.Text = totalTerms + "";

  }

  AddRows() {
    if (this.RentalStructures.length > 0) {
      var indexofLast = this.RentalStructures.length - 1;
      if (indexofLast > -1) {
        var rental = this.RentalStructures.filter((p: any) => p.RentalType == RentalType.ResidualValue || p.RentalTypeValue == RentalType.GetStringValue(RentalType.ResidualValue));
        if (rental.length > 0) {
          var index = this.RentalStructures.indexOf(rental[0]);
          this.RentalStructures.splice(index, 1);
        }

        if (this.RentalStructures[indexofLast].EndTerm < this.ContractTerms) {
          var structure = {} as IRentalStructure;
          structure.EndTermText = this.totalTerms + "";
          structure.StartTerm = this.RentalStructures[indexofLast].EndTerm + 1;
          structure.EndTerm = this.totalTerms;
          structure.RentalTypeValue = RentalType.GetStringValue(RentalType.None);
          structure.RentalType = RentalType.None;
          structure.StartTermText = structure.StartTerm + "";
          structure.RentalAmount = 0;
          this.RentalStructures.push(structure);
        }

      }
    }
  }

  dgRentalStructure_RowEditEnded(e: any, i: number) {
    //dgRentalStructure.Items.CommitEdit();
    //e.EndTermText=e.EndTerm+"";
    if (e != null) {
      if (e.RentalTypeValue == RentalType.GetStringValue(RentalType.InterestOnly) || e.RentalTypeValue == RentalType.GetStringValue(RentalType.None)) {
        if (e.RentalTypeValue != this.RentalStructures[i].RentalTypeValue)//old new value case
        {
          e.RentalAmount = 0;
          e.ISENABLE = true;
        }//bongi
      }
      else {
        e.ISENABLE = false;
      }

      if (e.RentalTypeValue == RentalType.GetStringValue(RentalType.Structured) && e.RentalAmount % 100 > 0) {
        e.RentalAmount = Math.round(e.RentalAmount / 100) * 100;
        this._msgService.showCustomMesssage("Rental Amount is rounded to nearest hundred", MessageType.Info);
      }
      var row = e;
      var rowIndex = i;

      // var i= e.OldValues[""];

      if (row != null) {

        var a = parseInt(row.EndTerm);
        if (Number.isNaN(a) && !row.IsGPRental) {
          this._msgService.showMesssage("EndTermsMustBeNumeric", MessageType.Info);
          return;
        }

        if (this.RentalStructures[0].RentalTypeValue == RentalType.GetStringValue(RentalType.InterestOnly) && this._dataService.PROPOSALFINANCIALAGREEMENT.value.RENTALMODETYP == RentalMode.ADVANCE) {
          this.RentalStructures[0].RentalTypeValue = RentalType.GetStringValue(RentalType.None);

          this._msgService.showMesssage("rentModFirstInterst", MessageType.Info);

        }


        var startT = 0, endT = 0;
        startT = parseInt(row.StartTerm);
        endT = parseInt(row.EndTerm);



        if (endT >= startT) {
          if (endT <= this.totalTerms) {
            if (endT > this.totalTerms) {
              this.RentalStructures[rowIndex].EndTerm = +e.EndTermText;
              this._msgService.showMesssage("LastRentalBalloon", MessageType.Info);
            }

            //row.EndTerm = a;
            row.EndTermText = a + "";
            //TODO:  Write Generic Collection Removeall Method for accepting predicate

            var tempList = (this.RentalStructures.filter((p: any) => p.StartTerm > row.StartTerm && p.StartTerm <= row.EndTerm && p.EndTerm <= row.EndTerm));
            var list = this.RentalStructures.filter((p: any) => !tempList.includes(p));
            if (list != null && list.length > 0)
              this.RentalStructures = list;


            if (rowIndex + 1 < this.RentalStructures.length) {
              //RentalStructures[rowIndex + 1].StartTerm = row.EndTerm + 1;
              while (true) {
                if (!this.RentalStructures[rowIndex + 1].IsGPRental) {
                  //  RentalStructures[rowIndex + 1].StartTerm = row.EndTerm + 1;
                  var endTa = 0;
                  endTa = parseInt(row.EndTermText);
                  this.RentalStructures[rowIndex + 1].StartTerm = (endTa + 1);
                  this.RentalStructures[rowIndex + 1].StartTermText = (endTa + 1) + "";
                  break;
                }
                rowIndex++;
              }
            }
          }
          else {

            if (rowIndex > -1) {
              this.RentalStructures[rowIndex].EndTerm = +e.EndTermText;
            }
            this._msgService.showMesssage("EndEqContTerm", MessageType.Info);
            return;
          }
        }
        else {
          if (rowIndex > -1) {
            this.RentalStructures[rowIndex].EndTerm = +e.EndTermText;
          }
          this._msgService.showMesssage("EndTermGreaterEqualStartTerm", MessageType.Info);
          return;
        }
      }



      this.AddRows();
      this.RebindRentalStructure();
      if (this._proposalmanagerservice != null)
        this._proposalmanagerservice.RentalsAreCalculated = false;
    }
  }

  private syncRentalStructure() {
    if (this.RentalStructures.length > 1) {
      var RentalGPStart = this.RentalStructures.filter((p: any) => p.IsGPRental == true)[0];
      var RentalGPEnd = this.RentalStructures.filter((p: any) => p.IsGPRental == true)[this.RentalStructures.length - 1];

      var diff = 0;
      if (RentalGPStart != null && RentalGPEnd != null) {
        var startT = RentalGPStart.StartTerm;
        var endT = RentalGPEnd.EndTerm;

        diff = endT - startT + 1;
      }
      var isDone: boolean = false;
      var length = this.RentalStructures.length;

      this.RentalStructures.filter((rentals: any) => {
        if (rentals.IsGPRental) {
          if (this._dataService.PROPOSALFINANCIALAGREEMENT != null && this._dataService.PROPOSALFINANCIALAGREEMENT.value.RENTALMODETYP == RentalMode.ADVANCE && !isDone) {
            isDone = true;
          }
          var statTa = 0, endTa = 0;
          statTa = parseInt(rentals.StartTermText);
          endTa = parseInt(rentals.EndTermText);
          rentals.StartTerm = statTa + diff;
          rentals.EndTerm = endTa + diff;


          if (length == (this.RentalStructures.indexOf(rentals) + 1)) {
            rentals.EndTerm = endTa + diff + this.subsidyTerms;
          }
        }
      })
    }
  }


  BindRentalStructure() {
    /*
     if (Controller != null)
    {
        if (m_module == ModuleCode.Proposal && ProposalManager != null)
        {
            if (ProposalManager.PROPOSAL_ASSET.PROPOSALRENTALDETAIL.Count <= 0 && RentalStructures != null && RentalStructures.Count > 0)
            {
                RentalStructures.Clear();
            }
        }
        else if (m_module == ModuleCode.Quotation && QuotationManager != null)
        {
            if (QuotationManager.CurrentAssetEntity.QUOTATIONRENTALDETAIL.Count <= 0 && RentalStructures != null && RentalStructures.Count > 0)
            {
                RentalStructures.Clear();
            }
        }

        // Controller.PROPOSAL_ASSET.PropertyChanged += new PropertyChangedEventHandler(PROPOSAL_ASSET_PropertyChanged);

        if (m_module == ModuleCode.Proposal && ProposalManager != null)
            RentalStructures = await ProposalManager.CreateRentalStructure();
        else if (m_module == ModuleCode.Quotation && QuotationManager != null)
            RentalStructures = await QuotationManager.CreateRentalStructure();

        ProposalManager.LoadRentalTypes(RentalStructures);

        dgRentalStructure.ItemsSource = null;
        dgRentalStructure.ItemsSource = RentalStructures.FindAll(p => p.RentalType != RentalType.Balloon && p.RentalTypeValue != RentalType.Balloon.GetStringValue() && p.RentalType != RentalType.ResidualValue && p.RentalTypeValue != RentalType.ResidualValue.GetStringValue());

        await Calculate();

    }
     */

    if (this._proposalmanagerservice.PRPLMODULECODE == ""/*ProposalModuleCode.Proposal*/) {
      if (this._dataService.ASSETENTITY.value.PROPOSALRENTALDETAIL.length <= 0 && this.RentalStructures != null && this.RentalStructures.length > 0) {
        this.RentalStructures.Clear();
      }
    }

    if (this._proposalmanagerservice.PRPLMODULECODE == ""/*ProposalModuleCode.Proposal*/) {

      let param = {} as ICalculationInfoParam;
      param.rentalFrequency = this._calculationService.rentalFrequency;
      param.AssetEntity = this._dataService.ASSETENTITY.value as IAssetEntity;

      this._proposalService.CreateRentalStructure(param).pipe(takeUntil(this.subscription$)).subscribe((resp: any) => {
        this.RentalStructures = resp.ResultSet;

        this.LoadRentalTypes(this.RentalStructures);

        this.doctDataset = this._formBuilder.array<any>([]);
        var a = this.RentalStructures.filter((p: any) => p.RentalType != RentalType.Balloon && p.RentalTypeValue != RentalType.GetStringValue(RentalType.Balloon) && p.RentalType != RentalType.ResidualValue && p.RentalTypeValue != RentalType.GetStringValue(RentalType.ResidualValue))
        this.dataSource = new MatTableDataSource<any>(a);
        // a.filter((m:any)=>{
        //   this.doctDataset.push(this._formBuilder.group(m));
        // })
        this.Calculate();
      })


    }

    /*
    dgRentalStructure.ItemsSource = null;
    dgRentalStructure.ItemsSource = RentalStructures.FindAll(p => p.RentalType != RentalType.Balloon && p.RentalTypeValue != RentalType.Balloon.GetStringValue() && p.RentalType != RentalType.ResidualValue && p.RentalTypeValue != RentalType.ResidualValue.GetStringValue());

    await Calculate();
    */
  }

  LoadRentalTypes(RentalStructure: any) {
    if (RentalStructure.length > 0) {

      RentalStructure.filter((p: any) => {
        if (p.RentalTypeValue == null || p.RentalTypeValue == "") {
          p.RentalTypeValue = RentalType.GetStringValue(p.RentalType);
        }
      })
    }
  }

  RemoveRepaymentPlan() {
    this._FormState.ResetFormArrayState(this._dataService.PROPOSALREPAYMENTPLANENTITYCOL, DataRowState.Removed);
  }

  getRentalTypes() {
    this._assetDetailsMasterdataService.getmasterDataForAssetDetail().pipe(takeUntil(this.subscription$)).subscribe(a => {
      this._assetDetailsMasterdataService.InitializeAssetDetailMasterData(a);
      this.rentalType = this._assetDetailsMasterdataService.RentalTypes;
      console.log(this.rentalType);
      if (this._dataService.PROPOSALTEMPLATERENTALINT.value.INTERESTRENTALALLOWEDIND) {
        this.rentalType = this.rentalType.filter((p: any) => p.code == RentalType.GetStringValue(RentalType.None) || p.code == RentalType.GetStringValue(RentalType.Structured) || p.code == RentalType.GetStringValue(RentalType.InterestOnly));
      }
      else {
        this.rentalType = this.rentalType.filter((p: any) => p.code == RentalType.GetStringValue(RentalType.None) || p.code == RentalType.GetStringValue(RentalType.Structured));
      }

    })

  }

  getRentalTypeMasterData(element: any, index: any): any {
    if (element.EndTerm == this.totalTerms) {
      return this.rentalType.filter((p: any) => p.code == RentalType.GetStringValue(RentalType.None));
    }
    if (index == 0 && this._dataService.PROPOSALFINANCIALAGREEMENT.value.RENTALMODETYP == RentalMode.ADVANCE) {
      return this.rentalType.filter((p: any) => p.code != RentalType.GetStringValue(RentalType.InterestOnly));
    }
    return this.rentalType;
  }


  isEqualPrincipal(): boolean {
    if (this._proposalmanagerservice.PRPLMODULECODE == ProposalModuleCode.Proposal) {
      if (this._dataService.PROPOSALTEMPLATERENTALINT.value.RNTLCALCLTNMTDCDE == RentalCalculationMethod.EqualPrincipal)
        return true;
    }
    // else if (m_module == ModuleCode.Quotation && QuotationManager != null)
    // {
    //     if (QuotationManager.RentalConfiguraitonTemplate.TPLERNTLINTR.RNTLCALCLTNMTDCDE == RentalCalculationMethod.EqualPrincipal.GetStringValue())
    //         return true;
    // }
    return false;


  }

  public UpdateRentalAmount() {
    this.RentalStructures.filter((rc: any) => {
      rc.RentalAmount = 0.0;
    })

  }

  public PreCalculate() {
    if (!this.IsOpenFromRestructuring)
      this.RemoveRepaymentPlan();

    this.RentalStructures.filter((rc: any) => {
      if ((rc.RentalTypeValue)) {
        rc.RentalType = RentalType.GetRentalType(rc.RentalTypeValue);
      }
      else {
        rc.RentalType = RentalType.None;
      }
      if (this.isEqualPrincipal())
        this.UpdateRentalAmount();
    })
  }

  public RebindRentalStructure() {
    this.doctDataset = this._formBuilder.array<any>([]);
    var a = this.RentalStructures.filter((p: any) => p.RentalType != RentalType.Balloon && p.RentalTypeValue != RentalType.GetStringValue(RentalType.Balloon) && p.RentalType != RentalType.ResidualValue && p.RentalTypeValue != RentalType.GetStringValue(RentalType.ResidualValue))
    this.dataSource = new MatTableDataSource<any>(a);
    // a.filter((m:any)=>{
    //   this.doctDataset.push(this._formBuilder.group(m));
    // })
    //   dgRentalStructure.ItemsSource = null;
    //   dgRentalStructure.ItemsSource = RentalStructures.FindAll(p => p.RentalType != RentalType.Balloon && p.RentalTypeValue != RentalType.Balloon.GetStringValue() && p.RentalType != RentalType.ResidualValue && p.RentalTypeValue != RentalType.ResidualValue.GetStringValue());
  }

  btnCalculate_Click() {
    this.syncRentalStructure();
    //this.dgRentalStructure_RowEditEnded
    this.Calculate();
    this.RebindRentalStructure();

  }

  btnOk_Click() {
    if (this.RentalStructures.filter((p: any) => p.RentalTypeValue == RentalType.GetStringValue(RentalType.None)).length < 1) {
      this.IsStructuredRentalErrorPopupOpend = true;
      this._msgService.showMesssage("AtleastOneRetalAuto", MessageType.Info);
    }
    else {
      this.dialogRef.close();
    }
  }

  btnCancel_Click() {
    this.dialogRef.close();
  }

  calculateNFA() {
    let _addamount = 0;
    let _subamount = 0;
    if (
      this._dataService.PROPOSALARTICLE != null &&
      this._dataService.PROPOSALARTICLE.length > 0
    ) {
      _addamount = this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls
        .filter(
          (p) =>
            p.controls.PRPLARTEAMNTTRAN.value.OPERATORCDE ==
            FinancialComponentsOperations.Add &&
            p.controls.RowState.value != DataRowState.Removed
        )
        .reduce(function (tot, record) {
          // let amt = this.GetTAXINCULSIVEAMT(record);
          return Number(tot) + Number(record.value.TAXINCULSIVEAMT);
        }, 0); //.Sum(p => p.TAXINCULSIVEAMT);

      _subamount = this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls
        .filter(
          (p) =>
            p.controls.PRPLARTEAMNTTRAN.value.OPERATORCDE ==
            FinancialComponentsOperations.Subtract && p.controls.RowState.value != DataRowState.Removed
        )
        .reduce(function (tot, record) {
          return tot + record.value.TAXEXCULSIVEAMT;
        }, 0); //Sum(p => p.TAXEXCULSIVEAMT);

      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.ADJUSTEDFINANCEDAMT.setValue(_addamount - _subamount - this._proposalmanagerservice.AssetCostVatLessITC - this._proposalmanagerservice.AccessoryCostVatLessITC);
      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.FINANCEDAMT.setValue(_addamount - _subamount - this._proposalmanagerservice.AssetCostVatLessITC - this._proposalmanagerservice.AccessoryCostVatLessITC);
    }
  }

  Calculate() {
    var rentalAmount = 0;
    var principalAmount = 0;
    var rvballoonAmount = 0;
    var financedAmount = 0;

    this.RentalStructures.filter((rental: any) => {
      rental.RentalType = RentalType.GetRentalType(rental.RentalTypeValue);
      if (rental.RentalType == RentalType.None || rental.RentalType == RentalType.InterestOnly) {
        rental.RentalAmount = 0;
        rental.PrincipalAmount = 0;
      }
      rentalAmount += rental.RentalAmount * (rental.EndTerm - rental.StartTerm + 1);
      principalAmount += rental.PrincipalAmount * (rental.EndTerm - rental.StartTerm + 1);

    })
    rvballoonAmount = this._dataService.PROPOSALFINANCIALAGREEMENT.value.RESIDUALAMT;
    financedAmount = this._dataService.PROPOSALFINANCIALAGREEMENT.value.ADJUSTEDFINANCEDAMT;
    financedAmount -= rvballoonAmount;

    if (this.RentalStructures.filter((p: any) => p.RentalTypeValue == RentalType.GetStringValue(RentalType.None)).length < 1) {
      this.IsStructuredRentalErrorPopupOpend = true;
      this._msgService.showMesssage("AtleastOneRetalAuto", MessageType.Info);
    }
    else if ((!(this.isEqualPrincipal()) && rentalAmount > financedAmount) || ((this.isEqualPrincipal()) && (principalAmount > financedAmount))) {
      //this.IsStructuredRentalErrorPopupOpend=true;
      this._msgService.showMesssage("RntlStrctgrtrFinAmnt", MessageType.Info);
    }
    else if ((!(this.isEqualPrincipal()) && this.RentalStructures.filter((p: any) => p.RentalAmount < 0).length > 0) || ((this.isEqualPrincipal()) && this.RentalStructures.filter((p: any) => p.PrincipalAmount < 0).length > 0)) {
      //this.IsStructuredRentalErrorPopupOpend=true;
      this._msgService.showMesssage("EntrValidRntlStrctAmnt", MessageType.Info);

    }
    else {

      this.AdjustBounds();
      this.PreCalculate();
      if (!this._proposalmanagerservice.isRefinance) {
        this._proposalmanagerservice.GPFrequency = this._dataService.PROPOSALFINANCIALAGREEMENT.value.GPFREQUENCY;
      }
      let param = {} as ICalculationInfoParam;
      param.rentalFrequency = this._calculationService.rentalFrequency;
      param.RentalStructures = this.RentalStructures;
      param.ProposalEntity = this._dataService.ProposalEntity.value as IProposalEntity;


      param.AssetEntity = this._dataService.ASSETENTITY.value as IAssetEntity;
      var proposalInfoParam = {} as IProposalInfoParm;
      proposalInfoParam.ApplicantType = this._dataService.PROPOSAL.value.PROPOSALTYPECDE == '00001' ? "I" : "C";
      param.proposalInfoParam = proposalInfoParam;
      param.roundingEntity = this._dataService.PROPOSALROUNDINGTEMPLATE.value as IProposalRoundingTemplateEntity;
      param.RentalTemplateEntity = this._dataService.PROPOSALTEMPLATERENTALINT.value as IPRPL_TPLE_RNTL_INTInfo;
      param.RentalTemplateEntity.FINANCETYP = this._dataService.PROPOSAL.value.FINANCETYP;
      param.RentalTemplateEntity.TAXADDSTYPECDE = "00001";
      param.InsuranceContractIncl = this._proposalmanagerservice.InsuranceContractInclusiveSum
      param.applicantAddress = {} as IPRPL_APLT_ADDSInfo;
      param.ProposalTempCommCongfig = [] as Array<IPRPL_TPLE_COMM_CNFGInfo>
      param.rentalFrequency = this._calculationService.rentalFrequency




      this._proposalService.CalculateRentalStructure(param).pipe(takeUntil(this.subscription$)).subscribe((resp: any) => {
        if (resp != null && resp.ResultSet != null && resp.CODE != null) {
          this._calculationService.FillAssetRepaymentPlan(resp.ResultSet);

          //total first payment
          this._calculationService.RemoveArticleComponent(AmountComponent.FirstRental);
          if (this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.Refinance && this._dataService.PROPOSALFINANCIALAGREEMENT.value.RENTALMODETYP == RentalMode.ADVANCE) {
            if (this._dataService.PROPOSALSUBSIDYDETAIL.value != null
              && !this._dataService.PROPOSALSUBSIDYDETAIL.value.SUBSIDYTYPECDE
              && this._dataService.PROPOSALSUBSIDYDETAIL.value.SUBSIDYTYPECDE == SubsidyType.InstallmentSubsidy
              && this._dataService.PROPOSALSUBSIDYDETAIL.value.ADJUSTMENTTYPECODE == AdjustmentType.StartTerms) {
              this._calculationService.RemoveArticleComponent(AmountComponent.FirstRental);
            }
            else {
              let classification = {} as AmountClassification;
              if (this._dataService.PROPOSALFINANCIALAGREEMENT.controls.INSTALMENTPAYTOINTRODUCER.value)
                classification = AmountClassification.Nettingoff;
              else
                classification = AmountClassification.None;
              this._calculationService.UpdateFinancialAgreementDetail(this._proposalmanagerservice.RepaymentPlan[0].PRPLRPMTPLAN.GROSSRENTAL, AmountComponent.FirstRental, this._dataService.PROPOSAL.controls.CURRENCYCDE.value, AssetComponentsFinancialConfiguration.Upfront, this._dataService.PROPOSAL.value.BPINTRODUCERID, 1, classification, this._dataService.PROPOSALFINANCIALAGREEMENT.value.INSTALMENTPAYTOINTRODUCER);

            }
          }


          //Controller.ExtractComponentTaxes(response.ResultSet.TaxAmountComponentResponse, Controller.PROPOSAL_ASSET, true);

          this.calculateNFA();
          this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CHARGEAMT.setValue(
            this._proposalmanagerservice.TotalChargesTaxInclusive
          );
          this._dataService.PROPOSALFINANCIALAGREEMENT.controls.COMMFIXAMT.setValue(resp.ResultSet.CommissionResponsePAram.TotalCommission);

          this._calculationService.calculateCommission();


          this.RentalStructures = resp.ResultSet.RenalStructure.filter((p: any) => p.RentalType != RentalType.ResidualValue && p.RentalType != RentalType.Balloon);

          var isDone = false;
          var length = this.RentalStructures.length;


          var RentalGPStart = this.RentalStructures.filter((p: any) => p.IsGPRental == true)[0];
          var RentalGPEnd = this.RentalStructures.filter((p: any) => p.IsGPRental == true)[this.RentalStructures.filter((p: any) => p.IsGPRental == true).length - 1];

          var diff = 0;
          if (RentalGPStart != null && RentalGPEnd != null) {
            var startT = RentalGPStart.StartTerm;
            var endT = RentalGPEnd.EndTerm;

            diff = endT - startT + 1;
          }

          this.RentalStructures.filter((rental: any) => {

            if (rental.IsGPRental) {
              rental.EndTermText = "GP";
              rental.StartTermText = "GP";
              rental.ISENABLE = true;
            }
            else {
              var startT = rental.StartTerm - diff;
              var endT = rental.EndTerm - diff;

              if (this._dataService.PROPOSALFINANCIALAGREEMENT != null && this._dataService.PROPOSALFINANCIALAGREEMENT.value.RENTALMODETYP == RentalMode.ADVANCE && !isDone) {
                isDone = true;
                startT = rental.StartTerm;
                endT = rental.EndTerm;
              }
              rental.StartTermText = startT + "";
              rental.EndTermText = endT + "";

              if (length == (this.RentalStructures.indexOf(rental) + 1)) {
                rental.EndTermText = (endT - this.subsidyTerms) + "";
              }

            }

          })
          //this._dataService.PROPOSALFINANCIALAGREEMENT.controls.COMMFIXAMT.setValue(resp.ResultSet.CommissionResponsePAram.TotalCommission);

          this.PostCalculate();

          this.RebindRentalStructure();
          this._proposalmanagerservice.isCalcButtonEnabled = false;
          this._proposalmanagerservice.RentalsAreCalculated = true;
        }
        else {
          if (resp != null) {
            //ReturnCode error = (ReturnCode)resp.CODE;

            //Message.InfoMessage(error.GetLocalizeStringValue());
          }
          else
            this._msgService.showMesssage("CalculationException", MessageType.Info);
          //IsStructuredRentalErrorPopupOpend = true;
          //return false;
        }
        //AllowPostBack = true;

        //this.BusyIndicator.IsBusy = false;
      })
    }
  }

  PostCalculate() {
    this.RentalStructures.filter((rc: any) => {
      rc.RentalTypeValue = RentalType.GetStringValue(rc.RentalType);
    })

  }

  RentalTypes() {
    if (this.RentalStructures.length > 0) {
      this.RentalStructures.filter((rental: any) => {
        if ((rental.RentalTypeValue == null || rental.RentalTypeValue == '') && rental.RentalType == RentalType.None) {
          rental.RentalType = RentalType.Structured;
          rental.RentalTypeValue = RentalType.GetStringValue(RentalType.Structured);
        }
        rental.RentalTypValue = RentalType.GetStringValue(rental.RentalType);
      })

    }
  }

  ValidateAmounts() {
    if (this.RentalStructures.length > 0) {
      this.RentalStructures.filter((rental: any) => {
        if (rental.RentalType != RentalType.Structured && rental.RentalTypeValue != RentalType.GetStringValue(RentalType.Structured)) {
          rental.RentalAmount = 0;
        }
      })

    }
  }

  private AdjustBounds() {
    var changed = false;
    this.RentalTypes();
    this.ValidateAmounts();

    //dgRentalStructure.Items.CommitEdit();
    if (changed) {
      //AllowPostBack = false;
      //this.RebindRentalStructure();
    }
  }

  public PageSelectionChanged(event: PageEvent) {
  }

}


export class testing {
  StartTerm: string = '';
  EndTerm: string = ''
  RentalType: string = ''
  RentalAmount: string = ''

}
