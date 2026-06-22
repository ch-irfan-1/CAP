import { Injectable } from '@angular/core';
import { IDTSDocumentUploadParam } from '@NFS_Entity/ProposalDTS-Entity/DTSDocumentUploadParam.model';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommunicationBaseService } from '../Communication/communication-base.service';
import { SERVICE_URL } from '../_helper/api-url';

@Injectable({
  providedIn: 'root'
})

export class ProposalDTSService {
  private apiDoneSource = new Subject<void>();
  apiDone$ = this.apiDoneSource.asObservable();
  private latlngSource = new Subject<void>();
  contactAddLatlng$ = this.latlngSource.asObservable();
  constructor(private _ApiComm: CommunicationBaseService) { }

  getGeoCodeCoordinates(location: string): Observable<any> {
    try {
      const request = { contactaddress: location };
      return this._ApiComm.APIRequest(SERVICE_URL.GeoCode, request).pipe(
        map((response) => {
          if (response) {
            const result = response.results[0]?.geometry?.location;
          return { lat: result?.lat, lng: result?.lng };
          } else {
            return null;
          }
        })
      );
    } catch (e) {
      console.error("Error occurred while fetching coordinates => ", e);
      return of(false);
    }
  }

  announceApiDone(): void {
    this.apiDoneSource.next();
  }

  getAndSetAddlatlng(data: any): void {
    this.latlngSource.next(data);
  }

  saveGeoCodeHistory(request: any){
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.SaveGeoCodeHistory, request).pipe(
        map((response) => {
          if (response) {
            return response
          } else {
            return null
          }
        }))
    }
    catch (e) {
      console.log("An Error Occured while saving Geo Location history =>", e);
      return of(false);
    }
  }

  getGeoCodeHistoryByProposalId(request: any){
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadGeoCodeHistoryByProposalId, request).pipe(
        map((response) => {
          if (response) {
            return response
          } else {
            return null
          }
        }))
    }
    catch (e) {
      console.log("An Error Occured while saving Geo Location history =>", e);
      return of(false);
    }
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    if (lat1 !== 0 && lon1 !== 0 && lat2 !== 0 && lon2 !== 0) {
      const toRadians = (degree: number) => degree * (Math.PI / 180);

      const R = 6371;
      const dLat = toRadians(lat2 - lat1);
      const dLon = toRadians(lon2 - lon1);

      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    } else {
      return 0;
    }
  }

  CheckGeoCodeHistory(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.CheckGeoCodeHistory, request).pipe(
        map((response) => {
          if (response) {
            return response
          } else {
            return null
          }
        }))
    }
    catch (e) {
      console.log("An Error Occured =>", e);
      return of(false);
    }
  }

  ReadProposalDTSEntity(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadProposalDTSEntity, request).pipe(
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
      console.log("Error Occured while loading existing applicant data=> ", e);
      return of(false);
    }
  }

  SaveProposalDTSEntity(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.SaveProposalDTSEntity, request).pipe(
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
      console.log("Error Occured while saving updated applicant data=> ", e);
      return of(false);
    }
  }

  Is_Directory_Path_Exists() {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.Is_Directory_Path_Exists).pipe(
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
      console.log("Error Occured while saving updated applicant data=> ", e);
      return of(false);
    }
  }

  GetSubsidryAddressTypeLookup() {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.GetSubsidryAddressType).pipe(
        map((response) => {
          if (response) {
            return response.ResultSet;
          }
          else {
            return null;
          }

        })
      );

    }
    catch (e) {
      console.log("Error Occured while getting BP Subsidy data=> ", e);
      return of(false);
    }
  }

  UploadDocument(request: IDTSDocumentUploadParam) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.UploadDocumentDTS, request).pipe(
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
      console.log("Error Occured while document uploading ", e);
      return of(false);
    }
  }

  ReadDocument(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ConvertToStream, request).pipe(
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
      console.log("Error Occured while document reading ", e);
      return of(false);
    }
  }
}
