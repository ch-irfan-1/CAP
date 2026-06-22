import { Component, OnInit } from '@angular/core';
import { DialogBoxService } from '@NFS_Core/NFSServices/DialogBox/dialog-box.service';
import { FormatterService } from '@NFS_Core/NFSServices/Formatter/formatter.service';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { IPRPL_FINL_AGRMInfo } from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { CalculationService } from '@NFS_Modules/CAP/CAPServices/calculation.service';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { FormGroup } from 'src/Library';

@Component({
    selector: 'app-total-gp-interest-amount',
    templateUrl: './total-gp-interest-amount.component.html',
    styleUrls: ['./total-gp-interest-amount.component.css'],
    standalone: false
})
export class TotalGPInterestAmountComponent implements OnInit {
  PROPOSALFINANCIALAGREEMENT!: FormGroup<IPRPL_FINL_AGRMInfo>;
  constructor(public _proposaldataService: ProposalDataService, private _messageService: MessageService, private _calculationService: CalculationService,
    private _formatter: FormatterService,private _dialog: DialogBoxService,) { }

  ngOnInit(): void {
    //this.ValidateGPTerms();
    this.PROPOSALFINANCIALAGREEMENT =
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT;
  }

  public ValidateGPTerms(event:Event, propertyName: any) {
    let val = this._formatter.FormatCurrencyToNumber(String(event));
    if(propertyName == 'GPFREQUENCY'){
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.GPFREQUENCY.setValue(val);
    }
    else if(propertyName == 'GPTERMS'){
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.GPTERMS.setValue(val);
    }
    else if(propertyName == 'GPINTERESTRTEFLAT'){
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.GPINTERESTRTEFLAT.setValue(val);
    }
    if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT != null) {
      if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.GPFREQUENCY.value != 0 ||
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.GPTERMS.value != 0) {
        let p_selectedfrequency = this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.GPFREQUENCY.value;

        if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.GPTERMS.value > this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.CONTRACTTRM.value) {
          this._messageService.showMesssage("GPTermsGreater", MessageType.Warning);
          this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.GPTERMS.setValue(0);
          /// TO DO: this.txtGPTerms.Value = 0;
        }
        else if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.GPTERMS.value > 0 && this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.GPTERMS.value < p_selectedfrequency) {
          this._messageService.showMesssage("IncoGPTermsRemainder", MessageType.Warning);
          this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.GPTERMS.setValue(0);
          /// TO DO: this.txtGPTerms.Value = 0;
        }
        else if (p_selectedfrequency > 0) {
          if ((this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.GPTERMS.value % p_selectedfrequency) != 0) {
            this._messageService.showMesssage("IncoGPTermsRemainder", MessageType.Warning);
            this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.GPTERMS.setValue(0);
            /// TO DO: this.txtGPTerms.Value = 0;
          }
        }
      }
    }
    if (propertyName !== 'GPINTERESTRTEFLAT' && this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.GPFREQUENCY.value > 0)
      this.resetRentalDetailAndInsurance();
    else
      this._calculationService.ResetRentalDetail();
  }

  resetRentalDetailAndInsurance(){
    this._calculationService.EnableInsuranceCalculateButton();
    //this._calculationService.ResetRentalDetail();
  }

  gpInterestChange(event : number){
    if (event != undefined) {
      if(event > 100){
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.GPINTERESTRTEFLAT.setValue(0);
      }
      
    }
  }

  btnOk() {
    this._dialog.dialog.closeAll();
  }

   
}
