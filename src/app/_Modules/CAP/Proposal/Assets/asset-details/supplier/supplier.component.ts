import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, } from 'src/Library';
import { MatPaginator, MatPaginatorSelectConfig, PageEvent } from '@angular/material/paginator';
import { ProposalMasterDataRequest } from '@NFS_Core/NFSServices/MasterData/MasterdataHelper/proposalMasterDataRequests';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { IDealerSearch } from '@NFS_Interfaces/OtherInterfaces/IDealerSearch';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IBP_MAINInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IBP_MAINInfo.model';
import { ToastrService } from 'ngx-toastr';
import { IBusinessPartnerInfoParm } from '@NFS_Interfaces/RequestInterfaces/BusinessPartnerInfoParm';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-supplier',
    templateUrl: './supplier.component.html',
    styleUrls: ['./supplier.component.css'],
    standalone: false
})
export class SupplierComponent implements OnInit, OnDestroy {

  dataSourcelength = 10;
  selectedPageSize: number = 25;
  pageSizeOptions: number[] = [25, 50, 75, 100];
  panelOpenState = false;
  public dealerSearchData: FormArray<IDealerSearch> = this._formBuilder.array<IDealerSearch>([]);
  SupplierSearchForm: FormGroup = new FormGroup({ searchtxt: new FormControl(''), });
  request!: ProposalMasterDataRequest;
  private subscription$ = new Subject();
  BPParam = {} as IBusinessPartnerInfoParm;
  totalRows: number = 0;
  SearchResultSet = [] as Array<IBP_MAINInfo>;
  public ProposalQueueDataset: FormArray<IBP_MAINInfo> = this._formBuilder.array<IBP_MAINInfo>([]);
  resetGridPage: boolean = false;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator | undefined;
  public Labels = ['Name', 'Code', 'Kotamadya', 'Role'];
  public pipes = [null, null, null, null, null, null];
  ResultColumns: string[] = ['BUSINESSPARTNERNME', 'CODENUMBER', 'KOTAMADYA', 'ROLEDSC'];

  constructor(private _proposalService: ProposalService, private _formBuilder: FormBuilder, private _toastr: ToastrService,
    private _proposaldataService: ProposalDataService, public dialogRef: MatDialogRef<SupplierComponent>) { }


    paginatorSelectConfig:MatPaginatorSelectConfig = {
      panelClass: "paginator-select-overlay"
    }
  ngOnInit(): void {
  }

  btnSearch() {
    this.getSearchData(1, this.selectedPageSize);
  }

  public PageSelectionChanged(event: PageEvent) {
    var pageIndex: number = event.pageIndex + 1;
    this.selectedPageSize = event.pageSize;
    this.getSearchData((pageIndex * this.selectedPageSize) - this.selectedPageSize + 1, (pageIndex * this.selectedPageSize));
  }

  getSearchData(from: number = 1, to: number = 25) {
    //this.convertDateStringToDate();
    this.BPParam.FromRecord = from;
    this.BPParam.ToRecord = to;
    this.BPParam.BusinessPartnerName = this.SupplierSearchForm.get('searchtxt')?.value;
    this._proposalService.DealerSupplierSearch(this.BPParam).pipe(takeUntil(this.subscription$))
      .subscribe(res => {
        if (res != null && res.ResultSet.length > 0) {
          this.totalRows = res.ResultSet[0].TOTALCOUNT;
        }
        this.SearchResultSet = res.ResultSet;
        if (this.resetGridPage) {
          this.paginator?.firstPage();
          this.resetGridPage = false;
        }
        this.ProposalQueueDataset = this._formBuilder.array(this.SearchResultSet.map(r => this._formBuilder.group(r)));
        // this.dataSourcelength = this.ProposalQueueDataset?.value?.length;
        if (res.CODE != 1)
          this._toastr.error(res.MESSAGE)
      });
  }

  LoadSupplierAction(event: any): void {
    this._proposaldataService.PROPOSALASSET.controls.SUPPLIERNAME.setValue(event.BUSINESSPARTNERNME);
    this._proposaldataService.PROPOSALASSET.controls.BPINTRODUCERID.setValue(event.BUSINESSPARTNERID);
    this._proposaldataService.PROPOSALASSET.controls.ROLECDE.setValue(event.ROLECDE);
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }

}
