import { Component, OnInit } from '@angular/core';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { IMPOS_APLT_DCMTInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IMPOS_APLT_DCMTInfo.model';
import { IPRPL_ARTE_AMNT_TRANInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/IPRPL_ARTE_AMNT_TRANInfo.model';
import { AmountComponent } from '@NFS_Enums/AmountComponent';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { CalculationService } from '@NFS_Modules/CAP/CAPServices/calculation.service';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { FormArray, FormBuilder } from 'src/Library';

@Component({
    selector: 'app-total-acquisition-income',
    templateUrl: './total-acquisition-income.component.html',
    styleUrls: ['./total-acquisition-income.component.css'],
    standalone: false
})
export class TotalAcquisitionIncomeComponent implements OnInit {

  public columns = ['AMTCOMPONENTDESC', 'INPUTAMT'];
  public pipes = [null, 'formatCurrency'];
  public Labels = ['Component Name', 'Amount'];
  AddedComponents: FormArray<IPRPL_ARTE_AMNT_TRANInfo> =
  this._formBuilder.array<IPRPL_ARTE_AMNT_TRANInfo>([]);

DeductedComponents: FormArray<IPRPL_ARTE_AMNT_TRANInfo> =
  this._formBuilder.array<IPRPL_ARTE_AMNT_TRANInfo>([]);

  constructor(private _proposalDataService: ProposalDataService,private _calculationService: CalculationService, public _proposalService: ProposalService, private _formBuilder: FormBuilder) { }

  panelOpenState = false;
  
  ngOnInit(): void {
    if(this._calculationService.AcqusitionAddedComponents!=null)
    this._calculationService.AcqusitionAddedComponents?.forEach(x => {
        this.AddedComponents.push(x.controls.PRPLARTEAMNTTRAN);
    });
    if(this._calculationService.AcqusitionDeductiveComponents!=null)
    this._calculationService.AcqusitionDeductiveComponents?.forEach(x => {
      this.DeductedComponents.push(x.controls.PRPLARTEAMNTTRAN);
  });
  }

}
export class testing {
  ComponentName: string = '';
  Amount: string = '';
}
