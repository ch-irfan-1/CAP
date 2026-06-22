import { Injectable } from '@angular/core';
import { User } from '@NFS_Entity/User-Entity/UserInfoEntity';
import { SessionStorageService } from "ngx-webstorage";
import { SecurityService } from '../Authentication/security.service';

@Injectable({
  providedIn: 'root'
})
export class ClientStoreService {

  private UserGroupCode: string = ""

  constructor(private storage: SessionStorageService,
    private securityService: SecurityService) {

  }

  get IsAppLoggedIn(): boolean {
    var data;

    if (this.storage) {
      data = this.storage.retrieve(StoreEnum.IsAppLoggedIn.toString());
    }

    return data ? data : false;
  }

  public SetUserInfo(response: User, CallingReference: string) {
    if (CallingReference === "AuthenticationService") {
      this.storage.store(StoreEnum.UserInfo.toString(), response);
    }
    else {
      throw new Error("Method " + CallingReference + " is not allowed to set user Data");
    }
  }

  public SetLoggedInFlag(CallingReference: string) {
    if (CallingReference === "AuthenticationService") {
      this.storage.store(StoreEnum.IsAppLoggedIn.toString(), true);
    }
    else {
      throw new Error("Method " + CallingReference + " is not allowed to set user Data");
    }
  }

  public GetUserInfo(): any {
    var data;

    if (this.storage) {
      data = this.storage.retrieve(StoreEnum.UserInfo.toString());

      if (data) {
        data = JSON.parse(this.securityService.decrypt(data));
      }
    }

    return data ? data : null;
  }

  public SetLocalData(data: any) {
    this.storage.store(StoreEnum.LocalData, data);
  }

  public GetLocalData() {
    let data = this.storage.retrieve(StoreEnum.LocalData.toString());
    return data ? data : null;
  }

  public ResetLocalStore(): void {
    this.storage.clear();
  }

  public SetWorkflowUser(code: string, CallingReference: string) {
    if (CallingReference === "AuthenticationService") {
      this.storage.store(StoreEnum.WorkflowUser, code);
    }
    else {
      throw new Error("Method " + CallingReference + " is not allowed to set user Data");
    }
  }

  public GetWorkflowUser(): any {
    var data;

    if (this.storage) {
      data = this.storage.retrieve(StoreEnum.WorkflowUser.toString());

      if (data) {
        data = JSON.parse(this.securityService.decrypt(data));
      }
    }

    return data ? data : null;
  }

  public SetUserGroupCode(code: string) {
    this.storage.store(StoreEnum.UserGroupCode, code);
  }



  public GetUserGroupCode(): any {
    return this.GetWorkflowUser()?.USERGROUPASSOCIATION[0]?.USERGRUPCDE;
  }

  public SetModule(module: string) {
    this.storage.store(StoreEnum.Module, module);
  }

  public GetModule() {
    let data = this.storage.retrieve(StoreEnum.Module.toString());
    return data ? data : null;
  }
  public MVOUserGroupCodeExist(): boolean {
    let groups = this.GetWorkflowUser();
    return groups?.USERGROUPASSOCIATION.filter((x: any) => x.USERGRUPCDE == '00108').length > 0;
  }


  public SetValidationsData(data: any) {
    this.storage.store(StoreEnum.ValidationsData, data);
  }

  public GetValidationsData() {
    let data = this.storage.retrieve(StoreEnum.ValidationsData.toString());
    return data ? data : null;
  }

  public SetUserClaims(data: any) {
    this.storage.store(StoreEnum.UserClaims.toString(), data);
  }

  public GetUserClaims() {
    let data = this.storage.retrieve(StoreEnum.UserClaims.toString());
    return data ? data : null;
  }

  public SetMessagesData(data: any) {
    this.storage.store(StoreEnum.MessagesData, data);
  }

  public GetMessagesData() {
    let data = this.storage.retrieve(StoreEnum.MessagesData.toString());
    return data ? data : null;
  }
}

export enum StoreEnum {
  UserInfo = 'userInfo',
  IsAppLoggedIn = 'IsAppLoggedIn',
  LocalData = 'localData',
  WorkflowUser = 'WorkflowUser',
  UserGroupCode = 'UserGroupCode',
  Module = 'Module',
  ValidationsData = 'ValidationsData',
  UserClaims = 'userClaims',
  MessagesData = 'MessagesData'
}
