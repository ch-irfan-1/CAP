import { Injectable } from '@angular/core';
import { IQUOTInfo, IQUOT_DOCTInfo } from '@NFS_Entity/Quot-Entity/Quot.model.index';
import { IContractForIopsInfoParams } from '@NFS_Interfaces/RequestInterfaces/icontract-for-iops-info-params';
import { IExistingBPInfoParm } from '@NFS_Interfaces/RequestInterfaces/iexisting-bpinfo-parm';
import { IQuotationInfoParm } from '@NFS_Interfaces/RequestInterfaces/IQuotationInfoParm';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommunicationBaseService } from '../Communication/communication-base.service';
import { SERVICE_URL } from '../_helper/api-url';

@Injectable({
  providedIn: 'root'
})
export class QuotationService {

  private quotObs$: BehaviorSubject<any> = new BehaviorSubject(null);

  getQuotObs(): Observable<any> {
    return this.quotObs$.asObservable();
  }

  setQuotObs(profile: any) {
    this.quotObs$.next(profile);
  }

  constructor(private _ApiComm: CommunicationBaseService) { }

  SaveQuotation(request: any): Observable<any> {
    try {

      let RequestBody: any = {
        "quotation": request
      };
      return this._ApiComm.APIRequest(SERVICE_URL.saveQuotationUrl, request).pipe(
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
      console.log("Error Occured while saving Lead => ", e);
      return of(false);
    }

  }

  ReadQueueByUser(request: IQuotationInfoParm): Observable<any> {
    try {

      // let RequestBody: any = {
      //   "quotation": request
      // };
      return this._ApiComm.APIRequest(SERVICE_URL.readQuotationQueueByUserUrl, request).pipe(
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
      console.log("Error Occured while retreiving Lead Work Queue=> ", e);
      return of(false);
    }

  }

  ReadQuotation(request: IQuotationInfoParm): Observable<any> {
    try {

      // let RequestBody: any = {
      //   "quotation": request
      // };
      return this._ApiComm.APIRequest(SERVICE_URL.readQuotation, request).pipe(
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
      console.log("Error Occured while retreiving Lead Work Queue=> ", e);
      return of(false);
    }

  }

  CancelQuotation(request: any): Observable<any> {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.cancelQoutation, request).pipe(
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
      console.log("Error Occured while saving Lead => ", e);
      return of(false);
    }
  }

  SubmitQuotation(request: IQUOTInfo) {
    try {

      // let RequestBody: any = {
      //   "quotation": request
      // };
      return this._ApiComm.APIRequest(SERVICE_URL.SubmitQuotation, request).pipe(
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
      console.log("Error Occured while retreiving Lead Work Queue=> ", e);
      return of(false);
    }
  }

  LoadExistingBP(request: IExistingBPInfoParm): Observable<any> {
    try {

      // let RequestBody: any = {
      //   "quotation": request
      // };
      return this._ApiComm.APIRequest(SERVICE_URL.loadExistingBP, request).pipe(
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

  LoadContract(request: IContractForIopsInfoParams): Observable<any> {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.loadContract, request).pipe(
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

  UploadDocument(request: IQUOT_DOCTInfo) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.UploadDocument, request).pipe(
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
      console.log("Error Occured while Uploading Documents => ", e);
      return of(false);
    }
  }

  SaveEagleScore(request: any): Observable<any> {
    try {

      let RequestBody: any = {
        "quotation": request
      };
      return this._ApiComm.APIRequest(SERVICE_URL.SaveEagleScore, request).pipe(
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
      console.log("Error Occured while saving Lead => ", e);
      return of(false);
    }

  }

  ViewDocument(request: IQUOT_DOCTInfo) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ViewDocument, request).pipe(
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
      console.log("Error Occured while Uploading Documents => ", e);
      return of(false);
    }
  }

  ReadDocumentList(request: IQuotationInfoParm) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadDocumentList, request).pipe(
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
      console.log("Error Occured while Uploading Documents => ", e);
      return of(false);
    }
  }

  DeleteDocument(request: IQUOT_DOCTInfo) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.DeleteDocument, request).pipe(
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
      console.log("Error Occured while Uploading Documents => ", e);
      return of(false);
    }
  }

  GetVOList(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.GetVOList, request).pipe(
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
      console.log("Error Occured while Uploading Documents => ", e);
      return of(false);
    }
  }

  GetMVOUsersList(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.GetMVOUsersList, request).pipe(
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
      console.log("Error Occured while Uploading Documents => ", e);
      return of(false);
    }
  }

  AssignToVO(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.AssignToVO, request).pipe(
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
      console.log("Error Occured while Assigning Lead => ", e);
      return of(false);
    }
  }

  ReadQuotInfo(request: IQuotationInfoParm) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.readQuotInfo, request).pipe(
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
      console.log("Error Occured while retreiving Lead Work Queue=> ", e);
      return of(false);
    }
  }

  ReAssignToVO(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReAssignToVO, request).pipe(
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
      console.log("Error Occured while Re-Assigning Lead => ", e);
      return of(false);
    }
  }

  ReadLeadStatuses(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadLeadStatuses, request).pipe(
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
      console.log("Error Occured while Reading Lead Statuses => ", e);
      return of(false);
    }
  }

  ReadTopFinancialProducts(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadTopFinancialProducts, request).pipe(
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
      console.log("Error Occured while Reading Top Financial Products => ", e);
      return of(false);
    }
  }

}

