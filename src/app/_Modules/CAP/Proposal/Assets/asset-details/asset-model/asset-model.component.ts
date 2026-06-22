import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorSelectConfig, PageEvent } from '@angular/material/paginator';
import { AssetSearchMasterdataService } from '@NFS_Core/NFSServices/MasterData/asset-search-masterdata.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { mPOSMasterDataRequest } from '@NFS_Core/NFSServices/MasterData/MasterdataHelper/mPOSMasterDataRequest';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { StateManagment } from '@NFS_Core/RowStateManagement/FormStateManagement';
import { IAssetSearchInfo } from '@NFS_Entity/Proposal-Entity/IAsset-Search-info';
import { IPRPL_ASETInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/ProposalArticleEntity.model.index';
import { AssetSelection } from '@NFS_Enums/AssetSelection.enum';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { MasterData } from '@NFS_Enums/MasterData.enum';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { IAssetInfoParams as IAssetInfoParams } from '@NFS_Interfaces/RequestInterfaces/asset-search-info-params';
import { CalculationService } from '@NFS_Modules/CAP/CAPServices/calculation.service';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { ProposalManagerService } from '@NFS_Modules/CAP/_helpers/proposal-manager.service';
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
import { FormArray, FormBuilder, FormGroup } from 'src/Library';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
    selector: 'app-asset-model',
    templateUrl: './asset-model.component.html',
    styleUrls: ['./asset-model.component.css'],
    standalone: false
})
export class AssetModelComponent implements OnInit, OnDestroy {
  tempData: any = [{ code: "00001", TextValue: "one 1" }, { code: "00002", TextValue: "two 2" }, { code: "00003", TextValue: "three 3" }];
  PROPOSALASSET!: FormGroup<IAssetSearchInfo>;
  PROPOSALASSETInfo!: FormGroup<IPRPL_ASETInfo>;
  searchPanel = true;
  resultPanel = false;
  private subscription$ = new Subject();
  AssetSearchInfoParams = {} as IAssetInfoParams;
  public AssetSearchInfo: FormArray<IPRPL_ASETInfo> = this._formBuilder.array<IPRPL_ASETInfo>([]);
  AssetSearchInfoResultSet = [] as Array<IPRPL_ASETInfo>;
  public assetSearchColumns = ['ASSETSUBTYPDSC', 'MAKEDSC', 'BRANDDSC', 'MODELDSC'];
  public assetSearchLabels = ['Asset Sub Type', 'Asset Make', 'Asset Brand', 'Asset Model'];
  public assetSearchPipes:Array<any>= [null,null,null,null];
  @Input() Mode: string = FormMode.NEW;
  NullVal: number | string = '';
  public totalRows: number = 0;
  dataSourcelength = 0;
  pageSizeOptions: number[] = [25, 50, 75, 100];
  selectedPageSize: number = 10;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator | undefined;
  resetGridPage: boolean = false;
  public AssetType: INFSDropDownData[] = [];
  public AssetSubType: INFSDropDownData[] = [];
  public AssetMake: INFSDropDownData[] = [];
  public AssetBrand: INFSDropDownData[] = [];
  public AssetModel: INFSDropDownData[] = [];

  constructor(private _formBuilder: FormBuilder, private _proposalDataService: ProposalDataService, private _masterDataService: MasterDataService, private _toastr: ToastrService,
    public _assetSearchMasterDataService: AssetSearchMasterdataService, public _proposalService: ProposalService, public _proposalFormService: ProposalEntityFormService,
    public appConfig: AppConfigService,
    private _FormState: StateManagment, public dialogRef: MatDialogRef<AssetModelComponent>, private _proposalManagerService: ProposalManagerService, private _calculationService: CalculationService) { }

  paginatorSelectConfig:MatPaginatorSelectConfig = {
    panelClass: "paginator-select-overlay"
  }
  ngOnInit(): void {
    this.PROPOSALASSETInfo = this._proposalDataService.PROPOSALASSET;
    this.PROPOSALASSET = this._proposalFormService.AssetSearchInfo();

    if (this.PROPOSALASSETInfo.controls.ASSETSELECTIONCDE.value == "00002") {
      this.assetSearchColumns = ['ASSETTYPEDSC', 'ASSETSUBTYPDSC', 'MAKEDSC', 'BRANDDSC', 'BPKBNUMBER', 'LICENSEPLATENUMBR', 'COLORDESC', 'ENGINENUMBER', 'RETURNDTE', 'NETBOOKVALUE'];
      this.assetSearchLabels = ['Asset Type', 'Asset Sub Type', 'Asset Make', 'Asset Brand', 'BPKB', 'License Plate Number', 'Color', 'Engine #', 'Return Date', 'Net Book Value'];
      this.assetSearchPipes=[null,null,null,null,null,null,null,null,null,'formatCurrency'];
    }
    else {
      this.assetSearchColumns = ['ASSETSUBTYPDSC', 'MAKEDSC', 'BRANDDSC', 'MODELDSC'];
      this.assetSearchLabels = ['Asset Sub Type', 'Asset Make', 'Asset Brand', 'Asset Model'];
    }
    this.valueChangeSubscriptions();
  }

  valueChangeSubscriptions() {

    if (this.PROPOSALASSETInfo.controls.ASSETSELECTIONCDE.value == AssetSelection.Inventory) {
      this.PROPOSALASSET.controls.BPKBNUMBER.setValue('');
      this.PROPOSALASSET.controls.LICENSEPLATENUMBR.setValue('');
      this.PROPOSALASSET.controls.ENGINENUMBER.setValue('');
    }


    this.PROPOSALASSET.controls.ASSETTYPECDE.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(x => {
      this.PROPOSALASSET.controls.ASSETSUBTYPCDE.setValue('');
      this.PROPOSALASSET.controls.ASSETMAKECDE.setValue('');
      this.PROPOSALASSET.controls.ASSETBRANDCDE.setValue('');
      this.PROPOSALASSET.controls.ASSETMODELCDE.setValue('');

      //inventory case
      // if(this.PROPOSALASSETInfo.controls.ASSETSELECTIONCDE.value == "00002"){
      //   this.PROPOSALASSET.controls.ENGINENUMBER.setValue('');
      //   this.PROPOSALASSET.controls.LICENSEPLATENUMBR.setValue('');
      //   this.PROPOSALASSET.controls.BPKBNUMBER.setValue('');
      // }
      
      let request = new mPOSMasterDataRequest();
      request.masterDataOperation = MasterData.AssetSubType;
      request.DATAS.AssetTypeCode = this.PROPOSALASSET.value.ASSETTYPECDE;
      request.DATAS.TPLEASETMODLSEQID = this._proposalDataService.TPLEASETMODLSEQID;
      if (request.DATAS.AssetTypeCode != "" && request.DATAS.TPLEASETMODLSEQID > 0) {
        this._masterDataService.GetMasterData(request).pipe(takeUntil(this.subscription$)).subscribe((response) => {
          this.AssetSubType = response?.ResultSet?.DataCollection;
        });
        //this.PROPOSALASSET.controls.ASSETTYPEDSC.setValue(this._assetSearchMasterDataService.AssetType?.filter(val => val.code == this.PROPOSALASSET.value.ASSETTYPECDE)[0]?.TextValue);
      }
    });

    this.PROPOSALASSET.controls.ASSETSUBTYPCDE.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(x => {
      if (x === this.NullVal) {
        this.PROPOSALASSET.controls.ASSETMAKECDE.setValue('');
        this.PROPOSALASSET.controls.ASSETBRANDCDE.setValue('');
        this.PROPOSALASSET.controls.ASSETMODELCDE.setValue('');
      }
      let request = new mPOSMasterDataRequest();
      request.masterDataOperation = MasterData.CAPAssetMake;
      request.DATAS.AssetTypeCode = this.PROPOSALASSET.value.ASSETTYPECDE;
      request.DATAS.TPLEASETMODLSEQID = this._proposalDataService.TPLEASETMODLSEQID;
      request.DATAS.AssetSubTypeCode = this.PROPOSALASSET.value.ASSETSUBTYPCDE;
      if (request.DATAS.AssetSubTypeCode != "") {
        this._masterDataService.GetMasterData(request).pipe(takeUntil(this.subscription$)).subscribe((response) => {
          this.AssetMake = response?.ResultSet?.DataCollection;
        });
        //this.PROPOSALASSET.controls.ASSETSUBTYPDSC.setValue(this._assetSearchMasterDataService.AssetSubType?.filter(val => val.code == this.PROPOSALASSET.controls.ASSETSUBTYPCDE.value)[0]?.TextValue);
      }
    });

    this.PROPOSALASSET.controls.ASSETMAKECDE.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(x => {
      if (x === this.NullVal) {
        this.PROPOSALASSET.controls.ASSETBRANDCDE.setValue('');
        this.PROPOSALASSET.controls.ASSETMODELCDE.setValue('');
      }
      let request = new mPOSMasterDataRequest();
      request.masterDataOperation = MasterData.AssetBrand;
      request.DATAS.AssetTypeCode = this.PROPOSALASSET.value.ASSETTYPECDE;
      request.DATAS.TPLEASETMODLSEQID = this._proposalDataService.TPLEASETMODLSEQID;
      request.DATAS.AssetSubTypeCode = this.PROPOSALASSET.value.ASSETSUBTYPCDE;
      request.DATAS.AssetMakeCode = this.PROPOSALASSET.value.ASSETMAKECDE;
      if (request.DATAS.AssetMakeCode != "") {
        this._masterDataService.GetMasterData(request).pipe(takeUntil(this.subscription$)).subscribe((response) => {
          this.AssetBrand = response?.ResultSet?.DataCollection;
        });
        //this.PROPOSALASSET.controls.MAKEDSC.setValue(this._assetSearchMasterDataService.AssetMake?.filter(val => val.code == this.PROPOSALASSET.controls.MAKECDE.value)[0]?.TextValue);
      }
    });

    this.PROPOSALASSET.controls.ASSETBRANDCDE.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(x => {
      if (x === this.NullVal) {
        this.PROPOSALASSET.controls.ASSETMODELCDE.setValue('');
      }
      let request = new mPOSMasterDataRequest();
      request.masterDataOperation = MasterData.AssetModel;
      request.DATAS.AssetTypeCode = this.PROPOSALASSET.value.ASSETTYPECDE;
      request.DATAS.TPLEASETMODLSEQID = this._proposalDataService.TPLEASETMODLSEQID;
      request.DATAS.AssetSubTypeCode = this.PROPOSALASSET.value.ASSETSUBTYPCDE;
      request.DATAS.AssetMakeCode = this.PROPOSALASSET.value.ASSETMAKECDE;
      request.DATAS.AssetBrandCode = this.PROPOSALASSET.value.ASSETBRANDCDE;
      if (request.DATAS.AssetBrandCode != "") {
        this._masterDataService.GetMasterData(request).pipe(takeUntil(this.subscription$)).subscribe((response) => {
          this.AssetModel = response?.ResultSet?.DataCollection;
        });
        //this.PROPOSALASSET.controls.BRANDDSC.setValue(this._assetSearchMasterDataService.AssetBrand?.filter(val => val.code == this.PROPOSALASSET.controls.BRANDCDE.value)[0]?.TextValue);
      }
    });

  }

  ShowResults(pagesize: number = 10, pageno: number = 1, resetSearch: boolean = true) {
    if (resetSearch) {
      this.ResetAssetSearchParams();
      this.ResetMasterData();
      this.paginator?.firstPage();
    }
    this.AssetSearchInfoParams.ConfigurationTemplateId = 10;
    this.AssetSearchInfoParams.PAGENO = pageno;
    this.AssetSearchInfoParams.PAGESIZE = pagesize;
    if (this.PROPOSALASSETInfo.controls.ASSETSELECTIONCDE.value == AssetSelection.Inventory) {
      this._proposalService.ReadInventoryAssetSearch(this.AssetSearchInfoParams).pipe(takeUntil(this.subscription$)).subscribe(res => {
        this.SetSearchResults(res);
      });
    }
    else {
      this._proposalService.ReadAssetSearch(this.AssetSearchInfoParams).pipe(takeUntil(this.subscription$)).subscribe(res => {
        this.SetSearchResults(res);
      });
    }
    this.resultPanel = true;
  }

  SetSearchResults(res: any) {
    if (res.ResultSet !== null && res.ResultSet.length > 0) {
      this.AssetSearchInfo = this._formBuilder.array(res.ResultSet.map((r: any) => this._formBuilder.group(r)));
      this.dataSourcelength = this.AssetSearchInfo.value[0].TOTALROWS
    }
    else {
      this.AssetSearchInfo = this._formBuilder.array<IPRPL_ASETInfo>([]);
      this.dataSourcelength = 0;
    }
  }

  ResetAssetSearchParams() {
    this.PROPOSALASSET.patchValue({
      ASSETTYPECDE: '',
      ASSETSUBTYPCDE: '',
      ASSETMAKECDE: '',
      ASSETBRANDCDE: '',
      ASSETMODELCDE: '',
      LICENSEPLATENUMBR:'',
      BPKBNUMBER:'',
      ENGINENUMBER:''
    }, { emitEvent: false, onlySelf: true });

    this.AssetSearchInfoParams.AssetTypeCode = "";
    this.AssetSearchInfoParams.AssetSubTypeCode = "";
    this.AssetSearchInfoParams.AssetMakeCode = "";
    this.AssetSearchInfoParams.AssetBrandCode = "";
    this.AssetSearchInfoParams.AssetModelCode = "";
    this.AssetSearchInfoParams.BPKBNbr="";
    this.AssetSearchInfoParams.EngineNbr="";
    this.AssetSearchInfoParams.PlateNbr="";
  }

  ResetMasterData() {
    this.AssetSubType = [];
    this.AssetMake = [];
    this.AssetBrand = [];
    this.AssetModel = [];
  }

  ShowResultsbyTemplateID(pagesize: number = 10, pageno: number = 1, resetSearch: boolean = true) {
    this.AssetSearchInfoParams.ConfigurationTemplateId = this._proposalDataService.TPLEASETMODLSEQID;
    this.AssetSearchInfoParams.AssetTypeCode = this.PROPOSALASSET.value.ASSETTYPECDE;
    this.AssetSearchInfoParams.AssetSubTypeCode = this.PROPOSALASSET.value.ASSETSUBTYPCDE;
    this.AssetSearchInfoParams.AssetMakeCode = this.PROPOSALASSET.value.ASSETMAKECDE;
    this.AssetSearchInfoParams.AssetBrandCode = this.PROPOSALASSET.value.ASSETBRANDCDE;
    this.AssetSearchInfoParams.AssetModelCode = this.PROPOSALASSET.value.ASSETMODELCDE;

    if (this.PROPOSALASSETInfo.controls.ASSETSELECTIONCDE.value == AssetSelection.Inventory) {
      this.AssetSearchInfoParams.BPKBNbr=this.PROPOSALASSET.value.BPKBNUMBER;
      this.AssetSearchInfoParams.PlateNbr=this.PROPOSALASSET.value.LICENSEPLATENUMBR;
      this.AssetSearchInfoParams.EngineNbr=this.PROPOSALASSET.value.ENGINENUMBER;
    }

    this.AssetSearchInfoParams.PAGENO = pageno;
    this.AssetSearchInfoParams.PAGESIZE = pagesize;
    if ((this.PROPOSALASSETInfo.controls.ASSETSELECTIONCDE.value == AssetSelection.Purchase && this.PROPOSALASSET.value.ASSETTYPECDE == "" ) || 
      (this.PROPOSALASSETInfo.controls.ASSETSELECTIONCDE.value == AssetSelection.Inventory && this.PROPOSALASSET.value.ASSETTYPECDE == "" && this.AssetSearchInfoParams.BPKBNbr=="" && this.AssetSearchInfoParams.PlateNbr=="" && this.AssetSearchInfoParams.EngineNbr=="")) {
      this._toastr.clear();
      this._toastr.warning('Please Select Search Criteria.');
      return;
    }
    else {
      if (resetSearch) {
        this.paginator?.firstPage();
      }

      if (this.PROPOSALASSETInfo.controls.ASSETSELECTIONCDE.value == AssetSelection.Inventory) {
        this._proposalService.ReadInventoryAssetSearch(this.AssetSearchInfoParams).pipe(takeUntil(this.subscription$)).subscribe(res => {
          this.SetSearchResults(res);
        });
      }
      else {
        this._proposalService.ReadCustomAssetSearchByTemplateId(this.AssetSearchInfoParams).pipe(takeUntil(this.subscription$)).subscribe(res => {
          this.SetSearchResults(res);
        });
      }


      this.resultPanel = true;
    }
  }

  loadAsset(obj: any) {
    this.dialogRef.close(obj);
  }

  childOutput(event: any) {
  }

  public PageSelectionChanged(event: PageEvent) {
    var pageIndex: number = event.pageIndex + 1;
    if (this.PROPOSALASSET.value.ASSETTYPECDE != '') {
      this.ShowResultsbyTemplateID(this.selectedPageSize, pageIndex, false);
    }
    else {
      this.ShowResults(this.selectedPageSize, pageIndex, false);
    }
  }

  ResetResults() {
    this.PROPOSALASSET.controls.ASSETTYPECDE.setValue('');
    this.ResetMasterData();
    this.AssetSearchInfo = this._formBuilder.array<IPRPL_ASETInfo>([]);
    this.dataSourcelength = 0;
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }

}
