
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BankMasterDataService } from '@NFS_Core/NFSServices/MasterData/BankMaster-data.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { mPOSMasterDataRequest } from '@NFS_Core/NFSServices/MasterData/MasterdataHelper/mPOSMasterDataRequest';
import { IPRPL_APLT_BANKInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/ProposalApplicantEntity.model.index';
import { MasterData } from '@NFS_Enums/MasterData.enum';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { FormBuilder, FormGroup } from 'src/Library';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-sub-bank',
    templateUrl: './sub-bank.component.html',
    styleUrls: ['./sub-bank.component.css'],
    standalone: false
})
export class SubBankComponent implements OnInit, OnDestroy {
  @Input() Bank!: FormGroup<IPRPL_APLT_BANKInfo>;
  @Input() Index : number = 0;
  @Output() DefaultBank = new EventEmitter;
  @Input() ComponentName!: string;
  NullVal: number | string = '';
  public BankBranches: any = [];
  private subscription$ = new Subject();
  constructor(private _proposaldataService: ProposalDataService, public _bankMasterDataService: BankMasterDataService, private fb: FormBuilder, private _proposalForm: ProposalEntityFormService, private _masterDataService: MasterDataService) { }

  ngOnInit(): void {
    this.setBranchControl(this.Bank.controls.OTHERBRANCHIND.value);
    this.valueChangesSubscriptions();
  }

  valueChangesSubscriptions() {

    this.Bank.controls.BANKBPID.valueChanges.
      pipe(distinctUntilChanged(), takeUntil(this.subscription$)).
      subscribe(((val : any) => {
        this.Bank.controls.BANKNME.setValue(this?._bankMasterDataService?.Banks.find(a => a?.code == String(val))?.TextValue || '');

        let request = new mPOSMasterDataRequest();
        request.masterDataOperation = MasterData.BankBranches;

        if (val === this.NullVal) {
          this.Bank.controls.BANKBRANCHBPID.setValue(0);
          this.Bank.controls.BANKBPID.setValue(0);
        }

        request.DATAS.BankBpId = this.Bank.controls.BANKBPID?.value;
        if (request.DATAS.BankBpId > 0) {
          if (this._bankMasterDataService.BankBranches[request.DATAS.BankBpId] == undefined ||
            this._bankMasterDataService.BankBranches[request.DATAS.BankBpId].length == 0) {
            this._masterDataService.GetMasterData(request).pipe(takeUntil(this.subscription$)).subscribe((response) => {
              this.BankBranches = response?.ResultSet?.DataCollection;
              this._bankMasterDataService.BankBranches[request.DATAS.BankBpId] = this.BankBranches;
            });
          }
          else {
            this.BankBranches = this._bankMasterDataService.BankBranches[request.DATAS.BankBpId];
          }
        }
      }));

    this.Bank.controls.BANKBRANCHBPID.valueChanges.
      pipe(takeUntil(this.subscription$)).
      subscribe((branch => {
        var branchnames = this._bankMasterDataService.BankBranches[this.Bank.controls.BANKBPID.value];
        var branchname = branchnames?.find((x: any) => x.code == String(branch))?.TextValue || "";
        //.find((x:any) => x.code == String(branch))?.TextValue || ''
        this.Bank.controls.BRANCHNME.setValue(branchname);
      }));

    this.Bank.controls.OTHERBRANCHIND.valueChanges.
      pipe(takeUntil(this.subscription$)).
      subscribe((other => {
        this.setBranchControl(other);
      }))
  }

  setBranchControl(otherBranchInd: boolean) {
    if (otherBranchInd) {
      this.Bank.controls.BANKBRANCHBPID.disable()
      this.Bank.controls.BANKBRANCHBPID.setValue(0);
      this.Bank.controls.OTOOTHRBRANCHNME.enable();
    }
    else {
      this.Bank.controls.OTOOTHRBRANCHNME.disable();
      this.Bank.controls.OTOOTHRBRANCHNME.setValue('');
      this.Bank.controls.BANKBRANCHBPID.enable();
    }
  }

 /* accountVerifiedChange(event: any) {
    if (event != undefined) {
      if (event.checked) {
        this.Bank.controls.ACCOUNTVERIFICATIONINDOTO.setValue("True");
      }
      else {
        this.Bank.controls.ACCOUNTVERIFICATIONINDOTO.setValue("False");
      }
    }
  }*/

  getBank(event: any) {
    this.DefaultBank.emit(this.Bank.value);
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }
}

