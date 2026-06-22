import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard  {

  constructor(private storageService: ClientStoreService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!this.storageService.IsAppLoggedIn) {
      // logged in so return true
      return true;
    }

    // logged in so redirect to welcome page with the return url
    this.router.navigate(['/welcome']);
    return false;

  }

}
