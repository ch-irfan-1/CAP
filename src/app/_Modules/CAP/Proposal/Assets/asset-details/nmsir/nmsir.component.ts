import { Component, OnInit } from '@angular/core';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { IMPOS_APLT_DCMTInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IMPOS_APLT_DCMTInfo.model';
import { IPRPL_ARTE_AMNT_TRANInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/IPRPL_ARTE_AMNT_TRANInfo.model';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { CalculationService } from '@NFS_Modules/CAP/CAPServices/calculation.service';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { FormArray, FormBuilder } from 'src/Library';

@Component({
    selector: 'app-nmsir',
    templateUrl: './nmsir.component.html',
    styleUrls: ['./nmsir.component.css'],
    standalone: false
})
export class NMSIRComponent implements OnInit {

  public columns = ['AMTCOMPONENTDESC', 'INPUTAMT'];
  public pipes = [null, 'formatCurrency'];
  public Labels = ['Component Name', 'Amount'];
  InflowComponents: FormArray<IPRPL_ARTE_AMNT_TRANInfo> =
  this._formBuilder.array<IPRPL_ARTE_AMNT_TRANInfo>([]);

OutflowComponents: FormArray<IPRPL_ARTE_AMNT_TRANInfo> =
  this._formBuilder.array<IPRPL_ARTE_AMNT_TRANInfo>([]);


  constructor(private _proposalDataService: ProposalDataService,private _calculationService: CalculationService, public _proposalService: ProposalService, private _formBuilder: FormBuilder) { }

  panelOpenState = false;
  
  ngOnInit(): void {
    if(this._calculationService.NMSIRInflowComponent!=null)
    this._calculationService.NMSIRInflowComponent?.forEach(x => {
        this.InflowComponents.push(x.controls.PRPLARTEAMNTTRAN);
    });
    if(this._calculationService.NMSIROutflowComponent!=null)
    this._calculationService.NMSIROutflowComponent?.forEach(x => {
      this.OutflowComponents.push(x.controls.PRPLARTEAMNTTRAN);
  });
  }

}
export class testing {
  ComponentName: string = '';
  Amount: string = '';
}
