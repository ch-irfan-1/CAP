import { Injectable } from '@angular/core';
import { MasterData } from '@NFS_Enums/MasterData.enum';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { forkJoin, Observable, of, ReplaySubject } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { ProposalService } from '../Proposal/proposal.service';
import { MasterDataService } from './master-data.service';
import { mPOSMasterDataRequest } from './MasterdataHelper/mPOSMasterDataRequest';

@Injectable({
    providedIn: 'root'
})

export class FinancialClubMasterDataService {
    public Frequencies: INFSDropDownData[] = [];
    public RentalModes: any[] = [];
    public FPCampaignCol: any = [];
    public BBNAgent: any = [];
    public RVBaloonApplicable: any = [];

    request!: mPOSMasterDataRequest;

    isDataRequested = false;
    subject = new ReplaySubject<Array<Array<INFSDropDownData>>>();
    constructor(private _masterDataService: MasterDataService, private _proposalService: ProposalService, private _proposalDataService: ProposalDataService) { }

    getmasterDataForFinancialClub(FPID: number = 0): Observable<any> {
        if (!this.isDataRequested) {
            this.isDataRequested = true;

            forkJoin([
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.BBNAgent)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.RVBaloonApplicable))
            ]).subscribe(nr => this.subject.next(nr));
        }

        return this.subject.pipe(first(), map((response) => {
            return {
                BBNAgent: response[0],
                RVBaloonApplicable: response[1]
            };
        }),
            catchError(error => of(error)));
    }

    getRequestObject(masterDataOperation: string, fpid: number = 0): mPOSMasterDataRequest {
        var request = new mPOSMasterDataRequest()
        request.masterDataOperation = masterDataOperation;
        if (request.masterDataOperation == "getBBNAgent") {
            request.DATAS.branchId = this._proposalDataService.PROPOSAL.value.BPCOMPANYBRANCHID;
        }
        //request.DATAS.financialProdID = fpid;
        return request;
    }

}
