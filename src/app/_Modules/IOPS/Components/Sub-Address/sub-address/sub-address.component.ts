import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-sub-address',
    templateUrl: './sub-address.component.html',
    styleUrls: ['./sub-address.component.css'],
    standalone: false
})
export class SubAddressComponent implements OnInit,OnChanges, OnDestroy{

  @Input() address!: FormGroup<QUOTENTITY.IQuotApplicantAddressEntity>;
  @Input() Mode: string = FormMode.VIEW;
  @Input() Parent!: FormArray<QUOTENTITY.IQuotApplicantAddressEntity>;
  PhoneForm: FormGroup<QUOTENTITY.IQUOT_APLT_PHNE_FAXInfo> = this._QuotForm.QuotApplicantPhoneInfoForm();
  public columns = ['DEFAULTIND', 'TYPE', 'COUNTRYCODE', 'NUMBER', 'EXTENSIONNBR'];
  public labels = ['Default', 'Phone Type', 'Country Code', 'Phone Number', 'Extension'];
  CountryList: Array<INFSDropDownData> = [
    { id: 10, code: "10", TextValue: "Indonesia", OptionalData: { "isDefault": true }, ISMCOMDEALER: false, FINACETYPECODE: "", APPTYP: "", ISMCOMCAMPAIGN: false }
  ];
  public AllKotaByProvince: any = [];
  public AllKecamatanByKota: any = [];
  public AllKelurahanByKeca: any = [];
  phoneTypeData!: Array<INFSDropDownData>;
  defaultAddressData: any = [];
  request!: mPOSMasterDataRequest;
  private subscription$ = new Subject();
  NullVal: number | string = '';

  constructor(private _QuotForm: QuotEntityFormService,
    public _masterDataService: MasterDataService,
    private _formBuilder: FormBuilder,
    private _toastr: ToastrService,
    private _FormState: StateManagment) { }

  ngOnInit(): void {
    this.geIdTypeData();
    this.setValidator();
   // this.setMode();
    this.PhoneForm.controls.COUNTRYCODE.setValue('62');
    this.PhoneForm.controls.COUNTRYCODE.disable();
    this.valueChangeSubscriptions();
  }
  childOutput(event: any) {

  }
  ngOnChanges(changes: SimpleChanges): void {

      this.defaultAddressData[this.address.controls.QUOTAPLTADDS.controls.ADDRESSID.value] = [];
      let tempDefaultAddressArray = [];
      let AddressTypeList: string[] = [];
      let defaultAddress = ''
      for (var j = 0; j < this.address.controls.QUOTAPLTADDSDETL.length; j++) {
        AddressTypeList.push(this.address.controls.QUOTAPLTADDSDETL.value[j].ADDRESSTYPECDE)
        tempDefaultAddressArray.push(this._masterDataService.AddressTypeSetup.filter(x => x.code == this.address.controls.QUOTAPLTADDSDETL.value[j].ADDRESSTYPECDE)[0]);
        if (this.address.controls.QUOTAPLTADDSDETL.value[j].DEFAULTIND == true)
          defaultAddress = this.address.controls.QUOTAPLTADDSDETL.value[j].ADDRESSTYPECDE;
      }

      this.defaultAddressData[this.address.controls.QUOTAPLTADDS.controls.ADDRESSID.value] = tempDefaultAddressArray;
      this.address.controls.QUOTAPLTADDS.controls.ADDRESSTYPE.setValue(AddressTypeList);
      this.address.controls.QUOTAPLTADDS.controls.DEFAULTADDRESS.setValue(defaultAddress)
    
    //this.setMode();
    // this.PhoneForm.controls.COUNTRYCODE.setValue('62');
    // this.PhoneForm.controls.COUNTRYCODE.disable();
  }
  valueChangeSubscriptions() {

    this.address.controls.QUOTAPLTADDS.controls.PROVINCEID.valueChanges
      .pipe(takeUntil(this.subscription$))
      .subscribe((val => {
        this.AllKotaByProvince = new Array<INFSDropDownData>();
        this.AllKecamatanByKota = new Array<INFSDropDownData>();
        this.AllKelurahanByKeca = new Array<INFSDropDownData>();
        let request = new mPOSMasterDataRequest();
        request.masterDataOperation = MasterData.kotamadyasByProvinceId;
        request.DATAS.provinceId = val;
        if (request.DATAS.provinceId > 0) {

          if (this._masterDataService.AllKotaByProvince[request.DATAS.provinceId] == undefined ||
            this._masterDataService.AllKotaByProvince[request.DATAS.provinceId].length == 0) {

            this._masterDataService.GetMasterData(request).pipe(takeUntil(this.subscription$)).subscribe((response) => {
              this.AllKotaByProvince = response?.ResultSet?.DataCollection;
              this._masterDataService.AllKotaByProvince[request.DATAS.provinceId] = this.AllKotaByProvince;
            });
          }
          else {
            this.AllKotaByProvince = this._masterDataService.AllKotaByProvince[request.DATAS.provinceId];
          }
        }
      }));

    this.address.controls.QUOTAPLTADDS.controls.KOTAMADYAID.valueChanges
      .pipe(takeUntil(this.subscription$))
      .subscribe((val: any) => {
        this.AllKecamatanByKota = new Array<INFSDropDownData>();
        this.AllKelurahanByKeca = new Array<INFSDropDownData>();
        let request1 = new mPOSMasterDataRequest();
        request1.masterDataOperation = MasterData.kecamatansListBykotamadyasId;
        request1.DATAS.kotamadyasId = val;
        if (request1.DATAS.kotamadyasId > 0) {

          if (this._masterDataService.AllKecamatanByKota[request1.DATAS.kotamadyasId] == undefined ||
            this._masterDataService.AllKecamatanByKota[request1.DATAS.kotamadyasId].length == 0) {

            this._masterDataService.GetMasterData(request1).pipe(takeUntil(this.subscription$)).subscribe((response) => {
              this.AllKecamatanByKota = response?.ResultSet?.DataCollection;
              this._masterDataService.AllKecamatanByKota[request1.DATAS.kotamadyasId] = this.AllKecamatanByKota;
            });

          }
          else {
            this.AllKecamatanByKota = this._masterDataService.AllKecamatanByKota[request1.DATAS.kotamadyasId];
          }
        }
      })

    this.address.controls.QUOTAPLTADDS.controls.KECAMATANID.valueChanges
      .pipe(takeUntil(this.subscription$))
      .subscribe((val: any) => {
        this.AllKelurahanByKeca = new Array<INFSDropDownData>();
        let request2 = new mPOSMasterDataRequest();
        request2.masterDataOperation = MasterData.kelurahanListBykecamatansId;
        request2.DATAS.kecamatansId = val;
        if (request2.DATAS.kecamatansId > 0) {
          if (this._masterDataService.AllKelurahanByKeca[request2.DATAS.kecamatansId] == undefined ||
            this._masterDataService.AllKelurahanByKeca[request2.DATAS.kecamatansId].length == 0) {

            this._masterDataService.GetMasterData(request2).pipe(takeUntil(this.subscription$)).subscribe((response) => {
              //let params = this.addressParam();
              //this.AreaCode = this._masterDataService.buildAreaCode(params, true);
              response.ResultSet.DataCollection.sort((a:any,b:any)=>a.OptionalData.localeCompare(b.OptionalData));
              // response.ResultSet.DataCollection.forEach((data: any) => {
              //   data.TextValue = this.AreaCode+"."+ data.OptionalData + " " + data.TextValue;
              // })
              this.AllKelurahanByKeca = response?.ResultSet?.DataCollection;

              this._masterDataService.AllKelurahanByKeca[request2.DATAS.kecamatansId] = this.AllKelurahanByKeca
            });
          }
          else {
            this.AllKelurahanByKeca = this._masterDataService.AllKelurahanByKeca[request2.DATAS.kecamatansId];
          }
        }
        //this.isRTRWDisable = true;
      })
  }
  addPhone(phoneArray: any, Addressindex: any) {
    if (!this.PhoneForm.controls.PHONETYPECDE.value) {
      this._toastr.warning('Phone Type is Required.')
      return;
    }
    if (!this.PhoneForm.controls.NUMBER.value) {
      this._toastr.warning('Phone Number is Required Fields.')
      return;
    }
    else if (!this.PhoneForm.controls.NUMBER.valid) {
      this._toastr.warning('Phone Number is invalid.')
      return;
    }
    if (!this.PhoneForm.controls.EXTENSIONNBR.valid) {
      this._toastr.warning('Extension is invalid.')
      return;
    }
    var element: FormGroup<QUOTENTITY.IQUOT_APLT_PHNE_FAXInfo> = this._QuotForm.QuotApplicantPhoneInfoForm();
    var isDefaultExisting = phoneArray.value?.find((x: any) => x.DEFAULTIND == true && x.RowState != DataRowState.Removed);
    let phone = this.phoneTypeData?.find(t => t.code === this.PhoneForm.controls.PHONETYPECDE.value);
    element.controls.TYPE.setValue(phone?.TextValue || '');
    element.controls.PHONETYPECDE.setValue(this.PhoneForm.controls.PHONETYPECDE.value);
    element.controls.COUNTRYCODE.setValue(this.PhoneForm.controls.COUNTRYCODE.value);
    element.controls.EXTENSIONNBR.setValue(this.PhoneForm.controls.EXTENSIONNBR.value);
    if (!isDefaultExisting) {
      element.controls.DEFAULTIND.setValue(true);
    }
    else
      element.controls.DEFAULTIND.setValue(this.PhoneForm.controls.DEFAULTIND.value);
    element.controls.NUMBER.setValue(this.PhoneForm.controls.NUMBER.value);
    //this.Addresses.controls[Addressindex].controls.QUOTAPLTPHNEFAX.push(element);
    phoneArray.push(element);
    this.resetPhoneValues();
  }

  resetPhoneValues() {
    this.PhoneForm.controls.TYPE.setValue('');
    this.PhoneForm.controls.PHONETYPECDE.setValue('');
    this.PhoneForm.controls.COUNTRYCODE.setValue('62');
    this.PhoneForm.controls.COUNTRYCODE.disable();
    this.PhoneForm.controls.EXTENSIONNBR.setValue('');
    this.PhoneForm.controls.DEFAULTIND.setValue(false);
    this.PhoneForm.controls.NUMBER.setValue('');
  }

  geIdTypeData() {
    this.phoneTypeData = this._masterDataService.AllPhoneTypes;
  }
  setValidator() {
    this.PhoneForm.controls.NUMBER.setValidators([Validators.maxLength(17), Validators.pattern("[1-9][0-9]*")]);
    this.PhoneForm.controls.NUMBER.updateValueAndValidity();
    this.PhoneForm.controls.EXTENSIONNBR.setValidators([Validators.maxLength(20), Validators.pattern("[1-9][0-9]*")]);
    this.PhoneForm.controls.EXTENSIONNBR.updateValueAndValidity();

    // this.Addresses.controls[0].controls.QUOTAPLTADDS.controls.TIMEINMONTH.setValidators([Validators.min(0), Validators.max(12)]);
    // this.Addresses.controls[0].controls.QUOTAPLTADDS.controls.TIMEINMONTH.updateValueAndValidity();
  }
  addressTypeChange(event: any, object: any) {

    if (event.value.length > 1 && event.value.includes('00007')) {
      for (var i = 0; i < event.value.length; i++) {
        if (event.value[i] == '00007') {
          event.value.splice(i, 1)
          break;
        }
      }
      object.controls.QUOTAPLTADDS.controls.ADDRESSTYPE.setValue(event.value);
      this._toastr.clear();
      this._toastr.warning("Selection of Emergency Address with other Addresses is not allowed.");
    }
    if (event.value.includes('00007')) {
      var result = this.DuplicateValidations(object.controls.QUOTAPLTADDS.controls.ADDRESSID.value, '00007');
      if (!result.IsValid) {
        for (var i = 0; i < event.value.length; i++) {
          if (event.value[i] == '00007') {
            event.value.splice(i, 1)
            break;
          }
        }
        object.controls.QUOTAPLTADDS.controls.ADDRESSTYPE.setValue(event.value);
        return;
      }
    }
    if (event.value.includes('00001')) {
      var result = this.DuplicateValidations(object.controls.QUOTAPLTADDS.controls.ADDRESSID.value, '00001');
      if (!result.IsValid) {
        for (var i = 0; i < event.value.length; i++) {
          if (event.value[i] == '00001') {
            event.value.splice(i, 1)
            break;
          }
        }
        object.controls.QUOTAPLTADDS.controls.ADDRESSTYPE.setValue(event.value);
        return;
      }
    }

    let tempDefaultAddressArray: any = [];
    this.defaultAddressData[object.controls.QUOTAPLTADDS.controls.ADDRESSID.value] = [];
    let defaultAddress = object.controls.QUOTAPLTADDSDETL.value.find((x: any) => x.DEFAULTIND == true)?.ADDRESSTYPECDE || '';

    object.controls.QUOTAPLTADDSDETL.controls.forEach((control: any) => {
      this._FormState.ResetFormState(control, DataRowState.Removed);
    });

    if (!event.value.includes("00007")) {
      object.controls.QUOTAPLTADDS.controls.RLSPWITHCONTACTPERSON.setValue('');
      object.controls.QUOTAPLTADDS.controls.CONTACTPERSON.setValue('');
      //object.controls.QUOTAPLTADDS.controls.DEFAULTADDRESS.enable()
    }
    for (var i = 0; i < event.value.length; i++) {
      var addressTypeDetail: FormGroup<QUOTENTITY.IQUOT_APLT_ADDS_DETLInfo> = this._QuotForm.QuotApplicantAddressDetailInfoForm();
      addressTypeDetail.controls.ADDRESSID.setValue(object.controls.QUOTAPLTADDS.controls.ADDRESSID.value);
      addressTypeDetail.controls.ADDRESSTYPECDE.setValue(event.value[i]);
      if (defaultAddress != null && defaultAddress == addressTypeDetail.controls.ADDRESSTYPECDE.value) {
        addressTypeDetail.controls.DEFAULTIND.setValue(true);
      }
      object.controls.QUOTAPLTADDSDETL.push(addressTypeDetail);
      tempDefaultAddressArray.push(this._masterDataService.AddressTypeSetup.filter(x => x.code == event.value[i])[0]);
    }
    this.defaultAddressData[object.controls.QUOTAPLTADDS.controls.ADDRESSID.value] = tempDefaultAddressArray;
  }

  defaultAddressChange(event: any, object: any) {
    if (object.controls.QUOTAPLTADDS.value.ADDRESSTYPE.includes('00007')) {
      object.controls.QUOTAPLTADDS.controls.DEFAULTADDRESS.setValue('')
      this._toastr.clear();
      this._toastr.warning('Emergency address can not be default.');
      return
    }
    for (var i = 0; i < this.Parent.controls.length; i++) {
      for (var j = 0; j < this.Parent.controls[i].controls.QUOTAPLTADDSDETL.length; j++) {
        this.Parent.controls[i].controls.QUOTAPLTADDSDETL.value[j].DEFAULTIND = false
        this.Parent.controls[i].controls.QUOTAPLTADDS.controls.DEFAULTADDRESS.setValue('');
      }
    }
    for (var i = 0; i < object.controls.QUOTAPLTADDSDETL.length; i++) {
      if (object.controls.QUOTAPLTADDSDETL.value[i].ADDRESSTYPECDE == event.value &&
        object.controls.QUOTAPLTADDSDETL.value[i].RowState != DataRowState.Removed) {
        object.controls.QUOTAPLTADDSDETL.value[i].DEFAULTIND = true;
        object.controls.QUOTAPLTADDS.controls.DEFAULTADDRESS.setValue(event.value);
        break;
      }
    }
  }
  DuplicateValidations(_addressId: any, _addressType: any): any {
    let contactAddressCount = 0;
    let emergencyAddressCount = 0;
    let filteredAddresses = this.Parent.value?.filter(x => x.RowState != DataRowState.Removed && x.QUOTAPLTADDS.ADDRESSID != _addressId);
    for (var addressIndex in filteredAddresses) {

      if (filteredAddresses[addressIndex].QUOTAPLTADDS && _addressType == '00001') {
        if (filteredAddresses[addressIndex].QUOTAPLTADDSDETL.find(addrType => addrType.ADDRESSTYPECDE === "00001" && addrType.RowState != DataRowState.Removed)) {
          contactAddressCount = contactAddressCount + 1;
        }
      }

      if (filteredAddresses[addressIndex].QUOTAPLTADDS && _addressType == '00007') {
        if (filteredAddresses[addressIndex].QUOTAPLTADDSDETL.find(addrType => addrType.ADDRESSTYPECDE === "00007" && addrType.RowState != DataRowState.Removed)) {
          emergencyAddressCount = emergencyAddressCount + 1;
        }
      }
    }
    if (contactAddressCount > 0 && _addressType == '00001') {
      //this._toastr.clear();
      this._toastr.warning('Contact address can not be duplicate.');
      contactAddressCount = 0;
      return { IsValid: false, Type: '' };
    }
    if (emergencyAddressCount > 0 && _addressType == '00007') {
      //this._toastr.clear();
      this._toastr.warning('Emergency address can not be duplicate.');
      emergencyAddressCount = 0;
      return { IsValid: false, Type: '' };
    }
    return { IsValid: true, Type: '' };

  }
  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }
}
