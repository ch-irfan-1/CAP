import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { AddressMasterDataService } from '@NFS_Core/NFSServices/MasterData/Address-master-data.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { mPOSMasterDataRequest } from '@NFS_Core/NFSServices/MasterData/MasterdataHelper/mPOSMasterDataRequest';
import { TruckDetailsMasterdataService } from '@NFS_Core/NFSServices/MasterData/truck-detail-masteradata';
import { StateManagment } from '@NFS_Core/RowStateManagement/FormStateManagement';
import { IProposalTruckDetailEntity } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/IProposalTruckDetailEntity.model';
import { IPRPL_TOTL_TRCK_OWNDInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/IPRPL_TOTL_TRCK_OWNDInfo.model';
import { IPRPL_TRCK_OPRT_RVNUInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/IPRPL_TRCK_OPRT_RVNUInfo.model';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { MasterData } from '@NFS_Enums/MasterData.enum';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { AddressParm } from '@NFS_Interfaces/RequestInterfaces/AddressParm';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { FormBuilder, FormGroup } from 'src/Library';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
    selector: 'app-truck-detail',
    templateUrl: './truck-detail.component.html',
    styleUrls: ['./truck-detail.component.css'],
    standalone: false
})
export class TruckDetailComponent implements OnInit, OnDestroy {

  // Truck: FormGroup<IProposalTruckDetailEntity>=this._proposalForm.PropsalTruckDetailForm();
  Truck: FormGroup<IProposalTruckDetailEntity> = this._proposalDataService.ASSETENTITY.controls.TRUCKDETAILS;
  public AllKotaByProvince: any = [];
  public AllKecamatanByKota: any = [];
  public AllKelurahanByKeca: any = [];
  mask: string = "separator.2";

  isViewMode: boolean = false;
  fieldDisabled = true;
  AreaCode: number = 0;
  CountryList: Array<INFSDropDownData> = [
    { id: 10, code: "10", TextValue: "Indonesia", OptionalData: { "isDefault": true }, ISMCOMDEALER: false, FINACETYPECODE: "", APPTYP: "", ISMCOMCAMPAIGN: false }
  ];
  OperatingRevenuDataSource: Array<IPRPL_TRCK_OPRT_RVNUInfo> = [];
  totalTruckOwnedDataSource: Array<IPRPL_TOTL_TRCK_OWNDInfo> = [];
  displayedColumns: string[] = ['addDataRow', 'TRUCKCATEGORYCDE', 'REVENUEUNIT', 'UNITINOPERATION', 'SUBTOTALREVENUE', 'deleterow'];
  displayedColumns1: string[] = ['addDataRow', 'TRUCKCATEGORYCDE', 'NOOFUNITS', 'MODEL', 'NOOFUNITSONCREDIT', 'BODYTYPECDE', 'deleterow'];

  public dataSourceOperatingRevenu = new MatTableDataSource<IPRPL_TRCK_OPRT_RVNUInfo>(this.OperatingRevenuDataSource);
  public dataSourceTruckOwned = new MatTableDataSource<IPRPL_TOTL_TRCK_OWNDInfo>(this.totalTruckOwnedDataSource);


  public operatingRevenueLabels = ['addOperatingDataRow', 'Truck Category', 'Revenue / Unit', 'Unit in Operation', 'Sub Total Revenue', "Delete"];
  public totalTruckOwnedLabels = ['addOperatingDataRow', 'Truck Category', 'Number of Unit', 'Model', 'Number of units that are still on credit', 'Body Type', 'Delete'];


  private subscription$ = new Subject();
  constructor(private _formMode: FormModeService, private _formbuilder: FormBuilder, private _FormState: StateManagment, public _truckMasterDataService: TruckDetailsMasterdataService, public _masterDataService: MasterDataService, public _addressMasterDataService: AddressMasterDataService, private _proposalForm: ProposalEntityFormService,
    private _proposalDataService: ProposalDataService, public dialogRef: MatDialogRef<TruckDetailComponent>,) { }

  ngOnInit(): void {
    if (this._formMode.FormMode == FormMode.VIEW) {
      this.isViewMode = true;
    }
    this._addressMasterDataService.getmasterDataForAddress().pipe(takeUntil(this.subscription$)).subscribe(a => {
      this._addressMasterDataService.InitializeAddressMasterData(a);
    });
    this.Truck.controls.PROPOSALTRUCKDETAIL.controls.COUNTRYID.setValue(10);
    this.OperatingRevenuDataSource = this.Truck.value.OPERATINGREVENUE as Array<IPRPL_TRCK_OPRT_RVNUInfo>;
    this.totalTruckOwnedDataSource = this.Truck.value.TOTALTRUCKOWNED as Array<IPRPL_TOTL_TRCK_OWNDInfo>;
    this.dataSourceOperatingRevenu = new MatTableDataSource<IPRPL_TRCK_OPRT_RVNUInfo>(this.OperatingRevenuDataSource.filter(x => x.RowState != DataRowState.Removed));
    this.dataSourceTruckOwned = new MatTableDataSource<IPRPL_TOTL_TRCK_OWNDInfo>(this.totalTruckOwnedDataSource.filter(x => x.RowState != DataRowState.Removed));

    this.valueChangeSubscriptions();
    this.updateTotalNumberOfUnits();
    this.updateTotalRevenu();
  }

  addOperatingRevenueData() {
    const operatingRevenue = this._proposalForm.TruckOperatingRevenueForm().value as IPRPL_TRCK_OPRT_RVNUInfo;
    this.OperatingRevenuDataSource.push(operatingRevenue);
    this.dataSourceOperatingRevenu = new MatTableDataSource<IPRPL_TRCK_OPRT_RVNUInfo>(this.OperatingRevenuDataSource.filter(x => x.RowState != DataRowState.Removed));
  }

  addTotalTruckOwnedData() {
    const truckOwned = this._proposalForm.TotalTruckOwnedForm().value as IPRPL_TOTL_TRCK_OWNDInfo;
    this.totalTruckOwnedDataSource.push(truckOwned);
    this.dataSourceTruckOwned = new MatTableDataSource<IPRPL_TOTL_TRCK_OWNDInfo>(this.totalTruckOwnedDataSource.filter(x => x.RowState != DataRowState.Removed));

  }

  removeOperatingRevenueRow(Element: any, index: any) {
    if (Element.RowState == DataRowState.Added) {
      this.OperatingRevenuDataSource = this.OperatingRevenuDataSource.filter(p => p != Element);
    } else {
      Element.RowState = DataRowState.Removed;
    }
    this.updateTotalRevenu();
    this.dataSourceOperatingRevenu = new MatTableDataSource<any>(this.OperatingRevenuDataSource.filter(x => x.RowState != DataRowState.Removed));
  }

  removeTotalTruckOwnedRow(Element: any, index: any) {
    if (Element.RowState == DataRowState.Added) {
      this.totalTruckOwnedDataSource = this.totalTruckOwnedDataSource.filter(p => p != Element);
    } else {
      Element.RowState = DataRowState.Removed;
    }
    this.updateTotalNumberOfUnits();
    this.dataSourceTruckOwned = new MatTableDataSource<IPRPL_TOTL_TRCK_OWNDInfo>(this.totalTruckOwnedDataSource.filter(x => x.RowState != DataRowState.Removed));
  }

  btnOK_Click() {
    if (!this.isViewMode) {
      this._proposalDataService.ASSETENTITY.controls.TRUCKDETAILS.controls.OPERATINGREVENUE.clear();
      this.OperatingRevenuDataSource.forEach(element => {
        this._proposalDataService.ASSETENTITY.controls.TRUCKDETAILS.controls.OPERATINGREVENUE.push(this._formbuilder.group<IPRPL_TRCK_OPRT_RVNUInfo>(element));
      });
      this._proposalDataService.ASSETENTITY.controls.TRUCKDETAILS.controls.TOTALTRUCKOWNED.clear();
      this.totalTruckOwnedDataSource.forEach(element => {
        this._proposalDataService.ASSETENTITY.controls.TRUCKDETAILS.controls.TOTALTRUCKOWNED.push(this._formbuilder.group<IPRPL_TOTL_TRCK_OWNDInfo>(element));
      });
    }

    this.dialogRef.close();
  }

  OPERATINGREVENUE_PropertyChanged(element: any, isSubTotal: boolean) {

    if (element.RowState != DataRowState.Added && element.RowState != DataRowState.Removed) {
      element.RowState = DataRowState.Updated;
    }
    if (isSubTotal) {
      this.updateTotalRevenu();
    }
  }

  TOTALTRUCKOWNED_PropertyChanged(element: any, isSubTotal: boolean) {

    if (element.RowState != DataRowState.Added && element.RowState != DataRowState.Removed) {
      element.RowState = DataRowState.Updated;
    }
    if (isSubTotal) {
      this.updateTotalNumberOfUnits();
    }
  }

  updateTotalRevenu() {
    this.Truck.controls.PROPOSALTRUCKDETAIL.controls.TOTALREVENUE.setValue(0);
    var sum = 0;
    this.OperatingRevenuDataSource.filter(x => x.RowState != DataRowState.Removed).forEach(element => {
      sum = sum + element.SUBTOTALREVENUE;
    })
    this.Truck.controls.PROPOSALTRUCKDETAIL.controls.TOTALREVENUE.setValue(sum);
    if (this.Truck.controls.PROPOSALTRUCKDETAIL.value.RowState != DataRowState.Added && this.Truck.controls.PROPOSALTRUCKDETAIL.value.RowState != DataRowState.Removed) {
      this.Truck.controls.PROPOSALTRUCKDETAIL.controls.RowState.setValue(DataRowState.Updated);
    }

  }
  updateTotalNumberOfUnits() {
    this.Truck.controls.PROPOSALTRUCKDETAIL.controls.TOTALNUMBEROFUNITS.setValue(0);
    var sum = 0;
    this.totalTruckOwnedDataSource.filter(x => x.RowState != DataRowState.Removed).forEach(element => {
      sum = sum + element.NOOFUNITS;
    })
    this.Truck.controls.PROPOSALTRUCKDETAIL.controls.TOTALNUMBEROFUNITS.setValue(sum);
    if (this.Truck.controls.PROPOSALTRUCKDETAIL.value.RowState != DataRowState.Added && this.Truck.controls.PROPOSALTRUCKDETAIL.value.RowState != DataRowState.Removed) {
      this.Truck.controls.PROPOSALTRUCKDETAIL.controls.RowState.setValue(DataRowState.Updated);
    }
  }
  //address
  resetRwRtAreacode() {
    this.Truck.controls.PROPOSALTRUCKDETAIL.controls.RWOTO.setValue('');
    this.Truck.controls.PROPOSALTRUCKDETAIL.controls.RTOTO.setValue('');
  }

  valueChangeSubscriptions() {

    this.Truck.controls.PROPOSALTRUCKDETAIL.controls.PROVINCEID.valueChanges
      .pipe(takeUntil(this.subscription$))
      .subscribe((val => {
        this.AllKotaByProvince = new Array<INFSDropDownData>();
        this.AllKecamatanByKota = new Array<INFSDropDownData>();
        this.AllKelurahanByKeca = new Array<INFSDropDownData>();
        let request = new mPOSMasterDataRequest();
        request.masterDataOperation = MasterData.kotamadyasByProvinceId;
        request.DATAS.provinceId = val;
        if (request.DATAS.provinceId > 0) {

          if (this._addressMasterDataService.AllKotaByProvince[request.DATAS.provinceId] == undefined ||
            this._addressMasterDataService.AllKotaByProvince[request.DATAS.provinceId].length == 0) {

            this._masterDataService.GetMasterData(request).pipe(takeUntil(this.subscription$)).subscribe((response) => {
              this.AllKotaByProvince = response?.ResultSet?.DataCollection;
              this._addressMasterDataService.AllKotaByProvince[request.DATAS.provinceId] = this.AllKotaByProvince;
            });
          }
          else {
            this.AllKotaByProvince = this._addressMasterDataService.AllKotaByProvince[request.DATAS.provinceId];
          }
        }
        // this.isRTRWDisable = true;
      }));

    this.Truck.controls.PROPOSALTRUCKDETAIL.controls.KOTAMADYAIDOTO.valueChanges
      .pipe(takeUntil(this.subscription$))
      .subscribe((val: any) => {
        this.AllKecamatanByKota = new Array<INFSDropDownData>();
        this.AllKelurahanByKeca = new Array<INFSDropDownData>();
        let request1 = new mPOSMasterDataRequest();
        request1.masterDataOperation = MasterData.kecamatansListBykotamadyasId;
        request1.DATAS.kotamadyasId = val;
        if (request1.DATAS.kotamadyasId > 0) {

          if (this._addressMasterDataService.AllKecamatanByKota[request1.DATAS.kotamadyasId] == undefined ||
            this._addressMasterDataService.AllKecamatanByKota[request1.DATAS.kotamadyasId].length == 0) {

            this._masterDataService.GetMasterData(request1).pipe(takeUntil(this.subscription$)).subscribe((response) => {
              this.AllKecamatanByKota = response?.ResultSet?.DataCollection;
              this._addressMasterDataService.AllKecamatanByKota[request1.DATAS.kotamadyasId] = this.AllKecamatanByKota;
            });

          }
          else {
            this.AllKecamatanByKota = this._addressMasterDataService.AllKecamatanByKota[request1.DATAS.kotamadyasId];
          }
        }
        // this.isRTRWDisable = true;
      })

    this.Truck.controls.PROPOSALTRUCKDETAIL.controls.KECAMATANIDOTO.valueChanges
      .pipe(takeUntil(this.subscription$))
      .subscribe((val: any) => {
        this.AllKelurahanByKeca = new Array<INFSDropDownData>();
        let request2 = new mPOSMasterDataRequest();
        request2.masterDataOperation = MasterData.kelurahanListBykecamatansId;
        request2.DATAS.kecamatansId = val;
        if (request2.DATAS.kecamatansId > 0) {
          if (this._addressMasterDataService.AllKelurahanByKeca[request2.DATAS.kecamatansId] == undefined ||
            this._addressMasterDataService.AllKelurahanByKeca[request2.DATAS.kecamatansId].length == 0) {

            this._masterDataService.GetMasterData(request2).pipe(takeUntil(this.subscription$)).subscribe((response) => {
              let params = this.addressParam();
              this.AreaCode = this._addressMasterDataService.buildAreaCode(params, true);
              response.ResultSet.DataCollection.sort((a: any, b: any) => a.OptionalData.localeCompare(b.OptionalData));
              response.ResultSet.DataCollection.forEach((data: any) => {
                data.TextValue = this.AreaCode + "." + data.OptionalData + " " + data.TextValue;
              })
              this.AllKelurahanByKeca = response?.ResultSet?.DataCollection;

              this._addressMasterDataService.AllKelurahanByKeca[request2.DATAS.kecamatansId] = this.AllKelurahanByKeca
            });
          }
          else {
            this.AllKelurahanByKeca = this._addressMasterDataService.AllKelurahanByKeca[request2.DATAS.kecamatansId];
          }
        }
        // this.isRTRWDisable = true;
      })

    this.Truck.controls.PROPOSALTRUCKDETAIL.controls.PRIVATEWORKSHOPIND.valueChanges
      .pipe(takeUntil(this.subscription$))
      .subscribe((val: any) => {
        if (!val) {
          this.fieldDisabled = true;
          this.Truck.controls.PROPOSALTRUCKDETAIL.controls.NOOFLABOURS.setValue(0);
        } else {
          this.fieldDisabled = false;
        }
      })
  }

  selectionChange_PROVINCEID(evnt: any) {
    if (evnt != undefined) {
      this.Truck.controls.PROPOSALTRUCKDETAIL.controls.KOTAMADYAIDOTO.setValue(-1);
      this.Truck.controls.PROPOSALTRUCKDETAIL.controls.KECAMATANIDOTO.setValue(-1);
      this.Truck.controls.PROPOSALTRUCKDETAIL.controls.KELURAHANIDOTO.setValue(-1);
      this.resetRwRtAreacode();
    }
  }

  selectionChange_KOTAMADYAIDOTO(evnt: any) {
    if (evnt != undefined) {
      this.Truck.controls.PROPOSALTRUCKDETAIL.controls.KECAMATANIDOTO.setValue(-1);
      this.Truck.controls.PROPOSALTRUCKDETAIL.controls.KELURAHANIDOTO.setValue(-1);
      this.resetRwRtAreacode();
    }
  }

  selectionChange_KECAMATANIDOTO(evnt: any) {
    if (evnt != undefined) {
      this.Truck.controls.PROPOSALTRUCKDETAIL.controls.KELURAHANIDOTO.setValue(-1);
      this.resetRwRtAreacode();
    }
  }

  addressParam() {
    let params = {} as AddressParm;
    params.provinceIds = this.Truck.controls.PROPOSALTRUCKDETAIL.controls.PROVINCEID.value;
    params.kotamadyaidotos = this.Truck.controls.PROPOSALTRUCKDETAIL.controls.KOTAMADYAIDOTO.value;
    params.kecamatanidotos = this.Truck.controls.PROPOSALTRUCKDETAIL.controls.KECAMATANIDOTO.value;
    params.kelurahanidotos = this.Truck.controls.PROPOSALTRUCKDETAIL.controls.KELURAHANIDOTO.value;
    params.rwotos = this.Truck.controls.PROPOSALTRUCKDETAIL.controls.RWOTO.value;
    params.rtotos = this.Truck.controls.PROPOSALTRUCKDETAIL.controls.RTOTO.value;

    return params
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }
}
