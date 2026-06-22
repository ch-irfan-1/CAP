import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { IPRPL_CRDT_RCMDInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/IPRPL_CRDT_RCMDInfo.model';
import { IPRPL_EAPPR_INFRInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalEApprovalEntity/IPRPL_EAPPR_INFRInfo.model';
import { IPRPL_HTRYInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalEApprovalEntity/IPRPL_HTRYInfo.model';
import { ProposalEApprovalEntity } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalEApprovalEntity/ProposalEApprovalEntity.model';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { ReturnCode } from '@NFS_Enums/ReturnCode.enum';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { Control, FormArray, FormBuilder, FormGroup } from 'src/Library';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModuleCode } from '@NFS_Enums/ModuleCode.enum';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { IPRPL_SCRE_CARD_MAINInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IPRPL_SCRE_CARD_MAINInfo.model';
import { IContextMenu } from '@NFS_Interfaces/OtherInterfaces/IContextMenu.interface';
import { IPRPLInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/IPRPLInfo.model';
import { APPL_CNCL_DATAInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/APPL_CNCL_DATAInfo.model';
import { ProposalDTSService } from '@NFS_Core/NFSServices/ProposalDTS/proposal-dts.service';
import { IPRPL_LCTN_HTRY } from '@NFS_Entity/ProposalDTS-Entity/IPRPL_LCTN_HTRY.model';
import { ToastrService } from 'ngx-toastr';
import { IPRPL_RSVY_DRTN_TRCK } from '@NFS_Entity/ProposalDTS-Entity/IPRPL_RSVY_DRTN_TRCK';
import { FinancialRow, IPRPL_INCM_ANLS } from '@NFS_Entity/ProposalDTS-Entity/IPRPL_INCM_ANLS.model';
import { MatTableDataSource } from '@angular/material/table';
import { IPRPL_DVTN_TRCK } from '@NFS_Entity/ProposalDTS-Entity/IPRPL_DVTN_TRCK.model';
@Component({
    selector: 'e-approval',
    templateUrl: './eapproval.component.html',
    styleUrls: ['./eapproval.component.css'],
    standalone: false
})
export class EApprovalComponent implements OnInit, OnDestroy {
  public eagerScoreEntity = this._formBuilder.array<IPRPL_SCRE_CARD_MAINInfo>([]);
  exposure!: number;
  params = {} as IProposalInfoParm;
  private subscription$ = new Subject();
  EApprovalHistory = [] as Array<IPRPL_EAPPR_INFRInfo>;
  sortedCAHistory: any;
  EApprovalInfo = {} as IPRPL_EAPPR_INFRInfo;
  proposalEApprovalEntity = {} as ProposalEApprovalEntity;
  PRPL_LCTN_HTRY_req = {} as IPRPL_LCTN_HTRY;
  param = {} as IProposalInfoParm;
  displayedColumnsIncm: string[] = ['label', 'value'];
  dataSource = new MatTableDataSource<FinancialRow>();
  panelOpenState = false;
  public columnsDocInfo = ['CONTACTADDRESS', 'ADDRESSLATITUDE', 'ADDRESSLONGITUDE', 'IMAGELATITUDE','IMAGELONGITUDE', 'CREATIONDTE', 'HAVERSINEDISTANCE', 'COMMENTS'];
  public LabelsDocInfo = ['Contact Address', 'Lat','Long', 'Img Lat','Img Lng', 'Date', 'Distance', 'Remarks'];
  public LabelsResurveyInfo = ['MVO Assign Date', 'E-Signature Date', 'Submit to CAP', 'Survey Duration', 'MVO Submit Duration', 'Resurvey Duration', 'No. of Resurveys'];
  public columnsResurveyInfo = ['MVOASNDTE','ESIGNDTE', 'SBMTTOCAPDTE','SRVYDRTN', 'MVOSBMTDRTN', 'RSVYDRTN', 'NOOFRSVY'];
  public EnableTooltip = [true, false, false, false, false, false, false, true];
  isControlDisable = false;
  displayedColumns: string[] = ['position', 'name', 'weight'];
  proposalId: number = 0;
  displayedColumnsCA: string[] = ['Recommendation', 'RecommendedBy', 'RecommedationTime', 'Rejection'];
  eaglePointScoreColl: IPRPL_SCRE_CARD_MAINInfo[] = [];
  displayedColumnsPointScore = ['Point Score Model Name', 'Risk Rank', 'Scoring Date', 'Scoring Time'];
  public LabelsDeviationInfo = ['Deviation Summary', 'Deviation Comments']
  public columnsDeviationInfo  = ['DeviationSummary', 'DeviationComment'];
  CARecAllHistory = [] as Array<IPRPL_CRDT_RCMDInfo>;
  public eapprovalReasonArray !: INFSDropDownData[];
  public overrideReasonArray : INFSDropDownData[] = [];
  CancelHistoryColumns = ['No', 'Application No', 'System', 'Category', 'Cancel/Reject Date', 'Cancel/Reject Reason', 'Cancel/Reject Comments'];
  CancelHistory = [] as Array<APPL_CNCL_DATAInfo>;
  cHistory = {} as ProposalEApprovalEntity;
  sortedEApprovalHistory: any;
  public historyInfoDocs = this._formBuilder.array<FormGroup>([]);
  public overrideByArray !: INFSDropDownData[];
  public ResurveyDurationInfo: FormArray<IPRPL_RSVY_DRTN_TRCK> = this._formBuilder.array<IPRPL_RSVY_DRTN_TRCK>([]);
  public DvtnTrckInformation: FormArray<IPRPL_DVTN_TRCK> = this._formBuilder.array<IPRPL_DVTN_TRCK>([]);
    private rowDefinitions: FinancialRow[] = [
    { label: 'Monthly Income (Customer + Spouse)', value: 0, fieldKey: 'MNTHINCM', isPercentage: false },
    { label: 'Monthly Expense',                    value: 0, fieldKey: 'MNTHEXPN', isPercentage: false },
    { label: 'Installment Amount',                 value: 0, fieldKey: 'MNTHRNTL', isPercentage: false },
    { label: 'Remaining Income',                   value: 0, fieldKey: 'RMNGINCM', isPercentage: false },
    { label: 'Average Credit Mutation (3 Months)', value: 0, fieldKey: 'AVGSVNG', isPercentage: false  },
    { label: 'Average Other Revenues (3 Months)',  value: 0, fieldKey: 'AVGRVNU', isPercentage: false  },
    { label: 'Profit Percentage (%)',              value: 0, fieldKey: 'PRFTPCT', isPercentage: true  }
  ];
  eApprovalReasonForm: FormGroup = this._formBuilder.group({
    EAPPROVALREASON: '',
    OVRDRESN: '',
    OVRDIND: false,
    OVRDBY: ''
  });

  constructor(
    private _prplService: ProposalService,
    private _storageService: ClientStoreService,
    private _messageService: MessageService,
    public dialogRef: MatDialogRef<EApprovalComponent>,
    @Inject(MAT_DIALOG_DATA) Param: any,
    // public dialogRef: MatDialogRef,
    private _formBuilder: FormBuilder,
    public _proposalDTSService: ProposalDTSService, private toastr: ToastrService  ) {
    this.param.ProposalId = Param.proposalID;
    this.proposalId = Param.proposalID;
  }

  ngOnInit(): void {
    //service call
    console.log(this.param.ProposalId);
    this._prplService.ReadProposalEApprovalEntity(this.param).pipe(takeUntil(this.subscription$)).subscribe(res => {
      console.log(res.ResultSet);
      this.proposalEApprovalEntity = res.ResultSet;
      this.ReadDeviationTracking(this.proposalEApprovalEntity.PRPLDVTNTRCK);
      this.ReadIncomeAnalysisDetail(this.proposalEApprovalEntity.PRPLINCMANLS);
      this.ReadResurveyDurationHistory(this.proposalEApprovalEntity.PRPLRSVYDRTNTRCK);
      this.ReadGeoLocationHistory(this.proposalEApprovalEntity.PRPLLCTNHTRY);
      if (!this._storageService.GetUserInfo().IsOTO) {
        res.ResultSet.PROPOSALDTSHEADER.RDP = 0
      }
      this.sortedCAHistory = this.proposalEApprovalEntity.PRPLCREDITRECOMMENDATION.sort((a, b) =>
        new Date(b.RECOMMENDATIONTIME ?? 0).getTime() -
        new Date(a.RECOMMENDATIONTIME ?? 0).getTime()
      ).filter(x =>x.ISRCMDVALID == true)[0];
      this.sortedEApprovalHistory = this.proposalEApprovalEntity.PROPOSALEAPPROVAL.sort((a, b) =>
        new Date(b.COMPLTDTE ?? 0).getTime() -
        new Date(a.COMPLTDTE ?? 0).getTime()
      )[0];
      if (this.proposalEApprovalEntity.PROPOSALEAPPROVAL != null) {
        if (this.proposalEApprovalEntity.PROPOSAL.EAPPROVALIND || this.proposalEApprovalEntity.PROPOSAL.STATUSCDE == '00033' || this.proposalEApprovalEntity.PROPOSAL.STATUSCDE == '00164') {
          this.isControlDisable = true;
          if (this.proposalEApprovalEntity.PROPOSALEAPPROVAL.length > 0) {
            this.EApprovalInfo = this.proposalEApprovalEntity.PROPOSALEAPPROVAL.sort((a, b) => 0 - (a.COMPLTDTE > b.COMPLTDTE ? 1 : -1))[0];//sort descending
            this.eApprovalReasonForm.controls.EAPPROVALREASON.setValue(this.EApprovalInfo.EAPPROVALREASON);
            this.EApprovalHistory = this.proposalEApprovalEntity.PROPOSALEAPPROVAL.sort((a, b) => 0 - (a.COMPLTDTE > b.COMPLTDTE ? 1 : -1)).filter(p => p.PRPLEAPPRINFRID != this.EApprovalInfo.PRPLEAPPRINFRID)
          }
        }
        else {
          this.isControlDisable = false;
          this.EApprovalHistory = this.proposalEApprovalEntity.PROPOSALEAPPROVAL.sort((a, b) => 0 - (a.COMPLTDTE > b.COMPLTDTE ? 1 : -1));
        }
      }
      if (
        this.sortedCAHistory !== null &&
        this.sortedCAHistory?.CRDTRCMDTYPCDE == '00001' && !this.proposalEApprovalEntity.PROPOSAL.EAPPROVALIND
      ) {
        this.eApprovalReasonForm.controls.OVRDIND.setValue(true);
      } else if (this.proposalEApprovalEntity.PROPOSAL.EAPPROVALIND) {
        this.eApprovalReasonForm.patchValue({
          OVRDRESN: this.sortedEApprovalHistory?.OVRDRESN,
          OVRDIND: this.sortedEApprovalHistory?.OVRDIND,
          OVRDBY: this.sortedEApprovalHistory?.OVRDBY,
        });
      } else {
        this.eApprovalReasonForm.patchValue({
          OVRDRESN: '',
          OVRDIND: false,
          OVRDBY: '',
        });
      }

      if (this.proposalEApprovalEntity.PRPLCREDITRECOMMENDATION.length != 0) {
        this.CARecAllHistory = this.proposalEApprovalEntity.PRPLCREDITRECOMMENDATION;
      }
      if(this.proposalEApprovalEntity.APPLCNCLDATA !=null && this.proposalEApprovalEntity.APPLCNCLDATA.length > 0){
        this.CancelHistory = this.proposalEApprovalEntity.APPLCNCLDATA;
        if(this.CancelHistory !=null && this.CancelHistory.length > 0){
          this.CancelHistory = this.CancelHistory.sort((a, b) => {
            return new Date(b.CANCELDATE).getTime() - new Date(a.CANCELDATE).getTime();
          });
        }

      }
        if(this.proposalEApprovalEntity.PRPLSCRECARDMAIN !=null){
          this.eaglePointScoreColl = this.proposalEApprovalEntity.PRPLSCRECARDMAIN;
          if (this.eaglePointScoreColl && this.eaglePointScoreColl.length > 0) {
            this.eaglePointScoreColl.forEach(info => {
              var d = new Date(info.EXECUTIONDTE);
              info.CODE = "" + d.getUTCHours().toLocaleString('en-US', { minimumIntegerDigits: 2 }) +
                ":" + d.getUTCMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2 }) +
                ":" + d.getUTCSeconds().toLocaleString('en-US', { minimumIntegerDigits: 2 });
              this.eagerScoreEntity.push(this._formBuilder.group<IPRPL_SCRE_CARD_MAINInfo>(info))
            });
          }
        }


    });
    let param = {} as IProposalInfoParm;
    let overrideParam = {} as IProposalInfoParm;
    param.ModuleType = ModuleCode.EApprovalReason;
    this._prplService.ReadEApprovalReasonByModule(param).pipe(takeUntil(this.subscription$)).subscribe(res => {
      this.eapprovalReasonArray = res.ResultSet.map((p: any) => ({ code: p.REASONCDE, TextValue: p.REASONDSC }));
    })

    overrideParam.ModuleType = ModuleCode.OverrideReason;
    this._prplService.ReadEApprovalReasonByModule(overrideParam).pipe(takeUntil(this.subscription$)).subscribe(res => {
      this.overrideReasonArray = res.ResultSet.map((p: any) => ({ code: p.REASONCDE, TextValue: p.REASONDSC }));
    })
    this._prplService.ReadOverrideByUser().subscribe((response) =>{
      this.overrideByArray = response.ResultSet.map((p:any) => ({code: p.OVRDBYCDE, TextValue: p.OVRDBYDSC}));
    })

  }

  Validations() {
    //   this.dialogRef.close();
  }
  ReadIncomeAnalysisDetail(data: any): void {
    this.dataSource.data = this.rowDefinitions.map((row) => ({ ...row }));
    if (data !== null && data.length > 0) {
    const dbRecord: IPRPL_INCM_ANLS = data[0];
    this.dataSource.data = this.rowDefinitions.map((row) => ({
      ...row,
      value: dbRecord[row.fieldKey] ?? 0,
    }));
    this.dataSource.data;
    }
  }
  ReadResurveyDurationHistory(data: any) {
    if (data !== null) {
      const formattedData = data.map((x: any) => {
        return this._formBuilder.group({
          MVOASNDTE: [this.formatDateTime(x.MVOASNDTE, 'dd-MM-yyyy HH:mm')],
          ESIGNDTE: [this.formatDateTime(x.ESIGNDTE, 'dd-MM-yyyy HH:mm')],
          SBMTTOCAPDTE: [
            this.formatDateTime(x.SBMTTOCAPDTE, 'dd-MM-yyyy HH:mm'),
          ],
          SRVYDRTN: [x.SRVYDRTN],
          MVOSBMTDRTN: [x.MVOSBMTDRTN],
          RSVYDRTN: [x.RSVYDRTN],
          NOOFRSVY: [x.NOOFRSVY],
          PROPOSALID: [x.PROPOSALID],
        });
      });

      this.ResurveyDurationInfo.clear();
      formattedData.forEach((group: FormGroup) =>
        this.ResurveyDurationInfo.push(group),
      );
    }
  }

  ReadGeoLocationHistory(data: any) {
    if (data !== null) {
      const formArrayData = data.map((item: any) => {
        const rawDistance = item.HAVERSINEDISTANCE;
        const formattedDistance =
          rawDistance < 1
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
          COMMENTS: [item.COMMENTS],
        });
      });

      this.historyInfoDocs.clear();
      formArrayData.forEach((group: FormGroup) =>
        this.historyInfoDocs.push(group),
      );
    }
  }
  ReadDeviationTracking(data: any) {
    if (data !== null && data.length > 0) {
      const formattedData = data.map((x: any) => {
        return this._formBuilder.group({
          DeviationSummary: [x.DVTNSMRY],
          DeviationComment: [x.DVTNCMNT]
        });
      });

      this.DvtnTrckInformation.clear();
      formattedData.forEach((group: FormGroup) => this.DvtnTrckInformation.push(group));
    }
  }

  SaveEApproval() {
    if (!this.EApprovalInfo.COMPLTIND) {
      this._messageService.showMesssage("EApprovalMarkComplete", MessageType.Warning);
      return;
    }
    if (!this.eApprovalReasonForm.controls.EAPPROVALREASON.value) {
      this._messageService.showMesssage("selectEApprovalReason", MessageType.Warning);
      return;
    }
    if (!this.EApprovalInfo.COMMENT) {
      this._messageService.showMesssage("EnterEApprovalComments", MessageType.Warning);
      return;
    }
    if ((this.eApprovalReasonForm.controls.OVRDBY.value == "") && this.eApprovalReasonForm.controls.OVRDIND.value && !this.proposalEApprovalEntity.PROPOSAL.EAPPROVALIND && this.proposalEApprovalEntity.PROPOSAL.STATUSCDE == '00001') {
      this.toastr.warning("Please select Override By to proceed");
      return;
    }
    if ((this.eApprovalReasonForm.controls.OVRDRESN.value == "") && this.eApprovalReasonForm.controls.OVRDIND.value && !this.proposalEApprovalEntity.PROPOSAL.EAPPROVALIND && this.proposalEApprovalEntity.PROPOSAL.STATUSCDE == '00001') {
      this.toastr.warning("Please select Override Reason to proceed");
      return;
    }

    this.EApprovalInfo.USERNAME = this._storageService.GetUserInfo()?.UserName;
    this.EApprovalInfo.USERID = this._storageService.GetUserInfo()?.UserId;
    this.EApprovalInfo.EAPPROVALREASON = this.eApprovalReasonForm.controls.EAPPROVALREASON.value;
    this.EApprovalInfo.OVRDBY = this.eApprovalReasonForm.controls.OVRDBY.value;
    this.EApprovalInfo.OVRDIND = this.eApprovalReasonForm.controls.OVRDIND.value;
    this.EApprovalInfo.OVRDRESN = this.eApprovalReasonForm.controls.OVRDRESN.value;
    this.EApprovalInfo.PROPOSALID = this.proposalEApprovalEntity.PROPOSAL.PROPOSALID;
    this.EApprovalInfo.COMPLTDTE = new Date(Date.now());
    this.EApprovalInfo.RowState = DataRowState.Added;
    this.proposalEApprovalEntity.PROPOSAL.EAPPROVALIND = true;
    this.proposalEApprovalEntity.PROPOSAL.READIND = false;
    this.proposalEApprovalEntity.PROPOSALEAPPROVAL.push(this.EApprovalInfo);
    this.proposalEApprovalEntity.RowState = DataRowState.Updated;
    this.proposalEApprovalEntity.PROPOSALHTRY = this.ProposalHistory(this.proposalEApprovalEntity.PROPOSAL);

    this._prplService.SaveProposalEApprovalEntity(this.proposalEApprovalEntity).pipe(takeUntil(this.subscription$)).subscribe(res => {
      if (res.CODE == ReturnCode.Success.Code && res.ResultSet != null) {
        this.isControlDisable = true;
        this.proposalEApprovalEntity = res.ResultSet;
        this.dialogRef.close({ isEApproved: true });
      }
      else {
        this._messageService.showMesssage("ReSurveyConflictDetected", MessageType.Error);
      }
    })
  }
  ProposalHistory(proposal: any): any {
    var prpl = {} as IPRPL_HTRYInfo;
    prpl.PROPOSALID = proposal.PROPOSALID;
    prpl.TRANSDTE = new Date(Date.now()) as Control<Date>;
    prpl.ACTIONBYUSERID = this._storageService.GetUserInfo()?.UserId;
    prpl.ASSIGNEEUSERID = 0;
    prpl.ACTION = "Approval Given By BM";
    prpl.STATUSCDE = proposal.STATUSCDE;
    return prpl;
  }

  GetCustomerExposure() {
    var prplInfo = {} as IProposalInfoParm;
    prplInfo.ProposalId = this.proposalEApprovalEntity.PROPOSAL.PROPOSALID;
    this._prplService.ReadCustomerExposure(prplInfo).pipe(takeUntil(this.subscription$)).subscribe(res => {
      console.log(res.ResultSet);
      this.exposure = res.ResultSet;
    })

  }

  formatDate(date: Date | string | undefined, format: string = 'dd-MM-yyyy'): string | null {
    if (date != 'null')
      return new DatePipe('en-US').transform(date, format);
    else
      return null
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

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }

  formatCurrency(currency: string): string | null {
        if (currency != 'null')
            return new CurrencyPipe('en-US').transform(currency,'', '', '1.0-2');
        else
            return null
    }

}
