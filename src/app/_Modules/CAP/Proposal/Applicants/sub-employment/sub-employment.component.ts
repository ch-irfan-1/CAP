import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AddressMasterDataService } from '@NFS_Core/NFSServices/MasterData/Address-master-data.service';
import { EmploymentMasterDataService } from '@NFS_Core/NFSServices/MasterData/employment-master-data.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { mPOSMasterDataRequest } from '@NFS_Core/NFSServices/MasterData/MasterdataHelper/mPOSMasterDataRequest';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { IPRPL_APLT_EMPTInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IPRPL_APLT_EMPTInfo.model';
import { MasterData } from '@NFS_Enums/MasterData.enum';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { AddressParm } from '@NFS_Interfaces/RequestInterfaces/AddressParm';
import { DateParam } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { FormGroup } from 'src/Library';
import { Subject } from 'rxjs';
import { pairwise, takeUntil } from 'rxjs/operators';


@Component({
    selector: 'sub-employment',
    templateUrl: './sub-employment.component.html',
    styleUrls: ['./sub-employment.component.css'],
    standalone: false
})
export class SubEmploymentComponent implements OnInit, OnDestroy {
  @Input() Employment!: FormGroup<IPRPL_APLT_EMPTInfo>;
  @Input() ComponentName!: string;
  @Input() Index : number = 0;
  request = new mPOSMasterDataRequest();
  NullVal: number | string = '';

  public AllKotaByProvince: any = [];
  public AllKecamatanByKota: any = [];
  panelOpenState = false;
  public AllKelurahanByKeca: any = [];
  public BusinessLineArray !: INFSDropDownData[];
  private subscription$ = new Subject();
  CountryList: Array<INFSDropDownData> = [
    { id: 10, code: "10", TextValue: "Indonesia", OptionalData: { "isDefault": true }, ISMCOMDEALER: false, FINACETYPECODE: "", APPTYP: "", ISMCOMCAMPAIGN: false }
  ];
  constructor(public _addressMasterDataService: AddressMasterDataService, private _proposaldataService: ProposalDataService, public _employmentMasterDataService: EmploymentMasterDataService, public _masterDataService: MasterDataService, private _proposalForm: ProposalEntityFormService,
    private _ProposalService : ProposalService) { }

  private AreaCode: Array<string> = [];
  public isRTRWDisable = false;
  minToDate = new Date();

  ngOnInit(): void {
    this.valueChangeSubscriptions();
    this.minToDate = this.Employment.controls.FROMDTE.value;
  }

  valueChangeSubscriptions() {
    this.Employment.controls.PROVINCEID.valueChanges.
      pipe(takeUntil(this.subscription$)).
      subscribe(val => {
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
      });

    this.Employment.controls.KOTAMADYAIDOTO.valueChanges.
      pipe(takeUntil(this.subscription$)).
      subscribe(val => {
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
      })

    this.Employment.controls.KECAMATANIDOTO.valueChanges.
      pipe(takeUntil(this.subscription$)).
      subscribe(val => {
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
              response.ResultSet.DataCollection.sort((a:any,b:any)=>a.OptionalData.localeCompare(b.OptionalData));

              response.ResultSet.DataCollection.forEach((data: any) => {
                data.TextValue = this.AreaCode+"."+  data.OptionalData + " " + data.TextValue;
              })
              this.AllKelurahanByKeca = response?.ResultSet?.DataCollection;
              this._addressMasterDataService.AllKelurahanByKeca[request2.DATAS.kecamatansId] = this.AllKelurahanByKeca;
              if (this.Employment.controls.KELURAHANIDOTO.value > 0) {
                let params = this.addressParam();
                this.AreaCode = this._addressMasterDataService.buildAreaCode(params, false);
                this.Employment.controls.AREACDE.setValue(this.AreaCode.toString());
              }
            });
          }
          else {
            this.AllKelurahanByKeca = this._addressMasterDataService.AllKelurahanByKeca[request2.DATAS.kecamatansId];
            let params = this.addressParam();
            this.AreaCode = this._addressMasterDataService.buildAreaCode(params, false);
            this.Employment.controls.AREACDE.setValue(this.AreaCode.toString());
          }
        }
      })


    this.Employment.controls.KELURAHANIDOTO.valueChanges
      .pipe(takeUntil(this.subscription$))
      .subscribe((current) => {

        if (this.Employment.controls.KECAMATANIDOTO.value > 0) {
          if(current.toString()===""){
            this.Employment.controls.RTOTO.setValue('');
            this.Employment.controls.RWOTO.setValue('');
            this.isRTRWDisable = true;
            return;
          }
          let params = this.addressParam();
          this.AreaCode = this._addressMasterDataService.buildAreaCode(params, false);
          this.Employment.controls.AREACDE.setValue(this.AreaCode.toString());
        }

        this.isRTRWDisable = false;
      });

    this.Employment.controls.RWOTO.valueChanges.pipe(takeUntil(this.subscription$)).subscribe((val: any) => {
      let params = this.addressParam();
      this.AreaCode = this._addressMasterDataService.buildAreaCode(params, false);
      if (this.AreaCode != undefined) {
        this.Employment.controls.AREACDE.setValue(this.AreaCode.toString());
      }
    });

    this.Employment.controls.RTOTO.valueChanges
      .pipe(takeUntil(this.subscription$)).subscribe((val: any) => {
        let params = this.addressParam();

        this.AreaCode = this._addressMasterDataService.buildAreaCode(params, false);
        if (this.AreaCode != undefined) {
          this.Employment.controls.AREACDE.setValue(this.AreaCode.toString());
        }
      });

    this.Employment.controls.FROMDTE.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(dte => {
      this.setDuration(dte, this.Employment.controls.TODTE.value);
      this.isFromDateAvailable = false;
      this.minToDate = this.Employment.controls.FROMDTE.value;
    })
    this.Employment.controls.TODTE.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(dte => {
      this.setDuration(this.Employment.controls.FROMDTE.value, dte);
      this.DateTo = dte;

    })
    this.Employment.controls.INDUSTRYTYPECDE.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(val => {
      if (val != this.NullVal) {
        this.BusinessLineArray = this._employmentMasterDataService.BusinessLine.filter((val: any) => val.OptionalData.INDUSTRYTYPECDE == this.Employment.controls.INDUSTRYTYPECDE.value);
      }

    });
  }

  addressParam() {
    let params = {} as AddressParm;
    params.provinceIds = this.Employment.controls.PROVINCEID.value;
    params.kotamadyaidotos = this.Employment.controls.KOTAMADYAIDOTO.value;
    params.kecamatanidotos = this.Employment.controls.KECAMATANIDOTO.value;
    params.kelurahanidotos = this.Employment.controls.KELURAHANIDOTO.value;
    params.rwotos = this.Employment.controls.RWOTO.value;
    params.rtotos = this.Employment.controls.RTOTO.value;
    return params;
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }

  isFromDateAvailable = true
  DateToday = new Date;
  DateTo: Date | undefined;

  resetRwRtAreacode() {
    this.Employment.controls.RWOTO.setValue('');
    this.Employment.controls.RTOTO.setValue('');
    this.Employment.controls.AREACDE.setValue('');
  }

  selectionChange_PROVINCEID(evnt: any) {
    if (evnt != undefined) {
      this.Employment.controls.KOTAMADYAIDOTO.setValue(-1);
      this.Employment.controls.KECAMATANIDOTO.setValue(-1);
      this.Employment.controls.KELURAHANIDOTO.setValue(-1);
      this.resetRwRtAreacode();
    }
  }

  selectionChange_KOTAMADYAIDOTO(evnt: any) {
    if (evnt != undefined) {
      this.Employment.controls.KECAMATANIDOTO.setValue(-1);
      this.Employment.controls.KELURAHANIDOTO.setValue(-1);
      this.resetRwRtAreacode();
    }
  }

  selectionChange_KECAMATANIDOTO(evnt: any) {
    if (evnt != undefined) {
      this.Employment.controls.KELURAHANIDOTO.setValue(-1);
      this.resetRwRtAreacode();
    }
  }

  setDuration(FromDate: Date, toDate: Date) {
    if (FromDate != null && toDate != null) {
      let tempObj = this.dateParam(FromDate, toDate);
      this._ProposalService.GetDateDifference(tempObj).pipe(takeUntil(this.subscription$))
        .subscribe(response => {
          this.Employment.controls.DURATIONINYEAR.setValue(response.ResultSet.Years);
          this.Employment.controls.DURATIONINMONTH.setValue(response.ResultSet.Months);
        })
    }
  }

  dateParam(dateStart: any, dateEnd: any){
    let params = {} as DateParam;
    params.DateStart = dateStart;
    params.DateEnd = dateEnd;
    return params
  }
}
