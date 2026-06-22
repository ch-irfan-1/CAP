import { Component, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorSelectConfig, PageEvent } from '@angular/material/paginator';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { IMPOS_APLT_DCMTInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IMPOS_APLT_DCMTInfo.model';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { IContextMenu } from '@NFS_Interfaces/OtherInterfaces/IContextMenu.interface';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { FormArray, FormBuilder } from 'src/Library';


@Component({
    selector: 'app-applicant-documents',
    templateUrl: './applicant-documents.component.html',
    styleUrls: ['./applicant-documents.component.css'],
    standalone: false
})
export class ApplicantDocumentsComponent implements OnInit {

  dataSourcelength = 10;
  selectedPageSize: number = 25;
  pageSizeOptions: number[] = [25, 50, 75, 100];

  public columns = ['DGroup', 'DType', 'DSType', 'Comments', 'Submitted'];
  public pipes = [null, null, null, null, null, null];
  public Labels = ['Document Group', 'Document Type', 'Document Sub Type', 'Comments', 'Submitted'];
  public ContextMenu: Array<IContextMenu> = [];

  //MPOSAPLTDOCT!: FormArray<IMPOS_APLT_DCMTInfo>;
  object = { DGroup: '', DType: '', DSType: '', Comments: '', Submitted: true } as testing
     group = this._formBuilder.group(this.object);
  public doctDataset: FormArray < testing > = this._formBuilder.array<testing>([this.group]);




constructor(private _proposalDataService: ProposalDataService, public _proposalService: ProposalService, private _formBuilder: FormBuilder) { }

panelOpenState = false;

paginatorSelectConfig:MatPaginatorSelectConfig = {
  panelClass: "paginator-select-overlay"
}
ngOnInit(): void {
  // this.MPOSAPLTDOCT = this._proposalDataService.PROPOSALAPPLICANT.controls.filter(x => x.controls.RowState.value != DataRowState.Removed)[0].controls.MPOSDOCUMENTS;
  // let proposalId=129767

  //   this._proposalService.ReadMPOSDocumentsByProposalId(proposalId).subscribe(res => {
  //   this.MPOSAPLTDOCT = this._formBuilder.array(res.ResultSet.map((r: any) => this._formBuilder.group(r)));
  //   console.log(this.MPOSAPLTDOCT)
  // })
}

  public PageSelectionChanged(event: PageEvent) {
}

}

export class testing {
  DGroup: string = '';
  DType: string = ''
  DSType: string = ''
  Comments: string = ''
  Submitted: boolean = false

}