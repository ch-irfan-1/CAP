
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { BehaviorSubject, forkJoin, Observable, of, ReplaySubject } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { ClientStoreService } from '../ClientCache/client-store.service';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  private appConfig: any;
  //public LocalData: any = {};
  private _localData: any = {};
  public _validationsData: any = {};
  private _messages: any = {};
  

  get LocalData(): any {
    if (this._localData == undefined || Object.keys(this._localData)?.length === 0) {
      this._localData = this._storageService.GetLocalData();
    }

    return this._localData;
  }

  set LocalData(data: any) {
    this._localData = data;
    this._storageService.SetLocalData(data);
  }

  get ValidationsData(): any {
    if (this._validationsData == undefined || Object.keys(this._validationsData)?.length === 0) {
      this._validationsData = this._storageService.GetValidationsData();
    }

    return this._validationsData;
  }

  set ValidationsData(data: any) {
    this._validationsData = data;
    this._storageService.SetValidationsData(data);
  }

  get Messages(): any {
    if (this._messages == undefined || Object.keys(this._messages)?.length === 0) {
      this._messages = this._storageService.GetMessagesData();
    }

    return this._messages;
  }

  set Messages(data: any) {
    this._messages = data;
    this._storageService.SetMessagesData(data);
  }

  isDataRequested = false;
  //subject: BehaviorSubject<Array<object>> = new BehaviorSubject([{}]);
  subject = new ReplaySubject<Array<object>>();

  constructor(private http: HttpClient, private _storageService: ClientStoreService) { }

  loadAppConfig() {
    const jsonFile = `assets/AppConfig/AppConfig.json`;
    return new Promise<void>((resolve, reject) => {
      this.http.get(jsonFile).toPromise().then(response => {
        this.appConfig = response;
        resolve();
      }).catch((response: any) => {
        reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
      });
    });
  }

  get apiBaseUrl() {
    if (!this.appConfig) {
      throw Error('Application Configuration not loaded properly!');
    }
    return this.appConfig.apiBaseUrl;
  }

  get ShowProvisionFeeValidation() {
    if (!this.appConfig) {
      throw Error('Application Configuration not loaded properly!');
    }
    return this.appConfig.ShowProvisionFeeValidation;
  }

  get ShowInterestRateValidation() {
    if (!this.appConfig) {
      throw Error('Application Configuration not loaded properly!');
    }
    return this.appConfig.ShowInterestRateValidation;
  }

  get CompanyCode() {
    if (!this.appConfig) {
      throw Error('Application Configuration not loaded properly!');
    }
    return this.appConfig.CompanyCode;
  }

  get CaptchaKey() {
    if (!this.appConfig) {
      throw Error('Application Configuration not loaded properly!');
    }
    return this.appConfig.captchaKey;
  }

  get APID() {
    if (!this.appConfig) {
      throw Error('Application Configuration not loaded properly!');
    }
    return this.appConfig.APID;
  }

  get FileUploadConfig() {
    if (!this.appConfig) {
      throw Error('Application Configuration not loaded properly!');
    }
    return this.appConfig.FileUpload;
  }

  get GetIdleTimeout() {
    if (!this.appConfig) {
      throw Error('Application Configuration not loaded properly!');
    }
    return this.appConfig.IdleTimeout;
  }

  get DateRangeDaysLimit(){
    if (!this.appConfig) {
      throw Error('Application Configuration not loaded properly!');
    }
    return +this.appConfig.DateRangeDaysLimit;
  }

  get EnableTwoFactorAuth() {
    if (!this.appConfig) {
      throw Error('Application Configuration not loaded properly!');
    }
    return this.appConfig.EnableTwoFactorAuth;
  }

  get ChannelTimeout() {
    if (!this.appConfig) {
      throw Error('Application Configuration not loaded properly!');
    }
    return this.appConfig.ChannelTimeout;
  }

  get AppVersion() {
    if (!this.appConfig) {
      throw Error('Application Configuration not loaded properly!');
    }
    return this.appConfig.AppVersion;
  }

  get EApprovalGroups(){
    if (!this.appConfig) {
      throw Error('Application Configuration not loaded properly!');
    }
    return this.appConfig.EApprovalGroups;

  }

  get SupervisorGroup(){
    if (!this.appConfig) {
      throw Error('Application Configuration not loaded properly!');
    }
    return this.appConfig.SupervisorGroup;

  }

  get WRQUUserDD_DisabledGroup(){
    if (!this.appConfig) {
      throw Error('Application Configuration not loaded properly!');
    }
    return this.appConfig.WRQUUserDD_DisabledGroup;

  }


  get CAApproveGroup(){
    if (!this.appConfig) {
      throw Error('Application Configuration not loaded properly!');
    }
    return this.appConfig.CAApproveGroup;

  }
  get googleMapAPIKey_embed() {
    if (!this.appConfig) {
      throw Error('Application Configuration not loaded properly!');
    }
    return this.appConfig.googleMapAPIKey_embed;
  }
  get googleMapsApi() {
    if (!this.appConfig) {
      throw Error('Application Configuration not loaded properly!');
    }
    return this.appConfig.googleMapsApi;
  }
  get googleMapAPIKey_JS() {
    if (!this.appConfig) {
      throw Error('Application Configuration not loaded properly!');
    }
    return this.appConfig.googleMapAPIKey_JS;
  }
  get googleMapAPISelector() {
    if (!this.appConfig) {
      throw Error('Application Configuration not loaded properly!');
    }
    return this.appConfig.googleMapAPISelectorFlag;
  }
  get googleMapZoomLevel() {
    if (!this.appConfig) {
      throw Error('Application Configuration not loaded properly!');
    }
    return this.appConfig.googleMapZoomLevel;
  }
  loadLocalData(): Observable<any> {
    return this.http.get('assets/Localization/oto_local_en.json');
  }

  // setLocalData(data: any) {
  //   this.LocalData = data;
  // }

  loadValidationsData(): Observable<any> {
    // switch (formMode) {
    //   case FormMode.EDIT: {
    return this.http.get('assets/Localization/finance_type_validations.json');
    // }
    //}
    //return of();
  }

  loadMessages(langCode: any): Observable<any> {
    if(!langCode)
    {
      return this.http.get('assets/Localization/en-GB.json');
    }
    switch (langCode) {
      case '00001': {
        return this.http.get('assets/Localization/en-GB.json');
        break;
      }
      case '00002': {
        return this.http.get('assets/Localization/id-ID.json');
        break;
      }
      default: {
        return of();
        break;
      }
    }

  }

  // setValidationsData(data: any) {
  //   this.ValidationsData = data;
  // }

  // loadData(): Observable<any> {
  //   if (!this.isDataRequested) {
  //     this.isDataRequested = true;

  //     forkJoin([
  //       this.loadLocalData(),
  //       this.loadValidationsData(FormMode.EDIT)
  //     ]).subscribe(nr => this.subject.next(nr));
  //   }

  //   return this.subject.pipe(first(), map((response) => {
  //     return {
  //       LocalData: response[0],
  //       ValidationsData: response[1]
  //     };
  //   }),
  //     catchError(error => of(error)));
  // }

}
