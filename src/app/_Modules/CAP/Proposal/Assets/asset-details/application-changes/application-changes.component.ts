import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DialogBoxService } from '@NFS_Core/NFSServices/DialogBox/dialog-box.service';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { ApplicationTypeService } from '@NFS_Core/NFSServices/_helper/application-type.service';
import { IProposalChargeEntity } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/IProposalChargeEntity.model';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FinanceType } from '@NFS_Enums/FinanceType.enum';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { ICalculationInfoParam } from '@NFS_Interfaces/RequestInterfaces/ICalculationInfoParam';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { CalculationService } from '@NFS_Modules/CAP/CAPServices/calculation.service';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalManagerService } from '@NFS_Modules/CAP/_helpers/proposal-manager.service';
import { FormArray } from 'src/Library';

@Component({
    selector: 'app-application-changes',
    templateUrl: './application-changes.component.html',
    styleUrls: ['./application-changes.component.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
    standalone: false
})
export class ApplicationChangesComponent implements OnInit {
  panelOpenState = false;
  AssetCharge!: IProposalChargeEntity;
  financialProductId!: number;
  assetId!: number;
  dataSource = new MatTableDataSource<IProposalChargeEntity>();
  proposalParamInfo: IProposalInfoParm = {} as IProposalInfoParm;
  calculationInfoParam: ICalculationInfoParam = {} as ICalculationInfoParam;
  columnsToDisplay: string[] = [
    'feeOpen',
    'PRPLCHRG.CHARGEDSC',
    'PRPLCHRG.CHARGEAMT',
    'TAXINCULSIVEAMT',
    'PRPLCHRG.FINANCEDIND',
    'PRPLCHRG.RECEIVEBYDEALERIND',
  ];
  public columns: string[] = ['TAXTYPE', 'BASEAMOUNT', 'TAXRATE', 'TAXAMT'];
  public Labels: string[] = [
    'Tax Type',
    'Base Amount',
    'Tax Rate',
    'Tax Amount',
  ];
  public Pipes = [null, 'formatCurrency', 'formatCurrency', 'formatCurrency'];
  public isFinanceIndDisable: boolean = false;
  public isReceivedByDealerDisable: boolean = false;
  public maxLength: number = 20;
  public mask: string = "separator.2";
  public autoComplete: string = "off";
  PROPOSALCHARGE!: FormArray<IProposalChargeEntity>;
  isCF: boolean = true;
  isViewMode: boolean = false;
  expandedElement: any;

  constructor(
    public _proposalDataService: ProposalDataService,
    public _calculatioinService: CalculationService,
    private _proposalManagerService: ProposalManagerService,
    public _appTypeService: ApplicationTypeService,
    private _formModeService: FormModeService,
    private _dialog: DialogBoxService
  ) { }

  openDialog() {
    var dialog = this._dialog.openDialog("Information", "No Charges Attached", true);
    dialog.afterClosed().subscribe(result => {
      if (result === "ok") {
        return
      }
    });
  }

  ngOnInit(): void {
    this.PROPOSALCHARGE = this._proposalDataService.PROPOSALCHARGE;
    let len = this.PROPOSALCHARGE.length;

    if (len == 0) {
      this.openDialog();
    }
    else {
      this.PROPOSALCHARGE.controls.forEach(x => {
        if (x.controls.PRPLCHRG.controls.FINANCEDIND.value == 'T') {
          x.controls.PRPLCHRG.controls.TEMPFINANCEIND.setValue(true);
        }
        else {
          x.controls.PRPLCHRG.controls.TEMPFINANCEIND.setValue(false);
        }
        if (this._proposalDataService.PROPOSAL.controls.FINANCETYP.value == FinanceType.Refinance || this._proposalDataService.PROPOSAL.controls.FINANCETYP.value == FinanceType.OperatingLease) {
          x.controls.PRPLCHRG.controls.ReceivedByDealerEnabled.setValue(false);
          x.controls.PRPLCHRG.controls.FINANCEenabled.setValue(false);
          if (this._formModeService.FormMode != FormMode.VIEW && this._proposalDataService.PROPOSAL.controls.FINANCETYP.value == FinanceType.OperatingLease) {
            x.controls.PRPLCHRG.controls.FINANCEDIND.setValue('T');
            x.controls.PRPLCHRG.controls.TEMPFINANCEIND.setValue(true);
          }
        }
        if (x.controls.PRPLCHRG.controls.FINANCEDIND.value == 'T') {
          x.controls.PRPLCHRG.controls.ReceivedByDealerEnabled.setValue(false);
        }
        else if (x.controls.PRPLCHRG.value.RECEIVEBYDEALERIND) {
          x.controls.PRPLCHRG.controls.FINANCEenabled.setValue(false);
        }
        else {
          x.controls.PRPLCHRG.controls.ReceivedByDealerEnabled.setValue(true);
          x.controls.PRPLCHRG.controls.FINANCEenabled.setValue(true);
        }
        if (this._proposalDataService.PROPOSAL.controls.ISMCOMCAMPAIGN.value)
          x.controls.IsRecieveByDealerEnabled.setValue(false);

      })
      this.PROPOSALCHARGE.value.map((c: any, index: number) => {
        if (c.RowState !== DataRowState.Removed) {
          c.PRPLCHRGTAX.forEach((item: any) => {
            if (item.RowState != DataRowState.Removed) {
              this._calculatioinService.totalTaxAmountArr[index] = 0;
              this._calculatioinService.totalTaxAmountArr[index] += item.TAXAMT;
            }
          });
          this.dataSource.data.push(c);
        }
      });
    }

    if (this._proposalManagerService.ISCFNONMCOMIND) {
      this.isCF = false;
    }
    if (this._formModeService.FormMode == FormMode.VIEW) {
      this.isViewMode = true;
    }
  }

  financeIndCheck(event: any, Prplchargeent: any, i: any) {
    let index = this._proposalDataService.PROPOSALCHARGE.value.findIndex((charge: any) => charge.PRPLCHRG.CHARGECDE === Prplchargeent.PRPLCHRG.CHARGECDE && charge.PRPLCHRG.RowState !== DataRowState.Removed);

    if (this._proposalDataService.PROPOSAL.controls.FINANCETYP.value == FinanceType.HirePurchase) {
      if (Boolean(event) == true) {
        this.dataSource.data[i].PRPLCHRG.ReceivedByDealerEnabled = false;
        this.PROPOSALCHARGE.controls[index].controls.PRPLCHRG.controls.ReceivedByDealerEnabled.setValue(false);
        this.PROPOSALCHARGE.controls[index].controls.PRPLCHRG.controls.TEMPFINANCEIND.setValue(true);
        this.PROPOSALCHARGE.controls[index].controls.PRPLCHRG.controls.FINANCEDIND.setValue("T");
        if (this.PROPOSALCHARGE.controls[index].controls.PRPLCHRG.controls.RECEIVEBYDEALERIND.value) {
          this.PROPOSALCHARGE.controls[index].controls.PRPLCHRG.controls.RECEIVEBYDEALERIND.setValue(false);
          this.dataSource.data[i].PRPLCHRG.RECEIVEBYDEALERIND = false;
        }
      } else {
        this.PROPOSALCHARGE.controls[index].controls.PRPLCHRG.controls.TEMPFINANCEIND.setValue(false);
        this.PROPOSALCHARGE.controls[index].controls.PRPLCHRG.controls.FINANCEDIND.setValue("F");
        if (this._proposalDataService.PROPOSAL.value.ISMCOMCAMPAIGN !== true) {
          this.dataSource.data[i].PRPLCHRG.ReceivedByDealerEnabled = true;
          this.PROPOSALCHARGE.controls[index].controls.PRPLCHRG.controls.ReceivedByDealerEnabled.setValue(true);
        }
        else {
          this.dataSource.data[i].PRPLCHRG.ReceivedByDealerEnabled = false;
          this.PROPOSALCHARGE.controls[index].controls.PRPLCHRG.controls.ReceivedByDealerEnabled.setValue(false);
        }
      }

      if (this.PROPOSALCHARGE.controls[index].controls.PRPLCHRG.controls.RowState.value !== DataRowState.Added)
        this.PROPOSALCHARGE.controls[index].controls.PRPLCHRG.controls.RowState.setValue(DataRowState.Updated);
    }

    this._calculatioinService.ResetRentalDetail();
  }

  receivedByDealerCheck(event: any, Prplchargeent: any, i: any) {
    let index = this._proposalDataService.PROPOSALCHARGE.value.findIndex((charge: any) => charge.PRPLCHRG.CHARGECDE === Prplchargeent.PRPLCHRG.CHARGECDE && charge.PRPLCHRG.RowState !== DataRowState.Removed);

    if (this._proposalDataService.PROPOSAL.controls.FINANCETYP.value == FinanceType.HirePurchase) {
      if (Boolean(event) == true) {
        this.dataSource.data[i].PRPLCHRG.FINANCEenabled = false;
        this.PROPOSALCHARGE.controls[index].controls.PRPLCHRG.controls.FINANCEenabled.setValue(false);
        this.PROPOSALCHARGE.controls[index].controls.PRPLCHRG.controls.RECEIVEBYDEALERIND.setValue(true);
        if (this.PROPOSALCHARGE.controls[index].controls.PRPLCHRG.controls.TEMPFINANCEIND.value) {
          this.PROPOSALCHARGE.controls[index].controls.PRPLCHRG.controls.FINANCEDIND.setValue("F");
          this.PROPOSALCHARGE.controls[index].controls.PRPLCHRG.controls.TEMPFINANCEIND.setValue(false);
          this.dataSource.data[i].PRPLCHRG.TEMPFINANCEIND = false;
        }
      } else {
        this.dataSource.data[i].PRPLCHRG.FINANCEenabled = true;
        this.PROPOSALCHARGE.controls[index].controls.PRPLCHRG.controls.RECEIVEBYDEALERIND.setValue(false);
        this.PROPOSALCHARGE.controls[index].controls.PRPLCHRG.controls.FINANCEenabled.setValue(true);
      }
      if (this.PROPOSALCHARGE.controls[index].controls.PRPLCHRG.controls.RowState.value !== DataRowState.Added)
        this.PROPOSALCHARGE.controls[index].controls.PRPLCHRG.controls.RowState.setValue(DataRowState.Updated);
    }
    this._proposalDataService.PROPOSALFINANCIALAGREEMENT.controls.DEALERPOAMOUNT.setValue(this._proposalManagerService.DealerPOAmount());
  }

  onChangeChargeAmount(ev: any, Prplchargeent: any, i: any) {
    let index = this._proposalDataService.PROPOSALCHARGE.value.findIndex((charge: any) => charge.PRPLCHRG.CHARGECDE === Prplchargeent.PRPLCHRG.CHARGECDE && charge.PRPLCHRG.RowState !== DataRowState.Removed);

    
      let chargeAmt = parseFloat(ev ?.target ?.value.split(',').join(''));
      if (isNaN(chargeAmt))
        chargeAmt = 0;
      this._proposalDataService.PROPOSALCHARGE.controls[index].controls.PRPLCHRG.controls.CHARGEAMT.setValue(chargeAmt);
      this._proposalDataService.PROPOSALCHARGE.controls[index].controls.TAXEXCULSIVEAMT.setValue(chargeAmt);
      this._proposalDataService.PROPOSALCHARGE.controls[index].controls.TAXINCULSIVEAMT.setValue(chargeAmt);
      if (this._proposalDataService.PROPOSALCHARGE.controls[index].value.RowState != DataRowState.Removed && this._proposalDataService.PROPOSALCHARGE.controls[index].value.RowState != DataRowState.Added) {
        this._proposalDataService.PROPOSALCHARGE.controls[index].controls.RowState.setValue(DataRowState.Updated)
        this._proposalDataService.PROPOSALCHARGE.controls[index].controls.PRPLCHRG.controls.RowState.setValue(DataRowState.Updated);
      }
      if (!this._proposalDataService.PROPOSALCHARGE.controls[index].controls.PRPLCHRG.controls.ISSERVICEFEE.value) {
      this.calculationInfoParam.ChargeAmount = chargeAmt;
      this.calculationInfoParam.ChargeTypeCode = Prplchargeent.PRPLCHRG.CHARGECDE;
      this.calculationInfoParam.proposalInfoParam = {} as IProposalInfoParm;
      this.calculationInfoParam.proposalInfoParam.IntroducerID = this._proposalDataService.PROPOSAL.value.BPINTRODUCERID;
      this.calculationInfoParam.proposalInfoParam.FinanceType = this._proposalDataService.PROPOSAL.value.FINANCETYP;

      this._calculatioinService.CalculateChargeTax(this.calculationInfoParam, this._proposalDataService.PROPOSALCHARGE.controls[index].value, index);
      }
      this._calculatioinService.ResetRentalDetail();

      this.dataSource = new MatTableDataSource<IProposalChargeEntity>();
      this.PROPOSALCHARGE.value.map((c: any) => {
        if (c.RowState !== 4) {
          this.dataSource.data.push(c);
        }
      });
    
    
  }

  btnOk() {
    this._dialog.dialog.closeAll();
  }
}
