import { Component, OnInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { IMPOS_APLT_DCMTInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IMPOS_APLT_DCMTInfo.model';
import { IProposalArticleComponentEntity } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/IProposalArticleComponentEntity.model';
import { IPRPL_ARTE_AMNT_TRAN_TAXInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/ProposalArticleEntity.model.index';
import { AmountComponent } from '@NFS_Enums/AmountComponent';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { TaxType } from '@NFS_Enums/TaxType.enum';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { FormArray, FormBuilder, FormGroup } from 'src/Library';

@Component({
    selector: 'app-policy-fee',
    templateUrl: './policy-fee.component.html',
    styleUrls: ['./policy-fee.component.css'],
    standalone: false
})
export class PolicyFeeComponent implements OnInit {

  dataSourcelength = 0;
  selectedPageSize: number = 25;
  pageSizeOptions: number[] = [25, 50, 75, 100];

  public columns = ['TAXTYPE', 'BASEAMOUNT', 'TAXRATE', 'TAXAMT'];
  public pipes = [null, 'formatCurrency', 'formatCurrency', 'formatCurrency'];
  public Labels = ['Tax Type', 'Base Amount', 'Tax Rate', 'Tax Amount'];

  //MPOSAPLTDOCT!: FormArray<IMPOS_APLT_DCMTInfo>;
  object = { TaxType: '', BaseAmount: '', TaxRate: '', TaxAmount: ''} as testing
  group = this._formBuilder.group(this.object);
  //public doctDataset: FormArray < testing > = this._formBuilder.array<testing>([this.group]);
  public doctDataset : FormArray<IPRPL_ARTE_AMNT_TRAN_TAXInfo> = this._formBuilder.array<IPRPL_ARTE_AMNT_TRAN_TAXInfo>([]);
  public SelectedArticleComponent!: FormGroup<IProposalArticleComponentEntity>

  constructor(private _proposalDataService: ProposalDataService, public _proposalService: ProposalService, private _formBuilder: FormBuilder) { }

  panelOpenState = false;
  
  ngOnInit(): void {
    this.SelectedArticleComponent = this._proposalDataService.PRPLARTICLECOMPONENTENTITYCOL.controls.filter(p => p.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.PolicyFee))[0];
    if(this.SelectedArticleComponent.controls.PRPLARTEAMNTTRAN.value.AMTCOMPONENTDESC == '' || this.SelectedArticleComponent.controls.PRPLARTEAMNTTRAN.value.AMTCOMPONENTDESC == null)
    {
      this.SelectedArticleComponent.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue("Policy Fee")
    }
    this.SelectedArticleComponent.controls.PRPLARTEAMNTTRANTAX.controls.forEach( item => {
      item.controls.TAXTYPE.setValue(TaxType.GetDescription(item.value.TAXTYPECDE));
      this.doctDataset.push(item)
    })
  // this.doctDataset = SelectedArticleComponent.controls.PRPLARTEAMNTTRANTAX;
   this.dataSourcelength = this.doctDataset.controls.length;
  }
  public PageSelectionChanged(event: PageEvent) {
  }

}
export class testing {
  TaxType: string = '';
  BaseAmount: string = ''
  TaxRate: string = ''
  TaxAmount: string = ''

}

