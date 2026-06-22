import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, Validators } from 'src/Library';
import * as QUOTENTITY from '@NFS_Entity/Quot-Entity/Quot.model.index';
import { QuotEntityFormService } from '@NFS_Modules/IOPS/IOPSServices/QuotEntityForm.service';
import { mPOSMasterDataRequest } from '@NFS_Core/NFSServices/MasterData/MasterdataHelper/mPOSMasterDataRequest';
import { MasterData } from '@NFS_Enums/MasterData.enum';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { Router } from '@angular/router';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { StatusCode } from '@NFS_Enums/StatusCode.enum';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-general-info',
    templateUrl: './general-info.component.html',
    styleUrls: ['./general-info.component.css'],
    standalone: false
})
export class GeneralInfoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() QoutMain!: FormGroup<QUOTENTITY.IQUOTInfo>;
  @Input() MainQuotEntity!: FormGroup<QUOTENTITY.IQuotEntity>
  @Input() Mode: string = FormMode.VIEW;

  request!: mPOSMasterDataRequest;
  branchData!: Array<INFSDropDownData>;
  LoggedinUserRole: string = '';
  subscription$ = new Subject();

  constructor(private _QuotForm: QuotEntityFormService, public _masterDataService: MasterDataService, private _router: Router
    , private _storageService: ClientStoreService) { }
  ngOnChanges(changes: SimpleChanges): void {
    //console.log("change detected in general-info");
    this.setMode();
  }

  ngOnInit(): void {
    this.LoggedinUserRole = this._storageService.GetUserGroupCode();
    this.QoutMain.controls.BPBRANCHID.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(value => {
      this.getDealerData(value);
      if (this._masterDataService.AllBranches) {
        let x = this._masterDataService.AllBranches.filter(x => x.code === value.toString())[0];
        this.QoutMain.controls.BRANCHNAME.setValue(x?.TextValue);
        this._masterDataService.AllDealerByBranch = [];
        this.QoutMain.controls.BPINTRODUCERID.setValue(0);
        this._masterDataService.AllFpGroups = [];
        this.QoutMain.controls.FPGROUPID.setValue(0);
        this._masterDataService.AllFpCampigns = [];
        this.QoutMain.controls.FINANCIALPRODUCTID.setValue(0);
      }
    });

    this.QoutMain.controls.BPINTRODUCERID.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(value => {
      this.getFpData(this.QoutMain.controls.BPBRANCHID.value, value);
      if (this._masterDataService.AllDealerByBranch) {
        let x = this._masterDataService.AllDealerByBranch.filter(x => x.code === value.toString())[0];
        this.QoutMain.controls.DEALERNAME.setValue(x?.TextValue);
        this.QoutMain.controls.MCOMDEALER.setValue(x?.ISMCOMDEALER);
        this._masterDataService.AllFpGroups = [];
        this.QoutMain.controls.FPGROUPID.setValue(0);
        this._masterDataService.AllFpCampigns = [];
        this.QoutMain.controls.FINANCIALPRODUCTID.setValue(0);
      }
    });

    this.QoutMain.controls.FPGROUPID.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(value => {
      this.getFpCampaignData(this.QoutMain.controls.BPBRANCHID.value, this.QoutMain.controls.BPINTRODUCERID.value, value);
      if (this._masterDataService.AllFpGroups) {
        let x = this._masterDataService.AllFpGroups.filter(x => x.code === value.toString())[0];
        this.QoutMain.controls.FPGROUPNAME.setValue(x?.TextValue);
        this.QoutMain.controls.ISMCOMCAMPAIGN.setValue(x?.ISMCOMCAMPAIGN);
        this._masterDataService.AllFpCampigns = [];
        this.QoutMain.controls.FINANCIALPRODUCTID.setValue(0);
      }
    });

    this.QoutMain.controls.FINANCIALPRODUCTID.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(value => {
      if (this._masterDataService.AllFpCampigns) {
        let x = this._masterDataService.AllFpCampigns.filter(x => x.code === value.toString())[0];
        this.QoutMain.controls.FPCAMPAIGNNAME.setValue(x?.TextValue);
        this.QoutMain.controls.FINANCETYP.setValue(x?.FINACETYPECODE);
        if (this.QoutMain.controls.FINANCETYP.value == '00014' || this.QoutMain.controls.ISMCOMCAMPAIGN.value) {
          this.MainQuotEntity.controls.QUOTADDLINFO.controls.ASSETCONDITION.setValue('00002', { onlySelf: true }); 
        }
      }
    });

    this.setMode();
    this.QoutMain.controls.QUOTATIONDTE.disable();
    this.QoutMain.controls.APCSTATUSCDE.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(val => {
      if (val == StatusCode.Cancelled) {
        this.QoutMain.controls.CANCELLATIONCOMMENTS.disable();
        this.QoutMain.controls.CANCELLATIONREASON.disable();
        this.getRejectionReasonList()
      }
    })
  }

  getBranchData() {
    this.request = new mPOSMasterDataRequest();
    this.request.masterDataOperation = MasterData.Branches;
    this.request.DATAS.companyId = 5;
    this._masterDataService.GetMasterData(this.request).pipe(takeUntil(this.subscription$)).subscribe((response) => {
      this.branchData = response?.resultSet?.dataCollection;
    });
  }

  getDealerData(branchId: any) {
    if (branchId > 0) {
      this.request = new mPOSMasterDataRequest();
      this.request.DATAS.branchId = branchId;
      this.request.masterDataOperation = MasterData.DealerByBranch;
      this._masterDataService.GetMasterData(this.request).pipe(takeUntil(this.subscription$)).subscribe((response) => {
        this._masterDataService.AllDealerByBranch = response?.ResultSet?.DataCollection
      });
    }
  }

  getFpData(branchId: any, dealerId: any) {
    if (branchId > 0 && dealerId > 0) {
      this.request = new mPOSMasterDataRequest();
      this.request.DATAS.branchId = branchId;
      this.request.DATAS.dealerId = dealerId;
      this.request.DATAS.companyId = 5;
      this.request.masterDataOperation = MasterData.FPGroupByDealerAndBranch;
      this._masterDataService.GetMasterData(this.request).pipe(takeUntil(this.subscription$)).subscribe((response) => {
        this._masterDataService.AllFpGroups = response?.ResultSet?.DataCollection
      });
    }
  }

  getFpCampaignData(branchId: any, dealerId: any, groupId: any) {
    if (branchId > 0 && dealerId > 0 && groupId > 0) {
      this.request = new mPOSMasterDataRequest();
      this.request.DATAS.branchId = branchId;
      this.request.DATAS.dealerId = dealerId;
      this.request.DATAS.groupId = groupId;
      this.request.DATAS.companyId = 5;
      if (this.QoutMain.controls.QUOTATIONTYPECDE.value == "00001")
        this.request.DATAS.applicantType = "00001";
      if (this.QoutMain.controls.QUOTATIONTYPECDE.value == "00002")
        this.request.DATAS.applicantType = "00002";

      this.request.masterDataOperation = MasterData.FPCampaignByGroupAndDealerAndBranch;
      this._masterDataService.GetMasterData(this.request).pipe(takeUntil(this.subscription$)).subscribe((response) => {
        this._masterDataService.AllFpCampigns = response?.ResultSet?.DataCollection
      });
    }
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

  setMode() {
    if (this.Mode === FormMode.NEW) {
      this.QoutMain.controls.BPBRANCHID.enable();
      this.QoutMain.controls.BPINTRODUCERID.enable();
      this.QoutMain.controls.FPGROUPID.enable();
      this.QoutMain.controls.FINANCIALPRODUCTID.enable();
      this.QoutMain.controls.COMMENTS.enable();
      this.QoutMain.controls.APPLICATIONCENTERCOMMENTS.disable();

    }
    else if (this.Mode === FormMode.VIEW) {
      this.QoutMain.controls.QUOTATIONNBR.disable();
      this.QoutMain.controls.BPBRANCHID.disable();
      this.QoutMain.controls.BPINTRODUCERID.disable();
      this.QoutMain.controls.FPGROUPID.disable();
      this.QoutMain.controls.FINANCIALPRODUCTID.disable();
      this.QoutMain.controls.COMMENTS.disable();
      this.QoutMain.controls.APPLICATIONCENTERCOMMENTS.disable();
    }
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }
}
