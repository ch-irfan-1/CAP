import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { IPRPLInfo } from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { ModuleCode } from '@NFS_Enums/ModuleCode.enum';
import { StatusCode } from '@NFS_Enums/StatusCode.enum';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { FormBuilder, FormGroup } from 'src/Library';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';
@Component({
    selector: 'app-cancel-request',
    templateUrl: './cancelRequest.component.html',
    standalone: false
})
export class CancelRequestComponent implements OnInit, OnDestroy {
  proposalId: number = 0;
  params = {} as IProposalInfoParm;
  private subscription$ = new Subject();
  public cancelReasonArray !: INFSDropDownData[];
  tempProposal = {} as IPRPLInfo;
  enableButton: boolean = false;
  CancelRequestForm: FormGroup = this._formBuilder.group({
    CANCELLATIONCOMMENT: '',
    REASONCODE: ''
  });
  constructor(@Inject(MAT_DIALOG_DATA) Param: any, public dialogRef: MatDialogRef<CancelRequestComponent>,
    private _ProposalService: ProposalService, private _formBuilder: FormBuilder, private _msgService: MessageService) {
    this.proposalId = Param.proposalId;
  }

  ngOnInit(): void {
    let params = {} as IProposalInfoParm;
    params.ProposalId = this.proposalId;
    this._ProposalService.ReadProposalBasicInfo(params).pipe(takeUntil(this.subscription$)).subscribe(result => {
      //if (result.ResultSet.REASONCODE != null) {
      if (/*result.ResultSet.REASONCODE != null &&*/ result.ResultSet.STATUSCDE == StatusCode.Draft) {
        this.enableButton = true;
        let param = {} as IProposalInfoParm;
        param.ModuleType = ModuleCode.ApplicationCancelation;

        this._ProposalService.ReadRejectionReasonByModule(param).pipe(takeUntil(this.subscription$)).subscribe(res => {
          this.tempProposal = result.ResultSet;
          this.cancelReasonArray = res.ResultSet.map((p: any) => ({ code: p.RJTNRESNCDE, TextValue: p.RJTNRESNDSC }));
          this.CancelRequestForm.controls.REASONCODE.setValue(result.ResultSet.REASONCODE);
        })
      }
      else {
        this.enableButton = false;
      }

      //}
    })

  }
  Validations() {
    //   this.dialogRef.close();
  }
  btnCancel_Click() {
    this.dialogRef.close();
  }

  btnSubmit_Click() {
    if (!this.CancelRequestForm.controls.REASONCODE.value) {
      this._msgService.showMesssage("EnterCancellationReason", MessageType.Error);
      return;
    }
    if (!this.CancelRequestForm.controls.CANCELLATIONCOMMENT.value) {
      this._msgService.showMesssage("EnterCancellationReason", MessageType.Error);
      return;
    }
    this.dialogRef.close(this.CancelRequestForm.value);
    // this.dialogRef.close(this.DeclineRequestForm.value);
    // this.tempProposal.COMMENTS = this.CancelRequestForm.controls.CANCELLATIONCOMMENT.value;
    // this.tempProposal.STATUSCDE = StatusCode.Cancelled;
    // this.tempProposal.RowState = DataRowState.Updated;
    // this.tempProposal.REQUESTSTATUSDSC = StatusCode.GetDescriptionStringValue(StatusCode.Cancelled);
    // this.tempProposal.REASONCODE = this.CancelRequestForm.controls.REASONCODE.value;

    // this._ProposalService.SaveProposalInfo(this.tempProposal.REASONCODE).pipe(takeUntil(this.subscription$)).subscribe(response => {

    // })
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }
}
