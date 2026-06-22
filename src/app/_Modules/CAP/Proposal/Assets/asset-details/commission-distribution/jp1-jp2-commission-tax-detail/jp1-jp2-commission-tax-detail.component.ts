import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { IJP1JP2RecipientEntity, IPRPL_JP1_JP2_RPNT_TAXInfo } from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import { IMPOS_APLT_DCMTInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IMPOS_APLT_DCMTInfo.model';
import { CommissionDivisionType } from '@NFS_Enums/CommissionDivisionType.enum';
import { CommissionType } from '@NFS_Enums/CommissionType.enum';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { TaxType } from '@NFS_Enums/TaxType.enum';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { FormArray, FormBuilder, FormGroup } from 'src/Library';
import { element } from 'protractor';

@Component({
    selector: 'app-jp1-jp2-commission-tax-detail',
    templateUrl: './jp1-jp2-commission-tax-detail.component.html',
    styleUrls: ['./jp1-jp2-commission-tax-detail.component.css'],
    standalone: false
})
export class JP1JP2CommissionTaxDetailComponent implements OnInit {

  dataSourcelength = 10;
  selectedPageSize: number = 25;
  pageSizeOptions: number[] = [25, 50, 75, 100];

  public columns = ['TAXTYPEDSC', 'BASEAMOUNT', 'TAXRATE', 'TAXAMT'];
  public pipes = [null, 'formatCurrency', 'formatCurrency', 'formatCurrency'];
  public Labels = ['Tax Type', 'Base Amount', 'Tax Rate', 'Tax Amount'];

  //MPOSAPLTDOCT!: FormArray<IMPOS_APLT_DCMTInfo>;
  object = { TaxType: '', BaseAmount: '', TaxRate: '', TaxAmount: '' } as testing
  group = this._formBuilder.group(this.object);
  public doctDataset: FormArray<testing> = this._formBuilder.array<testing>([this.group]);

  Recepient!: FormGroup<IJP1JP2RecipientEntity>;
  temp: ICommissionTaxHelper = {} as ICommissionTaxHelper
  Tax!: FormGroup<ICommissionTaxHelper>;
  TaxCollection: FormArray<IPRPL_JP1_JP2_RPNT_TAXInfo> = this._fg.array<IPRPL_JP1_JP2_RPNT_TAXInfo>([]) as FormArray<IPRPL_JP1_JP2_RPNT_TAXInfo>;


  constructor(private _proposalDataService: ProposalDataService, public _proposalService: ProposalService, private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<JP1JP2CommissionTaxDetailComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private _proposalFormService: ProposalEntityFormService, private _fg: FormBuilder) { }

  panelOpenState = false;

  ngOnInit(): void {
    this.Recepient = this.data.Recepient as FormGroup<IJP1JP2RecipientEntity>;
    this.Tax = this.CommissionTaxHelperForm();
    this.Tax.controls.CommissionTypeDescription.setValue(CommissionType.GetDescriptionStringValue(CommissionType.MarketingCommission));
    this.Tax.controls.DivisionType.setValue(CommissionDivisionType.GetDescriptionStringValue(this.data.DivisionType));
    this.Tax.controls.RecepientName.setValue(this.Recepient.value.PRPLJP1JP2ROLERPNT.find(x => x.RECIPIENTID == this.Recepient.value.PRPLJP1JP2RPNT.RECIPIENTID)?.RECIPIENTDSC || '');
    if(this.data.DivisionType == CommissionDivisionType.JP1) {
      this.Tax.controls.TaxInclusiveAmount.setValue(this.Recepient.value.JP1TAXINCULSIVEAMT);
      this.Tax.controls.TaxExclusiveAmount.setValue(this.Recepient.value.JP1TAXEXCULSIVEAMT);
      this.Tax.controls.CommissionAmount.setValue(this.data.Recepient.value.PRPLJP1JP2RPNT.JP1COMMISSIONAMT);
    }
    else if(this.data.DivisionType == CommissionDivisionType.JP2) {
      this.Tax.controls.TaxInclusiveAmount.setValue(this.Recepient.value.JP2TAXINCULSIVEAMT);
      this.Tax.controls.TaxExclusiveAmount.setValue(this.Recepient.value.JP2TAXEXCULSIVEAMT);
      this.Tax.controls.CommissionAmount.setValue(this.data.Recepient.value.PRPLJP1JP2RPNT.JP2COMMISSIONAMT);
    }

    let collection = this.Recepient.value.PRPLJP1JP2RPNTTAX.filter(p => p.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.MarketingCommission) && p.DIVISIONTYPECDE == CommissionDivisionType.GetStringValue(this.data.DivisionType) && p.BUSINESSPARTNERID == this.Recepient.value.PRPLJP1JP2RPNT.RECIPIENTID) as Array<IPRPL_JP1_JP2_RPNT_TAXInfo>;
    collection.forEach(item => {
      if(item.BASEAMOUNT > 0){
        item.TAXTYPEDSC = TaxType.GetDescription(item.TAXTYPECDE);
        this.TaxCollection.push(this._fg.group<IPRPL_JP1_JP2_RPNT_TAXInfo>(item));
      }
    })
  }
  public PageSelectionChanged(event: PageEvent) {
  }

  public CommissionTaxHelperForm(): FormGroup<ICommissionTaxHelper> {
    return this._formBuilder.group<ICommissionTaxHelper>({
      CommissionTypeDescription: '',
      DivisionType: '',
      RecepientName: '',
      TaxInclusiveAmount: 0,
      TaxExclusiveAmount: 0,
      CommissionAmount: 0,
    })
  }

}
export class testing {
  TaxType: string = '';
  BaseAmount: string = ''
  TaxRate: string = ''
  TaxAmount: string = ''

}

export interface ICommissionTaxHelper {
  CommissionTypeDescription: string;
  DivisionType: string;
  RecepientName: string;
  TaxInclusiveAmount: number;
  TaxExclusiveAmount: number;
  CommissionAmount: number;
}
