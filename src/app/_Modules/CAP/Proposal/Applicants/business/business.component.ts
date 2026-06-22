import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { AddressMasterDataService } from '@NFS_Core/NFSServices/MasterData/Address-master-data.service';
import { EmploymentMasterDataService } from '@NFS_Core/NFSServices/MasterData/employment-master-data.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { StateManagment } from '@NFS_Core/RowStateManagement/FormStateManagement';
import { IProposalApplicantBusinessEntity } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IProposalApplicantBusinessEntity.model';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { FormArray, FormGroup } from 'src/Library';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
@Component({
    selector: 'app-business',
    templateUrl: './business.component.html',
    styleUrls: ['./business.component.css'],
    standalone: false
})
export class BusinessComponent implements OnInit, OnDestroy {
  @Input() Businesses !: FormArray<IProposalApplicantBusinessEntity>;
  @Input() ComponentName!: string;
  @ViewChild("tabRef", { static: false }) tabGroup!: MatTabGroup;
  dataRowState = DataRowState;
  selectedInd!: number;
  private subscription$ = new Subject();

  constructor(private _formModeService: FormModeService, public _masterDataService: MasterDataService, public _AddressMasterDataService: AddressMasterDataService,
    public _employmentMasterDataService: EmploymentMasterDataService, private _messageService: MessageService, private _proposaldataService: ProposalDataService, private _proposalForm: ProposalEntityFormService,
    private _FormState: StateManagment) { }

  getComponentName() {
    return this.ComponentName + "-Business"
  }

  get isViewMode() {
    return this._formModeService.FormMode === FormMode.VIEW;
  }

  ngOnInit(): void {
    this.selectedInd = 0;
    this._AddressMasterDataService.getmasterDataForAddress().pipe(takeUntil(this.subscription$)).subscribe(a => {
      this._AddressMasterDataService.InitializeAddressMasterData(a);
    });
    this._employmentMasterDataService.getmasterDataForEmployment().pipe(takeUntil(this.subscription$)).subscribe(data => {
      this._employmentMasterDataService.BusinessLine = data?.BusinessLine?.ResultSet?.DataCollection;
      this._employmentMasterDataService.BusinessType = data?.BusinessType?.ResultSet?.DataCollection;
      // this._employmentMasterDataService.Relationships = data?.Relationships?.ResultSet.DataCollection;
    });
  }
  tabSelectionChange(index: any) {
    if (index != undefined) {
      if (this.selectedInd < 0) {
        this.selectedInd = 0;
      }
      if (index === this.Businesses.value.filter(p => p.RowState != DataRowState.Removed).length && index > 0) {
        this.selectedInd = this.Businesses.value.filter(p => p.RowState != DataRowState.Removed).length - 1;
      }
      else {
        this.selectedInd = index;
      }
    }
  }
  addBusiness() {
    let Business: FormGroup<IProposalApplicantBusinessEntity> = this._proposalForm.ProposalApplicantBusinessForm();
    if (this.Businesses.controls.length == 0) {
      Business.controls.PRPLAPLTBUS.controls.BUSINESSID.setValue(1);
    }
    else {
      Business.controls.PRPLAPLTBUS.controls.BUSINESSID.setValue(this.Businesses.controls[this.Businesses.controls.length - 1].controls.PRPLAPLTBUS.controls.BUSINESSID.value + 1);
    }

    this.Businesses.push(Business);

    window.setTimeout(() => {
      this.selectedInd = this.Businesses.value.filter(obj => obj.RowState !== DataRowState.Removed).length - 1;
      this.tabGroup.selectedIndex = this.selectedInd;
    });
  }

  removeBusiness(object: any, BusinessIndex : number) {
    const index: number = this.Businesses.value.indexOf(object.value);
    var i: number = this.Businesses.value.filter(p => p.RowState != DataRowState.Removed).indexOf(object.value);
    if (this.Businesses.controls[index].controls.RowState.value == DataRowState.Added) {
      this.Businesses.removeAt(index);
      this._messageService.ClearValidatorMessages('-Business-' + (BusinessIndex + 1));
    }
    else {
      this._FormState.ResetFormState(this.Businesses.controls[index], DataRowState.Removed);
      this._messageService.ClearValidatorMessages('-Business-' + (BusinessIndex + 1));
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
