import { Component, OnInit } from '@angular/core';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { IMPOS_APLT_DCMTInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IMPOS_APLT_DCMTInfo.model';
import { IPRPL_ARTE_BASE_RATEInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/IPRPL_ARTE_BASE_RATEInfo.model';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { FormArray, FormBuilder, FormGroup } from 'src/Library';

@Component({
    selector: 'app-base-rate',
    templateUrl: './base-rate.component.html',
    styleUrls: ['./base-rate.component.css'],
    standalone: false
})
export class BaseRateComponent implements OnInit {

  public columns = ['SLABFROM', 'SLABTO', 'BASERATE', 'EFFECTIVEDATE', 'INTERESTRTE', 'APPLIEDCUSTOMERRTE'];
  public pipes = [null, null, null, 'formatDate', null, null];
  public Labels = ['Slab From', 'Slab To', 'Base Rate', 'Effective Date', 'Interest Rate', 'Applied Customer Rate'];

   public baseRateEntity:FormArray<IPRPL_ARTE_BASE_RATEInfo>=this._proposalDataService.PROPOSALARTICLEBASERATE;

  constructor(private _proposalDataService: ProposalDataService, public _proposalService: ProposalService, private _formBuilder: FormBuilder) {
    
  }
  panelOpenState = false;
  ngOnInit(): void {
  }

}
