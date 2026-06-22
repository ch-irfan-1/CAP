import { Injectable } from '@angular/core';

import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { DialogBoxService } from '@NFS_Core/NFSServices/DialogBox/dialog-box.service';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { IOPSMainComponent } from '@NFS_Modules/IOPS/Components/iopsmain/iopsmain.component';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChangesGuard  {

  constructor(private storageService: ClientStoreService, private _dialog: DialogBoxService,) {

  }

  canDeactivate(component: IOPSMainComponent): Observable<boolean> {
    if ((component.Mode == FormMode.NEW || component.Mode == FormMode.EDIT) && component.QUOT.dirty && this.storageService.IsAppLoggedIn) {

      //return confirm('Are you sure you want to continue? Any unsaved changes will be lost');
      var dialog = this._dialog.openDialog("Confirmation", "Are you sure you want to leave?", false, "Yes", "No");

      return dialog.afterClosed().pipe(
        map(result => {
          if (result === "ok") {
            return true
          }
          else
            return false;
        })
      );
    }
    else {
      return of(true);
    }
  }
}
