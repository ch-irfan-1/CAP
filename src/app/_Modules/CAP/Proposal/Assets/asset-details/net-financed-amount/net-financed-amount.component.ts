import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder,FormControl,FormGroup } from 'src/Library';
import { IPRPL_ARTE_AMNT_TRANInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/IPRPL_ARTE_AMNT_TRANInfo.model';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { IProposalArticleComponentEntity } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/IProposalArticleComponentEntity.model';
import { CalculationService } from '@NFS_Modules/CAP/CAPServices/calculation.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';

@Component({
    selector: 'app-net-financed-amount',
    templateUrl: './net-financed-amount.component.html',
    styleUrls: ['./net-financed-amount.component.css'],
    standalone: false
})
export class NetFinancedAmountComponent implements OnInit {
  @Input() Mode: string = FormMode.NEW;
  panelOpenState = false;
  public columns = ['AMTCOMPONENTDESC', 'INPUTAMT'];
  public labels = ['Component Name', 'Amount'];
  public pipes = [null,'formatCurrency'];
  addedComponentEntity: FormArray<IProposalArticleComponentEntity> =
     this._formBuilder.array<IProposalArticleComponentEntity>([]);
     public addedComponent: FormArray<IPRPL_ARTE_AMNT_TRANInfo> =
     this._formBuilder.array<IPRPL_ARTE_AMNT_TRANInfo>([]);
     deductedComponentEntity:FormArray<IProposalArticleComponentEntity> =
     this._formBuilder.array<IProposalArticleComponentEntity>([]);
  public deductedComponent: FormArray<IPRPL_ARTE_AMNT_TRANInfo> =
    this._formBuilder.array<IPRPL_ARTE_AMNT_TRANInfo>([]);
    public NFAAMT: FormControl = new FormControl('');

  constructor(
    private _formBuilder: FormBuilder,private _calculationService:CalculationService, public _dataService: ProposalDataService, private _proposalEntityFormService:ProposalEntityFormService
  ) {}

  ngOnInit(): void {
     ///added component
     this.addedComponentEntity=this._calculationService.addedComponents; 
     this.addedComponentEntity.controls.forEach(item => {
       this.addedComponent.push(item.controls.PRPLARTEAMNTTRAN);

       this.addedComponent.controls[this.addedComponent.value.length -1].controls.INPUTAMT.setValue(item.controls.TAXINCULSIVEAMT.value);
     })
     let prplFinAgrmnt=this._dataService.PROPOSALFINANCIALAGREEMENT;
     let tempoldCntrcbl=  this._proposalEntityFormService.ProposalArticleAmountTransferForm() as FormGroup<IPRPL_ARTE_AMNT_TRANInfo>;
     if(prplFinAgrmnt.controls.OLDCONTRCBL.value > 0){
     tempoldCntrcbl.patchValue({AMTCOMPONENTDESC:'Old Contract Receivable', INPUTAMT:prplFinAgrmnt.controls.OLDCONTRCBL.value});
     this.addedComponent.push(tempoldCntrcbl);
    }
         ///deducted component
     this.deductedComponentEntity=this._calculationService.deductedComponents;
     this.deductedComponentEntity.controls.forEach(item => {
       this.deductedComponent.push(item.controls.PRPLARTEAMNTTRAN)
       this.deductedComponent.controls[this.deductedComponent.value.length -1].controls.INPUTAMT.setValue(item.controls.TAXEXCULSIVEAMT.value);
     });

     this.NFAAMT.setValue(this._dataService.PROPOSALFINANCIALAGREEMENT.controls.ADJUSTEDFINANCEDAMT.value);
  }
}
