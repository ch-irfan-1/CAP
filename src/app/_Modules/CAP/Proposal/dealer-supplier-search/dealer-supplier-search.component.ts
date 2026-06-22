import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDealerSearch } from '@NFS_Interfaces/OtherInterfaces/IDealerSearch';
import { FormArray, FormBuilder, FormControl, FormGroup } from 'src/Library';
import { ProposalDataService } from "@NFS_Modules/CAP/CAPServices/proposal-data.service";
import * as PROPOSALENTITY from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import { mPOSMasterDataRequest } from "@NFS_Core/NFSServices/MasterData/MasterdataHelper/mPOSMasterDataRequest";
import { ProposalService } from "@NFS_Core/NFSServices/Proposal/proposal.service";
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { MatPaginatorSelectConfig, PageEvent } from '@angular/material/paginator';
import { IBusinessPartnerInfoParm } from '@NFS_Interfaces/RequestInterfaces/BusinessPartnerInfoParm';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-dealer-supplier-search',
    templateUrl: './dealer-supplier-search.component.html',
    styleUrls: ['./dealer-supplier-search.component.css'],
    standalone: false
})
export class DealerSupplierSearchComponent implements OnInit, OnDestroy{
  dealerSearchCriteria: any = [{ code: "1", TextValue: "Dealer Name" }, { code: "2", TextValue: "Dealer Code" }];
  PROPOSALINFO!: FormGroup<PROPOSALENTITY.IPRPLInfo>;
  DealerSearchForm: FormGroup = new FormGroup({
    searchBy: new FormControl(''),
    searchtxt: new FormControl('')
  });
  DealerLoad: FormGroup = new FormGroup({
    Name: new FormControl(''),
    CODENUMBER: new FormControl(''),
    COUNTRYDSC: new FormControl(''),
    PROVINCE: new FormControl(''),
    KOTAMADYA: new FormControl(''),
    KECAMATAN: new FormControl(''),
    KELURAHAN: new FormControl(''),
    ADDRESSOTO: new FormControl(''),
    BUSINESSPARTNERNME: new FormControl(''),
    BUSINESSPARTNERID: new FormControl(0),
    Role: new FormControl(''),
    ParentIndex: new FormControl(0),
    ROLECDE: new FormControl(''),
  });
  request!: IBusinessPartnerInfoParm;
  mrequest!: mPOSMasterDataRequest;
  panelOpenState = false;
  public Labels = ['Dealer Name', 'Dealer Code', 'Kotamadya','Role'];
  public pipes = [null, null, null, null, null, null];
  dealerResultColumns: string[] = ['Name', 'CODENUMBER', 'KOTAMADYA','Role'];
  public dealerSearchData: FormArray<IDealerSearch> = this._formBuilder.array<IDealerSearch>([]);
  dataSourcelength = 0;
  pageSizeOptions: number[] = [10, 20, 30, 40, 50];
  selectedPageSize: number = 10;
  dealerLoad = false;
  private subscription$ = new Subject();
  
  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DealerSupplierSearchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _proposaldataService: ProposalDataService, private _proposalService: ProposalService, public _masterDataService: MasterDataService
  ) { }

  paginatorSelectConfig:MatPaginatorSelectConfig = {
    panelClass: "paginator-select-overlay"
  }
  ngOnInit(): void {

    this.PROPOSALINFO = this._proposaldataService.PROPOSAL;
    this.DealerSearchForm.controls.searchBy.setValue('1');
  }

  DelaerLoadchildOutput(event: any): void {
    this.DealerLoad.patchValue(event);
    this.DealerLoad.controls.ParentIndex.setValue(this.data.index);
    this.dialogRef.close(this.DealerLoad.value);
  }

  SearchDealerSupplierSearch(from: number = 1, to: number = 10) {
    this.request = {} as IBusinessPartnerInfoParm;
    this.request.BusinessPartnerName = this.DealerSearchForm.value.searchtxt;
    this.request.FromRecord = from;
    this.request.ToRecord = this.selectedPageSize;
    this._proposalService.SearchDealerSupplierSearch(this.request).pipe(takeUntil(this.subscription$)).subscribe(res => {
      this.dealerSearchData = this._formBuilder.array(res.ResultSet.map((r: any) => this._formBuilder.group(r)));
      this.dataSourcelength = this.dealerSearchData.value[0].TOTALCOUNT;
    })
  }

  public PageSelectionChanged(event: PageEvent) {
    var pageIndex: number = event.pageIndex + 1;
    this.selectedPageSize = event.pageSize;
    this.SearchDealerSupplierSearch((pageIndex * this.selectedPageSize) - this.selectedPageSize + 1, (pageIndex * this.selectedPageSize));
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }
}
