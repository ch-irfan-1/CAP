import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { BankMasterDataService } from '@NFS_Core/NFSServices/MasterData/BankMaster-data.service';
import { StateManagment } from '@NFS_Core/RowStateManagement/FormStateManagement';
import { IPRPL_APLT_BANKInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/ProposalApplicantEntity.model.index';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { FormArray, FormGroup } from 'src/Library';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatTabGroup } from '@angular/material/tabs';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';

@Component({
    selector: 'app-bank',
    templateUrl: './bank.component.html',
    styleUrls: ['./bank.component.css'],
    standalone: false
})
export class BankComponent implements OnInit, OnDestroy {
  @Input() Banks!: FormArray<IPRPL_APLT_BANKInfo>;
  @Input() ComponentName!: string;
  @ViewChild("tabRef", { static: false }) tabGroup!: MatTabGroup;
  NullVal: number | string = '';
  dataRowState = DataRowState;
  selectedInd!:number;
  private subscription$ = new Subject();

  constructor(private _formModeService: FormModeService, public _bankMasterDataService: BankMasterDataService,
    private _proposalForm: ProposalEntityFormService, private _FormState: StateManagment, private _messageService: MessageService) { }

  getComponentName() {
    return this.ComponentName + "-Bank"
  }

  get isViewMode() {
    return this._formModeService.FormMode === FormMode.VIEW;
  }

  ngOnInit(): void {
    this.selectedInd=0;
    this.setIndex(true);
    this._bankMasterDataService.getmasterDataForBanks().pipe(takeUntil(this.subscription$)).subscribe(data => {
      this._bankMasterDataService.Banks = data?.Banks?.ResultSet?.DataCollection;
      this._bankMasterDataService.BankBranches = data?.BankBranches?.ResultSet?.DataCollection;
      this._bankMasterDataService.AccounTypes = data?.AccounTypes?.ResultSet?.DataCollection;
      this._bankMasterDataService.CurrencyType = data?.CurrencyType?.ResultSet?.DataCollection;
    });
  }

  tabSelectionChange(index:any)
  {
    if(index!=undefined){
      if(this.selectedInd<0){
        this.selectedInd=0;
      }
      if(index===this.Banks.value.filter(p=>p.RowState!=DataRowState.Removed).length && index>0){
        this.selectedInd=this.Banks.value.filter(p=>p.RowState!=DataRowState.Removed).length-1;
      }
      else{
        this.selectedInd=index;
      }
    }
  } 

  AddBank() {
    let bank: FormGroup<IPRPL_APLT_BANKInfo> = this._proposalForm.ProposalBankComponentForm();
    bank.controls.NEWDATAIND.setValue(true);
    const max = this.Banks.value.reduce((op, item) => op = op > item.BANKID ? op : item.BANKID, 0);
    bank.controls.BANKID.setValue(max + 1);
    this.Banks.push(bank);
    window.setTimeout(() => {
      this.selectedInd = this.Banks.value.filter(obj => obj.RowState !== DataRowState.Removed).length - 1;
      this.tabGroup.selectedIndex = this.selectedInd;
    });
    bank.controls.VLDMSGIND.setValue(this.Banks.value.length-1);
    this.setIndex();
  }

  defaultBankChange(event: any) {
    const index: number = this.Banks.value.indexOf(event);
    this.Banks.controls.forEach((bank, i) => {
      if (index != i) {
        bank.controls.OTODEFAULTIND.setValue(false);
      }
    })
  }

  removeBank(object: any, bankIndex: number) {
    const index: number = this.Banks.value.indexOf(object.value);
	var i:number=this.Banks.value.filter(p=>p.RowState!=DataRowState.Removed).indexOf(object.value);
    if (this.Banks.controls[index].controls.RowState.value == DataRowState.Added) {
      this.Banks.removeAt(index);
      this._messageService.ClearValidatorMessages('-Bank-' + (object.value.VLDMSGIND + 1));
    }
    else {
      this._FormState.ResetFormState(this.Banks.controls[index], DataRowState.Removed);
      this._messageService.ClearValidatorMessages('-Bank-' + (object.value.VLDMSGIND + 1));

    }
    if (this.selectedInd > 0 && (this.selectedInd == i || this.selectedInd > i)) {
      window.setTimeout(() => {
        this.selectedInd = this.selectedInd - 1;
        this.tabGroup.selectedIndex = this.selectedInd;
      });
    }
    this.setIndex();
  }
  setIndex(isLoadPage: boolean = false) {
    let index = 0;
    this.Banks.controls.filter(x => x.value.RowState != 4).forEach((member) => {
      member.controls.INDEX.setValue(index);
      index++;
    })
    // index = 0;
    // if (isLoadPage) {
    //   this.Banks.controls.forEach((member) => {
    //     member.controls.VLDMSGIND.setValue(index);
    //     index++;
    //   })
    // }
  }

  getIndex(Banks: FormGroup<IPRPL_APLT_BANKInfo>): number {
    return Banks.value.INDEX;
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }
}
