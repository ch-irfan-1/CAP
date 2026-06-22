import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { QuotationService } from '@NFS_Core/NFSServices/Quotation/quotation.service';
import { IQuotationInfoParm } from '@NFS_Interfaces/RequestInterfaces/IQuotationInfoParm';
import { mPOSMasterDataRequest } from '@NFS_Core/NFSServices/MasterData/MasterdataHelper/mPOSMasterDataRequest';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { Router } from '@angular/router';
import { IQUOTInfo } from '@NFS_Entity/Quot-Entity/Quot.model.index';
import { MasterDataCollection } from '@NFS_Core/NFSServices/MasterData/MasterdataHelper/MasterDataCollection';
import { MasterData } from '@NFS_Enums/MasterData.enum';
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-assign-to-vo',
    templateUrl: './assign-to-vo.component.html',
    styleUrls: ['./assign-to-vo.component.css'],
    standalone: false
})
export class AssignToVOComponent implements OnInit, OnDestroy {

  assignToVOForm: UntypedFormGroup;
  // ApprovalTypeData: Array<INFSDropDownData> = [
  //   { id: 1, code: "00001", TextValue: "Fast Track Approval", OptionalData: { "isDefault": true }, ISMCOMDEALER: false, FINACETYPECODE: "", APPTYP: "" },
  //   { id: 2, code: "00002", TextValue: "Express Approval", OptionalData: {}, ISMCOMDEALER: false, FINACETYPECODE: "", APPTYP: "" },
  //   { id: 3, code: "00003", TextValue: "Normal Approval", OptionalData: {}, ISMCOMDEALER: false, FINACETYPECODE: "", APPTYP: "" }
  // ];
  AssignRequest = {} as IQuotationInfoParm;
  request!: mPOSMasterDataRequest;
  VOList!: Array<INFSDropDownData>;
  ApprovalTypeData!: Array<INFSDropDownData>;
  code: string = "00003";
  subscription$ = new Subject();
  
  constructor(private fb: UntypedFormBuilder, private toaster: ToastrService, public dialogRef: MatDialogRef<AssignToVOComponent>,
    private _QuotationService: QuotationService, private _store: ClientStoreService,
    public appConfig: AppConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any, public _masterDataService: MasterDataService, private _router: Router, private _toastr: ToastrService) {
    this.assignToVOForm = this.fb.group({
      VOList: '',
      ApprovalTypeList: '',
      Comments: ''
    })

  }
  cancel() {
    this.dialogRef.close(false);
  }
  ngOnInit(): void {
    this.getVOList();
    this.getCreditApprovalTypeList();
    if (this.data.ReAssignInd == true)
      this.readQuotInfo();

    if (this.data.quotInfo.CREATEDBYMVOIND && this.data.ReAssignInd == false) {
      this.assignToVOForm.controls.VOList.setValue(this.data.quotInfo.CREATEDBY)
      this.assignToVOForm.controls.VOList.disable();
    }
    else {
      this.assignToVOForm.controls.VOList.enable();
    }
  }

  getVOList() {
    this.request = new mPOSMasterDataRequest();
    this.request.DATAS.branchId = this.data.quotInfo.BRANCHID;
    this.request.DATAS.UserGroupCode = '00108';//this._store.GetUserGroupCode();
    this._QuotationService.GetVOList(this.request).pipe(takeUntil(this.subscription$)).subscribe((response) => {
      this._masterDataService.VOList = response?.ResultSet?.DataCollection;
    });
  }

  getCreditApprovalTypeList() {
    this.request = new mPOSMasterDataRequest();
    this.request.masterDataOperation = MasterData.CreditApprovalType;
    this._masterDataService.GetMasterData(this.request).pipe(takeUntil(this.subscription$)).subscribe((response) => {
      this._masterDataService.CreditApprovalTypes = response?.ResultSet?.DataCollection;
      if (!this.assignToVOForm.controls.ApprovalTypeList.value)
        this.assignToVOForm.controls['ApprovalTypeList'].setValue(this.code, { onlySelf: true });
    });
  }

  readQuotInfo() {
    let quotInfoParam = {} as IQuotationInfoParm;
    quotInfoParam.QuotationId = this.data.quotInfo.QUOTATIONID;
    quotInfoParam.USERID = this._store.GetUserInfo()?.UserId;
    this._QuotationService.ReadQuotInfo(quotInfoParam).pipe(takeUntil(this.subscription$)).subscribe((response) => {
      let result: IQUOTInfo = response.ResultSet as IQUOTInfo;
      this.assignToVOForm.patchValue({
        VOList: result.VOID,
        ApprovalTypeList: result.APPROVALTYPE,
        Comments: result.APPLICATIONCENTERCOMMENTS
      });
    });
  }


  btnAssignClick() {
    if (!this.assignToVOForm.controls.VOList.value && !(this.data.quotInfo.CREATEDBYMVOIND && this.data.ReAssignInd == false)) {
      this.toaster.warning('Please Select VO')
      return;
    }
    else if (!this.assignToVOForm.controls.ApprovalTypeList.value) {
      this.toaster.warning('Please Select Approval Type')
      return;
    }
    else if (!this.assignToVOForm.controls.Comments.valid) {
      this.toaster.warning('Comments are invalid.')
      return;
    }

    this.AssignRequest.QuotationId = this.data.quotInfo.QUOTATIONID;
    this.AssignRequest.USERID = this._store.GetUserInfo()?.UserId;
    if (this.data.quotInfo.CREATEDBYMVOIND && this.data.ReAssignInd == false)
      this.AssignRequest.VOID = this.data.quotInfo.CREATEDBY;
    else
      this.AssignRequest.VOID = this.assignToVOForm.controls.VOList.value;
    this.AssignRequest.APPLICATIONCENTERCOMMENTS = this.assignToVOForm.controls.Comments.value;
    this.AssignRequest.VOApprovalType = this.assignToVOForm.controls.ApprovalTypeList.value;
    if (this.data.ReAssignInd == true)
      this.AssignRequest.QuotationNbr = this.data.quotInfo.QUOTATIONNBR;

    if (this.data.ReAssignInd == false) { // Assign
      this._QuotationService.AssignToVO(this.AssignRequest).pipe(takeUntil(this.subscription$)).subscribe(response => {
        if (response.MESSAGE != "Success.") {
          this._toastr.error(response.MESSAGE);
          this.dialogRef.close(false);
          return;
        }
        if (response.MESSAGE == "Success.") {
          this._toastr.success("Lead Assigned Successfully");
        }
        //this.reloadCurrentRoute();
        this.dialogRef.close(true);
      });
    } else { // Re-Assign
      this._QuotationService.ReAssignToVO(this.AssignRequest).pipe(takeUntil(this.subscription$)).subscribe(response => {
        if (response.MESSAGE != "Success.") {
          this._toastr.error(response.MESSAGE);
          this.dialogRef.close(false);
          return;
        }
        if (response.MESSAGE == "Success.") {
          this._toastr.success("Lead Re-Assigned Successfully");
        }
        //this.reloadCurrentRoute();
        this.dialogRef.close(true);
      });
    }
  }

  reloadCurrentRoute() {
    const currentUrl = this._router.url;
    if (currentUrl.toLocaleLowerCase() == "/WorkQueue")
      this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this._router.navigate([currentUrl]);
      });
    else
      this._router.navigateByUrl('/WorkQueue');
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }

}
