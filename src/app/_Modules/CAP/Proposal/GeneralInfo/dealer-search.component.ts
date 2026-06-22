import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { mPOSMasterDataRequest } from '@NFS_Core/NFSServices/MasterData/MasterdataHelper/mPOSMasterDataRequest';
import { ProposalMasterDataRequest } from '@NFS_Core/NFSServices/MasterData/MasterdataHelper/proposalMasterDataRequests';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import * as PROPOSALENTITY from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { MasterData } from '@NFS_Enums/MasterData.enum';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { IDealerSearch } from '@NFS_Interfaces/OtherInterfaces/IDealerSearch';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup
} from 'src/Library';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-dealer-search',
    templateUrl: './dealer-search.component.html',
    styleUrls: ['./dealer-search.component.css'],
    standalone: false
})
export class DealerSearchComponent implements OnInit, OnDestroy {
  dealerSearchCriteria: any = [
    { code: '1', TextValue: 'Dealer Name' },
    { code: '2', TextValue: 'Dealer Code' },
  ];
  resultsExpanded = false;
  resizeResetGrid = true;
  PROPOSALINFO!: FormGroup<PROPOSALENTITY.IPRPLInfo>;
  DealerSearchForm: FormGroup = new FormGroup({
    searchBy: new FormControl(''),
    searchtxt: new FormControl(''),
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
  });
  request!: ProposalMasterDataRequest;
  mrequest!: mPOSMasterDataRequest;
  panelOpenState = false;
  public Labels = ['Dealer Name', 'Dealer Code', 'Kotamadya'];
  public pipes = [null, null, null, null, null, null];
  dealerResultColumns: string[] = ['Name', 'CODENUMBER', 'KOTAMADYA'];
  public dealerSearchData: FormArray<IDealerSearch> =
    this._formBuilder.array<IDealerSearch>([]);
  dataSourcelength = 10;
  pageSizeOptions: number[] = [25, 50, 75, 100];
  selectedPageSize: number = 25;
  dealerLoad = false;
  private subscription$ = new Subject();
  isDealerChanged: boolean = false;
  public searchByPlaceHolder: string = this.dealerSearchCriteria[0].TextValue;

  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DealerSearchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _proposaldataService: ProposalDataService,
    private _proposalService: ProposalService,
    public _masterDataService: MasterDataService,
    private _msgService: MessageService
  ) { }

  ngOnInit(): void {
    this.PROPOSALINFO = this._proposaldataService.PROPOSAL;
    this.DealerSearchForm.controls.searchBy.setValue('1');
  }

  SearchDealer(): void {
    this.resizeResetGrid = false;
    this.request = new ProposalMasterDataRequest();
    this.request.dealernme = this.DealerSearchForm.value.searchBy == '1' ? this.DealerSearchForm.get('searchtxt')?.value : null;
    this.request.dealercde = this.DealerSearchForm.value.searchBy == '2' ? this.DealerSearchForm.get('searchtxt')?.value : null;;
    this.request.branchId = +this.PROPOSALINFO.controls.BPCOMPANYBRANCHID.value;

    this._proposalService.SearchDealer(this.request).pipe(takeUntil(this.subscription$))
      .subscribe((res) => {
        this.dealerSearchData = this._formBuilder.array(
          res.ResultSet.map((r: any) => this._formBuilder.group(r))
        );
        this.dataSourcelength = this.dealerSearchData?.value?.length;
        this.resizeResetGrid = true;
        
      });
this.resultsExpanded = true;
  }

  DelaerLoadchildOutput(event: any): void {
    this.DealerLoad.patchValue(event);
    this.dealerLoad = true;
    this.resultsExpanded = false;
    this._proposaldataService.PROPOSAL.controls.MCOMDEALER.setValue(event.MCOMDEALER);
  }

  SelectAndClose() {
    if (this.DealerLoad.controls.BUSINESSPARTNERID.value > 0) {
      if (this.PROPOSALINFO.controls.BPINTRODUCERID.value != this.DealerLoad.controls.BUSINESSPARTNERID.value) {
        this.PROPOSALINFO.controls.BPINTRODUCERID.setValue(
          this.DealerLoad.controls.BUSINESSPARTNERID.value
        );
        this.PROPOSALINFO.controls.INTRODUCERROLECDE.setValue(
          this.DealerLoad.controls.Role.value
        );
        this.PROPOSALINFO.controls.BPINTRODUCERNME.setValue(
          this.DealerLoad.controls.BUSINESSPARTNERNME.value
        );

        if (this.PROPOSALINFO.value.RowState != DataRowState.Added)
          this.PROPOSALINFO.controls.RowState.setValue(DataRowState.Updated);

        this.dealerLoad = false;
        this.isDealerChanged = true;
      }
      else {
        this.isDealerChanged = false;
      }
      this.dialogRef.close({ isDealerChanged: this.isDealerChanged });

      this.mrequest = new mPOSMasterDataRequest();
      this.mrequest.masterDataOperation = MasterData.DealerByBranch;
      this.mrequest.DATAS.dealerId =
        this.PROPOSALINFO.controls.BPINTRODUCERID.value;

      this._masterDataService
        .GetMasterData(this.mrequest)
        .pipe(takeUntil(this.subscription$))
        .subscribe((response) => {
          this._masterDataService.DealerByBranch =
            response?.ResultSet?.DataCollection;
        });
    }
    else {
      this._msgService.showCustomMesssage("Please Select Dealer.", MessageType.Warning)
    }
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }
  dealerSearchCriteriaChange(event: any) {
    if (event != undefined) {
      this.searchByPlaceHolder = this.dealerSearchCriteria.filter((x: any) => x.code == this.DealerSearchForm.value.searchBy)[0].TextValue;
      this.DealerSearchForm.controls.searchtxt.setValue('');
    }
  }
}
