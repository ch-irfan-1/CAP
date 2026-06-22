import { Component, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorSelectConfig, PageEvent } from '@angular/material/paginator';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { IMPOS_APLT_DCMTInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IMPOS_APLT_DCMTInfo.model';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { FormArray, FormBuilder } from 'src/Library';
@Component({
    selector: 'app-ojk-jp1-jp2-commission-tax-detail',
    templateUrl: './ojk-jp1-jp2-commission-tax-detail.component.html',
    styleUrls: ['./ojk-jp1-jp2-commission-tax-detail.component.css'],
    standalone: false
})
export class OJKJP1JP2CommissionTaxDetailComponent implements OnInit {

  dataSourcelength = 10;
  selectedPageSize: number = 25;
  pageSizeOptions: number[] = [25, 50, 75, 100];

  public columns = ['TaxType', 'BaseAmount', 'TaxRate', 'TaxAmount'];
  public pipes = [null, 'formatCurrency', 'formatCurrency', 'formatCurrency'];
  public Labels = ['Tax Type', 'Base Amount', 'Tax Rate', 'Tax Amount'];

  //MPOSAPLTDOCT!: FormArray<IMPOS_APLT_DCMTInfo>;
  object = { TaxType: '', BaseAmount: '', TaxRate: '', TaxAmount: ''} as testing
  group = this._formBuilder.group(this.object);
  public doctDataset: FormArray < testing > = this._formBuilder.array<testing>([this.group]);


  constructor(private _proposalDataService: ProposalDataService, public _proposalService: ProposalService, private _formBuilder: FormBuilder) { }

  panelOpenState = false;
  
  paginatorSelectConfig:MatPaginatorSelectConfig = {
    panelClass: "paginator-select-overlay"
  }
  ngOnInit(): void {
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
