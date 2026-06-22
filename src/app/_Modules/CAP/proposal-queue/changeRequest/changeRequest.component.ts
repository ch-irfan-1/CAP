import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { ReturnCode } from '@NFS_Enums/ReturnCode.enum';
import { StatusCode } from '@NFS_Enums/StatusCode.enum';
import { IPRPLQUInfo } from '@NFS_Interfaces/OtherInterfaces/IPRPLQUInfo';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { FormBuilder, FormGroup } from 'src/Library';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
    selector: 'app-change-request',
    templateUrl: './changeRequest.component.html',
    standalone: false
})

export class ChangeRequestComponent implements OnInit, OnDestroy {

    private subscription$ = new Subject();
    _prplq!: IPRPLQUInfo;
    _isChangeRequestAllowed: boolean = true;
    ChangeRequestForm: FormGroup = this._formBuilder.group({
        CHANGEREQUESTCOMMENT: ''
    })
    constructor(private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<ChangeRequestComponent>, private _msgService: MessageService, @Inject(MAT_DIALOG_DATA) Param: any, private _prplService: ProposalService) {
        this._prplq = Param.proposal;
    }
    ngOnInit(): void {
        let param = {} as IProposalInfoParm;
        param.ProposalId = this._prplq.PROPOSALID;
        //service call CheckWithdrawlAndChangeRequestStatus
        this._prplService.CheckWithdrawlAndChangeRequestStatus(param).pipe(takeUntil(this.subscription$)).subscribe(res => {
            if (res.CODE.toString() === ReturnCode.WithdrawlRequestAlreadySubmitted.Code || res.CODE.toString() === ReturnCode.ChangeRequestAlreadySubmitted.Code) {
                this._isChangeRequestAllowed = false;
                this.ChangeRequestForm.controls.CHANGEREQUESTCOMMENT.setValue(res.ResultSet.LegalStatusCde);
                if (res.CODE.toString() === ReturnCode.ChangeRequestAlreadySubmitted.Code) {
                    this._msgService.showMesssage("ChangeRequestAlreadySubmitted", MessageType.Info);
                }
                else {
                    this._msgService.showMesssage("WithdrawlRequestAlreadySubmitted", MessageType.Info);
                }
            }
        })
    }

    ChangeRequest() {
        if (!this.ChangeRequestForm.controls.CHANGEREQUESTCOMMENT.value) {
            this._msgService.showMesssage("EnterIntroducerCommments", MessageType.Warning);
            return;
        }
        if (this._prplq.STATUSCDE !== StatusCode.New) {
            this._msgService.showMesssage("ChangeRequestnotSubmitStatusNew", MessageType.Info);
            return;
        }
        if (this._prplq.STATUSCDE === StatusCode.New && this._isChangeRequestAllowed) {
            //service SubmitChangeRequest
            this._prplq.FWRDCOMMENT = this.ChangeRequestForm.value.CHANGEREQUESTCOMMENT;
            this._prplService.SubmitChangeRequest(this._prplq).pipe(takeUntil(this.subscription$)).subscribe(res => {
                if (res.CODE.toString() === ReturnCode.Success.Code)
                    this._msgService.showMesssage("ChangeRequestSubmitSuccess", MessageType.Success);
                else if (res.CODE.toString() === ReturnCode.Exception.Code)
                    this._msgService.showMesssage("ChangeRequestAlreadySubmitted", MessageType.Info);
                else if (res.CODE.toString() === ReturnCode.ValidationFailed.Code)
                    this._msgService.showMesssage("ChangeRequestnotSubmitStatusNew", MessageType.Info);
                else
                    this._msgService.showMesssage("ChangeRequestAlreadySubmitted", MessageType.Info);
            })
        }
        this.dialogRef.close(this.ChangeRequestForm.value);
    }

    cancel() {
        this.dialogRef.close(false);
    }

    ngOnDestroy(): void {
        this.subscription$.next(true);
        this.subscription$.complete();
    }
}
