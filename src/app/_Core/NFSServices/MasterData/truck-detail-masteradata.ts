import { Injectable } from '@angular/core';
import { MasterData } from '@NFS_Enums/MasterData.enum';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { forkJoin, Observable, of, ReplaySubject } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { MasterDataService } from './master-data.service';
import { mPOSMasterDataRequest } from './MasterdataHelper/mPOSMasterDataRequest';

@Injectable({
    providedIn: 'root'
})

export class TruckDetailsMasterdataService {
    public BodyType: INFSDropDownData[] = [];
    public PurchasingObjective: INFSDropDownData[] = [];
    public IndustryTypeCode: INFSDropDownData[] = [];
    public AssetModelColour: INFSDropDownData[] = [];
    public PropertyLocation: INFSDropDownData[] = [];
    public OperatingObjective: INFSDropDownData[] = [];
    public TruckCategoryCode: INFSDropDownData[] = [];

    request!: mPOSMasterDataRequest;

    isDataRequested = false;
    subject = new ReplaySubject<Array<Array<INFSDropDownData>>>();
    constructor(private _masterDataService: MasterDataService, private _ProposalDataService: ProposalDataService) { }

    getmasterDataForTruckDetail(): Observable<any> {
        if (!this.isDataRequested) {
            this.isDataRequested = true;

            forkJoin([
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.OperatingObjective)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.BodyType)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.PurchasingObjective)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.IndustryTypeCode)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.PropertyLocation)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.AssetModelColour)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.TruckCategoryCode)),

            ]).subscribe(nr => this.subject.next(nr));
        }

        return this.subject.pipe(first(), map((response) => {
            return {
                OperatingObjective: response[0],
                BodyType: response[1],
                PurchasingObjective: response[2],
                IndustryTypeCode: response[3],
                PropertyLocation: response[4],
                AssetModelColour: response[5],
                TruckCategoryCode:response[6],

            };
        }),
            catchError(error => of(error)));
    }
   
    getRequestObject(masterDataOperation: string): mPOSMasterDataRequest {
        var request = new mPOSMasterDataRequest()
        request.masterDataOperation = masterDataOperation;
        if(masterDataOperation==="getAssetModelColour"){
            request.DATAS.AssetModelId=-1;
        }
        return request;
    }
    InitializeTruckDetailMasterData(data:any){
        this.OperatingObjective = data?.OperatingObjective?.ResultSet?.DataCollection;
        this.BodyType = data?.BodyType?.ResultSet?.DataCollection;
        this.PurchasingObjective = data?.PurchasingObjective?.ResultSet?.DataCollection;
        this.IndustryTypeCode = data?.IndustryTypeCode?.ResultSet?.DataCollection;
        this.PropertyLocation = data?.PropertyLocation?.ResultSet?.DataCollection;
        this.AssetModelColour = data?.AssetModelColour?.ResultSet?.DataCollection;   
        this.TruckCategoryCode = data?.TruckCategoryCode?.ResultSet?.DataCollection;      
    }

}

