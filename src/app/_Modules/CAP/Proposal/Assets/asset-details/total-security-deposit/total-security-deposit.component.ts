import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FinancialClubMasterDataService } from '@NFS_Core/NFSServices/MasterData/FinancialClub-master-data.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import {
  IPRPL_FINL_AGRMInfo
} from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import {
  IPRPL_ASETInfo
} from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/ProposalArticleEntity.model.index';
import { ICalculationInfoParam } from '@NFS_Interfaces/RequestInterfaces/ICalculationInfoParam';
import { CalculationService } from '@NFS_Modules/CAP/CAPServices/calculation.service';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalManagerService } from '@NFS_Modules/CAP/_helpers/proposal-manager.service';
import { FormGroup } from 'src/Library';
import { Subject } from 'rxjs';


@Component({
    selector: 'app-total-security-deposit',
    templateUrl: './total-security-deposit.component.html',
    styleUrls: ['./total-security-deposit.component.css'],
    standalone: false
})
export class TotalSecurityDepositComponent implements OnInit {
  @Input() ComponentName!: string;
  PROPOSALFINANCIALAGREEMENT!: FormGroup<IPRPL_FINL_AGRMInfo>;
  // PROPOSALASSET!: FormGroup<IPRPL_ASETInfo>;
  // CalculationParam = {} as ICalculationInfoParam;
  // private subscription$ = new Subject();
  constructor(
    public _proposaldataService: ProposalDataService,
    // public _masterDataService: MasterDataService,
    // public _proposalManagerService: ProposalManagerService,
    // public _calculationService: CalculationService,
    // public _financialClubMasterDataService: FinancialClubMasterDataService
  ) { }

  panelOpenState = false

  ngOnInit(): void {
    this.PROPOSALFINANCIALAGREEMENT =
    this._proposaldataService.PROPOSALFINANCIALAGREEMENT;
    // this.PROPOSALASSET = this._proposaldataService.PROPOSALASSET;
  }

  // ngOnDestroy(): void {
  //   this.subscription$.next(true);
  //   this.subscription$.complete();
  // }
}

