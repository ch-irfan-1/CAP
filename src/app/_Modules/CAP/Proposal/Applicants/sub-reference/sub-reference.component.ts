import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddressMasterDataService } from '@NFS_Core/NFSServices/MasterData/Address-master-data.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { mPOSMasterDataRequest } from '@NFS_Core/NFSServices/MasterData/MasterdataHelper/mPOSMasterDataRequest';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { IPRPL_APLT_PRNL_RFRNInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IPRPL_APLT_PRNL_RFRNInfo.model';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { MasterData } from '@NFS_Enums/MasterData.enum';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { AddressParm } from '@NFS_Interfaces/RequestInterfaces/AddressParm';
import { DateParam } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { FormGroup } from 'src/Library';
import  moment from 'moment';
import { Subject } from 'rxjs';
import { pairwise, takeUntil } from 'rxjs/operators';
import { DealerSearchComponent } from '../../GeneralInfo/dealer-search.component';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { FormMode } from '@NFS_Enums/FormMode.enum';


@Component({
    selector: 'app-sub-reference',
    templateUrl: './sub-reference.component.html',
    styleUrls: ['./sub-reference.component.css'],
    standalone: false
})
export class SubReferenceComponent implements OnInit, OnDestroy {
  @Input() Reference !: FormGroup<IPRPL_APLT_PRNL_RFRNInfo>;
  @Input() ComponentName!: string;
  @Input() Index! : number;

  request = new mPOSMasterDataRequest();
  NullVal: number | string = '';
  private subscription$ = new Subject();
  public AllKotaByProvince: any = [];
  public AllKecamatanByKota: any = [];
  public AllKelurahanByKeca: any = [];
  CountryList: Array<INFSDropDownData> = [
    { id: 10, code: "10", TextValue: "Indonesia", OptionalData: { "isDefault": true }, ISMCOMDEALER: false, FINACETYPECODE: "", APPTYP: "", ISMCOMCAMPAIGN: false }
  ];
  private AreaCode: Array<string> = [];
  public isRTRWDisable = false;
  dateToday = new Date();
  isViewMode:boolean=false;
  constructor(public _AddressMasterDataService: AddressMasterDataService, private dialog: MatDialog, private _proposaldataService: ProposalDataService, private _proposalForm: ProposalEntityFormService, public _masterDataService: MasterDataService,
    private _ProposalService : ProposalService,private _formMode:FormModeService) { }

  ngOnInit(): void {
    if(this._formMode.FormMode==FormMode.VIEW){
      this.isViewMode=true;
    }
    this.valueChangeSubscriptions();
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

    dialogRef.afterClosed().pipe(takeUntil(this.subscription$))
      .subscribe((result => {
        if (result != undefined) {
        }
      }));
  }

  get RelationshipValue(){
    let tempValue = this._masterDataService.AllEmergencyContactRelationTypes.filter( ele => ele.APPTYP == this.Reference.controls.REFERENCETYPIND.value )
    return tempValue
  }

  valueChangeSubscriptions() {

    this.Reference.controls.ESTABLISHSINCE.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(dte => {
      if (this.Reference.controls.ESTABLISHSINCE.value == undefined) {
        this.Reference.controls.ESTABLISHINYEAR.setValue(0);
        this.Reference.controls.ESTABLISHINMONTH.setValue(0);
      }
      else {
        let DateStart = this.Reference.controls.ESTABLISHSINCE.value;
        let DateEnd = new Date();

        let tempObj = this.dateParam(DateStart, DateEnd);
        this._ProposalService.GetDateDifference(tempObj).pipe(takeUntil(this.subscription$))
        .subscribe(response => {
          this.Reference.controls.ESTABLISHINYEAR.setValue(response.ResultSet.Years);
          this.Reference.controls.ESTABLISHINMONTH.setValue(response.ResultSet.Months);
        })
      }
    });

    this.Reference.controls.DATEOFBIRTH.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(dtes => {
      if (this.Reference.controls.DATEOFBIRTH.value == undefined) {
        this.Reference.controls.TIMEINYEAR.setValue(0);
        this.Reference.controls.TIMEINMONTH.setValue(0);
      }
      else {
        let DateStart = this.Reference.controls.DATEOFBIRTH.value;
        let DateEnd = new Date();

        let tempObj = this.dateParam(DateStart, DateEnd);
        this._ProposalService.GetDateDifference(tempObj).pipe(takeUntil(this.subscription$))
          .subscribe(response => {
            this.Reference.controls.TIMEINYEAR.setValue(response.ResultSet.Years);
            this.Reference.controls.TIMEINMONTH.setValue(response.ResultSet.Months);
          })
      }
    });


    this.Reference.controls.PROVINCEID.valueChanges
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

    this.Reference.controls.KOTAMADYAIDOTO.valueChanges
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

    this.Reference.controls.KECAMATANIDOTO.valueChanges
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
              this._AddressMasterDataService.AllKelurahanByKeca[request2.DATAS.kecamatansId] = this.AllKelurahanByKeca;

              if (this.Reference.controls.KELURAHANIDOTO.value > 0) {
                let params = this.addressParam();
                this.AreaCode = this._AddressMasterDataService.buildAreaCode(params, false);
                this.Reference.controls.AREACDE.setValue(this.AreaCode.toString());
              }
            });
          }
          else {
            this.AllKelurahanByKeca = this._AddressMasterDataService.AllKelurahanByKeca[request2.DATAS.kecamatansId];
            let params = this.addressParam();
            this.AreaCode = this._AddressMasterDataService.buildAreaCode(params, false);
            this.Reference.controls.AREACDE.setValue(this.AreaCode.toString());
          }
        }
        this.isRTRWDisable = true;
      })

    this.Reference.controls.KELURAHANIDOTO.valueChanges
      .pipe(pairwise(), takeUntil(this.subscription$))
      .subscribe(([previous, current]) => {
        if (previous === current) {
          return;
        }
        if(current.toString()===""){
          this.Reference.controls.RTOTO.setValue('');
          this.Reference.controls.RWOTO.setValue('');
          this.isRTRWDisable = true;
          return;
        }
        if (this.Reference.controls.KECAMATANIDOTO.value > 0) {
        let params = this.addressParam();
        this.AreaCode = this._AddressMasterDataService.buildAreaCode(params, false);
        this.Reference.controls.AREACDE.setValue(this.AreaCode.toString());
        this.isRTRWDisable = false;
        }
      });

    this.Reference.controls.RWOTO.valueChanges
      .pipe(takeUntil(this.subscription$)).subscribe((val: any) => {
        let params = this.addressParam();

        this.AreaCode = this._AddressMasterDataService.buildAreaCode(params, false);
        if (this.AreaCode != undefined) {
          this.Reference.controls.AREACDE.setValue(this.AreaCode.toString());
        }
      });

    this.Reference.controls.RTOTO.valueChanges
      .pipe(takeUntil(this.subscription$)).subscribe((val: any) => {
        let params = this.addressParam();

        this.AreaCode = this._AddressMasterDataService.buildAreaCode(params, false);
        if (this.AreaCode != undefined) {
          this.Reference.controls.AREACDE.setValue(this.AreaCode.toString());
        }
      });
  }

  addressParam() {
    let params = {} as AddressParm;
    params.provinceIds = this.Reference.controls.PROVINCEID.value;
    params.kotamadyaidotos = this.Reference.controls.KOTAMADYAIDOTO.value;
    params.kecamatanidotos = this.Reference.controls.KECAMATANIDOTO.value;
    params.kelurahanidotos = this.Reference.controls.KELURAHANIDOTO.value;
    params.rwotos = this.Reference.controls.RWOTO.value;
    params.rtotos = this.Reference.controls.RTOTO.value;
    return params;
  }

  dateParam(dateStart: any, dateEnd: any){
    let params = {} as DateParam;
    params.DateStart = dateStart;
    params.DateEnd = dateEnd;
    return params
  }

  public referenceTypeInd_SelectionChange(event: any) {
    if (event != undefined) {
      let tempForm ={
        APPLICANTID : this.Reference.value.APPLICANTID,        
        REFERENCEID: this.Reference.value.REFERENCEID,
        RowState: this.Reference.value.RowState
      };            
      this.Reference.patchValue(this._proposalForm.proposalPersonalReferenceForm().value, { emitEvent: false, onlySelf: true });
      //this.Reference.reset();
      this.Reference.controls.REFERENCETYPIND.setValue(event.value);
      this.Reference.patchValue(tempForm, { emitEvent: false, onlySelf: true });
      if(tempForm.RowState != DataRowState.Added){
        this.Reference.controls.RowState.setValue(DataRowState.Updated);
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }

  tempDateFrom: any;
  tempDateTo: any;

  SendDate(FromtempDate: any) {
    this.tempDateFrom = FromtempDate;
  }

  resetRwRtAreacode() {
    this.Reference.controls.RWOTO.setValue('');
    this.Reference.controls.RTOTO.setValue('');
    this.Reference.controls.AREACDE.setValue('');
  }

  selectionChange_PROVINCEID(evnt: any) {
    if (evnt != undefined) {
      this.Reference.controls.KOTAMADYAIDOTO.setValue(-1);
      this.Reference.controls.KECAMATANIDOTO.setValue(-1);
      this.Reference.controls.KELURAHANIDOTO.setValue(-1);
      this.resetRwRtAreacode();
    }
  }

  selectionChange_KOTAMADYAIDOTO(evnt: any) {
    if (evnt != undefined) {
      this.Reference.controls.KECAMATANIDOTO.setValue(-1);
      this.Reference.controls.KELURAHANIDOTO.setValue(-1);
      this.resetRwRtAreacode();
    }
  }

  selectionChange_KECAMATANIDOTO(evnt: any) {
    if (evnt != undefined) {
      this.Reference.controls.KELURAHANIDOTO.setValue(-1);
      this.resetRwRtAreacode();
    }
  }

  getMonths(date: Date | null) {
    let monthsMoment, years, months = 0;
    let yearmonthlist = []
    monthsMoment = moment().diff(date, 'months');
    years = Math.floor(monthsMoment / 12);
    months = monthsMoment % 12;
    yearmonthlist.push(years);
    yearmonthlist.push(months)
    return yearmonthlist;
  }

}
