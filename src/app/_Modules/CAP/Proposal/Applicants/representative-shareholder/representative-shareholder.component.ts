import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddressMasterDataService } from '@NFS_Core/NFSServices/MasterData/Address-master-data.service';
import { EmploymentMasterDataService } from '@NFS_Core/NFSServices/MasterData/employment-master-data.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { StateManagment } from '@NFS_Core/RowStateManagement/FormStateManagement';
import { IPRPL_APLT_RPRSInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IPRPL_APLT_RPRSInfo.model';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { FormArray, FormGroup } from 'src/Library';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { MatTabGroup } from '@angular/material/tabs';


@Component({
    selector: 'app-representative-shareholder',
    templateUrl: './representative-shareholder.component.html',
    styleUrls: ['./representative-shareholder.component.css'],
    standalone: false
})
export class RepresentativeShareholderComponent implements OnInit, OnDestroy {
  @Input() RepresentativeShareholder!: FormArray<IPRPL_APLT_RPRSInfo>;
  @Input() ComponentName!: string;
  @ViewChild("tabRef", { static: false }) tabGroup!: MatTabGroup;
  selectedInd!:number;

  panelOpenState = false;
  isIndividual: boolean = true;
  isCompany: boolean = true;
  isSignatorySelected: boolean = false;
  isSignatoryAlreadySelected: boolean = false;
  isSecondNotSelected: boolean = false;
  isFirstNotSelected: boolean = false;
  signatoryList: string[] = [];
  dataRowState = DataRowState;
  private subscription$ = new Subject();

  constructor(private _formModeService: FormModeService,public _AddressMasterDataService: AddressMasterDataService, private dialog: MatDialog, private _proposaldataService: ProposalDataService, private _proposalForm: ProposalEntityFormService, public _masterDataService: MasterDataService, public _employmentMasterDataService: EmploymentMasterDataService,
    private toaster: ToastrService, private _messageService: MessageService, private _FormState: StateManagment) { }

  get isViewMode() {
    return this._formModeService.FormMode === FormMode.VIEW;
  }
  
  getComponentName() {
    return this.ComponentName + "-Representative"
  }
  ngOnInit(): void {
    this._AddressMasterDataService.getmasterDataForAddress().pipe(takeUntil(this.subscription$)).subscribe(a => {
      this._AddressMasterDataService.InitializeAddressMasterData(a);
    });
    this._employmentMasterDataService.getmasterDataForEmployment().pipe(takeUntil(this.subscription$)).subscribe(data => {
      this._employmentMasterDataService.Designation = data?.Designation?.ResultSet?.DataCollection;
    });
  }

  AddRepresentative() {
    let Representative: FormGroup<IPRPL_APLT_RPRSInfo> = this._proposalForm.ProposalApplicantRepresentativeForm();
    const max = this.RepresentativeShareholder.value.reduce((op, item) => op = op > item.REPRESENTATIVEID ? op : item.REPRESENTATIVEID, 0);
    Representative.controls.REPRESENTATIVEID.setValue(this.RepresentativeShareholder.controls.length ==0 ? max : (max + 1));
    this.RepresentativeShareholder.push(Representative);
    window.setTimeout(() => {
      this.selectedInd = this.RepresentativeShareholder.value.filter(obj => obj.RowState !== DataRowState.Removed).length - 1;
      this.tabGroup.selectedIndex = this.selectedInd;
    });
  }

  tabSelectionChange(index:any)
  {
    if(index!=undefined){
      if(this.selectedInd<0){
        this.selectedInd=0;
      }
      if(index===this.RepresentativeShareholder.value.filter(p=>p.RowState!=DataRowState.Removed).length && index>0){
        this.selectedInd=this.RepresentativeShareholder.value.filter(p=>p.RowState!=DataRowState.Removed).length-1;
      }
      else{
        this.selectedInd=index;
      }
    }
  } 

  signatoryTypeValueChange(object: any) {
    if (object.controls.SIGNATORYCDE.value == '00001') {
      if (this.RepresentativeShareholder.controls.filter(x => x.controls.SIGNATORYCDE.value == '00001' && x.controls.REPRESENTATIVEID.value != object.controls.REPRESENTATIVEID.value && x.controls.RowState.value!=DataRowState.Removed).length > 0) {
        this.isSignatoryAlreadySelected = true;
      }
    }
    if (object.controls.SIGNATORYCDE.value == '00002') {
      if (this.RepresentativeShareholder.controls.filter(x => x.controls.SIGNATORYCDE.value == '00002' && x.controls.REPRESENTATIVEID.value != object.controls.REPRESENTATIVEID.value && x.controls.RowState.value!=DataRowState.Removed).length > 0) {
        this.isSignatoryAlreadySelected = true;
      }
      else if (this.RepresentativeShareholder.controls.filter(x => x.controls.SIGNATORYCDE.value == '00001' && x.controls.RowState.value!=DataRowState.Removed).length == 0) {
        this.isFirstNotSelected = true;
      }

    }
    else if (object.controls.SIGNATORYCDE.value == '00003') {
      if (this.RepresentativeShareholder.controls.filter(x => x.controls.SIGNATORYCDE.value == '00003' && x.controls.REPRESENTATIVEID.value != object.controls.REPRESENTATIVEID.value && x.controls.RowState.value!=DataRowState.Removed).length > 0) {
        this.isSignatoryAlreadySelected = true;
      }
      else if (this.RepresentativeShareholder.controls.filter(x => x.controls.SIGNATORYCDE.value == '00001' && x.controls.RowState.value!=DataRowState.Removed).length == 0) {
        this.isFirstNotSelected = true;
      }
      else if (this.RepresentativeShareholder.controls.filter(x => x.controls.SIGNATORYCDE.value == '00001' && x.controls.RowState.value!=DataRowState.Removed).length == 1 && this.RepresentativeShareholder.controls.filter(x => x.controls.SIGNATORYCDE.value == '00002' && x.controls.RowState.value!=DataRowState.Removed).length == 0) {
        this.isSecondNotSelected = true;
      }

    }
    if (this.isSignatoryAlreadySelected) {
      this.isSignatoryAlreadySelected = false;
      object.controls.SIGNATORYCDE.setValue('');
      this._messageService.showMesssage('msgSignatorySelectAgain', MessageType.Info);
    }
    else if (this.isFirstNotSelected) {
      this.isFirstNotSelected = false;
      object.controls.SIGNATORYCDE.setValue('');
      this._messageService.showMesssage('msgSignatoryFirstNotSelect', MessageType.Info);
    }
    else if (this.isSecondNotSelected) {
      this.isSecondNotSelected = false;
      object.controls.SIGNATORYCDE.setValue('');
      this._messageService.showMesssage('msgSignatorySecondNotSelected', MessageType.Info);
    }
  }

  removeRepresentative(object: any, Representativeindex : number) {
    const index: number = this.RepresentativeShareholder.value.indexOf(object.value);
    var i:number=this.RepresentativeShareholder.value.filter(p=>p.RowState!=DataRowState.Removed).indexOf(object.value);
    if (this.RepresentativeShareholder.controls[index].controls.RowState.value == DataRowState.Added) {
      this.RepresentativeShareholder.removeAt(index);
      this._messageService.ClearValidatorMessages('-Representative-' + (Representativeindex + 1));
    }
    else {
      this._FormState.ResetFormState(this.RepresentativeShareholder.controls[index], DataRowState.Removed);
      this._messageService.ClearValidatorMessages('-Representative-' + (Representativeindex + 1));
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
