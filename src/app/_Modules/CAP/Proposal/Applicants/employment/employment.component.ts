import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { AddressMasterDataService } from '@NFS_Core/NFSServices/MasterData/Address-master-data.service';
import { EmploymentMasterDataService } from '@NFS_Core/NFSServices/MasterData/employment-master-data.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { mPOSMasterDataRequest } from '@NFS_Core/NFSServices/MasterData/MasterdataHelper/mPOSMasterDataRequest';
import { StateManagment } from '@NFS_Core/RowStateManagement/FormStateManagement';
import { IPRPL_APLT_EMPTInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IPRPL_APLT_EMPTInfo.model';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { FormArray, FormGroup } from 'src/Library';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProposalDataService } from "@NFS_Modules/CAP/CAPServices/proposal-data.service";
import { ApplicantType } from '@NFS_Enums/ApplicantType.enum';
import { IDTypeCode } from '@NFS_Enums/IDTypeCode';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { IExistingBPInfoParm } from '@NFS_Interfaces/RequestInterfaces/iexisting-bpinfo-parm';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { RoleCode } from '@NFS_Enums/RoleCode';
import { MatTabGroup } from '@angular/material/tabs';


@Component({
    selector: 'app-employment',
    templateUrl: './employment.component.html',
    styleUrls: ['./employment.component.css'],
    standalone: false
})
export class EmploymentComponent implements OnInit, OnDestroy {
  @Input() Employments!: FormArray<IPRPL_APLT_EMPTInfo>;
  @Input() ComponentName!: string;
  @ViewChild("tabRef", { static: false }) tabGroup!: MatTabGroup;
  request = new mPOSMasterDataRequest();
  NullVal: number | string = '';
  dataRowState = DataRowState;
  selectedInd!:number;
  lastRemovedIndex:number=-1;
  count:number=0;
  private subscription$ = new Subject();
  existingBPParams = {} as IExistingBPInfoParm;

  constructor(public _AddressMasterDataService: AddressMasterDataService, private _formModeService: FormModeService,
    public _employmentMasterDataService: EmploymentMasterDataService, public _masterDataService: MasterDataService,
    private _proposalForm: ProposalEntityFormService,
    private _proposaldataService: ProposalDataService,
    private _proposalService: ProposalService,
    private _messageService: MessageService,
    private _FormState: StateManagment) { }

  getComponentName() {
    return this.ComponentName + "-Employment"
  }

  get isViewMode() {
    return this._formModeService.FormMode === FormMode.VIEW;
  }

  ngOnInit(): void {
    this.selectedInd=0;
    this.setIndex(true);
    this._AddressMasterDataService.getmasterDataForAddress().pipe(takeUntil(this.subscription$)).subscribe(a => {
      this._AddressMasterDataService.InitializeAddressMasterData(a);
    });
    this._employmentMasterDataService.getmasterDataForEmployment().pipe(takeUntil(this.subscription$)).subscribe(data => {
      this._employmentMasterDataService.BusinessLine = data?.BusinessLine?.ResultSet?.DataCollection;
      this._employmentMasterDataService.BusinessType = data?.BusinessType?.ResultSet?.DataCollection;
      this._employmentMasterDataService.Department = data?.Department?.ResultSet?.DataCollection;
      this._employmentMasterDataService.Designation = data?.Designation?.ResultSet?.DataCollection;
      this._employmentMasterDataService.EconomicSector = data?.EconomicSector?.ResultSet?.DataCollection;
      this._employmentMasterDataService.EmploymentStatus = data?.EmploymentStatus?.ResultSet?.DataCollection;
      this._employmentMasterDataService.EmploymentType = data?.EmploymentType?.ResultSet?.DataCollection;
    });
  }

  tabSelectionChange(index:any)
  {
	if(index!=undefined){
      if(this.selectedInd<0){
        this.selectedInd=0;
      }
      if(index===this.Employments.value.filter(p=>p.RowState!=DataRowState.Removed).length && index>0){
        this.selectedInd=this.Employments.value.filter(p=>p.RowState!=DataRowState.Removed).length-1;
      }
      else{
        this.selectedInd=index;
      }
    }
  }

  AddEmployment() {
    let Employee: FormGroup<IPRPL_APLT_EMPTInfo> = this._proposalForm.ProposalEmploymentComponentForm();
    Employee.controls.NEWDATAIND.setValue(true);
    const max = this.Employments.value.reduce((op, item) => op = op > item.EMPLOYMENTID ? op : item.EMPLOYMENTID, 0);
    Employee.controls.EMPLOYMENTID.setValue(max + 1);
    this.Employments.push(Employee);
    window.setTimeout(() => {
      this.selectedInd = this.Employments.value.filter(obj => obj.RowState !== DataRowState.Removed).length - 1;
      this.tabGroup.selectedIndex = this.selectedInd;
    });
    Employee.controls.VLDMSGIND.setValue(this.Employments.value?.length-1);
    this.setIndex();
  }

  removeEmployment(object: any, Employmentindex : number) {
    let emp = this.Employments.controls.filter(x => x.value.RowState !== DataRowState.Removed);
    let ind: number = this.Employments.value.indexOf(object.value);
    var i:number=this.Employments.value.filter(p=>p.RowState!=DataRowState.Removed).indexOf(object.value);
    if (emp.length == 1 && (this._proposaldataService.CurrentApplicant.controls.PROPOSALAPPLICANT.value.ROLECDE == RoleCode.Borrower)) {
      this._messageService.showCustomMesssage('Minimum one employement is mandatory', MessageType.Warning);
      return;
    }
    else {
      if (this.Employments.controls[ind].controls.RowState.value == DataRowState.Added && emp.length > 1) {
        this.Employments.removeAt(ind);
        this._messageService.ClearValidatorMessages('-Employment-' + (object.value.VLDMSGIND  + 1));
        // if(ind>this.lastRemovedIndex){
        //   this.lastRemovedIndex=ind;
        //   this.count++;
        //   this._messageService.ClearValidatorMessages('-Employment-' + (Employmentindex + 1+this.count));
        // }
        // else{
        //   this._messageService.ClearValidatorMessages('-Employment-' + (Employmentindex + 1));
        // }
        
      }
      else if(this.Employments.controls[ind].controls.RowState.value == DataRowState.Added && (this._proposaldataService.CurrentApplicant.controls.PROPOSALAPPLICANT.value.ROLECDE !== RoleCode.Borrower)){
        this.Employments.removeAt(ind);
        this._messageService.ClearValidatorMessages('-Employment-' + (object.value.VLDMSGIND  + 1));
        // if(ind>this.lastRemovedIndex){
        //   this.lastRemovedIndex=ind;
        //   this.count++;
        //   this._messageService.ClearValidatorMessages('-Employment-' + (Employmentindex + 1+this.count));
        // }
        // else{
        //   this._messageService.ClearValidatorMessages('-Employment-' + (Employmentindex + 1));
        // }
      }
      else {

        let idDetail = null;
        let result: any;

        if (this._proposaldataService.PROPOSAL.controls.PROPOSALTYPECDE.value == ApplicantType.Individual) {
          if (this._proposaldataService.CurrentApplicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTEMPLOYMENT.value.length > 1) {
            idDetail = this._proposaldataService.CurrentApplicant.controls.PROPOSALAPPLICANTIDDETAIL.value.filter(x => x.IDTYPECDE == IDTypeCode.KTP && x.RowState != DataRowState.Removed);
            if (idDetail != null) {
              this.existingBPParams.IdCardNumber = idDetail[0].IDTYPENBR;
              this.existingBPParams.IdCardTyp = idDetail[0].IDTYPECDE;
              this.existingBPParams.ProposalId = this._proposaldataService.PROPOSAL.value.PROPOSALID;
              this._proposalService.ReadExistingBPandApplicant(this.existingBPParams).pipe(takeUntil(this.subscription$)).subscribe(res => {
                result = res;
                if (result != null && result.ResultSet != null && result.ResultSet.length > 0) {
                  if (this._proposaldataService.PROPOSALAPPLICANT.length > 0) {
                    if (this._proposaldataService.CurrentApplicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTEMPLOYMENT.controls[ind-1].controls.BPEMPTSEQID.value > 0) {
                      this._messageService.showMesssage("msgEmploymentGuarantorCoBorrower", MessageType.Warning);
                      return;
                    }
                  }
                }

                this._FormState.ResetFormState(this.Employments.controls[ind], DataRowState.Removed);
                this.setIndex();

              })
            }
          }
        }
      }
      if (this.selectedInd > 0 && (this.selectedInd == i || this.selectedInd > i)) {
        window.setTimeout(() => {
          this.selectedInd = this.selectedInd - 1;
          this.tabGroup.selectedIndex = this.selectedInd;
        });
      }
      this.setIndex();
    }
  }
  setIndex(isLoadPage: boolean = false) {
    let index = 0;
    this.Employments.controls.filter(x => x.value.RowState != 4).forEach((member) => {
      member.controls.INDEX.setValue(index);
      index++;
    })
    // index = 0;
    // if (isLoadPage) {
    //   this.Employments.controls.filter(x => x.value.RowState != 4).forEach((member) => {
    //     member.controls.VLDMSGIND.setValue(index);
    //     index++;
    //   })
    // }
  }

  getIndex(Employee: FormGroup<IPRPL_APLT_EMPTInfo>): number {
    return Employee.value.INDEX;
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }
}
