import { Component, Inject, OnDestroy, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IMVOSearch } from '@NFS_Interfaces/OtherInterfaces/IMVOSearch';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ProposalDataService } from "@NFS_Modules/CAP/CAPServices/proposal-data.service";
import * as PROPOSALENTITY from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import { mPOSMasterDataRequest } from "@NFS_Core/NFSServices/MasterData/MasterdataHelper/mPOSMasterDataRequest";
import { ProposalService } from "@NFS_Core/NFSServices/Proposal/proposal.service";
import { QuotationService } from '@NFS_Core/NFSServices/Quotation/quotation.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';


@Component({
    selector: 'app-mvo-search-search',
    templateUrl: './mvo-survey-search.component.html',
    styleUrls: ['./mvo-survey-search.component.css'],
    standalone: false
})
export class MVOSurveySearchComponent implements OnInit, OnDestroy {

  public isChecked: string = '';
  MVOSearchForm: FormGroup;
  mrequest!: mPOSMasterDataRequest;
  panelOpenState = false;
  public selectedMVOs: INFSDropDownData[] = [];
  private subscription$ = new Subject();


  constructor(
    private _QuotationService: QuotationService, private _store: ClientStoreService,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<MVOSurveySearchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_DIALOG_DATA) Param: any,
    private _proposaldataService: ProposalDataService, private _proposalService: ProposalService, public _masterDataService: MasterDataService
  ) {
    this.MVOSearchForm = this._formBuilder.group({
      MVOUsersList: [[]], // Initialize as an empty array
      searchtxt: [''],
    });
    this.selectedMVOs = Param.selectedMVOs;
  }

  ngOnInit(): void {
    if (this._masterDataService.MVOList == null || this._masterDataService.MVOList == undefined || this._masterDataService.MVOList.length < 1) {
      this.getMVOList();
    }
    this.MVOSearchForm.controls.MVOUsersList.setValue(this.selectedMVOs.map(item => item.code));
  }

  mvoSearchChange(event: any) {
    if (event != undefined) {

    }
  }

  MVOSelectionChange(element: any) {
    this.selectedMVOs = this._masterDataService.MVOList.filter(item => this.MVOSearchForm.controls.MVOUsersList.value.includes(item.code));
  }

  getMVOList() {
    var mrequest = new mPOSMasterDataRequest();
    mrequest.DATAS.UserGroupCode = '00108';
    this._QuotationService.GetMVOUsersList(mrequest).pipe(takeUntil(this.subscription$)).subscribe((response) => {
      this._masterDataService.MVOList = response?.ResultSet?.DataCollection;
    });
  }

  SelectAndClose() {
    let reply = this.selectedMVOs;
    this.dialogRef.close(reply);
  }

  CloseWithoutSave() {
    this.dialogRef.close(null);
  }
  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }

}
