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
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'app-decline-request',
    templateUrl: './declineRequest.component.html',
    standalone: false
})
export class DeclineRequestComponent implements OnInit, OnDestroy {
  proposalId: number = 0;
  readOnly: boolean = false;
  params = {} as IProposalInfoParm;
  private subscription$ = new Subject();
  tempProposal = {} as IPRPLInfo;
  enableButton: boolean = false;
  title: string = "Reject Application's Comments";
  dropdownLable: string = 'Rejection Reason';
  commentsLable: string = 'Rejection Comments';

  DeclineRequestForm: FormGroup = this._formBuilder.group({
    CANCELLATIONCOMMENT: '',
    REASONCODE: '',
    OVRDIND: false,
    OVRDRJTDBY: ''
  });
  public rejectionReasonArray !: INFSDropDownData[];
  public overrideByArray !: INFSDropDownData[];

  constructor(@Inject(MAT_DIALOG_DATA) Param: any, private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<DeclineRequestComponent>, private _msgService: MessageService,
    private _ProposalService: ProposalService, private _toastr: ToastrService) {
    this.proposalId = Param.proposalId;
    this.readOnly = Param.readOnly;
  }
  ngOnInit(): void {
    let params = {} as IProposalInfoParm;
    params.ProposalId = this.proposalId;
    this._ProposalService.ReadProposalBasicInfo(params).pipe(takeUntil(this.subscription$)).subscribe(result => {
      //if (result.ResultSet.REASONCODE != null) {
      if (/*result.ResultSet.REASONCODE != null &&*/ result.ResultSet.STATUSCDE == StatusCode.Draft) {
        this.enableButton = true;
        let param = {} as IProposalInfoParm;
        param.ModuleType = ModuleCode.ApplicationReject;

        this._ProposalService.ReadRejectionReasonByModule(param).pipe(takeUntil(this.subscription$)).subscribe(res => {
          this.tempProposal = result.ResultSet;
          this.rejectionReasonArray = res.ResultSet.map((p: any) => ({ code: p.RJTNRESNCDE, TextValue: p.RJTNRESNDSC }));
          this.DeclineRequestForm.controls.REASONCODE.setValue(result.ResultSet.REASONCODE);
        })
      }
      else {
        let param = {} as IProposalInfoParm;
        if (!result.ResultSet.ISREJECTED) {
          this.title = "Cancelled Application's Comments";
          this.dropdownLable = 'Cancellation Reason';
          this.commentsLable = 'Cancellation Comments';
          param.ModuleType = ModuleCode.ApplicationCancelation;
        }
        else if (result.ResultSet.ISREJECTED) {
          param.ModuleType = ModuleCode.ApplicationReject;
        }
        this._ProposalService.ReadRejectionReasonByModule(param).pipe(takeUntil(this.subscription$)).subscribe(res => {
          this.tempProposal = result.ResultSet;
          this.rejectionReasonArray = res.ResultSet.map((p: any) => ({ code: p.RJTNRESNCDE, TextValue: p.RJTNRESNDSC }));
          this.DeclineRequestForm.controls.REASONCODE.setValue(result.ResultSet.REASONCODE);
          this.DeclineRequestForm.controls.CANCELLATIONCOMMENT.setValue(result.ResultSet.CANCELLATIONCOMMENT);
          this.DeclineRequestForm.controls.OVRDIND.setValue(result.ResultSet.OVRDIND);
          this.DeclineRequestForm.controls.OVRDRJTDBY.setValue(result.ResultSet.OVRDRJTDBY);

        })
        this.enableButton = false;
      }

      //}
    })
    this._ProposalService.ReadOverrideByUser().subscribe((response) =>{
      this.overrideByArray = response.ResultSet.map((p:any) => ({code: p.OVRDBYCDE, TextValue: p.OVRDBYDSC}));
    })
    this.DeclineRequestForm.controls.OVRDIND.valueChanges.subscribe(value => {
      if (!value) {
        this.DeclineRequestForm.controls.OVRDRJTDBY.setValue(null)
      }
    })
  }
  DeclineRequest() {
    if (!this.DeclineRequestForm.controls.CANCELLATIONCOMMENT.value) {
      this._msgService.showCustomMesssage("Please Enter Rejection Comments", MessageType.Error);
      return;
    }
    if (!this.DeclineRequestForm.controls.REASONCODE.value) {
      this._msgService.showCustomMesssage("Please Select Rejection Reason", MessageType.Error);
      return;
    }
    this.dialogRef.close(this.DeclineRequestForm.value);
  } btnCancel_Click() {
    this.dialogRef.close();
  }

  btnSubmit_Click() {
    if (!this.DeclineRequestForm.controls.REASONCODE.value) {
      this._msgService.showMesssage("RejectionComments", MessageType.Error);
      return;
    }
    if (!this.DeclineRequestForm.controls.CANCELLATIONCOMMENT.value) {
      this._msgService.showMesssage("RejectionComments", MessageType.Error);
      return;
    }

    if (this.DeclineRequestForm.controls.OVRDIND.value && (this.DeclineRequestForm.controls.OVRDRJTDBY.value === null || this.DeclineRequestForm.controls.OVRDRJTDBY.value === "")) {
      this._toastr.warning("Please select Override Rejected By to proceed");
      return;
    }

    // this.tempProposal.COMMENTS = this.DeclineRequestForm.controls.CANCELLATIONCOMMENT.value;
    // this.tempProposal.STATUSCDE = StatusCode.Cancelled;
    // this.tempProposal.RowState = DataRowState.Updated;
    // this.tempProposal.REQUESTSTATUSDSC = StatusCode.GetDescriptionStringValue(StatusCode.Cancelled);
    // this.tempProposal.REASONCODE = this.CancelRequestForm.controls.REASONCODE.value;

    // this._ProposalService.SaveProposalInfo(this.tempProposal.REASONCODE).pipe(takeUntil(this.subscription$)).subscribe(response => {

    // })
    this.dialogRef.close({ declineform: this.DeclineRequestForm.value, isCancelReject: true });
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }

}
