import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder,FormControl,FormGroup } from 'src/Library';
import { IPRPL_ARTE_AMNT_TRANInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/IPRPL_ARTE_AMNT_TRANInfo.model';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { IProposalArticleComponentEntity } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/IProposalArticleComponentEntity.model';
import { CalculationService } from '@NFS_Modules/CAP/CAPServices/calculation.service';

@Component({
    selector: 'app-old-contract',
    templateUrl: './old-contract.component.html',
    styleUrl: './old-contract.component.css',
    standalone: false
})
export class OldContractComponent {
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
    waivedComponentEntity:FormArray<IProposalArticleComponentEntity> =
    this._formBuilder.array<IProposalArticleComponentEntity>([]);
 public waivedComponent: FormArray<IPRPL_ARTE_AMNT_TRANInfo> =
   this._formBuilder.array<IPRPL_ARTE_AMNT_TRANInfo>([]);

    public NFAAMT: FormControl = new FormControl('');

  constructor(
    private _formBuilder: FormBuilder,private _calculationService:CalculationService, public _dataService: ProposalDataService
  ) {}

  ngOnInit(): void {
     ///added component
     this.addedComponentEntity=this._calculationService.addedComonentsOldContract; 
     this.addedComponentEntity.controls.forEach(item => {
       this.addedComponent.push(item.controls.PRPLARTEAMNTTRAN);

       this.addedComponent.controls[this.addedComponent.value.length -1].controls.INPUTAMT.setValue(item.controls.TAXINCULSIVEAMT.value);
     })

     ///deducted component
     this.deductedComponentEntity=this._calculationService.deductedComponentsOldContract;
     this.deductedComponentEntity.controls.forEach(item => {
       this.deductedComponent.push(item.controls.PRPLARTEAMNTTRAN)
       this.deductedComponent.controls[this.deductedComponent.value.length -1].controls.INPUTAMT.setValue(item.controls.TAXEXCULSIVEAMT.value);
     });
///waived comonent
this.waivedComponentEntity=this._calculationService.waivedComponentsOldContract;
this.waivedComponentEntity.controls.forEach(item => {
  this.waivedComponent.push(item.controls.PRPLARTEAMNTTRAN)
  this.waivedComponent.controls[this.waivedComponent.value.length -1].controls.INPUTAMT.setValue(item.controls.TAXEXCULSIVEAMT.value);


    
  });
  this.NFAAMT.setValue(this._dataService.PROPOSALFINANCIALAGREEMENT.controls.ADJUSTEDFINANCEDAMT.value);  
}
}