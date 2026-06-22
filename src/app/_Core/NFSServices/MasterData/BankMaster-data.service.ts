import { Injectable } from '@angular/core';
import { MasterData } from '@NFS_Enums/MasterData.enum';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { forkJoin, Observable, of, ReplaySubject } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { MasterDataService } from './master-data.service';
import { mPOSMasterDataRequest } from './MasterdataHelper/mPOSMasterDataRequest';

@Injectable({
    providedIn: 'root'
})

export class BankMasterDataService {
    public Banks: INFSDropDownData[] = [];
    public BankBranches: any = [];
    public AccounTypes: INFSDropDownData[] = [];
    public CurrencyType: INFSDropDownData[] = [];

    isDataRequested = false;
    subject = new ReplaySubject<Array<Array<INFSDropDownData>>>();
    constructor(private _masterDataService: MasterDataService) { }

    getmasterDataForBanks(): Observable<any> {
        if (!this.isDataRequested) {
            this.isDataRequested = true;

            forkJoin([
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.Banks)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.BankBranches)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.AccounTypes)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.CurrencyType))
            ]).subscribe(nr => this.subject.next(nr));
        }

        return this.subject.pipe(first(), map((response) => {
            return {
                Banks: response[0],
                BankBranches: response[1],
                AccounTypes: response[2],
                CurrencyType: response[3]
            };
        }),
            catchError(error => of(error)));
    }

    getRequestObject(masterDataOperation: string): mPOSMasterDataRequest {
        var request = new mPOSMasterDataRequest()
        request.masterDataOperation = masterDataOperation;
        if (masterDataOperation === "getMarketingOfficerByBranch") {
            request.DATAS.companyId = 5;
        }
        return request;
    }

}
