import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { StatusCode } from '@NFS_Enums/StatusCode.enum';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { FormBuilder } from 'src/Library';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { ModuleCode } from '@NFS_Enums/ModuleCode.enum';

@Component({
    selector: 'app-mpos-survey',
    templateUrl: './mpos-survey.component.html',
    styleUrls: ['./mpos-survey.component.css'],
    standalone: false
})
export class MposSurveyComponent implements OnInit, OnDestroy {

  MposSurveyForm = this._formBuilder.group({
    SurveyCOMMENT: '',
    ResurveyReason: ''
  });
  proposalId: number = 0;
  params = {} as IProposalInfoParm;
  pattern: string = "[^a-zA-Z0-9., ]";

  private subscription$ = new Subject();
  public resurveyReasonArray !: INFSDropDownData[];
  constructor(private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<MposSurveyComponent>, private _msgService: MessageService,
    @Inject(MAT_DIALOG_DATA) Param: any, private _ProposalService: ProposalService, private _storageService: ClientStoreService) {
    this.proposalId = Param.proposalId;
  }
  ngOnInit(): void {
    this.valueChangeSubscriptions();
    let param = {} as IProposalInfoParm;
    param.ModuleType = ModuleCode.mPOSResurvey;
    this._ProposalService.ReadEApprovalReasonByModule(param).subscribe((res: any) =>{
      this.resurveyReasonArray = res.ResultSet.map((p: any) => ({ code: p.REASONCDE, TextValue: p.REASONDSC }));
    })
  }

  btnSubmit_Click() {
    let params = {} as IProposalInfoParm;
    params.ProposalId = this.proposalId;
    this._ProposalService.ReadProposalBasicInfo(params).subscribe(result => {
      if (result.CODE == 1 && result.ResultSet != null) {
        if (result.ResultSet.MPOSAPPLICATIONNBR == null) {
          this._msgService.showCustomMesssage("Re Survey only allowed for application created from mpos", MessageType.Info);
          return;
        }
        if (result.ResultSet.STATUSCDE == StatusCode.Draft) {
          if (/\r|\n/.exec(this.MposSurveyForm.controls.SurveyCOMMENT.value))
            this.MposSurveyForm.controls.SurveyCOMMENT.setValue(this.MposSurveyForm.controls.SurveyCOMMENT.value.replace("\r", " "));
          const resurveyReason = this.resurveyReasonArray.find(x => x.code == this.MposSurveyForm.controls.ResurveyReason.value);
          if (this.MposSurveyForm.controls.SurveyCOMMENT.value == "" || this.MposSurveyForm.controls.SurveyCOMMENT.value == null) {
            result.ResultSet.COMMENTS = resurveyReason?.code + ' | ' + resurveyReason?.TextValue;
          }
          else {
            let comment = resurveyReason?.code + ' | ' + resurveyReason?.TextValue + ' | ' + this.MposSurveyForm.controls.SurveyCOMMENT.value;
            result.ResultSet.COMMENTS = comment.substring(0, 255)
          }
          result.ResultSet.STATUSCDE = StatusCode.Resurvey;
          result.ResultSet.RowState = DataRowState.Updated;
          // result.ResultSet.ISAPPLICATIONREJECTED = false;
          result.ResultSet.STATUSCHANGEBY = this._storageService.GetUserInfo()?.UserId;
          // result.ResultSet.REASONCODE = null;
          // result.ResultSet.ISREJECTED = false;

          this._ProposalService.SaveProposalInfo(result.ResultSet).pipe(takeUntil(this.subscription$)).subscribe(response => {
            if (response.CODE == 1) {
              this._msgService.showMesssage("ReSurveySuccessful", MessageType.Info);
              this.dialogRef.close(true);
            }
          })
        }
        else {
          //this._msgService.showMesssage("ReSurveyNotInitiated", MessageType.Info);
          this._msgService.showCustomMesssage("Status is invalid for operation", MessageType.Info);
        }
      }

    })
  }

  btnCancel_Click() {
    this.dialogRef.close(false);
  }
  valueChangeSubscriptions() {
    this.MposSurveyForm.controls.ResurveyReason.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(val => {
      if (val != "" && val !== null) {
        if (!this.MposSurveyForm.controls.ResurveyReason.valid) {
          this._msgService.showMesssage("IncoResuvery", MessageType.Warning);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }


}
