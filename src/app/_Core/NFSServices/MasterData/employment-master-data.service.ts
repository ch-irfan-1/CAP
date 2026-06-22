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

export class EmploymentMasterDataService {
    public EmploymentType: INFSDropDownData[] = [];
    public EmploymentStatus: INFSDropDownData[] = [];
    public Designation: INFSDropDownData[] = [];
    public Department: INFSDropDownData[] = [];
    public EconomicSector: INFSDropDownData[] = [];
    public BusinessType: INFSDropDownData[] = [];
    public BusinessLine: INFSDropDownData[] = [];
    public SpAgreementType: INFSDropDownData[]=[];
    // public Relationships: INFSDropDownData[]=[];


    request!: mPOSMasterDataRequest;

    isDataRequested = false;
    subject = new ReplaySubject<Array<Array<INFSDropDownData>>>();
    constructor(private _masterDataService: MasterDataService) { }

    getmasterDataForEmployment(): Observable<any> {
        if (!this.isDataRequested) {
            this.isDataRequested = true;

            forkJoin([
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.EmploymentType)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.EmploymentStatus)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.Designation)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.Department)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.EconomicSector)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.BusinessType)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.BusinessLine)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.SpAgreementType)),
                // this._masterDataService.GetMasterData(this.getRequestObject(MasterData.Relationships))
            ]).subscribe(nr => this.subject.next(nr));
        }

        return this.subject.pipe(first(), map((response) => {
            return {
              EmploymentType: response[0],
              EmploymentStatus: response[1],
              Designation: response[2],
              Department: response[3],
              EconomicSector: response[4],
              BusinessType: response[5],
              BusinessLine: response[6],
              SpAgreementType:response[7],
            //   Relationships:response[8]
            };
        }),
            catchError(error => of(error)));
    }
   
    getRequestObject(masterDataOperation: string): mPOSMasterDataRequest {
        var request = new mPOSMasterDataRequest()
        request.masterDataOperation = masterDataOperation;
        return request;
    }

}
