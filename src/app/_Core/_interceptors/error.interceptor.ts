import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { AuthenticationService } from '@NFS_Core/NFSServices/Authentication/authentication.service';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { TokenStorageService } from '@NFS_Core/NFSServices/ClientCache/token-storage.service';
import { DialogBoxService } from '@NFS_Core/NFSServices/DialogBox/dialog-box.service';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, filter, finalize, switchMap, take, takeUntil } from 'rxjs/operators';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  navigationExtras: NavigationExtras = {};
  requestData: any;
  isRefreshingToken: boolean = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private router: Router,
    private token: TokenStorageService,
    private toastr: ToastrService,
    private _dialog: DialogBoxService,
    private storageService: ClientStoreService,
    private _authService: AuthenticationService,
    private dialogRef: MatDialog) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(
      (catchError(error => this.errorHandler(error, request, next)))
      );
    
  }

  private errorHandler(error: HttpErrorResponse, request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {

    var data = this.getRequestData(request);
    let rData  = request.url.includes('/Login')? true:false;
    if (rData)
     data='';
    this.navigationExtras = { state: { error: error.message, StatusCode: error.status, StatusText: error.statusText, requestData: data } }
    switch (error.status) {
      case 400:
        if (error.error.errors) {
          const modalStateErrors = [];
          for (const key in error.error.errors) {
            if (error.error.errors[key]) {
              modalStateErrors.push(error.error.errors[key]);
            }
          }
          throw modalStateErrors;
        }
        else if (typeof (error.error) === 'object') {
          this.toastr.error(error.statusText, error.status.toString());
        }
        else {
          this.toastr.error(error.statusText, error.status.toString());
        }
        this.openDialog();
        break;
      case 401:
        return this.refreshToken(request, next);
        break;
      case 404:
        this.toastr.error(error.statusText, error.status.toString());
        this.openDialog();
        break;
      case 500:
        //this.toastr.error(error?.error?.message, error.status);
        if (error?.error?.message.includes("User session ended on server")) {
          this.toastr.error('User session ended on server');
          this.LogoutOnError();
        }
        // else{
        // this.openDialog();
        // }
        break;
      default:
        this.toastr.error('Something went wrong!');
        this.openDialog();
        break;
    }
    
    return of(error as any);
  }

  LogoutOnError() {
    this.storageService.ResetLocalStore();
    this._authService.captchaToken = "";
    this.router.navigate(['/login']);
    this.dialogRef.closeAll();
  }

  openDialog() {
    var dialog = this._dialog.openDialog("Error Occurred", "Are you sure you want to go to error page for further details?", false, "Yes", "No");
    dialog.afterClosed().subscribe((result: any) => {
      if (result === "ok") {
        this.router.navigateByUrl('/errors', this.navigationExtras);
      }
    });
  }

  getRequestData(req: HttpRequest<any>): string {
    req = req.clone({
      params: req.params
    });
    return JSON.stringify(req.body)
  }

  refreshToken(request: HttpRequest<unknown>, next: HttpHandler): Observable<any> {

    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;
      this.refreshTokenSubject.next(null);

      return this._authService.RefreshToken().pipe(
        switchMap(() => {
          this.isRefreshingToken = false;
          this.refreshTokenSubject.next(this.token.getToken());
          return next.handle(request);
        }),
      );

    } else {
      return this.refreshTokenSubject.pipe(
        filter((token: any) => token != null),
        take(1),
        switchMap(() => {
          return next.handle(request);
        }));

    }
  }
}
