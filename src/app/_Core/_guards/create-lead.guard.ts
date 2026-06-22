import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthenticationService } from '@NFS_Core/NFSServices/Authentication/authentication.service';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateLeadGuard  {

  constructor(private storageService: ClientStoreService, private router: Router,
    private _auth: AuthenticationService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // this.storageService.GetUserGroupCode() == '00105' 
    if (this._auth.hasClaim('CanCreateLead') ||
      (this.router?.getCurrentNavigation()?.extras?.state?.QueueOperation === "View")) {
      // logged in so return true
      return true;
    }

    // logged in so redirect to welcome page with the return url
    this.router.navigate(['/welcome']);
    return false;
  }

}
