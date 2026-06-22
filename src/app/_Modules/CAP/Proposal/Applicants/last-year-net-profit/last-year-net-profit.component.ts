import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IPRPL_APLT_NET_PRFTInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IPRPL_APLT_NET_PRFTInfo.model';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { ProfitYears } from '@NFS_Enums/ProfitYears.enum';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { FormArray, FormBuilder } from 'src/Library';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079},
  {position: 2, name: 'Helium', weight: 4.0026},
];
@Component({
    selector: 'app-last-year-net-profit',
    templateUrl: './last-year-net-profit.component.html',
    styleUrls: ['./last-year-net-profit.component.css'],
    standalone: false
})
export class LastYearNetProfitComponent implements OnInit {
  PROPOSALAPPLICANTNETPROFIT!: FormArray<IPRPL_APLT_NET_PRFTInfo>;
  constructor(private _proposalDataService:ProposalDataService,private _formBuilder:FormBuilder) { }
  displayedColumns: string[] = ['position', 'name', 'weight'];
  dataSource = ELEMENT_DATA;
  ngOnInit(): void {
    this.PROPOSALAPPLICANTNETPROFIT=this._proposalDataService.CurrentApplicant.controls.PROPOSALAPPLICANTNETPROFIT;
    if(this._proposalDataService.CurrentApplicant.controls.PROPOSALAPPLICANTNETPROFIT.length>0)
    {
    this.PROPOSALAPPLICANTNETPROFIT=this._proposalDataService.CurrentApplicant.controls.PROPOSALAPPLICANTNETPROFIT;
    this.PROPOSALAPPLICANTNETPROFIT.controls.forEach((item,index)=>{
      item.controls.PRFTYEARDSC.setValue(ProfitYears.GetDescriptionStringValuebyCode(item.controls.PRFTYEARCDE.value));
    })
    }
    else{
      for(let i=1;i<=3;i++)
      {
      this.PROPOSALAPPLICANTNETPROFIT.push(this._formBuilder.group<IPRPL_APLT_NET_PRFTInfo>({
        PRFTYEARSEQID: 0,
        PROPOSALID: 0,
        APPLICANTID: 0,
        YEARNUMBER: '',
        PROFITAMOUNT: 0,
        EXECUTIONDTE: new Date(Date.now()),
        EXECUTIONOFFSET: 0,
        SESSIONID: 0,
        SESSIONCDE: '',
        PRFTYEARCDE: ProfitYears.GetStringValue(i),
        NEWDATAIND: false,
        BPNETPRFTSEQID: 0,
        // following property is from helper class
        PRFTYEARDSC: ProfitYears.GetDescriptionStringValue(i),
        RowState: DataRowState.Added,
        ISAUDITABLE: false
      }))
      }
    }
  }

}
