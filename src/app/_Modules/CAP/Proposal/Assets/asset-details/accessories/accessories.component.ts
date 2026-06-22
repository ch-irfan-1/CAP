import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AssetDetailsMasterdataService } from '@NFS_Core/NFSServices/MasterData/asset-details-masterdata.service';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { IPRPL_ACCYInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/IPRPL_ACCYInfo.model';
import { AccessoriesType } from '@NFS_Enums/AccessoriesType.enum';
import { AmountComponent } from '@NFS_Enums/AmountComponent';
import { AssetComponentsFinancialConfiguration } from '@NFS_Enums/AssetComponentsFinancialConfiguration.enum';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FinanceType } from '@NFS_Enums/FinanceType.enum';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { CalculationService } from '@NFS_Modules/CAP/CAPServices/calculation.service';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { DealerSupplierSearchComponent } from '@NFS_Modules/CAP/Proposal/dealer-supplier-search/dealer-supplier-search.component';
import { ProposalManagerService } from '@NFS_Modules/CAP/_helpers/proposal-manager.service';
import { FormArray, FormBuilder } from 'src/Library';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-accessories',
    templateUrl: './accessories.component.html',
    styleUrls: ['./accessories.component.css'],
    standalone: false
})
export class AccessoriesComponent implements OnInit, OnDestroy {
  Accessories: Array<IPRPL_ACCYInfo> = [];
  public FilterAccessoryCmb: INFSDropDownData[] = [];
  public dataSource = new MatTableDataSource<IPRPL_ACCYInfo>(this.Accessories);
  selectedDealer: string = '';
  selectedDealerId: number = 0;
  bpRolecde: string = '';
  assetId: number = 0;
  proposalId: number = 0;
  separatorLimit=Math.pow(10,12);
  mask: string = "separator.2";
  isCalculated = false;
  public TotalPrice: number = 0;
  public IsbtnCalculateEnable = false;
  public IsbtnAddEnable = true;
  public IsStardardAccessoriesReq = false;
  public LoadTimeData: FormArray<IPRPL_ACCYInfo> = this.fb.array<IPRPL_ACCYInfo>([]);
  StandardAccessories: FormArray<IPRPL_ACCYInfo> = this.fb.array<IPRPL_ACCYInfo>([]);
  OptionalAccessories: FormArray<IPRPL_ACCYInfo> = this.fb.array<IPRPL_ACCYInfo>([]);

  displayedColumns: string[] = ['ACCESSORYCDE', 'UNITAMT', 'QUANTITY', 'ACCESSORYAMT', 'VATAMT', 'EXCLUSIVEAMT', 'BPSUPPLIERNAME', 'dealerOpen', 'deleterow'];
  public Columns = ['ACCESSORYCDE', 'QUANTITY', 'BPSUPPLIERNAME'];
  public Labels = ['Accessory', 'Quantity', 'Introducer/Supplier'];
  private subscription$ = new Subject();

  constructor(
    public dialogRef: MatDialogRef<AccessoriesComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    private dialog: MatDialog, public _assetDetailsMasterdataService: AssetDetailsMasterdataService, private _ProposalDataService: ProposalDataService, private _msgService: MessageService,
    private _proposalManager: ProposalManagerService,
    public _proposaldataService: ProposalDataService,
    public _calculationService: CalculationService,) { }

  ngOnInit(): void {
    this._assetDetailsMasterdataService.getmasterDataForAssetDetail().pipe(takeUntil(this.subscription$)).subscribe(a => {
      this._assetDetailsMasterdataService.InitializeAssetDetailMasterData(a);
      this.FilterAccessoryCmb = this._assetDetailsMasterdataService.AssetModelAndFitting.filter(x => x.OptionalData?.FITTINGTYPE == AccessoriesType.Optional)

    })
    if (!this._ProposalDataService.PROPOSALASSET.value.ASSETTYPECDE) {
      this._msgService.showMesssage("msgSelectAsset", MessageType.Warning);
      this.IsbtnAddEnable = false;
      return
    }
    this.selectedDealer = this._ProposalDataService.PROPOSAL.value.BPINTRODUCERNME;
    this.selectedDealerId = this._ProposalDataService.PROPOSAL.value.BPINTRODUCERID;
    this.bpRolecde = this._ProposalDataService.PROPOSAL.value.INTRODUCERROLECDE;
    this.assetId = this._ProposalDataService.PROPOSALASSET.value.ASSETID;
    this.proposalId = this._ProposalDataService.PROPOSAL.value.PROPOSALID;
    this.LoadTimeData = this._ProposalDataService.PROPOSALACCESSORY as FormArray<IPRPL_ACCYInfo>;
    this.StandardAccessories = this.fb.array<IPRPL_ACCYInfo>(this.LoadTimeData.controls.filter(x => x.controls.FTNGTYPECDE.value == AccessoriesType.Standard))
    this.IsStardardAccessoriesReq = this.StandardAccessories.length > 0;
    this.Accessories = this.LoadTimeData.value.filter(x => x.FTNGTYPECDE == AccessoriesType.Optional);
    this.Accessories.filter(p => p.RowState != DataRowState.Removed).forEach((accessory, index) => {
      accessory.ACCESSORYAMT = (accessory.UNITAMT * accessory.QUANTITY);
      this.TotalPrice += accessory.ACCESSORYAMT;
    });
    this.dataSource = new MatTableDataSource<IPRPL_ACCYInfo>(this.Accessories.filter(x => x.RowState != DataRowState.Removed));
  }

  AddAccessory($event: any) {
    if (!this.IsbtnAddEnable) {
      return;
    }
    let errLst = this.Validate();
    if (errLst != '') {
      this._msgService.showCustomMesssage(errLst, MessageType.Warning)
      return;
    }
    else if (this.FilterAccessoryCmb != undefined && this.FilterAccessoryCmb.length == 0) {
      this._msgService.showMesssage("AccessoriesNotAttached", MessageType.Warning);
      return
    }

    const modal: IPRPL_ACCYInfo = {
      PROPOSALID: 0,
      ASSETID: 0,
      ACCESSORYCDE: '',
      FTNGTYPECDE: '',
      EXECUTIONDTE: null,
      ACCESSORYAMT: 0,
      UNITAMT: 0,
      QUANTITY: 0,
      BPSUPPLIERID: this.selectedDealerId,
      COMMENTS: '',
      AGE: 0,
      EXECUTIONOFFSET: 0,
      SESSIONID: 0,
      SESSIONCDE: '',
      CURRENCYCDE: '00001',
      ROLECDE: this.bpRolecde,
      VATAMT: 0,
      EXCLUSIVEAMT: 0,
      BPSUPPLIERNAME: this.selectedDealer,
      ISNEWACCESSORY: true,
      CurrencySymbol: '',
      RowState: DataRowState.Added,
      ISAUDITABLE: false
    };
    modal.FTNGTYPECDE = AccessoriesType.Optional;
    this.Accessories.push(modal);
    this.dataSource = new MatTableDataSource<any>(this.Accessories.filter(x => x.RowState != DataRowState.Removed));
    this.IsbtnCalculateEnable = true;
    this.isCalculated = false;
  }

  // checkDoubleAccessories(event:any,element:any,index:number){
  //   if(event!=undefined){
  //     var c=this.dataSource.data.filter(p=> p.ACCESSORYCDE===element.ACCESSORYCDE).length;
  //     if(this.dataSource.data.filter(p=> p.ACCESSORYCDE===element.ACCESSORYCDE).length!==1 ){
  //       var a=this.FilterAccessoryCmb.filter(p=> p.code===element.ACCESSORYCDE).map(ele=>{return ele.TextValue})[0];
  //       element.ACCESSORYCDE="00000";
  //       this._msgService.showCustomMesssage("\""+a+"\" is already selected",MessageType.Warning);
  //     }
  //   }
  // }

  getFilterValues(index: any): any {
    var selectedAccessories = this.dataSource.data.map(p => p.ACCESSORYCDE);
    return this.FilterAccessoryCmb.filter((p: any) => {
      if (!selectedAccessories.includes(p.code)) {
        return p;
      }
      else if (p.code == this.dataSource.data[index].ACCESSORYCDE) {
        return p;
      }
    })

  }
  Recalculate(element: any) {

    if (element.RowState != DataRowState.Added && element.RowState != DataRowState.Removed) {
      element.RowState = DataRowState.Updated;
    }
    element.ACCESSORYAMT = parseFloat('0' + element.UNITAMT) * parseFloat('0' + element.QUANTITY);
    if (this._ProposalDataService.PROPOSAL.value.FINANCETYP == FinanceType.OperatingLease)
      element.EXCLUSIVEAMT = parseFloat('0' + element.ACCESSORYAMT) - parseFloat('0' + element.VATAMT);
    else
      element.EXCLUSIVEAMT = 0;

    if (parseFloat('0' + element.VATAMT) > parseFloat('0' + element.ACCESSORYAMT)) {
      this._msgService.showMesssage("msgVATAmountValidation", MessageType.Warning)
      element.VATAMT = 0;
      element.EXCLUSIVEAMT = parseFloat('0' + element.ACCESSORYAMT);
    }
    if (element.VATAMT == "") {
      element.VATAMT = 0;
    }

    this.isCalculated = false;
    this.IsbtnCalculateEnable = true;
    this._calculationService.ResetRentalDetail();
  }

  Validate(): string {
    let missingfield = '';
    for (var i = 0; i < this.Accessories.length; i++) {
      if (this.Accessories[i].ACCESSORYCDE == '' || this.Accessories[i].ACCESSORYCDE == "00000" || this.Accessories[i].ACCESSORYCDE == null) {
        missingfield += "Accessory";
      }
      if (this.Accessories[i].BPSUPPLIERID == null || this.Accessories[i].BPSUPPLIERID == 0) {
        if (missingfield != '')
          missingfield += ", ";
        missingfield += "Supplier";
      }

      if (this.Accessories[i].QUANTITY <= 0) {
        if (missingfield != '')
          missingfield += ", ";
        missingfield += "Quantity";
      }

      if (missingfield != '') {
        if (missingfield.includes(",")) {
          missingfield = missingfield.substring(0, missingfield.lastIndexOf(",")) + " and " + missingfield.substring(missingfield.lastIndexOf(",") + 2);
        }
        missingfield = "Please provide " + missingfield + " at row " + (i + 1) + " of Optional Accessories.";
        break;
      }
    }
    return missingfield
  }
  openDealerSearch(index: any) {
    const dialogRef = this.dialog.open(DealerSupplierSearchComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "index": index },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.Accessories[result.ParentIndex].BPSUPPLIERID = result.BUSINESSPARTNERID;
        this.Accessories[result.ParentIndex].BPSUPPLIERNAME = result.BUSINESSPARTNERNME;
        this.Accessories[result.ParentIndex].ROLECDE = result.ROLECDE;
        this.dataSource = new MatTableDataSource<any>(this.Accessories.filter(x => x.RowState != DataRowState.Removed));
      }
    });
  }

  CalcualteTotal() {
    if (this.Accessories.filter(p => p.RowState != DataRowState.Removed).length > 0 && this.IsbtnCalculateEnable) {
      let missFields = this.Validate();
      if (missFields) {
        this._msgService.showCustomMesssage(missFields, MessageType.Warning);
        return;
      }
      else {
        this.GetTotalAccessory();
      }
      this._calculationService.ResetRentalDetail();
    }
    else if (this.Accessories.filter(p => p.RowState != DataRowState.Removed).length == 0) {
      this.TotalPrice = 0;
      this.isCalculated = true;
    }
    this.IsbtnCalculateEnable = false;
  }

  GetTotalAccessory() {
    this.TotalPrice = 0;
    this.Accessories.filter(p => p.RowState != DataRowState.Removed).forEach((accessory, index) => {
      accessory.ACCESSORYAMT = (accessory.UNITAMT * accessory.QUANTITY);
      this.TotalPrice += accessory.ACCESSORYAMT;
    });
    this.StandardAccessories.value.filter(p => p.RowState != DataRowState.Removed).forEach((accessory, index) => {
      accessory.ACCESSORYAMT = (accessory.UNITAMT * accessory.QUANTITY);
      this.TotalPrice += accessory.ACCESSORYAMT;
    });
    this.isCalculated = true;
  }

  CloseAndPostData() {
    if (this.isCalculated) {
      this.Accessories.forEach((accessory) => {
        this.OptionalAccessories.push(this.fb.group<IPRPL_ACCYInfo>(accessory));
      });
      if (this.TotalPrice == 0 && this.Accessories.filter(p => p.RowState !== DataRowState.Removed).length == 0) {
        this._ProposalDataService.PROPOSALFINANCIALAGREEMENT.controls.ACCESSORYAMT.setValue(this.TotalPrice);
        this._ProposalDataService.PROPOSALFINANCIALAGREEMENT.controls.ACCYWITHOUTVAT.setValue(this.TotalPrice);
        this._ProposalDataService.PROPOSALACCESSORY.clear();
      }
      this._calculationService.ResetRentalDetail();
      this.dialogRef.close({ OptionalAccessories: this.OptionalAccessories, TotalAmount: this.TotalPrice });
    }
    else if (this.IsbtnCalculateEnable) {
      this._msgService.showMesssage("msgCalculateAccessories", MessageType.Warning);
      return
    }
    else {
      this.dialogRef.close({ OptionalAccessories: null, TotalAmount: 0 });
    }
  }

  Close() {
    this.dialogRef.close({ OptionalAccessories: null, TotalAmount: 0 });
  }

  DeleteRow(Element: any, index: number) {
    // if (this.Accessories[index].RowState == DataRowState.Added) {
    //   this.Accessories.splice(index, 1);
    // }
    // else {
    //   this.Accessories[index].RowState = DataRowState.Removed
    // }
    if (Element.RowState == DataRowState.Added) {
      this.Accessories = this.Accessories.filter(p => p != Element);
    } else {
      Element.RowState = DataRowState.Removed;
    }
    this._proposaldataService.PROPOSALACCESSORY.controls.forEach((item, i) => {
      if (Element == item.value) {
        if (Element.RowState == DataRowState.Added)
          this._proposaldataService.PROPOSALACCESSORY.removeAt(
            i);
        else
          item.controls.RowState.setValue(DataRowState.Removed)
      }
    })
    this.dataSource = new MatTableDataSource<any>(this.Accessories.filter(x => x.RowState != DataRowState.Removed));
    this.IsbtnCalculateEnable = true;
    this.isCalculated = false;
    //console.log('delete accessory row :', index)
    this._calculationService.RemoveArticleComponent(
      AmountComponent.AccessoriesCost
    );
    let totalAccessoriesAmount = this._proposaldataService.PROPOSALACCESSORY.value.filter(x => x.RowState != DataRowState.Removed).reduce(function (tot, record) {
      return tot + record.ACCESSORYAMT;
    }, 0);
    this._calculationService.UpdateFinancialAgreementDetail(
      totalAccessoriesAmount,
      AmountComponent.AccessoriesCost,
      this._proposaldataService.PROPOSAL.controls.CURRENCYCDE.value,
      AssetComponentsFinancialConfiguration.Finance,
      null
    );

    this._calculationService.CalculateNFA();

  }


  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }
}
