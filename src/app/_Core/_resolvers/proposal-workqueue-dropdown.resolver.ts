import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { IBusinessPartnerInfoParm } from '@NFS_Interfaces/RequestInterfaces/BusinessPartnerInfoParm';
import { forkJoin, Observable, of, ReplaySubject } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';

@Injectable({
    providedIn: 'root'
})

export class ProposalQueueDropdownResolver  {

    subject = new ReplaySubject<Array<any>>();

    constructor(private _masterDataService: MasterDataService,private _storageService:ClientStoreService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<any>> {

        if (!this._masterDataService.isWorkQueueDataRequested) {
            this._masterDataService.isWorkQueueDataRequested = true;

            forkJoin([
                this._masterDataService.GetProposalQueueMasterData({ BusinessPartnerId: this._storageService.GetUserInfo().BusinessPartnerId } as IBusinessPartnerInfoParm),
                this._masterDataService.GetProposalQueueUsersMasterData()
            ]).subscribe(nr => this.subject.next(nr));
        }

        return this.subject.pipe(first(), map((response) => {
            return {
                AllSystemUsers: response[1]?.ResultSet?.map(function (element: any) {
                    return { code: element.USERID?.toString(), TextValue: element.USERNME } as INFSDropDownData;
                }),
                AllStatuses: response[0].ResultSet.STUSCODE?.map(function (element: any) {
                    if (element.CODE === null) {
                        return null;
                    }
                    return { code: element.CODE?.toString(), TextValue: element.DESCRIPTION } as INFSDropDownData;
                }).filter(Boolean),
                AllIntroducers: response[0].ResultSet.INTRODUCER?.map(function (element: any) {
                    if (element.BUSINESSPARTNERID === -1) {
                        return null;
                    }
                    return { code: element.BUSINESSPARTNERID?.toString(), TextValue: element.BUSINESSPARTNERNME } as INFSDropDownData;
                }).filter(Boolean),
                AllFinancialProducts: response[0].ResultSet.FINLPROD?.map(function (element: any) {
                    if (element.FINANCIALPRODUCTID === -1) {
                        return null;
                    }
                    return { code: element.FINANCIALPRODUCTID?.toString(), TextValue: element.FINANCIALPRODUCTNME } as INFSDropDownData;
                }).filter(Boolean),
                AllFinancialGroups: response[0].ResultSet.FINLPRODGRUP?.map(function (element: any) {
                    if (element.FPGROUPID === -1) {
                        return null;
                    }
                    return { code: element.FPGROUPID?.toString(), TextValue: element.FPGROUPNME } as INFSDropDownData;
                }).filter(Boolean),
                AllProposalTypes: response[0].ResultSet.PRPLTYPECODE?.map(function (element: any) {
                    if (element.PROPOSALTYPECDE === null) {
                        return null;
                    }
                    return { code: element.PROPOSALTYPECDE?.toString(), TextValue: element.PROPOSALTYPEDSC } as INFSDropDownData;
                }).filter(Boolean)
            };
        }),
            catchError(error => of(error)));
    }
}
