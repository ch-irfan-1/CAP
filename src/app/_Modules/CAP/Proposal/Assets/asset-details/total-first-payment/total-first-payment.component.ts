import { Component, OnInit } from '@angular/core';
import { IProposalArticleComponentEntity } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/IProposalArticleComponentEntity.model';
import { IPRPL_ARTE_AMNT_TRANInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/IPRPL_ARTE_AMNT_TRANInfo.model';
import { CalculationService } from '@NFS_Modules/CAP/CAPServices/calculation.service';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from 'src/Library';

@Component({
    selector: 'app-total-first-payment',
    templateUrl: './total-first-payment.component.html',
    styleUrls: ['./total-first-payment.component.css'],
    standalone: false
})
export class TotalFirstPaymentComponent implements OnInit {
  panelOpenState = false;
  public columns = ['AMTCOMPONENTDESC', 'INPUTAMT'];
  public pipes = [null,'formatCurrency'];
  public Labels = ['Component Name', 'Amount'];

  FCComponents: FormArray<IPRPL_ARTE_AMNT_TRANInfo> =
    this._formBuilder.array<IPRPL_ARTE_AMNT_TRANInfo>([]);

  DealerComponents: FormArray<IPRPL_ARTE_AMNT_TRANInfo> =
    this._formBuilder.array<IPRPL_ARTE_AMNT_TRANInfo>([]);

  public NFAAMT: FormControl = new FormControl('');

  constructor(
    private _formBuilder: FormBuilder, private _calculationService: CalculationService, public _dataService: ProposalDataService
  ) { }

  ngOnInit(): void {
    ///added component
    this._calculationService.FirstPayment.controls.forEach(x => {
      if (x.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.value == false) {
        this.FCComponents.push(x.controls.PRPLARTEAMNTTRAN);
      }
      else if (x.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.value == true) {
        this.DealerComponents.push(x.controls.PRPLARTEAMNTTRAN);
      }
    });

    //this.NFAAMT.setValue(this._dataService.PROPOSALFINANCIALAGREEMENT.controls.ADJUSTEDFINANCEDAMT.value);
  }

}
