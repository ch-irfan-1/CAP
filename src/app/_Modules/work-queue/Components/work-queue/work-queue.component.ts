import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorSelectConfig, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { ContextMenuService } from '@NFS_Core/NFSServices/ContextMenu/context-menu.service';
import { DialogBoxService } from '@NFS_Core/NFSServices/DialogBox/dialog-box.service';
import { FormatterService } from '@NFS_Core/NFSServices/Formatter/formatter.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { QuotationService } from '@NFS_Core/NFSServices/Quotation/quotation.service';
import { ApplicationTypeService } from '@NFS_Core/NFSServices/_helper/application-type.service';
import { HeaderTitleService } from '@NFS_Core/NFSServices/_helper/header-title-service.service';
import { WorkQueueHelperService } from '@NFS_Core/NFSServices/_helper/WorkQueueHelper/work-queue-helper.service';
import { IQUOTInfo } from '@NFS_Entity/Quot-Entity/Quot.model.index';
import { QueueOperation } from '@NFS_Enums/WorkQueueOperation.enum';
import { IContextMenu } from '@NFS_Interfaces/OtherInterfaces/IContextMenu.interface';
import { IWorkQueueResult } from '@NFS_Interfaces/OtherInterfaces/IWorkQueueResult';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { IQuotationInfoParm } from '@NFS_Interfaces/RequestInterfaces/IQuotationInfoParm';
import { FormArray, FormBuilder, FormControl, FormGroup } from 'src/Library';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
    selector: 'app-work-queue',
    templateUrl: './work-queue.component.html',
    styleUrls: ['./work-queue.component.css'],
    standalone: false
})
export class WorkQueueComponent implements OnInit, OnDestroy {

  classApplied = false;
  classApplied1 = true;
  IsAPCuserLoggedin: boolean = true;
  maxDate: Date = new Date(Date.now());
  public totalRows: number = 0;
  // MatPaginator Output
  dataSourcelength = 10;
  pageSizeOptions: number[] = [25, 50, 75, 100];

  private _jsonURL = 'assets/Localization/oto_local_en.json';
  public QueueSearchForm: FormGroup = new FormGroup({
    FromDate: new FormControl(),
    ToDate: new FormControl(),
    SearchText: new FormControl(),
    SearchByColumn: new FormControl()
  });

  RadioOptions: FormGroup = new FormGroup({
    Option: new FormControl
  });

  workQueueParams = {} as IQuotationInfoParm;
  workQueueResultSet = [] as Array<IWorkQueueResult>;
  statusColumn: string = 'STATUSDSC';
  selectedPageSize: number = 25;
  selectedStatus: string = '00000';
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator | undefined;
  resetGridPage: boolean = false;
  subscription$ = new Subject();

  public columns = ['QUOTATIONNBR', 'QUOTATIONDTE', 'FINANCIALPRODUCTNME', 'APPLICANTNME', 'BPINTRODUCERNME', 'STATUSDSC'];
  public pipes = [null, 'formatDate', null, null, null, null];
  public Labels = ['Lead Number', 'Date', 'Campaign Name', 'Customer Name', 'Dealer Name', 'Status'];
  public ContextMenu: Array<IContextMenu> = [];
  public workQueueDataset: FormArray<IWorkQueueResult> = this._formBuilder.array<IWorkQueueResult>([]);
  public workQueueData: FormArray<IWorkQueueResult> = this._formBuilder.array<IWorkQueueResult>([]);

  workQueueColumnData: Array<INFSDropDownData> = [];
  constructor(private _formBuilder: FormBuilder,
    private http: HttpClient,
    private _masterDataService: MasterDataService,
    private _QuotationService: QuotationService,
    private _router: Router,
    private _storageService: ClientStoreService,
    private _toastr: ToastrService,
    private _dialog: DialogBoxService,
    private _menu: ContextMenuService,
    private _appTypeService: ApplicationTypeService,
    private _formatter: FormatterService,
    private _columns: WorkQueueHelperService,
    private headerTitleService: HeaderTitleService,
    public appConfig: AppConfigService,) { }

  paginatorSelectConfig:MatPaginatorSelectConfig = {
    panelClass: "paginator-select-overlay"
  }
  ngOnInit(): void {

    this._columns.getWorkQueueDropdownColumns().pipe(takeUntil(this.subscription$)).subscribe(
      (data: any) => {
        this.workQueueColumnData = data.WQFilterColumns;
      });
    // this._columns.getWorkQueueDropdownColumns().subscribe(
    //   (data:any)=>{
    //     this.workQueueColumnData=data.WQFilterColumns;
    //     this.columns=data.MOColumns;
    //     if (this._storageService.GetUserGroupCode() == '00105') {
    //       this.columns =data.MOColumns ;
    //     }
    //     else {
    //       this.columns = data.APCColumns;
    //     }
    // });
    // Set To Date
    var toDate = new Date();
    toDate.setDate(toDate.getDate());
    this.QueueSearchForm.controls.ToDate.setValue(toDate);

    // Set From Date
    var fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 30);
    this.QueueSearchForm.controls.FromDate.setValue(fromDate);

    if (this._storageService.GetUserGroupCode() == '00105' || this._storageService.GetUserGroupCode() == '00108') {
      this._menu.getMOTMOContextMenu().pipe(takeUntil(this.subscription$)).subscribe(
        data => this.ContextMenu = data);
      this.IsAPCuserLoggedin = false;
    }
    else {
      this._menu.getAPCContextMenu().pipe(takeUntil(this.subscription$)).subscribe(
        data => this.ContextMenu = data);
      this.IsAPCuserLoggedin = true;
    }

    this.setStatusColumn();
    this.getWorkQueueData(1);
  }

  public getJSON(): Observable<any> {
    return this.http.get(this._jsonURL);
  }

  public PageSelectionChanged(event: PageEvent) {
    var pageIndex: number = event.pageIndex + 1;
    this.selectedPageSize = event.pageSize;
    this.getWorkQueueData((pageIndex * this.selectedPageSize) - this.selectedPageSize + 1, (pageIndex * this.selectedPageSize));
    // filter
    this.resetSearchForm(false);
  }

  workQueueOutput(event: any) {

    if ((event.Mode == QueueOperation.SUBMIT.toString() &&
      (this._storageService.GetUserGroupCode() == '00105' || this._storageService.GetUserGroupCode() == '00108') &&
      event.Quot.STATUSDSC != 'Draft') ||
      ((event.Mode == QueueOperation.EDIT.toString() || event.Mode == QueueOperation.SUBMIT.toString()) && this._storageService.GetUserGroupCode() == '00107')) {
      this._toastr.error("Operation not allowed", 'Error')
      return;
    }

    switch (event.Mode) {
      case QueueOperation.EDIT.toString(): {
        this._appTypeService.setApplicationType(event.Quot.APPLICANTTYP);
        //this.appConfig.loadValidationsData(FormMode.EDIT).subscribe(data => {
        //this._storageService.SetValidationsData(data);
        this._router.navigateByUrl('/IOPS/createLead', { state: { Quot: event.Quot, QueueOperation: QueueOperation.EDIT } });
        this.headerTitleService.setTitle("Lead");
        //});
        break;
      }
      case QueueOperation.CANCEL.toString(): {
        var dialog;
        if (this._storageService.GetUserGroupCode() == '00105' || this._storageService.GetUserGroupCode() == '00108'){
          dialog = this._dialog.openDialog("Confirmation", "Are you sure you want to cancel Lead?", false, "Yes", "No");
          dialog.afterClosed().subscribe((result: any) => {
            if (result === "ok") {
              let workQueueParams = {} as IQuotationInfoParm;
              workQueueParams.QuotationId = event.Quot.QUOTATIONID;
              workQueueParams.USERID = event.Quot.USERID;
              workQueueParams.UserGroup = this._storageService.GetUserGroupCode()
              this._QuotationService.CancelQuotation(workQueueParams).pipe(takeUntil(this.subscription$)).subscribe(response => {
                this.getWorkQueueData(1);
              });
            }
          });
        }
        else {
          dialog = this._dialog.openCancellationDialog();
          dialog.afterClosed().subscribe((result: any) => {
            if (result) {
              let workQueueParams = {} as IQuotationInfoParm;
              workQueueParams.QuotationId = event.Quot.QUOTATIONID;
              workQueueParams.USERID = event.Quot.USERID;
              workQueueParams.CancellationReason = result.RejectionReason;
              workQueueParams.CancellationComments = result.Comments;
              workQueueParams.UserGroup = this._storageService.GetUserGroupCode()
              this._QuotationService.CancelQuotation(workQueueParams).pipe(takeUntil(this.subscription$)).subscribe(response => {
                this.getWorkQueueData(1);
              });
            }
          });
        }
        break;
      }
      case QueueOperation.SUBMIT.toString(): {
        let request = {} as IQUOTInfo;
        request.QUOTATIONNBR = event.Quot.QUOTATIONNBR;
        request.QUOTATIONID = event.Quot.QUOTATIONID;

        this._QuotationService.SubmitQuotation(request).pipe(takeUntil(this.subscription$)).subscribe(res => {
          if (res.MESSAGE == "Success") {
            this._toastr.success("Lead Submitted Successfully");
            this.getWorkQueueData(1);
          }
          else
            this._toastr.error("Something went wrong");
        })
        break;
      }
      case QueueOperation.ASSIGN_To_VO.toString(): {
        let dialogRef = this._dialog.openAssignToVOComponent(event.Quot, false);
        dialogRef.afterClosed().subscribe((result: any) => {
          this.getWorkQueueData(1);
        });
        break;
      }
      case QueueOperation.RE_ASSIGN_To_VO.toString(): {
        let dialogRef = this._dialog.openAssignToVOComponent(event.Quot, true);
        dialogRef.afterClosed().subscribe((result: any) => {
          this.getWorkQueueData(1);
        });
        break;
      }
      case QueueOperation.VIEW.toString(): {
        this._appTypeService.setApplicationType(event.Quot.APPLICANTTYP);
        this._router.navigateByUrl('/IOPS/createLead', { state: { Quot: event.Quot, QueueOperation: QueueOperation.VIEW } });
        this.headerTitleService.setTitle("Lead");
        break;
      }
      default: {
        break;
      }
    }
  }

  openMenu() {
    this.classApplied = !this.classApplied;
    this.classApplied1 = !this.classApplied;
  }

  applyFilter() {
    let trimmedValue = this.QueueSearchForm.controls.SearchText.value.trim().toLocaleLowerCase();
    if (this.QueueSearchForm.controls.SearchByColumn.value) {
      this.workQueueDataset = this._formBuilder.array(
        this.workQueueResultSet.filter((s: any) => {
          if (this.QueueSearchForm.controls.SearchByColumn.value == 'QUOTATIONDTE') {
            return this._formatter.FormateDateToString(s[this.QueueSearchForm.controls.SearchByColumn.value])?.toLocaleLowerCase().includes(trimmedValue);
          }
          else if (this.QueueSearchForm.controls.SearchByColumn.value != 'STATUSDSC') {
            return s[this.QueueSearchForm.controls.SearchByColumn.value].toLocaleLowerCase().includes(trimmedValue);
          }
          else if (this.IsAPCuserLoggedin) {
            return s.APCSTATUSDSC?.toLocaleLowerCase().includes(trimmedValue);
          }
          else {
            return s.STATUSDSC?.toLocaleLowerCase().includes(trimmedValue);
          }
        }
        ).map(r => this._formBuilder.group(r))
      );
    }
    else {
      this.workQueueDataset = this._formBuilder.array(
        this.workQueueResultSet.filter(s =>
          s.QUOTATIONNBR?.toLocaleLowerCase().includes(trimmedValue) ||
          s.FINANCIALPRODUCTNME?.toLocaleLowerCase().includes(trimmedValue) ||
          (this.IsAPCuserLoggedin ? s.APCSTATUSDSC?.toLocaleLowerCase().includes(trimmedValue) : s.STATUSDSC?.toLocaleLowerCase().includes(trimmedValue)) ||
          s.APPLICANTNME?.toLocaleLowerCase().includes(trimmedValue) ||
          s.FINANCIALPRODUCTNME?.toLocaleLowerCase().includes(trimmedValue) ||
          s.BPINTRODUCERNME?.toLocaleLowerCase().includes(trimmedValue) ||
          this._formatter.FormateDateToString(s.QUOTATIONDTE)?.toLocaleLowerCase().includes(trimmedValue)
        ).map(r => this._formBuilder.group(r))
      );
    }
    //this.formateDateControls();
  }

  getWorkQueueData(from: number = 1, to: number = 25) {
    //this.convertDateStringToDate();
    this.workQueueParams.fromRecord = from;
    this.workQueueParams.toRecord = to;
    this.workQueueParams.UserGroup = this._storageService.GetUserGroupCode();
    this.workQueueParams.FromDate = this.QueueSearchForm.controls.FromDate.value;
    this.workQueueParams.ToDate = this.QueueSearchForm.controls.ToDate.value;
    this.workQueueParams.StatusCode = this.selectedStatus;
    
    this._QuotationService.ReadQueueByUser(this.workQueueParams).pipe(takeUntil(this.subscription$)).subscribe(res => {
      if (res != null && res.ResultSet.length > 0) {
        this.totalRows = res.ResultSet[0].TOTALROWS;
      }
      else {
        this.totalRows = 0;
      }
      this.workQueueResultSet = res.ResultSet;
      if (this.resetGridPage) {
        this.paginator?.firstPage();
        this.resetGridPage = false;
      }
      this.workQueueDataset = this._formBuilder.array(this.workQueueResultSet.map(r => this._formBuilder.group(r)));
      //this.formateDateControls();
      this.dataSourcelength = this.workQueueDataset?.value[0]?.TOTALROWS;

      if (res.CODE != 1)
        this._toastr.error(res.MESSAGE)
    });
  }

  setStatusColumn() {
    if (this._storageService.GetUserGroupCode() == '00105' || this._storageService.GetUserGroupCode() == '00108') {
      this.columns = ['QUOTATIONNBR', 'QUOTATIONDTE', 'FINANCIALPRODUCTNME', 'APPLICANTNME', 'BPINTRODUCERNME', 'STATUSDSC'];
    }
    else {
      this.columns = ['QUOTATIONNBR', 'QUOTATIONDTE', 'FINANCIALPRODUCTNME', 'APPLICANTNME', 'BPINTRODUCERNME', 'APCSTATUSDSC'];
    }
  }

  applyFilterCustom(filter: string) {
    this.resetGridPage = true;
    this.selectedStatus = filter;
    this.resetSearchForm(false);
    this.getWorkQueueData(1, this.selectedPageSize);
  }

  btnSearch() {
    if (!this.QueueSearchForm.valid) {
      this._toastr.info("Selected dates are not allowed or invalid");
      return;
    }

    this.RadioOptions.setValue({
      Option: 'All'
    });
    this.resetGridPage = true;
    this.selectedStatus = '00000';
    this.getWorkQueueData(1, this.selectedPageSize);
    // filter
    this.resetSearchForm(false);
  }

  btnReset() {
    this.RadioOptions.setValue({
      Option: 'All'
    });
    this.resetGridPage = true;
    this.selectedStatus = '00000';
    this.selectedPageSize = 25;
    this.resetSearchForm();
    this.getWorkQueueData(1, this.selectedPageSize);
  }

  changeColumnSelection() {
    this.QueueSearchForm.controls.SearchText.setValue('');
    this.applyFilter();
  }

  resetSearchForm(resetDates: boolean = true) {
    if (resetDates) {
      // Set To Date
      var toDate = new Date();
      toDate.setDate(toDate.getDate());
      this.QueueSearchForm.controls.ToDate.setValue(toDate);

      // Set From Date
      var fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 30);
      this.QueueSearchForm.controls.FromDate.setValue(fromDate);
    }

    // filter
    this.QueueSearchForm.controls.SearchText.setValue('');
    this.QueueSearchForm.controls.SearchByColumn.setValue('');
  }

  // convertDateStringToDate() {
  //   if(this.QueueSearchForm.controls.FromDate.value){
  //     this._formatter.FormateDate(this.QueueSearchForm.controls.FromDate);
  //     this._formatter.ConvertDateStringToDate(this.QueueSearchForm.controls.FromDate);
  //   }
  //   if(this.QueueSearchForm.controls.ToDate.value){
  //     this._formatter.FormateDate(this.QueueSearchForm.controls.ToDate);
  //     this._formatter.ConvertDateStringToDate(this.QueueSearchForm.controls.ToDate);
  //   }
  // }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }
}
