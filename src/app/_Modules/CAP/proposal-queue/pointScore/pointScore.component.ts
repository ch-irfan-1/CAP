import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { PDFViewerService } from '@NFS_Core/NFSServices/Viewer/PDFViewerService.service';
import { IPRPL_SCRE_CARD_MAINInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IPRPL_SCRE_CARD_MAINInfo.model';
import { IPSTR_MODL_MAINInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IPSTR_MODL_MAINInfo.model';
import { ISCRE_CTGY_CODEInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/ISCRE_CTGY_CODEInfo.model';
import { ScoreCodeCategory } from '@NFS_Enums/ScoreCodeCategory.enum';
import { IContextMenu } from '@NFS_Interfaces/OtherInterfaces/IContextMenu.interface';
import { IPRPLQUInfo } from '@NFS_Interfaces/OtherInterfaces/IPRPLQUInfo';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { StationeryService } from '@NFS_Modules/CAP/CAPServices/stationery.service';
import { FormBuilder, FormGroup } from 'src/Library';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
    selector: 'app-point-score',
    templateUrl: './pointScore.component.html',
    styleUrls: ['./pointScore.component.css'],
    standalone: false
})
export class PointScoreComponent implements OnInit, OnDestroy {
  pqInfo = {} as IPRPLQUInfo;
  param = {} as IProposalInfoParm;
  private subscription$ = new Subject();
  panelOpenState = false;

  public pointScoreEntity = this._formBuilder.array<IPSTR_MODL_MAINInfo>([]);
  public eagerScoreEntity = this._formBuilder.array<IPRPL_SCRE_CARD_MAINInfo>([]);

  tempData: any = [{ code: "00001", TextValue: "one 1" }, { code: "00002", TextValue: "two 2" }, { code: "00003", TextValue: "three 3" }];

  pointScoreColl: IPSTR_MODL_MAINInfo[] = [];
  scoreCatItem: ISCRE_CTGY_CODEInfo[] = [];
  eaglePointScoreColl: IPRPL_SCRE_CARD_MAINInfo[] = [];

  _prplq!: IPRPLQUInfo;
  prplEntity!: FormGroup<IPRPLQUInfo>;

  public columnsP = ['RULEMODELNME', 'EVALSCRE', 'POINTSCORECATEGORY', 'EXECUTIONDTE', 'PROPOSALNBR'];
  public columnsEP = ['SCORECARDNME', 'RISKRANK', 'EXECUTIONDTE', 'CODE'];
  public pipes = [null, null,null, 'formatDate', null];
  public pipesEP = [null, null, 'formatDate', null];
  public LabelsEP = ['Point Score Model Name', 'Risk Rank', 'Scoring Date', 'Scoring Time'];
  public LabelsP = ['Point Score Model Name', 'Score', 'Point Score Category', 'Scoring Date', 'Scoring Time'];
  public EnableTooltipEP = [true, false, false, false];
  public ContextMenu: Array<IContextMenu> = [];
  constructor(
    private _formBuilder: FormBuilder,
    // public dialogRef: MatDialogRef,
    private _ProposalForm: ProposalEntityFormService,
    private _PDFViewerService: PDFViewerService,
    private _stationeryService: StationeryService,
    @Inject(MAT_DIALOG_DATA) Param: any,
    private _toastr: ToastrService,
    public _prplService: ProposalService,
    public _prplDataService: ProposalDataService,
  ) {
    this._prplq = Param.proposal;
    this.param.ProposalId = Param.proposal.PROPOSALID;
  }

  ngOnInit(): void {

    this.prplEntity = this._formBuilder.group<IPRPLQUInfo>(this._prplq);

    this._prplService.GetPointScoreCategoryCodes().pipe(takeUntil(this.subscription$)).subscribe(res => {
      if (res && res.ResultSet && res.ResultSet.length > 0) {
        this.scoreCatItem = res.ResultSet;

      }
    })

    this._prplService.ReadPointScoreDetailCAPWrqus(this.param).pipe(takeUntil(this.subscription$)).subscribe(res => {
      if (res && res.ResultSet && res.ResultSet.length > 0) {
        this.pointScoreColl = res.ResultSet;
        if (this.pointScoreColl && this.pointScoreColl.length > 0) {
          var i = 0;
          this.pointScoreColl.forEach(info => {
            info.POINTSCORECLASSIFICATION = this.returnPointScoreClassification(info);
            var d = new Date(info.EXECUTIONDTE);
            // info.PROPOSALNBR = "" + d.getUTCHours().toLocaleString('en-US', { minimumIntegerDigits: 2 }) +
            //   ":" + d.getUTCMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2 }) +
            //   ":" + d.getUTCSeconds().toLocaleString('en-US', { minimumIntegerDigits: 2 });
            //   console.log(res.ResultSet[0].SCORINGTIME['Hours']);
            info.PROPOSALNBR = res.ResultSet[i].SCORINGTIME;//"" + res.ResultSet[i].SCORINGTIME['Hours'] + ":" + res.ResultSet[i].SCORINGTIME['Minutes'] + ":" + res.ResultSet[i].SCORINGTIME['Seconds'];
            this.pointScoreEntity.push(this._formBuilder.group<IPSTR_MODL_MAINInfo>(info));
            i++;
          });
        }
      }
    })

    this._prplService.ReadEaglePointScoreDetailCAPWrqu(this.param).pipe(takeUntil(this.subscription$)).subscribe(res => {
      if (res && res.ResultSet && res.ResultSet.length > 0) {
        this.eaglePointScoreColl = res.ResultSet;

        if (this.eaglePointScoreColl && this.eaglePointScoreColl.length > 0) {
          this.eaglePointScoreColl.forEach(info => {
            info.POINTSCORECLASSIFICATION = this.returnEaglePointScoreClassification(info);
            var d = new Date(info.EXECUTIONDTE);
            info.CODE = "" + d.getUTCHours().toLocaleString('en-US', { minimumIntegerDigits: 2 }) +
              ":" + d.getUTCMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2 }) +
              ":" + d.getUTCSeconds().toLocaleString('en-US', { minimumIntegerDigits: 2 });
            this.eagerScoreEntity.push(this._formBuilder.group<IPRPL_SCRE_CARD_MAINInfo>(info))
          });
        }
      }

    })
  }

  returnEaglePointScoreClassification(info: IPRPL_SCRE_CARD_MAINInfo): string {
    if (info.RISKCATEGORY == "00001")
      return "Low Risk";
    else if (info.RISKCATEGORY == "00002")
      return "Medium Risk";
    else if (info.RISKCATEGORY == "00003")
      return "High Risk";
    else
      return ""
  }

  returnPointScoreClassification(info: IPSTR_MODL_MAINInfo): string {
    if (info != null && this.scoreCatItem != null && this.scoreCatItem.length > 0) {
      if (info.EVALSCRE < this.scoreCatItem[0].SCRECTGYSCR)
        return ScoreCodeCategory.Low;
      else if (info.EVALSCRE > this.scoreCatItem[2].SCRECTGYSCR)
        return ScoreCodeCategory.High;
      else
        return ScoreCodeCategory.Medium;
    }
    return "";
  }

  Validations() {
    //   this.dialogRef.close();
  }

  printPointScoring() {
    let proposalParams = {} as IProposalInfoParm;
    proposalParams.ProposalId = this.param.ProposalId;
    this._stationeryService.PrintPointScore(proposalParams).subscribe((response) => {
      if (response && response.ResultSet !== undefined && response.ResultSet !== null) {
        this._PDFViewerService.GeneratePDFDocument(response.ResultSet);
      }
      else {
        this._toastr.warning("Some error occured while generating stationery");
      }
    })
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }
}
