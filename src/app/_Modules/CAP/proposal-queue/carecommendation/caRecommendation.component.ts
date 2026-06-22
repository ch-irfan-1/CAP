import { incomeExpanseComponent } from './../../Proposal/Applicants/income-expanse/income-expanse.component';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { IPRPLInfo } from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import { IPRPL_CRDT_RCMDInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/IPRPL_CRDT_RCMDInfo.model';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { ModuleCode } from '@NFS_Enums/ModuleCode.enum';
import { ReturnCode } from '@NFS_Enums/ReturnCode.enum';
import { StatusCode } from '@NFS_Enums/StatusCode.enum';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { Control, FormArray, FormBuilder, FormControl, FormGroup } from 'src/Library';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';
import { ProposalEApprovalEntity } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalEApprovalEntity/ProposalEApprovalEntity.model';
import { APPL_CNCL_DATAInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/APPL_CNCL_DATAInfo.model';
import { ProposalDTSService } from '@NFS_Core/NFSServices/ProposalDTS/proposal-dts.service';
import * as ProposalDTSEntity from '@NFS_Entity/ProposalDTS-Entity/IProposalDTSEntity.model.index';
import { ProposalDTSMapperService } from '@NFS_Modules/CAP/CAPServices/ProposalDTS/proposal-dts-mapper.service';
import { ProposalDTSEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalDTS/ProposalDTSEntityForm.service';
import { ProposalDTSDataService } from '@NFS_Modules/CAP/CAPServices/ProposalDTS/proposal-dts-data.service';
import { IPRPL_LCTN_HTRY } from '@NFS_Entity/ProposalDTS-Entity/IPRPL_LCTN_HTRY.model';
import { ToastrService } from 'ngx-toastr';
import { IPRPL_RSVY_DRTN_TRCK } from '@NFS_Entity/ProposalDTS-Entity/IPRPL_RSVY_DRTN_TRCK';
import { FinancialRow, IPRPL_INCM_ANLS } from '@NFS_Entity/ProposalDTS-Entity/IPRPL_INCM_ANLS.model';
import { MatTableDataSource } from '@angular/material/table';
import { IPRPL_DVTN_TRCK } from '@NFS_Entity/ProposalDTS-Entity/IPRPL_DVTN_TRCK.model';
@Component({
    selector: 'app-carecommendation',
    templateUrl: './caRecommendation.component.html',
    styleUrls: ["./caRecommendation.component.css"],
    standalone: false
})

export class CaRecommendationComponent implements OnInit, OnDestroy {
  proposal = {} as IPRPLInfo;
  isControlDisable = false;
  isRecommended = false;
  proposalData: any;
  proposalId: number = 0;
  // isRecmnd = '';
  params = {} as IProposalInfoParm;
  CACrdtRcmdInfo = {} as IPRPL_CRDT_RCMDInfo;
  CACrdtRcmdHistory = [] as Array<IPRPL_CRDT_RCMDInfo>;
  displayedColumnsIncm: string[] = ['label', 'value'];
  dataSource = new MatTableDataSource<FinancialRow>();
  private subscription$ = new Subject();
  public rejectionReasonArray !: INFSDropDownData[];

  public columnsDocInfo = ['CONTACTADDRESS', 'ADDRESSLATITUDE', 'ADDRESSLONGITUDE', 'IMAGELATITUDE','IMAGELONGITUDE', 'CREATIONDTE', 'HAVERSINEDISTANCE', 'COMMENTS'];
  public LabelsDocInfo = ['Contact Address', 'Lat','Long', 'Img Lat','Img Lng', 'Date', 'Distance', 'Remarks'];
  public LabelsResurveyInfo = ['MVO Assign Date', 'E-Signature Date', 'Submit to CAP', 'Survey Duration', 'MVO Submit Duration', 'Resurvey Duration', 'No. of Resurveys'];
  public columnsResurveyInfo = ['MVOASNDTE','ESIGNDTE', 'SBMTTOCAPDTE','SRVYDRTN', 'MVOSBMTDRTN', 'RSVYDRTN', 'NOOFRSVY'];
  public LabelsDeviationInfo = ['Deviation Summary', 'Deviation Comments']
  public columnsDeviationInfo  = ['DeviationSummary', 'DeviationComment'];
  public DvtnTrckInformation: FormArray<IPRPL_DVTN_TRCK> = this._formBuilder.array<IPRPL_DVTN_TRCK>([]);
  EnableTooltip = [true, false, false, false, false, false, false, true];
  // public cancellationReasonArray !: INFSDropDownData[];
  public carecommendationdrop !: INFSDropDownData[];
  mcomTopupInd: boolean = false;
  recommendationLabel = "";
  public historyInfoDocs = this._formBuilder.array<FormGroup>([]);
  PRPL_LCTN_HTRY_req = {} as IPRPL_LCTN_HTRY;
  CaRecommendationForm: FormGroup = this._formBuilder.group({
    COMMENT: '',
    USERNAME: '',
    RJTNRESNCDE: '',
    CRDTRCMDTYPCDE: '',
    CRDTRCMDIND:null,
    CRDTRCMDTYPEDSC: '',
    //CRDTRCMDTYPCDE:null,
  });
  RecommendationStatusList:Array<any>=[
    {id: 0,
      code: "false",
      TextValue: "No",
    },
    {id: 1,
      code: "true",
      TextValue: "Yes",
    },
  ];
    private rowDefinitions: FinancialRow[] = [
    { label: 'Monthly Income (Customer + Spouse)', value: 0, fieldKey: 'MNTHINCM', isPercentage: false },
    { label: 'Monthly Expense',                    value: 0, fieldKey: 'MNTHEXPN', isPercentage: false },
    { label: 'Installment Amount',                 value: 0, fieldKey: 'MNTHRNTL', isPercentage: false },
    { label: 'Remaining Income',                   value: 0, fieldKey: 'RMNGINCM', isPercentage: false },
    { label: 'Average Credit Mutation (3 Months)', value: 0, fieldKey: 'AVGSVNG', isPercentage: false  },
    { label: 'Average Other Revenues (3 Months)',  value: 0, fieldKey: 'AVGRVNU', isPercentage: false  },
    { label: 'Profit Percentage (%)',              value: 0, fieldKey: 'PRFTPCT', isPercentage: true  }
  ];
  displayedColumns: string[] = ['Recommendation', 'RecommendedBy', 'RecommedationTime', 'Rejection', 'Comment'];
  CancelHistoryColumns = ['No', 'Application No', 'System', 'Category', 'Cancel/Reject Date', 'Cancel/Reject Reason', 'Cancel/Reject Comments'];
  CancelHistory = [] as Array<APPL_CNCL_DATAInfo>;
  public ResurveyDurationInfo: FormArray<IPRPL_RSVY_DRTN_TRCK> = this._formBuilder.array<IPRPL_RSVY_DRTN_TRCK>([]);



  constructor(@Inject(MAT_DIALOG_DATA) Param: any, public dialogRef: MatDialogRef<CaRecommendationComponent>,
    private _ProposalService: ProposalService, private _formBuilder: FormBuilder, private _msgService: MessageService, private _storageService: ClientStoreService, private appConfig: AppConfigService,
    public _proposalDTSService: ProposalDTSService,
    private _prplDTSMapper: ProposalDTSMapperService,
    private _ProposalDTSForm: ProposalDTSEntityFormService,
    private _prplDTSdata: ProposalDTSDataService,
    private dialog: MatDialog, private toastr: ToastrService) {
    this.proposal = Param.proposal;
    this.proposalData = Param.proposal;
  }

  ngOnInit(): void {
    let params = {} as IProposalInfoParm;
    params.ProposalId = this.proposal.PROPOSALID;
    this.proposalId = this.proposal.PROPOSALID;
    let param = {} as IProposalInfoParm;
    param.ModuleType = ModuleCode.ApplicationReject;
    this._ProposalService.ReadRecommendationHistory(params).pipe(takeUntil(this.subscription$)).subscribe(result => {
      this.CACrdtRcmdHistory =  result.ResultSet;

    })
    this._ProposalService.ReadCancelledRejectecedApplications(params).pipe(takeUntil(this.subscription$)).subscribe(result => {
      this.CancelHistory =  result.ResultSet;
      if( this.CancelHistory!=null && this.CancelHistory.length > 0){
        this.CancelHistory = this.CancelHistory.sort((a, b) => {
          return new Date(b.CANCELDATE).getTime() - new Date(a.CANCELDATE).getTime();
        });
      }
    })

    this._ProposalService.ReadRecommendation().pipe(takeUntil(this.subscription$)).subscribe(res1 => {
      this.carecommendationdrop = res1.ResultSet.map((p: any) => ({ code: p.CRDTRCMDTYPECDE, TextValue: p.CRDTRCMDTYPEDSC }));
    })

    if (this.proposalData?.MCOMTOPUPIND?.trim().toLowerCase() === "yes") {
      this.mcomTopupInd = true;
    } else {
      this.mcomTopupInd = false;
    }

    this.ReadGeoLocationHistory();
    this.ReadResurveyDurationHistory(this.proposalId)
    this.ReadIncomeAnalysisDetail()
    this.ReadDeviationTrackingByProposalId()
  }

  ReadIncomeAnalysisDetail(): void {
  this.dataSource.data = this.rowDefinitions.map(row => ({ ...row }));

  let params = {} as IProposalInfoParm;
  params.ProposalId = this.proposal.PROPOSALID;

  this._ProposalService
    .ReadIncomeAnalysisDetailByProposalId(params)
    .pipe(takeUntil(this.subscription$))
    .subscribe({
      next: (result) => {
        if (!result || !result.ResultSet || result.ResultSet.length === 0) {
          console.log('No income analysis record found for ProposalId:', this.proposal.PROPOSALID);
          return;
        }

        const dbRecord: IPRPL_INCM_ANLS = result.ResultSet[0];
        if (!dbRecord) {
          console.log('dbRecord is null or undefined');
          return;
        }

        this.dataSource.data = this.rowDefinitions.map(row => ({
            ...row,
            value: dbRecord[row.fieldKey] ?? 0
          }));
        this.dataSource.data
      },
      error: (err) => {
        console.error('ReadIncomeAnalysisDetail failed:', err);
      }
    });
  }

  ReadDeviationTrackingByProposalId(): void {
    let params = {} as IProposalInfoParm;
    params.ProposalId = this.proposalId;

    this._ProposalService.ReadDeviationTrackingByProposalId(params)
      .pipe(takeUntil(this.subscription$))
      .subscribe({
        next: (result) => {
          if (!result || !result.ResultSet || result.ResultSet.length === 0) {
            console.log('No Deviation record found for ProposalId:', this.proposalId);
            return;
          }
          const formattedData = result.ResultSet.map((x: any) => {
            return this._formBuilder.group({
              DeviationSummary: [x.DVTNSMRY],
              DeviationComment: [x.DVTNCMNT]
            });
          });
          this.DvtnTrckInformation.clear();
          formattedData.forEach((group: FormGroup) => this.DvtnTrckInformation.push(group));
        },
        error: (err) => {
          console.error('ReadDeviationTracking failed:', err);
        }
      });
  }
  Validations() {
    //   this.dialogRef.close();
  }
  btnCancel_Click() {
    this.dialogRef.close({isCARecommended: false});
  }

  ReadResurveyDurationHistory(proposalId: number) {
  let params = {} as IProposalInfoParm;
  params.ProposalId = proposalId;
  this._ProposalService.ReadResurveyHistoryByProposalId(params).subscribe((response: any) => {
    if (response.ResultSet !== null) {
      const formattedData = response.ResultSet.map((x: any) => {
        return this._formBuilder.group({
          MVOASNDTE: [this.formatDateTime(x.MVOASNDTE, 'dd-MM-yyyy HH:mm')],
          ESIGNDTE: [this.formatDateTime(x.ESIGNDTE, 'dd-MM-yyyy HH:mm')],
          SBMTTOCAPDTE: [this.formatDateTime(x.SBMTTOCAPDTE, 'dd-MM-yyyy HH:mm')],
          SRVYDRTN: [x.SRVYDRTN],
          MVOSBMTDRTN: [x.MVOSBMTDRTN],
          RSVYDRTN: [x.RSVYDRTN],
          NOOFRSVY: [x.NOOFRSVY],
          PROPOSALID: [x.PROPOSALID]
        });
      });

      this.ResurveyDurationInfo.clear();
      formattedData.forEach((group: FormGroup) => this.ResurveyDurationInfo.push(group));
    }
  });
}



  ReadGeoLocationHistory() {
    this.params.ProposalId = this.proposalId
    this._proposalDTSService.getGeoCodeHistoryByProposalId(this.params).subscribe((response: any) => {
      if (response.ResultSet && response.ResultSet.length) {
        const formArrayData = response.ResultSet.map((item: any) => {
          const rawDistance = item.HAVERSINEDISTANCE;
          const formattedDistance = rawDistance < 1
            ? `${Math.round(rawDistance * 1000)} m`
            : `${rawDistance.toFixed(2)} km`;
            const formattedDate = item.CREATIONDTE
            ? item.CREATIONDTE.replace('T', ' ').replace('Z', '')
            : '';
          return this._formBuilder.group({
            CONTACTADDRESS: [item.CONTACTADDRESS],
            ADDRESSLATITUDE: [item.ADDRESSLATITUDE],
            ADDRESSLONGITUDE: [item.ADDRESSLONGITUDE],
            IMAGELATITUDE: [item.IMAGELATITUDE],
            IMAGELONGITUDE: [item.IMAGELONGITUDE],
            CREATIONDTE: [formattedDate],
            HAVERSINEDISTANCE: [formattedDistance],
            COMMENTS: [item.COMMENTS]
          });
        });
        this.historyInfoDocs.clear();
        formArrayData.forEach((group: FormGroup) => this.historyInfoDocs.push(group));
      }
    });
  }

  btnSave_Click() {

    let param = {} as IProposalInfoParm;
    param.ProposalId = this.proposal.PROPOSALID;
    this._ProposalService.ReadProposalBasicInfo(param).pipe(takeUntil(this.subscription$)).subscribe(res => {
     if(this.isCaRecommendationGroupUser()== false)
    {
      this._msgService.showMesssage("CANotApprovalGroup",MessageType.Warning)
      return;
    }
    if(res.ResultSet != null && (res.ResultSet.EAPPROVALIND == true || res.ResultSet.STATUSCDE != StatusCode.Draft))
    {
      this._msgService.showMesssage("CASaveValidation", MessageType.Error);
      return;
    }
    if (!this.CaRecommendationForm.controls.CRDTRCMDTYPCDE.value && !this.CaRecommendationForm.controls.COMMENT.value) {
      this._msgService.showCustomMesssage("Please Select CA Recommendation", MessageType.Error);
      return;
    }
    if (this.CaRecommendationForm.controls.CRDTRCMDTYPCDE.value == "00003" && !this.CaRecommendationForm.controls.RJTNRESNCDE.value) {
      this._msgService.showCustomMesssage("Please Select Cancellation Reason", MessageType.Error);
      return;
    }
    if ((this.CaRecommendationForm.controls.CRDTRCMDTYPCDE.value == "00001" || this.CaRecommendationForm.controls.CRDTRCMDTYPCDE.value == "00004") && !this.CaRecommendationForm.controls.RJTNRESNCDE.value) {
      this._msgService.showCustomMesssage("Please Select Rejection Reason", MessageType.Error);
      return;
    }
    if (!this.CaRecommendationForm.controls.COMMENT.value) {
      this._msgService.showCustomMesssage("Comments are Required", MessageType.Error);
      return;
    }
    if (!this.CaRecommendationForm.controls.CRDTRCMDTYPCDE.value && this.CaRecommendationForm.controls.COMMENT.value) {
      this._msgService.showCustomMesssage("Please Select CA Recommendation", MessageType.Error);
      return;
    }
    this.CaRecommendationForm.controls.USERNAME.setValue(this._storageService.GetUserInfo()?.UserName);

    this.CACrdtRcmdInfo.CRDTRCMDIND = !this.CaRecommendationForm.controls.CRDTRCMDIND.value ? null : !this.isRecommended;
    this.CACrdtRcmdInfo.CRDTRCMDTYPCDE = this.CaRecommendationForm.controls.CRDTRCMDTYPCDE.value;
    this.CACrdtRcmdInfo.COMMENT = this.CaRecommendationForm.controls.COMMENT.value;
    this.CACrdtRcmdInfo.PROPOSALID = this.proposal.PROPOSALID;
    this.CACrdtRcmdInfo.RECOMMENDEDBY = this._storageService.GetUserInfo()?.UserId;
    this.CACrdtRcmdInfo.RJTNRESNCDE = this.CaRecommendationForm.controls.RJTNRESNCDE.value;
    this.CACrdtRcmdInfo.ISRCMDVALID = true;
   // this.CACrdtRcmdInfo.CRDTRCMDTYPCDE = this.CaRecommendationForm.controls.CRDTRCMDTYPECDE.value;
    this.CACrdtRcmdInfo.RowState = DataRowState.Added;
    this.CACrdtRcmdInfo.USERNAME = this._storageService.GetUserInfo()?.UserName;
    this.CACrdtRcmdInfo.RECOMMENDATIONTIME = new Date(Date.now()) as Control<Date>;
    this.CACrdtRcmdInfo.CODE = this.CACrdtRcmdInfo.RJTNRESNCDE;
    this._ProposalService.SaveCARecommendationProposal(this.CACrdtRcmdInfo).pipe(takeUntil(this.subscription$)).subscribe(res => {
      if (res.CODE == ReturnCode.Success.Code && res.ResultSet != null) {
        this._msgService.showCustomMesssage("CA Recommendation Saved Successfully!", MessageType.Success);
        this.dialogRef.close({ isCARecommended: true });
      }
      else {
        this._msgService.showCustomMesssage(res.message, MessageType.Error);
      }
    })
    })
  }
  onRecommendationChange(event : any){
    let param = {} as IProposalInfoParm;
    if(event.value === "00001" || event.value === "00004"){
      this.isRecommended = true;
      this.recommendationLabel = "Rejection Reason";
      param.ModuleType = ModuleCode.ApplicationReject;
      this.CaRecommendationForm.controls.RJTNRESNCDE.setValue("");
    }else if
      (event.value === "00002"){
        this.isRecommended = false;
      this.CaRecommendationForm.controls.RJTNRESNCDE.setValue("");
    }
    else if(event.value === "00003"){
      this.isRecommended = true;
      this.recommendationLabel = "Cancellation Reason";
      param.ModuleType = ModuleCode.ApplicationCancelation;
      this.CaRecommendationForm.controls.RJTNRESNCDE.setValue("");
    }
    if(param.ModuleType == ModuleCode.ApplicationCancelation)
    {
    this._ProposalService.ReadRejectionReasonByModule(param).pipe(takeUntil(this.subscription$)).subscribe(res => {
      this.rejectionReasonArray = res.ResultSet.map((p: any) => ({ code: p.RJTNRESNCDE, TextValue: p.RJTNRESNDSC }));
    })
  }
  if(param.ModuleType == ModuleCode.ApplicationReject)
  {
  this._ProposalService.ReadRejectionReasonByModule(param).pipe(takeUntil(this.subscription$)).subscribe(res => {
    this.rejectionReasonArray = res.ResultSet.map((p: any) => ({ code: p.RJTNRESNCDE, TextValue: p.RJTNRESNDSC }));
  })
}
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }

  isCaRecommendationGroupUser(): boolean {
    if (this._storageService.GetWorkflowUser().USERGROUPASSOCIATION.filter((x: any) => x.CRDTRCMDAPPRIND == true).length > 0 ) {
      return true;
    }
    else {
      return false;
    }
  }
  formatDateTime(date: Date | string, format: string = 'yyyy-MM-dd hh:mm'): string | null {
    if (date != 'null'){
      var activationDate=new Date(date);
      activationDate=new Date(activationDate.getUTCFullYear(),
                                      activationDate.getUTCMonth(),
                                      activationDate.getUTCDate(),
                                      activationDate.getUTCHours(),
                                      activationDate.getUTCMinutes(),
                                      activationDate.getUTCSeconds()
                                      );
      return new DatePipe('en-US').transform(activationDate, format);
    }
    else
      return null
  }

  formatCurrency(currency: string): string | null {
        if (currency != 'null')
            return new CurrencyPipe('en-US').transform(currency,'', '', '1.0-2');
        else
            return null
    }
}
