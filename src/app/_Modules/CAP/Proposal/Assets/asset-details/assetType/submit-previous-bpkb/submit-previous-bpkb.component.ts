import { Component, OnInit } from '@angular/core';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { IMPOS_APLT_DCMTInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IMPOS_APLT_DCMTInfo.model';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { FormArray, FormBuilder } from 'src/Library';

@Component({
    selector: 'app-submit-previous-bpkb',
    templateUrl: './submit-previous-bpkb.component.html',
    styleUrls: ['./submit-previous-bpkb.component.css'],
    standalone: false
})
export class SubmitPreviousBPKBComponent implements OnInit {

  public columns = ['CustomerName', 'ApplicationNo', 'ContractNo'];
  public pipes = [null, null, null, null, null, null];
  public Labels = ['Customer Name', 'Application No.', 'Contract No.'];

  //MPOSAPLTDOCT!: FormArray<IMPOS_APLT_DCMTInfo>;
  object = { CustomerName: 'ABC', ApplicationNo: '1234', ContractNo:'123'} as testing
  group = this._formBuilder.group(this.object);
  public doctDataset: FormArray < testing > = this._formBuilder.array<testing>([this.group]);


  constructor(private _proposalDataService: ProposalDataService, public _proposalService: ProposalService, private _formBuilder: FormBuilder) { }

  panelOpenState = false;
  
  ngOnInit(): void {
  }

}
export class testing {
  CustomerName: string = '';
  ApplicationNo: string = '';
  ContractNo: string = '';
}
