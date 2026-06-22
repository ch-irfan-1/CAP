import { Component, OnChanges, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorSelectConfig, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { ContextMenuService } from '@NFS_Core/NFSServices/ContextMenu/context-menu.service';
import { DialogBoxService } from '@NFS_Core/NFSServices/DialogBox/dialog-box.service';
import { FormatterService } from '@NFS_Core/NFSServices/Formatter/formatter.service';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { FieldVisitDataService } from '@NFS_Core/NFSServices/MasterData/field-visit-feedback.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { mPOSMasterDataRequest } from '@NFS_Core/NFSServices/MasterData/MasterdataHelper/mPOSMasterDataRequest';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { PDFViewerService } from '@NFS_Core/NFSServices/Viewer/PDFViewerService.service';
import { HeaderTitleService } from '@NFS_Core/NFSServices/_helper/header-title-service.service';
import { WorkQueueHelperService } from '@NFS_Core/NFSServices/_helper/WorkQueueHelper/work-queue-helper.service';
import { IPRPLInfo } from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import { AssetSelection } from '@NFS_Enums/AssetSelection.enum';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FinanceType } from '@NFS_Enums/FinanceType';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { MasterData } from '@NFS_Enums/MasterData.enum';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { ModuleCode } from '@NFS_Enums/ModuleCode.enum';
import { ProposalHistoryAction } from '@NFS_Enums/ProposalHistoryAction.enum';
import { ReasonCode } from '@NFS_Enums/ReasonCode.enum';
import { ReturnCode } from '@NFS_Enums/ReturnCode.enum';
import { StatusCode } from '@NFS_Enums/StatusCode.enum';
import { QueueOperation } from '@NFS_Enums/WorkQueueOperation.enum';
import { IContextMenu } from '@NFS_Interfaces/OtherInterfaces/IContextMenu.interface';
import { IPRPLQUInfo } from '@NFS_Interfaces/OtherInterfaces/IPRPLQUInfo';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { IAssetInfoParams } from '@NFS_Interfaces/RequestInterfaces/asset-search-info-params';
import { IBLAKLISTHTRYInfo } from '@NFS_Interfaces/RequestInterfaces/IBLAK_LIST_HTRYInfo';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { FormArray, FormBuilder, FormControl, FormGroup } from 'src/Library';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StationeryService } from '../CAPServices/stationery.service';
import { CancelRequestComponent } from './cancelRequest/cancelRequest.component';
import { ChangeRequestComponent } from './changeRequest/changeRequest.component';
import { DeclineRequestComponent } from './declineRequest/declineRequest.component';
import { DocumentTrackingComponent } from './document-tracking/document-tracking.component';
import { EApprovalComponent } from './e-approval/eapproval.component';
import { FieldVisitComponent } from './fieldVisit/fieldVisit.component';
import { ForwardRequestComponent } from './forward-request/forward-request.component';
import { MposSurveyComponent } from './mpos-survey/mpos-survey.component';
import { PointScoreComponent } from './pointScore/pointScore.component';
import { PrintStationery } from './print/print.component';
import { WithdrawRequestComponent } from './withdraw-request/withdraw-request.component';
import { CaRecommendationComponent } from './carecommendation/caRecommendation.component';
import { ComponentName } from '@NFS_Enums/Component.enum';
import { MVOSurveySearchComponent } from './mvo-survey-search/mvo-survey-search.component';
import { QuotationService } from '@NFS_Core/NFSServices/Quotation/quotation.service';

@Component({
    selector: 'app-proposal-queue',
    templateUrl: './proposal-queue.component.html',
    styleUrls: ['./proposal-queue.component.css'],
    standalone: false
})

export class ProposalQueueComponent implements OnInit, OnDestroy {
  @Input() ComponentName!: string;
  classApplied = false;
  classApplied1 = true;
  isUserNameDisabled = false;
  maxDate: Date = new Date(Date.now());
  maxToDate: Date = new Date(Date.now());;
  public totalRows: number = 0;
  public isDatePickerDisabled: boolean = true;
  // MatPaginator Output
  dataSourcelength = 0;
  pageSizeOptions: number[] = [10, 25, 50, 75, 100];

  resizeResetGrid = true;

  public QueueSearchForm: FormGroup = new FormGroup({
    FromDate: new FormControl(),
    ToDate: new FormControl(),
    ApplicationNumber: new FormControl(),
    ApplicantName: new FormControl(),
    SearchByColumn: new FormControl(),
    STATUS: new FormControl(),
    INTRODUCER: new FormControl(0),
    APPLICANTTYPE: new FormControl(),
    FINANCIALCAMPAIGNGROUP: new FormControl(),
    FINANCIALCAMPAIGN: new FormControl(),
    CONSENTTOSHARE: new FormControl(false),
    DateBy: new FormControl(),
    EApproval: new FormControl(),
    MVONames: new FormControl(),
    USERID: new FormControl(-1)
  });

  RadioOptions: FormGroup = new FormGroup({
    Option: new FormControl
  });


  ProposalQueueParams = {} as IProposalInfoParm;
  ProposalQueueResultSet = [] as Array<IPRPLQUInfo>;
  statusColumn: string = 'STATUSDSC';
  selectedPageSize: number = 10;
  selectedStatus!: string | null;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator | undefined;
  resetGridPage: boolean = false;
  private subscription$ = new Subject();

  public columns = ['PROPOSALNBR','CRDTRCMDTYPEDSC', 'BPCOMPANYBRANCHNME', 'POSLOCATION','BUSINESSPARTNERNME', 'REQUESTSTATUSDSC', 'EAPPROVALTIME','MCOMTOPUPIND',  'FPGROUPNME', 'MVOSURVEY' , 'ASSETCONDITION','CUSTOMERTYPE','PROPOSALDTE', 'ASSNTONAME', 'FINANCEDAMT', 'BPINTRODUCERNME', 'FINANCIALPRODUCTNME', 'FINANCETYPDSC', 'CONTREFNO', 'MPOSAPPLICATIONNBR', 'LEADNUMBER', 'CONTREVISIONINDDESC', 'APPLICANTTYP', 'MAKEDSC','ASSETBRANDDSC','MVOASNDTE', 'ESIGNDTE', 'SUBMITATCAP', 'SRVYDRTN','MVOSBMTDRTN', 'RSVYDRTN', 'NOOFRSVY'];
  public pipes = [null, null, null, null, null, null,'formatDateTime', null , null, null, null, null, 'formatDate', null,   'formatCurrency', null, null, null, null, null, null, null, null, null, null, 'formatDateTime', 'formatDateTime','formatDateTime', 'formatCurrency', 'formatCurrency', 'formatCurrency', null];
  public EnableTooltip = [false, false, false, true, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
  public Labels = ['Application No.','CA Recommendation', 'Company Branch', 'Satellite/POS Location','Applicant Name', 'Status', 'E-Approval Time','Top Up','Product', 'MVO Survey','Asset Condition','Customer Type','Creation Date', 'Assign To', 'Financed Amount', 'Introducer', 'Campaign', 'Application Type', 'Contract Reference No.', 'MPOS Reference No.', 'iOPS Reference No.', 'Contract Revision', 'Applicant Type', 'Asset Make','Asset Brand', 'MVO Assign Date','E - Signature Date', 'Submit to CAP', 'Survey Duration','MVO Submit Duration','Resurvey Duration','No. Of Resurveys'];
  public ContextMenu: Array<IContextMenu> = [];
  public ProposalQueueDataset: FormArray<IPRPLQUInfo> = this._formBuilder.array<IPRPLQUInfo>([]);
  public ProposalQueueData: FormArray<IPRPLQUInfo> = this._formBuilder.array<IPRPLQUInfo>([]);
  public tempData = [{ status: "Draft", color: "rgb(255,255,255)" }, { status: "New", color: "rgb(255,255,255)" }, { status: "Approved", color: "rgb(208, 254, 208)" }, { status: "mPOS Resurvey", color: "rgb(183, 214, 183)" },
  { status: "Withdrawn", color: "rgb(163, 198, 236)" }, { status: "Cancelled", color: "rgb(203, 195, 227)" }, { status: "Converted", color: "rgb(225, 194, 136)" }, { status: "Declined", color: "rgb(225, 141, 141)" }, { status: "Change in process", color: "rgb(255,206,118)" }];


  ProposalQueueColumnData: Array<INFSDropDownData> = [];

  // Proposal Queue Master Data
  public AllSystemUsers: INFSDropDownData[] = [];
  public selectedMVOs: INFSDropDownData[] = [];
  public AllStatuses: INFSDropDownData[] = [];
  public AllIntroducers: INFSDropDownData[] = [];
  public AllFinancialProducts: INFSDropDownData[] = [];
  public AllFinancialGroups: INFSDropDownData[] = [];
  public AllProposalTypes: INFSDropDownData[] = [];
  public AllDateBy: INFSDropDownData[] = [
    { code: 'All', TextValue: 'All Time' } as INFSDropDownData,
    { code: 'Today', TextValue: 'Today' } as INFSDropDownData,
    { code: 'Week', TextValue: 'This Past Week' } as INFSDropDownData,
    { code: 'Month', TextValue: 'This Past Month' } as INFSDropDownData,
    { code: 'Custom', TextValue: 'Custom' } as INFSDropDownData
  ];
  public EApproval: INFSDropDownData[] = [
    { code: 'true', TextValue: 'Approved' } as INFSDropDownData,
    { code: 'false', TextValue: 'Waiting For Approval' } as INFSDropDownData,
  ];

  paginatorSelectConfig:MatPaginatorSelectConfig = {
    panelClass: "paginator-select-overlay"
  }
  constructor(private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private _fieldVistFeedbackMasterDataService: FieldVisitDataService,
    private _PDFViewerService: PDFViewerService,
    private _appConfig: AppConfigService,
    private _ProposalService: ProposalService,
    private _QuotationService: QuotationService,
    private _router: Router,
    private _storageService: ClientStoreService,
    private _toastr: ToastrService,
    private _menu: ContextMenuService,
    private _columns: WorkQueueHelperService,
    private headerTitleService: HeaderTitleService,
    public appConfig: AppConfigService,
    private _msgService: MessageService,
    private _formModeService: FormModeService,
    private _customDialog: DialogBoxService,
    private _route: ActivatedRoute,
    private _prplService: ProposalService,
    private _formatterService: FormatterService,
    private _stationeryService: StationeryService,
    public _masterDataService: MasterDataService,

  ) { }

  ngOnInit(): void {
    this._formModeService.FormMode = FormMode.NEW;
    const collection: any = this._route.snapshot.data['QueueCollection'];
    this.InitializeProposalQueueData(collection);

    this.isUserNameDisabled = this.IsWRQUUserDD_DisabledGroupLogin();
    this._columns.getWorkQueueDropdownColumns().pipe(takeUntil(this.subscription$))
      .subscribe(
        (data: any) => {
          this.ProposalQueueColumnData = data.PRPLFilterColumns;
        });

    this.SetDefaultFilterCriteria();

    this._menu.getCAPContextMenu().pipe(takeUntil(this.subscription$))
      .subscribe(
        (data: any) => {
          this.ContextMenu = data
        });
    this.getProposalQueueData(0);
  }

  SetDefaultFilterCriteria() {
    // Set To Date
    var toDate = new Date();
    toDate.setDate(toDate.getDate());
    this.QueueSearchForm.controls.ToDate.setValue(this._formatterService.FormateDateToString(toDate.toString(), 'yyyy-MM-dd'));

    // Set From Date
    var fromDate = new Date();
    fromDate.setDate(fromDate.getDate());
    this.QueueSearchForm.controls.FromDate.setValue(this._formatterService.FormateDateToString(fromDate.toString(), 'yyyy-MM-dd'));

    // Set Date Filter
    this.QueueSearchForm.controls.DateBy.setValue('Today');

    // Set E-Approval Status
    let isHeadOfficeUser = this._storageService.GetUserInfo().CompanySysUser.filter((x: any) => x.BPSECONDARYID == 6);
    if (isHeadOfficeUser !== undefined && isHeadOfficeUser !== null && isHeadOfficeUser.length > 0) {
      this.QueueSearchForm.controls.EApproval.setValue('true');
    }
    else {
      this.QueueSearchForm.controls.EApproval.setValue('false');
    }

    // Set Status
    this.QueueSearchForm.controls.STATUS.setValue(StatusCode.Draft);

    // Set User
    this.QueueSearchForm.controls.USERID.setValue(this._storageService.GetUserInfo().UserId);
  }

  onFromDateChanged() {
    var todateMax = new Date(this.QueueSearchForm.controls.FromDate.value);
    todateMax.setDate(todateMax.getDate() + this.appConfig.DateRangeDaysLimit);
    if (todateMax > this.maxDate) {
      todateMax = this.maxDate;
    }
    this.maxToDate = todateMax;
    var fromDate = new Date(this.QueueSearchForm.controls.FromDate.value);
    var toDate = new Date(this.QueueSearchForm.controls.ToDate.value);
    if (!(toDate < todateMax && fromDate < toDate)) {
      this.QueueSearchForm.controls.ToDate.setValue(this._formatterService.FormateDateToString(todateMax.toString(), 'yyyy-MM-dd'));
    }
  }

  InitializeProposalQueueData(data: any) {
    this.AllSystemUsers = data.AllSystemUsers;
    this.AllStatuses = data.AllStatuses;
    this.AllIntroducers = data.AllIntroducers;
    this.AllFinancialGroups = data.AllFinancialGroups;
    this.AllFinancialProducts = data.AllFinancialProducts;
    this.AllProposalTypes = data.AllProposalTypes;
    //this.AllIntroducers = [];
  }

  public PageSelectionChanged(event: PageEvent) {
    // this.resizeResetGrid = false;
    var pageIndex: number = event.pageIndex + 1;
    this.selectedPageSize = event.pageSize;
    this.getProposalQueueData((pageIndex * this.selectedPageSize) - this.selectedPageSize, this.selectedPageSize);
  }
  openMVOSearch() {
    const dialogRef = this.dialog.open(MVOSurveySearchComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "selectedMVOs" : this.selectedMVOs},
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result != undefined)
      {
        this.selectedMVOs = result;
        this.QueueSearchForm.controls.MVONames.setValue(this.selectedMVOs.map(item => item.TextValue));
      }
    })
  }


  openMultiSelectDates(event: any) {
    let today = new Date();
    var fromDate = new Date();

    if (event?.value === 'Custom') {
      this.isDatePickerDisabled = false;
    }
    else if (event?.value !== '') {
      this.isDatePickerDisabled = true;
      this.QueueSearchForm.controls.ToDate.setValue(this._formatterService.FormateDateToString(today.toString(), 'yyyy-MM-dd'));
      this.maxToDate = today;
      if (event?.value === 'All') {
        fromDate.setDate(fromDate.getDate() - 30);
        this.QueueSearchForm.controls.FromDate.setValue(this._formatterService.FormateDateToString(fromDate.toString(), 'yyyy-MM-dd'));
      }
      else if (event?.value === 'Today') {
        this.QueueSearchForm.controls.FromDate.setValue(this._formatterService.FormateDateToString(today.toString(), 'yyyy-MM-dd'));
      }
      else if (event?.value === 'Week') {
        fromDate.setDate(fromDate.getDate() - 7);
        this.QueueSearchForm.controls.FromDate.setValue(this._formatterService.FormateDateToString(fromDate.toString(), 'yyyy-MM-dd'));
      }
      else if (event?.value === 'Month') {
        fromDate.setDate(fromDate.getDate() - 30);
        this.QueueSearchForm.controls.FromDate.setValue(this._formatterService.FormateDateToString(fromDate.toString(), 'yyyy-MM-dd'));
      }
    }
    else {
      this.isDatePickerDisabled = true;
      this.QueueSearchForm.controls.ToDate.setValue(this._formatterService.FormateDateToString(today.toString(), 'yyyy-MM-dd'));
      this.QueueSearchForm.controls.FromDate.setValue(this._formatterService.FormateDateToString(today.toString(), 'yyyy-MM-dd'));
    }
  }

  SaveAndUpdatePRPL(workQueueParams: IPRPLInfo, isCancel: boolean) {
    let assetParams = {} as IProposalInfoParm;
    this._ProposalService.ReadProposalInfo(workQueueParams).pipe(takeUntil(this.subscription$)).subscribe(response => {
      if (response.ResultSet != null) {
        response.ResultSet.STATUSCDE = workQueueParams.STATUSCDE;
        response.ResultSet.CANCELLATIONCOMMENT = workQueueParams.CANCELLATIONCOMMENT;
        response.ResultSet.ISAPPLICATIONREJECTED = false;
        response.ResultSet.RowState = DataRowState.Updated;
        response.ResultSet.STATUSCHANGEBY = this._storageService.GetUserInfo().UserId;;
        this._ProposalService.SaveProposalInfo(response.ResultSet).pipe(takeUntil(this.subscription$)).subscribe(response => {
          this.getProposalQueueData(0);
        })
        assetParams.ProposalId = workQueueParams.PROPOSALID;
        this._ProposalService.ReadProposalAssets(assetParams).pipe(takeUntil(this.subscription$)).subscribe(assetResult => {
          if (assetResult != null && assetResult.ResultSet.length > 0) {
            let assetInfoParm = {} as IAssetInfoParams;
            let resultSet = assetResult.ResultSet[0];
            if (response.ResultSet.FINANCETYP == FinanceType.OperatingLease && resultSet.ASSETSELECTIONCDE == AssetSelection.Inventory) {
              assetInfoParm.AssetID = resultSet.PREVASSETID;
              assetInfoParm.ContractID = resultSet.CONTRACTID;
              assetInfoParm.RegisterID = resultSet.REGISTERID;
              assetInfoParm.RevisionID = resultSet.REVISIONID;
              if (resultSet != null)
                this._ProposalService.UpdateAssetRegisterStatus(assetInfoParm).pipe(takeUntil(this.subscription$)).subscribe();
            }
          }
        })
      }

    });
  }

  ProposalQueueOutput(event: any) {
    switch (event.Mode) {
      case QueueOperation.EDIT.toString(): {

        if (event.Proposal.FINANCETYP != FinanceType.OperatingLease) {
          if (event.Proposal.EAPPROVALIND) {
            if (this.isEApprovalGroupUser() == false) {
              this._msgService.showMesssage("EApprovalNotAllowedToEdit", MessageType.Warning);
              return;
            }
          }
        }

        this._formModeService.FormMode = FormMode.EDIT;
        this._router.navigateByUrl('/Proposal/createProposal', { state: { Proposal: event.Proposal, QueueOperation: QueueOperation.EDIT } });
        this.headerTitleService.setTitle("Proposal");
        break;
      }
      case QueueOperation.SUBMITFORAPPROVAL: {
        if (event.Proposal.FINANCETYP != FinanceType.OperatingLease) {
          if (event.Proposal.EAPPROVALIND == false) {
            this._msgService.showMesssage('EApprovalSubmit', MessageType.Warning);
            return;
          } else if (event.Proposal.EAPPROVALIND == true) {
            if (this.isEApprovalGroupUser() == false) {
              this._msgService.showMesssage('EApprovalNotAllowedToEdit', MessageType.Warning);
              return;
            }
          }
        }
        this._formModeService.FormMode = FormMode.SUBMIT;
        this._router.navigateByUrl('/Proposal/createProposal', { state: { Proposal: event.Proposal, QueueOperation: QueueOperation.SUBMITFORAPPROVAL } });
        this.headerTitleService.setTitle("Proposal");
        break;
      }
      case QueueOperation.RESUBMIT.toString(): {

        if (event.Proposal.FINANCETYP != FinanceType.OperatingLease) {
          if (event.Proposal.EAPPROVALIND == false) {
            this._msgService.showMesssage('EApprovalSubmit', MessageType.Warning);
            return;
          } else if (event.Proposal.EAPPROVALIND == true) {
            if (this.isEApprovalGroupUser() == false) {
              this._msgService.showMesssage('EApprovalNotAllowedToEdit', MessageType.Warning);
              return;
            }
          }
        }
        this._formModeService.FormMode = FormMode.RESUBMIT;
        this._router.navigateByUrl('/Proposal/createProposal', { state: { Proposal: event.Proposal, QueueOperation: QueueOperation.RESUBMIT } });
        this.headerTitleService.setTitle("Proposal");
        break;
      }
      case QueueOperation.COPY.toString(): {
        this._router.navigateByUrl('/Proposal/createProposal', { state: { Proposal: event.Proposal, QueueOperation: QueueOperation.COPY } });
        this.headerTitleService.setTitle("Proposal");
        break;
      }
      case QueueOperation.VIEW.toString(): {
        this._formModeService.FormMode = FormMode.VIEW;
        this._router.navigateByUrl('/Proposal/createProposal', { state: { Proposal: event.Proposal, QueueOperation: QueueOperation.VIEW } });
        this.headerTitleService.setTitle("Proposal");
        break;
      }
      case QueueOperation.CANCEL.toString(): {
        const dialogRef = this.dialog.open(CancelRequestComponent, {
          width: '900px',
          height: '100%',
          position: { right: '1px', top: '1px' },
          panelClass: 'cdk-overlay-pane-custom',
          disableClose: true,
          data: { "proposalId": event.Proposal.PROPOSALID },
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result != false) {
            let workQueueParams = {} as IPRPLInfo;
            workQueueParams.PROPOSALID = event.Proposal.PROPOSALID;
            workQueueParams.STATUSCDE = StatusCode.Cancelled;
            workQueueParams.CANCELLATIONCOMMENT = result.CANCELLATIONCOMMENT;
            workQueueParams.ISAPPLICATIONREJECTED = false;
            workQueueParams.REASONCODE = result.REASONCODE;
            this._ProposalService.ReadAndSavePRPL(workQueueParams).pipe(takeUntil(this.subscription$)).subscribe(result => {

              this.getProposalQueueData(0, this.selectedPageSize);

            });
          }

        });
        break;
      }
      case QueueOperation.REJECT.toString(): {
        // console.log(event.Mode);
        const dialogRef = this.dialog.open(DeclineRequestComponent, {
          width: '900px',
          height: '100%',
          position: { right: '1px', top: '1px' },
          panelClass: 'cdk-overlay-pane-custom',
          disableClose: true,
          data: { "proposalId": event.Proposal.PROPOSALID, "readOnly": false },
        });

        dialogRef.afterClosed().subscribe(result => {

          if (result?.isCancelReject != false) {
            let workQueueParams = {} as IPRPLInfo;
            let proposalParams = {} as IProposalInfoParm;
            proposalParams.ProposalId = event.Proposal.PROPOSALID;
            workQueueParams.PROPOSALID = event.Proposal.PROPOSALID;
            workQueueParams.STATUSCDE = StatusCode.Cancelled;
            workQueueParams.CANCELLATIONCOMMENT = result.declineform.CANCELLATIONCOMMENT;
            workQueueParams.ISAPPLICATIONREJECTED = true;
            workQueueParams.REASONCODE = result.declineform.REASONCODE;
            workQueueParams.OVRDIND = result.declineform.OVRDIND;
            workQueueParams.OVRDRJTDBY = result.declineform.OVRDRJTDBY;
            workQueueParams.ISREJECTED = true;
            this._ProposalService.isBPExistForBadCustomer(proposalParams).pipe(takeUntil(this.subscription$)).subscribe(badCustResult => {
              if (badCustResult.ResultSet != null && badCustResult.ResultSet.NEWDATAIND) {
                var dialog = this._customDialog.openDialog("Confirmation", "Do you want to mark this Business Partner as Bad Customer.?", false, "Yes", "No");
                dialog.afterClosed().subscribe(result => {
                  if (result === "ok") {
                    let info = {} as IBLAKLISTHTRYInfo;
                    info.BUSINESSPARTNERID = badCustResult.ResultSet.BUSINESSPARTNERID;
                    info.STATUSCDE = StatusCode.Rejected;
                    info.REASONCDE = ReasonCode.RejectedBadCustomer;
                    info.MODULECDE = ModuleCode.Proposal;
                    info.MODULEID = proposalParams.ProposalId;
                    info.CONTRACTID = null;
                    info.BLACKLISTEDDTE = this._storageService.GetUserInfo()?.ProcessingDate;
                    this._ProposalService.SaveBPBlackListHistory(info).pipe(takeUntil(this.subscription$)).subscribe();
                    this._ProposalService.ReadAndSavePRPL(workQueueParams).pipe(takeUntil(this.subscription$)).subscribe(
                      result => {
                        this.getProposalQueueData(0, this.selectedPageSize);
                      }
                    );
                  }
                  else {
                    this._ProposalService.ReadAndSavePRPL(workQueueParams).pipe(takeUntil(this.subscription$)).subscribe();
                    this.getProposalQueueData(0);
                    this._msgService.showMesssage("msgBadCustomerNotPerformed", MessageType.Error);
                  }

                });
              }
              else {
                this._ProposalService.ReadAndSavePRPL(workQueueParams).pipe(takeUntil(this.subscription$)).subscribe();
                this._msgService.showMesssage("msgBadCustomerNotFound", MessageType.Error);
              }
            })
          }

        });
        break;
      }
      case QueueOperation.VISIT.toString(): {
        var request = new mPOSMasterDataRequest()
        request.masterDataOperation = MasterData.FieldInvestigator;
        request.DATAS.companyId = this._storageService.GetUserInfo()?.CompanyId;
        request.DATAS.branchId = event.Proposal.BPCOMPANYBRANCHID;

        forkJoin([
          this._masterDataService.GetMasterData(request),
          this._fieldVistFeedbackMasterDataService.getmasterDataForFieldVisit()
        ]).subscribe((response: any) => {
          this._fieldVistFeedbackMasterDataService.InitializeMasterDataForFieldVisit(response[1]);
          const dialogRef = this.dialog.open(FieldVisitComponent, {
            width: '900px',
            height: '100%',
            position: { right: '1px', top: '1px' },
            panelClass: ['cdk-overlay-pane-custom', 'field-visit-dialog'],
            disableClose: true,
            data: { "proposa": event.Proposal, "FieldInvestigator": response[0].ResultSet?.DataCollection },
          });
        })




        break;
      }
      case QueueOperation.EAPPROVAL.toString(): {
        console.log(event)
        const dialogRef = this.dialog.open(EApprovalComponent, {
          width: '900px',
          height: '100%',
          position: { right: '1px', top: '1px' },
          panelClass: 'cdk-overlay-pane-custom',
          disableClose: true,
          data: { "proposalID": event.Proposal.PROPOSALID },
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result.isEApproved) {
            this.getProposalQueueData(0, this.selectedPageSize);
          }
        })

        break;
      }
      case QueueOperation.DOCUMENT.toString(): {
        const dialogRef = this.dialog.open(DocumentTrackingComponent, {
          width: '900px',
          height: '100%',
          position: { right: '1px', top: '1px' },
          panelClass: 'cdk-overlay-pane-custom',
          disableClose: true,
          data: { "proposalId": event.Proposal.PROPOSALID, "statuscde": event.Proposal.STATUSCDE },
        });


        break;
      }
      case QueueOperation.POINTSCORE.toString(): {
        const dialogRef = this.dialog.open(PointScoreComponent, {
          width: '900px',
          height: '100%',
          position: { right: '1px', top: '1px' },
          panelClass: 'cdk-overlay-pane-custom',
          disableClose: true,
          data: { "proposal": event.Proposal },
        });


        break;
      }
      case QueueOperation.OVPSTATIONERY.toString(): {
        let proposalParams = {} as IProposalInfoParm;
        proposalParams.ProposalId = event.Proposal.PROPOSALID;
        this._stationeryService.GenerateOVPStationery(proposalParams).subscribe((response) => {
          if (response && response.ResultSet !== undefined && response.ResultSet !== null) {
            this._PDFViewerService.GeneratePDFDocument(response.ResultSet);
          }
          else {
            this._toastr.warning("Some error occured while generating stationery");
          }
        });
        break;
      }
      case QueueOperation.RESCOURING.toString(): {
        if (event.Proposal.APPLICANTTYP == "Individual") {
          var customDialog = this._customDialog.openDialog("Confirmation", this._appConfig.Messages["msgRescoringConfirm"]?.Message, false, "Yes", "No");
          customDialog.afterClosed().subscribe(
            result => {
              if (result === "ok") {
                var msg;
                this.ProposalQueueParams.ProposalId = event.Proposal.PROPOSALID;
                this.ProposalQueueParams.FinanceType = event.Proposal.FINANCETYP;
                this._prplService.PerformPointScoring(this.ProposalQueueParams).pipe(takeUntil(this.subscription$))
                  .subscribe(res => {
                    if (res.CODE === Number(ReturnCode.Exception.Code))
                      this._msgService.showMesssage("msgRescoringError", MessageType.Error);
                    else if (res.CODE === Number(ReturnCode.ValidationFailed.Code))
                      this._msgService.showMesssage("msgRescoringDraft", MessageType.Error);
                    else if (res.CODE === Number(ReturnCode.Success.Code))
                      this._msgService.showMesssage("msgRescoringSuccess", MessageType.Success);
                    else
                      this._msgService.showMesssage("msgRescoringError", MessageType.Error);
                  })
                return true;
              }
              return false;
            }
          );
        } else {
          this._toastr.warning("Rescoring can only be performed against Draft Applications and Individual Applicants.");
        }
        break;
      }
      case QueueOperation.CHANGEREQUEST.toString(): {
        const dialogRef = this.dialog.open(ChangeRequestComponent, {
          width: '900px',
          height: '100%',
          position: { right: '1px', top: '1px' },
          panelClass: 'cdk-overlay-pane-custom',
          disableClose: true,
          data: { "proposal": event.Proposal },
        });

        break;
      }
      case QueueOperation.PRINT.toString(): {
        const dialogRef = this.dialog.open(PrintStationery, {
          width: '900px',
          height: '100%',
          position: { right: '1px', top: '1px' },
          panelClass: 'cdk-overlay-pane-custom',
          disableClose: true,
          data: { "proposal": event.Proposal },
        });



        break;
      }
      case QueueOperation.WITHDRAWREQUEST.toString(): {
        const dialogRef = this.dialog.open(WithdrawRequestComponent, {
          width: '900px',
          height: '100%',
          position: { right: '1px', top: '1px' },
          panelClass: 'cdk-overlay-pane-custom',
          disableClose: true,
          data: { "proposal": event.Proposal },
        });


        break;
      }

      case QueueOperation.ReSurvey.toString(): {
        const dialogRef = this.dialog.open(MposSurveyComponent, {
          width: '900px',
          height: '100%',
          position: { right: '1px', top: '1px' },
          panelClass: 'cdk-overlay-pane-custom',
          disableClose: true,
          data: { "proposalId": event.Proposal.PROPOSALID },
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.getProposalQueueData(0, this.selectedPageSize);
          }
        });

        break;
      }

      case QueueOperation.CancelRejectComments.toString(): {

        const dialogRef = this.dialog.open(DeclineRequestComponent, {
          width: '900px',
          height: '100%',
          position: { right: '1px', top: '1px' },
          panelClass: 'cdk-overlay-pane-custom',
          disableClose: true,
          data: { "proposalId": event.Proposal.PROPOSALID, "readOnly": true },
        }
        );
        dialogRef.afterClosed().subscribe(result => {
          if (result.isCancelReject) {
            this.getProposalQueueData(0, this.selectedPageSize);
          }
        });
        break;
      }

      case QueueOperation.Forward.toString(): {

        if (this.IsSupervisorLogin() == false) {
          this._msgService.showMesssage("forwardTakeControlNotAllowed", MessageType.Warning);
          return;
        }
        else {
          this._ProposalService.CustomReadTeamHierarchy().pipe(takeUntil(this.subscription$)).subscribe((response: any) => {
            if ((this._storageService.GetUserInfo().UserId == event.Proposal.ASSNTO || response.filter((x: any) => x.TMUSERID == event.Proposal.ASSNTO && x.USERGROUPNAMETM == event.Proposal.ASSNTONAME).length > 0) || event.Proposal.ASSNTO === 0) {
              //if true
              const dialogRef = this.dialog.open(ForwardRequestComponent, {
                width: '900px',
                height: '100%',
                position: { right: '1px', top: '1px' },
                panelClass: 'cdk-overlay-pane-custom',
                disableClose: true,
                data: { "proposalId": event.Proposal.PROPOSALID, "assignTo": event.Proposal.ASSNTO },
              });

              dialogRef.afterClosed().subscribe(result => {
                if (result != undefined) {
                  let param = {} as IProposalInfoParm;
                  param.ApplicantId = event.Proposal.PROPOSALID;
                  param.AssnTo = Number(result.User);
                  param.FwrdComment = result.COMMENTS;
                  this._ProposalService.UpdateApplicationAssignTo(param).pipe(takeUntil(this.subscription$)).subscribe(response => {
                    if (response != null && response.ResultSet) {
                      let params = {} as IProposalInfoParm;
                      params.ProposalId = event.Proposal.PROPOSALID;
                      params.AssgineeUserId = Number(result.User);
                      params.StatusCode = StatusCode.Draft
                      params.Action = ProposalHistoryAction.GetDescriptionStringValue(ProposalHistoryAction.Forward);
                      this._ProposalService.SaveProposalHistory(params).pipe(takeUntil(this.subscription$)).subscribe(res => {
                        if (res.CODE == 1 && res.ResultSet != null) {
                          this._msgService.showMesssage("ChangesSavedSuccessfully", MessageType.Success);
                          //this.dialogRef.close();
                          this.getProposalQueueData(0, this.selectedPageSize);
                        }
                        else {
                          this._msgService.showMesssage("msgChngReqException", MessageType.Error);
                        }
                      })
                    }
                  });
                }
              });
            }
            else {
              this._msgService.showMesssage("forwardTakeControlNotAllowed", MessageType.Warning);
              return;
            }
          });
        }
        break;
      }

      case QueueOperation.TakeControl.toString(): {

        if (this.IsSupervisorLogin() == false) {
          this._msgService.showMesssage("forwardTakeControlNotAllowed", MessageType.Error);
          return;
        }
        else if (this._storageService.GetUserInfo().UserId == event.Proposal.ASSNTO) {
          this._msgService.showMesssage("msgAlreadyAssign", MessageType.Error);
          return;
        }
        else {
          this._ProposalService.CustomReadTeamHierarchy().pipe(takeUntil(this.subscription$)).subscribe((response: any) => {
            if ((response.filter((x: any) => x.TMUSERID == event.Proposal.ASSNTO && x.USERGROUPNAMETM == event.Proposal.ASSNTONAME).length <= 0) && event.Proposal.ASSNTO !== 0) {
              this._msgService.showMesssage("forwardTakeControlNotAllowed", MessageType.Error);
              return;
            }
            else {
              var dialog = this._customDialog.openDialog("Confirmation", "Are you sure you want to take control.?", false, "Yes", "No");
              dialog.afterClosed().subscribe(result => {
                if (result === "ok") {
                  this.UpdateApplicationAssign(event.Proposal.PROPOSALID, ProposalHistoryAction.GetDescriptionStringValue(ProposalHistoryAction.TakeControl), this._storageService.GetUserInfo().UserId);
                }
              })
            }
          });
        }

        break;
      }

      case QueueOperation.ForwardtoBM.toString(): {
        if (!event.Proposal.EAPPROVALIND && this.isEApprovalGroupUser() == true && event.Proposal.CONTREVISIONIND) {
          var dialog = this._customDialog.openDialog("Confirmation", "Are you sure you want to forward to BM.?", false, "Yes", "No");
          dialog.afterClosed().subscribe(result => {
            if (result === "ok") {
              let param = {} as IProposalInfoParm;
              param.BranchID = event.Proposal.BPCOMPANYBRANCHID
              this._ProposalService.ReadBMUserByBranchId(param).pipe(takeUntil(this.subscription$)).subscribe(response => {
                if (response != null && response.ResultSet > 0) {
                  this.UpdateApplicationAssign(event.Proposal.PROPOSALID, ProposalHistoryAction.GetDescriptionStringValue(ProposalHistoryAction.ForwardToBM), response.ResultSet);
                }
                else {
                  this._msgService.showMesssage("BMNotFound", MessageType.Error);
                }
              });
            }
          })
        }
        else {
          this._msgService.showCustomMesssage("Operation not allowed", MessageType.Error);
          return;
        }
        break;
      }

      case QueueOperation.CaRecommendation.toString(): {

        const dialogRef = this.dialog.open(CaRecommendationComponent, {
          width: '900px',
          height: '100%',
          position: { right: '1px', top: '1px' },
          panelClass: 'cdk-overlay-pane-custom',
          disableClose: true,
          data: { "proposal": event.Proposal, "readOnly": true },
        }
        );
        dialogRef.afterClosed().subscribe(result => {
          if (result.isCARecommended) {
            this.getProposalQueueData(0, this.selectedPageSize);
          }
        });
        break;
      }

      default: {
        break;
      }
    }
  }


  openMenu() {
    this.classApplied = !this.classApplied;
    this.classApplied1 = !this.classApplied;
  }

  applyFilter() {
    //let trimmedValue = this.QueueSearchForm.controls.SearchText.value.trim().toLocaleLowerCase();
  }

  getProposalQueueData(from: number = 0, to: number = 10) {
    this.resizeResetGrid = false;
    if (this.QueueSearchForm.controls.FromDate.valid && this.QueueSearchForm.controls.ToDate.valid) {
      this.ProposalQueueParams.proposalNumber = this._formatterService.ConvertEmptyStringToNull(this.QueueSearchForm.controls.ApplicationNumber.value);
      this.ProposalQueueParams.ApplicantName = this._formatterService.ConvertEmptyStringToNull(this.QueueSearchForm.controls.ApplicantName.value);
      this.ProposalQueueParams.StatusCode = this._formatterService.ConvertEmptyStringToNull(this.QueueSearchForm.controls.STATUS.value);
      if (this.QueueSearchForm.controls.INTRODUCER.value == "")
        this.ProposalQueueParams.IntroducerID = 0;
      else
        this.ProposalQueueParams.IntroducerID = this._formatterService.ConvertEmptyStringToNumber(this.QueueSearchForm.controls.INTRODUCER.value);
      this.ProposalQueueParams.ApplicantType = this._formatterService.ConvertEmptyStringToNull(this.QueueSearchForm.controls.APPLICANTTYPE.value);
      this.ProposalQueueParams.FinancialProductID = +this.QueueSearchForm.controls.FINANCIALCAMPAIGN.value;
      this.ProposalQueueParams.FPGroupID = +this.QueueSearchForm.controls.FINANCIALCAMPAIGNGROUP.value;
      this.ProposalQueueParams.IsFromMPOS = this.QueueSearchForm.controls.CONSENTTOSHARE.value;
      this.ProposalQueueParams.ToDate = this.QueueSearchForm.controls.ToDate.value;
      this.ProposalQueueParams.FromDate = this.QueueSearchForm.controls.FromDate.value;
      this.ProposalQueueParams.fromRecord = from;
      this.ProposalQueueParams.toRecord = to;
      this.ProposalQueueParams.USERID = this._formatterService.ConvertEmptyStringToNumber(this.QueueSearchForm.controls.USERID.value);
      this.ProposalQueueParams.LoadBalancerEnabled = true;
      this.ProposalQueueParams.DealerAssociationCode = this._storageService.GetUserInfo().DealerAssociationCode;
      this.ProposalQueueParams.EApprovalInd = this.QueueSearchForm.controls.EApproval.value !== '' ? Boolean(JSON.parse(this.QueueSearchForm.controls.EApproval.value)) : false;
      this.ProposalQueueParams.MVOUsersList = this.selectedMVOs.map(item => item.code);

      if (this.QueueSearchForm.controls.EApproval.value == '') {
        this._toastr.warning("Please select E-Approval value");
        return;
      }

      this._ProposalService.ReadProposalQueue(this.ProposalQueueParams).pipe(takeUntil(this.subscription$))
        .subscribe(res => {
          if (res?.ResultSet?.length === 0) {
            this.resizeResetGrid = true;
            this.ProposalQueueDataset = this._formBuilder.array<IPRPLQUInfo>([]);
            this.dataSourcelength = 0;
            this._toastr.info("No results found!");
            return;
          }
          if (res?.ResultSet?.length > 0) {
            this.totalRows = res.ResultSet[0].TOTALROWS;
          }

          for (var i = 0; i < res?.ResultSet?.length; i++) {
            if (res.ResultSet[i].CONTREVISIONIND == true) {
              res.ResultSet[i].CONTREVISIONINDDESC = "Revised";
            }
            else {
              res.ResultSet[i].CONTREVISIONINDDESC = "Not Revised";
            }

          }
          for (var i = 0; i < res?.ResultSet?.length; i++) {
            if (res.ResultSet[i].CRDTRCMDTYPCDE === '00001') {
              res.ResultSet[i].CRDTRCMDTYPEDSC = "No";
            }
            else if (res.ResultSet[i].CRDTRCMDTYPCDE === '00002') {
              res.ResultSet[i].CRDTRCMDTYPEDSC = "Yes";
            }
            else if (res.ResultSet[i].CRDTRCMDTYPCDE === '00003') {
              res.ResultSet[i].CRDTRCMDTYPEDSC = "Cancel";
            }
            else if (res.ResultSet[i].CRDTRCMDTYPCDE === '00004') {
              res.ResultSet[i].CRDTRCMDTYPEDSC = "Mvo not recommend";
            }
            else{
              res.ResultSet[i].CRDTRCMDTYPEDSC = "";
            }
          }
          res.ResultSet.forEach((element: any) => {
            element.COLOR = null

          });
          this.ProposalQueueResultSet = res.ResultSet as Array<IPRPLQUInfo>;
          this.ProposalQueueResultSet.map(p => p.isBold = !p.READIND);

          if (this.resetGridPage) {
            this.paginator?.firstPage();
            this.resetGridPage = false;
          }

          this.ProposalQueueDataset = this._formBuilder.array(this.ProposalQueueResultSet.map(r => this._formBuilder.group(r)));
          this.dataSourcelength = this.ProposalQueueDataset?.value[0]?.TOTALROWS;

          if (this.ProposalQueueDataset.length > 0) {
            for (var i = 0; i < this.ProposalQueueDataset.length; i++) {
              for (var j = 0; j < this.tempData?.length; j++) {
                if (this.ProposalQueueDataset.controls[i].value.REQUESTSTATUSDSC == this.tempData[j].status) {
                  this.ProposalQueueDataset.controls[i].controls.COLOR?.setValue(this.tempData[j].color);
                }
              }
            }
          }

          if (res.CODE != 1) {
            this._toastr.error(res.MESSAGE)
          }

          this.resizeResetGrid = true;

        });
    }
    else {
      this.resizeResetGrid = true;
      this._msgService.showMesssage("FromDateLessThanToDate");
      return;
    }

  }

  applyFilterCustom(filter: string) {
    this.resetGridPage = true;
    this.selectedStatus = filter;
    this.resetSearchForm(false);
    this.getProposalQueueData(0, this.selectedPageSize);
  }

  btnSearch() {
    // if(this.QueueSearchForm.controls.FromDate.valid && this.QueueSearchForm.controls.ToDate.valid){

    // this.resizeResetGrid = false;
    this.resetGridPage = true;
    this.selectedPageSize = 10;
    this.getProposalQueueData(0, this.selectedPageSize);
  }
  // else{
  //   this._msgService.showMesssage("FromDateLessThanToDate");
  //   return;
  //   }
  // }

  btnCreateApplication() {
    this._router.navigateByUrl('/Proposal/createProposal');
    this.headerTitleService.setTitle("Proposal");
  }

  btnReset() {
    this.QueueSearchForm.reset();
    this.QueueSearchForm.controls.CONSENTTOSHARE.setValue(false);
    this.QueueSearchForm.controls.INTRODUCER.setValue(0);
    this.selectedMVOs =  [];
    this.SetDefaultFilterCriteria();
  }

  changeColumnSelection() {
    this.applyFilter();
  }

  resetSearchForm(resetDates: boolean = true) {
    this.QueueSearchForm.reset();
    if (resetDates) {
      // Set To Date
      var toDate = new Date();
      toDate.setDate(toDate.getDate());
      this.QueueSearchForm.controls.ToDate.setValue(toDate);

      // Set From Date
      var fromDate = new Date();
      fromDate.setDate(fromDate.getDate());
      this.QueueSearchForm.controls.FromDate.setValue(fromDate);
    }
  }

  stopPropagation(event: any) {
    event.stopPropagation();
  }

  SelectedUserChanged(event: any) {
    // this.resizeResetGrid = false;
    this.getProposalQueueData(0, this.selectedPageSize);
  }

  isEApprovalGroupUser(): boolean {
    if (this._storageService.GetWorkflowUser().USERGROUPASSOCIATION.filter((x: any) => this.appConfig.EApprovalGroups.includes(x.USERGRUPCDE)).length > 0) {
      return true;
    }
    else {
      return false;
    }
  }

  IsSupervisorLogin(): boolean {
    if (this._storageService.GetWorkflowUser().USERGROUPASSOCIATION.filter((x: any) => this.appConfig.SupervisorGroup.includes(x.USERGRUPCDE)).length > 0) {
      return true;
    }
    else {
      return false;
    }
  }

  IsWRQUUserDD_DisabledGroupLogin(): boolean {
    if (this._storageService.GetWorkflowUser().USERGROUPASSOCIATION.filter((x: any) => this.appConfig.WRQUUserDD_DisabledGroup.includes(x.USERGRUPCDE)).length > 0) {
      return true;
    }
    else {
      return false;
    }
  }

  IsRight_ToForward(userid: number, name: string): boolean {
    if (this._storageService.GetUserInfo().UserId == userid || this._storageService.GetWorkflowUser().USERTEAMHIERARCHY.filter((x: any) => x.TMUSERID == userid && x.USERGROUPNAMETM == name).length > 0) {
      return true;
    }
    else {
      return false;
    }
  }
  resetFilter() {

  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }

  UpdateApplicationAssign(proposalId: number, action: string, assignUserId: number) {
    let param = {} as IProposalInfoParm;
    param.ApplicantId = proposalId;
    param.AssnTo = this._storageService.GetUserInfo().UserId;
    param.FwrdComment = "";
    this._ProposalService.UpdateApplicationAssignTo(param).pipe(takeUntil(this.subscription$)).subscribe(response => {
      if (response != null && response.ResultSet) {
        let params = {} as IProposalInfoParm;
        params.ProposalId = proposalId;
        params.AssgineeUserId = assignUserId;
        params.StatusCode = StatusCode.Draft
        params.Action = action;
        this._ProposalService.SaveProposalHistory(params).pipe(takeUntil(this.subscription$)).subscribe(res => {
          if (res.CODE == 1 && res.ResultSet != null) {
            this._msgService.showMesssage("ChangesSavedSuccessfully", MessageType.Success);
            this.getProposalQueueData(0, this.selectedPageSize);
          }
          else {
            //this._msgService.showMesssage("msgChngReqException", MessageType.Error);
          }
        })
      }
    })

  }

}
