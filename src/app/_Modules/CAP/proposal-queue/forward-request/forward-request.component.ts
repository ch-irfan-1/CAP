import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { FormBuilder, FormGroup } from 'src/Library';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-forward-request',
    templateUrl: './forward-request.component.html',
    styleUrls: ['./forward-request.component.css'],
    standalone: false
})
export class ForwardRequestComponent implements OnInit, OnDestroy {
  private subscription$ = new Subject();
  public userArray !: INFSDropDownData[];
  proposalId: number = 0;
  assignTo: string = '';
  ForwardRequestForm: FormGroup = this._formBuilder.group({
    COMMENTS: '',
    User: ''
  });
  constructor(public dialogRef: MatDialogRef<ForwardRequestComponent>, private _formBuilder: FormBuilder,
    private _storageService: ClientStoreService, @Inject(MAT_DIALOG_DATA) Param: any, private _msgService: MessageService,
    private _ProposalService: ProposalService) {
    this.proposalId = Param.proposalId;
    this.assignTo = Param.assignTo;
  }

  ngOnInit(): void {
    var userId: any;
    userId = this._storageService.GetUserInfo().UserId
    this._ProposalService.CustomReadTeamHierarchy().pipe(takeUntil(this.subscription$)).subscribe((response: any) => {
      this.userArray = (
        [...new Map(response.filter((x: any) => x.BPUSERID == userId).map((p: any) => [p.TMUSERID,{code: p.TMUSERID.toString(),TextValue: p.USERGROUPNAMETM} as INFSDropDownData])).values()] as INFSDropDownData[])
              .sort((a, b) => a.TextValue.localeCompare(b.TextValue));
      });
  }
  btnCancel_Click() {
    this.dialogRef.close();
  }

  btnSubmit_Click() {
    if (!this.ForwardRequestForm.controls.User.value) {
      this._msgService.showMesssage("msgSelectUser", MessageType.Error);
      return;
    }
    if (this.ForwardRequestForm.controls.User.value == this.assignTo) {
      this._msgService.showMesssage("msgAlreadyAssign", MessageType.Error);
      return;
    }
    //
    this.dialogRef.close(this.ForwardRequestForm.value);

  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }

}
