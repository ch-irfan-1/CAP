import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { ReturnCode } from '@NFS_Enums/ReturnCode.enum';
import { IPRPLQUInfo } from '@NFS_Interfaces/OtherInterfaces/IPRPLQUInfo';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { FormBuilder, FormGroup } from 'src/Library';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
    selector: 'app-withdraw-request',
    templateUrl: './withdraw-request.component.html',
    styleUrls: ['./withdraw-request.component.css'],
    standalone: false
})

export class WithdrawRequestComponent implements OnInit, OnDestroy {

    private subscription$ = new Subject();
    _prplq!: IPRPLQUInfo;
    _isWithdrawRequestAllowed: boolean = true;
    WithdrawRequestForm: FormGroup = this._formBuilder.group({
        WITHDRAWREQUESTCOMMENT: ''
    })
    constructor(private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<WithdrawRequestComponent>, private _msgService: MessageService, @Inject(MAT_DIALOG_DATA) Param: any, private _prplService: ProposalService) {
        this._prplq = Param.proposal;
    }
    ngOnInit(): void {
        let param = {} as IProposalInfoParm;
        param.ProposalId = this._prplq.PROPOSALID;
        this._prplService.CheckWithdrawlAndChangeRequestStatus(param).pipe(takeUntil(this.subscription$)).subscribe(res => {
            if (res.CODE.toString() === ReturnCode.WithdrawlRequestAlreadySubmitted.Code || res.CODE.toString() === ReturnCode.ChangeRequestAlreadySubmitted.Code) {
                this._isWithdrawRequestAllowed = false;
                this.WithdrawRequestForm.controls.WITHDRAWREQUESTCOMMENT.setValue(res.ResultSet.LegalStatusCde);
                if (res.CODE.toString() === ReturnCode.ChangeRequestAlreadySubmitted.Code) {
                    this._msgService.showMesssage("ChangeRequestAlreadySubmitted", MessageType.Info);
                }
                else {
                    this._msgService.showMesssage("WithdrawlRequestAlreadySubmitted", MessageType.Info);
                }
            }
        })
    }


    WithdrawRequest() {
        if (!this.WithdrawRequestForm.controls.WITHDRAWREQUESTCOMMENT.value) {
            this._msgService.showMesssage("EnterWithdrawnReason", MessageType.Warning);
            return;
        }
        this._prplq.FWRDCOMMENT = this.WithdrawRequestForm.value.WITHDRAWREQUESTCOMMENT;
        this._prplService.SubmitWithdrawRequest(this._prplq).pipe(takeUntil(this.subscription$)).subscribe(res => {
            if (res.CODE.toString() === ReturnCode.Success.Code)
                this._msgService.showMesssage("WithdrawlRequestSubmitSuccess", MessageType.Success);
            else if (res.CODE.toString() === ReturnCode.Exception.Code)
                this._msgService.showMesssage("ExcpOccrsubmitingreq", MessageType.Info);
            else
                this._msgService.showMesssage("WithdrawRequestAlreadySubmitted", MessageType.Info);
        })
        this.dialogRef.close(this.WithdrawRequestForm.value);
    }

    cancel() {
        this.dialogRef.close(false);
    }

    ngOnDestroy(): void {
        this.subscription$.next(true);
        this.subscription$.complete();
    }
}
