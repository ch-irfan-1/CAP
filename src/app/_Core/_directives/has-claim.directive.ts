import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthenticationService } from '@NFS_Core/NFSServices/Authentication/authentication.service';

@Directive({
    selector: '[hasClaim]',
    standalone: false
})
export class HasClaimDirective {
  constructor(private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private _auth: AuthenticationService) { }

    @Input() set hasClaim(claimType: any) {
      if (this._auth.hasClaim(claimType)) {
        // Add template to DOM
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        // Remove template from DOM
        this.viewContainer.clear();
      }
    }  
}
