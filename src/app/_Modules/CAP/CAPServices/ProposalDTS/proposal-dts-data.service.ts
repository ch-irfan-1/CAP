import { Injectable } from '@angular/core';
import * as ProposalDTSEntity from "@NFS_Entity/ProposalDTS-Entity/IProposalDTSEntity.model.index";
import { ProposalDTSEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalDTS/ProposalDTSEntityForm.service';
import { FormArray, FormGroup } from 'src/Library';

@Injectable({
  providedIn: 'root'
})
export class ProposalDTSDataService {
  public ProposalDTSEntity!: FormGroup<ProposalDTSEntity.IProposalDTSEntity>;

  constructor(private _ProposalDTSForm: ProposalDTSEntityFormService) {
    // this.ProposalDTSEntity = this._ProposalDTSForm.ProposalDTSEntity();
  }

  get PROPOSALDTSHEADER() {
    return this.ProposalDTSEntity.get("PROPOSALDTSHEADER") as FormGroup<ProposalDTSEntity.IPRPL_DTS_HEDRInfo>;
  }

  get PROPOSALDOCUMENTS() {
    return this.ProposalDTSEntity.get("PROPOSALDOCUMENTS") as FormArray<ProposalDTSEntity.IPRPL_DOCTInfo>;
  }

  get PROPOSALDTS() {
    return this.ProposalDTSEntity.get("PROPOSALDTS") as FormGroup<ProposalDTSEntity.IPRPL_DTSInfo>;
  }

  get PROPOSALDTSDOCUMENTS() {
    return this.ProposalDTSEntity.get("PROPOSALDTSDOCUMENTS") as FormArray<ProposalDTSEntity.IPRPL_DTS_DOCTInfo>;
  }

  get MPOSDOCUMENTS() {
    return this.ProposalDTSEntity.get("MPOSDOCUMENTS") as FormArray<ProposalDTSEntity.IMPOS_APLT_DCMTInfo>;
  }
}
