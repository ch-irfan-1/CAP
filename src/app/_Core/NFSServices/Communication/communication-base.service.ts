import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
import { IHttpRequest } from '@NFS_Interfaces/RequestInterfaces/Http-Request-interface';
import { IUserInfo } from '@NFS_Interfaces/ResponseInterfaces/IUserInfo-interface';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SecurityService } from '../Authentication/security.service';
import { CacheService } from '../ClientCache/cache.service';
import { ClientStoreService } from '../ClientCache/client-store.service';




@Injectable({
  providedIn: 'root'
})
export class CommunicationBaseService {

  _httpHeaders: HttpHeaders = new HttpHeaders();
  _apiResponse: any[] = [];

  constructor(private _http: HttpClient,
    private _AppConfig: AppConfigService,
    private storageService: ClientStoreService,
    private securityService: SecurityService,
    private cacheService: CacheService) { }

  /**
   * Base Method for API calling
   * @param Request => Http Request method (GET, POST, etc...) and API endPoint
   * @param RequestBody => Request body
   * Returns Observable
   */
  APIRequest(Request: IHttpRequest, RequestBody: any = null) {

    var key = this.cacheService.hashCode(Request.EndPoint + JSON.stringify(RequestBody));
    let callApi: boolean = false;
    let CompleteRequest = { body: RequestBody, headers: this.SetRequestHeader() }
    const protocol = window.location.protocol;

    if (this.cacheService.cachedRequests.includes(Request.EndPoint)) {
      if (this._apiResponse[key] === undefined) {
        callApi = true;
      }
    }
    else {
      callApi = true;
    }

    if (callApi) {
      return this._http.request<any>(Request.Method, protocol + '//' + this._AppConfig.apiBaseUrl + Request.EndPoint, CompleteRequest).
        pipe(map((Response: any) => {
          this._apiResponse[key] = Response;
          return Response;
        })
          , catchError(error => { return of(error) })
        );
    }
    else {
      return of(this._apiResponse[key]);
    }
  }

  /**
   * Set Request Headers for HTTP Request
   */
  private SetRequestHeader(): HttpHeaders {
    // let Headers: IRequestHeader = {'Requestheaders': new HttpHeaders()};
    this._httpHeaders = this._httpHeaders.set('Content-Type', 'application/json');
    let userInfo = this.storageService.GetUserInfo();
    if (userInfo != null) {
      let userInfoHeader: IUserInfo =
      {
        ApplicationCode: userInfo.ApplicationCode,
        SESSIONCDE: userInfo.SessionCode,
        SESSIONID: userInfo.SessionId,
        UserId: userInfo.UserId,
        UserName: userInfo.UserName,
        LanguageInfo: { LANGUAGECDE: userInfo?.LanguageInfo?.LANGUAGECDE },
        CompanyId: userInfo.CompanyId,
        userEmailID: userInfo.userEmailID,
        CompanyName: this._AppConfig.CompanyCode == '001' ? 'PT. OTO Multiartha' : 'PT. SUMMIT OTO FINANCE',
        ProcessingDate: userInfo.ProcessingDate,
        IsOTO: userInfo.IsOTO,
        MPOSMiddlewareVersion: userInfo.MPOSMiddlewareVersion,
        userFullName: userInfo.userFullName,
        UserGroupCode: this.storageService.GetUserGroupCode(),
        DealerAssociationCode: userInfo.DealerAssociationCode,
        IsCAPAngular: true
      };

      this._httpHeaders = this._httpHeaders.set('UserInfo', this.securityService.encrypt(JSON.stringify(userInfoHeader)));
    }
    return this._httpHeaders;
  }


}
