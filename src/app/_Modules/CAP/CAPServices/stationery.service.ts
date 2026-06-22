import { Injectable } from '@angular/core';
import { CommunicationBaseService } from '@NFS_Core/NFSServices/Communication/communication-base.service';
import { SERVICE_URL } from '@NFS_Core/NFSServices/_helper/api-url';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class StationeryService {

    constructor(private _ApiComm: CommunicationBaseService) { }

    GenerateOVPStationery(request: IProposalInfoParm) {
        try {
            return this._ApiComm.APIRequest(SERVICE_URL.GenerateStationery, request).pipe(
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
            console.log("Error Occured while reading Proposal Queue => ", e);
            return of(false);
        }
    }
    PrintPointScore(request: IProposalInfoParm) {
        try {
            return this._ApiComm.APIRequest(SERVICE_URL.PrintPointScore, request).pipe(
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
            console.log("Error Occured while Printing point scoring details => ", e);
            return of(false);
        }
    }
    GetAssociatedStationeryWithFPId(request:any){
        try {
            return this._ApiComm.APIRequest(SERVICE_URL.GetAssociatedStationeryWithFPId, request).pipe(
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
            console.log("Error Occured while Printing point scoring details => ", e);
            return of(false);
        }
    }
    PrintStationery(request:any){
        try {
            return this._ApiComm.APIRequest(SERVICE_URL.PrintStationery, request).pipe(
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
            console.log("Error Occured while Printing point scoring details => ", e);
            return of(false);
        }
    }
    ReadAlreadyConvertedContract(request:any){
        try {
            return this._ApiComm.APIRequest(SERVICE_URL.ReadAlreadyConvertedContract, request).pipe(
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
            console.log("Error Occured while Printing point scoring details => ", e);
            return of(false);
        }
    }
}