import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { IProposalArticleComponentEntity } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/IProposalArticleComponentEntity.model';
import { IPRPL_ARTE_AMNT_TRAN_TAXInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/IPRPL_ARTE_AMNT_TRAN_TAXInfo.model';
import { AmountComponent } from '@NFS_Enums/AmountComponent';
import { TaxType } from '@NFS_Enums/TaxType.enum';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { FormArray, FormBuilder, FormGroup } from 'src/Library';

@Component({
    selector: 'app-total-admin-fees',
    templateUrl: './total-admin-fees.component.html',
    styleUrls: ['./total-admin-fees.component.css'],
    standalone: false
})

export class TotalAdminFeesComponent implements OnInit {

  dataSourcelength = 10;
  selectedPageSize: number = 25;
  pageSizeOptions: number[] = [25, 50, 75, 100];

  public columns = ['TAXTYPE', 'BASEAMOUNT', 'TAXRATE', 'TAXAMT'];
  public pipes = [null, 'formatCurrency', 'formatCurrency', 'formatCurrency'];
  public Labels = ['Tax Type', 'Base Amount', 'Tax Rate', 'Tax Amount'];

  object = { TaxType: '', BaseAmount: '', TaxRate: '', TaxAmount: '' } as testing
  group = this._formBuilder.group(this.object);
  public doctDataset: FormArray<IPRPL_ARTE_AMNT_TRAN_TAXInfo> = this._formBuilder.array<IPRPL_ARTE_AMNT_TRAN_TAXInfo>([]);
  PRPLARTICLECOMPONENTENTITYCOL !: FormGroup<IProposalArticleComponentEntity>;
  PRPLARTEAMNTTRAN = this._proposalEntityFormService.ProposalArticleAmountTransferForm();

  constructor(private _proposalDataService: ProposalDataService, public _proposalService: ProposalService, private _formBuilder: FormBuilder, private _proposalEntityFormService: ProposalEntityFormService) { }
  panelOpenState = false;

  ngOnInit(): void {

    this.PRPLARTICLECOMPONENTENTITYCOL = this._proposalDataService.PRPLARTICLECOMPONENTENTITYCOL.controls.find(x => x.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AdminFee)) as FormGroup<IProposalArticleComponentEntity>;
    this.PRPLARTICLECOMPONENTENTITYCOL.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue(AmountComponent.GetDescriptionStringValue(AmountComponent.AdminFee));
    this.PRPLARTEAMNTTRAN = this.PRPLARTICLECOMPONENTENTITYCOL.controls.PRPLARTEAMNTTRAN;
    this.PRPLARTICLECOMPONENTENTITYCOL?.value.PRPLARTEAMNTTRANTAX?.forEach(tax => {
      tax.TAXTYPE = TaxType.GetDescription(tax.TAXTYPECDE);
      this.doctDataset.push(this._formBuilder.group<IPRPL_ARTE_AMNT_TRAN_TAXInfo>(tax));
    });

    let a = this.PRPLARTICLECOMPONENTENTITYCOL?.controls?.PRPLARTEAMNTTRAN;

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
