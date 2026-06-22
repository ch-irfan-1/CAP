import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { CommunicationBaseService } from '@NFS_Core/NFSServices/Communication/communication-base.service';
import { User } from '@NFS_Entity/User-Entity/UserInfoEntity';
import { AuthenticationCode } from '@NFS_Enums/AuthenticationCode.enum';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { ReturnCode } from '@NFS_Enums/ReturnCode.enum';
import { IHttpRequest } from '@NFS_Interfaces/RequestInterfaces/Http-Request-interface';
import { ITokenRequest } from '@NFS_Interfaces/RequestInterfaces/ITokenRequest';
import { IUserSecurityInfoParm } from '@NFS_Interfaces/RequestInterfaces/IUserSecurityInfoParm';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConfigService } from '../ApplicationConfig/app-config.service';
import { TokenStorageService } from '../ClientCache/token-storage.service';
import { MessageService } from '../MessageService/message.service';
import { SERVICE_URL } from '../_helper/api-url';
import { AppUserClaim } from './app-user-claim';
import { IUserSession } from '@NFS_Interfaces/RequestInterfaces/IUserSession';
import { IReadPasswordHistoryParam } from '@NFS_Interfaces/RequestInterfaces/IReadPasswordHistoryParam';


@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  captchaToken: string |null= "";

  constructor(
    private _ApiComm: CommunicationBaseService,
    private storageService: ClientStoreService,
    private tokenService: TokenStorageService,
    private appConfig: AppConfigService,
    private router: Router,
    public dialog: MatDialog,
    private msgService: MessageService) {
  }
  ResetPassword(usersession:any):any{
    try{
      return this._ApiComm.APIRequest(SERVICE_URL.ResetPassword, usersession).pipe(
        map((response) => {
          if (response) {
            return response;
          }}));
    }catch{
      return;
    }
  }
  ReadPasswordHistory(userid:number,userName:string,password:string,userNewPassword:string,confirmpassword:string,historyLimit:number):any {
    try{
      let RequestBody:IReadPasswordHistoryParam={
        "USERID": userid,
        "passwordHistoryLimit":historyLimit,
        "workflowNewPassword":userNewPassword
      }

      return this._ApiComm.APIRequest(SERVICE_URL.ReadPasswordHistory, RequestBody).pipe(
        map((response) => {
          if (response) {
            if (response.CODE.toString() === "1") {
              //TODO: any special handling in case   successfull login
              // return response;
              if(response.ResultSet && response.ResultSet!=""){
                this.msgService.showCustomMesssage("Password already Exists.",MessageType.Error);
                return   false;
              }
              else{
                if(userName==null || userName==""){
                  this.msgService.showCustomMesssage(GetMessage('msgUserIDFieldEmpty'),MessageType.Error);
                  return   false;
                  //msgUserIDFieldEmpty
                  
                }
                else if(password==null || password==""){
                  this.msgService.showCustomMesssage(GetMessage('msgPasswordFieldEmpty'),MessageType.Error);
                  return   false;
                  //msgPasswordFieldEmpty
                }
                else if(userNewPassword==null || userNewPassword==""){
                  this.msgService.showCustomMesssage(GetMessage('msgNewPasswordFieldEmpty'),MessageType.Error);
                  return   false;
                  //msgNewPasswordFieldEmpty
                }
                else if(confirmpassword==null || confirmpassword==""){
                  this.msgService.showCustomMesssage(GetMessage('msgConfirmPasswordFieldEmpty'),MessageType.Error);
                  return   false;
                  //msgConfirmPasswordFieldEmpty
                }
                else if(userNewPassword!=confirmpassword){
                  this.msgService.showCustomMesssage(GetMessage('PasswordNotMatched'),MessageType.Error);
                  return   false;
                  //PasswordNotMatched
                }
                else if(userNewPassword==password){
                  this.msgService.showCustomMesssage(GetMessage('NewPasswordOldPasswordnotbematched'),MessageType.Error);
                  return   false;
                  //NewPasswordOldPasswordnotbematched
                }
                else if(this.storageService.GetWorkflowUser().PASSWORDPOLICY.MINIMUMPASSWORDLEN> userNewPassword.trim().length){
                  this.msgService.showCustomMesssage(GetMessage('msgInvalidPasswordLength'),MessageType.Error);
                  return   false;
                  //msgInvalidPasswordLength
                }
                else {
                  if(this.storageService.GetWorkflowUser().PASSWORDPOLICY.SPECIALCHARACTERS!=0){
                    var pass=userNewPassword.trim().toString();
                    const specialChars = `\`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`;
                    var specialCharCount=0;
                    confirmpassword.split('').forEach(element => {
                      if(specialChars.includes(element)){
                        specialCharCount++;
                      }
                    });   
                    if(specialCharCount<this.storageService.GetWorkflowUser().PASSWORDPOLICY.SPECIALCHARACTERS){
                      this.msgService.showCustomMesssage(GetMessage('passContSpclChar',this.storageService.GetWorkflowUser().PASSWORDPOLICY.SPECIALCHARACTERS),MessageType.Error);
                      return   false;
                        //passContSpclChar
                    }             
                  }

                  if (this.storageService.GetWorkflowUser().PASSWORDPOLICY.UPPERCASECHARACTERS != 0) {
                    var pass = userNewPassword.trim().toString();
                    const upperCaseChars : RegExp = /[A-Z]/;
                    var upperCaseCharCount = 0;
                    confirmpassword.split('').forEach(element => {
                      if (upperCaseChars.test(element)) {
                        upperCaseCharCount++;
                      }
                    });
                    if(upperCaseCharCount<this.storageService.GetWorkflowUser().PASSWORDPOLICY.UPPERCASECHARACTERS){
                      this.msgService.showCustomMesssage(GetMessage('passContUpperCaseChar',this.storageService.GetWorkflowUser().PASSWORDPOLICY.UPPERCASECHARACTERS),MessageType.Error);
                      return   false;
                    }             
                  }

                  if (this.storageService.GetWorkflowUser().PASSWORDPOLICY.DIGITCHARACTERS != 0) {
                    var pass = userNewPassword.trim().toString();
                    const digitChars : RegExp = /\d/;
                    var digitCharCount = 0;
                    confirmpassword.split('').forEach(element => {
                      if (digitChars.test(element)) {
                        digitCharCount++;
                      }
                    });
                    if(digitCharCount<this.storageService.GetWorkflowUser().PASSWORDPOLICY.DIGITCHARACTERS){
                      this.msgService.showCustomMesssage(GetMessage('passContDigitChar',this.storageService.GetWorkflowUser().PASSWORDPOLICY.DIGITCHARACTERS),MessageType.Error);
                      return   false;
                    }             
                  }
                
                }
                return   true;
              }
            }
            else{
              return   false;
            }
        }
        else{
          return   false;
        }
      }
      ));

    }catch(e) {
      console.log("Error Occured while Reset Password in Authentication service => ", e);
      return   false;
    }
  }

  TryLogin(userName: string, password: string, enableTwoFactorAuth: boolean, ipAddress: string): Observable<any> {

    try {

      if (!userName && !password) {
        this.msgService.showCustomMesssage('User Name and Password is empty.', MessageType.Warning)
        return of({ IsLoginSuccess: false, Message: "Please enter your username and password" });
      }
      else if (userName && !password) {
        this.msgService.showCustomMesssage('Password field is empty.', MessageType.Warning)
        return of({ IsLoginSuccess: false, Message: "Please enter your password" });
      }

      else if (!userName && password) {
        this.msgService.showCustomMesssage('Username field is empty.', MessageType.Warning)
        return of({ IsLoginSuccess: false, Message: "Please enter your username" });
      }

      let RequestBody: IUserSecurityInfoParm = {

        "workflowUserName": userName,
        "workflowPassword": password,

        "USERID": 0,
        "applicationcde": "00002",
        "EnableTwoFactorAuth": enableTwoFactorAuth,
        "VerInfo": this.appConfig.AppVersion,
        "IPADDRESS": ipAddress,
        "DNSNAME": "IOPS",
        "applicationid": 16,
        "captchaToken": this.captchaToken
      };

      return this._ApiComm.APIRequest(SERVICE_URL.loginUrl, RequestBody).pipe(
        map((response) => {
          if (response) {

            if (response.ResultSet) {
              this.storageService.SetUserInfo(response.ResultSet.User, "AuthenticationService");
              this.storageService.SetWorkflowUser(response.ResultSet.WorkflowUser, "AuthenticationService");
            }

            if (response.CODE.toString() === AuthenticationCode.SuccessfullyLogin.Code) {
              //TODO: any special handling in case of successfull login
              return response;
            }
            else {
              //TODO: any special handling in case unsuccessful login
              return response;
            }
          }
          else {
            //TODO: any special handling in case no response is received.
            return response;
          }

        })
      );

    }
    catch (e) {
      console.log("Error Occured while TryLogin in Authentication service => ", e);
      return of(false);
    }
  }

  LoginForApplicationView(userName: string, password: string, enableTwoFactorAuth: boolean, ipAddress: string, userId: number): Observable<any> {

    try {

      let RequestBody: IUserSecurityInfoParm = {

        "workflowUserName": userName,
        "workflowPassword": password,

        "USERID": userId,
        "applicationcde": "00002",
        "EnableTwoFactorAuth": enableTwoFactorAuth,
        "VerInfo": this.appConfig.AppVersion,
        "IPADDRESS": ipAddress,
        "DNSNAME": "IOPS",
        "applicationid": 16,
        "captchaToken": this.captchaToken
      };

      return this._ApiComm.APIRequest(SERVICE_URL.loginForApplicationView, RequestBody).pipe(
        map((response) => {
          if (response) {
            if (response.ResultSet) {
              this.storageService.SetUserInfo(response.ResultSet.User, "AuthenticationService");
              this.storageService.SetWorkflowUser(response.ResultSet.WorkflowUser, "AuthenticationService");
            }

            return response;
          }
        })
      );
    }
    catch (e) {
      console.log("Error Occured while TryLogin in Authentication service => ", e);
      return of(false);
    }
  }

  Logout(): Observable<any> {

    let userInfo: User = this.storageService.GetUserInfo();
    if (userInfo) {

      let RequestBody: any = {};

      return this._ApiComm.APIRequest(SERVICE_URL.logoutUrl, RequestBody).pipe(
        map((response) => {
          this.storageService.ResetLocalStore();
          this.tokenService.ResetTokenStore();
          this.captchaToken = "";
          this.dialog.closeAll();
        })
      );
    }

    return of(false);
  }

  forcefullyLogout(userName: string, password: string, enableTwoFactorAuth: boolean, ipAddress: string): Observable<any> {

    let userInfo: User = this.storageService.GetUserInfo();
    if (userInfo) {

      let RequestBody: IUserSecurityInfoParm = {

        "workflowUserName": userName,
        "workflowPassword": password,

        "USERID": 0,
        "applicationcde": "00002",
        "EnableTwoFactorAuth": enableTwoFactorAuth,
        "VerInfo": this.appConfig.AppVersion,
        "IPADDRESS": ipAddress,
        "DNSNAME": "IOPS",
        "applicationid": 16,
        "captchaToken": ""
      };

      return this._ApiComm.APIRequest(SERVICE_URL.forcefullyLogoutUrl, RequestBody).pipe(
        map((response) => {
          if (response) {

            if (response.ResultSet) {
              this.storageService.SetUserInfo(response.ResultSet.User, "AuthenticationService");
            }

            if (response.CODE.toString() === AuthenticationCode.SuccessfullyLogin.Code) {
              //TODO: any special handling in case of successfull login
              return response;
            }
            else {
              //TODO: any special handling in case unsuccessful login
              return response;
            }
          }
          else {
            //TODO: any special handling in case no response is received.
            return response;
          }

        })
      );
    }

    return of(false);
  }

  VerifyOTPToken(otp: string): Observable<any> {

    if (!otp) {
      return of({ CODE: 124, MESSAGE: "Please enter OTP" });
    }

    let RequestTypeDetail: IHttpRequest = SERVICE_URL.VerifyOTPTokenUrl;
    let RequestBody: any = { "OTP": otp };

    return this._ApiComm.APIRequest(RequestTypeDetail, RequestBody).pipe(map(response => {
      if (response.ResultSet != null && response.ResultSet.Token != null && response.ResultSet.RefreshToken != null && response.CODE.toString() === ReturnCode.Success.Code) {
        this.tokenService.saveToken(response.ResultSet.Token, response.ResultSet.RefreshToken);
      }
      return response;
    }));
  }

  ResendOTPToken(): Observable<any> {

    let RequestTypeDetail: IHttpRequest = SERVICE_URL.ResendOTPTokenUrl;
    let RequestBody: any;

    return this._ApiComm.APIRequest(RequestTypeDetail, RequestBody).pipe(map(response => {
      return response;
    }));;
  }

  RefreshToken(): Observable<any> {
    let tokenObject = { Token: this.tokenService.getToken(), RefreshToken: this.tokenService.getRefreshToken() } as ITokenRequest;
    let RequestTypeDetail: IHttpRequest = SERVICE_URL.refreshTokenUrl;
    let RequestBody: any = tokenObject;

    return this._ApiComm.APIRequest(RequestTypeDetail, RequestBody).pipe(map(response => {
      if (response.Token != null && response.RefreshToken != null && response.Success) {
        this.tokenService.saveToken(response.Token, response.RefreshToken);
      }
      else {
        this.tokenService.ResetTokenStore();
        this.Logout().subscribe(res => {
          this.router.navigate(['/login']);
        });
      }
    }));
  }

  ReadUserClaim(): Observable<any> {

    let userInfo: User = this.storageService.GetUserInfo();
    if (userInfo) {

      let RequestBody: any = {};

      return this._ApiComm.APIRequest(SERVICE_URL.ReadUserClaim, RequestBody).pipe(
        map((response) => {

          if (response.ResultSet) {
            this.storageService.SetUserClaims(response.ResultSet);
          }

          if (response.CODE.toString() === AuthenticationCode.SuccessfullyLogin.Code) {
            //TODO: any special handling in case of successfull login
            return response;
          }
          else {
            //TODO: any special handling in case unsuccessful login
            return response;
          }
        })
      );
    }

    return of(false);
  }

  // This method can be called a couple of different ways
  // *hasClaim="'claimType'"  // Assumes claimValue is true
  // *hasClaim="'claimType:value'" // Compares claimValue to value
  // *hasClaim="['claimType1','claimType2:value','claimType3']"
  hasClaim(claimType: any, claimValue?: any): boolean {
    let ret: boolean = false;

    // See if an array of values was passed in.
    if (typeof claimType === "string") {
      ret = this.isClaimValid(claimType, claimValue);
    }
    else {
      let claims: string[] = claimType;
      if (claims) {
        for (let index = 0; index < claims.length; index++) {
          ret = this.isClaimValid(claims[index]);
          // If one is successful, then let them in
          if (ret) {
            break;
          }
        }
      }
    }

    return ret;
  }

  private isClaimValid(claimType: string, claimValue?: string): boolean {
    let ret: boolean = false;
    let userClaims: AppUserClaim[] = [];

    // Retrieve security object
    userClaims = this.storageService.GetUserClaims();
    if (userClaims) {
      // See if the claim type has a value
      // *hasClaim="'claimType:value'"
      if (claimType.indexOf(":") >= 0) {
        let words: string[] = claimType.split(":");
        claimType = words[0].toLowerCase();
        claimValue = words[1];
      }
      else {
        claimType = claimType.toLowerCase();
        // Either get the claim value, or assume 'true'
        claimValue = claimValue ? claimValue : "true";
      }
      // Attempt to find the claim
      ret = userClaims.find(
        c => c.ClaimType.toLowerCase() == claimType
          && c.ClaimValue == claimValue) != null;
    }

    return ret;
  }
}
export function GetMessage(msgCode: any,num:any=0): string {
  let msgVal = '';
  switch(msgCode){
    case 'msgUserIDFieldEmpty':{
      msgVal='User Name field is empty.';
      break;
    }
    case 'msgPasswordFieldEmpty':{
      msgVal='Password field is empty.';
      break;
    }
    case 'msgNewPasswordFieldEmpty':{
      msgVal='New Password field is empty.';
      break;
    }
    case 'msgConfirmPasswordFieldEmpty':{
      msgVal='Confirm Password field is empty.';
      break;
    }
    case 'PasswordNotMatched':{
      msgVal='Password Not Matched.';
      break;
    }
    case 'NewPasswordOldPasswordnotbematched':{
      msgVal='New Password should not be matched with Old Password.';
      break;
    }
    case 'msgInvalidPasswordLength':{
      msgVal='Password length is not valid.';
      break;
    }
    case 'passContSpclChar':{
      msgVal='Password should contain atleast '+num+' special characters.';
      break;
    }
    case 'msgPasswordExits':{
      msgVal='Password already Exists.';
      break;
    }
    case 'passContUpperCaseChar':{
      msgVal='Password should contain at least '+num+' uppercase alphabet(s).';
      break;
    }
    case 'passContDigitChar':{
      msgVal='Password should contain at least '+num+' digit(s).';
      break;
    }
  }
  return msgVal;
}
