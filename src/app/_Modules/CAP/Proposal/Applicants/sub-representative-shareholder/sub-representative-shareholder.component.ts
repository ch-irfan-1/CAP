import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddressMasterDataService } from '@NFS_Core/NFSServices/MasterData/Address-master-data.service';
import { EmploymentMasterDataService } from '@NFS_Core/NFSServices/MasterData/employment-master-data.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { mPOSMasterDataRequest } from '@NFS_Core/NFSServices/MasterData/MasterdataHelper/mPOSMasterDataRequest';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { IPRPL_APLT_RPRSInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/ProposalApplicantEntity.model.index';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { IDTypeCode } from '@NFS_Enums/IDTypeCode';
import { MasterData } from '@NFS_Enums/MasterData.enum';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { AddressParm } from '@NFS_Interfaces/RequestInterfaces/AddressParm';
import { DateParam } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { FormBuilder, FormGroup } from 'src/Library';
import { EMLINK } from 'constants';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { pairwise, takeUntil } from 'rxjs/operators';


@Component({
    selector: 'sub-representative-shareholder',
    templateUrl: './sub-representative-shareholder.component.html',
    styleUrls: ['./sub-representative-shareholder.component.css'],
    standalone: false
})
export class SubRepresentativeShareholderComponent implements OnInit, OnDestroy {

  @Input() Representative!: FormGroup<IPRPL_APLT_RPRSInfo>;
  @Input() ComponentName!: string;
  @Input() Index : number = 0;
  @Output() signatoryTypeChange = new EventEmitter<any>();

  panelOpenState = false;
  NullVal: number | string = '';
  public isRTRWDisable = false;
  isPercentageShare = false;
  isPercentageShareEconomy = false;
  private AreaCode: Array<string> = [];
  public AllKotaByProvince: any = [];
  public AllKecamatanByKota: any = [];
  public AllKelurahanByKeca: any = [];
  typeDropdownList: any[] = [];
  idTypeList: INFSDropDownData[] = [];
  request = new mPOSMasterDataRequest();
  isTypeSelected: boolean = false;
  isRepresentativeTypeSelected: boolean = false;
  private subscription$ = new Subject();
  CountryList: Array<INFSDropDownData> = [
    { id: 10, code: "10", TextValue: "Indonesia", OptionalData: { "isDefault": true }, ISMCOMDEALER: false, FINACETYPECODE: "", APPTYP: "", ISMCOMCAMPAIGN: false }
  ];

  tempBusinessLineArray: any;

  constructor(public _AddressMasterDataService: AddressMasterDataService, private dialog: MatDialog, private _proposaldataService: ProposalDataService, private _proposalForm: ProposalEntityFormService, public _masterDataService: MasterDataService, public _employmentMasterDataService: EmploymentMasterDataService,
    private toaster: ToastrService, private _messageService: MessageService, private _formbuilder: FormBuilder, private _ProposalService: ProposalService) { }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }

  ngOnInit(): void {
    this._masterDataService.ApplicantTypeSetup.filter(x => x.code != 'A').forEach(p => {
      let obj = {} as INFSDropDownData
      if (p.code == "I") {
        obj.code = "00001";
      }
      else if (p.code == "C") {
        obj.code = "00002"
      }
      obj.TextValue = p.TextValue;
      this.typeDropdownList.push(obj)
    });
    this.idTypeList = this._masterDataService.ApplicantIdTypesSetup;
    this.idTypeList = this.idTypeList.filter(x => x.code != IDTypeCode.SIUP && x.code != IDTypeCode.TDPPT);
    if(this.Representative.controls.SHAREHOLDERTYPE.value==null){
      this.Representative.controls.SHAREHOLDERTYPE.setValue('00001');
    }
    if(this.Representative.controls.COUNTRYID?.value == 0)
    {
      this.Representative.controls.COUNTRYID.setValue(10);
    }
    this.valueChangeSubscriptions();
  }

  valueChangeSubscriptions() {
    this.Representative.controls.SIGNATORYCDE.valueChanges.pipe(takeUntil(this.subscription$))
      .subscribe((val => {
        this.Representative.updateValueAndValidity({ emitEvent: false, onlySelf: true });
        this.signatoryTypeChange.emit(this.Representative);
      }))

    this.Representative.controls.PROVINCEID.valueChanges
      .pipe(takeUntil(this.subscription$))
      .subscribe((val => {
        this.AllKotaByProvince = new Array<INFSDropDownData>();
        this.AllKecamatanByKota = new Array<INFSDropDownData>();
        this.AllKelurahanByKeca = new Array<INFSDropDownData>();

        let request = new mPOSMasterDataRequest();
        request.masterDataOperation = MasterData.kotamadyasByProvinceId;
        request.DATAS.provinceId = val;
        if (request.DATAS.provinceId > 0) {

          if (this._AddressMasterDataService.AllKotaByProvince[request.DATAS.provinceId] == undefined ||
            this._AddressMasterDataService.AllKotaByProvince[request.DATAS.provinceId].length == 0) {

            this._masterDataService.GetMasterData(request).pipe(takeUntil(this.subscription$)).subscribe((response) => {
              this.AllKotaByProvince = response?.ResultSet?.DataCollection;
              this._AddressMasterDataService.AllKotaByProvince[request.DATAS.provinceId] = this.AllKotaByProvince;
            });
          }
          else {
            this.AllKotaByProvince = this._AddressMasterDataService.AllKotaByProvince[request.DATAS.provinceId];
          }
        }
        this.isRTRWDisable = true;
      }));

    this.Representative.controls.KOTAMADYAIDOTO.valueChanges
      .pipe(takeUntil(this.subscription$))
      .subscribe((val: any) => {
        this.AllKecamatanByKota = new Array<INFSDropDownData>();
        this.AllKelurahanByKeca = new Array<INFSDropDownData>();

        let request1 = new mPOSMasterDataRequest();
        request1.masterDataOperation = MasterData.kecamatansListBykotamadyasId;
        request1.DATAS.kotamadyasId = val;
        if (request1.DATAS.kotamadyasId > 0) {

          if (this._AddressMasterDataService.AllKecamatanByKota[request1.DATAS.kotamadyasId] == undefined ||
            this._AddressMasterDataService.AllKecamatanByKota[request1.DATAS.kotamadyasId].length == 0) {

            this._masterDataService.GetMasterData(request1).pipe(takeUntil(this.subscription$)).subscribe((response) => {
              this.AllKecamatanByKota = response?.ResultSet?.DataCollection;
              this._AddressMasterDataService.AllKecamatanByKota[request1.DATAS.kotamadyasId] = this.AllKecamatanByKota;
            });
          }
          else {
            this.AllKecamatanByKota = this._AddressMasterDataService.AllKecamatanByKota[request1.DATAS.kotamadyasId];
          }
        }
        this.isRTRWDisable = true;
      });

    this.Representative.controls.KECAMATANIDOTO.valueChanges
      .pipe(takeUntil(this.subscription$))
      .subscribe((val: any) => {
        this.AllKelurahanByKeca = new Array<INFSDropDownData>();
        let request2 = new mPOSMasterDataRequest();

        request2.masterDataOperation = MasterData.kelurahanListBykecamatansId;
        request2.DATAS.kecamatansId = val;
        if (request2.DATAS.kecamatansId > 0) {
          if (this._AddressMasterDataService.AllKelurahanByKeca[request2.DATAS.kecamatansId] == undefined ||
            this._AddressMasterDataService.AllKelurahanByKeca[request2.DATAS.kecamatansId].length == 0) {

            this._masterDataService.GetMasterData(request2).pipe(takeUntil(this.subscription$)).subscribe((response) => {
              let params = this.addressParam();
              this.AreaCode = this._AddressMasterDataService.buildAreaCode(params, true);
              response.ResultSet.DataCollection.sort((a:any,b:any)=>a.OptionalData.localeCompare(b.OptionalData));
              response.ResultSet.DataCollection.forEach((data: any) => {
                data.TextValue = this.AreaCode +"."+  data.OptionalData + " " + data.TextValue;
              })
              this.AllKelurahanByKeca = response?.ResultSet?.DataCollection;

              this._AddressMasterDataService.AllKelurahanByKeca[request2.DATAS.kecamatansId] = this.AllKelurahanByKeca
              if (this.Representative.controls.KELURAHANIDOTO.value > 0) {
                let params = this.addressParam();
                this.AreaCode = this._AddressMasterDataService.buildAreaCode(params, false);
                this.Representative.controls.AREACDE.setValue(this.AreaCode.toString());
              }
            });
          }
          else {
            this.AllKelurahanByKeca = this._AddressMasterDataService.AllKelurahanByKeca[request2.DATAS.kecamatansId];
            let params = this.addressParam();
            this.AreaCode = this._AddressMasterDataService.buildAreaCode(params, false);
            this.Representative.controls.AREACDE.setValue(this.AreaCode.toString());
          }
        }
        this.isRTRWDisable = true;
      })

    this.Representative.controls.KELURAHANIDOTO.valueChanges
      .pipe(pairwise(), takeUntil(this.subscription$))
      .subscribe(([previous, current]) => {
        if (previous === current) {
          return;
        }
        if(current.toString()===""){
          this.Representative.controls.RTOTO.setValue('');
          this.Representative.controls.RWOTO.setValue('');
          this.isRTRWDisable = true;
          return;
        }
        if (this.Representative.controls.KECAMATANIDOTO.value > 0) {
          let params = this.addressParam();
          this.AreaCode = this._AddressMasterDataService.buildAreaCode(params, false);
          this.Representative.controls.AREACDE.setValue(this.AreaCode.toString());
          this.isRTRWDisable = false;
        }
      });

    this.Representative.controls.RWOTO.valueChanges
      .pipe(takeUntil(this.subscription$)).subscribe((val: any) => {
        let params = this.addressParam();

        this.AreaCode = this._AddressMasterDataService.buildAreaCode(params, false);
        if (this.AreaCode != undefined) {
          this.Representative.controls.AREACDE.setValue(this.AreaCode.toString());
        }
      });

    this.Representative.controls.RTOTO.valueChanges
      .pipe(takeUntil(this.subscription$)).subscribe((val: any) => {

        let params = this.addressParam();

        this.AreaCode = this._AddressMasterDataService.buildAreaCode(params, false);
        if (this.AreaCode != undefined) {
          this.Representative.controls.AREACDE.setValue(this.AreaCode.toString());
        }
      });

    this.Representative.controls.SHAREHOLDERTYPE.valueChanges.pipe(takeUntil(this.subscription$))
      .subscribe((val => {
        this.isTypeSelected = true;
        
        if (val == '00001') {
          this.idTypeList = this._masterDataService.ApplicantIdTypesSetup;
          this.idTypeList = this.idTypeList.filter(x => x.code != IDTypeCode.SIUP && x.code != IDTypeCode.TDPPT);
        }
        else if (val == '00002') {
          this.idTypeList = this._masterDataService.ApplicantIdTypesSetup;
          this.idTypeList = this.idTypeList.filter(x => x.code != IDTypeCode.KTP && x.code != IDTypeCode.EmployeeId && x.code != IDTypeCode.Passport && x.code != IDTypeCode.KITAS_KIMS)

        }
      }));

    this.Representative.controls.REPRESENTATIVETYPE.valueChanges.pipe(takeUntil(this.subscription$))
      .subscribe((x => {
        this.isRepresentativeTypeSelected = true;
        if (x != '00004') {
          this.isPercentageShare = true;
          this.isPercentageShareEconomy = true;
          // this.Representative.controls.PERCENTAGESHARE.disable();
          // this.Representative.controls.PERCENTAGESHARECOMY.disable();
          // this.Representative.controls.PERCENTAGESHARE.setValue(0);
          // this.Representative.controls.PERCENTAGESHARECOMY.setValue(0);
        }
        else if (x == '00004') {
          this.isPercentageShare = false;
          this.isPercentageShareEconomy = false;
          // this.Representative.controls.PERCENTAGESHARE.enable();
          // this.Representative.controls.PERCENTAGESHARECOMY.enable();
        }

      }));

    this.Representative.controls.DATEOFBIRTH.valueChanges.pipe(takeUntil(this.subscription$))
      .subscribe((date => {

        if (date == undefined) {
          this.Representative.controls.AGEINYEAR.setValue(0);
          this.Representative.controls.AGEINMONTH.setValue(0);
        }
        else {
          let DateStart = this.Representative.controls.DATEOFBIRTH.value;
          let DateEnd = new Date();

          let tempObj = this.dateParam(DateStart, DateEnd);
          this._ProposalService.GetDateDifference(tempObj).pipe(takeUntil(this.subscription$))
            .subscribe((response: any) => {
              this.Representative.controls.AGEINYEAR.setValue(response.ResultSet.Years);
              this.Representative.controls.AGEINMONTH.setValue(response.ResultSet.Months);
            })
        }
      }));

    this.Representative.controls.ESTBSINC.valueChanges.pipe(takeUntil(this.subscription$))
      .subscribe((date => {

        if (date == undefined) {
          this.Representative.controls.AGEINYEARCOMP.setValue(0)
          this.Representative.controls.AGEINMONTHCOMP.setValue(0)
        }
        else {
          let DateStart = this.Representative.controls.ESTBSINC.value;
          let DateEnd = new Date();

          let tempObj = this.dateParam(DateStart, DateEnd);
          this._ProposalService.GetDateDifference(tempObj).pipe(takeUntil(this.subscription$))
            .subscribe((response: any) => {
              this.Representative.controls.AGEINYEARCOMP.setValue(response.ResultSet.Years);
              this.Representative.controls.AGEINMONTHCOMP.setValue(response.ResultSet.Months);
            })
        }
      }));

    this.Representative.controls.PERCENTAGESHARECOMY.valueChanges.pipe(takeUntil(this.subscription$))
    .subscribe(p=>{;
      if(p>100){
        this.Representative.controls.PERCENTAGESHARECOMY.setValue(0);
      }
    });

    this.Representative.controls.PERCENTAGESHARE.valueChanges.pipe(takeUntil(this.subscription$))
    .subscribe(p=>{
      if(p>100){
        this.Representative.controls.PERCENTAGESHARE.setValue(0);
      }
    });

    if (this.Representative.controls.BUSINESSTYPECDE.value != undefined) {
      this.tempBusinessLineArray = this._employmentMasterDataService.BusinessLine.filter((ele: any) => ele.OptionalData.INDUSTRYTYPECDE == this.Representative.controls.BUSINESSTYPECDE.value)
    }
  }

  addressParam() {
    let params = {} as AddressParm;
    params.provinceIds = this.Representative.controls.PROVINCEID.value;
    params.kotamadyaidotos = this.Representative.controls.KOTAMADYAIDOTO.value;
    params.kecamatanidotos = this.Representative.controls.KECAMATANIDOTO.value;
    params.kelurahanidotos = this.Representative.controls.KELURAHANIDOTO.value;
    params.rwotos = this.Representative.controls.RWOTO.value;
    params.rtotos = this.Representative.controls.RTOTO.value;
    return params;
  }

  public resetRepresentativeDetail(event: any) {
    if (event != undefined) {
      let REPRESENTATIVEID= this.Representative.value.REPRESENTATIVEID;
      let APPLICANTID= this.Representative.value.APPLICANTID;
      let previousRowState = this.Representative.value.RowState;
      let representativeType = this.Representative.value.REPRESENTATIVETYPE;
      let signatoryCode = this.Representative.value.SIGNATORYCDE;
     
      this.Representative.patchValue(this._proposalForm.ProposalApplicantRepresentativeForm().value, { emitEvent: false, onlySelf: true });

      this.Representative.controls.SHAREHOLDERTYPE.setValue(event.value);
      this.Representative.controls.REPRESENTATIVEID.setValue(REPRESENTATIVEID);
      this.Representative.controls.APPLICANTID.setValue(APPLICANTID);
      this.Representative.controls.REPRESENTATIVETYPE.setValue(representativeType);
      this.Representative.controls.SIGNATORYCDE.setValue(signatoryCode);
      if(previousRowState != DataRowState.Added){
        this.Representative.controls.RowState.setValue(DataRowState.Updated);
      }
    }
  }

  resetRwRtAreacode() {
    this.Representative.controls.RWOTO.setValue('');
    this.Representative.controls.RTOTO.setValue('');
    this.Representative.controls.AREACDE.setValue('');
  }

  selectionChange_PROVINCEID(evnt: any) {
    if (evnt != undefined) {
      this.Representative.controls.KOTAMADYAIDOTO.setValue(-1);
      this.Representative.controls.KECAMATANIDOTO.setValue(-1);
      this.Representative.controls.KELURAHANIDOTO.setValue(-1);
      this.resetRwRtAreacode();
    }
  }

  selectionChange_KOTAMADYAIDOTO(evnt: any) {
    if (evnt != undefined) {
      this.Representative.controls.KECAMATANIDOTO.setValue(-1);
      this.Representative.controls.KELURAHANIDOTO.setValue(-1);
      this.resetRwRtAreacode();
    }
  }

  selectionChange_KECAMATANIDOTO(evnt: any) {
    if (evnt != undefined) {
      this.Representative.controls.KELURAHANIDOTO.setValue(-1);
      this.resetRwRtAreacode();
    }
  }

  dateParam(dateStart: any, dateEnd: any){
    let params = {} as DateParam;
    params.DateStart = dateStart;
    params.DateEnd = dateEnd;
    return params
  }

  onChangeBusinessType(evnt: any){
    if(evnt != undefined){
      this.tempBusinessLineArray = this._employmentMasterDataService.BusinessLine.filter( (ele:any) => ele.OptionalData.INDUSTRYTYPECDE == evnt.value)
    }
  }
}
