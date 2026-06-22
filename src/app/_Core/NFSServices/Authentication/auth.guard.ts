import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { ClientStoreService } from '../ClientCache/client-store.service';
import { FormModeService } from '../FormMode/form-mode.service';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthGuard  {

  constructor(private storageService: ClientStoreService,
    private router: Router,
    private _auth: AuthenticationService,
    private _formMode: FormModeService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    let claimType: string = route.data["claimType"];

    let isAuth = this.storageService.IsAppLoggedIn
      && (this._auth.hasClaim(claimType) ||
        this._formMode.FormMode === FormMode.VIEW ||
        this._formMode.FormMode === FormMode.EDIT ||
        this._formMode.FormMode === FormMode.SUBMIT ||
        this._formMode.FormMode === FormMode.RESUBMIT);

    if (isAuth) {
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
