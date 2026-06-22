import { Injectable } from '@angular/core';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { forkJoin, Observable, of, ReplaySubject } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { CommunicationBaseService } from '../Communication/communication-base.service';
import { SERVICE_URL } from '../_helper/api-url';
import { MasterData } from '@NFS_Enums/MasterData.enum';
import { MasterDataService } from './master-data.service';
import { mPOSMasterDataRequest } from './MasterdataHelper/mPOSMasterDataRequest';

@Injectable({
  providedIn: 'root'
})

export class InsuranceMasterDataService {
  public InsuranceTypes: INFSDropDownData[] = [];
  public CmptFinTypeCde: INFSDropDownData[] = [];
  public InsuranceRegions: INFSDropDownData[] = [];
  public AddlInsurances: INFSDropDownData[] = [];
  public InsrUsageTypeCode: INFSDropDownData[] = [];
  public InsrCompany: INFSDropDownData[] = [];
  public InsrExtTypeCode: INFSDropDownData[] = [];
  public InsrCollectionMethodCode: INFSDropDownData[] = [];
  public InsrPremiumType: INFSDropDownData[] = [];

  public AssetComponents: INFSDropDownData[] = [];
  public AmountComponents: INFSDropDownData[] = [];
  request!: mPOSMasterDataRequest;
  isDataRequested = false;
  subject = new ReplaySubject<Array<Array<INFSDropDownData>>>();
  constructor(private _ApiComm: CommunicationBaseService, private _masterDataService: MasterDataService) { }

  GetAllAssetInsuranceLookup(): Observable<any> {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.GetAllAssetInsuranceLookup).pipe(
        map((response) => {
          if (response) {
            return response;
          }
          else {
            return null;
          }
        })
      );
    }
    catch (e) {
      console.log("Error Occured while Populating Insurance Dropdowns => ", e);
      return of(false);
    }
  }
  GetInsuranceCollection(request: any): Observable<any> {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.GetStandardInsuranceLookups, request).pipe(
        map((response) => {
          if (response) {
            return response;
          }
          else {
            return null;
          }
        })
      );
    }
    catch (e) {
      console.log("Error Occured while Populating Insurance Dropdowns => ", e);
      return of(false);
    }
  }

  getarticleComponentLookups(): Observable<any> {
    if (!this.isDataRequested) {
      this.isDataRequested = true;

      forkJoin([
        this._masterDataService.GetMasterData(this.getRequestObject(MasterData.AssetComponents)),
        this._masterDataService.GetMasterData(this.getRequestObject(MasterData.AmountComponents)),

      ]).subscribe(nr => this.subject.next(nr));
    }

    return this.subject.pipe(first(), map((response) => {
      return {
        AssetComponents: response[0],
        AmountComponents: response[1]
      };
    }),
      catchError(error => of(error)));
  }
  getRequestObject(masterDataOperation: string): mPOSMasterDataRequest {
    var request = new mPOSMasterDataRequest()
    request.masterDataOperation = masterDataOperation;

    return request;
  }
  InitializeAssetDetailMasterData(data: any) {
    this.AssetComponents = data?.AssetComponents?.ResultSet?.DataCollection;
    this.AmountComponents = data?.AmountComponents?.ResultSet?.DataCollection;
  }
}

