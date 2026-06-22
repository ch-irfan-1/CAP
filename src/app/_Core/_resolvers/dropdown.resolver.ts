import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { MasterDataCollection } from '@NFS_Core/NFSServices/MasterData/MasterdataHelper/MasterDataCollection';
import { mPOSMasterDataRequest } from '@NFS_Core/NFSServices/MasterData/MasterdataHelper/mPOSMasterDataRequest';
import { MasterData } from '@NFS_Enums/MasterData.enum';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { forkJoin, Observable, of, ReplaySubject } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DropdownResolver  {
  collection: MasterDataCollection = new MasterDataCollection();
  list: Array<INFSDropDownData> = [];

  subject = new ReplaySubject<Array<Array<INFSDropDownData>>>();

  constructor(private _masterDataService: MasterDataService, private _appConfig: AppConfigService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<Array<INFSDropDownData>>> {

    if (!this._masterDataService.isDataRequested) {
      this._masterDataService.isDataRequested = true;

      forkJoin([
        this._masterDataService.GetMasterData(this.getRequestObject(MasterData.ApplicationTypeCode)),
        this._masterDataService.GetMasterData(this.getRequestObject(MasterData.IdType)),
        this._masterDataService.GetMasterData(this.getRequestObject(MasterData.AddressStatus)),
        this._masterDataService.GetMasterData(this.getRequestObject(MasterData.ResidenceType)),
        this._masterDataService.GetMasterData(this.getRequestObject(MasterData.HousingOwnership)),
        this._masterDataService.GetMasterData(this.getRequestObject(MasterData.AllProvincesByCountryId)),
        this._masterDataService.GetMasterData(this.getRequestObject(MasterData.AddressTypeList)),
        this._masterDataService.GetMasterData(this.getRequestObject(MasterData.Branches)),
        this._masterDataService.GetMasterData(this.getRequestObject(MasterData.PhoneTypeListByCompanyId)),
        this._masterDataService.GetMasterData(this.getRequestObject(MasterData.RelationshipTypeListByCompanyId)),
        this._masterDataService.GetMasterData(this.getRequestObject(MasterData.DocumentListByCompanyId)),
        this._masterDataService.GetMasterData(this.getRequestObject(MasterData.LocationDetails)),
        this._masterDataService.GetMasterData(this.getRequestObject(MasterData.MaritalStatus)),
        this._masterDataService.GetMasterData(this.getRequestObject(MasterData.AssetCondition)),
        this._masterDataService.GetMasterData(this.getRequestObject(MasterData.AssetUsage)),
        this._masterDataService.GetMasterData(this.getRequestObject(MasterData.AssetMake)),
        this._masterDataService.GetMasterData(this.getRequestObject(MasterData.Occupations)),
        //this._masterDataService.GetMasterData(this.getRequestObject(MasterData.CreditApprovalType))
      ]).subscribe(nr => this.subject.next(nr));
    }

    return this.subject.pipe(first(), map((response) => {
      return {
        ApplicationTypeCode: response[0], IdType: response[1], AddressStatus: response[2], ResidenceType:
          response[3], HousingOwnership: response[4], AllProvincesByCountryId: response[5], AddressTypeList: response[6],
        Branches: response[7], PhoneTypeListByCompanyId: response[8], RelationshipTypeListByCompanyId: response[9],
        DocumentListByCompanyId: response[10], LocationDetails: response[11], MaritalStatus: response[12],
        AssetCondition: response[13], AssetUsage: response[14], AssetMake: response[15], Occupations: response[16],
        Banks: response[17], AccountTypes: response[18], ExtractFamilyExposureType: response[19], ReferenceType: response[20],
        CurrencyType: response[21], RepresentativeType: response[22], Signatory: response[23]

      };
    }),
      catchError(error => of(error)));
  }

  getRequestObject(masterDataOperation: string): mPOSMasterDataRequest {
    var request = new mPOSMasterDataRequest()
    request.masterDataOperation = masterDataOperation;
    if (masterDataOperation === "getBranchList") {
      request.DATAS.companyId = 5;
    }
    if (masterDataOperation === "getAllProvincesByCountryId") {
      request.DATAS.countryId = 10;
    }
    return request;
  }
}
