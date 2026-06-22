import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { StateManagment } from '@NFS_Core/RowStateManagement/FormStateManagement';
import { IOTO_PRPL_APLT_FAMInfo,IPRPL_APLT_MAINInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/ProposalApplicantEntity.model.index';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { FormArray, FormGroup } from 'src/Library';
import { MatTabGroup } from '@angular/material/tabs';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';

@Component({
    selector: 'app-family-member',
    templateUrl: './family-member.component.html',
    styleUrls: ['./family-member.component.css'],
    standalone: false
})
export class FamilyMemberComponent implements OnInit {
  @Input() ApplicantFamilyMembers !: FormArray<IOTO_PRPL_APLT_FAMInfo>;
  @Input() ApplicantInfo!: FormGroup<IPRPL_APLT_MAINInfo>;
  @Input() ComponentName!: string;
  @ViewChild("tabRef", { static: false }) tabGroup!: MatTabGroup;
  dataRowState = DataRowState;
  selectedInd!:number;
  constructor(private _formModeService: FormModeService, private _proposaldataService: ProposalDataService,
    private _proposalForm: ProposalEntityFormService, public _masterDataService: MasterDataService,
    private _FormState: StateManagment, private _messageService: MessageService) { }

  getComponentName() {
    return this.ComponentName + "-FamilyMember"
  }

  get isViewMode() {
    return this._formModeService.FormMode === FormMode.VIEW;
  }

  ngOnInit(): void {
    this.selectedInd=0;
    this.setIndex(true);
  }

  getSelectedIndex():any{
    console.log(this.selectedInd);
    return this.selectedInd;
  }

  tabSelectionChange(index:any)
  {
   if(index!=undefined){
      if(this.selectedInd<0){
        this.selectedInd=0;
      }
      if(index===this.ApplicantFamilyMembers.value.filter(p=>p.RowState!=DataRowState.Removed).length && index>0){
        this.selectedInd=this.ApplicantFamilyMembers.value.filter(p=>p.RowState!=DataRowState.Removed).length-1;
      }
      else{
        this.selectedInd=index;
      }
    }
  }

  AddFamilyMember() {
    let familymember: FormGroup<IOTO_PRPL_APLT_FAMInfo> = this._proposalForm.proposalIndvidualFamilyMemberForm();
    familymember.controls.NEWDATAIND.setValue(true);
    if (this.ApplicantFamilyMembers.controls.length == 0) {
      this.ApplicantFamilyMembers.push(familymember);
      familymember.controls.FAMCDE.setValue(0);
    }
    else {
      familymember.controls.FAMCDE.setValue(this.ApplicantFamilyMembers.controls[this.ApplicantFamilyMembers.controls.length - 1].controls.FAMCDE.value + 1);
      this.ApplicantFamilyMembers.push(familymember);
    }
    window.setTimeout(() => {
      this.selectedInd = this.ApplicantFamilyMembers.value.filter(obj => obj.RowState !== DataRowState.Removed).length - 1;
      this.tabGroup.selectedIndex = this.selectedInd;
    });
    familymember.controls.VLDMSGIND.setValue(this.ApplicantFamilyMembers.value?.length-1);
    this.setIndex();
  }

  removeFamilyMember(object: any, FamilymemberIndex : number) {
    const index: number = this.ApplicantFamilyMembers.value.indexOf(object.value);
	  var i: number = this.ApplicantFamilyMembers.value.filter(p=>p.RowState!=DataRowState.Removed).indexOf(object.value);
    if (this.ApplicantFamilyMembers.controls[index].controls.RowState.value == DataRowState.Added) {
      this.ApplicantFamilyMembers.removeAt(index);
      this._messageService.ClearValidatorMessages('-FamilyMember-' + (object.value.VLDMSGIND + 1));
    }
    else {
      this._FormState.ResetFormState(this.ApplicantFamilyMembers.controls[index], DataRowState.Removed);
      this._messageService.ClearValidatorMessages('-FamilyMember-' + (object.value.VLDMSGIND + 1));
    }
    if (this.selectedInd > 0 && (this.selectedInd == i || this.selectedInd > i)) {
      window.setTimeout(() => {
        this.selectedInd = this.selectedInd - 1;
        this.tabGroup.selectedIndex = this.selectedInd;
      });
    }
    this.setIndex();
  }

  setIndex(isLoadPage: boolean = false) {
    let index = 0;
    this.ApplicantFamilyMembers.controls.filter(x => x.value.RowState != 4).forEach((member) => {
      member.controls.INDEX.setValue(index);
      index++;
    })
    // index = 0;
    // if (isLoadPage) {
    //   this.ApplicantFamilyMembers.controls.filter(x => x.value.RowState != 4).forEach((member) => {
    //     member.controls.VLDMSGIND.setValue(index);
    //     index++;
    //   })
    // }
  }

  getIndex(ApplicantFamilyMember: FormGroup<IOTO_PRPL_APLT_FAMInfo>): number {
    return ApplicantFamilyMember.value.INDEX;
  }

}
