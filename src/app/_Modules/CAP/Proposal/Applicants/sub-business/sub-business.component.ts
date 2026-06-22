import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddressMasterDataService } from '@NFS_Core/NFSServices/MasterData/Address-master-data.service';
import { EmploymentMasterDataService } from '@NFS_Core/NFSServices/MasterData/employment-master-data.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { IProposalApplicantBusinessEntity } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IProposalApplicantBusinessEntity.model';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { FormGroup } from 'src/Library';
import { mPOSMasterDataRequest } from '@NFS_Core/NFSServices/MasterData/MasterdataHelper/mPOSMasterDataRequest';
import { MasterData } from '@NFS_Enums/MasterData.enum';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { pairwise, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AddressParm } from '@NFS_Interfaces/RequestInterfaces/AddressParm';

@Component({
    selector: 'sub-business',
    templateUrl: './sub-business.component.html',
    styleUrls: ['./sub-business.component.css'],
    standalone: false
})
export class SubBusinessComponent implements OnInit, OnDestroy {
  @Input() Business !: FormGroup<IProposalApplicantBusinessEntity>;
  @Input() ComponentName!: string;
  @Input() Index : number = 0;

  public AllKotaByProvince: any = [];
  public AllKecamatanByKota: any = [];
  public AllKelurahanByKeca: any = [];
  panelOpenState = false;
  public BusinessLineArray !: INFSDropDownData[];
  request = new mPOSMasterDataRequest();
  NullVal: number | string = '';
  private subscription$ = new Subject();
  private AreaCode: Array<string> = [];
  public isRTRWDisable = false;

  CountryList: Array<INFSDropDownData> = [
    { id: 10, code: "10", TextValue: "Indonesia", OptionalData: { "isDefault": true }, ISMCOMDEALER: false, FINACETYPECODE: "", APPTYP: "", ISMCOMCAMPAIGN: false }
  ];

  constructor(private dialog: MatDialog, public _masterDataService: MasterDataService, public _AddressMasterDataService: AddressMasterDataService,
    public _employmentMasterDataService: EmploymentMasterDataService, private _proposaldataService: ProposalDataService, private _proposalForm: ProposalEntityFormService) { }

  ngOnInit(): void {
    this.valueChangeSubscriptions();

    // let params = this.addressParam();
    // this.AreaCode = this._AddressMasterDataService.buildAreaCode(params);
    // this.Business.controls.PRPLAPLTBUS.controls.AREACDE.setValue(this.AreaCode.toString());

  }

  valueChangeSubscriptions() {

    this.Business.controls.PRPLAPLTBUS.controls.PROVINCEID.valueChanges
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

      this.Business.controls.PRPLAPLTBUS.controls.KOTAMADYAIDOTO.valueChanges
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
      })

      this.Business.controls.PRPLAPLTBUS.controls.KECAMATANIDOTO.valueChanges
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
                data.TextValue = this.AreaCode +"."+ data.OptionalData + " " + data.TextValue;
              })
              this.AllKelurahanByKeca = response?.ResultSet?.DataCollection;

              this._AddressMasterDataService.AllKelurahanByKeca[request2.DATAS.kecamatansId] = this.AllKelurahanByKeca;
              if (this.Business.controls.PRPLAPLTBUS.controls.KELURAHANIDOTO.value > 0) {
                let params = this.addressParam();
                this.AreaCode = this._AddressMasterDataService.buildAreaCode(params, false);
                this.Business.controls.PRPLAPLTBUS.controls.AREACDE.setValue(this.AreaCode.toString());
              }
            });
          }
          else {
            this.AllKelurahanByKeca = this._AddressMasterDataService.AllKelurahanByKeca[request2.DATAS.kecamatansId];
            let params = this.addressParam();
            this.AreaCode = this._AddressMasterDataService.buildAreaCode(params, false);
            this.Business.controls.PRPLAPLTBUS.controls.AREACDE.setValue(this.AreaCode.toString());
          }
        }
        this.isRTRWDisable = true;
      })

      this.Business.controls.PRPLAPLTBUS.controls.KELURAHANIDOTO.valueChanges
      .pipe(pairwise(), takeUntil(this.subscription$))
      .subscribe(([previous, current]) => {
        if (previous === current) {
          return;
        }
        if(current.toString()===""){
          this.Business.controls.PRPLAPLTBUS.controls.RTOTO.setValue('');
          this.Business.controls.PRPLAPLTBUS.controls.RWOTO.setValue('');
          this.isRTRWDisable = true;
          return;
        }

        if (this.Business.controls.PRPLAPLTBUS.controls.KECAMATANIDOTO.value > 0) {
        let params = this.addressParam();
        this.AreaCode = this._AddressMasterDataService.buildAreaCode(params, false);
        this.Business.controls.PRPLAPLTBUS.controls.AREACDE.setValue(this.AreaCode.toString());
        }
        this.isRTRWDisable = false;
      });

      this.Business.controls.PRPLAPLTBUS.controls.RWOTO.valueChanges
      .pipe(takeUntil(this.subscription$)).subscribe((val: any) => {
        let params = this.addressParam();

        this.AreaCode = this._AddressMasterDataService.buildAreaCode(params, false);
        if (this.AreaCode != undefined) {
          this.Business.controls.PRPLAPLTBUS.controls.AREACDE.setValue(this.AreaCode.toString());
        }
        this.isRTRWDisable = false;
      });

      this.Business.controls.PRPLAPLTBUS.controls.RTOTO.valueChanges
      .pipe(takeUntil(this.subscription$)).subscribe((val: any) => {
        let params = this.addressParam();

        this.AreaCode = this._AddressMasterDataService.buildAreaCode(params, false);
        if (this.AreaCode != undefined) {
          this.Business.controls.PRPLAPLTBUS.controls.AREACDE.setValue(this.AreaCode.toString());
        }
        this.isRTRWDisable = false;
      });

    this.Business.controls.PRPLAPLTBUS.controls.INDUSTRYTYPECDE.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(val => {
      if (val != this.NullVal) {
        this.BusinessLineArray = this._employmentMasterDataService.BusinessLine.filter((val: any) => val.OptionalData.INDUSTRYTYPECDE == this.Business.controls.PRPLAPLTBUS.controls.INDUSTRYTYPECDE.value);
      }

    })
  }

  addressParam() {
    let params = {} as AddressParm;
    params.provinceIds = this.Business.controls.PRPLAPLTBUS.controls.PROVINCEID.value;
    params.kotamadyaidotos = this.Business.controls.PRPLAPLTBUS.controls.KOTAMADYAIDOTO.value;
    params.kecamatanidotos = this.Business.controls.PRPLAPLTBUS.controls.KECAMATANIDOTO.value;
    params.kelurahanidotos = this.Business.controls.PRPLAPLTBUS.controls.KELURAHANIDOTO.value;
    params.rwotos = this.Business.controls.PRPLAPLTBUS.controls.RWOTO.value;
    params.rtotos = this.Business.controls.PRPLAPLTBUS.controls.RTOTO.value;

    return params
  }


  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }

  selectionChange_PROVINCEID(evnt: any) {
    if (evnt != undefined) {
      this.Business.controls.PRPLAPLTBUS.controls.KOTAMADYAIDOTO.setValue(-1);
      this.Business.controls.PRPLAPLTBUS.controls.KECAMATANIDOTO.setValue(-1);
      this.Business.controls.PRPLAPLTBUS.controls.KELURAHANIDOTO.setValue(-1);
      this.resetRwRtAreacode();
    }
  }

  selectionChange_KOTAMADYAIDOTO(evnt: any) {
    if (evnt != undefined) {
      this.Business.controls.PRPLAPLTBUS.controls.KECAMATANIDOTO.setValue(-1);
      this.Business.controls.PRPLAPLTBUS.controls.KELURAHANIDOTO.setValue(-1);
      this.resetRwRtAreacode();
    }
  }

  selectionChange_KECAMATANIDOTO(evnt: any) {
    if (evnt != undefined) {
      this.Business.controls.PRPLAPLTBUS.controls.KELURAHANIDOTO.setValue(-1);
      this.resetRwRtAreacode();
    }
  }

  resetRwRtAreacode() {
    this.Business.controls.PRPLAPLTBUS.controls.RWOTO.setValue('');
    this.Business.controls.PRPLAPLTBUS.controls.RTOTO.setValue('');
    this.Business.controls.PRPLAPLTBUS.controls.AREACDE.setValue('');
  }

  onRevenueChange(evnt: any){
    if (evnt < 0){
      this.Business.controls.PRPLAPLTBUS.controls.REVENUE.setValue(Math.abs(evnt))
    }
  }

  onProfitChange(evnt: any){
    if (evnt < 0){
      this.Business.controls.PRPLAPLTBUS.controls.PROFIT.setValue(Math.abs(evnt))
    }
  }

}
