import { Injectable } from '@angular/core';

import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { DialogBoxService } from '@NFS_Core/NFSServices/DialogBox/dialog-box.service';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { GeneralService } from '@NFS_Core/NFSServices/_helper/general.service';
import { HeaderTitleService } from '@NFS_Core/NFSServices/_helper/header-title-service.service';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { ProposalMainComponent } from '@NFS_Modules/CAP/Proposal/proposal-main.component';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProposalUnsavedChangesGuard  {

  constructor(private _formModeService: FormModeService,
    private storageService: ClientStoreService, private _generalService : GeneralService,
    private _dialog: DialogBoxService,
    private headerTitleService: HeaderTitleService) {

  }

  canDeactivate(): Observable<boolean> {
    if ((this._formModeService.FormMode !== FormMode.VIEW) && this.storageService.IsAppLoggedIn) {

      var dialog = this._dialog.openDialog("Confirmation", "Are you sure you want to leave?", false, "Yes", "No");

      return dialog.afterClosed().pipe(
        map(result => {
          if (result === "ok") {
            this._generalService.FormMode = FormMode.NEW;
            return true
          }
          else {
            this.headerTitleService.setTitle("Proposal");
            return false;
          }
        })
      );
    }
    else {
      return of(true);
    }
  }
}
