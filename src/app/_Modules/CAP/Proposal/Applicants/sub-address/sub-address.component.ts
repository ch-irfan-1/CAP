import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddressMasterDataService } from '@NFS_Core/NFSServices/MasterData/Address-master-data.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { mPOSMasterDataRequest } from '@NFS_Core/NFSServices/MasterData/MasterdataHelper/mPOSMasterDataRequest';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { IAddressEntity } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IAddressEntity.model';
import { IPRPL_ADDS_TYP_DETLInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IPRPL_ADDS_TYP_DETLInfo.model';
import { IPRPL_APLT_PHNE_FAXInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IPRPL_APLT_PHNE_FAXInfo.model';
import { AddressTemplate } from '@NFS_Enums/AddressTemplate.enum';
import { AddressTypeCode } from '@NFS_Enums/AdressTypeCode.enum';
import { ApplicantRoleCode } from '@NFS_Enums/ApplicantRoleCode.enum';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { MasterData } from '@NFS_Enums/MasterData.enum';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { AddressParm } from '@NFS_Interfaces/RequestInterfaces/AddressParm';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { FormArray, FormBuilder, FormGroup } from 'src/Library';
import { Subject } from 'rxjs';
import { pairwise, takeUntil } from 'rxjs/operators';
import { DealerSearchComponent } from '../../GeneralInfo/dealer-search.component';
import { IdSearchComponent } from '../Id-Detail/id-search.component';


@Component({
    selector: 'app-sub-address',
    templateUrl: './sub-address.component.html',
    styleUrls: ['./sub-address.component.css'],
    standalone: false
})
export class SubAddressComponent implements OnInit, OnDestroy {
  @Input() Address!: FormGroup<IAddressEntity>;
  Parent!: FormArray<IAddressEntity>;
  @Input() ComponentName !: string;
  @Input() Index : number = 0;
  @Output() MarkDefaultAddress = new EventEmitter;

  PhoneForm: FormGroup<IPRPL_APLT_PHNE_FAXInfo> = this._proposalForm.proposalApplicantPhoneInfoForm();
  AddressTypeArray: FormArray<IPRPL_ADDS_TYP_DETLInfo> = this.fb.array<IPRPL_ADDS_TYP_DETLInfo>([]);

  CountryList: Array<INFSDropDownData> = [
    { id: 10, code: "10", TextValue: "Indonesia", OptionalData: { "isDefault": true }, ISMCOMDEALER: false, FINACETYPECODE: "", APPTYP: "", ISMCOMCAMPAIGN: false }
  ];

  checked = false;
  indeterminate = false;
  public AddressTypeLabel = ['Address Type', 'Applicable', 'Default'];
  public AddressTypeColumns = ['ADDRESSTYPEDSC', 'APPLICABLEIND', 'DEFAULTIND'];
  public columns = ['PHONETYPEDSC', 'COUNTRYDSC', 'AREACODE', 'NUMBER', 'EXTENSIONNBR', 'DEFAULTIND', 'USEFORSMSIND'];
  public labels = ['Phone Type', 'Country','Country Code', 'Phone Number', 'Extension', 'Default', 'Use for SMS'];

  public AllKotaByProvince: any = [];
  public AllKecamatanByKota: any = [];
  public AllKelurahanByKeca: any = [];
  NullVal: number | string = '';
  panelOpenState = false;
  private subscription$ = new Subject();
  private AreaCode: Array<string> = [];
  public isRTRWDisable = false;

  constructor(private dialog: MatDialog, public _masterDataService: MasterDataService, private _proposaldataService: ProposalDataService, public _addressMasterDataService: AddressMasterDataService, private fb: FormBuilder, private _proposalForm: ProposalEntityFormService, private _MsgService: MessageService) { }

  ngOnInit(): void {

    this._addressMasterDataService.getmasterDataForAddress().pipe(takeUntil(this.subscription$)).subscribe(a => {
      this._addressMasterDataService.InitializeAddressMasterData(a);
      this.FillGridDescriptions();
      this.FillAddressTypeDataSource();

      this.AddressTypeArray.controls.forEach((item, index) => {
        let AddressTypeDetail = this.Address.controls.PROPOSALADDRESSTYPEDETAIL.value.filter(x => x.ADDRESSTYPECDE == item.value.ADDRESSTYPECDE && x.RowState != DataRowState.Removed)
        if (AddressTypeDetail.length > 0) {
          item.controls.APPLICABLEIND.setValue(true)
          item.controls.DEFAULTIND.setValue(AddressTypeDetail[0].DEFAULTIND)
        }
      });
    });
    this.Address.controls.PROPOSALAPPLICANTADDRESS.controls.COUNTRYID.setValue(10); // Temporary add country ID
    let CountryTemplate = this._masterDataService.CountryDomicile.filter(x => x.OptionalData?.GEOTPLECDE == AddressTemplate.Indonesia);
    if (CountryTemplate && CountryTemplate.length > 0) {
      this.PhoneForm.controls.COUNTRYCODE.patchValue(CountryTemplate[0].code);
      this.PhoneForm.controls.AREACODE.patchValue(CountryTemplate[0].OptionalData?.PHONECDE);
    }

    /*this.AddressTypeArray.controls.forEach((item, index) => {
      let AddressTypeDetail = this.Address.controls.PROPOSALADDRESSTYPEDETAIL.value.filter(x => x.ADDRESSTYPECDE == item.value.ADDRESSTYPECDE && item.value.RowState != DataRowState.Removed)
      if (AddressTypeDetail.length > 0) {
        item.controls.APPLICABLEIND.setValue(true)
        item.controls.DEFAULTIND.setValue(AddressTypeDetail[0].DEFAULTIND)
      }
    });*/

    this.valueChangeSubscriptions();
    //this.AddressTypeSelectionChange(null); // BP Load issue
  }

  openDealerSearch() {

    const dialogRef = this.dialog.open(DealerSearchComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 123456 },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
      }
    });
  }

  openIdSearch() {

    const dialogRef = this.dialog.open(IdSearchComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 123456 },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
      }
    });
  }

  CountryChange(object: any) {
    this.PhoneForm.controls.AREACODE.setValue('');
    let SelectedCountry = this._masterDataService.CountryDomicile.filter(x => x.code == object);
    if (SelectedCountry) {
      this.PhoneForm.controls.AREACODE.patchValue(SelectedCountry[0].OptionalData?.PHONECDE);
    }
  }

  public isPhoneNoValid(text: any) {
    let regex = /^([0-9\(\)\/\+\-\\]*)$/;
    if(regex.test(text) == true){
      return true
    }
    else{
      return false;
    }
  }

  addPhoneNo(phoneArray: any, Addressindex: any) {
    if (!this.PhoneForm.controls.PHONETYPECDE.value) {
      this._MsgService.showCustomMesssage('Phone Type is Required.', MessageType.Warning);
      return;
    }
    if (!this.PhoneForm.controls.NUMBER.value) {
      this._MsgService.showCustomMesssage('Phone Number is Required Fields.', MessageType.Warning);
      return;
    }
    else if (!this.PhoneForm.controls.NUMBER.valid) {
      this._MsgService.showCustomMesssage('Phone Number is invalid.', MessageType.Warning);
      return;
    }
    if (!this.PhoneForm.controls.EXTENSIONNBR.valid) {
      this._MsgService.showCustomMesssage('Extension is invalid.', MessageType.Warning);
      return;
    }

    if (!this.isPhoneNoValid(this.PhoneForm.controls.NUMBER.value)){
      this._MsgService.showCustomMesssage('Please input Valid Phone Number.', MessageType.Warning);
      return;
    }

    var element: FormGroup<IPRPL_APLT_PHNE_FAXInfo> = this._proposalForm.proposalApplicantPhoneInfoForm();
    var isDefaultExisting = phoneArray.value?.find((x: any) => x.DEFAULTIND == true && x.RowState != DataRowState.Removed);
    let phone = this._addressMasterDataService.AllPhoneTypes?.find(t => t.code === this.PhoneForm.controls.PHONETYPECDE.value);
    let country = this._masterDataService.CountryDomicile.find(t => t.code === this.PhoneForm.controls.COUNTRYCODE.value);
    let maxSeqId = Math.max(...phoneArray.value.map((o: any) => o.PHONESEQID), 0);
    element.controls.PHONETYPEDSC.setValue(phone?.TextValue || '');
    element.controls.PHONETYPECDE.setValue(this.PhoneForm.controls.PHONETYPECDE.value);
    element.controls.COUNTRYCODE.setValue(this.PhoneForm.controls.COUNTRYCODE.value);
    element.controls.COUNTRYDSC.setValue(country?.TextValue || '');
    element.controls.AREACODE.setValue(this.PhoneForm.controls.AREACODE.value);
    element.controls.NUMBER.setValue(this.PhoneForm.controls.NUMBER.value);
    element.controls.EXTENSIONNBR.setValue(this.PhoneForm.controls.EXTENSIONNBR.value);
    element.controls.PHONESEQID.setValue(phoneArray.value.length > 0 ? maxSeqId + 1 : maxSeqId);
    element.controls.NEWDATAIND.setValue(true);
    if (!isDefaultExisting) {
      element.controls.DEFAULTIND.setValue(true);
    }
    else
      element.controls.DEFAULTIND.setValue(this.PhoneForm.controls.DEFAULTIND.value);
    phoneArray.push(element);
    this.resetPhoneValues();
  }

  resetPhoneValues() {
    this.PhoneForm.controls.PHONETYPECDE.setValue('');
    this.PhoneForm.controls.AREACODE.setValue('');
    this.PhoneForm.controls.EXTENSIONNBR.setValue('');
    this.PhoneForm.controls.DEFAULTIND.setValue(false);
    this.PhoneForm.controls.NUMBER.setValue('');
    let CountryTemplate = this._masterDataService.CountryDomicile.filter(x => x.OptionalData?.GEOTPLECDE == '00011');
    if (CountryTemplate && CountryTemplate.length > 0) {
      this.PhoneForm.controls.COUNTRYCODE.patchValue(CountryTemplate[0].code);
      this.PhoneForm.controls.AREACODE.patchValue(CountryTemplate[0].OptionalData?.PHONECDE);
    }
  }
  childOutput(event: any) {
  }

  FillGridDescriptions() {
    if (this.Address) {

      this.Address.controls.PROPOSALAPPLICANTPHONEFAX.controls.filter(x => x.value.RowState != DataRowState.Removed).forEach((item1, index1) => {
        if (!item1.value.PHONETYPEDSC) {
          let phoneType = this._addressMasterDataService.AllPhoneTypes?.find(t => t.code === item1.value.PHONETYPECDE);
          this.Address.controls.PROPOSALAPPLICANTPHONEFAX.controls[index1].controls.PHONETYPEDSC.setValue(phoneType?.TextValue || '')
        }
      });
    }
  }

  valueChangeSubscriptions() {

    this.Address.controls.PROPOSALAPPLICANTADDRESS.controls.PROVINCEID.valueChanges
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
        this.isRTRWDisable = true;
      }));

    this.Address.controls.PROPOSALAPPLICANTADDRESS.controls.KOTAMADYAIDOTO.valueChanges
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
        this.isRTRWDisable = true;
      })

    this.Address.controls.PROPOSALAPPLICANTADDRESS.controls.KECAMATANIDOTO.valueChanges
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
              response.ResultSet.DataCollection.sort((a:any,b:any)=>a.OptionalData?.localeCompare(b?.OptionalData));
              response.ResultSet.DataCollection.forEach((data: any) => {
                if (data.OptionalData)
                  data.TextValue = this.AreaCode + "." + data.OptionalData + " " + data.TextValue;
                else
                  data.TextValue = this.AreaCode + " " + data.TextValue;
              })
              this.AllKelurahanByKeca = response?.ResultSet?.DataCollection;

              this._addressMasterDataService.AllKelurahanByKeca[request2.DATAS.kecamatansId] = this.AllKelurahanByKeca
            });
          }
          else {
            this.AllKelurahanByKeca = this._addressMasterDataService.AllKelurahanByKeca[request2.DATAS.kecamatansId];
          }
        }
        this.isRTRWDisable = true;
      })

    this.Address.controls.PROPOSALAPPLICANTADDRESS.controls.KELURAHANIDOTO.valueChanges
      .pipe(pairwise(), takeUntil(this.subscription$))
      .subscribe(([previous, current]) => {
        if (previous === current) {
          return;
        }

        if(current.toString()===""){
          this.Address.controls.PROPOSALAPPLICANTADDRESS.controls.RTOTO.setValue('');
          this.Address.controls.PROPOSALAPPLICANTADDRESS.controls.RWOTO.setValue('');
          this.isRTRWDisable = true;
          return;
        }

        let params = this.addressParam();
        this.AreaCode = this._addressMasterDataService.buildAreaCode(params, false);
        if (this.AreaCode != undefined) {
          this.Address.controls.PROPOSALAPPLICANTADDRESS.controls.AREACDE.setValue(this.AreaCode.toString());
        }
        this.isRTRWDisable = false;
      });

    this.Address.controls.PROPOSALAPPLICANTADDRESS.controls.RWOTO.valueChanges
      .pipe(takeUntil(this.subscription$)).subscribe((val: any) => {
        let params = this.addressParam();

        this.AreaCode = this._addressMasterDataService.buildAreaCode(params, false);
        if (this.AreaCode != undefined) {
          this.Address.controls.PROPOSALAPPLICANTADDRESS.controls.AREACDE.setValue(this.AreaCode.toString());
        }
        this.isRTRWDisable = false;
      });

    this.Address.controls.PROPOSALAPPLICANTADDRESS.controls.RTOTO.valueChanges
      .pipe(takeUntil(this.subscription$)).subscribe((val: any) => {
        let params = this.addressParam();
        this.AreaCode = this._addressMasterDataService.buildAreaCode(params, false);

        if(this.AreaCode != undefined){
          this.Address.controls.PROPOSALAPPLICANTADDRESS.controls.AREACDE.setValue(this.AreaCode.toString());
        }
          this.isRTRWDisable = false;
      });

  }

  addressParam() {
    let params = {} as AddressParm;
    params.provinceIds = this.Address.controls.PROPOSALAPPLICANTADDRESS.controls.PROVINCEID.value;
    params.kotamadyaidotos = this.Address.controls.PROPOSALAPPLICANTADDRESS.controls.KOTAMADYAIDOTO.value;
    params.kecamatanidotos = this.Address.controls.PROPOSALAPPLICANTADDRESS.controls.KECAMATANIDOTO.value;
    params.kelurahanidotos = this.Address.controls.PROPOSALAPPLICANTADDRESS.controls.KELURAHANIDOTO.value;
    params.rwotos = this.Address.controls.PROPOSALAPPLICANTADDRESS.controls.RWOTO.value;
    params.rtotos = this.Address.controls.PROPOSALAPPLICANTADDRESS.controls.RTOTO.value;

    return params
  }

  FillAddressTypeDataSource() {
    if (this._addressMasterDataService.AddressTypeSetup) {
      this._addressMasterDataService.AddressTypeSetup.forEach((item, index) => {
        this.AddressTypeArray.push(this.fb.group<IPRPL_ADDS_TYP_DETLInfo>({
          APPLICANTID: 0,
          ADDRESSID: 0,
          GEOTPLECDE: AddressTemplate.Indonesia, // Indonesia country code
          ADDRESSTYPECDE: item.code,
          ADDRESSTYPEDSC: item.TextValue,
          DEFAULTIND: false,
          APPLICABLEIND: false,
          EXECUTIONDTE: new Date(Date.now()),
          EXECUTIONOFFSET: 0,
          SESSIONCDE: '',
          SESSIONID: 0,
          RowState: DataRowState.Added,
          ISAUDITABLE: false,
        }))
      });
    }
  }

  UserForSMSSelectionChange(element: any) {
    
    if (this.Address.value.PROPOSALADDRESSTYPEDETAIL.filter(x => x.DEFAULTIND == true).length == 0 || (  typeof element.currentIndex != "undefined" && this.Address.value.PROPOSALAPPLICANTPHONEFAX[element.currentIndex].PHONETYPECDE != "00003")) {
      this.Address.controls.PROPOSALAPPLICANTPHONEFAX.controls[element.currentIndex].controls.USEFORSMSIND.setValue(false);
      this.Address.controls.PROPOSALAPPLICANTPHONEFAX.controls[element.currentIndex].controls.USEFORSMSIND.markAsDirty();
      if (typeof element.previousIndex != "undefined"){
        this.Address.controls.PROPOSALAPPLICANTPHONEFAX.controls[element.previousIndex].controls.USEFORSMSIND.setValue(true);
        this.Address.controls.PROPOSALAPPLICANTPHONEFAX.controls[element.previousIndex].controls.USEFORSMSIND.markAsDirty();
      }

      this._MsgService.showMesssage('UseForSmsValidation', MessageType.Info)
      return;
    }
    if (typeof element.currentIndex != "undefined"){
      this.Address.controls.PROPOSALAPPLICANTPHONEFAX.controls[element.currentIndex].controls.USEFORSMSIND.setValue(true);
      this.Address.controls.PROPOSALAPPLICANTPHONEFAX.controls[element.currentIndex].controls.USEFORSMSIND.markAsDirty();
    }
    // this.Address.controls.PROPOSALAPPLICANTPHONEFAX.controls[element.currentIndex].controls.RowState.setValue(DataRowState.Updated);
    if (typeof element.previousIndex != "undefined"){
      this.Address.controls.PROPOSALAPPLICANTPHONEFAX.controls[element.previousIndex].controls.USEFORSMSIND.setValue(false);
      this.Address.controls.PROPOSALAPPLICANTPHONEFAX.controls[element.previousIndex].controls.USEFORSMSIND.markAsDirty();
    }


  }

  DuplicateValidations(_addressId: any, _addressType: any): any {
    let contactAddressCount = 0;
    let emergencyAddressCount = 0;
    this.Parent = this._proposaldataService.CurrentApplicant.controls.ADDRESS
    let filteredAddresses = this.Parent.value?.filter(x => x.RowState != DataRowState.Removed && x.PROPOSALAPPLICANTADDRESS.ADDRESSID != _addressId);
    for (var addressIndex in filteredAddresses) {

      if (filteredAddresses[addressIndex].PROPOSALAPPLICANTADDRESS && _addressType == AddressTypeCode.Mailing) {
        if (filteredAddresses[addressIndex].PROPOSALADDRESSTYPEDETAIL.find(addrType => addrType.ADDRESSTYPECDE === AddressTypeCode.Mailing && addrType.RowState != DataRowState.Removed)) {
          contactAddressCount = contactAddressCount + 1;
        }
      }

      if (filteredAddresses[addressIndex].PROPOSALAPPLICANTADDRESS && _addressType == AddressTypeCode.EmergencyAddress) {
        if (filteredAddresses[addressIndex].PROPOSALADDRESSTYPEDETAIL.find(addrType => addrType.ADDRESSTYPECDE === AddressTypeCode.EmergencyAddress && addrType.RowState != DataRowState.Removed)) {
          emergencyAddressCount = emergencyAddressCount + 1;
        }
      }
    }
    if (contactAddressCount > 0 && _addressType == AddressTypeCode.Mailing) {
      this._MsgService.showMesssage('msgContactAddressCountExceeded', MessageType.Warning);
      contactAddressCount = 0;
      return { IsValid: false, Type: '' };
    }
    if (emergencyAddressCount > 0 && _addressType == AddressTypeCode.EmergencyAddress) {
      this._MsgService.showMesssage('MultipleEmergencyAddress', MessageType.Warning);
      emergencyAddressCount = 0;
      return { IsValid: false, Type: '' };
    }
    return { IsValid: true, Type: '' };

  }

  get EmergencyAddressSelected(): boolean {
    return this.Address.value.PROPOSALADDRESSTYPEDETAIL.filter(x => x.RowState != DataRowState.Removed && x.APPLICABLEIND == true && x.ADDRESSTYPECDE == AddressTypeCode.EmergencyAddress).length > 0
  }


  AddressTypeSelectionChange(element: any) {
    if (element != null) {
      if (element.currentIndex == element.previousIndex && this.AddressTypeArray.controls[element.currentIndex].controls.DEFAULTIND.value == true) {
        return;
      }
    }
    if (element != null) {
      if (element.isDefault) {
        if (this.AddressTypeArray.value[element.currentIndex].ADDRESSTYPECDE == AddressTypeCode.EmergencyAddress) {
          this.AddressTypeArray.controls[element.currentIndex].controls.DEFAULTIND.patchValue(false)
          this.Address.controls.PROPOSALADDRESSTYPEDETAIL.controls.filter(x => x.value.ADDRESSTYPECDE == this.AddressTypeArray.value[element.currentIndex].ADDRESSTYPECDE).map(ele => { ele.controls.DEFAULTIND.patchValue(false, { emitEvent: false }); ele.markAsDirty(); });
          if (typeof element.previousIndex != "undefined") {
            this.AddressTypeArray.controls[element.previousIndex].controls.DEFAULTIND.patchValue(true)
            this.Address.controls.PROPOSALADDRESSTYPEDETAIL.controls.filter(x => x.value.ADDRESSTYPECDE == this.AddressTypeArray.value[element.previousIndex].ADDRESSTYPECDE).map(ele => { ele.controls.DEFAULTIND.patchValue(true, { emitEvent: false }); ele.markAsDirty(); });
          }
          return;
        }
        if (this._proposaldataService.CurrentApplicant.controls.ADDRESS.value.filter(y => y.PROPOSALADDRESSTYPEDETAIL.filter(x => x.DEFAULTIND == true)).length > 0) {
          this.MarkDefaultAddress.emit(this.Address.value);
        }
        this.AddressTypeArray.controls.map(ele => { ele.controls.DEFAULTIND.patchValue(false, { emitEvent: false }) });
        this.AddressTypeArray.controls[element.currentIndex].controls.DEFAULTIND.patchValue(true)
        this.Address.controls.PROPOSALADDRESSTYPEDETAIL.controls.filter(x => x.value.ADDRESSTYPECDE == this.AddressTypeArray.value[element.currentIndex].ADDRESSTYPECDE).map(ele => { ele.controls.DEFAULTIND.patchValue(true, { emitEvent: false }); ele.markAsDirty(); });
        if (typeof element.previousIndex != "undefined") {
          this.AddressTypeArray.controls[element.previousIndex].controls.DEFAULTIND.patchValue(false)
          this.Address.controls.PROPOSALADDRESSTYPEDETAIL.controls.filter(x => x.value.ADDRESSTYPECDE == this.AddressTypeArray.value[element.previousIndex].ADDRESSTYPECDE).map(ele => { ele.controls.DEFAULTIND.patchValue(false, { emitEvent: false }); ele.markAsDirty(); });
        }
      }
      else {

        if (this._proposaldataService.CurrentApplicant.value.PROPOSALAPPLICANT.ROLECDE == ApplicantRoleCode.Borrower) {
          //-- Emergency Address Duplicate Check -- //
          if (this.AddressTypeArray.value[element.currentIndex].ADDRESSTYPECDE == AddressTypeCode.EmergencyAddress && this.AddressTypeArray.value[element.currentIndex].APPLICABLEIND == true) {
            var result = this.DuplicateValidations(this.Address.value.PROPOSALAPPLICANTADDRESS.ADDRESSID, AddressTypeCode.EmergencyAddress);
            if (!result.IsValid) {
              this.AddressTypeArray.controls.filter(x => x.value.ADDRESSTYPECDE == AddressTypeCode.EmergencyAddress).map(ele => { ele.controls.APPLICABLEIND.patchValue(false, { emitEvent: false }) });
              return;
            }
          }
          //-- Contact Address Duplicate Check -- //
          if (this.AddressTypeArray.value[element.currentIndex].ADDRESSTYPECDE == AddressTypeCode.Mailing && this.AddressTypeArray.value[element.currentIndex].APPLICABLEIND == true) {
            var result = this.DuplicateValidations(this.Address.value.PROPOSALAPPLICANTADDRESS.ADDRESSID, AddressTypeCode.Mailing);
            if (!result.IsValid) {
              this.AddressTypeArray.controls.filter(x => x.value.ADDRESSTYPECDE == AddressTypeCode.Mailing).map(ele => { ele.controls.APPLICABLEIND.patchValue(false, { emitEvent: false }) });
              return;
            }
          }
        }
        //-- Emergency Address With Other Check -- //
        if (this.AddressTypeArray.value.filter(x => x.APPLICABLEIND == true).length > 1 && this.AddressTypeArray.value[element.currentIndex].ADDRESSTYPECDE != AddressTypeCode.EmergencyAddress && this.AddressTypeArray.value.filter(x => x.APPLICABLEIND == true && x.ADDRESSTYPECDE == AddressTypeCode.EmergencyAddress).length > 0) {
          this.AddressTypeArray.controls.filter(x => x.value.ADDRESSTYPECDE != AddressTypeCode.EmergencyAddress).map(ele => { ele.controls.APPLICABLEIND.patchValue(false, { emitEvent: false }) });
          this._MsgService.showMesssage('EmergencyAddressChk', MessageType.Warning)
        }
        else if (this.AddressTypeArray.value.filter(x => x.APPLICABLEIND == true).length > 1 && this.AddressTypeArray.value[element.currentIndex].ADDRESSTYPECDE == AddressTypeCode.EmergencyAddress) {
          this.AddressTypeArray.controls.filter(x => x.value.ADDRESSTYPECDE != AddressTypeCode.EmergencyAddress).map(ele => { ele.controls.APPLICABLEIND.patchValue(false, { emitEvent: false }) });
          this.Address.controls.PROPOSALADDRESSTYPEDETAIL.controls.filter(x => x.value.ADDRESSTYPECDE != AddressTypeCode.EmergencyAddress).map(ele => { ele.controls.RowState.patchValue(DataRowState.Removed)});
          this.AddressTypeArray.controls.filter(x => x.value.ADDRESSTYPECDE != AddressTypeCode.EmergencyAddress).map(ele => { ele.controls.DEFAULTIND.patchValue(false, { emitEvent: false }) })
          this.Address.controls.PROPOSALADDRESSTYPEDETAIL.controls.filter(x => x.value.ADDRESSTYPECDE != AddressTypeCode.EmergencyAddress).filter(ele => { ele.controls.APPLICABLEIND.patchValue(false, { emitEvent: false }) })
          this.Address.controls.PROPOSALADDRESSTYPEDETAIL.controls.filter(x => x.value.ADDRESSTYPECDE != AddressTypeCode.EmergencyAddress).filter(ele => { ele.controls.DEFAULTIND.patchValue(false, { emitEvent: false }) })
        }
        // if (this._proposaldataService.CurrentApplicant.value.PROPOSALAPPLICANT.ROLECDE == ApplicantRoleCode.Borrower) {
        //   //-- Emergency Address Duplicate Check -- //
        //   if (this.AddressTypeArray.value[element.currentIndex].ADDRESSTYPECDE == AddressTypeCode.EmergencyAddress && this.AddressTypeArray.value[element.currentIndex].APPLICABLEIND == true) {
        //     var result = this.DuplicateValidations(this.Address.value.PROPOSALAPPLICANTADDRESS.ADDRESSID, AddressTypeCode.EmergencyAddress);
        //     if (!result.IsValid) {
        //       this.AddressTypeArray.controls.filter(x => x.value.ADDRESSTYPECDE == AddressTypeCode.EmergencyAddress).map(ele => { ele.controls.APPLICABLEIND.patchValue(false, { emitEvent: false }) });
        //       return;
        //     }
        //   }
        //   //-- Contact Address Duplicate Check -- //
        //   if (this.AddressTypeArray.value[element.currentIndex].ADDRESSTYPECDE == AddressTypeCode.Mailing && this.AddressTypeArray.value[element.currentIndex].APPLICABLEIND == true) {
        //     var result = this.DuplicateValidations(this.Address.value.PROPOSALAPPLICANTADDRESS.ADDRESSID, AddressTypeCode.Mailing);
        //     if (!result.IsValid) {
        //       this.AddressTypeArray.controls.filter(x => x.value.ADDRESSTYPECDE == AddressTypeCode.Mailing).map(ele => { ele.controls.APPLICABLEIND.patchValue(false, { emitEvent: false }) });
        //       return;
        //     }
        //   }
        // }
        if (this.AddressTypeArray.value[element.currentIndex].APPLICABLEIND == true) {
          let AddressTypeDetail = this.Address.controls.PROPOSALADDRESSTYPEDETAIL.controls.filter(x => x.value.ADDRESSTYPECDE == this.AddressTypeArray.value[element.currentIndex].ADDRESSTYPECDE && x.value.RowState != DataRowState.Removed)
          if (AddressTypeDetail.length > 0) {
            AddressTypeDetail[0].controls.APPLICABLEIND.setValue(this.AddressTypeArray.value[element.currentIndex].APPLICABLEIND)
          }
          else {
            let group = this.fb.group<IPRPL_ADDS_TYP_DETLInfo>(this.AddressTypeArray.value[element.currentIndex]);
            this.Address.controls.PROPOSALADDRESSTYPEDETAIL.push(group);
            for (var i = this.Address.controls.PROPOSALADDRESSTYPEDETAIL.length - 1; i >= 0; i--) {
              // this.AddressTypeArray.controls.forEach((item, index) => {
              if (this.Address.controls.PROPOSALADDRESSTYPEDETAIL.controls[i].controls.ADDRESSTYPECDE.value !== "00007" && this.Address.controls.PROPOSALADDRESSTYPEDETAIL.controls[i].controls.APPLICABLEIND.value == false && this.Address.controls.PROPOSALADDRESSTYPEDETAIL.controls[i].value.RowState == DataRowState.Added) {
                this.Address.controls.PROPOSALADDRESSTYPEDETAIL.removeAt(i);
              }
            }

          }
        }
        else {
          let AddressTypeDetail = this.Address.controls.PROPOSALADDRESSTYPEDETAIL.controls.filter(x => x.value.ADDRESSTYPECDE == this.AddressTypeArray.value[element.currentIndex].ADDRESSTYPECDE)
          if (AddressTypeDetail.length > 0) {
            if (AddressTypeDetail[0].value.RowState == DataRowState.Added) {
              let currentIndex = this.Address.value.PROPOSALADDRESSTYPEDETAIL.indexOf(AddressTypeDetail[0].value)
              this.Address.controls.PROPOSALADDRESSTYPEDETAIL.removeAt(currentIndex);
            }
            else {
              AddressTypeDetail[0].controls.RowState.setValue(DataRowState.Removed);
            }
          }
        }
      }
    }
  }


  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }

  resetRwRtAreacode() {
    this.Address.controls.PROPOSALAPPLICANTADDRESS.controls.RWOTO.setValue('');
    this.Address.controls.PROPOSALAPPLICANTADDRESS.controls.RTOTO.setValue('');
    this.Address.controls.PROPOSALAPPLICANTADDRESS.controls.AREACDE.setValue('');
  }

  selectionChange_PROVINCEID(evnt: any) {
    if (evnt != undefined) {
      this.Address.controls.PROPOSALAPPLICANTADDRESS.controls.KOTAMADYAIDOTO.setValue(-1);
      this.Address.controls.PROPOSALAPPLICANTADDRESS.controls.KECAMATANIDOTO.setValue(-1);
      this.Address.controls.PROPOSALAPPLICANTADDRESS.controls.KELURAHANIDOTO.setValue(-1);
      this.resetRwRtAreacode();
    }
  }

  selectionChange_KOTAMADYAIDOTO(evnt: any) {
    if (evnt != undefined) {
      this.Address.controls.PROPOSALAPPLICANTADDRESS.controls.KECAMATANIDOTO.setValue(-1);
      this.Address.controls.PROPOSALAPPLICANTADDRESS.controls.KELURAHANIDOTO.setValue(-1);
      this.resetRwRtAreacode();
    }
  }

  selectionChange_KECAMATANIDOTO(evnt: any) {
    if (evnt != undefined) {
      this.Address.controls.PROPOSALAPPLICANTADDRESS.controls.KELURAHANIDOTO.setValue(-1);
      this.resetRwRtAreacode();
    }
  }

  ShowContactPerson(): boolean {
    if (this.AddressTypeArray != null) {
      let obj = this.AddressTypeArray.value.find(p => p.ADDRESSTYPECDE == AddressTypeCode.EmergencyAddress && p.APPLICABLEIND) as IPRPL_ADDS_TYP_DETLInfo;

      if (obj != null && obj.ADDRESSTYPECDE == AddressTypeCode.EmergencyAddress && obj.APPLICABLEIND) {
        return true;
      }
      else {
        return false;
      }
    }
    return false;
  }

}
