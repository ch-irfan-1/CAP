import { Component, OnInit } from '@angular/core';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { IMPOS_APLT_DCMTInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IMPOS_APLT_DCMTInfo.model';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { IDepreciationPolicy } from '@NFS_Interfaces/OtherInterfaces/IDepreciationPolicy';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { FormArray, FormBuilder } from 'src/Library';

@Component({
    selector: 'app-depreciation-policy',
    templateUrl: './depreciation-policy.component.html',
    styleUrls: ['./depreciation-policy.component.css'],
    standalone: false
})
export class DepreciationPolicyComponent implements OnInit {

  public columns = ['Year', 'AssetType', 'DepreciationRate'];
  public pipes = [null, null, null, null, null, null];
  public Labels = ['Year', 'Asset Type', 'Depreciation Rate'];

  //MPOSAPLTDOCT!: FormArray<IMPOS_APLT_DCMTInfo>;
  // object = { Year: 'Hi', AssetType: 'Hello', DepreciationRate: '100%' } as testing
  // group = this._formBuilder.group(this.object);
  public depPolicyData: FormArray<IDepreciationPolicy> = this._formBuilder.array<IDepreciationPolicy>([]);


  constructor(private _proposalDataService: ProposalDataService, public _proposalService: ProposalService, private _formBuilder: FormBuilder, private _formModeService: FormModeService) { }

  panelOpenState = false;

  ngOnInit(): void {
    if (this._formModeService.FormMode == FormMode.NEW || this._formModeService.FormMode == FormMode.COPY || this._formModeService.FormMode == FormMode.EDIT || this._formModeService.FormMode == FormMode.RESUBMIT) {
      //.map((a: any) => { return { code: a.BUSINESSPARTNERID, TextValue: a.BUSINESSPARTNERNME } })
      let res = this._proposalDataService.INSRDPRNPLCY.value.map((r: any) => { return { Year: r.NOOFYEARS, AssetType: r.ASSETTYPECDE, DepreciationRate: r.DPRCPCT +'%' } });
      this.depPolicyData = this._formBuilder.array(res.map((r: any) => this._formBuilder.group(r)));
    }
    else {
      if (this._proposalDataService.PRPLINSR.value.PROPOSALID > 0 && this._proposalDataService.PRPLINSR.value.ASSETID > 0) {
        let params = {} as IProposalInfoParm;
        params.ProposalId = this._proposalDataService.PRPLINSR.value.PROPOSALID;
        params.AssetID = this._proposalDataService.PRPLINSR.value.ASSETID;

        this._proposalService.ReadDepreciationPolicy(params).subscribe(res => {
          if (res.ResultSet != null && res.ResultSet.length > 0) {
            this.depPolicyData = this._formBuilder.array(res.ResultSet.map((r: any) => this._formBuilder.group(r)));
          }
          else {
            //this.doctDataset=null
          }
        })
      }
    }

  }

}
export class testing {
  Year: string = '';
  AssetType: string = '';
  DepreciationRate: string = '';
}