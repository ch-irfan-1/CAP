import { Component, OnInit } from '@angular/core';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { IBaseEntity } from '@NFS_Entity/Base-Entity/BaseEntity.model';
import { IPRPL_FINL_AGRMInfo } from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import { IMPOS_APLT_DCMTInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IMPOS_APLT_DCMTInfo.model';
import { IProposalArticleComponentEntity } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/IProposalArticleComponentEntity.model';
import { IPRPL_ARTE_AMNT_TRANInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/IPRPL_ARTE_AMNT_TRANInfo.model';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { IDealerPOAmountComponent } from '@NFS_Interfaces/OtherInterfaces/IDealerPOAmountComponent';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalManagerService } from '@NFS_Modules/CAP/_helpers/proposal-manager.service';
import { FormArray, FormBuilder, FormGroup, FormControl } from 'src/Library';
import { FinanceType } from '@NFS_Enums/FinanceType';

@Component({
    selector: 'app-dealer-po-amount',
    templateUrl: './dealer-po-amount.component.html',
    styleUrls: ['./dealer-po-amount.component.css'],
    standalone: false
})
export class DealerPOAmountComponent implements OnInit {

  public columns = ['ComponentName', 'Amount'];
  public pipes = [null, 'formatCurrency'];
  public Labels = ['Component Name', 'Amount'];
  ProposalArticleComponentEntity: FormArray<IProposalArticleComponentEntity> =
    this._formBuilder.array<IProposalArticleComponentEntity>([]);

  public addedComponent: FormArray<IDealerPOAmountComponent> =
    this._formBuilder.array<IDealerPOAmountComponent>([]);

  public deductedComponent: FormArray<IDealerPOAmountComponent> =
    this._formBuilder.array<IDealerPOAmountComponent>([]);

  public PROPOSALFINANCIALAGREEMENT!: FormGroup<IPRPL_FINL_AGRMInfo>;
  constructor(private _proposalManagerService: ProposalManagerService, public _proposalService: ProposalService, private _formBuilder: FormBuilder, private _proposalDataService: ProposalDataService) { }

  panelOpenState = false;
  subsidyOnPOInd : boolean = false;

  ngOnInit(): void {
    this.PROPOSALFINANCIALAGREEMENT =
      this._proposalDataService.PROPOSALFINANCIALAGREEMENT;
    this._proposalDataService.PROPOSALFINANCIALAGREEMENT.controls.DEALERPOAMOUNT.setValue(this._proposalManagerService.DealerPOAmount());
    if(this._proposalDataService.PROPOSAL.value.FINANCETYP == FinanceType.OperatingLease){
      this.subsidyOnPOInd = true;
    }
    ///added component
    this.ProposalArticleComponentEntity = this._proposalManagerService.POAddedComponents
    if (this.ProposalArticleComponentEntity)
      // this.ProposalArticleComponentEntity.controls.filter(x => x.controls.RowState.value != DataRowState.Removed).forEach(item => {
        this.ProposalArticleComponentEntity.controls.forEach(item => {
        let addedComponentFormGroup: FormGroup<IDealerPOAmountComponent> =
          this._formBuilder.group<IDealerPOAmountComponent>({
            ComponentName: item.value.PRPLARTEAMNTTRAN.AMTCOMPONENTDESC,
            Amount: !isNaN(item.value.NETPAYABLEAMT) ? item.value.NETPAYABLEAMT : 0
          })
        this.addedComponent.push(addedComponentFormGroup);
      })

    ///deducted component
    this.ProposalArticleComponentEntity = this._proposalManagerService.PODeductedComponents;
    if (this.ProposalArticleComponentEntity) {
      this.ProposalArticleComponentEntity.controls.forEach(item => {
        let addedComponentFormGroup: FormGroup<IDealerPOAmountComponent> =
          this._formBuilder.group<IDealerPOAmountComponent>({
            ComponentName: item.value.PRPLARTEAMNTTRAN.AMTCOMPONENTDESC,
            Amount: item.value.NETPAYABLEAMT
          })
        this.deductedComponent.push(addedComponentFormGroup);
      })
    }
  }

}

