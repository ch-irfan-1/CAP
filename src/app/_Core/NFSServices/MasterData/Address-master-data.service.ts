import { Injectable, Input } from '@angular/core';
import { IAddressEntity } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IAddressEntity.model';
import { MasterData } from '@NFS_Enums/MasterData.enum';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { FormControl, FormGroup } from 'src/Library';
import { forkJoin, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { catchError, first, map, pairwise, takeUntil } from 'rxjs/operators';
import { MasterDataService } from './master-data.service';
import { mPOSMasterDataRequest } from './MasterdataHelper/mPOSMasterDataRequest';

@Injectable({
  providedIn: 'root'
})

export class AddressMasterDataService {
  public AllProvinceData: INFSDropDownData[] = [];
  public AllKotaByProvince: any = [];
  public AllKecamatanByKota: any = [];
  public AllKelurahanByKeca: any = [];
  public ResidenceTypeSetup: INFSDropDownData[] = [];
  public LocationTypeSetup: INFSDropDownData[] = [];
  public HousingOwnerShipTypeSetup: INFSDropDownData[] = [];
  public AddressStatusesSetup: INFSDropDownData[] = [];
  public AddressTypeSetup: INFSDropDownData[] = [];
  public AllDefaultAddresses: INFSDropDownData[] = [];
  public AllPhoneTypes: INFSDropDownData[] = [];
  public LocationDetails: INFSDropDownData[] = [];
  public AllEmergencyContactRelationTypes: INFSDropDownData[] = [];
  NullVal: number | string = '';

  request!: mPOSMasterDataRequest;

  isDataRequested = false;
  subject = new ReplaySubject<Array<Array<INFSDropDownData>>>();


  constructor(private _masterDataService: MasterDataService) { }

  getmasterDataForAddress(): Observable<any> {
    if (!this.isDataRequested) {
      this.isDataRequested = true;

      forkJoin([
        this._masterDataService.GetMasterData(this.getRequestObject(MasterData.AllProvincesByCountryId)),
        this._masterDataService.GetMasterData(this.getRequestObject(MasterData.ResidenceType)),
        this._masterDataService.GetMasterData(this.getRequestObject(MasterData.HousingOwnership)),
        this._masterDataService.GetMasterData(this.getRequestObject(MasterData.AddressStatus)),
        this._masterDataService.GetMasterData(this.getRequestObject(MasterData.AddressTypeList)),
        this._masterDataService.GetMasterData(this.getRequestObject(MasterData.PhoneTypeListByCompanyId)),
        this._masterDataService.GetMasterData(this.getRequestObject(MasterData.LocationDetails)),
        this._masterDataService.GetMasterData(this.getRequestObject(MasterData.RelationshipTypeListByCompanyId))
      ]).subscribe(nr => this.subject.next(nr));
    }

    return this.subject.pipe(first(), map((response) => {
      return {
        AllProvinceData: response[0], ResidenceTypeSetup: response[1], HousingOwnerShipTypeSetup: response[2], AddressStatusesSetup: response[3],
        AddressTypeSetup: response[4], AllPhoneTypes: response[5], LocationDetails: response[6], AllEmergencyContactRelationTypes: response[7],
      };
    }),
      catchError(error => of(error)));
  }

  getRequestObject(masterDataOperation: string): mPOSMasterDataRequest {
    var request = new mPOSMasterDataRequest()
    request.masterDataOperation = masterDataOperation;
    if (masterDataOperation === "getAllProvincesByCountryId") {
      request.DATAS.countryId = 10;
    }
    return request;
  }

  InitializeAddressMasterData(data: any) {
    this.AddressStatusesSetup = data?.AddressStatusesSetup?.ResultSet?.DataCollection;
    this.AddressTypeSetup = data?.AddressTypeSetup?.ResultSet?.DataCollection;
    this.AllProvinceData = data?.AllProvinceData?.ResultSet?.DataCollection;
    this.HousingOwnerShipTypeSetup = data?.HousingOwnerShipTypeSetup?.ResultSet?.DataCollection;
    this.AllPhoneTypes = data?.AllPhoneTypes?.ResultSet?.DataCollection;
    this.AllEmergencyContactRelationTypes = data?.AllEmergencyContactRelationTypes?.ResultSet?.DataCollection;
    this.ResidenceTypeSetup = data?.ResidenceTypeSetup?.ResultSet?.DataCollection;
    this.LocationDetails = data?.LocationDetails?.ResultSet?.DataCollection;
  }

  public buildAreaCode(objpara: any, optDropdown: Boolean) {
    let AreaCode: Array<string> = [];
    let tempReturn: any;
    if (!objpara.provinceIds) {
    }
    else {
      if (objpara.provinceIds) {
        let provinceID: number = this.AllProvinceData && objpara.provinceIds;
        let kotamadyasId: number = this.AllProvinceData && objpara.kotamadyaidotos;
        let kecamatansId: number = this.AllProvinceData && objpara.kecamatanidotos;
        let kelurehanId: number = this.AllProvinceData && objpara.kelurahanidotos;


        if (this.AllProvinceData && provinceID > 0)
          AreaCode[0] = this.AllProvinceData.filter(p => p.code == provinceID.toString())[0]?.OptionalData;
        if (this.AllKotaByProvince[provinceID] && kotamadyasId > 0)
          AreaCode[1] = this.AllKotaByProvince[provinceID]?.filter((p: any) => p.code == kotamadyasId.toString())[0]?.OptionalData;
        if (this.AllKecamatanByKota[kotamadyasId] && kecamatansId > 0)
          AreaCode[2] = this.AllKecamatanByKota[kotamadyasId]?.filter((p: any) => p.code == kecamatansId.toString())[0]?.OptionalData;
        if (this.AllKelurahanByKeca[kecamatansId] && kelurehanId > 0)
          AreaCode[3] = this.AllKelurahanByKeca[kecamatansId]?.filter((p: any) => p.code == kelurehanId.toString())[0]?.OptionalData;
        if (optDropdown == true) {

          tempReturn = AreaCode.toString();
          tempReturn = tempReturn.replaceAll(',', '.')
          if (objpara.kelurahanidotos == 0){
            tempReturn = tempReturn + ".";
          }
          return tempReturn;

        }
        else {
          if (objpara.rwotos != ''
            && objpara.rwotos != null) {
            AreaCode[4] = objpara.rwotos.trim();
          }
          else {
            AreaCode[4] = "00";
          }
          if (objpara.rtotos != ''
            && objpara.rtotos != null) {
            AreaCode[5] = objpara.rtotos.trim();
          }
          else {
            AreaCode[5] = "00";
          }
          tempReturn = this.Areacode(AreaCode);
          // tempReturn = AreaCode;
          return tempReturn;
        }
      }
      else {
        AreaCode[0] = '';  //Province
        AreaCode[1] = ''; //Kotamadya
        AreaCode[2] = ''; //Kecamatan
        AreaCode[3] = ''; //Kelurehan
        AreaCode[4] = ''; //RW
        AreaCode[5] = '';  //RT
      }
    }
  }

  Areacode(array: Array<string>) {
    let temp: string = array.concat().toString();
    let temp3: string = temp.replace(/[,.]/g, '');
    return temp3;
  }

}

