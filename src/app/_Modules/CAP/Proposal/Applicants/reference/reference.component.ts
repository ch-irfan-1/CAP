import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { AddressMasterDataService } from '@NFS_Core/NFSServices/MasterData/Address-master-data.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { mPOSMasterDataRequest } from '@NFS_Core/NFSServices/MasterData/MasterdataHelper/mPOSMasterDataRequest';
import { StateManagment } from '@NFS_Core/RowStateManagement/FormStateManagement';
import { IPRPL_APLT_PRNL_RFRNInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IPRPL_APLT_PRNL_RFRNInfo.model';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { FormArray, FormGroup } from 'src/Library';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';


@Component({
    selector: 'app-reference',
    templateUrl: './reference.component.html',
    styleUrls: ['./reference.component.css'],
    standalone: false
})
export class ReferenceComponent implements OnInit, OnDestroy {
  @Input() ApplicantReference !: FormArray<IPRPL_APLT_PRNL_RFRNInfo>;
  @Input() ComponentName!: string;
  request = new mPOSMasterDataRequest();
  NullVal: number | string = '';
  dataRowState = DataRowState;
  selectedInd!: number;
  private subscription$ = new Subject();
  @ViewChild("tabRef", { static: false }) tabGroup!: MatTabGroup;

  constructor(public _AddressMasterDataService: AddressMasterDataService, private _messageService: MessageService, private dialog: MatDialog,
    private _formModeService: FormModeService, private _proposalForm: ProposalEntityFormService,
    public _masterDataService: MasterDataService,
    private _FormState: StateManagment) { }

  getComponentName() {
    return this.ComponentName + "-Reference"
  }

  get isViewMode() {
    return this._formModeService.FormMode === FormMode.VIEW;
  }

  ngOnInit(): void {
    this.selectedInd = 0;
    this._AddressMasterDataService.getmasterDataForAddress().pipe(takeUntil(this.subscription$)).subscribe(a => {
      this._AddressMasterDataService.InitializeAddressMasterData(a);
    });
  }

  tabSelectionChange(index: any) {
    if (index != undefined) {
      if (this.selectedInd < 0) {
        this.selectedInd = 0;
      }
      if (index === this.ApplicantReference.value.filter(p => p.RowState != DataRowState.Removed).length && index > 0) {
        this.selectedInd = this.ApplicantReference.value.filter(p => p.RowState != DataRowState.Removed).length - 1;
      }
      else {
        this.selectedInd = index;
      }
    }
  }

  AddReference() {
    let reference: FormGroup<IPRPL_APLT_PRNL_RFRNInfo> = this._proposalForm.proposalPersonalReferenceForm();
    if (this.ApplicantReference.value.length == 0) {
      this.ApplicantReference.push(reference);
      reference.controls.REFERENCEID.setValue(0);
    }
    else {
      reference.controls.REFERENCEID.setValue(this.ApplicantReference.controls[this.ApplicantReference.controls.length - 1].controls.REFERENCEID.value + 1);
      this.ApplicantReference.push(reference);
    }

    window.setTimeout(() => {
      this.selectedInd = this.ApplicantReference.value.filter(obj => obj.RowState !== DataRowState.Removed).length - 1;
      this.tabGroup.selectedIndex = this.selectedInd;
    });
  }

  removeReference(object: any, referenceIndex : number) {
    const index: number = this.ApplicantReference.value.indexOf(object.value);
    var i: number = this.ApplicantReference.value.filter(p => p.RowState != DataRowState.Removed).indexOf(object.value);

    if (this.ApplicantReference.controls[index].controls.RowState.value == DataRowState.Added) {
      this.ApplicantReference.removeAt(index);
      this._messageService.ClearValidatorMessages('-Reference-' + (referenceIndex + 1));
    }
    else {
      this._FormState.ResetFormState(this.ApplicantReference.controls[index], DataRowState.Removed);
      this._messageService.ClearValidatorMessages('-Reference-' + (referenceIndex + 1));
    }

    if (this.selectedInd > 0 && (this.selectedInd == i || this.selectedInd > i)) {
      window.setTimeout(() => {
        this.selectedInd = this.selectedInd - 1;
        this.tabGroup.selectedIndex = this.selectedInd;
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }
}
