import { Component, OnInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { IMPOS_APLT_DCMTInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IMPOS_APLT_DCMTInfo.model';
import { IProposalArticleComponentEntity } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/IProposalArticleComponentEntity.model';
import { IPRPL_ARTE_AMNT_TRANInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/IPRPL_ARTE_AMNT_TRANInfo.model';
import { IPRPL_ARTE_AMNT_TRAN_TAXInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/IPRPL_ARTE_AMNT_TRAN_TAXInfo.model';
import { AmountComponent } from '@NFS_Enums/AmountComponent';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { TaxType } from '@NFS_Enums/TaxType.enum';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { FormArray, FormBuilder, FormGroup } from 'src/Library';

@Component({
    selector: 'app-provision-fee-amount',
    templateUrl: './provision-fee-amount.component.html',
    styleUrls: ['./provision-fee-amount.component.css'],
    standalone: false
})
export class ProvisionFeeAmountComponent implements OnInit {

  dataSourcelength = 10;
  selectedPageSize: number = 25;
  pageSizeOptions: number[] = [25, 50, 75, 100];

  public columns = ['TAXTYPE', 'BASEAMOUNT', 'TAXRATE', 'TAXAMT'];
  public pipes = [null, 'formatCurrency', 'formatCurrency', 'formatCurrency'];
  public Labels = ['Tax Type', 'Base Amount', 'Tax Rate', 'Tax Amount'];

  public doctDataset: FormArray<IPRPL_ARTE_AMNT_TRAN_TAXInfo> = this._formBuilder.array<IPRPL_ARTE_AMNT_TRAN_TAXInfo>([]);
  public SelectedArticleComponent!: FormGroup<IProposalArticleComponentEntity>;

  constructor(private _proposalDataService: ProposalDataService, public _proposalService: ProposalService, private _formBuilder: FormBuilder) { }

  panelOpenState = false;

  ngOnInit(): void {

    let _article = this._proposalDataService.PRPLARTICLECOMPONENTENTITYCOL.controls.find(p => p.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.ProvisionFee) && p.value.PRPLARTEAMNTTRAN.RowState!=DataRowState.Removed);
    if (_article != null || _article != undefined) {
      if (_article.controls.PRPLARTEAMNTTRAN.value.AMTCOMPONENTDESC == '') {
        _article.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue(AmountComponent.GetDescriptionStringValue(AmountComponent.ProvisionFee))
      }
      _article.controls.PRPLARTEAMNTTRANTAX.controls.forEach(item => {
        item.controls.TAXTYPE.setValue(TaxType.GetDescription(item.value.TAXTYPECDE));
        this.doctDataset.push(item)
      })
      this.SelectedArticleComponent=_article;
      // this.doctDataset = SelectedArticleComponent.controls.PRPLARTEAMNTTRANTAX;
      //this.dataSourcelength = this.doctDataset.controls.length;
    }
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
