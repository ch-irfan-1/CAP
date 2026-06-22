import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NfsDialogComponent } from '@NFS_Core/NFSControls/nfs-dialog/nfs-dialog.component';
import { IWorkQueueResult } from '@NFS_Interfaces/OtherInterfaces/IWorkQueueResult';
import { LoadExistingBPResultSet } from '@NFS_Interfaces/ResponseInterfaces/iload-bp';
import { ExistingBpSearchComponent } from '@NFS_Modules/IOPS/Components/existing-bp-search/existing-bp-search.component';
import { CancelleadComponent } from '@NFS_Modules/work-queue/CancelLead/cancellead/cancellead.component';
import { AssignToVOComponent } from '@NFS_Modules/work-queue/Components/assign-to-vo/assign-to-vo.component';
@Injectable({
  providedIn: 'root'
})
export class DialogBoxService {

  constructor(public dialog: MatDialog) { }

  openDialog(titleText: string = "Confirmation", descriptionText: string = "Do you want to delete this item?",
    isSingleButton: boolean = false, okButtonText: string = "Ok", cancelButtonText: string = "Cancel") {

    const dialogRef = this.dialog.open(NfsDialogComponent, {
      data: {
        leftBtnTxt: okButtonText,
        rightBtnTxt: cancelButtonText,
        title: titleText,
        Description: descriptionText,
        showSingleButton: isSingleButton
      },
      disableClose: true,
      closeOnNavigation: true
    });

    return dialogRef;
  }

  openCancellationDialog() {

    const dialogRef = this.dialog.open(CancelleadComponent, {
      width: '600px',
      disableClose: true,
      closeOnNavigation: true
    });


    return dialogRef;
  }

  openAssignToVOComponent(quotInfo: IWorkQueueResult, isAssigned: boolean) {
    const dialogRef = this.dialog.open(AssignToVOComponent, {
      width: '600px',
      disableClose: true,
      data: {
        quotInfo: quotInfo,
        ReAssignInd: isAssigned
      },
      closeOnNavigation: true
    });

    return dialogRef;
  }

  openExistingBPSearchComponent(existingBPResultSet: LoadExistingBPResultSet[]) {
    const dialogRef = this.dialog.open(ExistingBpSearchComponent, {
      width: '900px',
      data: {
        existingBPData: existingBPResultSet
      },
      disableClose: true,
      closeOnNavigation: true
    });

    return dialogRef;
  }
}

