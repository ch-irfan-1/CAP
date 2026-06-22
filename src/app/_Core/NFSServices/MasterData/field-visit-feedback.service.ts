import { Injectable } from '@angular/core';
import { MasterData } from '@NFS_Enums/MasterData.enum';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { forkJoin, Observable, of, ReplaySubject } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { ClientStoreService } from '../ClientCache/client-store.service';
import { MasterDataService } from './master-data.service';
import { mPOSMasterDataRequest } from './MasterdataHelper/mPOSMasterDataRequest';

@Injectable({
    providedIn: 'root'
})

export class FieldVisitDataService {
    // public FieldInvestigator: INFSDropDownData[] = [];
    public SocialInteraction: INFSDropDownData[] = [];
    public OfficeLocation: INFSDropDownData[] = [];
    public FiRating: INFSDropDownData[] = [];
    public MeetWith: INFSDropDownData[] = [];

    isDataRequested = false;
    subject = new ReplaySubject<Array<Array<INFSDropDownData>>>();
    constructor(private _proposalDataService:ProposalDataService,private _masterDataService: MasterDataService, private storageService: ClientStoreService) {

    }

    getmasterDataForFieldVisit(): Observable<any> {
        if (!this.isDataRequested) {
            this.isDataRequested = true;

            forkJoin([
                // this._masterDataService.GetMasterData(this.getRequestObject(MasterData.FieldInvestigator,branchId)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.SocialInteraction)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.OfficeLocation)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.FiRating)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.MeetWith))
            ]).subscribe(nr => this.subject.next(nr));
        }

        return this.subject.pipe(first(), map((response) => {
            return {
                // FieldInvestigator: response[0],
                SocialInteraction: response[0],
                OfficeLocation: response[1],
                FiRating: response[2],
                MeetWith: response[3]
            };
        }),
            catchError(error => of(error)));
    }

    InitializeMasterDataForFieldVisit(data:any){
        // this.FieldInvestigator=data?.FieldInvestigator?.ResultSet?.DataCollection;
        this.SocialInteraction=data?.SocialInteraction?.ResultSet?.DataCollection;
        this.OfficeLocation=data?.OfficeLocation?.ResultSet?.DataCollection;
        this.FiRating=data?.FiRating?.ResultSet?.DataCollection;
        this.MeetWith=data?.MeetWith?.ResultSet?.DataCollection;
    }
    getRequestObject(masterDataOperation: string): mPOSMasterDataRequest {
        var request = new mPOSMasterDataRequest()
        request.masterDataOperation = masterDataOperation;
        // if (masterDataOperation === "getMarketingOfficerByBranch") {
        //     request.DATAS.companyId = this.storageService.GetUserInfo()?.CompanyId;
        //     request.DATAS.branchId = branchId;
        // }
        return request;
    }

}
