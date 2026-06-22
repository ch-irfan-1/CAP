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

export class AssetSearchMasterdataService {
    public AssetType: INFSDropDownData[] = [];
    public AssetSubType: INFSDropDownData[] = [];
    public AssetMake: INFSDropDownData[] = [];
    public AssetBrand: INFSDropDownData[] = [];
    public AssetModel: INFSDropDownData[] = [];
    public ProposalAssetUsage: INFSDropDownData[] = [];
    public AssetSelection: INFSDropDownData[] = [];
    public PoliceCategory: INFSDropDownData[] = [];

    request!: mPOSMasterDataRequest;

    isDataRequested = false;
    subject = new ReplaySubject<Array<Array<INFSDropDownData>>>();
    constructor(private _masterDataService: MasterDataService, private _ProposalDataService: ProposalDataService) { }

    getmasterDataForAssetSearch(): Observable<any> {
        if (!this.isDataRequested) {
            this.isDataRequested = true;

            forkJoin([
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.AssetType)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.AssetUsage)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.AssetSelection))
            ]).subscribe(nr => this.subject.next(nr));
        }
        return this.subject.pipe(first(), map((response) => {
            return {
                AssetType: response[0],
                ProposalAssetUsage: response[1],
                AssetSelection: response[2]
            };
        }),
            catchError(error => of(error)));
    }

    getRequestObject(masterDataOperation: string): mPOSMasterDataRequest {
        var request = new mPOSMasterDataRequest()
        request.masterDataOperation = masterDataOperation;
        if (request.masterDataOperation === "getAssetType") {
            request.DATAS.TPLEASETMODLSEQID = this._ProposalDataService.TPLEASETMODLSEQID;
        }
        return request;
    }
    InitializeMasterData(data: any) {
        this.AssetType = data?.AssetType?.ResultSet?.DataCollection;
        this.ProposalAssetUsage = data?.ProposalAssetUsage?.ResultSet?.DataCollection;
        this.AssetSelection = data?.AssetSelection?.ResultSet?.DataCollection;
    }

}


