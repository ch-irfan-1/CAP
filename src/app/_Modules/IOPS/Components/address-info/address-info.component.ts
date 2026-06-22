import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { mPOSMasterDataRequest } from '@NFS_Core/NFSServices/MasterData/MasterdataHelper/mPOSMasterDataRequest';
import { StateManagment } from '@NFS_Core/RowStateManagement/FormStateManagement';
import * as QUOTENTITY from '@NFS_Entity/Quot-Entity/Quot.model.index';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { MasterData } from '@NFS_Enums/MasterData.enum';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { QuotEntityFormService } from '@NFS_Modules/IOPS/IOPSServices/QuotEntityForm.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from 'src/Library';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-address-info',
    templateUrl: './address-info.component.html',
    styleUrls: ['./address-info.component.css'],
    standalone: false
})
export class AddressInfoComponent implements OnInit, OnDestroy {
  @ViewChild("tabRef", { static: false }) tabGroup!: MatTabGroup;
  @Input() Addresses!: FormArray<QUOTENTITY.IQuotApplicantAddressEntity>;
  @Input() Mode: string = FormMode.VIEW;
  selected = new FormControl();
  searchText: number = 3;
  CountryList: Array<INFSDropDownData> = [
    { id: 10, code: "10", TextValue: "Indonesia", OptionalData: { "isDefault": true }, ISMCOMDEALER: false, FINACETYPECODE: "", APPTYP: "", ISMCOMCAMPAIGN: false }
  ];
  public columns = ['DEFAULTIND', 'TYPE', 'COUNTRYCODE', 'NUMBER', 'EXTENSIONNBR'];
  public labels = ['Default', 'Phone Type', 'Country Code', 'Phone Number', 'Extension'];

  PhoneForm: FormGroup<QUOTENTITY.IQUOT_APLT_PHNE_FAXInfo> = this._QuotForm.QuotApplicantPhoneInfoForm();
  addressStatusData!: Array<INFSDropDownData>;
  residenseTypeData!: Array<INFSDropDownData>;
  housingOwnershipData!: Array<INFSDropDownData>;
  provinceData!: Array<INFSDropDownData>;
  kotamadyaData!: Array<INFSDropDownData>;
  kecamatanData!: Array<INFSDropDownData>;
  kelurahanData!: Array<INFSDropDownData>;
  addressTypeData!: Array<INFSDropDownData>;
  relationshipData!: Array<INFSDropDownData>;
  defaultAddressData: any = [];
  phoneTypeData!: Array<INFSDropDownData>;
  request!: mPOSMasterDataRequest;
  NullVal: number | string = '';
  private subscription$ = new Subject();
  selectedInd!:number;
  constructor(private _QuotForm: QuotEntityFormService,
    public _masterDataService: MasterDataService,
    private _formBuilder: FormBuilder,
    private _toastr: ToastrService,
    private _FormState: StateManagment) { }


  get t() { return new FormArray([]) }

  ngOnInit(): void {
    this.initialization();
  }

  initialization() {
    //this.geIdTypeData();
    this.setValidator();
    this.setMode();
    this.PhoneForm.controls.COUNTRYCODE.setValue('62');
    this.PhoneForm.controls.COUNTRYCODE.disable();
  }
  tabSelectionChange(index:any)
  {
    if(index!=undefined){
      if(this.selectedInd<0){
        this.selectedInd=0;
      }
      if(index===this.Addresses.value.filter(p=>p.RowState!=DataRowState.Removed).length && index>0){
        this.selectedInd=this.Addresses.value.filter(p=>p.RowState!=DataRowState.Removed).length-1;
      }
      else{
        this.selectedInd=index;
      }
    }
  } 
  setValidator() {
    this.PhoneForm.controls.NUMBER.setValidators([Validators.maxLength(17), Validators.pattern("[1-9][0-9]*")]);
    this.PhoneForm.controls.NUMBER.updateValueAndValidity();
    this.PhoneForm.controls.EXTENSIONNBR.setValidators([Validators.maxLength(20), Validators.pattern("[1-9][0-9]*")]);
    this.PhoneForm.controls.EXTENSIONNBR.updateValueAndValidity();

    this.Addresses.controls[0].controls.QUOTAPLTADDS.controls.TIMEINMONTH.setValidators([Validators.min(0), Validators.max(12)]);
    this.Addresses.controls[0].controls.QUOTAPLTADDS.controls.TIMEINMONTH.updateValueAndValidity();
  }

  addAddress() {
    var address: FormGroup<QUOTENTITY.IQuotApplicantAddressEntity> = this._QuotForm.QuotApplicantAddressForm();
    address.controls.QUOTAPLTADDS.controls.ADDRESSID.setValue(this.Addresses.controls[this.Addresses.controls.length - 1].controls.QUOTAPLTADDS.controls.ADDRESSID.value + 1);
    address.controls.QUOTAPLTADDS.controls.COUNTRYID.setValue(10);
    //address.controls.QUOTAPLTADDS.controls.COUNTRYID.disable();
    address.controls.QUOTAPLTADDS.controls.ADDRESSTYPE.setValue([]);
    address.controls.QUOTAPLTADDS.controls.TIMEINMONTH.setValidators([Validators.min(0), Validators.max(12)]);
    address.controls.QUOTAPLTADDS.controls.TIMEINMONTH.updateValueAndValidity();

    this.Addresses.push(address);
    window.setTimeout(() => {
      this.selectedInd = this.Addresses.value.filter(obj => obj.RowState !== DataRowState.Removed).length - 1;
      this.tabGroup.selectedIndex = this.selectedInd;
    });
  }

  removeTab(object: any) {
    const index: number = this.Addresses.value.indexOf(object.value);
    var i:number=this.Addresses.value.filter(p=>p.RowState!=DataRowState.Removed).indexOf(object.value);
    if (object.controls.RowState.value == DataRowState.Added) {
      this.Addresses.removeAt(index);
    }
    else {
      this._FormState.ResetFormState(this.Addresses.controls[index], DataRowState.Removed);
      // object.controls.RowState.setValue(DataRowState.Removed);
      // object.controls.QUOTAPLTADDS.controls.RowState.setValue(DataRowState.Removed);
      // for (var i = 0; i < object.controls.QUOTAPLTADDSDETL.value.length; i++) {
      //   object.controls.QUOTAPLTADDSDETL.controls[i].controls.RowState.setValue(DataRowState.Removed);
      // }
      // for (var i = 0; i < object.controls.QUOTAPLTPHNEFAX.value.length; i++) {
      //   object.controls.QUOTAPLTPHNEFAX.controls[i].controls.RowState.setValue(DataRowState.Removed);
      // }

      // this.Addresses.controls[index].controls.RowState.setValue(DataRowState.Removed);
      // this.Addresses.controls[index].controls.QUOTAPLTADDS.controls.RowState.setValue(DataRowState.Removed);
      // for (var i = 0; i < this.Addresses.controls[index].controls.QUOTAPLTADDSDETL.value.length; i++) {
      //   this.Addresses.controls[index].controls.QUOTAPLTADDSDETL.controls[i].controls.RowState.setValue(DataRowState.Removed);
      // }
      // for (var i = 0; i < this.Addresses.controls[index].controls.QUOTAPLTPHNEFAX.value.length; i++) {
      //   this.Addresses.controls[index].controls.QUOTAPLTPHNEFAX.controls[i].controls.RowState.setValue(DataRowState.Removed);
      // }     
    }
    if (this.selectedInd > 0 && (this.selectedInd == i || this.selectedInd > i)) {
      window.setTimeout(() => {
        this.selectedInd = this.selectedInd - 1;
        this.tabGroup.selectedIndex = this.selectedInd;
      });
    }
  }


  // geAddressStatusData() {
  //   this.request = new mPOSMasterDataRequest();
  //   this.request.masterDataOperation = MasterData.AddressStatus;
  //   this._masterDataService.GetMasterData(this.request).subscribe((response) => {
  //     this.addressStatusData = response.FPS;
  //     });
  // }

  // geResidenseTypeData() {
  //   this.request = new mPOSMasterDataRequest();
  //   this.request.masterDataOperation = MasterData.ResidenceType;
  //   this._masterDataService.GetMasterData(this.request).subscribe((response) => {
  //     this.residenseTypeData = response.FPS;
  //   });
  // }

  // getHousingOwnershipData() {
  //   this.request = new mPOSMasterDataRequest();
  //   this.request.masterDataOperation = MasterData.HousingOwnership;
  //   this._masterDataService.GetMasterData(this.request).subscribe((response) => {
  //     this.housingOwnershipData = response.FPS;
  //   });
  // }

  // getProvinceData() {
  //   this.request = new mPOSMasterDataRequest();
  //   this.request.masterDataOperation = MasterData.AllProvincesByCountryId;
  //   this._masterDataService.GetMasterData(this.request).subscribe((response) => {
  //     this.provinceData = response.FPS;
  //   });
  // }

  // getKotamadyaData() {
  //   this.request = new mPOSMasterDataRequest();
  //   this.request.masterDataOperation = MasterData.kotamadyasByProvinceId;
  //   this._masterDataService.GetMasterData(this.request).subscribe((response) => {
  //     this.kotamadyaData = response.FPS;
  //   });
  // }

  // getkecamatanData() {
  //   this.request = new mPOSMasterDataRequest();
  //   this.request.masterDataOperation = MasterData.kecamatansListBykotamadyasId;
  //   this._masterDataService.GetMasterData(this.request).subscribe((response) => {
  //     this.kecamatanData = response.FPS;
  //   });
  // }

  // getkelurahanData() {
  //   this.request = new mPOSMasterDataRequest();
  //   this.request.masterDataOperation = MasterData.kelurahanListBykecamatansId;
  //   this._masterDataService.GetMasterData(this.request).subscribe((response) => {
  //     this.kelurahanData = response.FPS;
  //   });
  // }

  // getAddressTypeData() {
  //   this.request = new mPOSMasterDataRequest();
  //   this.request.masterDataOperation = MasterData.AddressTypeList;
  //   this._masterDataService.GetMasterData(this.request).subscribe((response) => {
  //     this.addressTypeData = response.FPS;
  //   });
  // }

  // getRelationshipData() {
  //   this.request = new mPOSMasterDataRequest();
  //   this.request.masterDataOperation = MasterData.RelationshipTypeListByCompanyId;
  //   this._masterDataService.GetMasterData(this.request).subscribe((response) => {
  //     this.relationshipData = response.FPS;
  //   });
  // }

  // getDefaultAddressData() {
  //   this.request = new mPOSMasterDataRequest();
  //   this.request.masterDataOperation = MasterData.AddressStatus;
  //   this._masterDataService.GetMasterData(this.request).subscribe((response) => {
  //     this.defaultAddressData = response.FPS;
  //   });
  // }

  // getPhoneTypeData() {
  //   this.request = new mPOSMasterDataRequest();
  //   this.request.masterDataOperation = MasterData.PhoneTypeListByCompanyId;
  //   this._masterDataService.GetMasterData(this.request).subscribe((response) => {
  //     this.phoneTypeData = response.FPS;
  //   });
  // }

  

  setMode() {
    if (this.Mode === FormMode.NEW) {
      this.Addresses.controls.forEach(address => {
        address.controls.QUOTAPLTADDS.controls.ADDRESSSTATUSCDE.enable();
        address.controls.QUOTAPLTADDS.controls.RESIDENCETYPECDE.enable();
        address.controls.QUOTAPLTADDS.controls.TIMEINYEAR.enable();
        address.controls.QUOTAPLTADDS.controls.TIMEINMONTH.enable();
        address.controls.QUOTAPLTADDS.controls.ADDRESSDETAIL.enable();
        //address.controls.QUOTAPLTADDS.controls.COUNTRYID.disable();
        address.controls.QUOTAPLTADDS.controls.PROVINCEID.enable();
        address.controls.QUOTAPLTADDS.controls.KOTAMADYAID.enable();
        address.controls.QUOTAPLTADDS.controls.RWNBR.enable();
        address.controls.QUOTAPLTADDS.controls.RTNBR.enable();
        address.controls.QUOTAPLTADDS.controls.ADDRESSDETAIL.enable();
        //address.controls.QUOTAPLTADDS.controls.CODE.enable();
        address.controls.QUOTAPLTADDS.controls.ADDRESSTYPECDE.enable();
        address.controls.QUOTAPLTADDS.controls.RLSPWITHCONTACTPERSON.enable();
        address.controls.QUOTAPLTADDS.controls.CONTACTPERSON.enable();
        if (address.controls.QUOTAPLTPHNEFAX.value.length > 0 && address.controls.QUOTAPLTPHNEFAX.value[0].ADDRESSID == 0
          && address.controls.QUOTAPLTPHNEFAX.value[0].NUMBER == '' && address.controls.QUOTAPLTPHNEFAX.value[0].COUNTRYCODE == '') {
          //address.controls.QUOTAPLTPHNEFAX.removeAt(0);
        }
        //set default value to country
        address.controls.QUOTAPLTADDS.controls.COUNTRYID.setValue(10);

        this.PhoneForm.controls.PHONETYPECDE.enable();
        this.PhoneForm.controls.COUNTRYCODE.enable();
        this.PhoneForm.controls.NUMBER.enable();
        this.PhoneForm.controls.EXTENSIONNBR.enable();
      });
    }
    else if (this.Mode === FormMode.VIEW) {
      this.Addresses.controls.forEach(address => {
        address.controls.QUOTAPLTADDS.controls.ADDRESSSTATUSCDE.disable();
        address.controls.QUOTAPLTADDS.controls.RESIDENCETYPECDE.disable();
        address.controls.QUOTAPLTADDS.controls.TIMEINYEAR.disable();
        address.controls.QUOTAPLTADDS.controls.TIMEINMONTH.disable();
        address.controls.QUOTAPLTADDS.controls.PROPERTYLOCATIONCDE.disable();
        address.controls.QUOTAPLTADDS.controls.HOUSINGOWNERSHIPCDE.disable();
        address.controls.QUOTAPLTADDS.controls.ADDRESSDETAIL.disable();
        address.controls.QUOTAPLTADDS.controls.COUNTRYID.disable();
        address.controls.QUOTAPLTADDS.controls.PROVINCEID.disable();
        address.controls.QUOTAPLTADDS.controls.KOTAMADYAID.disable();
        address.controls.QUOTAPLTADDS.controls.KECAMATANID.disable();
        address.controls.QUOTAPLTADDS.controls.KELURAHANID.disable();
        address.controls.QUOTAPLTADDS.controls.RWNBR.disable();
        address.controls.QUOTAPLTADDS.controls.RTNBR.disable();
        address.controls.QUOTAPLTADDS.controls.ADDRESSDETAIL.disable();
        //address.controls.QUOTAPLTADDS.controls.CODE.disable();
        address.controls.QUOTAPLTADDS.controls.POSTALCODE.disable();
        address.controls.QUOTAPLTADDS.controls.ADDRESSTYPECDE.disable();
        address.controls.QUOTAPLTADDS.controls.DEFAULTADDRESS.disable();
        address.controls.QUOTAPLTADDS.controls.RLSPWITHCONTACTPERSON.disable();
        address.controls.QUOTAPLTADDS.controls.CONTACTPERSON.disable();

        //address.controls.ApplicantAddressDetail.controls.DEFAULTIND.disable();

        this.PhoneForm.controls.PHONETYPECDE.disable();
        this.PhoneForm.controls.COUNTRYCODE.disable();
        this.PhoneForm.controls.NUMBER.disable();
        this.PhoneForm.controls.EXTENSIONNBR.disable();
      });
    }
  }

  testChange(Addressindex: any) {
    alert("data changed")
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }
}
