import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from 'src/Library';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DialogConfig } from '@NFS_Core/NFSControls/nfs-dialog/nfs-dialog.component';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { mPOSMasterDataRequest } from '@NFS_Core/NFSServices/MasterData/MasterdataHelper/mPOSMasterDataRequest';
import { MasterData } from '@NFS_Enums/MasterData.enum';
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
    selector: 'app-cancellead',
    templateUrl: './cancellead.component.html',
    standalone: false
})

export class CancelleadComponent implements OnInit, OnDestroy {

  cancellationForm: UntypedFormGroup;
  subscription$ = new Subject();

  constructor(private fb: UntypedFormBuilder,
    private toaster: ToastrService,
    public appConfig: AppConfigService,
    public dialogRef: MatDialogRef<CancelleadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogConfig,
    public _masterDataService: MasterDataService) {
    this.cancellationForm = this.fb.group({
      RejectionReason: [],
      Comments: []
    })
  }

  ngOnInit() {
    this.getRejectionReasonList();
  }

  getRejectionReasonList() {

    if (this._masterDataService.CancellationTypes &&
      this._masterDataService.CancellationTypes.length > 0) {
      return;
    }

    var request = {} as mPOSMasterDataRequest;
    request.masterDataOperation = MasterData.CancellationReason

    this._masterDataService.GetMasterData(request).pipe(takeUntil(this.subscription$)).subscribe((response) => {
      // this.provinceData = response.FPS;
      this._masterDataService.CancellationTypes = response?.ResultSet?.DataCollection;
    });
  }

  cancelLead() {
    if(!this.cancellationForm.controls.RejectionReason.value){
      this.toaster.warning('Please Select Rejection Reason')
      return;
    }

    else if (!this.cancellationForm.controls.Comments.valid) {
      this.toaster.warning('Comments are invalid.')
      return;
    }
    this.dialogRef.close(this.cancellationForm.value);
  }

  cancel() {
    this.dialogRef.close(false);
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }
}
