import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
import { AuthenticationService } from '@NFS_Core/NFSServices/Authentication/authentication.service';
import { ReCaptchaService } from '@NFS_Core/NFSServices/Authentication/recaptcha.service';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { TokenStorageService } from '@NFS_Core/NFSServices/ClientCache/token-storage.service';
import { DialogBoxService } from '@NFS_Core/NFSServices/DialogBox/dialog-box.service';
import { HeaderTitleService } from '@NFS_Core/NFSServices/_helper/header-title-service.service';
import { IpServiceService } from '@NFS_Core/NFSServices/_helper/ip-service.service';
import { ApplicationViewParams } from '@NFS_Entity/Login-Entity/ApplicationViewParams';
import { AuthenticationCode } from '@NFS_Enums/AuthenticationCode.enum';
import { ReturnCode } from '@NFS_Enums/ReturnCode.enum';
import { QueueOperation } from '@NFS_Enums/WorkQueueOperation.enum';
import { RecaptchaComponent } from 'ng-recaptcha-2';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { validate } from 'json-schema';
import { IUserSession } from '@NFS_Interfaces/RequestInterfaces/IUserSession';
import { userInfo } from 'os';
import { FormModeService } from '../../../_Core/NFSServices/FormMode/form-mode.service';
import { FormMode } from '@NFS_Enums/FormMode.enum';
@Component({
    selector: 'app-login-main',
    templateUrl: './login-main.component.html',
    styleUrls: ['./login-main.component.css'],
    standalone: false
})
export class LoginMainComponent implements OnInit, OnDestroy,AfterViewInit {
  @ViewChild('captchaElem') captchaElem!: RecaptchaComponent;
  hardRefresh: boolean = false;

  loginForm: UntypedFormGroup = new UntypedFormGroup({
    username: new UntypedFormControl('', [Validators.required]),
    password: new UntypedFormControl('', Validators.required),
    newpassword: new UntypedFormControl('', Validators.required),
    confirmpassword: new UntypedFormControl('', Validators.required),
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    OTP: new UntypedFormControl('', [Validators.required]),
  });

  reCaptchaKey: string = '';
  enableTwoFactorcontrols: boolean = false;
  enableRecaptcha: boolean = false;
  ipAddress: string = '';
  subscription$ = new Subject();
  resetPassword: boolean = false;

  constructor(
    private _auth: AuthenticationService,
    private router: Router,
    private reCaptchaService: ReCaptchaService,
    public appConfig: AppConfigService,
    private toastr: ToastrService,
    private storageService: ClientStoreService,
    private _dialog: DialogBoxService,
    private tokenService: TokenStorageService,
    private ip: IpServiceService,
    private route: ActivatedRoute,
    private headerTitleService: HeaderTitleService,
    private msgService: MessageService,
    private _formModeService: FormModeService,
  ) {
    this.reCaptchaKey = this.appConfig.CaptchaKey;

    if (this.appConfig.EnableTwoFactorAuth) {
      this.enableRecaptcha = true;
    }

    //execute this chunk only if New build is detected
    const navigation = this.router?.getCurrentNavigation();
    const state = navigation?.extras.state as { hardRefresh: boolean };
    if (state?.hardRefresh) {
      this.hardRefresh = state.hardRefresh;
      if (this.hardRefresh) {
        window.location.reload();
      }
    }

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          if (event.url === '/login') {
            this.appConfig.LocalData = {};
            this.appConfig.ValidationsData = {};
          }
        }
      });
  }
  ngAfterViewInit(): void {
    this._formModeService.FormMode= FormMode.NEW;
  }

  ngOnInit(): void {
    //this.getIP();
    this._formModeService.FormMode= FormMode.NEW;
    this.route.queryParams
      .subscribe(params => {
        let prm = params as ApplicationViewParams;
        if (prm.USERID > 0 && prm.ProposalId > 0 && prm.Username !== '' && prm.Password !== '') {
          this._auth
            .LoginForApplicationView(
              prm.Username,
              prm.Password,
              false,
              '',
              prm.USERID
            )
            .pipe(takeUntil(this.subscription$))
            .subscribe((response) => {
              if (response === false) {
                //TODO: any special handling in case of some exception occured in TryLogin
                console.log('Some Error Occured at while processing Login requet');
              } else if (
                response.CODE.toString() ===
                AuthenticationCode.SuccessfullyLogin.Code &&
                !this.appConfig.EnableTwoFactorAuth
              ) {
                //TODO: any special handling in case of successfull login
                this.storageService.SetLoggedInFlag('AuthenticationService');
                this.tokenService.saveToken(
                  response.ResultSet.AuthenticationResults.Token,
                  response.ResultSet.AuthenticationResults.RefreshToken
                );

                this.storageService.SetUserClaims(response.ResultSet.Claims);
                this.router.navigateByUrl('/Proposal/createProposal', { state: { Proposal: { PROPOSALID: prm.ProposalId }, QueueOperation: QueueOperation.VIEW } });
                this.headerTitleService.setTitle("Proposal");

              } else if (
                response.CODE.toString() ===
                AuthenticationCode.PasswordNotVerified.Code ||
                response.CODE.toString() === AuthenticationCode.UserDoesNotExist.Code
              ) {
                this.toastr.error('Invalid User Name or Password');
              } else {
                this.toastr.error(response.MESSAGE);
              }
            });
        }
      }
      );
  }

  getIP() {
    this.ip.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  ChangeNewPassword(){
    let usersession={} as IUserSession;
    //history limit check 
    this._auth.ReadPasswordHistory(
      this.storageService.GetUserInfo()?.UserId,
      this.loginForm.get('username')?.value,
      this.loginForm.get('password')?.value,
      this.loginForm.get('newpassword')?.value,
      this.loginForm.get('confirmpassword')?.value,
      this.storageService.GetWorkflowUser().PASSWORDPOLICY.PASSWORDHISTORYLMT,
    ).pipe(takeUntil(this.subscription$))
    .subscribe((response:any) => {
      if(response){
        usersession.User=this.storageService.GetUserInfo();
        usersession.WorkflowUser=this.storageService.GetWorkflowUser();
        usersession.User.LoginPassword=this.loginForm.get('newpassword')?.value;
        //reset call
      
        this._auth.ResetPassword(
          usersession
        ).pipe(takeUntil(this.subscription$))
        .subscribe((response:any) => {
          if(response.CODE==1){
            this.msgService.showCustomMesssage("Password has been changed");
            this.resetPassword=false;
            this.loginForm.get('password')?.setValue(this.loginForm.get('newpassword')?.value);
            this.loginForm.get('newpassword')?.setValue('');
            this.loginForm.get('confirmpassword')?.setValue('');
            this.authenticateUser();
          }})

      }
    })
  }

  Validate():boolean{
    return true;
  }
  authenticateUser() {
    // if (this.appConfig.EnableTwoFactorAuth && !this._auth.captchaVerified) {
    //   this.toastr.error("Recaptcha not verified yet", "Error!");
    //   return;
    // }
    if(this.resetPassword){
      this.ChangeNewPassword();
      return;
      }

    this._auth
      .TryLogin(
        this.loginForm.get('username')?.value,
        this.loginForm.get('password')?.value,
        this.appConfig.EnableTwoFactorAuth,
        this.ipAddress
      )
      .pipe(takeUntil(this.subscription$))
      .subscribe((response) => {
        if (response === false) {
          //TODO: any special handling in case of some exception occured in TryLogin
          console.log('Some Error Occured at while processing Login requet');
        } else if (
          response.CODE.toString() ===
          AuthenticationCode.SuccessfullyLogin.Code &&
          !this.appConfig.EnableTwoFactorAuth
        ) {
          //TODO: any special handling in case of successfull login
          this.storageService.SetLoggedInFlag('AuthenticationService');
          this.tokenService.saveToken(
            response.ResultSet.AuthenticationResults.Token,
            response.ResultSet.AuthenticationResults.RefreshToken
          );
          this.tokenService.saveToken(response.ResultSet.AuthenticationResults.Token, response.ResultSet.AuthenticationResults.RefreshToken);
          this.router.navigate(['/welcome']);
          // this.appConfig.loadLocalData().subscribe(data => {
          //   this.storageService.SetLocalData(data);
          //   // this.appConfig.LocalData = data;
          // });

          //this.appConfig.loadData().subscribe(data => {
          this.appConfig.LocalData = JSON.parse(
            response.ResultSet.ControlSecurity
          );
          this.appConfig
            .loadValidationsData()
            .subscribe((data) => {
              this.appConfig.ValidationsData = data;
            });

          this.storageService.SetUserClaims(response.ResultSet.Claims);

          this.appConfig
            .loadMessages(this.storageService.GetUserInfo().LanguageInfo?.LANGUAGECDE)
            .subscribe((data) => {
              this.appConfig.Messages = data;
            });
        } 
        else if (response.CODE.toString() === AuthenticationCode.FirstTimeLogin.Code && !this.appConfig.EnableTwoFactorAuth) {
          let forceChangeMsg='You must change your password now to login.';
          this.ResetUserPassword(forceChangeMsg,this.storageService.GetWorkflowUser().PASSWORDPOLICY.PASSWORDHISTORYLMT);
        } 
        else if (response.CODE.toString() === AuthenticationCode.PasswordExpired.Code && !this.appConfig.EnableTwoFactorAuth) {
          this.ResetUserPassword(response.MESSAGE,this.storageService.GetWorkflowUser().PASSWORDPOLICY.PASSWORDHISTORYLMT);
        }
        else if(response.CODE.toString()=== AuthenticationCode.PasswordExpiredAfterDays.Code && !this.appConfig.EnableTwoFactorAuth){
          // this.storageService.SetLoggedInFlag('AuthenticationService');
          this.tokenService.saveToken(
            response.ResultSet.AuthenticationResults.Token,
            response.ResultSet.AuthenticationResults.RefreshToken
          );
          // this.router.navigate(['/welcome']);
          this.appConfig.LocalData = JSON.parse(
            response.ResultSet.ControlSecurity
          );
          this.appConfig
            .loadValidationsData()
            .subscribe((data) => {
              this.appConfig.ValidationsData = data;
            });

          this.storageService.SetUserClaims(response.ResultSet.Claims);

          this.appConfig
            .loadMessages(this.storageService.GetUserInfo().LanguageInfo?.LANGUAGECDE)
            .subscribe((data) => {
              this.appConfig.Messages = data;
            });
          
            var dialog = this._dialog.openDialog(
              'Confirmation',
              response.MESSAGE+" Do you want to change the password?",
              false,
              'Yes',
              'No'
            );
        
            dialog.afterClosed().subscribe((result) => {
              if (result === 'ok') {
                this.tokenService.saveToken('','');
                this.appConfig.LocalData=null;
                this.storageService.SetUserClaims(null);
                this.resetPassword = true;
        
              }else{
                this.storageService.SetLoggedInFlag('AuthenticationService');
                this.router.navigate(['/welcome']);
              }
            });
          
        }
        else if (
          response.CODE.toString() ===
          AuthenticationCode.SuccessfullyLogin.Code &&
          this.appConfig.EnableTwoFactorAuth
        ) {
          this.enableTwoFactorcontrols = true;
        } else if (response.CODE.toString() === AuthenticationCode.UserAlreadyConnected.Code ||
          response.CODE.toString() === AuthenticationCode.ForcefullyEndSession.Code
        ) {
          this.forcefullyLogout(response);
        } else if (
          response.CODE.toString() === AuthenticationCode.PasswordNotVerified.Code ||
          response.CODE.toString() === AuthenticationCode.UserDoesNotExist.Code
        ) {
          this.toastr.error('Invalid User Name or Password');
        } else {
          this.toastr.error(response.MESSAGE);
        }

        // Reset captcha on login response
        this._auth.captchaToken = '';
        this.captchaElem?.reset();
      });
  }

  forcefullyLogout(response: any) {
    var dialog = this._dialog.openDialog(
      'Confirmation',
      response.MESSAGE,
      false,
      'Yes',
      'No'
    );
    dialog.afterClosed().subscribe((result) => {
      if (result === 'ok') {
        this._auth
          .forcefullyLogout(
            this.loginForm.get('username')?.value,
            this.loginForm.get('password')?.value,
            this.appConfig.EnableTwoFactorAuth,
            this.ipAddress
          )
          .pipe(takeUntil(this.subscription$))
          .subscribe((response) => {
            if (response === false) {
              //TODO: any special handling in case of some exception occured in TryLogin
              console.log(
                'Some Error Occured at while processing Login requet'
              );
            } else if (
              response.CODE.toString() ===
              AuthenticationCode.SuccessfullyLogin.Code &&
              !this.appConfig.EnableTwoFactorAuth
            ) {
              //TODO: any special handling in case of successfull login
              this.storageService.SetLoggedInFlag('AuthenticationService');
              this.tokenService.saveToken(
                response.ResultSet.AuthenticationResults.Token,
                response.ResultSet.AuthenticationResults.RefreshToken
              );
              // this.tokenService.saveToken(response.ResultSet.AuthenticationResults.Token, response.ResultSet.AuthenticationResults.RefreshToken);
              this.router.navigate(['/welcome']);
              // this.appConfig.loadLocalData().subscribe(data => {
              //   this.storageService.SetLocalData(data);
              // });
              this.appConfig.LocalData = JSON.parse(
                response.ResultSet.ControlSecurity
              );
              this.appConfig
                .loadValidationsData()
                .subscribe((data) => {
                  this.appConfig.ValidationsData = data;
                });

              this.storageService.SetUserClaims(response.ResultSet.Claims);
              this.appConfig
                .loadMessages(this.storageService.GetUserInfo().LanguageInfo?.LANGUAGECDE)
                .subscribe((data) => {
                  this.appConfig.Messages = data;
                });
            } else if (
              response.CODE.toString() ===
              AuthenticationCode.SuccessfullyLogin.Code &&
              this.appConfig.EnableTwoFactorAuth
            ) {
              this.enableTwoFactorcontrols = true;
            } else if (response.CODE.toString() === AuthenticationCode.FirstTimeLogin.Code && !this.appConfig.EnableTwoFactorAuth) {
              let forceChangeMsg='You must change your password now to login.';
              this.ResetUserPassword(forceChangeMsg,this.storageService.GetWorkflowUser().PASSWORDPOLICY.PASSWORDHISTORYLMT);
            } else if (response.CODE.toString() === AuthenticationCode.PasswordExpired.Code && !this.appConfig.EnableTwoFactorAuth) {
              this.ResetUserPassword(response.MESSAGE,this.storageService.GetWorkflowUser().PASSWORDPOLICY.PASSWORDHISTORYLMT);
            } else if(response.CODE.toString()=== AuthenticationCode.PasswordExpiredAfterDays.Code && !this.appConfig.EnableTwoFactorAuth){
              // this.storageService.SetLoggedInFlag('AuthenticationService');
              this.tokenService.saveToken(
                response.ResultSet.AuthenticationResults.Token,
                response.ResultSet.AuthenticationResults.RefreshToken
              );
              // this.router.navigate(['/welcome']);
              this.appConfig.LocalData = JSON.parse(
                response.ResultSet.ControlSecurity
              );
              this.appConfig
                .loadValidationsData()
                .subscribe((data) => {
                  this.appConfig.ValidationsData = data;
                });
    
              this.storageService.SetUserClaims(response.ResultSet.Claims);
    
              this.appConfig
                .loadMessages(this.storageService.GetUserInfo().LanguageInfo?.LANGUAGECDE)
                .subscribe((data) => {
                  this.appConfig.Messages = data;
                });
              
                var dialog = this._dialog.openDialog(
                  'Confirmation',
                  response.MESSAGE+" Do you want to change the password?",
                  false,
                  'Yes',
                  'No'
                );
            
                dialog.afterClosed().subscribe((result) => {
                  if (result === 'ok') {
                    this.tokenService.saveToken('','');
                    this.appConfig.LocalData=null;
                    this.storageService.SetUserClaims(null);
                    this.resetPassword = true;
            
                  }else{
                    this.storageService.SetLoggedInFlag('AuthenticationService');
                    this.router.navigate(['/welcome']);
                  }
                });
              
            }
            else if (
              response.CODE.toString() === AuthenticationCode.NotAuthorizedToLogin.Code
            ) {
              this.toastr.error(response.MESSAGE);
            } else {
              //TODO: any special handling in case of unsuccessfull login
              this.toastr.error(response.MESSAGE);
            }
          });
      }
    });
  }

  ResetUserPassword(message: string,passwordhistorylimit:number) {
    
    var dialog = this._dialog.openDialog(
      'Confirmation',
      message,
      false,
      'Yes',
      'No'
    );

    dialog.afterClosed().subscribe((result) => {
      if (result === 'ok') {
        this.resetPassword = true;

      }
    });
  }

  resolved(captchaResponse: string|null) {
    // if (captchaResponse) {
    //   this.reCaptchaService.validateToken(captchaResponse);
    // }
    // else {
    //   this._auth.captchaVerified = false;
    // }
    this._auth.captchaToken = captchaResponse;
  }

  ResendOTPToken() {
    this._auth
      .ResendOTPToken()
      .pipe(takeUntil(this.subscription$))
      .subscribe((response) => {
        if (response?.status == 500) {
          //TODO: any special handling in case of some exception occured in TryLogin
          this.enableTwoFactorcontrols = false;
          this.loginForm.controls.OTP.setValue('');
          console.log('Some Error Occured at while processing requet');
        }
      });
  }

  verifyOTP() {
    this._auth
      .VerifyOTPToken(this.loginForm.get('OTP')?.value)
      .pipe(takeUntil(this.subscription$))
      .subscribe((response) => {
        if (!response || response?.status == 500) {
          //TODO: any special handling in case of some exception occured in TryLogin
          this.enableTwoFactorcontrols = false;
          this.loginForm.controls.OTP.setValue('');
          console.log('Some Error Occured at while processing requet');
        } else if (response.CODE.toString() === ReturnCode.Success.Code) {
          //TODO: any special handling in case of successfull login

          this.storageService.SetLoggedInFlag('AuthenticationService');
          this.router.navigate(['/welcome']);
          this.appConfig
            .loadLocalData()
            .pipe(takeUntil(this.subscription$))
            .subscribe((data) => {
              this.storageService.SetLocalData(data);
            });
        } else if (
          response.CODE.toString() === ReturnCode.OTPAttemptsFailed.Code
        ) {
          this._auth
            .Logout()
            .pipe(takeUntil(this.subscription$))
            .subscribe((response) => {
              this.enableTwoFactorcontrols = false;
              this.loginForm.controls.OTP.setValue('');
            });
          this.toastr.error(response.MESSAGE, 'Error!');
        } else {
          //TODO: any special handling in case of unsuccessfull login
          this.toastr.error(response.MESSAGE, 'Error!');
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }
}
